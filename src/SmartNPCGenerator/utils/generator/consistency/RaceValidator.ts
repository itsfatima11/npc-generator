import { RACES,SUBRACES } from '../../../constants';
import { ancestry,heightInches,knownLanguage,occupation,problem,weightPounds } from './shared';
import type { RealismIssue,SectionValidator } from './types';

export const RaceValidator:SectionValidator=({npc})=>{
  const data=ancestry(npc);
  if(!data)return[problem('race','loreAccuracy','UNKNOWN_RACE','Race or subrace is absent from the official data catalog.',20,'critical')];
  const issues:RealismIssue[]=[];
  if(npc.subrace){const race=RACES.find(item=>item.name===npc.race),subrace=SUBRACES.find(item=>item.name===npc.subrace);if(!race||!subrace||subrace.parentRaceId!==race.id)issues.push(problem('race','loreAccuracy','SUBRACE_PARENT_MISMATCH','The selected subrace does not belong to the selected race.',14));}
  const height=heightInches(npc),weight=weightPounds(npc);
  if(height<data.heightInches.min||height>data.heightInches.max)issues.push(problem('race','loreAccuracy','ANCESTRY_HEIGHT','Height is outside the ancestry range.',12));
  if(weight<data.weightPounds.min||weight>data.weightPounds.max)issues.push(problem('race','loreAccuracy','ANCESTRY_WEIGHT','Weight is outside the ancestry range.',12));
  if(npc.languages.some(value=>!knownLanguage(value)))issues.push(problem('race','loreAccuracy','UNKNOWN_LANGUAGE','One or more languages are not in the official language catalog.',8));
  const work=occupation(npc);
  if(work&&data.commonOccupationIds.length>0&&!data.commonOccupationIds.some(id=>id===work.id))issues.push(problem('occupation','occupationAccuracy','UNCOMMON_OCCUPATION','Occupation is culturally uncommon and needs supporting backstory.',3,'warning'));
  if(!npc.languages.some(language=>data.commonLanguageIds.some(id=>language.toLowerCase().replace(/\s/g,'-')===id)))issues.push(problem('race','loreAccuracy','MISSING_ANCESTRY_LANGUAGE','No ancestry language is represented.',10));
  return issues;
};
