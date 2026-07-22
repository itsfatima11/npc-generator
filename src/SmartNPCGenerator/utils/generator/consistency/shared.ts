import { ALIGNMENTS,LANGUAGES,OCCUPATIONS,RACES,RELIGIONS,SUBRACES } from '../../../constants';import { Alignment,HeightUnit,WeightUnit,Wealth } from '../../../types';import type { NPC } from '../../../types';import type { ConsistencySection,RealismIssue,ScoreCategory } from './types';
export function problem(section:ConsistencySection,category:ScoreCategory,code:string,message:string,penalty=8,severity:RealismIssue['severity']='error'):RealismIssue{return {section,category,code,message,penalty,severity};}
export function normalize(value:string):string{return value.toLowerCase().replace(/[^a-z0-9]+/g,' ').trim();}
export function contains(text:string,value:string|null|undefined):boolean{return !value||normalize(text).includes(normalize(value));}
export function allText(values:readonly (string|null|undefined)[]):string{return values.filter((value):value is string=>Boolean(value)).join(' ');}
export function ancestry(npc:NPC){return SUBRACES.find(item=>item.name===npc.subrace)??RACES.find(item=>item.name===npc.race)??null;}
export function occupation(npc:NPC){return OCCUPATIONS.find(item=>item.title===npc.occupation.title)??null;}
export function religion(npc:NPC){return RELIGIONS.find(item=>item.name===npc.religion)??null;}
export function alignment(){return ALIGNMENTS;}
export function heightInches(npc:NPC):number{return npc.height.unit===HeightUnit.Foot?npc.height.value*12:npc.height.value/2.54;}
export function weightPounds(npc:NPC):number{return npc.weight.unit===WeightUnit.Pound?npc.weight.value:npc.weight.value*2.20462;}
export function wealthRank(value:Wealth):number{return [Wealth.Destitute,Wealth.Poor,Wealth.Modest,Wealth.Comfortable,Wealth.Wealthy,Wealth.Rich,Wealth.VeryRich,Wealth.Opulent].indexOf(value);}
export function opposed(left:Alignment,right:Alignment):boolean{const good=[Alignment.LawfulGood,Alignment.NeutralGood,Alignment.ChaoticGood];const evil=[Alignment.LawfulEvil,Alignment.NeutralEvil,Alignment.ChaoticEvil];return (good.includes(left)&&evil.includes(right))||(evil.includes(left)&&good.includes(right));}
export function knownLanguage(name:string):boolean{return LANGUAGES.some(value=>value.name===name);}
