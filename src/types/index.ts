/**
 * Core domain types for Forbidden Psalm Squad Builder
 */

export type TechLevel = 'past-tech' | 'future-tech';

export type GameId = '28-psalms' | 'kill-sample-process';

export type StatName = 'agility' | 'presence' | 'strength' | 'toughness' | 'knowledge';

export type Stats = Record<StatName, number>;

export interface DerivedStats {
  hp: number;
  movement: number;
  equipmentSlots: number;
}

/** Modifiers applied directly to derived stats (HP/Movement/EquipmentSlots). */
export type DerivedStatModifiers = {
  movement?: number;
  hp?: number;
  equipmentSlots?: number;
};

/** Partial primary-stat modifiers keyed by StatName. */
export type StatModifiers = Partial<Record<StatName, number>>;

export interface FlawData {
  number: number;
  name: string;
  description: string;
  type: FlawType;
  statModifiers?: StatModifiers;
  groupId?: string;
  derivedStatModifiers?: DerivedStatModifiers;
}

export interface FeatData {
  number: number;
  name: string;
  description: string;
  type: FeatType;
  statModifiers?: StatModifiers;
  groupId?: string;
  derivedStatModifiers?: DerivedStatModifiers;
}

export type FlawType =
  // 28 Psalms flaws
  | 'xeno'
  | 'too-many-teeth'
  | 'dead-man-walking'
  | 'ratman'
  | 'crazed'
  | 'worship'
  | 'superstitious'
  | 'late'
  | 'purge'
  | 'weak-bones'
  // Kill Sample Process flaws
  | 'technophobe'
  | 'rube'
  | 'break-bad'
  | 'bad-connection'
  | 'wannabe-punk'
  | 'infected'
  | 'flatline'
  | 'sas'
  | 'ghost'
  | 'perfect'
  | 'wanted'
  | 'trigger-finger'
  | 'debt'
  | 'double-down'
  | 'decide'
  | 'fanatic'
  | 'turing-test'
  | 'mutant-agility'
  | 'mutant-presence'
  | 'mutant-strength'
  | 'mutant-toughness'
  | 'mutant-knowledge'
  | 'sensory-overload'
  | 'mycotoxin';

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
  | 'undead'
  // KSP Feats
  | 'butch'
  | 'modable'
  | 'priest-of-tech'
  | 'feedback'
  | 'idiot-savant'
  | 'bribe'
  | 'jockey'
  | 'firewall'
  | 'combat-medic'
  | 'trained'
  | 'quick-learner'
  | 'tears-in-rain'
  | 'passive-income'
  | 'the-one'
  | 'second-heart-plus-1'
  | 'second-heart-plus-2'
  | 'second-heart-plus-3'
  | 'second-heart-plus-4'
  | 'second-heart-plus-5'
  | 'second-heart-plus-6'
  | 'x-person'
  | 'resistant'
  | 'burst-of-speed'
  | 'zorro'
  | 'experimental-bullet-proof'
  | 'experimental-half-damage'
  | 'experimental-enhanced'
  | 'experimental-sedated'
  | 'experimental-inert'
  | 'experimental-vitalized';

export interface Flaw {
  type: FlawType;
  description: string;
}

export interface Feat {
  type: FeatType;
  description: string;
}

export type EquipmentCategory = 'weapon' | 'armor' | 'item' | 'ammo' | 'consumable' | 'drone';

export interface BaseEquipment {
  id: string;
  name: string;
  cost: number;
  slots: number;
  category: EquipmentCategory;
  techLevel?: TechLevel;
  /**
   * Unified stat modifier system (same approach as Feats, Flaws, Mutations).
   * Keys can be primary stat names (agility, presence, strength, toughness, knowledge)
   * or derived stat names (movement, hp, equipmentSlots).
   * Primary stat keys modify the base stat, which then cascades into derived stats.
   * Derived stat keys apply directly as offsets after derived stat calculation.
   */
  statModifiers?: { [key: string]: number };
}

export interface Item extends BaseEquipment {
  category: 'item';
  ability: string;
}

export interface Ammo extends BaseEquipment {
  category: 'ammo';
  shots: number;
  compatibleWeapons: string[];
}

export interface Armor extends BaseEquipment {
  category: 'armor';
  av: number;
  specialRules?: string;
}

export interface Weapon extends BaseEquipment {
  category: 'weapon';
  damage: string;
  modifier: StatName;
  specialRules: string[];
  isTwoHanded: boolean;
  isRanged?: boolean;
  includesAmmoId?: string;
  ammoTypeId?: string;
}

export interface Drone extends BaseEquipment {
  category: 'drone';
  hp?: number | null;
  av?: number | null;
  specialRules?: string;
  statModifiers?: BaseEquipment['statModifiers'];
  allowAI?: boolean;
  isAI?: boolean;
}

export type Equipment = Item | Ammo | Armor | Weapon | Consumable | Drone;

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
  gameId: GameId;
  techLevel?: TechLevel;
  portraitUrl?: string;
  // KSP-specific augmentations
  additionalFlaws?: Flaw[];
  additionalFeats?: Feat[];
  cybermods?: import('./cybermodsKSP').SelectedCybermod[];
  mutations?: import('./mutationsKSP').SelectedMutation[];
  injuries?: string[];    // Array of injury states (optional, for future use)
}

export interface CharacterPreset {
  id: string;
  name: string;
  stats: Stats;
  flaw: Flaw;
  feat: Feat;
  equipment: Equipment[];
  gameId: GameId;
  techLevel?: TechLevel;
  portraitUrl?: string;
  // KSP-specific augmentations
  additionalFlaws?: Flaw[];
  additionalFeats?: Feat[];
  cybermods?: import('./cybermodsKSP').SelectedCybermod[];
  mutations?: import('./mutationsKSP').SelectedMutation[];
  injuries?: string[];    // Array of injury states (optional, for future use)
  createdAt: Date;
  updatedAt: Date;
}

export interface Squad {
  id: string;
  name: string;
  characters: Character[];
  gameId: GameId;
  techLevel?: TechLevel;
  createdAt: Date;
  updatedAt: Date;
  dateSaved?: string;
}

export interface AppState {
  presets: CharacterPreset[];
  squads: Squad[];
  currentSquadId: string | null;
  currentGameId: GameId | null;
}
