import type { Backstory, BackstorySection } from '../../types';
import { DynamicBackstoryEngine } from './backstory';
import type { SelectedStoryChapter } from './backstory';
import type { BackstoryStage, RelationshipStage } from './types';

function toSection(chapter:SelectedStoryChapter):BackstorySection{return {title:chapter.title,beginning:chapter.beginning,development:chapter.development,climax:chapter.climax,ending:chapter.ending,selectedResult:chapter.paragraph};}
export const BackstoryGenerator={generate(context:RelationshipStage):BackstoryStage {
  const birthplace=`a ${context.raceData.name.toLowerCase()} community near a regional trade route`;
  const story=DynamicBackstoryEngine.generate({seed:context.options.seed,attempt:context.attempt,name:context.name,race:context.raceData,subrace:context.subraceData,alignment:context.alignment,age:context.age,occupation:context.occupationData,wealth:context.wealth,socialStatus:context.socialStatus,deity:context.deity,personality:context.personality,relationships:context.relationships,birthplace});
  const c=story.chapters;const backstory:Backstory=[toSection(c[0]),toSection(c[1]),toSection(c[2]),toSection(c[3]),toSection(c[4]),toSection(c[5]),toSection(c[6]),toSection(c[7]),toSection(c[8]),toSection(c[9])];
  const personality={...context.personality,fears:[...new Set([...context.personality.fears,story.facts.currentPressure])],biggestRegret:story.facts.centralConflict,secret:story.facts.secretCause};
  const occupation={...context.occupation,greatestAchievement:story.facts.achievement};const reputation=`${context.reputation} ${story.facts.achievement}.`;
  return {...context,personality,occupation,reputation,backstory,birthplace,backstoryBiography:story.biography,backstorySignals:story.facts};
}} as const;
