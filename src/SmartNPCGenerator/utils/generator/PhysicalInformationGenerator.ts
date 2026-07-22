import { BodyBuild, HeightUnit, WeightUnit } from '../../types';
import { integerBetween, pick } from './deterministic';
import type { AgeStage, PhysicalStage } from './types';

const BUILDS = [BodyBuild.Slim,BodyBuild.Lean,BodyBuild.Average,BodyBuild.Athletic,BodyBuild.Stocky,BodyBuild.Heavy];
const VOICES = ['soft and measured','low and resonant','bright and quick','rough and clipped','warm and deliberate','quiet and breathy'] as const;
export const PhysicalInformationGenerator = {
  generate(context: AgeStage): PhysicalStage {
    const ancestry = context.subraceData ?? context.raceData;
    const heightInches = integerBetween(ancestry.heightInches.min,ancestry.heightInches.max,context.options.seed,'height',context.attempt);
    const weight = integerBetween(ancestry.weightPounds.min,ancestry.weightPounds.max,context.options.seed,'weight',context.attempt);
    return {
      ...context,
      height:{value:Number((heightInches/12).toFixed(2)),unit:HeightUnit.Foot}, weight:{value:weight,unit:WeightUnit.Pound},
      bodyBuild:pick(BUILDS,context.options.seed,'body-build',context.attempt),
      voice:pick(VOICES,context.options.seed,'voice',context.attempt), accent:`a ${ancestry.name.toLowerCase()} regional cadence`,
    };
  },
} as const;
