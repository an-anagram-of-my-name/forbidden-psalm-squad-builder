// equipment.ts

import { Equipment, Weapon, TechLevel, Ammo } from '../types';
import { ammo28Psalms } from '../types/equipment28Psalms';

// Calculate used slots based on equipped items
export function calculateUsedSlots(equippedItems: Equipment[]): number {
    return equippedItems.reduce((total, item) => total + item.slots, 0);
}

// Get available slots for equipping items
export function getAvailableSlots(totalSlots: number, usedSlots: number): number {
    return totalSlots - usedSlots;
}

// Check if equipment can be added
export function canAddEquipment(equipment: Equipment, availableSlots: number): boolean {
    return equipment.slots <= availableSlots;
}

// Validate if armor can be used based on strength requirements
export function canUseArmor(characterStrength: number, armorStrength: number): boolean {
    return characterStrength >= armorStrength;
}

/**
 * @deprecated Use calculateFinalDerivedStats() from utils/stats instead.
 * This only handles movement modifiers and is not part of the full stat modification chain.
 */
export function getCharacterMovement(baseMovement: number, equippedItems: Equipment[]): number {
    let movementChange = 0;
    equippedItems.forEach((item) => {
        const sm = item.statModifiers;
        if (sm?.movement !== undefined) {
            movementChange += sm.movement;
        }
    });
    return baseMovement + movementChange;
}

// Calculate total cost of equipped items
// Ranged weapons with includesAmmoId receive a credit for one free ammo stack.
// @param ammoData - Optional ammo data to use for credit lookup; falls back to ammo28Psalms
export function calculateTotalCost(equippedItems: Equipment[], ammoData?: Ammo[]): number {
    const baseCost = equippedItems.reduce((total, item) => total + item.cost, 0);

    const ammoToUse = ammoData ?? ammo28Psalms;

    let ammoCredit = 0;
    equippedItems.forEach((item) => {
        if (item.category === 'weapon') {
            const weapon = item as Weapon;
            if (weapon.includesAmmoId) {
                const includedAmmo = ammoToUse.find(a => a.id === weapon.includesAmmoId);
                if (includedAmmo) {
                    ammoCredit += includedAmmo.cost;
                }
            }
        }
    });

    return Math.max(0, baseCost - ammoCredit);
}

// Validate tech level for equipping items
export function validateTechLevel(characterTechLevel: TechLevel, itemTechLevel: TechLevel): boolean {
    if (characterTechLevel === 'future-tech') return true;
    return characterTechLevel === itemTechLevel;
}

// Validate two-handed weapon slot requirements
export function validateTwoHandedSlots(equipment: Equipment): number {
    if (equipment.category === 'weapon') {
        return equipment.slots;
    }
    return 1;
}
