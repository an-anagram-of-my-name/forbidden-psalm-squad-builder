/**
 * Core domain types for Forbidden Psalm Squad Builder
 */

export type TechLevel = 'past-tech' | 'future-tech';

export type StatName = 'agility' | 'presence' | 'strength' | 'toughness';

export interface Stats {
  agility: number;
  presence: number;
  strength: number;
  toughness: number;
}

export interface DerivedStats {
  hp: number;
  movement: number;
  equipmentSlots: number;
}

export type FlawType =
  | 'xeno'
  | 'too-many-teeth'
  | 'dead-man-walking'
  | 'ratman'
  | 'crazed'
  | 'worship'
  | 'superstitious'
  | 'late'
  | 'purge'
  | 'weak-bones';

export type FeatType =
  | 'marine'
  | 'zealous'
  | 'unpainted'
  | 'rogue'
  | 'tnt'
  | 'gambler'
  | 'mother-of-crows'
  | 'skulls'
  | 'bibliotech'
  | 'undead';

export interface Flaw {
  type: FlawType;
  description: string;
}

export interface Feat {
  type: FeatType;
  description: string;
}

export type EquipmentCategory = 'weapon' | 'armor' | 'item' | 'ammo' | 'consumable';

export interface BaseEquipment {
  id: string;
  name: string;
  cost: number;
  slots: number;
  category: EquipmentCategory;
  techLevel?: TechLevel;
}

export interface Item extends BaseEquipment {
  category: 'item';
  ability: string;
}

export interface Ammo extends BaseEquipment {
  category: 'ammo';
  shots: number;
}

export interface Armor extends BaseEquipment {
  category: 'armor';
  av: number;
  specialRules?: string;
  movementModifier?: number;
  requiredStrength?: number;
}

export interface Weapon extends BaseEquipment {
  category: 'weapon';
  damage: string;
  modifier: StatName;
  specialRules: string[];
  isTwoHanded: boolean;
  isRanged: boolean;
  includesAmmoId?: string;
}

export type Equipment = Item | Ammo | Armor | Weapon | Consumable;

export interface Consumable extends BaseEquipment {
  category: 'consumable';
  ability: string;
}

export interface Character {
  id: string;
  name: string;
  stats: Stats;
  flaw: Flaw;
  feat: Feat;
  equipment: Equipment[];
  techLevel: TechLevel;
}

export interface CharacterPreset {
  id: string;
  name: string;
  stats: Stats;
  flaw: Flaw;
  feat: Feat;
  equipment: Equipment[];
  techLevel: TechLevel;
  createdAt: Date;
  updatedAt: Date;
}

export interface Squad {
  id: string;
  name: string;
  characters: Character[];
  techLevel: TechLevel;
  createdAt: Date;
  updatedAt: Date;
}

export interface AppState {
  presets: CharacterPreset[];
  squads: Squad[];
}