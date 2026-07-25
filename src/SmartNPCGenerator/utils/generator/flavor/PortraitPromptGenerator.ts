import { first,words } from './context';
import { OCCUPATION_EQUIPMENT } from './catalog';
import type { FlavorContext,PortraitPrompt } from './types';

export const PortraitPromptGenerator={generate(context:FlavorContext):PortraitPrompt{
  const n=context.npc,a=n.appearance;
  const equipment=first(OCCUPATION_EQUIPMENT[context.occupationCategory]??[],`${n.occupation.title.toLowerCase()} tools`);
  const features=[...a.distinguishingFeatures,...a.scars,...a.tattoos].filter(Boolean).join(', ')||'natural facial detail';
  const ancestry=n.subrace?`${n.subrace} of ${n.race} ancestry`:n.race;
  const prompt=`Professional fantasy character portrait of ${n.name}, ${n.age}-year-old ${words(n.gender)} ${ancestry}, ${words(n.bodyBuild)} build, ${a.skinColor} skin, ${a.eyeColor} ${a.eyeShape} eyes, ${a.hairLength==='none'?'no hair':`${words(a.hairLength)} ${a.hairColor} ${a.hairStyle} hair`}, ${a.faceShape} face, ${a.nose} nose, ${a.lips} lips, ${features}, ${a.facialExpression} expression, wearing ${a.clothingStyle} with ${a.accessories.join(', ')||equipment}, carrying ${equipment}, visibly a ${n.occupation.title}, composed three-quarter pose, ${context.isWealthy?'refined':'atmospheric'} cinematic lighting, in ${n.residence}, immersive Dungeons & Dragons fantasy atmosphere, natural anatomy, coherent costume design, highly detailed painterly realism, professional concept art, sharp focal detail, rich environmental storytelling.`;
  return {prompt,negativeConstraints:['wrong ancestry','wrong age','wrong gender presentation','modern clothing','science-fiction equipment','extra limbs','contradictory hair or eye color','unearned legendary artifacts','text or watermark']};
}} as const;
