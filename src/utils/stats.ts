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