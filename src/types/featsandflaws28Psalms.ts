/**
 * Feats and flaws data for 28 Psalms ruleset
 */

import type { FlawData, FeatData } from './featsandflaws';

// Re-export shared interfaces so existing imports from this module continue to work.
export type { StatModifiers, DerivedStatModifiers, FlawData, FeatData } from './featsandflaws';

export const flaws28Psalms: FlawData[] = [
  {
    number: 1,
    name: 'Xeno',
    description: 'No other warband member will heal them for any reason.',
    type: 'xeno',
  },
  {
    number: 2,
    name: 'Too Many Teeth',
    description: 'Warband member suffers -2 to Presence.',
    type: 'too-many-teeth',
    statModifiers: { presence: -2 },
  },
  {
    number: 3,
    name: 'Dead Man Walking',
    description: 'Death Saves are always at least DR10.',
    type: 'dead-man-walking',
  },
  {
    number: 4,
    name: 'Ratman',
    description: 'Must bring cheese with them on all Scenarios.',
    type: 'ratman',
  },
  {
    number: 5,
    name: 'Crazed',
    description:
      'If the warband member fails a morale test they become hostile to all other warband members and should be treated as an NPC monster until they pass a morale check as per morale rules.',
    type: 'crazed',
  },
  {
    number: 6,
    name: 'Worship',
    description:
      'When you activate a warband member, roll a D6. On a result of 1 they lose their activation and instead pray.',
    type: 'worship',
  },
  {
    number: 7,
    name: 'Superstitious',
    description: 'Warband member rerolls dice results of 13.',
    type: 'superstitious',
  },
  {
    number: 8,
    name: 'Late',
    description:
      'Do not set up warband member at the start of a Scenario. They turn up at the start of Round 2.',
    type: 'late',
  },
  {
    number: 9,
    name: 'Purge',
    description: 'Warband member will only use weapons with the Burn keyword.',
    type: 'purge',
  },
  {
    number: 10,
    name: 'Weak Bones',
    description: 'Warband member can only use Armor of a value of 1 or less.',
    type: 'weak-bones',
  },
];

export const feats28Psalms: FeatData[] = [
  {
    number: 1,
    name: 'Marine',
    description: 'If using a weapon with the Reload keyword they reload for free.',
    type: 'marine',
  },
  {
    number: 2,
    name: 'Zealous',
    description: 'Never fails morale checks, ignores rolls for morale.',
    type: 'zealous',
  },
  {
    number: 3,
    name: 'Unpainted',
    description:
      'Warband member looks like a statue. Monsters ignore them until they attack the monster.',
    type: 'unpainted',
  },
  {
    number: 4,
    name: 'Rogue',
    description:
      'Deals 1d4 additional damage if either attacking or defending model is standing in the shadow of terrain.',
    type: 'rogue',
  },
  {
    number: 5,
    name: 'TNT',
    description:
      'Warband member starts every Scenario with a Black Powder Bomb or Space Grenade.',
    type: 'tnt',
  },
  {
    number: 6,
    name: 'Gambler',
    description:
      'Warband member can reroll dice but if they fail on a second roll the result is considered a Fumble.',
    type: 'gambler',
  },
  {
    number: 7,
    name: 'Mother of Crows',
    description:
      'Warband member can, as an action, summon crows to attack another model. Other models take 2 HP damage if they fail an Agility test.',
    type: 'mother-of-crows',
  },
  {
    number: 8,
    name: 'Skulls',
    description:
      'Warband member carries a skull on them at all times. The skull takes up no Equipment slots and can be used as a Makeshift Weapon.',
    type: 'skulls',
  },
  {
    number: 9,
    name: 'BiblioTech',
    description:
      'Player can pick any Feat from any Forbidden Psalm game they own. [Reroll if you don\'t own any or buy one.]',
    type: 'bibliotech',
  },
  {
    number: 10,
    name: 'Undead',
    description:
      'Warband member cannot be healed by potions, but is immune to Disease, Bleeding, and Poison and automatically passes Death Saves.',
    type: 'undead',
  },
];
