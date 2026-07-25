import { Alignment, BodyBuild, IncomeLevel, SocialStatus, Wealth } from '../../types';
import type { GoalCategory, HookCategory, OccupationCategory, TraitTag } from '../../types';

export const GOOD_ALIGNMENTS = new Set<Alignment>([Alignment.LawfulGood, Alignment.NeutralGood, Alignment.ChaoticGood]);
export const EVIL_ALIGNMENTS = new Set<Alignment>([Alignment.LawfulEvil, Alignment.NeutralEvil, Alignment.ChaoticEvil]);
export const LAWFUL_ALIGNMENTS = new Set<Alignment>([Alignment.LawfulGood, Alignment.LawfulNeutral, Alignment.LawfulEvil]);

export const WEALTH_TO_INCOME: Readonly<Record<Wealth, IncomeLevel>> = {
  [Wealth.Destitute]: IncomeLevel.None, [Wealth.Poor]: IncomeLevel.Low,
  [Wealth.Modest]: IncomeLevel.Moderate, [Wealth.Comfortable]: IncomeLevel.Moderate,
  [Wealth.Wealthy]: IncomeLevel.High, [Wealth.Rich]: IncomeLevel.High,
  [Wealth.VeryRich]: IncomeLevel.Exceptional, [Wealth.Opulent]: IncomeLevel.Exceptional,
};

export const OCCUPATION_BUILD: Readonly<Partial<Record<OccupationCategory, BodyBuild>>> = {
  military: BodyBuild.Athletic, crafting: BodyBuild.Muscular, nature: BodyBuild.Lean,
  travel: BodyBuild.Athletic, education: BodyBuild.Slim, magic: BodyBuild.Slender,
};

export const OCCUPATION_APPEARANCE_MARKERS: Readonly<Partial<Record<OccupationCategory,readonly string[]>>> = {
  crafting:['burn marks','powerful forearms','work-worn hands'], commerce:['fine boots','carefully maintained clothes','a discreet piece of jewelry'],
  military:['old scars','armor pressure marks','a trained posture'], education:['ink-stained fingers','a slight stoop','tired eyes'],
  nature:['weathered skin','practical leather layers','small wilderness scars'], travel:['sun-darkened skin','road dust','well-worn boots'],
  medicine:['clean hands','herbal scent','carefully rolled sleeves'], magic:['arcane stains','singed cuffs','an intense gaze'],
};

export function traitTagsFor(alignment: Alignment): readonly TraitTag[] {
  if (GOOD_ALIGNMENTS.has(alignment)) return ['positive','positive','neutral'];
  if (EVIL_ALIGNMENTS.has(alignment)) return ['negative','negative','neutral'];
  return ['positive','neutral','negative'];
}

export function goalCategoriesFor(alignment: Alignment, occupation: OccupationCategory, religious: boolean): readonly GoalCategory[] {
  const moral: GoalCategory = GOOD_ALIGNMENTS.has(alignment) ? 'good' : EVIL_ALIGNMENTS.has(alignment) ? 'evil' : 'neutral';
  const career: GoalCategory = occupation === 'government' || occupation === 'nobility' ? 'political' : occupation === 'commerce' || occupation === 'crime' ? 'financial' : occupation === 'education' || occupation === 'magic' ? 'knowledge' : occupation === 'religion' ? 'religious' : 'personal';
  return religious ? [moral, career, 'religious', 'family', 'survival'] : [moral, career, 'personal', 'family', 'survival'];
}

export function hookCategoriesFor(occupation: OccupationCategory, hasReligion: boolean): readonly HookCategory[] {
  const career: Partial<Record<OccupationCategory, HookCategory>> = { military:'combat', crime:'crime', magic:'magic', religion:'religious', government:'political', nobility:'political', nature:'exploration', travel:'exploration', education:'mystery' };
  return [career[occupation] ?? 'social', hasReligion ? 'religious' : 'mystery', 'survival'];
}

export function socialStatusFor(wealth: Wealth, occupation: OccupationCategory): SocialStatus {
  if (occupation === 'crime') return SocialStatus.Criminal;
  if (occupation === 'nobility') return wealth === Wealth.VeryRich || wealth === Wealth.Opulent ? SocialStatus.Royalty : SocialStatus.Noble;
  if (wealth === Wealth.Destitute) return SocialStatus.Outcast;
  if (wealth === Wealth.Poor) return SocialStatus.LowerClass;
  if (wealth === Wealth.Modest) return SocialStatus.WorkingClass;
  if (wealth === Wealth.Comfortable) return SocialStatus.MiddleClass;
  return SocialStatus.UpperClass;
}
