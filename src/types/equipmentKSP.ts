/**
 * KSP Equipment Data
 */

import { Weapon, Armor, Item, Ammo, Consumable } from './index';

// ============================================================================
// ONE-HANDED RANGED WEAPONS
// ============================================================================

export const weaponsKSP: Weapon[] = [
  {
    id: 'revolver',
    name: 'Revolver',
    damage: 'D6',
    modifier: 'presence',
    cost: 100,
    slots: 1,
    isTwoHanded: false,
    category: 'weapon',
    specialRules: ['Ranged', 'Reload 5'],
    isRanged: true,
  },
  {
    id: 'smart-pistol',
    name: 'Smart Pistol',
    damage: 'D6',
    modifier: 'presence',
    cost: 110,
    slots: 1,
    isTwoHanded: false,
    category: 'weapon',
    specialRules: ['Ranged', 'Cyber', 'Reload 6'],
    isRanged: true,
  },
  {
    id: 'heavy-pistol',
    name: 'Heavy Pistol',
    damage: 'D8',
    modifier: 'strength',
    cost: 120,
    slots: 1,
    isTwoHanded: false,
    category: 'weapon',
    specialRules: ['Ranged', 'Cyber', 'Reload 4'],
    isRanged: true,
  },
  {
    id: 'tazer',
    name: 'Tazer',
    damage: '-',
    modifier: 'agility',
    cost: 100,
    slots: 1,
    isTwoHanded: false,
    category: 'weapon',
    specialRules: ['Non-lethal', 'Ranged 6', 'Reload'],
    isRanged: true,
  },
];

// Placeholder arrays for remaining weapons (to be added in future PRs)
export const weaponsKSPMelee1Handed: Weapon[] = [];
export const weaponsKSPRanged2Handed: Weapon[] = [];
export const weaponsKSPMelee2Handed: Weapon[] = [];

// Export all weapons (will expand as more categories are added)
export const allWeaponsKSP: Weapon[] = [
  ...weaponsKSP, // One-handed ranged
  ...weaponsKSPMelee1Handed, // One-handed melee (future)
  ...weaponsKSPRanged2Handed, // Two-handed ranged (future)
  ...weaponsKSPMelee2Handed, // Two-handed melee (future)
];

export const armorKSP: Armor[] = [];
export const itemsKSP: Item[] = [];
export const ammoKSP: Ammo[] = [];
export const consumablesKSP: Consumable[] = [];

