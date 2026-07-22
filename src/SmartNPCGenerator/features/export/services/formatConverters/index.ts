import type { NPCStatBlock } from '../../../statBlock';
import type { ExportConverter,ExportOptions,ExportPayload } from '../../types';
import { escapeHTML,paragraphs,section,standaloneHTML } from '../templateRenderer';

const pretty=(value:unknown)=>JSON.stringify(value,null,2);
const text=(value:unknown)=>typeof value==='string'?value:pretty(value);
const entries=(value:object):readonly (readonly [string,unknown])[]=>Object.entries(value);

function markdown(payload:ExportPayload):string{
  const i=payload.identity,goal=payload.goal;
  return[
    `# ${i.name}`,'','## Basic Information',
    `- Race: ${i.race}${i.subrace?` (${i.subrace})`:''}`,`- Age: ${i.age}`,
    `- Occupation: ${i.occupation}`,`- Alignment: ${i.alignment}`,`- Religion: ${i.religion??'None'}`,
    '','## Appearance',...entries(payload.appearance).map(([key,value])=>`- ${key}: ${Array.isArray(value)?value.join(', '):String(value??'')}`),
    '','## Personality',...entries(payload.personality).map(([key,value])=>`- ${key}: ${Array.isArray(value)?value.join(', '):String(value??'')}`),
    '','## Background',...payload.backstory.map(value=>`- ${value}`),
    '','## Goals',goal?`- Current goal: ${goal.currentGoal}`:'Player-safe goal details omitted.',goal?.motivation?`- Motivation: ${goal.motivation}`:'',goal?.obstacle?`- Obstacle: ${goal.obstacle}`:'',
    '','## Relationships',payload.relationships?text(payload.relationships):'Private relationship details omitted.',
    '','## Secrets',payload.secret?text(payload.secret):'Private information omitted.',
    '','## Inventory',payload.inventory?payload.inventory.entries.map(entry=>`- ${entry.item.name} ×${entry.quantity}: ${entry.item.description}`).join('\n'):'No canonical inventory saved.',
    '','## Combat Stats',payload.statBlock?statMarkdown(payload.statBlock):'No saved stat block.',
    '','## Adventure Hooks',...payload.adventureHooks.map(value=>`- ${value}`),
  ].filter(value=>value!=='').join('\n');
}
function statMarkdown(block:NPCStatBlock):string{return[`- AC ${block.armorClass}; HP ${block.hitPoints}; Speed ${block.speed.walk} ft.`,`- CR ${block.challengeRating} (${block.experiencePoints} XP)`,`- ${Object.values(block.abilityScores).map(score=>`${score.ability.slice(0,3).toUpperCase()} ${score.score}`).join('; ')}`,...block.actions.map(action=>`- ${action.name}: ${action.description}`)].join('\n');}
function htmlBody(payload:ExportPayload):string{const i=payload.identity;return`<h1>${escapeHTML(String(i.name))}</h1><p><em>${escapeHTML(`${i.race}, ${i.occupation}, ${String(i.alignment).replaceAll('-',' ')}`)}</em></p>${section('Character Summary',`<dl>${Object.entries(i).map(([key,value])=>`<dt>${escapeHTML(key)}</dt><dd>${escapeHTML(String(value??''))}</dd>`).join('')}</dl>`)}${section('Appearance',`<pre>${escapeHTML(pretty(payload.appearance))}</pre>`)}${section('Personality',`<pre>${escapeHTML(pretty(payload.personality))}</pre>`)}${section('Backstory',paragraphs(payload.backstory))}${section('Goals',`<pre>${escapeHTML(pretty(payload.goal))}</pre>`)}${section('Inventory',`<pre>${escapeHTML(pretty(payload.inventory))}</pre>`)}${section('Stat Block',`<pre>${escapeHTML(pretty(payload.statBlock))}</pre>`)}${section('DM Notes',payload.privateNotes?`<p>${escapeHTML(payload.privateNotes)}</p>`:'<p>Omitted.</p>')}${section('Adventure Hooks',paragraphs(payload.adventureHooks))}`;}
function foundry(payload:ExportPayload):string{const stat=payload.statBlock;return pretty({name:payload.identity.name,type:'npc',img:payload.portraitDataUrl??undefined,system:{details:{biography:{value:markdown(payload)},alignment:payload.identity.alignment,cr:stat?.challengeRating},attributes:{ac:{value:stat?.armorClass??10},hp:{value:stat?.hitPoints??1,max:stat?.hitPoints??1},movement:stat?.speed},abilities:stat?.abilityScores,skills:stat?.skills},items:[...(payload.inventory?.entries.map(entry=>({name:entry.item.name,type:entry.item.type,system:{description:{value:entry.item.description},quantity:entry.quantity,weight:entry.item.weight,price:entry.item.value}}))??[]),...(stat?.actions.map(action=>({name:action.name,type:'feat',system:{description:{value:action.description},activation:{type:'action'}}}))??[])],prototypeToken:{name:payload.identity.name,texture:{src:payload.portraitDataUrl??''},displayName:20}});}
function roll20(payload:ExportPayload):string{const stat=payload.statBlock,abilities=stat?Object.values(stat.abilityScores).map(score=>({name:score.ability,current:score.score})):[];return pretty({schema:'roll20-npc-character-v1',name:payload.identity.name,bio:markdown(payload),gmnotes:payload.privateNotes??'',avatar:payload.portraitDataUrl,attributes:[{name:'npc_ac',current:stat?.armorClass??10},{name:'hp',current:stat?.hitPoints??1,max:stat?.hitPoints??1},{name:'npc_challenge',current:stat?.challengeRating??'0'},...abilities],abilities:stat?.actions.map(action=>({name:action.name,description:action.description,tokenAction:true}))??[]});}
function genericVTT(payload:ExportPayload):string{const stat=payload.statBlock;return pretty({format:'generic-vtt-npc',version:1,name:payload.identity.name,token:payload.portraitDataUrl,stats:stat?{armorClass:stat.armorClass,hitPoints:stat.hitPoints,speed:stat.speed,abilities:stat.abilityScores,challengeRating:stat.challengeRating}:null,actions:stat?.actions??[],skills:stat?.skills??[],inventory:payload.inventory?.entries??[],description:markdown(payload)});}
function dndBeyondStyle(payload:ExportPayload):string{return[`D&D 5e NPC Reference — ${payload.identity.name}`,'This is a readable reference layout, not an official D&D Beyond import file.','',markdown(payload)].join('\n');}

export const converters:Readonly<Record<ExportOptions['format'],ExportConverter>>={
  json:{format:'json',convert:payload=>pretty(payload)},markdown:{format:'markdown',convert:payload=>markdown(payload)},
  pdf:{format:'pdf',convert:(payload,options)=>standaloneHTML(String(payload.identity.name),htmlBody(payload),options.pageSize,payload.portraitDataUrl)},
  html:{format:'html',convert:(payload,options)=>standaloneHTML(String(payload.identity.name),htmlBody(payload),options.pageSize,payload.portraitDataUrl)},
  'dnd-beyond-style':{format:'dnd-beyond-style',convert:payload=>dndBeyondStyle(payload)},
  'foundry-vtt':{format:'foundry-vtt',convert:payload=>foundry(payload)},roll20:{format:'roll20',convert:payload=>roll20(payload)},
  'generic-vtt':{format:'generic-vtt',convert:payload=>genericVTT(payload)},
};
