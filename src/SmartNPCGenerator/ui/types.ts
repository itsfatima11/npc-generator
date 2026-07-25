import type { Alignment,Gender,SocialStatus,Wealth } from '../types';
export type SectionKey='general'|'appearance'|'personality'|'occupation'|'backstory'|'goal'|'relationships'|'secret'|'hooks';
export type Locks=Readonly<Record<SectionKey,boolean>>;
export interface GenerationFilters{readonly raceId:string;readonly alignment:Alignment|null;readonly occupationId:string;readonly minimumAge:number|null;readonly maximumAge:number|null;readonly religionId:string;readonly gender:Gender|null;readonly wealth:Wealth|null;readonly socialStatus:SocialStatus|null}
