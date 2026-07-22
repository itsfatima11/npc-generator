import type { SelectedStoryChapter, StoryFacts, StoryState } from './types';
export function appendChapter(state:StoryState,chapter:SelectedStoryChapter,facts:Partial<StoryFacts>):StoryState{return {chapters:[...state.chapters,chapter],usedFragmentIds:new Set([...state.usedFragmentIds,...chapter.fragmentIds]),facts:{...state.facts,...facts}};}
