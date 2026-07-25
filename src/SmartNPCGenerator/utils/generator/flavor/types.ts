import type { NPC } from '../../../types';

export type VoicePitch='very-low'|'low'|'medium'|'high'|'very-high';
export type VoiceSpeed='measured'|'slow'|'moderate'|'quick'|'rapid';
export type VocabularyLevel='plain'|'practical'|'educated'|'scholarly'|'courtly';

export interface PortraitPrompt {readonly prompt:string;readonly negativeConstraints:readonly string[]}
export interface VoiceProfile {readonly pitch:VoicePitch;readonly speed:VoiceSpeed;readonly accent:string;readonly speakingStyle:string;readonly vocabularyLevel:VocabularyLevel;readonly laughStyle:string;readonly emotionalTone:string;readonly speechHabits:readonly string[];readonly summary:string}
export interface MemorableQuote {readonly text:string;readonly rationale:string}
export type Mannerisms=readonly [string,string,string,string,string];
export interface InventoryItem {readonly name:string;readonly description:string;readonly reason:string}
export type Inventory=readonly [InventoryItem,InventoryItem,InventoryItem,InventoryItem,InventoryItem,InventoryItem,InventoryItem,InventoryItem,InventoryItem,InventoryItem];
export interface ResidenceProfile {readonly location:string;readonly buildingType:string;readonly condition:string;readonly interior:string;readonly importantObjects:readonly string[];readonly security:string;readonly neighbors:string}
export interface DailyRoutine {readonly morning:string;readonly afternoon:string;readonly evening:string;readonly night:string}
export interface DMNotes {readonly hiddenMotivation:string;readonly unknownWeakness:string;readonly futureStoryPotential:string;readonly combatBehavior:string;readonly negotiationStyle:string;readonly possibleBetrayal:string;readonly potentialCharacterArc:string}
export type FlavorSection='portraitPrompt'|'voice'|'quote'|'mannerisms'|'inventory'|'residence'|'dailyRoutine'|'dmNotes';
export interface FlavorIssue {readonly section:FlavorSection;readonly code:string;readonly message:string}
export interface FlavorValidation {readonly valid:boolean;readonly issues:readonly FlavorIssue[]}
export interface NPCFlavor {readonly portraitPrompt:PortraitPrompt;readonly voice:VoiceProfile;readonly quote:MemorableQuote;readonly mannerisms:Mannerisms;readonly inventory:Inventory;readonly residence:ResidenceProfile;readonly dailyRoutine:DailyRoutine;readonly dmNotes:DMNotes}
export interface FlavoredNPC {readonly npc:NPC;readonly flavor:NPCFlavor;readonly validation:FlavorValidation;readonly seed:string}
export interface FlavorOptions {readonly seed?:string;readonly maxSectionAttempts?:number}
export interface FlavorContext {readonly npc:NPC;readonly seed:string;readonly attempt:number;readonly occupationCategory:string;readonly isGood:boolean;readonly isEvil:boolean;readonly isLawful:boolean;readonly isReligious:boolean;readonly isWealthy:boolean;readonly isPoor:boolean}
