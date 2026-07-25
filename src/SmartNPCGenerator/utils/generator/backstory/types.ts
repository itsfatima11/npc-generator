import type { Alignment, Personality, Relationships, SocialStatus, Wealth } from '../../../types';
import type { DeityData, OccupationData, RaceData, SubraceData } from '../../../types';

export type StoryChapterId='birth'|'family'|'education'|'first-major-event'|'career'|'relationships'|'greatest-conflict'|'greatest-achievement'|'recent-events'|'current-situation';
export type StoryStage='beginning'|'development'|'climax'|'ending';

export interface StoryFragmentMetadata {
  readonly requiredRace:readonly string[];readonly requiredOccupation:readonly string[];readonly requiredAlignment:readonly Alignment[];
  readonly requiredReligion:readonly string[];readonly minimumAge:number|null;readonly maximumAge:number|null;
  readonly requiredPersonality:readonly string[];readonly requiredWealth:readonly Wealth[];readonly tags:readonly string[];readonly priority:number;
}
export interface StoryFragment extends StoryFragmentMetadata {readonly id:string;readonly chapter:StoryChapterId;readonly stage:StoryStage;readonly template:string}
export interface StoryContext {
  readonly seed:string;readonly attempt:number;readonly name:string;readonly race:RaceData;readonly subrace:SubraceData|null;readonly alignment:Alignment;
  readonly age:number;readonly occupation:OccupationData;readonly wealth:Wealth;readonly socialStatus:SocialStatus;readonly deity:DeityData|null;
  readonly personality:Personality;readonly relationships:Relationships;readonly birthplace:string;
}
export interface StoryFacts {
  readonly upbringing:string;readonly familyImpact:string;readonly educationPath:string;readonly firstTurningPoint:string;readonly careerFoundation:string;
  readonly centralRelationship:string;readonly centralConflict:string;readonly achievement:string;readonly recentCrisis:string;readonly currentPressure:string;
  readonly goalCause:string;readonly secretCause:string;readonly hookCause:string;
}
export interface SelectedStoryChapter {readonly id:StoryChapterId;readonly title:string;readonly beginning:string;readonly development:string;readonly climax:string;readonly ending:string;readonly paragraph:string;readonly fragmentIds:readonly [string,string,string,string]}
export interface StoryState {readonly chapters:readonly SelectedStoryChapter[];readonly usedFragmentIds:ReadonlySet<string>;readonly facts:Partial<StoryFacts>}
export interface StoryResult {readonly chapters:readonly [SelectedStoryChapter,SelectedStoryChapter,SelectedStoryChapter,SelectedStoryChapter,SelectedStoryChapter,SelectedStoryChapter,SelectedStoryChapter,SelectedStoryChapter,SelectedStoryChapter,SelectedStoryChapter];readonly biography:string;readonly facts:StoryFacts}
