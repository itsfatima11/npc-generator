import { Gender } from '../../types';
import { pick } from './deterministic';
import type { GenderStage, SubraceStage } from './types';

const GENDERS = Object.values(Gender).filter(value => value !== Gender.Unknown);
export const GenderGenerator = {
  generate(context: SubraceStage): GenderStage {
    return { ...context, gender: context.options.gender ?? pick(GENDERS, context.options.seed, 'gender', context.attempt) };
  },
} as const;
