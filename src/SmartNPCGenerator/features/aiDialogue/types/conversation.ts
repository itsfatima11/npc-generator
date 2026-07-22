import type { NPC } from '../../../types';import type { NPCFlavor } from '../../../utils/generator/flavor';
export type ConversationRole='player'|'npc'|'system';
export type Emotion='calm'|'happy'|'angry'|'afraid'|'suspicious'|'sad'|'excited'|'hostile'|'friendly';
export type KnowledgeLevel='unknown'|'rumor'|'known'|'personal-knowledge'|'secret-knowledge';
export type DialogueAction='ask-question'|'persuade'|'intimidate'|'deceive'|'trade'|'threaten'|'help'|'offer-quest';
export type ActionOutcome='none'|'success'|'failure';
export type ConversationMode='player'|'dm';
export interface ConversationMessage {readonly id:string;readonly role:ConversationRole;readonly content:string;readonly timestamp:string;readonly emotion:Emotion;readonly knowledgeUsed:readonly string[]}
export interface MemoryEvent {readonly id:string;readonly kind:'question'|'promise'|'action'|'revelation'|'relationship-change';readonly summary:string;readonly createdAt:string;readonly importance:number}
export interface ConversationMemory {readonly events:readonly MemoryEvent[];readonly playerPromises:readonly string[];readonly playerActions:readonly string[];readonly informationRevealed:readonly string[];readonly lastEmotion:Emotion}
export interface KnowledgeEntry {readonly id:string;readonly topic:string;readonly level:KnowledgeLevel;readonly content:string;readonly revealed:boolean;readonly source:string}
export interface Conversation {readonly id:string;readonly npcId:string;readonly messages:readonly ConversationMessage[];readonly createdAt:string;readonly updatedAt:string;readonly memory:ConversationMemory;readonly relationshipLevel:number;readonly playerKnowledge:readonly KnowledgeEntry[]}
export interface ConversationSettingsState {readonly mode:ConversationMode;readonly action:DialogueAction;readonly outcome:ActionOutcome;readonly storyEvents:readonly string[];readonly includeStageDirections:boolean}
export interface DialogueNPC {readonly npc:NPC;readonly flavor:NPCFlavor}
export interface NPCDialogueContext {readonly npcId:string;readonly identity:string;readonly race:string;readonly age:number;readonly occupation:string;readonly appearance:string;readonly personality:readonly string[];readonly alignment:string;readonly backstorySummary:string;readonly currentSituation:string;readonly currentGoal:string;readonly secret:string;readonly relationships:readonly string[];readonly voiceStyle:string;readonly mannerisms:readonly string[];readonly education:string;readonly experience:number;readonly publicKnowledge:readonly KnowledgeEntry[];readonly privateKnowledge:readonly KnowledgeEntry[];readonly memory:ConversationMemory;readonly relationshipLevel:number;readonly emotion:Emotion;readonly secretPermitted:boolean}
export interface DialogueTurnInput {readonly content:string;readonly settings:ConversationSettingsState}
export interface DialogueResponse {readonly message:ConversationMessage;readonly hiddenThoughts:string;readonly trueMotivation:string;readonly futureReaction:string;readonly relationshipDelta:number;readonly emotion:Emotion}
export interface ResponseCandidate {readonly content:string;readonly emotion:Emotion;readonly knowledgeUsed:readonly string[];readonly hiddenThoughts:string;readonly futureReaction:string}
export interface ResponseValidationIssue {readonly code:string;readonly message:string}
export interface ResponseValidation {readonly valid:boolean;readonly issues:readonly ResponseValidationIssue[]}
export interface ModelDialogueRequest {readonly hiddenContext:string;readonly playerMessage:string;readonly action:DialogueAction;readonly outcome:ActionOutcome;readonly attempt:number;readonly constraints:readonly string[]}
export interface DialogueModelProvider {generate(request:ModelDialogueRequest):Promise<ResponseCandidate>}
