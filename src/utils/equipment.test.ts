import { describe, it, expect } from 'vitest';
import { calculateTotalCost } from './equipment';
import { Equipment, Weapon, Ammo } from '../types';

const makeWeapon = (id: string, cost: number, includesAmmoId?: string): Weapon => ({
    id,
    name: id,
    cost,
    slots: 1,
    category: 'weapon',
    damage: '1d6',
    modifier: 'agility',
    specialRules: [],
    isTwoHanded: false,
    isRanged: !!includesAmmoId,
    includesAmmoId,
});

const makeItem = (id: string, cost: number): Equipment => ({
    id,
    name: id,
    cost,
    slots: 1,
    category: 'item',
    ability: '',
} as Equipment);

describe('Equipment Slot Management', () => {
    it('should add equipment to available slot', () => {
        // Test code here
    });

    it('should not exceed slot limits', () => {
        // Test code here
    });

    it('should remove equipment from slot', () => {
        // Test code here
    });
});

describe('Tech Level Validation', () => {
    it('should validate tech level for equipment', () => {
        // Test code here
    });

    it('should reject equipment above tech level', () => {
        // Test code here
    });
});

describe('Two-Handed Weapon Validation', () => {
    it('should allow only one two-handed weapon', () => {
        // Test code here
    });

    it('should not allow mixing one-handed weapons with two-handed weapons', () => {
        // Test code here
    });
});

describe('Armor Strength Requirements', () => {
    it('should meet minimum strength requirements for armor', () => {
        // Test code here
    });

    it('should not allow equipping armor if strength is insufficient', () => {
        // Test code here
    });
});

describe('Movement Penalties', () => {
    it('should apply movement penalty for heavy equipment', () => {
        // Test code here
    });

    it('should not apply penalty for light equipment', () => {
        // Test code here
    });
});

describe('Total Cost Calculations', () => {
    it('should calculate total cost of equipped items', () => {
        const items: Equipment[] = [makeItem('item-a', 5), makeItem('item-b', 10)];
        expect(calculateTotalCost(items)).toBe(15);
    });

    it('should return 0 for empty equipment list', () => {
        expect(calculateTotalCost([])).toBe(0);
    });

    it('should credit free ammo cost for a ranged weapon with includesAmmoId', () => {
        // Bow costs 5, bow-ammo costs 1 → effective cost should be 4
        const bow = makeWeapon('bow', 5, 'bow-ammo');
        expect(calculateTotalCost([bow])).toBe(4);
    });

    it('should not apply ammo credit for a melee weapon (no includesAmmoId)', () => {
        const sword = makeWeapon('sword', 8);
        expect(calculateTotalCost([sword])).toBe(8);
    });

    it('should credit each ranged weapon independently for multiple ranged weapons', () => {
        // Bow (5, bow-ammo cost 1) + Revolver (real data cost tested via integration)
        // Use two weapons with the same ammo to ensure per-weapon crediting
        const bow1 = makeWeapon('bow', 5, 'bow-ammo');
        const bow2 = makeWeapon('crossbow', 7, 'bow-ammo');
        // bow-ammo cost is 1; each weapon credits 1 → total credit = 2
        expect(calculateTotalCost([bow1, bow2])).toBe(10); // (5+7) - (1+1)
    });

    it('should never return a negative total cost', () => {
        // A very cheap weapon that credits more than it costs is impossible with real data,
        // but guard against it anyway
        const cheapRanged = makeWeapon('cheap', 0, 'bow-ammo');
        expect(calculateTotalCost([cheapRanged])).toBe(0);
    });

    it('should not apply credit when includesAmmoId does not match any ammo', () => {
        const brokenWeapon = makeWeapon('broken', 10, 'nonexistent-ammo');
        expect(calculateTotalCost([brokenWeapon])).toBe(10);
    });

    it('uses provided ammoData override instead of default 28P data', () => {
        const customAmmo: Ammo[] = [
            { id: 'custom-ammo', name: 'Custom Ammo', cost: 7, slots: 1, category: 'ammo', shots: 3, compatibleWeapons: [] },
        ];
        const weapon = makeWeapon('custom-gun', 20, 'custom-ammo');
        // Without custom ammoData: 'custom-ammo' is not in 28P data → no credit → cost = 20
        expect(calculateTotalCost([weapon])).toBe(20);
        // With custom ammoData: credit of 7 applied → cost = 13
        expect(calculateTotalCost([weapon], customAmmo)).toBe(13);
    });

    it('does not fall back to 28P data when an empty ammoData array is provided', () => {
        // bow uses bow-ammo (cost 1 in 28P data); empty array means no credit applied
        const bow = makeWeapon('bow', 5, 'bow-ammo');
        expect(calculateTotalCost([bow], [])).toBe(5); // no credit
    });
});
