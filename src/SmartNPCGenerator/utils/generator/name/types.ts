import type { Gender, Personality, SocialStatus } from '../../../types';
import type { OccupationData, RaceData, SubraceData } from '../../../types';

export type NameOrder='given-family'|'family-given'|'clan-given'|'mononym';
export type SurnameKind='family'|'clan'|'descriptive'|'none';
export type NameGender='male'|'female'|'neutral';
export interface NamingRules {readonly order:NameOrder;readonly surnameKind:SurnameKind;readonly surnameRequired:boolean;readonly allowsVirtueName:boolean;readonly allowsNickname:boolean;readonly description:string}
export interface NameCulture {readonly id:string;readonly name:string;readonly raceIds:readonly string[];readonly maleNames:readonly string[];readonly femaleNames:readonly string[];readonly neutralNames:readonly string[];readonly familyNames:readonly string[];readonly clanNames:readonly string[];readonly nicknames:readonly string[];readonly honorifics:readonly string[];readonly titles:readonly string[];readonly rules:NamingRules}
export interface NameGenerationContext {readonly seed:string;readonly attempt:number;readonly race:RaceData;readonly subrace:SubraceData|null;readonly gender:Gender;readonly occupation:OccupationData;readonly yearsExperience:number;readonly socialStatus:SocialStatus;readonly personality:Personality;readonly reputation:string}
export interface GeneratedName {readonly cultureId:string;readonly genderCategory:NameGender;readonly firstName:string;readonly surname:string|null;readonly nickname:string|null;readonly honorific:string|null;readonly title:string|null;readonly displayName:string}
export interface NameValidationIssue {readonly code:string;readonly message:string}
export interface NameValidationResult {readonly valid:boolean;readonly issues:readonly NameValidationIssue[]}
