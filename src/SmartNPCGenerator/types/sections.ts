import type { Measurement, PersonReference, Relationship } from './common';
import type {
  HairLength,
  HeightUnit,
  HookDifficulty,
  IncomeLevel,
  RiskLevel,
  RelationshipType,
  WeightUnit,
} from './enums';

export type PersonalityTraits = readonly [string, string, string];

export interface Appearance {
  readonly skinColor: string;
  readonly eyeColor: string;
  readonly eyeShape: string;
  readonly hairColor: string;
  readonly hairStyle: string;
  readonly hairLength: HairLength;
  readonly facialHair: string;
  readonly faceShape: string;
  readonly nose: string;
  readonly lips: string;
  readonly teeth: string;
  readonly ears: string;
  readonly scars: readonly string[];
  readonly tattoos: readonly string[];
  readonly birthmarks: readonly string[];
  readonly prosthetic: string | null;
  readonly clothingStyle: string;
  readonly favoriteColors: readonly string[];
  readonly jewelry: readonly string[];
  readonly accessories: readonly string[];
  readonly walkingStyle: string;
  readonly facialExpression: string;
  readonly smell: string;
  readonly distinguishingFeatures: readonly string[];
}

export interface Personality {
  readonly traits: PersonalityTraits;
  readonly ideals: readonly string[];
  readonly bonds: readonly string[];
  readonly flaws: readonly string[];
  readonly habits: readonly string[];
  readonly likes: readonly string[];
  readonly dislikes: readonly string[];
  readonly fears: readonly string[];
  readonly secret: string;
  readonly greatestStrength: string;
  readonly greatestWeakness: string;
  readonly biggestRegret: string;
  readonly biggestDesire: string;
  readonly moralCode: string;
}

export interface Occupation {
  readonly title: string;
  readonly position: string;
  readonly yearsExperience: number;
  readonly workplace: string;
  readonly employer: string | null;
  readonly incomeLevel: IncomeLevel;
  readonly dailyRoutine: string;
  readonly careerReason: string;
  readonly workReputation: string;
  readonly greatestAchievement: string;
}

export interface BackstorySection {
  readonly title: string;
  readonly beginning: string;
  readonly development: string;
  readonly climax: string;
  readonly ending: string;
  readonly selectedResult: string | null;
}

export type Backstory = readonly [
  BackstorySection, BackstorySection, BackstorySection, BackstorySection,
  BackstorySection, BackstorySection, BackstorySection, BackstorySection,
  BackstorySection, BackstorySection,
];

export interface Goal {
  readonly currentGoal: string;
  readonly motivation: string;
  readonly obstacle: string;
}

export interface Relationships {
  readonly parents: readonly Relationship<RelationshipType.Parent>[];
  readonly siblings: readonly Relationship<RelationshipType.Sibling>[];
  readonly bestFriend: Relationship<RelationshipType.BestFriend> | null;
  readonly ally: Relationship<RelationshipType.Ally> | null;
  readonly rival: Relationship<RelationshipType.Rival> | null;
  readonly enemy: Relationship<RelationshipType.Enemy> | null;
  readonly mentor: Relationship<RelationshipType.Mentor> | null;
  readonly student: Relationship<RelationshipType.Student> | null;
  readonly romanticInterest: Relationship<RelationshipType.RomanticInterest> | null;
}

export interface Secret {
  readonly description: string;
  readonly riskLevel: RiskLevel;
  readonly whoKnows: readonly PersonReference[];
}

export interface AdventureHook {
  readonly title: string;
  readonly summary: string;
  readonly difficulty: HookDifficulty;
  readonly reward: string;
}

export type AdventureHooks = readonly [AdventureHook, AdventureHook, AdventureHook];

export type Height = Measurement<HeightUnit>;
export type Weight = Measurement<WeightUnit>;
