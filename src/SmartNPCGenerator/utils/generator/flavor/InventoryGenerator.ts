import { pickMany } from '../deterministic';
import { BASE_ITEMS,OCCUPATION_EQUIPMENT } from './catalog';
import type { FlavorContext,Inventory,InventoryItem } from './types';

function item(name:string,description:string,reason:string):InventoryItem{return{name,description,reason};}
function inventory(items:readonly InventoryItem[]):Inventory{
  if(items.length!==10)throw new Error(`Flavor inventory requires exactly 10 items; received ${items.length}.`);
  return[items[0],items[1],items[2],items[3],items[4],items[5],items[6],items[7],items[8],items[9]];
}
export const InventoryGenerator={generate(c:FlavorContext):Inventory{
  const equipment=OCCUPATION_EQUIPMENT[c.occupationCategory]??[`${c.npc.occupation.title} tools`,'work ledger','protective workwear'];
  const work=equipment.slice(0,3).map(name=>item(name[0].toUpperCase()+name.slice(1),`A ${c.isWealthy?'fine':'serviceable'} example suited to ${c.npc.occupation.title.toLowerCase()} work.`,`Needed for duties at ${c.npc.occupation.workplace}.`));
  while(work.length<3)work.push(item('Professional supply',`A serviceable supply suited to ${c.npc.occupation.title.toLowerCase()} work.`,`Needed for duties at ${c.npc.occupation.workplace}.`));
  const contextual=[...BASE_ITEMS,item('Cultural token',`A small object bearing motifs associated with ${c.npc.subrace??c.npc.race} tradition.`,'Carries a visible link to ancestry and upbringing.'),item('Appropriate clothing',c.npc.appearance.clothingStyle,'Supports the NPC’s work, status, and public reputation.'),item('Correspondence',`A folded message concerning ${c.npc.goal.currentGoal}.`,'Provides a current lead toward the NPC’s goal.'),...(c.npc.religion?[item('Devotional token',`A modest symbol associated with ${c.npc.religion}.`,'Used for routine private observance.')]:[])];
  const occupied=new Set(work.map(value=>value.name.toLowerCase()));
  const uniqueContextual=contextual.filter(value=>{const key=value.name.toLowerCase();if(occupied.has(key))return false;occupied.add(key);return true;});
  return inventory([...work,...pickMany(uniqueContextual,7,c.seed,'flavor.inventory',c.attempt)]);
}} as const;
