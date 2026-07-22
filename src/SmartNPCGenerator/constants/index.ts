export const APP_NAME = 'Smart NPC Generator';

export const SECTION_IDS = [
  'general-information',
  'appearance',
  'personality',
  'occupation',
  'backstory',
  'goal',
  'relationships',
  'secrets',
  'adventure-hooks',
] as const;

export * from './alignments';
export * from './appearance';
export * from './bodyBuild';
export * from './goals';
export * from './hooks';
export * from './languages';
export * from './occupations';
export * from './personality';
export * from './races';
export * from './relationships';
export * from './religions';
export * from './secrets';
export * from './socialStatus';
export * from './subraces';
export * from './wealth';
