import { PERSONALITY_TRAITS } from '../../constants';
import { pickMany } from './deterministic';
import { traitTagsFor } from './rules';
import type { AppearanceStage, PersonalityStage } from './types';

export const PersonalityGenerator={generate(context:AppearanceStage):PersonalityStage {
  const tags=traitTagsFor(context.alignment);const counts=new Map<string,number>();for(const tag of tags)counts.set(tag,(counts.get(tag)??0)+1);
  const traits=[...counts.entries()].flatMap(([tag,count])=>pickMany(PERSONALITY_TRAITS.filter(item=>item.tag===tag),count,context.options.seed,`traits:${tag}`,context.attempt).map(item=>item.label));
  if(traits.length!==3)throw new Error('Personality generation must produce exactly three traits.');
  const faith=context.deity?`the teachings of ${context.deity.name}`:'a personal code shaped by lived experience';
  const strength=traits[0];const weakness=traits.find(trait=>PERSONALITY_TRAITS.find(item=>item.label===trait)?.tag==='negative')??'difficulty asking others for help';
  const personality={traits:[traits[0],traits[1],traits[2]] as const,ideals:[context.alignment.includes('good')?'People deserve protection and a fair chance':context.alignment.includes('evil')?'Control is safer than dependence':'Practical balance prevents needless harm'],bonds:[`Feels responsible for people connected to their work as a ${context.occupationData.title.toLowerCase()}.`,...(context.deity?[`Honors ${context.deity.name} through daily choices.`]:[])],flaws:[weakness],habits:[`Checks ${context.occupationData.title.toLowerCase()} tools before beginning the day.`],likes:[context.occupationData.category,'competent company'],dislikes:['public embarrassment','wasted effort'],fears:[context.wealth=== 'destitute'||context.wealth==='poor'?'losing their remaining security':'failing those who depend on them'],secret:'Keeps part of their private life carefully compartmentalized.',greatestStrength:strength,greatestWeakness:weakness,biggestRegret:`A past ${context.occupationData.category} decision that harmed an important relationship.`,biggestDesire:`To be secure and respected without abandoning ${faith}.`,moralCode:`Guided by ${faith} and a ${context.alignment.replaceAll('-',' ')} view of responsibility.`};
  return {...context,personality};
}} as const;
