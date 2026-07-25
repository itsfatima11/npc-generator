import { useCallback,useEffect,useMemo,useState } from 'react';import { LocalNPCRepository } from '../services/npcRepository';import { LocalStorageProvider } from '../storage';import { DEFAULT_WORKSPACE_FILTERS,WorkspaceService } from '../workspace';import type { NPC } from '../types';import type { NPCVersion,UpdateNPCInput,UUID,VersionDifference,WorkspaceFilters,WorkspaceNPC,WorkspacePage,WorkspaceQuery,WorkspaceSnapshot,WorkspaceSort,WorkspaceTag } from '../workspace';

const EMPTY_PAGE:WorkspacePage={items:[],total:0,page:1,pageSize:12,pageCount:1};
export function useWorkspace(){
  const service=useMemo(()=>new WorkspaceService(new LocalNPCRepository(new LocalStorageProvider())),[]);
  const [page,setPage]=useState<WorkspacePage>(EMPTY_PAGE),[snapshot,setSnapshot]=useState<WorkspaceSnapshot|null>(null),[search,setSearch]=useState(''),[sort,setSort]=useState<WorkspaceSort>('newest'),[filters,setFilters]=useState<WorkspaceFilters>(DEFAULT_WORKSPACE_FILTERS),[pageNumber,setPageNumber]=useState(1),[loading,setLoading]=useState(true),[error,setError]=useState<string|null>(null),[history,setHistory]=useState<readonly NPCVersion[]>([]),[differences,setDifferences]=useState<readonly VersionDifference[]>([]),[historyId,setHistoryId]=useState<UUID|null>(null),[revision,setRevision]=useState(0);
  const query=useMemo<WorkspaceQuery>(()=>({search,sort,filters,page:pageNumber,pageSize:12}),[search,sort,filters,pageNumber]);
  const refresh=useCallback(async()=>{try{const [nextPage,nextSnapshot]=await Promise.all([service.query(query),service.snapshot()]);setPage(nextPage);setSnapshot(nextSnapshot);if(nextPage.page!==pageNumber)setPageNumber(nextPage.page);setError(null);}catch(reason){setError(reason instanceof Error?reason.message:'Workspace could not be loaded.');}},[pageNumber,query,service]);
  useEffect(()=>{let active=true;void service.initialize().then(()=>{if(active){setLoading(false);setRevision(value=>value+1);}}).catch(reason=>{if(active){setLoading(false);setError(reason instanceof Error?reason.message:'Workspace initialization failed.');}});return()=>{active=false;};},[service]);
  useEffect(()=>{if(!loading)void refresh();},[loading,refresh,revision]);
  const run=useCallback(async<T,>(operation:()=>Promise<T>):Promise<T|undefined>=>{try{setError(null);const result=await operation();setRevision(value=>value+1);return result;}catch(reason){setError(reason instanceof Error?reason.message:'Workspace operation failed.');return undefined;}},[]);
  const save=useCallback(async(npc:NPC,author='Local Dungeon Master',changes:Omit<UpdateNPCInput,'npc'|'author'>={})=>run(()=>service.save(npc,{...changes,author})),[run,service]);
  const create=useCallback((npc:NPC,author='Local Dungeon Master')=>run(()=>service.create({npc,author})),[run,service]);
  const remove=useCallback((id:UUID)=>run(()=>service.delete(id)),[run,service]);
  const duplicate=useCallback((id:UUID)=>run(()=>service.duplicate(id)),[run,service]);
  const favorite=useCallback((record:WorkspaceNPC)=>run(()=>service.favorite(record.id,!record.metadata.favorite)),[run,service]);
  const archive=useCallback((record:WorkspaceNPC)=>run(()=>record.metadata.archived?service.restore(record.id):service.archive(record.id)),[run,service]);
  const rename=useCallback((id:UUID,name:string)=>run(()=>service.rename(id,name)),[run,service]);
  const updateMetadata=useCallback((id:UUID,input:UpdateNPCInput)=>run(()=>service.update(id,input)),[run,service]);
  const createFolder=useCallback((name:string)=>run(()=>service.createFolder(name)),[run,service]);
  const createCampaign=useCallback((name:string)=>run(()=>service.createCampaign(name)),[run,service]);
  const showVersions=useCallback(async(id:UUID)=>{const versions=await service.versions(id);setHistoryId(id);setHistory(versions);setDifferences([]);},[service]);
  const restoreVersion=useCallback((id:UUID,version:number)=>run(async()=>{const result=await service.restoreVersion(id,version);setHistory(await service.versions(id));return result;}),[run,service]);
  const compareVersions=useCallback(async(id:UUID,left:number,right:number)=>{try{setDifferences(await service.compareVersions(id,left,right));}catch(reason){setError(reason instanceof Error?reason.message:'Versions could not be compared.');}},[service]);
  const closeVersions=useCallback(()=>{setHistoryId(null);setHistory([]);setDifferences([]);},[]);
  const undo=useCallback(()=>run(()=>service.undo()),[run,service]),redo=useCallback(()=>run(()=>service.redo()),[run,service]);
  const importJSON=useCallback((source:string,mode:'merge'|'replace'='merge')=>run(()=>service.importJSON(source,mode)),[run,service]);
  const exportJSON=useCallback(()=>service.exportJSON(),[service]),exportMarkdown=useCallback(()=>service.exportMarkdown(true),[service]);
  const setTag=useCallback((record:WorkspaceNPC,tag:WorkspaceTag)=>updateMetadata(record.id,{tags:[...record.metadata.tags.filter(item=>item.id!==tag.id&&item.name.toLowerCase()!==tag.name.toLowerCase()),tag],reason:'Updated tags'}),[updateMetadata]);
  const removeTag=useCallback((record:WorkspaceNPC,id:UUID)=>updateMetadata(record.id,{tags:record.metadata.tags.filter(item=>item.id!==id),reason:'Updated tags'}),[updateMetadata]);
  const scheduleAutosave=useCallback((id:UUID,input:UpdateNPCInput,delay?:number)=>service.scheduleAutosave(id,input,delay),[service]);
  return {service,page,snapshot,search,setSearch,sort,setSort,filters,setFilters,pageNumber,setPageNumber,loading,error,save,create,remove,duplicate,favorite,archive,rename,updateMetadata,createFolder,createCampaign,showVersions,restoreVersion,compareVersions,closeVersions,history,historyId,differences,undo,redo,canUndo:service.canUndo(),canRedo:service.canRedo(),importJSON,exportJSON,exportMarkdown,setTag,removeTag,scheduleAutosave};
}
