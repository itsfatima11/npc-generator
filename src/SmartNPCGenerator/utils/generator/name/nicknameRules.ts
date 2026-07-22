import type { NameGenerationContext } from './types';
export type NicknameTone='positive'|'neutral'|'negative';
const POSITIVE=['brave','trueheart','bright','steady','devout','merciful','gallant','cheerful','unbroken','fearless'];const NEGATIVE=['blackblade','one-eye','grim','cold','doom','skull','spider','exile'];
function classifiedTone(nickname:string):NicknameTone{const value=nickname.toLowerCase();if(POSITIVE.some(marker=>value.includes(marker)))return 'positive';if(NEGATIVE.some(marker=>value.includes(marker)))return 'negative';return 'neutral';}
export function personalityTone(context:NameGenerationContext):NicknameTone{const text=`${context.personality.traits.join(' ')} ${context.reputation}`.toLowerCase();if(text.includes('compassionate')||text.includes('courageous')||text.includes('loyal')||text.includes('prestigious'))return 'positive';if(text.includes('cruel')||text.includes('arrogant')||text.includes('deceitful')||text.includes('reviled'))return 'negative';return 'neutral';}
export function nicknameFits(nickname:string,tone:NicknameTone):boolean{const candidate=classifiedTone(nickname);return candidate==='neutral'||candidate===tone;}
