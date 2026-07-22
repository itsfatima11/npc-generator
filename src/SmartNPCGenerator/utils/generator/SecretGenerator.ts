import { SECRETS } from '../../constants';
import { RiskLevel } from '../../types';
import { pick } from './deterministic';
import type { GoalStage, SecretStage } from './types';

export const SecretGenerator={generate(context:GoalStage):SecretStage {
  const allowed=context.alignment.includes('good')?[RiskLevel.Low,RiskLevel.Moderate,RiskLevel.High]:context.alignment.includes('evil')?[RiskLevel.Moderate,RiskLevel.High,RiskLevel.Critical]:[RiskLevel.Low,RiskLevel.Moderate,RiskLevel.High];
  const source=pick(SECRETS.filter(secret=>allowed.includes(secret.severity)),context.options.seed,'secret',context.attempt);const knower=context.relationships.bestFriend?.person;const faith=context.deity?` and could compromise their standing with followers of ${context.deity.name}`:'';
  const description=`${source.description} It is tied to ${context.backstorySignals.secretCause}${faith}, drives their fear of ${context.personality.fears[0]}, explains why they ${context.personality.habits[0].toLowerCase()}, threatens their work as a ${context.occupationData.title.toLowerCase()}, and complicates the goal to ${context.goal.currentGoal.toLowerCase()}.`;
  return {...context,secret:{description,riskLevel:source.severity,whoKnows:knower?[knower]:[]}};
}} as const;
