import type { Height, Weight, Appearance, Personality, Occupation, Backstory, Goal, Relationships, Secret, AdventureHooks } from './sections';
import type { Alignment, BodyBuild, FamilyStatus, Gender, MaritalStatus, SocialStatus, Wealth } from './enums';

/** The canonical aggregate representing one complete NPC. */
export interface NPC {
  readonly id: string;
  readonly name: string;
  readonly race: string;
  readonly subrace: string | null;
  readonly gender: Gender;
  readonly age: number;
  readonly height: Height;
  readonly weight: Weight;
  readonly bodyBuild: BodyBuild;
  readonly alignment: Alignment;
  readonly occupation: Occupation;
  readonly socialStatus: SocialStatus;
  readonly wealth: Wealth;
  readonly education: string;
  readonly languages: readonly string[];
  readonly religion: string | null;
  readonly birthplace: string;
  readonly residence: string;
  readonly maritalStatus: MaritalStatus;
  readonly familyStatus: FamilyStatus;
  readonly voice: string;
  readonly accent: string;
  readonly reputation: string;
  readonly appearance: Appearance;
  readonly personality: Personality;
  readonly backstory: Backstory;
  readonly goal: Goal;
  readonly relationships: Relationships;
  readonly secret: Secret;
  readonly adventureHooks: AdventureHooks;
}
