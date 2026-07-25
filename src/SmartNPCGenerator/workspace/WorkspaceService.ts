import type { NPC } from '../types';import type { NPCRepository } from '../services/npcRepository';import { parseWorkspaceJSON,workspaceJSON,workspaceMarkdown } from './serialization';import type { CreateNPCInput,PDFExporter,PDFExportRequest,UpdateNPCInput,UUID,WorkspaceCampaign,WorkspaceFolder,WorkspaceMutation,WorkspaceNPC,WorkspacePage,WorkspaceQuery,WorkspaceSnapshot } from './types';

export class WorkspaceService {
  private undoStack:WorkspaceMutation[]=[];private redoStack:WorkspaceMutation[]=[];private autosaveTimers=new Map<UUID,number>();private autosavePending=new Map<UUID,UpdateNPCInput>();private autosaveLastRun=new Map<UUID,number>();
  constructor(private readonly repository:NPCRepository){}
  initialize():Promise<void>{return this.repository.initialize();}
  snapshot():Promise<WorkspaceSnapshot>{return this.repository.snapshot();}
  query(query:WorkspaceQuery):Promise<WorkspacePage>{return this.repository.query(query);}
  get(id:UUID):Promise<WorkspaceNPC|null>{return this.repository.get(id);}
  private async mutation<T>(kind:string,action:()=>Promise<T>):Promise<T>{const before=await this.repository.snapshot(),result=await action(),after=await this.repository.snapshot();this.undoStack.push({kind,before,after,at:new Date().toISOString()});this.redoStack=[];return result;}
  create(input:CreateNPCInput):Promise<WorkspaceNPC>{return this.mutation('create',()=>this.repository.create(input));}
  async save(npc:NPC,input:Omit<UpdateNPCInput,'npc'> & {readonly author:string}):Promise<WorkspaceNPC>{const existing=await this.repository.get(npc.id);return existing?this.mutation('save',()=>this.repository.update(existing.id,{...input,npc})):this.create({...input,npc,author:input.author});}
  update(id:UUID,input:UpdateNPCInput):Promise<WorkspaceNPC>{return this.mutation('update',()=>this.repository.update(id,input));}
  delete(id:UUID):Promise<void>{return this.mutation('delete',()=>this.repository.delete(id));}
  duplicate(id:UUID):Promise<WorkspaceNPC>{return this.mutation('duplicate',()=>this.repository.duplicate(id));}
  favorite(id:UUID,value:boolean):Promise<WorkspaceNPC>{return this.mutation('favorite',()=>this.repository.setFavorite(id,value));}
  archive(id:UUID):Promise<WorkspaceNPC>{return this.mutation('archive',()=>this.repository.setArchived(id,true));}
  restore(id:UUID):Promise<WorkspaceNPC>{return this.mutation('restore',()=>this.repository.setArchived(id,false));}
  rename(id:UUID,name:string):Promise<WorkspaceNPC>{return this.mutation('rename',()=>this.repository.rename(id,name));}
  versions(id:UUID){return this.repository.versions(id);}
  restoreVersion(id:UUID,version:number):Promise<WorkspaceNPC>{return this.mutation('restore-version',()=>this.repository.restoreVersion(id,version));}
  compareVersions(id:UUID,left:number,right:number){return this.repository.compareVersions(id,left,right);}
  createFolder(name:string):Promise<WorkspaceFolder>{return this.mutation('create-folder',()=>this.repository.createFolder(name));}
  renameFolder(id:UUID,name:string):Promise<WorkspaceFolder>{return this.mutation('rename-folder',()=>this.repository.renameFolder(id,name));}
  deleteFolder(id:UUID):Promise<void>{return this.mutation('delete-folder',()=>this.repository.deleteFolder(id));}
  createCampaign(name:string):Promise<WorkspaceCampaign>{return this.mutation('create-campaign',()=>this.repository.createCampaign(name));}
  renameCampaign(id:UUID,name:string):Promise<WorkspaceCampaign>{return this.mutation('rename-campaign',()=>this.repository.renameCampaign(id,name));}
  deleteCampaign(id:UUID):Promise<void>{return this.mutation('delete-campaign',()=>this.repository.deleteCampaign(id));}
  scheduleAutosave(id:UUID,input:UpdateNPCInput,delay=800):void{const interval=Math.max(100,delay),now=Date.now(),last=this.autosaveLastRun.get(id)??0,remaining=Math.max(0,interval-(now-last));this.autosavePending.set(id,input);if(this.autosaveTimers.has(id))return;const flush=()=>{this.autosaveTimers.delete(id);const pending=this.autosavePending.get(id);if(!pending)return;this.autosavePending.delete(id);this.autosaveLastRun.set(id,Date.now());void this.update(id,{...pending,reason:pending.reason??'Auto save'}).catch(()=>undefined);};if(remaining===0){flush();return;}this.autosaveTimers.set(id,window.setTimeout(flush,remaining));}
  cancelAutosave(id:UUID):void{const timer=this.autosaveTimers.get(id);if(timer!==undefined)window.clearTimeout(timer);this.autosaveTimers.delete(id);this.autosavePending.delete(id);}
  async undo():Promise<boolean>{const command=this.undoStack.pop();if(!command)return false;await this.repository.replace(command.before);this.redoStack.push(command);return true;}
  async redo():Promise<boolean>{const command=this.redoStack.pop();if(!command)return false;await this.repository.replace(command.after);this.undoStack.push(command);return true;}
  canUndo():boolean{return this.undoStack.length>0;}canRedo():boolean{return this.redoStack.length>0;}
  async exportJSON():Promise<string>{return workspaceJSON(await this.repository.snapshot());}
  async exportMarkdown(includeNotes=true):Promise<string>{return workspaceMarkdown(await this.repository.snapshot(),includeNotes);}
  async exportPDF(exporter:PDFExporter,request:PDFExportRequest):Promise<Blob>{return exporter.export(request,await this.repository.snapshot());}
  async importJSON(source:string,mode:'replace'|'merge'='merge'):Promise<void>{const imported=parseWorkspaceJSON(source);await this.mutation('import',async()=>{if(mode==='replace'){await this.repository.replace(imported);return;}const current=await this.repository.snapshot();const folderIds=new Map(imported.folders.map(item=>[item.id,crypto.randomUUID()]));const campaignIds=new Map(imported.campaigns.map(item=>[item.id,crypto.randomUUID()]));const npcIds=new Map(imported.npcs.map(item=>[item.id,crypto.randomUUID()]));const merged:WorkspaceSnapshot={schemaVersion:1,folders:[...current.folders,...imported.folders.map(item=>({...item,id:folderIds.get(item.id)??item.id}))],campaigns:[...current.campaigns,...imported.campaigns.map(item=>({...item,id:campaignIds.get(item.id)??item.id}))],npcs:[...current.npcs,...imported.npcs.map(item=>{const id=npcIds.get(item.id)??item.id;return {...item,id,npc:{...item.npc,id},metadata:{...item.metadata,folderId:item.metadata.folderId?folderIds.get(item.metadata.folderId)??null:null,campaignIds:item.metadata.campaignIds.map(value=>campaignIds.get(value)??value)}};})],versions:[...current.versions,...imported.versions.map(item=>({...item,id:crypto.randomUUID(),npcId:npcIds.get(item.npcId)??item.npcId,npc:{...item.npc,id:npcIds.get(item.npcId)??item.npcId},metadata:{...item.metadata,folderId:item.metadata.folderId?folderIds.get(item.metadata.folderId)??null:null,campaignIds:item.metadata.campaignIds.map(value=>campaignIds.get(value)??value)}}))]};await this.repository.replace(merged);});}
}
