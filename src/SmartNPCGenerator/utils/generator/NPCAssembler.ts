import { hashSeed } from './deterministic';
import type { NPC } from '../../types';
import type { AdventureHookStage } from './types';

export const NPCAssembler={assemble(context:AdventureHookStage):NPC{return {
  id:`npc-${hashSeed(`${context.options.seed}:${context.raceData.id}`).toString(36)}`,name:context.name,race:context.raceData.name,subrace:context.subraceData?.name??null,
  gender:context.gender,age:context.age,height:context.height,weight:context.weight,bodyBuild:context.bodyBuild,alignment:context.alignment,occupation:context.occupation,
  socialStatus:context.socialStatus,wealth:context.wealth,education:context.education,languages:context.languages,religion:context.deity?.name??null,
  birthplace:context.birthplace,residence:context.residence,maritalStatus:context.maritalStatus,familyStatus:context.familyStatus,voice:context.voice,accent:context.accent,reputation:context.reputation,
  appearance:context.appearance,personality:context.personality,backstory:context.backstory,goal:context.goal,relationships:context.relationships,secret:context.secret,adventureHooks:context.adventureHooks,
};}} as const;
