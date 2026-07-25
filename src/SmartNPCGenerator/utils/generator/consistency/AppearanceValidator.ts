import { ancestry,allText,occupation,problem,wealthRank } from './shared';
import type { RealismIssue,SectionValidator } from './types';

export const AppearanceValidator:SectionValidator=({npc})=>{
  const issues:RealismIssue[]=[],data=ancestry(npc),work=occupation(npc);
  if(!data)return issues;
  if(npc.age>(data.typicalLifespan??npc.age+1)*.75&&!/old|aged|weather|lined|silver|gray|grey|stoop/i.test(allText([npc.appearance.facialExpression,npc.appearance.walkingStyle,npc.appearance.hairColor,...npc.appearance.distinguishingFeatures])))issues.push(problem('appearance','internalConsistency','AGE_NOT_VISIBLE','Late-life appearance has no age marker.',5,'warning'));
  if(work?.physicalDemand==='extreme'&&/frail|slender/.test(npc.bodyBuild))issues.push(problem('appearance','occupationAccuracy','BUILD_DEMAND_MISMATCH','Body build conflicts with extreme physical work.',10));
  if(wealthRank(npc.wealth)<2&&/royal|opulent|gem-encrusted|silk/i.test(npc.appearance.clothingStyle))issues.push(problem('appearance','internalConsistency','CLOTHING_WEALTH_MISMATCH','Clothing exceeds available wealth without explanation.',8));
  return issues;
};
