/**
 * KSP Equipment Data - Placeholder
 *
 * Full equipment data will be implemented in Feature 4c.
 * This file provides empty arrays to unblock character builder UI.
 */

import { Weapon, Armor, Item, Ammo, Consumable } from './index';

export const weaponsKSP = {
  pastTech: [] as Weapon[],
  futureTech: [] as Weapon[],
};

export const armorKSP: Armor[] = [
  {
    id: 'home-made',
    name: 'Home Made',
    av: 1,
    cost: 0,
    slots: 1,
    category: 'armor',
    specialRules: 'User suffers -1 Agility.',
    statModifiers: { agility: -1 },
  },
  {
    id: 'corp-sec',
    name: 'Corp-Sec',
    av: 1,
    cost: 200,
    slots: 1,
    category: 'armor',
    specialRules: 'Standard issue private military grade.',
  },
  {
    id: 'bike-helmet',
    name: 'Bike Helmet',
    av: 0,
    cost: 50,
    slots: 1,
    category: 'armor',
    specialRules: 'Wearer is immune to Dazed.',
  },
  {
    id: 'grounded',
    name: 'Grounded',
    av: 2,
    cost: 300,
    slots: 1,
    category: 'armor',
    specialRules: 'Wearer is immune to stun effect.',
  },
  {
    id: 'soft-plates',
    name: 'Soft Plates',
    av: 1,
    cost: 300,
    slots: 1,
    category: 'armor',
    specialRules: 'Will stop a knife but not a bullet. AV 1 vs ranged, 3 vs melee.',
  },
  {
    id: 'plate-carrier',
    name: 'Plate Carrier',
    av: 3,
    cost: 500,
    slots: 1,
    category: 'armor',
    specialRules: 'User suffers -3 to all Agility tests but movement remains the same.',
    statModifiers: {
      agility: -3,
      movement: 3,
    },
  },
  {
    id: 'exo-skeleton',
    name: 'Exo Skeleton',
    av: 2,
    cost: 1500,
    slots: 1,
    category: 'armor',
    specialRules: '[Cyber] Strength stat +3.',
    statModifiers: { strength: 3 },
  },
  {
    id: 'augmented-helmet',
    name: 'Augmented Helmet',
    av: 1,
    cost: 200,
    slots: 1,
    category: 'armor',
    specialRules: '[Cyber] Wearer is immune to Dazed. Also provides a heads up display granting +1 to shoot with weapons with Cyber keyword.',
  },
  {
    id: 'reactive',
    name: 'Reactive',
    av: 1,
    cost: 300,
    slots: 1,
    category: 'armor',
    specialRules: '[Cyber] Wearer ignores Critical hits.',
  },
  {
    id: 'vengeance',
    name: 'Vengeance',
    av: 2,
    cost: 500,
    slots: 1,
    category: 'armor',
    specialRules: '[Cyber] When hit with a melee weapon, attacker takes 1D4 damage.',
  },
];

export const itemsKSP: Item[] = [];
export const ammoKSP: Ammo[] = [];
export const consumablesKSP: Consumable[] = [];
