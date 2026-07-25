export interface RaceDefinition {
  readonly id: string;
  readonly name: string;
}

export interface SubraceDefinition {
  readonly id: string;
  readonly raceId: string;
  readonly name: string;
}

export interface CatalogOption {
  readonly id: string;
  readonly label: string;
}
