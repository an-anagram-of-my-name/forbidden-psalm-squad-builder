/**
 * Feats and Flaws data for Kill Sample Process (KSP) ruleset
 *
 * Flaws:
 *   - Placeholder empty array (full data will be added in a future feature)
 *
 * Feats: 20 feats, 30 entries total:
 *   - Feats #1–14: 14 single entries
 *   - Feat  #15 (Second Heart): 6 HP-variant entries (groupId: 'second-heart')
 *   - Feats #16–19: 4 single entries
 *   - Feat  #20 (Experimental): 6 scenario-variant entries (groupId: 'experimental')
 */

import { FeatData, FlawData } from './index';

/**
 * KSP Flaws - Placeholder
 * Full flaw data will be implemented in a future feature.
 */
export const flawsKSP: FlawData[] = [];

export const featsKSP: FeatData[] = [
  // 1: Butch
  {
    number: 1,
    name: 'Butch',
    description: '+3 to melee with Katanas.',
    type: 'butch',
  },
  // 2: Modable
  {
    number: 2,
    name: 'Modable',
    description: 'Installed CyberMods never gain Flawed trait.',
    type: 'modable',
  },
  // 3: Priest of Tech
  {
    number: 3,
    name: 'Priest of Tech',
    description: 'Comes with 2 CyberMods.',
    type: 'priest-of-tech',
  },
  // 4: Feedback
  {
    number: 4,
    name: 'Feedback',
    description: 'If ever hacked, hacker takes 1D4 damage.',
    type: 'feedback',
  },
  // 5: Idiot Savant
  {
    number: 5,
    name: 'Idiot Savant',
    description: 'Start of each Scenario gains the use of one random Programme for that Scenario.',
    type: 'idiot-savant',
  },
  // 6: Bribe
  {
    number: 6,
    name: 'Bribe',
    description: 'Enforcers ignore this model unless they attack an Enforcer.',
    type: 'bribe',
  },
  // 7: Jockey
  {
    number: 7,
    name: 'Jockey',
    description: '+3 to hacking enemy guns or equipment.',
    type: 'jockey',
  },
  // 8: Firewall
  {
    number: 8,
    name: 'Firewall',
    description: '-3 to hack this model and its equipment.',
    type: 'firewall',
  },
  // 9: Combat Medic
  {
    number: 9,
    name: 'Combat Medic',
    description: 'Can heal Downed models within 1 inch for 1D4 with a successful Presence test.',
    type: 'combat-medic',
  },
  // 10: Trained
  {
    number: 10,
    name: 'Trained',
    description: 'Can select another Feat.',
    type: 'trained',
  },
  // 11: Quick Learner
  {
    number: 11,
    name: 'Quick Learner',
    description: 'All level ups cost this model 1 less XP.',
    type: 'quick-learner',
  },
  // 12: Tears in Rain
  {
    number: 12,
    name: 'Tears in Rain',
    description: 'If model ever dies they are replaced by an exact copy of them.',
    type: 'tears-in-rain',
  },
  // 13: Passive Income
  {
    number: 13,
    name: 'Passive Income',
    description: 'While model is in crew, gain 200 creds each Scenario that they participate in.',
    type: 'passive-income',
  },
  // 14: The One
  {
    number: 14,
    name: 'The One',
    description:
      'Whenever targeted by a successful ranged attack, this model can make an Agility test to ignore all damage dealt to them.',
    type: 'the-one',
  },
  // 15: Second Heart (6 variants, grouped — represents a 1D6 roll at character creation)
  {
    number: 15,
    name: 'Second Heart (+1)',
    description: 'Gains 1 extra HP.',
    type: 'second-heart-plus-1',
    derivedStatModifiers: { hp: 1 },
    groupId: 'second-heart',
  },
  {
    number: 15,
    name: 'Second Heart (+2)',
    description: 'Gains 2 extra HP.',
    type: 'second-heart-plus-2',
    derivedStatModifiers: { hp: 2 },
    groupId: 'second-heart',
  },
  {
    number: 15,
    name: 'Second Heart (+3)',
    description: 'Gains 3 extra HP.',
    type: 'second-heart-plus-3',
    derivedStatModifiers: { hp: 3 },
    groupId: 'second-heart',
  },
  {
    number: 15,
    name: 'Second Heart (+4)',
    description: 'Gains 4 extra HP.',
    type: 'second-heart-plus-4',
    derivedStatModifiers: { hp: 4 },
    groupId: 'second-heart',
  },
  {
    number: 15,
    name: 'Second Heart (+5)',
    description: 'Gains 5 extra HP.',
    type: 'second-heart-plus-5',
    derivedStatModifiers: { hp: 5 },
    groupId: 'second-heart',
  },
  {
    number: 15,
    name: 'Second Heart (+6)',
    description: 'Gains 6 extra HP.',
    type: 'second-heart-plus-6',
    derivedStatModifiers: { hp: 6 },
    groupId: 'second-heart',
  },
  // 16: X-Person
  {
    number: 16,
    name: 'X-Person',
    description: 'Can pick a Mutation.',
    type: 'x-person',
  },
  // 17: Resistant
  {
    number: 17,
    name: 'Resistant',
    description: 'Auto-pass any test to avoid Poison or Disease.',
    type: 'resistant',
  },
  // 18: Burst of Speed
  {
    number: 18,
    name: 'Burst of Speed',
    description: 'Once per Scenario can move 9 inches as an action.',
    type: 'burst-of-speed',
  },
  // 19: ZorRo
  {
    number: 19,
    name: 'ZorRo',
    description: 'Does not provoke attacks back with melee weapons.',
    type: 'zorro',
  },
  // 20: Experimental (6 variants, grouped — re-rolled at start of each scenario)
  {
    number: 20,
    name: 'Experimental (Bullet Proof)',
    description: 'Cannot be harmed by bullets. Re-roll at the start of each scenario.',
    type: 'experimental-bullet-proof',
    groupId: 'experimental',
  },
  {
    number: 20,
    name: 'Experimental (Half Damage)',
    description: 'Takes half damage from melee attacks. Re-roll at the start of each scenario.',
    type: 'experimental-half-damage',
    groupId: 'experimental',
  },
  {
    number: 20,
    name: 'Experimental (Enhanced)',
    description: '+3 Agility. Re-roll at the start of each scenario.',
    type: 'experimental-enhanced',
    statModifiers: { agility: 3 },
    groupId: 'experimental',
  },
  {
    number: 20,
    name: 'Experimental (Sedated)',
    description:
      'Falls asleep and must be woken by friendly model within 1 inch as an action. Re-roll at the start of each scenario.',
    type: 'experimental-sedated',
    groupId: 'experimental',
  },
  {
    number: 20,
    name: 'Experimental (Inert)',
    description: 'No effect. Re-roll at the start of each scenario.',
    type: 'experimental-inert',
    groupId: 'experimental',
  },
  {
    number: 20,
    name: 'Experimental (Vitalized)',
    description: 'Gains 4 extra HP. Re-roll at the start of each scenario.',
    type: 'experimental-vitalized',
    derivedStatModifiers: { hp: 4 },
    groupId: 'experimental',
  },
];
