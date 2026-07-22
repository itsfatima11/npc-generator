import type { FlavorIssue,FlavorSection,FlavorValidation,NPCFlavor } from './types';import type { NPC } from '../../../types';
function normalize(value:string):string{return value.toLowerCase().replace(/[^a-z0-9]+/g,' ').trim();}
function includes(text:string,value:string|null|undefined):boolean{return !value||normalize(text).includes(normalize(value));}
function issue(section:FlavorSection,code:string,message:string):FlavorIssue{return {section,code,message};}
export const FlavorValidator={validate(npc:NPC,flavor:NPCFlavor):FlavorValidation{const issues:FlavorIssue[]=[];const portrait=flavor.portraitPrompt.prompt;
  if(![npc.race,npc.gender,String(npc.age),npc.bodyBuild,npc.appearance.skinColor,npc.appearance.eyeColor,npc.occupation.title,npc.residence].every(value=>includes(portrait,value)))issues.push(issue('portraitPrompt','PORTRAIT_CONTEXT_MISSING','Portrait prompt must retain ancestry, gender, age, build, appearance, occupation, and environment.'));
  if(flavor.portraitPrompt.negativeConstraints.length===0)issues.push(issue('portraitPrompt','PORTRAIT_UNGUARDED','Portrait prompt requires contradiction guards.'));
  if(flavor.voice.accent!==npc.accent||flavor.voice.speechHabits.length<1)issues.push(issue('voice','VOICE_CONTEXT_MISMATCH','Voice must retain the NPC accent and contextual speech habits.'));
  if(!includes(flavor.quote.text,npc.occupation.title))issues.push(issue('quote','QUOTE_OCCUPATION_MISSING','The memorable quote must reflect the occupation.'));
  if(flavor.mannerisms.length!==5||new Set(flavor.mannerisms.map(value=>value.toLowerCase())).size!==5)issues.push(issue('mannerisms','MANNERISM_CARDINALITY','Mannerisms must contain exactly five unique entries.'));
  if(flavor.inventory.length!==10||new Set(flavor.inventory.map(value=>value.name.toLowerCase())).size!==10)issues.push(issue('inventory','INVENTORY_CARDINALITY','Inventory must contain exactly ten unique items.'));
  if(flavor.inventory.some(value=>!value.description.trim()||!value.reason.trim()))issues.push(issue('inventory','INVENTORY_METADATA','Every item requires a description and reason.'));
  if(flavor.inventory.some(value=>/legendary|artifact|vorpal|holy avenger/i.test(`${value.name} ${value.description}`)))issues.push(issue('inventory','UNJUSTIFIED_LEGENDARY_ITEM','Flavor inventory cannot introduce legendary equipment.'));
  if(!includes(flavor.residence.location,npc.residence)||flavor.residence.importantObjects.length<3)issues.push(issue('residence','RESIDENCE_CONTEXT_MISMATCH','Residence must preserve location and contain meaningful objects.'));
  const routine=Object.values(flavor.dailyRoutine).join(' ');if(!includes(routine,npc.occupation.title)||!includes(routine,npc.goal.currentGoal)||!includes(routine,npc.religion))issues.push(issue('dailyRoutine','ROUTINE_CONTEXT_MISMATCH','Routine must reflect occupation, faith, and current goal.'));
  const notes=Object.values(flavor.dmNotes);if(notes.some(value=>!value.trim())||!includes(notes.join(' '),npc.goal.currentGoal)||!includes(notes.join(' '),npc.secret.description))issues.push(issue('dmNotes','DM_NOTES_CONTEXT_MISMATCH','DM notes must be complete and connect the goal and secret.'));
  return {valid:issues.length===0,issues};
}} as const;
