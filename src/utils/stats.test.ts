import { describe, it, expect } from 'vitest';
import { isValidStatDistribution, getValidStatDistributions, getAvailableModifiers } from './stats';

describe('isValidStatDistribution', () => {
    it('accepts [3, 1, 0, -3]', () => {
        expect(isValidStatDistribution([3, 1, 0, -3])).toBe(true);
    });

    it('accepts [2, 2, -1, -2]', () => {
        expect(isValidStatDistribution([2, 2, -1, -2])).toBe(true);
    });

    it('accepts distributions in any order', () => {
        expect(isValidStatDistribution([-3, 0, 1, 3])).toBe(true);
        expect(isValidStatDistribution([-2, -1, 2, 2])).toBe(true);
    });

    it('rejects invalid distributions', () => {
        expect(isValidStatDistribution([2, 2, 2, -2])).toBe(false);
        expect(isValidStatDistribution([1, 1, 1, -1])).toBe(false);
    });
});

describe('getValidStatDistributions', () => {
    it('returns both valid distributions', () => {
        const dists = getValidStatDistributions();
        expect(dists).toHaveLength(2);
    });

    it('includes the [+2, +2, -1, -2] distribution', () => {
        const dists = getValidStatDistributions();
        const hasDoubleTwo = dists.some(
            (d) => d.filter((v) => v === 2).length === 2
        );
        expect(hasDoubleTwo).toBe(true);
    });
});

describe('StatDistributionPicker duplicate value validation', () => {
    /**
     * Tests for getAvailableModifiers, which powers the StatDistributionPicker
     * dropdown options. Validates correct handling of duplicate values in the
     * distribution (e.g., [+2, +2, -1, -2]).
     */

    const stats = ['agility', 'presence', 'strength', 'toughness'];
    const dist = [2, 2, -1, -2];

    it('shows all unique values when no assignments made', () => {
        const available = getAvailableModifiers(dist, []);
        expect(available).toEqual([2, -1, -2]);
    });

    it('still shows +2 for presence after agility takes one +2', () => {
        const available = getAvailableModifiers(dist, [2]);
        expect(available).toContain(2);
    });

    it('hides +2 for strength after both agility and presence take +2', () => {
        const available = getAvailableModifiers(dist, [2, 2]);
        expect(available).not.toContain(2);
        expect(available).toContain(-1);
        expect(available).toContain(-2);
    });

    it('always includes the current stat own value in available options', () => {
        // agility=2 is already assigned; when computing options for agility itself,
        // we pass only OTHER stats' assignments, so 2 should still be available
        const otherAssignments = stats
            .filter((s) => s !== 'agility' && ({ agility: 2 } as Record<string, number>)[s] !== undefined)
            .map((s) => ({ agility: 2 } as Record<string, number>)[s]);
        const available = getAvailableModifiers(dist, otherAssignments);
        expect(available).toContain(2);
    });

    it('does not show duplicate entries for a value appearing twice', () => {
        const available = getAvailableModifiers(dist, []);
        const twos = available.filter((v) => v === 2);
        expect(twos).toHaveLength(1);
    });

    it('returns empty array when all values are consumed', () => {
        const available = getAvailableModifiers(dist, [2, 2, -1, -2]);
        expect(available).toEqual([]);
    });
});
