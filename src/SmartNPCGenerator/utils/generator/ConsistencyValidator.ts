import { GOALS, LANGUAGES, PERSONALITY_TRAITS } from '../../constants';
import { Wealth } from '../../types';
import type { NPC } from '../../types';
import {
  EVIL_ALIGNMENTS, GOOD_ALIGNMENTS, OCCUPATION_APPEARANCE_MARKERS,
  OCCUPATION_BUILD, WEALTH_TO_INCOME, goalCategoriesFor, socialStatusFor,
} from './rules';
import type { AdventureHookStage, ConsistencyIssue, GenerationConsistencyResult } from './types';
import { CultureResolver,NameValidator } from './name';

function issue(section:ConsistencyIssue['section'],code:string,message:string):ConsistencyIssue{return {section,code,message};}

export const ConsistencyValidator={validate(npc:NPC,context:AdventureHookStage):GenerationConsistencyResult {
  const issues:ConsistencyIssue[]=[];const nameContext={seed:context.options.seed,attempt:context.attempt,race:context.raceData,subrace:context.subraceData,gender:context.gender,occupation:context.occupationData,yearsExperience:context.occupation.yearsExperience,socialStatus:context.socialStatus,personality:context.personality,reputation:context.reputation};const nameValidation=NameValidator.validate(context.nameIdentity,CultureResolver.resolve(nameContext),nameContext);if(!nameValidation.valid)issues.push(issue('name','INVALID_NAME',nameValidation.issues.map(item=>item.message).join(' ')));const ancestry=context.subraceData??context.raceData;const adult=ancestry.adultAge??18;const lifespan=ancestry.typicalLifespan;
  if(npc.age<adult||(lifespan!==null&&npc.age>=lifespan))issues.push(issue('age','AGE_OUT_OF_RANGE',`Age must be between adulthood (${adult}) and the typical lifespan.`));

  const careerCapacity=Math.max(0,npc.age-adult);
  if(npc.occupation.yearsExperience<0||npc.occupation.yearsExperience>careerCapacity)issues.push(issue('occupation','CAREER_EXCEEDS_AGE','Career experience exceeds available adult years.'));
  if(npc.occupation.incomeLevel!==WEALTH_TO_INCOME[context.occupationData.wealthTendency])issues.push(issue('occupation','INCOME_OCCUPATION_MISMATCH','Income must follow occupational earning tendency.'));
  const expectedBuild=OCCUPATION_BUILD[context.occupationData.category];if(expectedBuild&&npc.bodyBuild!==expectedBuild)issues.push(issue('occupation','BODY_CAREER_MISMATCH','Body build must reflect sustained occupational demands.'));

  const wealthOrder=[Wealth.Destitute,Wealth.Poor,Wealth.Modest,Wealth.Comfortable,Wealth.Wealthy,Wealth.Rich,Wealth.VeryRich,Wealth.Opulent];
  if(Math.abs(wealthOrder.indexOf(context.occupationData.wealthTendency)-wealthOrder.indexOf(npc.wealth))>1)issues.push(issue('wealth','IMPOSSIBLE_OCCUPATION_WEALTH','Wealth is outside the plausible range for the occupation.'));
  if(npc.socialStatus!==socialStatusFor(npc.wealth,context.occupationData.category))issues.push(issue('socialStatus','STATUS_CONTEXT_MISMATCH','Social status must follow occupation and wealth.'));

  if(context.deity&&((GOOD_ALIGNMENTS.has(npc.alignment)&&EVIL_ALIGNMENTS.has(context.deity.alignment))||(EVIL_ALIGNMENTS.has(npc.alignment)&&GOOD_ALIGNMENTS.has(context.deity.alignment))))issues.push(issue('religion','RELIGION_ALIGNMENT_CONTRADICTION','Faith and alignment are directly opposed without supporting context.'));

  const ancestryLanguageNames=[...context.raceData.commonLanguageIds,...(context.subraceData?.commonLanguageIds??[])].map(id=>LANGUAGES.find(language=>language.id===id)?.name??id);
  if(!ancestryLanguageNames.some(language=>npc.languages.includes(language)))issues.push(issue('languages','MISSING_ANCESTRY_LANGUAGE','At least one ancestry language must be retained.'));
  if(context.occupationData.category==='magic'&&!npc.languages.includes('Draconic'))issues.push(issue('languages','MISSING_PROFESSIONAL_LANGUAGE','Arcane work requires its selected professional language.'));

  const tags=npc.personality.traits.map(trait=>PERSONALITY_TRAITS.find(item=>item.label===trait)?.tag);
  if(tags.some(tag=>tag===undefined))issues.push(issue('personality','UNKNOWN_TRAIT','Every trait must come from the typed trait catalog.'));
  if(GOOD_ALIGNMENTS.has(npc.alignment)&&tags.includes('negative'))issues.push(issue('personality','GOOD_ALIGNMENT_CONTRADICTION','Good-aligned personality contains a strongly negative trait.'));
  if(EVIL_ALIGNMENTS.has(npc.alignment)&&tags.filter(tag=>tag==='positive').length>1)issues.push(issue('personality','EVIL_ALIGNMENT_CONTRADICTION','Evil-aligned personality is implausibly self-sacrificing.'));
  if(!npc.personality.habits.some(habit=>habit.toLowerCase().includes(context.occupationData.title.toLowerCase())))issues.push(issue('personality','PERSONALITY_CAREER_DISCONNECT','Daily personality habits must reflect occupation.'));

  const expectedMarkers=OCCUPATION_APPEARANCE_MARKERS[context.occupationData.category]??[];
  if(expectedMarkers.length>0&&!expectedMarkers.some(marker=>npc.appearance.distinguishingFeatures.includes(marker)))issues.push(issue('appearance','OCCUPATION_APPEARANCE_MISMATCH','Appearance lacks a believable occupational marker.'));

  if(npc.relationships.student&&npc.occupation.yearsExperience<12)issues.push(issue('relationships','IMPLAUSIBLE_STUDENT','A professional student requires sufficient career experience.'));
  if(npc.relationships.mentor&&npc.occupation.yearsExperience>=12)issues.push(issue('relationships','IMPLAUSIBLE_MENTOR','An established expert should not retain a default career mentor relationship.'));
  if(npc.maritalStatus!=='single'&&npc.age<adult+2)issues.push(issue('relationships','IMPLAUSIBLE_MARRIAGE','The relationship timeline is too short for the ancestry and age.'));
  if(!npc.relationships.ally?.description.includes(context.occupationData.category))issues.push(issue('relationships','RELATIONSHIP_CAREER_DISCONNECT','Professional relationships must reflect the current career context.'));

  if(npc.backstory.length!==10)issues.push(issue('backstory','BACKSTORY_LENGTH','Backstory must contain exactly ten chapters.'));
  const chapterTitles=['Birth & Childhood','Family','Education','First Major Event','Career','Relationships','Greatest Conflict','Greatest Achievement','Recent Events','Current Situation'];
  npc.backstory.forEach((section,index)=>{if(section.title!==chapterTitles[index])issues.push(issue('backstory','BACKSTORY_ORDER',`Chapter ${index+1} has an invalid title or position.`));if(!section.selectedResult||![section.beginning,section.development,section.climax,section.ending].every(stage=>section.selectedResult?.includes(stage)))issues.push(issue('backstory','INCOMPLETE_CHAPTER','Every selected stage must appear in the assembled chapter.'));});
  if(new Set(npc.backstory.map(section=>section.selectedResult)).size!==10)issues.push(issue('backstory','DUPLICATED_EVENT','Backstory chapters must not duplicate events.'));
  if(!npc.backstory.some(section=>section.development.toLowerCase().includes(context.occupationData.title.toLowerCase())||section.ending.toLowerCase().includes(context.occupationData.title.toLowerCase())))issues.push(issue('backstory','BACKSTORY_CAREER_DISCONNECT','Backstory must explain the current career.'));
  if(context.deity&&!npc.backstory.some(section=>`${section.beginning} ${section.development}`.includes(context.deity?.name??'')))issues.push(issue('backstory','BACKSTORY_RELIGION_DISCONNECT','Backstory must connect faith to upbringing or later conviction.'));

  const selectedGoal=GOALS.find(goal=>goal.description===npc.goal.currentGoal);const allowedGoals=goalCategoriesFor(npc.alignment,context.occupationData.category,Boolean(context.deity));
  if(!selectedGoal||!allowedGoals.includes(selectedGoal.category))issues.push(issue('goal','GOAL_CONTEXT_MISMATCH','Goal must follow alignment, occupation, and faith context.'));
  const goalText=npc.goal.currentGoal.toLowerCase();if(!npc.secret.description.toLowerCase().includes(goalText))issues.push(issue('secret','SECRET_NOT_CONNECTED','The secret must directly complicate the current goal.'));
  for(const hook of npc.adventureHooks){const summary=hook.summary.toLowerCase();if(!summary.includes(context.occupationData.title.toLowerCase())||!summary.includes(goalText)||!summary.includes('secret'))issues.push(issue('adventureHooks','HOOK_NOT_CONNECTED','Every hook must use occupation, goal, relationship, and secret context.'));}
  return {valid:issues.length===0,issues};
}} as const;
