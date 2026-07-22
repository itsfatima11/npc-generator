export type ItemType='weapon'|'armor'|'shield'|'tool'|'clothing'|'jewelry'|'potion'|'scroll'|'book'|'food'|'material'|'artifact'|'quest-item'|'trade-goods'|'relic'|'document'|'map'|'key';
export type ItemRarity='common'|'uncommon'|'rare'|'very-rare'|'legendary'|'artifact';
export type ItemCondition='ruined'|'poor'|'worn'|'serviceable'|'fine'|'pristine';
export type ItemCategory='equipment'|'professional'|'personal'|'consumable'|'valuable'|'knowledge'|'quest'|'trade';
export interface CurrencyValue {readonly amount:number;readonly currency:'cp'|'sp'|'ep'|'gp'|'pp'}
export interface ItemOrigin {readonly locationId:string|null;readonly factionId:string|null;readonly creatorNpcId:string|null;readonly description:string}
export interface Item {readonly id:string;readonly name:string;readonly type:ItemType;readonly rarity:ItemRarity;readonly description:string;readonly category:ItemCategory;readonly value:CurrencyValue;readonly weight:number;readonly owner:string|null;readonly origin:ItemOrigin;readonly history:readonly string[];readonly condition:ItemCondition;readonly tags:readonly string[];readonly evidence:readonly string[]}
export interface QuestItemDetails {readonly purpose:string;readonly history:string;readonly owner:string|null;readonly importance:'personal'|'local'|'regional'|'world';readonly danger:'none'|'low'|'moderate'|'high'|'catastrophic';readonly questId:string}
export interface QuestItem extends Item {readonly type:'quest-item';readonly quest:QuestItemDetails}
export interface ItemGenerationRequest {readonly purpose:'occupation'|'personal'|'equipment'|'quest'|'shop'|'loot';readonly preferredType?:ItemType;readonly lockedItemIds?:readonly string[]}
