/**
 * KSP Equipment Data - Placeholder
 *
 * Full equipment data will be implemented in Feature 4c.
 * This file provides empty arrays to unblock character builder UI.
 */

import { Weapon, Armor, Item, Ammo, Consumable, Drone } from './index';

export const weaponsKSP = {
  pastTech: [] as Weapon[],
  futureTech: [] as Weapon[],
};

export const armorKSP: Armor[] = [];
export const itemsKSP: Item[] = [];
export const ammoKSP: Ammo[] = [];
export const consumablesKSP: Consumable[] = [];

export const dronesKSP: Drone[] = [
  {
    id: 'proxy-robot',
    name: 'Proxy Robot',
    cost: 500,
    slots: 0,
    category: 'drone',
    hp: null,
    av: null,
    specialRules: 'Replaces a crewmember in a Scenario. Immune to Disease, Gas and Poison. [Cyber]',
    statModifiers: {
      agility: -1,
      knowledge: -1,
      presence: -1,
      strength: 3,
      toughness: 2,
    },
    allowAI: false,
    isAI: false,
  },
  {
    id: 'military-drone',
    name: 'Military Drone',
    cost: 400,
    slots: 1,
    category: 'drone',
    hp: 6,
    av: 2,
    specialRules: 'Can have any weapon from page 27 attached. Carries 1 mag of Ammo for the attached gun. Can only be reloaded between Scenarios. Can make a single ranged attack per round.',
    allowAI: true,
    isAI: false,
  },
  {
    id: 'medic-drone',
    name: 'Medic Drone',
    cost: 200,
    slots: 1,
    category: 'drone',
    hp: 5,
    av: 1,
    specialRules: 'Can heal a model within 1 inch for 1D6 HP.',
    allowAI: true,
    isAI: false,
  },
  {
    id: 'recon-drone',
    name: 'Recon Drone',
    cost: 100,
    slots: 1,
    category: 'drone',
    hp: 3,
    av: 1,
    specialRules: 'Can interact with items and Scenario objectives, including picking up 1 item and looting.',
    allowAI: true,
    isAI: false,
  },
];
