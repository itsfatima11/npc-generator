import type { NPC } from '../../../types';import type { Campaign,World } from '../types';
export interface WorldViewProps {readonly world:World;readonly campaign:Campaign;readonly npcs:readonly NPC[]}
