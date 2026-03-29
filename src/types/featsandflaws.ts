/**
 * Shared interfaces for flaw and feat data, independent of any game ruleset.
 *
 * Ruleset-specific data files (featsandflaws28Psalms.ts, featsandflawsKSP.ts, …)
 * import these interfaces and the core types they depend on from './index'.
 */

import { FlawType, FeatType, StatName } from './index';

export type StatModifiers = Partial<Record<StatName, number>>;

export interface DerivedStatModifiers {
  movement?: number;
  hp?: number;
  equipmentSlots?: number;
}

export interface FlawData {
  number: number;
  name: string;
  description: string;
  type: FlawType;
  statModifiers?: StatModifiers;
  /** Groups related flaws for normalised random-selection probability (e.g. Mutant variants). */
  groupId?: string;
  /** Modifiers applied directly to derived stats after primary-stat calculation. */
  derivedStatModifiers?: DerivedStatModifiers;
}

export interface FeatData {
  number: number;
  name: string;
  description: string;
  type: FeatType;
  statModifiers?: StatModifiers;
  /** Modifiers applied directly to derived stats after primary-stat calculation. */
  derivedStatModifiers?: DerivedStatModifiers;
}
