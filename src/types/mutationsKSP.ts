/**
 * Kill Sample Process (KSP) Mutation data types and data.
 */

import { StatName } from './index';

/** Partial primary-stat modifiers for mutations. */
export type MutationStatMods = Partial<Record<StatName, number>>;

export interface MutationData {
  id: string;
  number: number;
  name: string;
  description: string;
  drawback: string;
  statMods: MutationStatMods;
  /** Groups variants of a single mutation (e.g. mutable-form-1 through mutable-form-6). */
  groupId?: string;
  /**
   * When true, selecting this mutation applies −1 to the cybermod allowance.
   * Used for the Rejection mutation ("All CyberMods are lost").
   */
  reducesCybermods?: boolean;
}

export interface SelectedMutation {
  id: string;
  name: string;
  statMods: MutationStatMods;
}

export const mutationsKSP: MutationData[] = [
  {
    id: 'x-ray',
    number: 1,
    name: 'X-ray',
    description: 'Can target models that are behind 1 inch or less thick terrain with ranged weapons.',
    drawback: '-3 to attack models in line of sight.',
    statMods: {},
  },
  {
    id: 'xeno',
    number: 2,
    name: 'Xeno',
    description: 'Blood is replaced with acid. Whenever this crewmember takes damage, any model within 1 inch takes 1 damage that ignores armor.',
    drawback: 'Cannot be healed by Trauma Kits.',
    statMods: {},
  },
  {
    id: 'thick-skull',
    number: 3,
    name: 'Thick Skull',
    description: 'Immune to being Dazed and Stunned.',
    drawback: '-1 Presence and -2 Knowledge.',
    statMods: { presence: -1, knowledge: -2 },
  },
  {
    id: 'hairy-eyes',
    number: 4,
    name: 'Hairy Eyes',
    description: 'Hair grows from the crewmember\'s eyes.',
    drawback: '-1 to all Presence tests.',
    statMods: { presence: -1 },
  },
  {
    id: 'croc',
    number: 5,
    name: 'Croc',
    description: 'Gains a bite attack (Strength, 1D6) and +1 Natural Armor that stacks with Armor.',
    drawback: 'Cannot use hacking Programmes.',
    statMods: {},
  },
  {
    id: 'mustela-gulo',
    number: 6,
    name: 'Mustela gulo',
    description: 'Heals 1 damage per round. Gains a Claw Attack (Agility, 1D4).',
    drawback: 'All other crewmembers in the same crew refuse to heal them as they are rude.',
    statMods: {},
  },
  {
    id: 'precog',
    number: 7,
    name: 'Precog',
    description: 'Sees the future — when targeted by an attack can move 6 inches in any direction. If this move takes them out of range, the attack fails.',
    drawback: 'Whenever it uses this ability must make a Guts check. It starts to ponder free will vs predetermination.',
    statMods: {},
  },
  {
    id: 'telekinetic',
    number: 8,
    name: 'Telekinetic',
    description: 'Can move an item or model 3 inches as an action.',
    drawback: 'Easier to shoot — those targeting them gain +3 to ranged attacks. Their head grows in size!',
    statMods: {},
  },
  {
    id: 'cat-eyes',
    number: 9,
    name: 'Cat Eyes',
    description: 'Ignores the Darkness condition.',
    drawback: '-6 to attack models with a torch.',
    statMods: {},
  },
  {
    id: 'boneitis',
    number: 10,
    name: 'Boneitis',
    description: 'Totally fine.',
    drawback: 'If the crewmember ever Fumbles any Toughness test they are immediately killed.',
    statMods: {},
  },
  {
    id: 'rejection',
    number: 11,
    name: 'Rejection',
    description: 'Model is immune to Disease and Poisons.',
    drawback: 'All CyberMods are lost.',
    statMods: {},
    reducesCybermods: true,
  },
  // Mutable Form — displayed as 6 grouped variants (each represents one of the D6 scenario results)
  {
    id: 'mutable-form-1',
    number: 12,
    name: 'Mutable Form',
    description: 'Ignores the effects of Critical hits dealt to them. D6 Scenario effect: Strength and Presence are swapped.',
    drawback: 'At the start of each Scenario roll a D6 and apply the result.',
    statMods: {},
    groupId: 'mutable-form',
  },
  {
    id: 'mutable-form-2',
    number: 12,
    name: 'Mutable Form',
    description: 'Ignores the effects of Critical hits dealt to them. D6 Scenario effect: Agility and Knowledge are swapped.',
    drawback: 'At the start of each Scenario roll a D6 and apply the result.',
    statMods: {},
    groupId: 'mutable-form',
  },
  {
    id: 'mutable-form-3',
    number: 12,
    name: 'Mutable Form',
    description: 'Ignores the effects of Critical hits dealt to them. D6 Scenario effect: This Mutation is lost — roll a new Mutation.',
    drawback: 'At the start of each Scenario roll a D6 and apply the result.',
    statMods: {},
    groupId: 'mutable-form',
  },
  {
    id: 'mutable-form-4',
    number: 12,
    name: 'Mutable Form',
    description: 'Ignores the effects of Critical hits dealt to them. D6 Scenario effect: Gains the benefit of another random Mutation for this Scenario.',
    drawback: 'At the start of each Scenario roll a D6 and apply the result.',
    statMods: {},
    groupId: 'mutable-form',
  },
  {
    id: 'mutable-form-5',
    number: 12,
    name: 'Mutable Form',
    description: 'Ignores the effects of Critical hits dealt to them. D6 Scenario effect: Must pick one additional Mutation to gain the benefit and drawback of for this Scenario.',
    drawback: 'At the start of each Scenario roll a D6 and apply the result.',
    statMods: {},
    groupId: 'mutable-form',
  },
  {
    id: 'mutable-form-6',
    number: 12,
    name: 'Mutable Form',
    description: 'Ignores the effects of Critical hits dealt to them. D6 Scenario effect: Legs become gel-like — suffers -4 Agility this Scenario.',
    drawback: 'At the start of each Scenario roll a D6 and apply the result.',
    statMods: {},
    groupId: 'mutable-form',
  },
];
