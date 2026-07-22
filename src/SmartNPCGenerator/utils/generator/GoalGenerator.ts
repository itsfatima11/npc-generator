import { GOALS } from '../../constants';
import { weightedPick } from './deterministic';
import { goalCategoriesFor } from './rules';
import type { BackstoryStage, GoalStage } from './types';

export const GoalGenerator={generate(context:BackstoryStage):GoalStage {
  const categories=goalCategoriesFor(context.alignment,context.occupationData.category,Boolean(context.deity));
  const candidates=GOALS.filter(goal=>categories.includes(goal.category));const ancestry=context.subraceData??context.raceData;const lifeRatio=context.age/(ancestry.typicalLifespan??100);
  const selected=weightedPick(candidates,goal=>lifeRatio<.3?(goal.category==='personal'||goal.category==='survival'?4:1):lifeRatio>.65?(goal.category==='family'||goal.category==='knowledge'?4:1):1,context.options.seed,'goal',context.attempt);
  const important=context.relationships.bestFriend?.person.name??context.relationships.parents[0]?.person.name??'their community';
  return {...context,goal:{currentGoal:selected.description,motivation:`${context.backstorySignals.goalCause}; the recent crisis threatens ${important} and everything earned through ${context.occupationData.title.toLowerCase()} work.`,obstacle:`Their ${context.personality.greatestWeakness} and ${context.backstorySignals.centralConflict.toLowerCase()} restrict their options.`}};
}} as const;
