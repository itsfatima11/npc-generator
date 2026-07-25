import { FamilyStatus, MaritalStatus, RelationshipType } from '../../types';
import { integerBetween, pick } from './deterministic';
import type { PersonReference, Relationship } from '../../types';
import type { NameStage, RelationshipStage } from './types';

const GIVEN_NAMES=['Adra','Borin','Cassa','Dain','Elira','Fen','Garen','Hale','Iria','Jora','Kellen','Lysa','Marek','Neris','Orin','Pella'];
function person(context:NameStage,scope:string,index=0):PersonReference{return {id:`${context.options.seed}-${scope}-${index}`,name:pick(GIVEN_NAMES,context.options.seed,`${scope}:${index}`,context.attempt),notes:`Connected through ${context.occupationData.category} or family life.`};}
function relation<T extends RelationshipType>(context:NameStage,type:T,scope:string,index=0):Relationship<T>{const faith=context.deity?` and a connection to ${context.deity.name}`:'';return {person:person(context,scope,index),type,description:`A ${type.replaceAll('-',' ')} relationship shaped by shared history, ${context.wealth.replaceAll('-',' ')} means, and ${context.occupationData.category} circumstances${faith}.`};}
export const RelationshipGenerator={generate(context:NameStage):RelationshipStage {
  const ancestry=context.subraceData??context.raceData;const adult=ancestry.adultAge??18;const adulthood=context.age-adult;
  const parentCount=context.age>(ancestry.typicalLifespan??100)*.85?integerBetween(0,1,context.options.seed,'parents',context.attempt):integerBetween(1,2,context.options.seed,'parents',context.attempt);
  const siblingCount=integerBetween(0,3,context.options.seed,'siblings',context.attempt);
  const parents=Array.from({length:parentCount},(_,i)=>relation(context,RelationshipType.Parent,'parent',i));const siblings=Array.from({length:siblingCount},(_,i)=>relation(context,RelationshipType.Sibling,'sibling',i));
  const romantic=adulthood>=2&&context.socialStatus!=='hermit'?relation(context,RelationshipType.RomanticInterest,'romance'):null;
  const maritalStatus=romantic?(adulthood>8?pick([MaritalStatus.Married,MaritalStatus.Courting,MaritalStatus.Engaged],context.options.seed,'marital',context.attempt):MaritalStatus.Courting):MaritalStatus.Single;
  const relationships={parents,siblings,bestFriend:relation(context,RelationshipType.BestFriend,'friend'),ally:relation(context,RelationshipType.Ally,'ally'),rival:context.occupation.yearsExperience>2?relation(context,RelationshipType.Rival,'rival'):null,enemy:context.alignment.includes('evil')?relation(context,RelationshipType.Enemy,'enemy'):null,mentor:context.occupation.yearsExperience<12?relation(context,RelationshipType.Mentor,'mentor'):null,student:context.occupation.yearsExperience>=12?relation(context,RelationshipType.Student,'student'):null,romanticInterest:romantic};
  const familyStatus=parents.length+siblingCount>0?FamilyStatus.Close:FamilyStatus.Unknown;return {...context,relationships,maritalStatus,familyStatus};
}} as const;
