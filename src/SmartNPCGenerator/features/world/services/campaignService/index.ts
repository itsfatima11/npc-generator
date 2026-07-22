import type { Campaign,CampaignInput,World } from '../../types';

const KEY='smart-npc-campaign-worlds-v1';
export interface CampaignWorldRecord {readonly campaign:Campaign;readonly world:World|null}
export interface CampaignStorage {load():readonly CampaignWorldRecord[];save(records:readonly CampaignWorldRecord[]):void}
export class LocalCampaignStorage implements CampaignStorage {
  load():readonly CampaignWorldRecord[]{try{const value=localStorage.getItem(KEY);return value?JSON.parse(value) as readonly CampaignWorldRecord[]:[];}catch{return[];}}
  save(records:readonly CampaignWorldRecord[]):void{localStorage.setItem(KEY,JSON.stringify(records));}
}
export function loadCampaignWorld(campaignId:string,storage:CampaignStorage=new LocalCampaignStorage()):CampaignWorldRecord|null{return storage.load().find(record=>record.campaign.id===campaignId)??null;}
export function saveCampaignWorld(record:CampaignWorldRecord,storage:CampaignStorage=new LocalCampaignStorage()):void{storage.save([...storage.load().filter(item=>item.campaign.id!==record.campaign.id),record]);}
export function createCampaign(input:CampaignInput,now=new Date().toISOString()):Campaign{const name=input.name.trim();if(!name)throw new Error('Campaign name is required.');return{id:crypto.randomUUID(),name,description:input.description.trim(),setting:input.setting.trim(),createdAt:now,updatedAt:now,status:input.status??'planning',tags:input.tags??[],npcIds:[],cityIds:[],factionIds:[],timeline:[],notes:input.notes?.trim()??''};}
export function updateCampaign(campaign:Campaign,patch:Partial<Omit<Campaign,'id'|'createdAt'>>,now=new Date().toISOString()):Campaign{return{...campaign,...patch,id:campaign.id,createdAt:campaign.createdAt,updatedAt:now};}
export function connectNpc(campaign:Campaign,npcId:string):Campaign{return campaign.npcIds.includes(npcId)?campaign:updateCampaign(campaign,{npcIds:[...campaign.npcIds,npcId]});}
export function disconnectNpc(campaign:Campaign,npcId:string):Campaign{return updateCampaign(campaign,{npcIds:campaign.npcIds.filter(id=>id!==npcId)});}
