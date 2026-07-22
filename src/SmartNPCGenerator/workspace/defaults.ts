import type { NPCMetadata,WorkspaceFilters,WorkspaceSnapshot } from './types';
export const EMPTY_WORKSPACE:WorkspaceSnapshot={schemaVersion:1,npcs:[],versions:[],folders:[],campaigns:[]};
export const DEFAULT_WORKSPACE_FILTERS:WorkspaceFilters={archived:false};
export function metadata(now:string,author:string):NPCMetadata{return {createdAt:now,modifiedAt:now,version:1,favorite:false,archived:false,tags:[],notes:'',folderId:null,campaignIds:[],author,changeHistory:[]};}
