import type { NPC } from '../../../types';import type { NPCFlavor } from '../flavor';
export type ConsistencySection='age'|'race'|'occupation'|'appearance'|'religion'|'relationships'|'backstory'|'personality'|'goal'|'secret'|'adventureHooks'|'inventory'|'residence'|'voice'|'quote'|'dmNotes'|'dailyRoutine'|'mannerisms'|'portraitPrompt';
export type ScoreCategory='loreAccuracy'|'internalConsistency'|'relationshipQuality'|'storyQuality'|'occupationAccuracy'|'personalityConsistency'|'goalQuality'|'adventureValue';
export type IssueSeverity='warning'|'error'|'critical';
export interface RealismIssue {readonly section:ConsistencySection;readonly category:ScoreCategory;readonly code:string;readonly message:string;readonly severity:IssueSeverity;readonly penalty:number}
export interface ScoreBreakdown {readonly loreAccuracy:number;readonly internalConsistency:number;readonly relationshipQuality:number;readonly storyQuality:number;readonly occupationAccuracy:number;readonly personalityConsistency:number;readonly goalQuality:number;readonly adventureValue:number;readonly overallScore:number}
export interface ConsistencyCandidate {readonly npc:NPC;readonly flavor:NPCFlavor}
export interface ValidationReport {readonly valid:boolean;readonly targetMet:boolean;readonly issues:readonly RealismIssue[];readonly passes:number}
export interface RepairLogEntry {readonly pass:number;readonly section:ConsistencySection;readonly issueCodes:readonly string[];readonly scoreBefore:number;readonly scoreAfter:number;readonly changed:boolean}
export interface ConsistencyResult {readonly npc:NPC;readonly flavor:NPCFlavor;readonly validationReport:ValidationReport;readonly qualityScore:ScoreBreakdown;readonly repairLog:readonly RepairLogEntry[]}
export interface SectionRepairRequest {readonly candidate:ConsistencyCandidate;readonly section:ConsistencySection;readonly issues:readonly RealismIssue[];readonly pass:number}
export interface SectionRepairAdapter {repair(request:SectionRepairRequest):ConsistencyCandidate}
export interface ConsistencyOptions {readonly repairAdapter:SectionRepairAdapter;readonly qualityTarget?:number;readonly maximumRepairPasses?:number}
export type SectionValidator=(candidate:ConsistencyCandidate)=>readonly RealismIssue[];
