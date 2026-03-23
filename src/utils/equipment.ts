// equipment.ts

// Function to manage character equipment

// Calculate used slots based on equipped items
export function calculateUsedSlots(equippedItems) {
    return equippedItems.length;
}

// Get available slots for equipping items
export function getAvailableSlots(totalSlots, usedSlots) {
    return totalSlots - usedSlots;
}

// Check if equipment can be added
export function canAddEquipment(equipment, availableSlots) {
    return availableSlots > 0;
}

// Validate if armor can be used based on strength requirements
export function canUseArmor(characterStrength, armorStrength) {
    return characterStrength >= armorStrength;
}

// Calculate character movement based on equipment
export function getCharacterMovement(baseMovement, equippedItems) {
    let penalty = 0;
    equippedItems.forEach(item => {
        penalty += item.movementPenalty || 0;
    });
    return baseMovement - penalty;
}

// Calculate total cost of equipped items
export function calculateTotalCost(equippedItems) {
    return equippedItems.reduce((total, item) => total + item.cost, 0);
}

// Add equipment to the character
export function addEquipmentToCharacter(character, equipment) {
    character.equipped.push(equipment);
}

// Remove equipment from the character
export function removeEquipmentFromCharacter(character, equipment) {
    character.equipped = character.equipped.filter(item => item !== equipment);
}

// Validate tech level for equipping items
export function validateTechLevel(characterTechLevel, itemTechLevel) {
    return characterTechLevel >= itemTechLevel;
}

// Validate two-handed weapon slot requirements
export function validateTwoHandedSlots(equipment) {
    if (equipment.type === 'melee') {
        return 2; // requires 2 slots
    } else if (equipment.type === 'ranged') {
        return 3; // requires 3 slots with ammo
    }
    return 1; // single-handed weapons
}