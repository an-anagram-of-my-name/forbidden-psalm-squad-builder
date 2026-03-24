// equipment.ts

import { Equipment, Armor, TechLevel } from '../types';

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
 * This only handles armor movement penalties and is not part of the full stat modification chain.
 */
export function getCharacterMovement(baseMovement: number, equippedItems: Equipment[]): number {
    let penalty = 0;
    equippedItems.forEach((item) => {
        if (item.category === 'armor') {
            const armor = item as Armor;
            penalty += armor.movementModifier ? Math.abs(armor.movementModifier) : 0;
        }
    });
    return baseMovement - penalty;
}

// Calculate total cost of equipped items
export function calculateTotalCost(equippedItems: Equipment[]): number {
    return equippedItems.reduce((total, item) => total + item.cost, 0);
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
