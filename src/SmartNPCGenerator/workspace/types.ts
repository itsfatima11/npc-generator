import type { Alignment,NPC,SocialStatus,Wealth } from '../types';
import type { NPCFlavor } from '../utils/generator/flavor';

export type UUID=string;
export interface WorkspaceTag {readonly id:UUID;readonly name:string;readonly color:string}
export interface WorkspaceFolder {readonly id:UUID;readonly name:string;readonly createdAt:string;readonly modifiedAt:string}
export interface WorkspaceCampaign {readonly id:UUID;readonly name:string;readonly createdAt:string;readonly modifiedAt:string}
export interface FieldChangeRecord {readonly id:UUID;readonly field:string;readonly oldValue:unknown;readonly newValue:unknown;readonly changedAt:string;readonly user:string}
export interface NPCMetadata {readonly createdAt:string;readonly modifiedAt:string;readonly version:number;readonly favorite:boolean;readonly archived:boolean;readonly tags:readonly WorkspaceTag[];readonly notes:string;readonly folderId:UUID|null;readonly campaignIds:readonly UUID[];readonly author:string;readonly changeHistory?:readonly FieldChangeRecord[]}
export interface WorkspaceNPC {readonly id:UUID;readonly npc:NPC;readonly flavor:NPCFlavor|null;readonly metadata:NPCMetadata}
export interface NPCVersion {readonly id:UUID;readonly npcId:UUID;readonly version:number;readonly savedAt:string;readonly npc:NPC;readonly flavor:NPCFlavor|null;readonly metadata:NPCMetadata;readonly reason:string}
export type WorkspaceSort='newest'|'oldest'|'name'|'race'|'occupation'|'recently-modified';
export interface WorkspaceFilters {readonly race?:string;readonly minimumAge?:number;readonly maximumAge?:number;readonly occupation?:string;readonly alignment?:Alignment;readonly campaignId?:UUID;readonly wealth?:Wealth;readonly socialStatus?:SocialStatus;readonly religion?:string;readonly favorite?:boolean;readonly archived?:boolean}
export interface WorkspaceQuery {readonly search?:string;readonly filters?:WorkspaceFilters;readonly sort?:WorkspaceSort;readonly page?:number;readonly pageSize?:number}
export interface WorkspacePage {readonly items:readonly WorkspaceNPC[];readonly total:number;readonly page:number;readonly pageSize:number;readonly pageCount:number}
export interface CreateNPCInput {readonly npc:NPC;readonly flavor?:NPCFlavor|null;readonly tags?:readonly WorkspaceTag[];readonly notes?:string;readonly folderId?:UUID|null;readonly campaignIds?:readonly UUID[];readonly author:string;readonly changeHistory?:readonly FieldChangeRecord[]}
export interface UpdateNPCInput {readonly npc?:NPC;readonly flavor?:NPCFlavor|null;readonly favorite?:boolean;readonly archived?:boolean;readonly tags?:readonly WorkspaceTag[];readonly notes?:string;readonly folderId?:UUID|null;readonly campaignIds?:readonly UUID[];readonly author?:string;readonly changeHistory?:readonly FieldChangeRecord[];readonly reason?:string}
export interface VersionDifference {readonly path:string;readonly before:unknown;readonly after:unknown}
export interface WorkspaceSnapshot {readonly schemaVersion:1;readonly npcs:readonly WorkspaceNPC[];readonly versions:readonly NPCVersion[];readonly folders:readonly WorkspaceFolder[];readonly campaigns:readonly WorkspaceCampaign[]}
export interface WorkspaceExport {readonly format:'smart-npc-workspace';readonly exportedAt:string;readonly data:WorkspaceSnapshot}
export interface PDFExportRequest {readonly npcIds:readonly UUID[];readonly includePrivateNotes:boolean;readonly title?:string}
export interface PDFExporter {export(request:PDFExportRequest,workspace:WorkspaceSnapshot):Promise<Blob>}
export interface WorkspaceMutation {readonly kind:string;readonly before:WorkspaceSnapshot;readonly after:WorkspaceSnapshot;readonly at:string}
