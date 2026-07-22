import { RELIGIONS } from '../../constants';
import { unit, weightedPick } from './deterministic';
import { EVIL_ALIGNMENTS, GOOD_ALIGNMENTS } from './rules';
import type { ReligionStage, SocialStatusStage } from './types';

function moralCompatibility(left:SocialStatusStage['alignment'],right:SocialStatusStage['alignment']):number {
  if(GOOD_ALIGNMENTS.has(left)&&GOOD_ALIGNMENTS.has(right))return 5;
  if(EVIL_ALIGNMENTS.has(left)&&EVIL_ALIGNMENTS.has(right))return 5;
  if((GOOD_ALIGNMENTS.has(left)&&EVIL_ALIGNMENTS.has(right))||(EVIL_ALIGNMENTS.has(left)&&GOOD_ALIGNMENTS.has(right)))return .05;
  return 1;
}

export const ReligionGenerator={generate(context:SocialStatusStage):ReligionStage {
  const observesFaith=context.occupationData.category==='religion'||unit(context.options.seed,'religion:observance',context.attempt)>.18;
  const requested=context.options.religionId?RELIGIONS.find(item=>item.id===context.options.religionId):undefined;if(context.options.religionId&&!requested)throw new Error('The requested religion is not available.');
  const deity=requested??(observesFaith?weightedPick(RELIGIONS,item=>moralCompatibility(context.alignment,item.alignment)*(item.followers.some(follower=>follower.toLowerCase().includes(context.occupationData.category))?3:1)*(item.followers.some(follower=>follower.toLowerCase().includes(context.raceData.name.toLowerCase()))?4:1),context.options.seed,'religion',context.attempt):null);
  return {...context,deity};
}} as const;
