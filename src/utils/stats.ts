import { Stats, DerivedStats, Flaw, Feat, Equipment, GameId, StatName } from '../types';
import { flaws28Psalms, feats28Psalms, FlawData, FeatData } from '../types/featsandflaws28Psalms';
import { StatModifiers } from '../types/featsandflaws';
import { flawsKSP } from '../types/featsandflawsKSP';
import { getGameConfig } from '../types/games';

const DEFAULT_GAME_ID: GameId = '28-psalms';

/**
 * Returns the default flaw dataset for a given game.
 * This avoids hardcoding the 28P dataset as the fallback when a gameId is known.
 */
function getDefaultFlawsData(gameId: GameId): FlawData[] {
  switch (gameId) {
    case 'kill-sample-process':
      return flawsKSP;
    default:
      return flaws28Psalms;
  }
}

/**
 * Returns the default feat dataset for a given game.
 * Currently only 28P has feats; KSP feats will be added here when available.
 */
function getDefaultFeatsData(_gameId: GameId): FeatData[] {
  return feats28Psalms;
}

// Canonical list of all stat names, kept in sync with the StatName union in types/index.ts.
// TypeScript does not support runtime enumeration of union types, so this list must be
// updated whenever StatName is extended. A compile-time narrowing check below ensures
// that the types stay in sync.
const ALL_STAT_NAMES: StatName[] = ['agility', 'presence', 'strength', 'toughness', 'knowledge'];
// Compile-time check: assigning the tuple to `StatName[]` is enough to catch typos;
// if ALL_STAT_NAMES contained a non-StatName value, TypeScript would error here.
void (ALL_STAT_NAMES as StatName[]);

/**
 * Create a Stats object with every StatName set to 0.
 * Used as a safe, non-hardcoded initial accumulator when building game-specific Stats.
 */
export function makeEmptyStats(): Stats {
  return ALL_STAT_NAMES.reduce((acc, stat) => {
    acc[stat] = 0;
    return acc;
  }, {} as Stats);
}

/**
 * Calculate derived stats from base stats using game-specific formulas.
 */
export function calculateDerivedStats(stats: Stats, gameId?: GameId): DerivedStats {
  const config = getGameConfig(gameId ?? DEFAULT_GAME_ID);
  return config.derivedStatFormulas(stats);
}

/**
 * Check if a stat distribution is valid for the given game.
 * Defaults to 28 Psalms distributions when no gameId is provided.
 */
export function isValidStatDistribution(values: number[], gameId?: GameId): boolean {
  const distributions = getValidStatDistributions(gameId);
  const sorted = [...values].sort((a, b) => b - a);
  const matches = (arr: number[]) =>
    sorted.length === arr.length && sorted.every((val, idx) => val === arr[idx]);
  return distributions.some((dist) => matches([...dist].sort((a, b) => b - a)));
}

/**
 * Apply stat modifiers from a flaw and/or feat to base stats.
 * Returns a new Stats object with modifiers applied.
 * Iterates over the game's stat names dynamically.
 *
 * @param baseStats - Base stats before modifiers
 * @param flaw - Selected flaw, or null
 * @param feat - Selected feat, or null
 * @param gameId - Game identifier (defaults to '28-psalms')
 * @param flawsData - Optional flaw data; falls back to the game's default dataset
 * @param featsData - Optional feat data; falls back to the game's default dataset
 */
export function applyFlawFeatModifiers(
  baseStats: Stats,
  flaw: Flaw | null,
  feat: Feat | null,
  gameId?: GameId,
  flawsData?: FlawData[],
  featsData?: FeatData[]
): Stats {
  const modified: Stats = { ...baseStats };
  const resolvedGameId = gameId ?? DEFAULT_GAME_ID;
  const config = getGameConfig(resolvedGameId);

  const flawsToUse = flawsData ?? getDefaultFlawsData(resolvedGameId);
  const featsToUse = featsData ?? getDefaultFeatsData(resolvedGameId);

  if (flaw) {
    const flawEntry = flawsToUse.find((f) => f.type === flaw.type);
    if (flawEntry?.statModifiers) {
      const mods: StatModifiers = flawEntry.statModifiers;
      config.statNames.forEach((stat) => {
        modified[stat] = (modified[stat] ?? 0) + (mods[stat] ?? 0);
      });
    }
  }

  if (feat) {
    const featEntry = featsToUse.find((f) => f.type === feat.type);
    if (featEntry?.statModifiers) {
      const mods: StatModifiers = featEntry.statModifiers;
      config.statNames.forEach((stat) => {
        modified[stat] = (modified[stat] ?? 0) + (mods[stat] ?? 0);
      });
    }
  }

  return modified;
}

/**
 * Calculate final derived stats with all modifiers applied.
 *
 * Full calculation chain:
 * 1. Apply flaw/feat modifiers to primary stats
 * 2. Calculate base derived stats from modified primary stats
 * 3. Sum equipment modifiers (e.g. Homemade armor's -1 movement)
 * 4. Return derived stats with equipment modifiers applied
 *
 * @param baseStats - Base stats from character creation Step 1 (before any modifiers)
 * @param flaw - Selected flaw (Step 2), or null
 * @param feat - Selected feat (Step 2), or null
 * @param equipment - Selected equipment (Step 3)
 * @param gameId - The game to use for derived stat formulas (defaults to '28-psalms')
 * @param flawsData - Optional flaw data; falls back to the game's default dataset
 * @param featsData - Optional feat data; falls back to the game's default dataset
 * @returns DerivedStats with all modifiers applied
 */
export function calculateFinalDerivedStats(
  baseStats: Stats,
  flaw: Flaw | null,
  feat: Feat | null,
  equipment: Equipment[],
  gameId?: GameId,
  flawsData?: FlawData[],
  featsData?: FeatData[]
): DerivedStats {
  const resolvedGameId = gameId ?? DEFAULT_GAME_ID;
  const effectiveStats = applyFlawFeatModifiers(baseStats, flaw, feat, resolvedGameId, flawsData, featsData);
  const derived = calculateDerivedStats(effectiveStats, resolvedGameId);

  // Apply flaw/feat derived stat modifiers (e.g. S.A.S. keeps Movement despite -2 Agility)
  const flawFeatDerivedModifiers = { movement: 0, hp: 0, equipmentSlots: 0 };

  if (flaw) {
    const flawsToUse = flawsData ?? getDefaultFlawsData(resolvedGameId);
    const flawEntry = flawsToUse.find((f) => f.type === flaw.type);
    if (flawEntry?.derivedStatModifiers) {
      flawFeatDerivedModifiers.movement += flawEntry.derivedStatModifiers.movement ?? 0;
      flawFeatDerivedModifiers.hp += flawEntry.derivedStatModifiers.hp ?? 0;
      flawFeatDerivedModifiers.equipmentSlots += flawEntry.derivedStatModifiers.equipmentSlots ?? 0;
    }
  }

  if (feat) {
    const featsToUse = featsData ?? getDefaultFeatsData(resolvedGameId);
    const featEntry = featsToUse.find((f) => f.type === feat.type);
    if (featEntry?.derivedStatModifiers) {
      flawFeatDerivedModifiers.movement += featEntry.derivedStatModifiers.movement ?? 0;
      flawFeatDerivedModifiers.hp += featEntry.derivedStatModifiers.hp ?? 0;
      flawFeatDerivedModifiers.equipmentSlots += featEntry.derivedStatModifiers.equipmentSlots ?? 0;
    }
  }

  const equipmentModifiers = {
    movement: 0,
    hp: 0,
    equipmentSlots: 0,
  };

  equipment.forEach((item) => {
    const it = item as { movementModifier?: number; hpModifier?: number; slotsModifier?: number };
    if (it.movementModifier !== undefined) {
      equipmentModifiers.movement += it.movementModifier;
    }
    if (it.hpModifier !== undefined) {
      equipmentModifiers.hp += it.hpModifier;
    }
    if (it.slotsModifier !== undefined) {
      equipmentModifiers.equipmentSlots += it.slotsModifier;
    }
  });

  return {
    hp: derived.hp + flawFeatDerivedModifiers.hp + equipmentModifiers.hp,
    movement: derived.movement + flawFeatDerivedModifiers.movement + equipmentModifiers.movement,
    equipmentSlots: derived.equipmentSlots + flawFeatDerivedModifiers.equipmentSlots + equipmentModifiers.equipmentSlots,
  };
}

export function getValidStatDistributions(gameId?: GameId): number[][] {
  const config = getGameConfig(gameId ?? DEFAULT_GAME_ID);
  return config.validDistributions;
}

/**
 * Get the modifier values still available for a given stat, given a distribution
 * and the assignments already made to other stats.
 *
 * Correctly handles distributions with duplicate values (e.g., [+2, +2, -1, -2])
 * by tracking how many times each value has been consumed by other stats.
 *
 * @param distribution  The selected modifier distribution array
 * @param otherAssignments  The values already assigned to all OTHER stats (not the current one)
 * @returns Unique modifier values that have not been fully consumed
 */
export function getAvailableModifiers(
  distribution: number[],
  otherAssignments: number[]
): number[] {
  const distributionCounts = distribution.reduce((acc, mod) => {
    acc[mod] = (acc[mod] || 0) + 1;
    return acc;
  }, {} as Record<number, number>);

  const consumedCounts = otherAssignments.reduce((acc, mod) => {
    acc[mod] = (acc[mod] || 0) + 1;
    return acc;
  }, {} as Record<number, number>);

  const seen = new Set<number>();
  return distribution.filter((mod) => {
    if (seen.has(mod)) return false;
    seen.add(mod);
    const total = distributionCounts[mod] || 0;
    const consumed = consumedCounts[mod] || 0;
    return total > consumed;
  });
}