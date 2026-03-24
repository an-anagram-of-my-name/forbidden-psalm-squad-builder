import { Stats, DerivedStats } from '../types';

/**
 * Calculate derived stats from base stats
 */
export function calculateDerivedStats(stats: Stats): DerivedStats {
  return {
    hp: 8 + stats.toughness,
    movement: 5 + stats.agility,
    equipmentSlots: 5 + stats.strength,
  };
}

/**
 * Check if a stat distribution is valid
 * Valid distributions are: [+3, +1, 0, -3] or [+2, +2, -1, -2]
 */
export function isValidStatDistribution(values: number[]): boolean {
  const sorted = [...values].sort((a, b) => b - a);
  const dist1 = [3, 1, 0, -3];
  const dist2 = [2, 2, -1, -2];

  const matches = (arr: number[]) =>
    sorted.every((val, idx) => val === arr[idx]);

  return matches(dist1) || matches(dist2);
}

/**
 * Get the two valid stat distributions
 */
export function getValidStatDistributions(): number[][] {
  return [
    [3, 1, 0, -3],
    [2, 2, -1, -2],
  ];
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