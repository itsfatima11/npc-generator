import type { QuestMemory } from '../../types';
const key=(campaignId:string)=>`smart-npc-quests-v1:${campaignId}`;
export function emptyQuestMemory(campaignId:string):QuestMemory{return{campaignId,quests:[],chains:[],history:[]};}
export function readQuestMemory(campaignId:string):QuestMemory{try{const source=localStorage.getItem(key(campaignId));return source?JSON.parse(source) as QuestMemory:emptyQuestMemory(campaignId);}catch{return emptyQuestMemory(campaignId)}}
export function writeQuestMemory(memory:QuestMemory):void{localStorage.setItem(key(memory.campaignId),JSON.stringify(memory));}
