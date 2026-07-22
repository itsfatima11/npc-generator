import type { NPCStatBlock } from '../../types';
const key=(npcId:string)=>`smart-npc-stat-block-v1:${npcId}`;
export function readStoredStatBlock(npcId:string):NPCStatBlock|null{try{const value=localStorage.getItem(key(npcId));return value?JSON.parse(value) as NPCStatBlock:null}catch{return null}}
export function writeStoredStatBlock(block:NPCStatBlock):void{localStorage.setItem(key(block.npcId),JSON.stringify(block));}
