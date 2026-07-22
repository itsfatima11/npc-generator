import { LANGUAGES } from '../../constants';
import { pick } from './deterministic';
import type { LanguageStage, ReligionStage } from './types';

export const LanguageGenerator={generate(context:ReligionStage):LanguageStage { const ids=new Set<string>(['common',...context.raceData.commonLanguageIds,...(context.subraceData?.commonLanguageIds??[])]);if(context.occupationData.category==='magic')ids.add('draconic');if(context.occupationData.category==='religion'&&context.deity)ids.add(context.deity.alignment.includes('evil')?'infernal':'celestial');if(['scholarly','specialist'].includes(context.occupationData.requiredEducation)){const extra=pick(LANGUAGES.filter(l=>l.category!=='secret'),context.options.seed,'language:extra',context.attempt);ids.add(extra.id);}const languages=[...ids].map(id=>LANGUAGES.find(l=>l.id===id)?.name??id);return {...context,languages};}} as const;
