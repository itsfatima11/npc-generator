import type { AdventureHookStage, ConsistencyIssue, GenerationOptions, GenerationResult } from './types';
import { NameGenerator } from './name';
import { RaceGenerator } from './RaceGenerator';import { SubraceGenerator } from './SubraceGenerator';import { GenderGenerator } from './GenderGenerator';import { AgeGenerator } from './AgeGenerator';import { PhysicalInformationGenerator } from './PhysicalInformationGenerator';import { OccupationGenerator } from './OccupationGenerator';import { WealthGenerator } from './WealthGenerator';import { SocialStatusGenerator } from './SocialStatusGenerator';import { ReligionGenerator } from './ReligionGenerator';import { LanguageGenerator } from './LanguageGenerator';import { AppearanceGenerator } from './AppearanceGenerator';import { PersonalityGenerator } from './PersonalityGenerator';import { RelationshipGenerator } from './RelationshipGenerator';import { BackstoryGenerator } from './BackstoryGenerator';import { GoalGenerator } from './GoalGenerator';import { SecretGenerator } from './SecretGenerator';import { AdventureHookGenerator } from './AdventureHookGenerator';import { NPCAssembler } from './NPCAssembler';import { ConsistencyValidator } from './ConsistencyValidator';

const MAX_SECTION_RETRIES=8;
function build(options:GenerationOptions,attempt=0):AdventureHookStage {
  const race=RaceGenerator.generate({options,attempt});const subrace=SubraceGenerator.generate(race);const gender=GenderGenerator.generate(subrace);const age=AgeGenerator.generate(gender);const physical=PhysicalInformationGenerator.generate(age);const occupation=OccupationGenerator.generate(physical);const wealth=WealthGenerator.generate(occupation);const social=SocialStatusGenerator.generate(wealth);const religion=ReligionGenerator.generate(social);const languages=LanguageGenerator.generate(religion);const appearance=AppearanceGenerator.generate(languages);const personality=PersonalityGenerator.generate(appearance);const nameIdentity=NameGenerator.generate({seed:options.seed,attempt,race:personality.raceData,subrace:personality.subraceData,gender:personality.gender,occupation:personality.occupationData,yearsExperience:personality.occupation.yearsExperience,socialStatus:personality.socialStatus,personality:personality.personality,reputation:personality.reputation});const named={...personality,nameIdentity,name:nameIdentity.displayName};const relationships=RelationshipGenerator.generate(named);const backstory=BackstoryGenerator.generate(relationships);const goal=GoalGenerator.generate(backstory);const secret=SecretGenerator.generate(goal);return AdventureHookGenerator.generate(secret);
}

function repairSection(context:AdventureHookStage,problem:ConsistencyIssue,attempt:number):AdventureHookStage {
  const retry={...context,attempt};
  switch(problem.section){
    case 'name':{const nameIdentity=NameGenerator.generate({seed:context.options.seed,attempt,race:context.raceData,subrace:context.subraceData,gender:context.gender,occupation:context.occupationData,yearsExperience:context.occupation.yearsExperience,socialStatus:context.socialStatus,personality:context.personality,reputation:context.reputation});return {...context,attempt,nameIdentity,name:nameIdentity.displayName};}
    case 'occupation':{const result=OccupationGenerator.generate(retry);return {...context,attempt,occupationData:result.occupationData,occupation:result.occupation,bodyBuild:result.bodyBuild};}
    case 'wealth':{const result=WealthGenerator.generate(retry);return {...context,attempt,wealth:result.wealth,residence:result.residence};}
    case 'socialStatus':{const result=SocialStatusGenerator.generate(retry);return {...context,attempt,socialStatus:result.socialStatus,education:result.education,reputation:result.reputation,voice:result.voice};}
    case 'religion':return {...context,attempt,deity:ReligionGenerator.generate(retry).deity};
    case 'languages':return {...context,attempt,languages:LanguageGenerator.generate(retry).languages};
    case 'appearance':return {...context,attempt,appearance:AppearanceGenerator.generate(retry).appearance};
    case 'personality':return {...context,attempt,personality:PersonalityGenerator.generate(retry).personality};
    case 'relationships':{const result=RelationshipGenerator.generate(retry);return {...context,attempt,relationships:result.relationships,maritalStatus:result.maritalStatus,familyStatus:result.familyStatus};}
    case 'backstory':{const result=BackstoryGenerator.generate(retry);return {...context,attempt,personality:result.personality,occupation:result.occupation,reputation:result.reputation,backstory:result.backstory,birthplace:result.birthplace,backstoryBiography:result.backstoryBiography,backstorySignals:result.backstorySignals};}
    case 'goal':return {...context,attempt,goal:GoalGenerator.generate(retry).goal};
    case 'secret':return {...context,attempt,secret:SecretGenerator.generate(retry).secret};
    case 'adventureHooks':return {...context,attempt,adventureHooks:AdventureHookGenerator.generate(retry).adventureHooks};
    case 'age':case 'race':throw new Error(`Invariant failure in ${problem.section}: ${problem.message}`);
  }
}

export const SmartGenerationEngine={generate(options:GenerationOptions):GenerationResult {
  if(!options.seed.trim())throw new Error('A non-empty seed is required for reproducible smart generation.');
  let context=build(options);let npc=NPCAssembler.assemble(context);let validation=ConsistencyValidator.validate(npc,context);let retry=0;
  while(!validation.valid&&retry<MAX_SECTION_RETRIES){retry+=1;const sections=[...new Set(validation.issues.map(item=>item.section))];for(const section of sections){const problem=validation.issues.find(item=>item.section===section);if(problem)context=repairSection(context,problem,retry);}npc=NPCAssembler.assemble(context);validation=ConsistencyValidator.validate(npc,context);}
  if(!validation.valid)throw new Error(`NPC consistency validation failed after targeted retries: ${validation.issues.map(item=>item.code).join(', ')}`);
  return {npc,validation,seed:options.seed};
}} as const;
