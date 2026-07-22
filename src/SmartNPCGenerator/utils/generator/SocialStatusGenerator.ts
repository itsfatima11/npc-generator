import { socialStatusFor } from './rules';
import type { SocialStatusStage, WealthStage } from './types';

export const SocialStatusGenerator = { generate(context:WealthStage):SocialStatusStage {
  const socialStatus=socialStatusFor(context.wealth,context.occupationData.category);
  if(context.options.socialStatus&&context.options.socialStatus!==socialStatus)throw new Error('The requested social status conflicts with occupation and wealth.');
  const education=context.occupationData.requiredEducation;
  const voicePrefix=['royalty','noble','upper-class'].includes(socialStatus)?'cultivated and authoritative':['lower-class','outcast'].includes(socialStatus)?'plainspoken and direct':context.voice;
  return {...context,socialStatus,education,voice:voicePrefix,reputation:`A ${context.occupationData.socialRespect} ${context.occupationData.title.toLowerCase()} of ${socialStatus.replaceAll('-',' ')} standing.`};
} } as const;
