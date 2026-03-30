/**
 * KSP Equipment Data
 *
 * Contains equipment data for Kill Sample Process.
 * Items are fully populated; other categories are placeholders pending data entry.
 */

import { Weapon, Armor, Item, Ammo, Consumable, Drone, CyberAmmo } from './index';

// KSP Items
export const itemsKSP: Item[] = [
  {
    id: 'adrenaline-shot',
    name: 'Adrenaline Shot',
    cost: 50,
    slots: 1,
    category: 'item',
    ability: "Increase model's Strength by +1. Can be used to end Poisoned state. Model suffers -1 to all Knowledge tests. Effects last until end of Scenario.",
  },
  {
    id: 'trauma-kit',
    name: 'Trauma Kit',
    cost: 100,
    slots: 1,
    category: 'item',
    ability: 'Can be used to heal a model 1D6 (including Downed models). Also removes Bleeding, Dazed and Diseased conditions.',
  },
  {
    id: 'air-filter',
    name: 'Air Filter',
    cost: 50,
    slots: 1,
    category: 'item',
    ability: 'Prevents effects of Gas and Smoke.',
  },
  {
    id: 'led-torch',
    name: 'LED Torch',
    cost: 50,
    slots: 1,
    category: 'item',
    ability: 'Provides light (see Darkness rules).',
  },
  {
    id: 'unicorn-backpack',
    name: 'Unicorn Backpack',
    cost: 50,
    slots: 1,
    category: 'item',
    ability: 'Counts as 1 equipment slot but provides 3 extra slots.',
    statModifiers: { equipmentSlots: 3 },
  },
  {
    id: 'whisky',
    name: 'Whisky',
    cost: 50,
    slots: 1,
    category: 'item',
    ability: 'After drinking, auto-pass Guts checks for the Scenario.',
  },
  {
    id: 'drone-control',
    name: 'Drone Control',
    cost: 100,
    slots: 1,
    category: 'item',
    ability: 'Allows a model to control a friendly Drone.',
  },
];

// Placeholder arrays for other equipment types (to be populated)
export const weaponsKSP = {
  pastTech: [] as Weapon[],
  futureTech: [] as Weapon[],
};

export const armorKSP: Armor[] = [];
export const ammoKSP: Ammo[] = [];
export const consumablesKSP: Consumable[] = [];
export const dronesKSP: Drone[] = [];
export const cyberAmmosKSP: CyberAmmo[] = [];
