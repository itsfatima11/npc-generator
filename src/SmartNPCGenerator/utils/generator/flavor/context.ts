import { OCCUPATIONS } from '../../../constants';
import type { NPC } from '../../../types';
import { Alignment,Wealth } from '../../../types';
import type { FlavorContext } from './types';

const good=new Set<Alignment>([Alignment.LawfulGood,Alignment.NeutralGood,Alignment.ChaoticGood]);
const evil=new Set<Alignment>([Alignment.LawfulEvil,Alignment.NeutralEvil,Alignment.ChaoticEvil]);
const lawful=new Set<Alignment>([Alignment.LawfulGood,Alignment.LawfulNeutral,Alignment.LawfulEvil]);
const rich=new Set<Wealth>([Wealth.Wealthy,Wealth.Rich,Wealth.VeryRich,Wealth.Opulent]);
const poor=new Set<Wealth>([Wealth.Destitute,Wealth.Poor]);
export function createFlavorContext(npc:NPC,seed:string,attempt=0):FlavorContext{return {npc,seed,attempt,occupationCategory:OCCUPATIONS.find(item=>item.title===npc.occupation.title)?.category??'general',isGood:good.has(npc.alignment),isEvil:evil.has(npc.alignment),isLawful:lawful.has(npc.alignment),isReligious:Boolean(npc.religion),isWealthy:rich.has(npc.wealth),isPoor:poor.has(npc.wealth)};}
export function words(value:string):string{return value.replace(/-/g,' ');}
export function first<T>(values:readonly T[],fallback:T):T{return values[0]??fallback;}
export function relationshipName(npc:NPC):string{return npc.relationships.ally?.person.name??npc.relationships.bestFriend?.person.name??npc.relationships.rival?.person.name??'a trusted associate';}
