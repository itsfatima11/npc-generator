import type { Alignment, BodyBuild, RiskLevel, SocialStatus, Wealth } from './enums';

export interface NumericRange { readonly min: number; readonly max: number }

export interface RaceData {
  readonly id: string;
  readonly name: string;
  readonly subraceIds: readonly string[];
  readonly typicalLifespan: number | null;
  readonly adultAge: number | null;
  readonly heightInches: NumericRange;
  readonly weightPounds: NumericRange;
  readonly commonAlignments: readonly Alignment[];
  readonly commonOccupationIds: readonly string[];
  readonly commonLanguageIds: readonly string[];
  readonly description: string;
}

export interface SubraceData extends Omit<RaceData, 'subraceIds'> {
  readonly parentRaceId: string;
}

export type LanguageCategory = 'standard' | 'exotic' | 'setting' | 'secret' | 'dialect';
export interface LanguageData {
  readonly id: string;
  readonly name: string;
  readonly category: LanguageCategory;
  readonly script: string | null;
  readonly parentLanguageId: string | null;
  readonly typicalSpeakers: readonly string[];
}

export interface AlignmentData {
  readonly id: Alignment;
  readonly name: string;
  readonly description: string;
  readonly personalityTendencies: readonly string[];
  readonly commonMotivations: readonly string[];
}

export type OccupationCategory = 'military'|'religion'|'crafting'|'nobility'|'crime'|'magic'|'nature'|'commerce'|'entertainment'|'government'|'travel'|'medicine'|'education';
export type EducationLevel = 'none'|'informal'|'apprenticeship'|'literate'|'scholarly'|'specialist';
export type DemandLevel = 'low'|'moderate'|'high'|'extreme';
export type RespectLevel = 'reviled'|'low'|'mixed'|'respected'|'prestigious';
export interface OccupationData {
  readonly id: string;
  readonly title: string;
  readonly category: OccupationCategory;
  readonly wealthTendency: Wealth;
  readonly requiredEducation: EducationLevel;
  readonly physicalDemand: DemandLevel;
  readonly socialRespect: RespectLevel;
  readonly description: string;
}

export interface DeityData {
  readonly id: string;
  readonly name: string;
  readonly alignment: Alignment;
  readonly domains: readonly string[];
  readonly followers: readonly string[];
  readonly description: string;
}

export type TraitTag = 'positive'|'neutral'|'negative';
export interface PersonalityTraitData { readonly id: string; readonly label: string; readonly tag: TraitTag }
export type GoalCategory = 'good'|'neutral'|'evil'|'personal'|'political'|'financial'|'religious'|'family'|'survival'|'revenge'|'knowledge'|'power';
export interface GoalData { readonly id: string; readonly description: string; readonly category: GoalCategory }
export interface SecretData { readonly id: string; readonly description: string; readonly severity: RiskLevel }
export type HookCategory = 'combat'|'social'|'exploration'|'political'|'religious'|'crime'|'mystery'|'magic'|'survival';
export interface HookData { readonly id: string; readonly title: string; readonly summary: string; readonly category: HookCategory }
export interface SocialStatusData { readonly id: SocialStatus; readonly name: string; readonly description: string }
export interface WealthData { readonly id: Wealth; readonly name: string; readonly description: string }
export interface BodyBuildData { readonly id: BodyBuild; readonly name: string; readonly description: string }
export interface AppearanceData { readonly id: string; readonly label: string; readonly category: 'skin'|'eyes'|'hair'|'face'|'feature'|'style'|'movement' }
export interface RelationshipPromptData { readonly id: string; readonly label: string; readonly description: string }
