export type CampaignStatus='planning'|'active'|'paused'|'completed'|'archived';
export type WorldEventKind='npc-backstory'|'war'|'political'|'religious'|'disaster'|'discovery'|'personal'|'economic';
export type EventImportance='local'|'regional'|'major'|'world-changing';
export interface TimelineEvent {readonly id:string;readonly date:string;readonly locationId:string|null;readonly participantIds:readonly string[];readonly description:string;readonly importance:EventImportance;readonly consequences:readonly string[];readonly kind:WorldEventKind}
export interface Campaign {readonly id:string;readonly name:string;readonly description:string;readonly setting:string;readonly createdAt:string;readonly updatedAt:string;readonly status:CampaignStatus;readonly tags:readonly string[];readonly npcIds:readonly string[];readonly cityIds:readonly string[];readonly factionIds:readonly string[];readonly timeline:readonly TimelineEvent[];readonly notes:string}
export interface CampaignInput {readonly name:string;readonly description:string;readonly setting:string;readonly status?:CampaignStatus;readonly tags?:readonly string[];readonly notes?:string}
