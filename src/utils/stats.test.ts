import { describe, it, expect } from 'vitest';
import { isValidStatDistribution, getValidStatDistributions, getAvailableModifiers, applyFlawFeatModifiers, calculateFinalDerivedStats, makeEmptyStats, getDefaultFlawsData, getDefaultFeatsData } from './stats';
import { Stats, Flaw, Feat, Armor, StatName } from '../types';
import { flaws28Psalms, feats28Psalms } from '../types/featsandflaws28Psalms';
import { flawsKSP, featsKSP } from '../types/featsandflawsKSP';

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

describe('isValidStatDistribution for KSP (5-stat game)', () => {
    it('accepts [3, 1, 0, 0, -3]', () => {
        expect(isValidStatDistribution([3, 1, 0, 0, -3], 'kill-sample-process')).toBe(true);
    });

    it('accepts [2, 2, 0, -1, -2]', () => {
        expect(isValidStatDistribution([2, 2, 0, -1, -2], 'kill-sample-process')).toBe(true);
    });

    it('accepts distributions in any order', () => {
        expect(isValidStatDistribution([-3, 0, 0, 1, 3], 'kill-sample-process')).toBe(true);
        expect(isValidStatDistribution([-2, -1, 0, 2, 2], 'kill-sample-process')).toBe(true);
    });

    it('rejects 28-Psalms distributions as invalid for KSP', () => {
        expect(isValidStatDistribution([3, 1, 0, -3], 'kill-sample-process')).toBe(false);
        expect(isValidStatDistribution([2, 2, -1, -2], 'kill-sample-process')).toBe(false);
    });

    it('rejects invalid KSP distributions', () => {
        expect(isValidStatDistribution([3, 1, 0, 0, 0], 'kill-sample-process')).toBe(false);
        expect(isValidStatDistribution([2, 2, 2, -1, -2], 'kill-sample-process')).toBe(false);
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

describe('applyFlawFeatModifiers', () => {
    const baseStats: Stats = { agility: 2, presence: 1, strength: 0, toughness: -1, knowledge: 0 };

    it('returns base stats unchanged when flaw and feat are null', () => {
        const result = applyFlawFeatModifiers(baseStats, null, null);
        expect(result).toEqual(baseStats);
    });

    it('does not mutate the baseStats object', () => {
        const original = { ...baseStats };
        applyFlawFeatModifiers(baseStats, { type: 'too-many-teeth', description: '' }, null);
        expect(baseStats).toEqual(original);
    });

    it('applies Too Many Teeth flaw: -2 to presence', () => {
        const flaw: Flaw = { type: 'too-many-teeth', description: '' };
        const result = applyFlawFeatModifiers(baseStats, flaw, null);
        expect(result.presence).toBe(baseStats.presence - 2);
        expect(result.agility).toBe(baseStats.agility);
        expect(result.strength).toBe(baseStats.strength);
        expect(result.toughness).toBe(baseStats.toughness);
    });

    it('returns base stats unchanged for a flaw with no statModifiers', () => {
        const flaw: Flaw = { type: 'xeno', description: '' };
        const result = applyFlawFeatModifiers(baseStats, flaw, null);
        expect(result).toEqual(baseStats);
    });

    it('returns base stats unchanged for a feat with no statModifiers', () => {
        const feat: Feat = { type: 'marine', description: '' };
        const result = applyFlawFeatModifiers(baseStats, null, feat);
        expect(result).toEqual(baseStats);
    });

    it('stacks flaw and feat modifiers together', () => {
        const flaw: Flaw = { type: 'too-many-teeth', description: '' };
        const feat: Feat = { type: 'marine', description: '' };
        const result = applyFlawFeatModifiers(baseStats, flaw, feat);
        expect(result.presence).toBe(baseStats.presence - 2);
    });

    it('uses provided flawsData override instead of default 28P data', () => {
        const customFlaws = [
            { number: 1, name: 'Custom Flaw', description: 'Test', type: 'xeno' as const, statModifiers: { agility: -3 } },
        ];
        const flaw: Flaw = { type: 'xeno', description: '' };
        // default 28P data for 'xeno' has no stat modifier; custom data applies -3 agility
        const result = applyFlawFeatModifiers(baseStats, flaw, null, undefined, customFlaws);
        expect(result.agility).toBe(baseStats.agility - 3);
    });

    it('uses provided featsData override instead of default 28P data', () => {
        const customFeats = [
            { number: 1, name: 'Custom Feat', description: 'Test', type: 'marine' as const, statModifiers: { toughness: 5 } },
        ];
        const feat: Feat = { type: 'marine', description: '' };
        // default 28P data for 'marine' has no stat modifier; custom data applies +5 toughness
        const result = applyFlawFeatModifiers(baseStats, null, feat, undefined, undefined, customFeats);
        expect(result.toughness).toBe(baseStats.toughness + 5);
    });

    it('does not fall back to 28P data when an empty flawsData array is provided', () => {
        const flaw: Flaw = { type: 'too-many-teeth', description: '' };
        // 28P 'too-many-teeth' applies -2 presence; empty array means no modifier found
        const result = applyFlawFeatModifiers(baseStats, flaw, null, undefined, []);
        expect(result.presence).toBe(baseStats.presence); // no change
    });

    it('does not fall back to 28P data when an empty featsData array is provided', () => {
        const feat: Feat = { type: 'marine', description: '' };
        // 28P 'marine' has no modifier, but ensure no fallback in principle
        const result = applyFlawFeatModifiers(baseStats, null, feat, undefined, undefined, []);
        expect(result).toEqual(baseStats);
    });
});

describe('calculateFinalDerivedStats', () => {
    const baseStats: Stats = { agility: 2, presence: 1, strength: 0, toughness: -1, knowledge: 0 };

    it('returns base derived stats when no flaw, feat, or equipment', () => {
        const result = calculateFinalDerivedStats(baseStats, null, null, []);
        expect(result.movement).toBe(5 + baseStats.agility);   // 7
        expect(result.equipmentSlots).toBe(5 + baseStats.strength); // 5
        expect(result.hp).toBe(8 + baseStats.toughness);       // 7
    });

    it('applies flaw derivedStatModifiers to derived stats', () => {
        // Simulate a flaw that reduces agility by 2 but offsets with +2 movement
        const customFlaws = [
            {
                number: 1,
                name: 'S.A.S.',
                description: '-2 Agility (does not reduce movement).',
                type: 'xeno' as const,
                statModifiers: { agility: -2 },
                derivedStatModifiers: { movement: 2 },
            },
        ];
        const flaw: Flaw = { type: 'xeno', description: '' };
        const result = calculateFinalDerivedStats(baseStats, flaw, null, [], undefined, customFlaws);
        // agility reduced by 2 → movement base = 5 + (2 - 2) = 5, then +2 offset = 7
        const expectedMovement = 5 + (baseStats.agility - 2) + 2;
        expect(result.movement).toBe(expectedMovement);
        expect(result.hp).toBe(8 + baseStats.toughness); // hp unchanged
    });

    it('applies feat derivedStatModifiers to derived stats', () => {
        // Simulate Second Heart (+3) feat
        const customFeats = [
            {
                number: 1,
                name: 'Second Heart (+3)',
                description: 'Gains 3 extra HP.',
                type: 'marine' as const,
                derivedStatModifiers: { hp: 3 },
            },
        ];
        const feat: Feat = { type: 'marine', description: '' };
        const result = calculateFinalDerivedStats(baseStats, null, feat, [], undefined, undefined, customFeats);
        expect(result.hp).toBe(8 + baseStats.toughness + 3);
        expect(result.movement).toBe(5 + baseStats.agility); // movement unchanged
    });

    it('stacks flaw derivedStatModifiers, feat derivedStatModifiers, and equipment modifiers', () => {
        const customFlaws = [
            {
                number: 1,
                name: 'Flaw With Derived',
                description: 'Test flaw',
                type: 'xeno' as const,
                derivedStatModifiers: { movement: 1, hp: -1 },
            },
        ];
        const customFeats = [
            {
                number: 1,
                name: 'Feat With Derived',
                description: 'Test feat',
                type: 'marine' as const,
                derivedStatModifiers: { hp: 4 },
            },
        ];
        const armor: Armor = { id: 'a', name: 'A', cost: 1, slots: 1, category: 'armor', av: 1, movementModifier: -1 };
        const flaw: Flaw = { type: 'xeno', description: '' };
        const feat: Feat = { type: 'marine', description: '' };
        const result = calculateFinalDerivedStats(baseStats, flaw, feat, [armor], undefined, customFlaws, customFeats);
        expect(result.movement).toBe(5 + baseStats.agility + 1 - 1); // base + flaw +1 + equipment -1
        expect(result.hp).toBe(8 + baseStats.toughness - 1 + 4);     // base - flaw 1 + feat 4
    });

    it('applies equipment movement modifier', () => {
        const homemadeArmor: Armor = {
            id: 'homemade',
            name: 'Homemade',
            cost: 1,
            slots: 1,
            category: 'armor',
            av: 1,
            movementModifier: -1,
        };
        const result = calculateFinalDerivedStats(baseStats, null, null, [homemadeArmor]);
        const baseMovement = 5 + baseStats.agility; // 7
        expect(result.movement).toBe(baseMovement - 1); // 6
        expect(result.hp).toBe(8 + baseStats.toughness); // hp unchanged
        expect(result.equipmentSlots).toBe(5 + baseStats.strength); // slots unchanged
    });

    it('stacks multiple equipment movement modifiers', () => {
        const armor1: Armor = { id: 'a1', name: 'A1', cost: 1, slots: 1, category: 'armor', av: 1, movementModifier: -1 };
        const armor2: Armor = { id: 'a2', name: 'A2', cost: 1, slots: 1, category: 'armor', av: 1, movementModifier: -2 };
        const result = calculateFinalDerivedStats(baseStats, null, null, [armor1, armor2]);
        const baseMovement = 5 + baseStats.agility; // 7
        expect(result.movement).toBe(baseMovement - 3); // 4
    });

    it('ignores equipment without movement modifiers', () => {
        const plainArmor: Armor = { id: 'plain', name: 'Plain', cost: 1, slots: 1, category: 'armor', av: 1 };
        const result = calculateFinalDerivedStats(baseStats, null, null, [plainArmor]);
        expect(result.movement).toBe(5 + baseStats.agility);
    });

    it('applies full chain: flaw/feat modifiers + equipment modifiers', () => {
        const flaw: Flaw = { type: 'too-many-teeth', description: '' };
        const homemadeArmor: Armor = {
            id: 'homemade',
            name: 'Homemade',
            cost: 1,
            slots: 1,
            category: 'armor',
            av: 1,
            movementModifier: -1,
        };
        const result = calculateFinalDerivedStats(baseStats, flaw, null, [homemadeArmor]);
        // too-many-teeth: -2 presence (no agility change), movement = 7 - 1 = 6
        expect(result.movement).toBe(5 + baseStats.agility - 1);
    });

    it('applies equipment hp and slots modifiers', () => {
        const equipmentWithHpAndSlots = {
            id: 'eq-hp-slots-1',
            name: 'HP & Slots Booster',
            cost: 1,
            slots: 1,
            category: 'armor',
            av: 1,
            hpModifier: 3,
            slotsModifier: 2,
        } as Armor & { hpModifier: number; slotsModifier: number };

        const result = calculateFinalDerivedStats(baseStats, null, null, [equipmentWithHpAndSlots]);

        const baseHp = 8 + baseStats.toughness;
        const baseSlots = 5 + baseStats.strength;

        expect(result.hp).toBe(baseHp + 3);
        expect(result.equipmentSlots).toBe(baseSlots + 2);
    });

    it('stacks multiple equipment hp and slots modifiers', () => {
        const equipment1 = {
            id: 'eq-hp-slots-2',
            name: 'HP & Slots Booster 1',
            cost: 1,
            slots: 1,
            category: 'armor',
            av: 1,
            hpModifier: 2,
            slotsModifier: 1,
        } as Armor & { hpModifier: number; slotsModifier: number };

        const equipment2 = {
            id: 'eq-hp-slots-3',
            name: 'HP & Slots Booster 2',
            cost: 1,
            slots: 1,
            category: 'armor',
            av: 1,
            hpModifier: -1,
            slotsModifier: 3,
        } as Armor & { hpModifier: number; slotsModifier: number };

        const result = calculateFinalDerivedStats(baseStats, null, null, [equipment1, equipment2]);

        const baseHp = 8 + baseStats.toughness;
        const baseSlots = 5 + baseStats.strength;

        // Total hpModifier = 2 + (-1) = +1
        // Total slotsModifier = 1 + 3 = +4
        expect(result.hp).toBe(baseHp + 1);
        expect(result.equipmentSlots).toBe(baseSlots + 4);
    });

    it('applies flaw derivedStatModifiers to derived stats', () => {
        // S.A.S.: -2 agility, +2 movement (net zero change to movement)
        const customFlaws = [
            { number: 8, name: 'S.A.S.', description: '-2 Agility (does not reduce movement)', type: 'sas' as const,
              statModifiers: { agility: -2 }, derivedStatModifiers: { movement: 2 } },
        ];
        const flaw: Flaw = { type: 'sas', description: '' };
        const result = calculateFinalDerivedStats(baseStats, flaw, null, [], undefined, customFlaws);
        // agility reduced by 2: base movement = 5 + (agility - 2) = 5
        // derivedStatModifiers.movement +2 brings it back to 7
        expect(result.movement).toBe(5 + baseStats.agility); // net unchanged
    });

    it('applies feat derivedStatModifiers to derived stats', () => {
        const customFeats = [
            { number: 1, name: 'Fast', description: '+1 movement', type: 'marine' as const,
              derivedStatModifiers: { movement: 1 } },
        ];
        const feat: Feat = { type: 'marine', description: '' };
        const result = calculateFinalDerivedStats(baseStats, null, feat, [], undefined, undefined, customFeats);
        expect(result.movement).toBe(5 + baseStats.agility + 1);
    });

    it('stacks flaw and equipment modifiers on derived stats', () => {
        // S.A.S. +2 movement offset, then homemade armor -1 movement
        const customFlaws = [
            { number: 8, name: 'S.A.S.', description: '', type: 'sas' as const,
              statModifiers: { agility: -2 }, derivedStatModifiers: { movement: 2 } },
        ];
        const homemadeArmor: Armor = {
            id: 'homemade', name: 'Homemade', cost: 1, slots: 1, category: 'armor', av: 1, movementModifier: -1,
        };
        const flaw: Flaw = { type: 'sas', description: '' };
        const result = calculateFinalDerivedStats(baseStats, flaw, null, [homemadeArmor], undefined, customFlaws);
        // base movement 5+2=7, sas agility-2 -> 5+0=5, derivedMod+2->7, equipment-1->6
        expect(result.movement).toBe(5 + baseStats.agility - 1);
    });
});

describe('makeEmptyStats', () => {
    it('returns a Stats object with all StatNames set to 0', () => {
        const empty = makeEmptyStats();
        const allStatNames: StatName[] = ['agility', 'presence', 'strength', 'toughness', 'knowledge'];
        allStatNames.forEach((stat) => {
            expect(empty[stat]).toBe(0);
        });
    });

    it('is a safe initialiser for stat reduction (no hardcoded keys at call site)', () => {
        const gameStatNames: StatName[] = ['agility', 'presence', 'strength', 'toughness'];
        const assignments: Partial<Stats> = { agility: 3, presence: 1, strength: 0, toughness: -3 };
        const result = gameStatNames.reduce((acc, s) => {
            acc[s] = assignments[s] ?? 0;
            return acc;
        }, makeEmptyStats());
        expect(result.agility).toBe(3);
        expect(result.presence).toBe(1);
        expect(result.strength).toBe(0);
        expect(result.toughness).toBe(-3);
        // Stats not in this game's list default to 0 (from makeEmptyStats)
        expect(result.knowledge).toBe(0);
    });
});

describe('getDefaultFlawsData', () => {
    it('returns 28P flaws for 28-psalms', () => {
        expect(getDefaultFlawsData('28-psalms')).toBe(flaws28Psalms);
    });

    it('returns KSP flaws for kill-sample-process', () => {
        expect(getDefaultFlawsData('kill-sample-process')).toBe(flawsKSP);
    });

    it('28P and KSP flaw datasets are distinct (no cross-game fallback)', () => {
        expect(getDefaultFlawsData('kill-sample-process')).not.toBe(flaws28Psalms);
        expect(getDefaultFlawsData('28-psalms')).not.toBe(flawsKSP);
    });
});

describe('getDefaultFeatsData', () => {
    it('returns 28P feats for 28-psalms', () => {
        expect(getDefaultFeatsData('28-psalms')).toBe(feats28Psalms);
    });

    it('returns KSP feats for kill-sample-process', () => {
        expect(getDefaultFeatsData('kill-sample-process')).toBe(featsKSP);
    });

    it('28P and KSP feat datasets are distinct (no cross-game fallback)', () => {
        expect(getDefaultFeatsData('kill-sample-process')).not.toBe(feats28Psalms);
        expect(getDefaultFeatsData('28-psalms')).not.toBe(featsKSP);
    });

    it('KSP feats dataset is non-empty', () => {
        expect(getDefaultFeatsData('kill-sample-process').length).toBeGreaterThan(0);
    });

    it('28P feats dataset is non-empty', () => {
        expect(getDefaultFeatsData('28-psalms').length).toBeGreaterThan(0);
    });
});
