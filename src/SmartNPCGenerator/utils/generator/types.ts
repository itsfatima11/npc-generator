import type {
  AdventureHooks, Appearance, Backstory, Goal, Height, NPC, Occupation,
  Personality, Relationships, Secret, Weight,
} from '../../types';
import type {
  Alignment, BodyBuild, FamilyStatus, Gender, MaritalStatus, SocialStatus, Wealth,
} from '../../types';
import type { DeityData, OccupationData, RaceData, SubraceData } from '../../types';
import type { StoryFacts } from './backstory/types';
import type { GeneratedName } from './name/types';

export interface GenerationOptions {
  readonly seed: string;
  readonly raceId?: string;
  readonly subraceId?: string;
  readonly gender?: Gender;
  readonly alignment?: Alignment;
  readonly occupationId?:string;readonly religionId?:string;readonly minimumAge?:number;readonly maximumAge?:number;readonly wealth?:Wealth;readonly socialStatus?:SocialStatus;
}

export interface GenerationBase {
  readonly options: GenerationOptions;
  readonly attempt: number;
}

export interface RaceStage extends GenerationBase {
  readonly raceData: RaceData;
  readonly alignment: Alignment;
}
export interface SubraceStage extends RaceStage { readonly subraceData: SubraceData | null }
export interface GenderStage extends SubraceStage { readonly gender: Gender }
export interface AgeStage extends GenderStage { readonly age: number }
export interface PhysicalStage extends AgeStage {
  readonly height: Height; readonly weight: Weight; readonly bodyBuild: BodyBuild;
  readonly voice: string; readonly accent: string;
}
export interface OccupationStage extends PhysicalStage {
  readonly occupationData: OccupationData; readonly occupation: Occupation;
}
export interface WealthStage extends OccupationStage { readonly wealth: Wealth; readonly residence: string }
export interface SocialStatusStage extends WealthStage {
  readonly socialStatus: SocialStatus; readonly education: string; readonly reputation: string;
}
export interface ReligionStage extends SocialStatusStage { readonly deity: DeityData | null }
export interface LanguageStage extends ReligionStage { readonly languages: readonly string[] }
export interface AppearanceStage extends LanguageStage { readonly appearance: Appearance }
export interface PersonalityStage extends AppearanceStage { readonly personality: Personality }
export interface NameStage extends PersonalityStage {readonly name:string;readonly nameIdentity:GeneratedName}
export interface RelationshipStage extends NameStage {
  readonly relationships: Relationships; readonly maritalStatus: MaritalStatus; readonly familyStatus: FamilyStatus;
}
export interface BackstoryStage extends RelationshipStage { readonly backstory: Backstory; readonly birthplace: string;readonly backstoryBiography:string;readonly backstorySignals:StoryFacts }
export interface GoalStage extends BackstoryStage { readonly goal: Goal }
export interface SecretStage extends GoalStage { readonly secret: Secret }
export interface AdventureHookStage extends SecretStage { readonly adventureHooks: AdventureHooks }

export type GeneratedSection = 'race'|'age'|'name'|'occupation'|'wealth'|'socialStatus'|'religion'|'languages'|'appearance'|'personality'|'relationships'|'backstory'|'goal'|'secret'|'adventureHooks';
export interface ConsistencyIssue { readonly section: GeneratedSection; readonly code: string; readonly message: string }
export interface GenerationConsistencyResult { readonly valid: boolean; readonly issues: readonly ConsistencyIssue[] }
export interface GenerationResult { readonly npc: NPC; readonly validation: GenerationConsistencyResult; readonly seed: string }
