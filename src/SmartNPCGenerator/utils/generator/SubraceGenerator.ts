import { SUBRACES } from '../../constants';
import { pick } from './deterministic';
import type { RaceStage, SubraceStage } from './types';

export const SubraceGenerator = {
  generate(context: RaceStage): SubraceStage {
    const candidates = SUBRACES.filter(subrace => subrace.parentRaceId === context.raceData.id);
    const requested = context.options.subraceId ? candidates.find(subrace => subrace.id === context.options.subraceId) : undefined;
    if (context.options.subraceId && !requested) throw new Error(`Subrace ${context.options.subraceId} is not valid for ${context.raceData.name}`);
    const subraceData=requested ?? (candidates.length>0?pick(candidates,context.options.seed,'subrace',context.attempt):null);
    const alignment=context.options.alignment??(subraceData&&subraceData.commonAlignments.length>0?pick(subraceData.commonAlignments,context.options.seed,'subrace:alignment',context.attempt):context.alignment);
    return {...context,subraceData,alignment};
  },
} as const;
