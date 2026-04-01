/**
 * KSP Equipment Data
 */

import { Weapon, Armor, Item, Ammo, Consumable, Drone } from './index';

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
