import { OCCUPATIONS } from '../../constants';
import { OCCUPATION_BUILD, WEALTH_TO_INCOME } from './rules';
import { weightedPick } from './deterministic';
import type { OccupationStage, PhysicalStage } from './types';

const EDUCATION_YEARS: Readonly<Record<string,number>> = {none:0,informal:1,apprenticeship:4,literate:3,scholarly:8,specialist:6};
export const OccupationGenerator = {
  generate(context: PhysicalStage): OccupationStage {
    const adultAge = (context.subraceData ?? context.raceData).adultAge ?? 18;
    const workingYears = Math.max(0,context.age-adultAge);
    const eligible = OCCUPATIONS.filter(item => EDUCATION_YEARS[item.requiredEducation] <= workingYears);
    const requested=context.options.occupationId?eligible.find(item=>item.id===context.options.occupationId):undefined;if(context.options.occupationId&&!requested)throw new Error('The requested occupation requires more training than this NPC’s age allows.');
    const occupationData = requested??weightedPick(eligible,item => {
      const ancestryAffinity = context.raceData.commonOccupationIds.includes(item.id) || context.subraceData?.commonOccupationIds.includes(item.id) ? 8 : 1;
      const ageFitness = item.requiredEducation === 'scholarly' && workingYears < 12 ? .25 : 1;
      return ancestryAffinity*ageFitness;
    },context.options.seed,'occupation',context.attempt);
    const experienceCap = Math.max(0,workingYears-EDUCATION_YEARS[occupationData.requiredEducation]);
    const yearsExperience = Math.min(experienceCap,Math.floor(workingYears*(.35+.55*((context.age%11)/10))));
    const occupation = {
      title:occupationData.title, position:yearsExperience>20?'senior practitioner':yearsExperience>7?'established practitioner':'junior practitioner',
      yearsExperience, workplace:`a ${occupationData.category} workplace`, employer:occupationData.category==='nobility'?'a noble household':null,
      incomeLevel:WEALTH_TO_INCOME[occupationData.wealthTendency], dailyRoutine:`Performs the regular duties of a ${occupationData.title.toLowerCase()} and maintains professional contacts.`,
      careerReason:`Entered the profession through ${occupationData.requiredEducation === 'apprenticeship'?'an apprenticeship':'circumstance and aptitude'}.`,
      workReputation:`Known as a ${occupationData.socialRespect} ${occupationData.title.toLowerCase()}.`,
      greatestAchievement:`Completed a demanding ${occupationData.category} undertaking that earned lasting recognition.`,
    } as const;
    return {...context,occupationData,occupation,bodyBuild:OCCUPATION_BUILD[occupationData.category]??context.bodyBuild};
  },
} as const;
