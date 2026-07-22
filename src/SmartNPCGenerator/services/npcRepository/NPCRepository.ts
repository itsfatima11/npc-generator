import type { CreateNPCInput,NPCVersion,UpdateNPCInput,UUID,VersionDifference,WorkspaceCampaign,WorkspaceFolder,WorkspaceNPC,WorkspacePage,WorkspaceQuery,WorkspaceSnapshot } from '../../workspace/types';
export interface NPCRepository {
  initialize():Promise<void>;
  snapshot():Promise<WorkspaceSnapshot>;
  replace(snapshot:WorkspaceSnapshot):Promise<void>;
  create(input:CreateNPCInput):Promise<WorkspaceNPC>;
  get(id:UUID):Promise<WorkspaceNPC|null>;
  query(query:WorkspaceQuery):Promise<WorkspacePage>;
  update(id:UUID,input:UpdateNPCInput):Promise<WorkspaceNPC>;
  delete(id:UUID):Promise<void>;
  duplicate(id:UUID):Promise<WorkspaceNPC>;
  setFavorite(id:UUID,favorite:boolean):Promise<WorkspaceNPC>;
  setArchived(id:UUID,archived:boolean):Promise<WorkspaceNPC>;
  rename(id:UUID,name:string):Promise<WorkspaceNPC>;
  versions(id:UUID):Promise<readonly NPCVersion[]>;
  restoreVersion(id:UUID,version:number):Promise<WorkspaceNPC>;
  compareVersions(id:UUID,left:number,right:number):Promise<readonly VersionDifference[]>;
  createFolder(name:string):Promise<WorkspaceFolder>;
  renameFolder(id:UUID,name:string):Promise<WorkspaceFolder>;
  deleteFolder(id:UUID):Promise<void>;
  createCampaign(name:string):Promise<WorkspaceCampaign>;
  renameCampaign(id:UUID,name:string):Promise<WorkspaceCampaign>;
  deleteCampaign(id:UUID):Promise<void>;
}
