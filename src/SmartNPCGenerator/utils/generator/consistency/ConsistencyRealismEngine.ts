import { FinalValidator } from './FinalValidator';
import type { ConsistencyCandidate,ConsistencyOptions,ConsistencyResult,ConsistencySection,RepairLogEntry } from './types';

function fingerprint(candidate:ConsistencyCandidate,section:ConsistencySection):string {
  const {npc,flavor}=candidate;
  switch(section){
    case 'age':return JSON.stringify(npc.age);
    case 'race':return JSON.stringify([npc.race,npc.subrace,npc.height,npc.weight,npc.languages,npc.name,npc.accent]);
    case 'occupation':return JSON.stringify([npc.occupation,npc.education,npc.wealth,npc.socialStatus,npc.bodyBuild,npc.reputation]);
    case 'appearance':return JSON.stringify(npc.appearance);
    case 'religion':return JSON.stringify(npc.religion);
    case 'relationships':return JSON.stringify([npc.relationships,npc.maritalStatus,npc.familyStatus]);
    case 'backstory':return JSON.stringify([npc.backstory,npc.birthplace]);
    case 'personality':return JSON.stringify(npc.personality);
    case 'goal':return JSON.stringify(npc.goal);
    case 'secret':return JSON.stringify(npc.secret);
    case 'adventureHooks':return JSON.stringify(npc.adventureHooks);
    case 'inventory':return JSON.stringify(flavor.inventory);
    case 'residence':return JSON.stringify([npc.residence,flavor.residence]);
    case 'voice':return JSON.stringify([npc.voice,flavor.voice]);
    case 'quote':return JSON.stringify(flavor.quote);
    case 'dmNotes':return JSON.stringify(flavor.dmNotes);
    case 'dailyRoutine':return JSON.stringify(flavor.dailyRoutine);
    case 'mannerisms':return JSON.stringify(flavor.mannerisms);
    case 'portraitPrompt':return JSON.stringify(flavor.portraitPrompt);
  }
}
const allSections:readonly ConsistencySection[]=['age','race','occupation','appearance','religion','relationships','backstory','personality','goal','secret','adventureHooks','inventory','residence','voice','quote','dmNotes','dailyRoutine','mannerisms','portraitPrompt'];
interface CandidateSnapshot {readonly immutable:string;readonly sections:Readonly<Record<ConsistencySection,string>>}
function snapshot(candidate:ConsistencyCandidate):CandidateSnapshot{return {immutable:JSON.stringify([candidate.npc.id,candidate.npc.gender,candidate.npc.alignment]),sections:Object.fromEntries(allSections.map(section=>[section,fingerprint(candidate,section)])) as Record<ConsistencySection,string>};}
function assertTargeted(before:CandidateSnapshot,after:ConsistencyCandidate,target:ConsistencySection):void {
  if(before.immutable!==JSON.stringify([after.npc.id,after.npc.gender,after.npc.alignment]))throw new Error('Repair adapter changed immutable NPC identity fields.');
  const changed=allSections.filter(section=>before.sections[section]!==fingerprint(after,section));
  const unexpected=changed.filter(section=>section!==target);
  if(unexpected.length)throw new Error(`Repair adapter changed unrelated sections while repairing ${target}: ${unexpected.join(', ')}`);
}

export const ConsistencyRealismEngine={validateAndRepair(initial:ConsistencyCandidate,options:ConsistencyOptions):ConsistencyResult {
  const target=Math.min(100,Math.max(0,options.qualityTarget??90));
  const maximum=Math.min(5,Math.max(0,options.maximumRepairPasses??5));
  let candidate=initial,issues=FinalValidator.validate(initial),passes=0;
  let score=FinalValidator.score(issues);
  const repairLog:RepairLogEntry[]=[];
  const needsRepair=()=>score.overallScore<target||issues.some(issue=>issue.severity!=='warning');
  while(needsRepair()&&issues.length>0&&passes<maximum){
    passes+=1;
    const failing=[...new Set(issues.filter(issue=>score.overallScore<target||issue.severity!=='warning').map(issue=>issue.section))];
    let changedThisPass=false;
    for(const section of failing){
      const sectionIssues=issues.filter(issue=>issue.section===section);
      if(sectionIssues.length===0)continue;
      const beforeScore=score.overallScore;
      const before=snapshot(candidate);
      const repaired=options.repairAdapter.repair({candidate,section,issues:sectionIssues,pass:passes});
      assertTargeted(before,repaired,section);
      const changed=before.sections[section]!==fingerprint(repaired,section);
      candidate=repaired;issues=FinalValidator.validate(candidate);score=FinalValidator.score(issues);
      repairLog.push({pass:passes,section,issueCodes:sectionIssues.map(issue=>issue.code),scoreBefore:beforeScore,scoreAfter:score.overallScore,changed});
      changedThisPass ||= changed;
      if(!needsRepair())break;
    }
    if(!changedThisPass)break;
  }
  const targetMet=score.overallScore>=target;
  return {npc:candidate.npc,flavor:candidate.flavor,validationReport:{valid:targetMet&&!issues.some(issue=>issue.severity!=='warning'),targetMet,issues,passes},qualityScore:score,repairLog};
}} as const;
