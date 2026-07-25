import type { NPC } from '../../types';import type { NPCFlavor } from '../../utils/generator/flavor';import type { FieldChangeRecord,WorkspaceNPC } from '../../workspace';
export interface EditorDraft {readonly npc:NPC;readonly flavor:NPCFlavor}
export type EditorSection='appearance'|'personality'|'goal'|'backstory'|'relationships'|'adventureHooks'|'flavor';
export interface RegenerationRequest {readonly section:EditorSection;readonly index?:number;readonly relationshipKey?:keyof NPC['relationships']}
export interface RegenerationProposal {readonly path:string;readonly currentValue:unknown;readonly newValue:unknown;readonly request:RegenerationRequest}
export interface EditorSectionProps {readonly draft:EditorDraft;readonly change:(path:string,value:unknown)=>void;readonly regenerate?:(request:RegenerationRequest)=>void;readonly errors?:readonly string[]}
export interface NPCEditorProps {readonly record:WorkspaceNPC;readonly onSave:(draft:EditorDraft,history:readonly FieldChangeRecord[],autosave:boolean)=>Promise<void>;readonly onClose:()=>void;readonly user:string}
