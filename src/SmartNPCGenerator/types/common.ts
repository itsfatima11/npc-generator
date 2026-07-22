import type { HeightUnit, RelationshipType, WeightUnit } from './enums';

export interface Measurement<Unit extends HeightUnit | WeightUnit> {
  readonly value: number;
  readonly unit: Unit;
}

export interface PersonReference {
  readonly id?: string;
  readonly name: string;
  readonly notes?: string;
}

export interface Relationship<Type extends RelationshipType = RelationshipType> {
  readonly person: PersonReference;
  readonly type: Type;
  readonly description: string;
}
