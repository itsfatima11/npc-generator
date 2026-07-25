import { useMemo,useState } from 'react';
import type { NPC } from '../../../../types';
import { InventoryPanel } from '../../../items';
import { QuestGeneratorPanel,readQuestMemory } from '../../../questGenerator';
import { StatBlockViewer } from '../../../statBlock';
import { validateFamilyTree,validateRelationships,validateTimeline,validateWorld } from '../../services';
import type { Campaign,World,WorldSearchResult } from '../../types';
import { CityManager } from '../CityManager';import { FactionManager } from '../FactionManager';import { FamilyTree } from '../FamilyTree';import { GuildManager } from '../GuildManager';import { KingdomManager } from '../KingdomManager';import { RelationshipGraph } from '../RelationshipGraph';import { TimelineViewer } from '../TimelineViewer';import { WorldOverview } from '../WorldOverview';

type Tab='overview'|'cities'|'factions'|'guilds'|'kingdoms'|'relationships'|'family'|'timeline'|'quests'|'items'|'stat-block';
interface Props {readonly initialWorld:World;readonly campaign:Campaign;readonly npcs:readonly NPC[];readonly onClose:()=>void;readonly onWorldChange?:(world:World)=>void}
const tabs:readonly Tab[]=['overview','cities','factions','guilds','kingdoms','relationships','family','timeline','quests','items','stat-block'];

export function CampaignDashboard({initialWorld,campaign,npcs,onClose,onWorldChange}:Props){
  const [world,setWorld]=useState(initialWorld),[tab,setTab]=useState<Tab>('overview'),[query,setQuery]=useState('');
  const update=(next:World)=>{setWorld(next);onWorldChange?.(next)},props={world,campaign,npcs};
  const issues=useMemo(()=>[...validateWorld(world,npcs),...validateRelationships(world.relationships,npcs),...validateFamilyTree(world.familyLinks,npcs),...validateTimeline(campaign.timeline,npcs)],[world,campaign,npcs]);
  const results=useMemo<readonly WorldSearchResult[]>(()=>{const q=query.trim().toLowerCase();if(!q)return[];return[
    ...npcs.filter(n=>[n.name,n.race,n.occupation.title].some(v=>v.toLowerCase().includes(q))).map(n=>({kind:'npc' as const,id:n.id,title:n.name,detail:`${n.race} · ${n.occupation.title}`})),
    ...world.cities.filter(c=>[c.name,c.environment,...c.economy].some(v=>v.toLowerCase().includes(q))).map(c=>({kind:'city' as const,id:c.id,title:c.name,detail:c.environment})),
    ...world.factions.filter(f=>[f.name,f.type,...f.goals].some(v=>v.toLowerCase().includes(q))).map(f=>({kind:'faction' as const,id:f.id,title:f.name,detail:f.type})),
    ...campaign.timeline.filter(e=>e.description.toLowerCase().includes(q)).map(e=>({kind:'event' as const,id:e.id,title:e.description,detail:e.date})),
  ].slice(0,30)},[query,npcs,world,campaign]);
  const openResult=(result:WorldSearchResult)=>{setTab(result.kind==='city'?'cities':result.kind==='faction'?'factions':result.kind==='event'?'timeline':'overview');setQuery('')};
  return <div className="world-overlay" role="dialog" aria-modal="true" aria-labelledby="world-title"><section className="campaign-dashboard"><header><div><span className="eyebrow">Campaign world</span><h2 id="world-title">{campaign.name}</h2><p>{world.name} · {campaign.setting}</p></div><label>Search world<input type="search" value={query} onChange={e=>setQuery(e.target.value)} placeholder="NPCs, cities, factions, events"/></label><button onClick={onClose}>Close</button></header>
    {query&&<div className="world-search-results">{results.length?results.map(result=><button key={`${result.kind}-${result.id}`} onClick={()=>openResult(result)}><strong>{result.title}</strong><span>{result.kind} · {result.detail}</span></button>):<p>No matching world records.</p>}</div>}
    <nav className="world-tabs" aria-label="World sections">{tabs.map(value=><button className={tab===value?'active':''} onClick={()=>setTab(value)} key={value}>{value}</button>)}</nav>
    {issues.length>0&&<details className="world-issues"><summary>{issues.length} consistency notice{issues.length===1?'':'s'}</summary>{issues.map((issue,index)=><p key={`${issue.code}-${index}`}>{issue.message}</p>)}</details>}
    <main className={tab==='quests'||tab==='items'||tab==='stat-block'?'world-main--quests':''}>{tab==='overview'&&<WorldOverview {...props}/>} {tab==='cities'&&<CityManager {...props} onAdd={city=>update({...world,cities:[...world.cities,city]})}/>} {tab==='factions'&&<FactionManager {...props}/>} {tab==='guilds'&&<GuildManager {...props}/>} {tab==='kingdoms'&&<KingdomManager {...props}/>} {tab==='relationships'&&<RelationshipGraph {...props}/>} {tab==='family'&&<FamilyTree {...props}/>} {tab==='timeline'&&<TimelineViewer {...props}/>} {tab==='quests'&&<QuestGeneratorPanel campaign={campaign} world={world} npcs={npcs}/>} {tab==='items'&&<InventoryPanel world={world} npcs={npcs} quests={readQuestMemory(campaign.id).quests}/>} {tab==='stat-block'&&<StatBlockViewer npcs={npcs}/>}</main>
  </section></div>;
}
