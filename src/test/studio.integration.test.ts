import { describe,expect,it } from 'vitest';
import { SmartGenerationEngine,FlavorEngine } from '../SmartNPCGenerator/utils/generator';
import { LocalNPCRepository } from '../SmartNPCGenerator/services/npcRepository';
import { LocalStorageProvider } from '../SmartNPCGenerator/storage';
import { exportNPC } from '../SmartNPCGenerator/features/export/services/exportEngine';
import { ConversationEngine } from '../SmartNPCGenerator/features/aiDialogue/services/conversationEngine';
import { MemoryManager } from '../SmartNPCGenerator/features/aiDialogue/services/memoryManager';
import { generateQuest } from '../SmartNPCGenerator/features/questGenerator/services/questEngine';
import type { Campaign,World } from '../SmartNPCGenerator/features/world';

const generate=()=>SmartGenerationEngine.generate({seed:'production-regression-2026'});

describe('Smart NPC Studio integration',()=>{
  it('generates deterministic, validated and connected NPC data',()=>{
    const first=generate(),second=generate();
    expect(first.npc).toEqual(second.npc);
    expect(first.validation.valid).toBe(true);
    expect(first.npc.backstory).toHaveLength(10);
    expect(first.npc.adventureHooks).toHaveLength(3);
    expect(first.npc.languages.length).toBeGreaterThan(0);
  });

  it('enriches the generated NPC with validated flavor data',()=>{
    const {npc}=generate(),result=FlavorEngine.enrich(npc,{seed:'flavor-regression-2026'});
    expect(result.validation.valid).toBe(true);
    expect(result.flavor.mannerisms).toHaveLength(5);
    expect(result.flavor.inventory).toHaveLength(10);
    expect(result.flavor.portraitPrompt.prompt).toContain(npc.race);
  });

  it('persists edits, versions, queries, favorites and deletion',async()=>{
    const repository=new LocalNPCRepository(new LocalStorageProvider(localStorage));
    await repository.initialize();
    const {npc}=generate(),created=await repository.create({npc,author:'QA'});
    const renamed=await repository.rename(created.id,`${npc.name} Revised`);
    await repository.setFavorite(created.id,true);
    const loaded=await repository.get(created.id),versions=await repository.versions(created.id);
    const page=await repository.query({search:'Revised',sort:'recently-modified',page:1,pageSize:10});
    expect(loaded?.npc.name).toBe(renamed.npc.name);
    expect(loaded?.metadata.favorite).toBe(true);
    expect(versions.length).toBeGreaterThanOrEqual(3);
    expect(page.items).toHaveLength(1);
    await repository.delete(created.id);
    expect(await repository.get(created.id)).toBeNull();
  });

  it('filters private DM information from player exports',async()=>{
    const repository=new LocalNPCRepository(new LocalStorageProvider(localStorage));
    await repository.initialize();
    const {npc}=generate(),flavor=FlavorEngine.enrich(npc,{seed:'export-flavor'}).flavor;
    const record=await repository.create({npc,flavor,author:'QA',notes:'DM-only note'});
    const source={record,inventory:null,statBlock:null,worlds:[],portrait:null,portraitDataUrl:null} as const;
    const dm=exportNPC(source,{format:'json',audience:'dm',includePortrait:false,includeWorldConnections:false,pageSize:'a4'},()=> 'dm-export','2026-01-01T00:00:00.000Z');
    const player=exportNPC(source,{format:'json',audience:'player',includePortrait:false,includeWorldConnections:false,pageSize:'a4'},()=> 'player-export','2026-01-01T00:00:00.000Z');
    expect(dm.document?.content).toContain(npc.secret.description);
    expect(player.document?.content).not.toContain(npc.secret.description);
    expect(player.document?.content).not.toContain('DM-only note');
  });

  it('builds quests from NPC goals and world context',()=>{
    const {npc}=generate(),now='2026-01-01T00:00:00.000Z';
    const campaign:Campaign={id:'campaign-1',name:'Regression Campaign',description:'Connected campaign',setting:'Forgotten Realms',createdAt:now,updatedAt:now,status:'active',tags:[],npcIds:[npc.id],cityIds:['city-1'],factionIds:[],timeline:[],notes:''};
    const world:World={id:'world-1',name:'Regression World',description:'Connected world',era:'Present',theme:'Adventure',regions:[],cities:[{id:'city-1',name:npc.residence,regionId:null,coordinates:null,environment:'temperate settlement',connectedLocationIds:[],population:4000,raceDistribution:[{race:npc.race,percentage:100}],government:'council',leaderNpcId:npc.id,economy:['trade'],dangerLevel:2,religionIds:npc.religion?[npc.religion]:[],importantLocations:[],npcIds:[npc.id],history:['A recent dispute threatens local stability.']}],kingdoms:[],factions:[],guilds:[],religions:npc.religion?[npc.religion]:[],history:[],relationships:[],familyLinks:[],routes:[]};
    let sequence=0;
    const result=generateQuest({source:{kind:'npc',id:npc.id},difficulty:'medium',campaign,world,npcs:[npc],idFactory:()=>`quest-id-${sequence+=1}`,now});
    expect(result.quest).not.toBeNull();
    expect(result.quest?.relatedNPCs).toContain(npc.id);
    expect(result.quest?.description).toContain(npc.goal.currentGoal);
    expect(result.issues.filter(issue=>issue.severity==='error')).toHaveLength(0);
  });

  it('uses NPC context, protects secrets and persists relationship memory',async()=>{
    const {npc}=generate(),flavor=FlavorEngine.enrich(npc,{seed:'dialogue-flavor'}).flavor;
    const memory=new MemoryManager(new LocalStorageProvider(localStorage)),engine=new ConversationEngine(memory);
    const initial=engine.create(npc.id);
    const result=await engine.respond({npc,flavor},initial,{content:'Tell me your secret.',settings:{action:'ask-question',outcome:'none',mode:'player',includeStageDirections:false,storyEvents:[]}});
    expect(result.response.message.content).not.toContain(npc.secret.description);
    const helped=await engine.respond({npc,flavor},result.conversation,{content:'I promise I will help you.',settings:{action:'help',outcome:'success',mode:'player',includeStageDirections:false,storyEvents:[]}});
    expect(helped.conversation.relationshipLevel).toBeGreaterThan(initial.relationshipLevel);
    expect(helped.conversation.memory.playerPromises).toHaveLength(1);
    expect((await memory.load(npc.id))?.id).toBe(initial.id);
  });
});
