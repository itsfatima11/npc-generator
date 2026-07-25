import type { NPC } from '../types';import type { SectionKey } from '../ui/types';
export interface GeneratorCardProps{readonly npc:NPC|null;readonly locked:boolean;readonly onLock:()=>void;readonly onRegenerate:(field?:string,index?:number)=>void;readonly section:SectionKey}
