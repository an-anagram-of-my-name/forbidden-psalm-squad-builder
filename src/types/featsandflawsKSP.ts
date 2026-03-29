/**
 * Feats and Flaws data for Kill Sample Process (KSP) ruleset
 *
 * Flaws: 20 flaws, 24 entries total:
 *   - Flaws #1–17: 17 single entries
 *   - Flaw  #18 (Mutant): 5 stat-variant entries (groupId: 'mutant')
 *   - Flaws #19–20: 2 single entries
 *
 * Feats: 20 feats, 30 entries total:
 *   - Feats #1–14: 14 single entries
 *   - Feat  #15 (Second Heart): 6 HP-variant entries (groupId: 'second-heart')
 *   - Feats #16–19: 4 single entries
 *   - Feat  #20 (Experimental): 6 scenario-variant entries (groupId: 'experimental')
 */

import { FeatData, FlawData } from './index';

export const flawsKSP: FlawData[] = [
  // 1: Technophobe
  {
    number: 1,
    name: 'Technophobe',
    description: 'Cannot use weapons or equipment with Cyber keyword.',
    type: 'technophobe',
  },
  // 2: Rube
  {
    number: 2,
    name: 'Rube',
    description: 'DR for hacking Rube is only DR9.',
    type: 'rube',
  },
  // 3: Break Bad
  {
    number: 3,
    name: 'Break Bad',
    description: 'Character cannot enter a scenario without Blue Crystal on them.',
    type: 'break-bad',
  },
  // 4: Bad Connection
  {
    number: 4,
    name: 'Bad Connection',
    description: 'Any installed CyberMods gain the Flawed trait.',
    type: 'bad-connection',
  },
  // 5: Wannabe PunK
  {
    number: 5,
    name: 'Wannabe PunK',
    description: 'People see through them. All items cost 50 more creds for them to equip at crew creation.',
    type: 'wannabe-punk',
  },
  // 6: Infected
  {
    number: 6,
    name: 'Infected',
    description: 'Starts each Scenario Diseased (pg. 32).',
    type: 'infected',
  },
  // 7: Flatline
  {
    number: 7,
    name: 'Flatline',
    description: '-2 to all Presence tests.',
    type: 'flatline',
    statModifiers: { presence: -2 },
  },
  // 8: S.A.S.
  // -2 Agility does not reduce Movement; derivedStatModifiers compensates.
  {
    number: 8,
    name: 'S.A.S.',
    description: '-2 to all Agility Tests (does not reduce movement).',
    type: 'sas',
    statModifiers: { agility: -2 },
    derivedStatModifiers: { movement: 2 },
  },
  // 9: Ghost
  {
    number: 9,
    name: 'Ghost',
    description: 'Whenever model takes damage, they are overcome with anger and make an attack against nearest model.',
    type: 'ghost',
  },
  // 10: Perfect
  {
    number: 10,
    name: 'Perfect',
    description: 'No Flaw and no Feat.',
    type: 'perfect',
  },
  // 11: Wanted
  {
    number: 11,
    name: 'Wanted',
    description: 'Enforcers always target this model first if they are in Line of Sight, regardless of other factors.',
    type: 'wanted',
  },
  // 12: Trigger Finger
  {
    number: 12,
    name: 'Trigger Finger',
    description: 'Always expends the total ammo when firing a gun.',
    type: 'trigger-finger',
  },
  // 13: DEBT
  {
    number: 13,
    name: 'DEBT',
    description: 'Crews with this member earn 50 less creds per Scenario.',
    type: 'debt',
  },
  // 14: Double Down
  {
    number: 14,
    name: 'Double Down',
    description: 'Flip a coin: on tails pick a Flaw, on heads roll and take 2 Flaws.',
    type: 'double-down',
  },
  // 15: Decide
  {
    number: 15,
    name: 'Decide',
    description: 'Can pick any other Flaw.',
    type: 'decide',
  },
  // 16: Fanatic
  {
    number: 16,
    name: 'Fanatic',
    description: 'Must pray after killing a model: next activation after killing a model can only be to move.',
    type: 'fanatic',
  },
  // 17: Turing Test
  {
    number: 17,
    name: 'Turing Test',
    description: 'If model downed at end of Scenario they die, as they are left behind as others assume they are a robot.',
    type: 'turing-test',
  },
  // 18: Mutant — 5 variants, one per stat, grouped for fair random selection.
  // Each variant applies -1 to the named stat; using groupId allows the random-picker
  // to treat all variants as a single probability slot.
  {
    number: 18,
    name: 'Mutant (Agility)',
    description: 'Gain 1 random Mutation and -1 to Agility.',
    type: 'mutant-agility',
    statModifiers: { agility: -1 },
    groupId: 'mutant',
  },
  {
    number: 18,
    name: 'Mutant (Presence)',
    description: 'Gain 1 random Mutation and -1 to Presence.',
    type: 'mutant-presence',
    statModifiers: { presence: -1 },
    groupId: 'mutant',
  },
  {
    number: 18,
    name: 'Mutant (Strength)',
    description: 'Gain 1 random Mutation and -1 to Strength.',
    type: 'mutant-strength',
    statModifiers: { strength: -1 },
    groupId: 'mutant',
  },
  {
    number: 18,
    name: 'Mutant (Toughness)',
    description: 'Gain 1 random Mutation and -1 to Toughness.',
    type: 'mutant-toughness',
    statModifiers: { toughness: -1 },
    groupId: 'mutant',
  },
  {
    number: 18,
    name: 'Mutant (Knowledge)',
    description: 'Gain 1 random Mutation and -1 to Knowledge.',
    type: 'mutant-knowledge',
    statModifiers: { knowledge: -1 },
    groupId: 'mutant',
  },
  // 19: Sensory Overload
  {
    number: 19,
    name: 'Sensory Overload',
    description: 'If model can see two enemies, suffers -3 to all tests.',
    type: 'sensory-overload',
  },
  // 20: Mycotoxin
  {
    number: 20,
    name: 'Mycotoxin',
    description: 'Model suffers -1 to all stats but is immune to Poison and Disease.',
    type: 'mycotoxin',
    statModifiers: { agility: -1, presence: -1, strength: -1, toughness: -1, knowledge: -1 },
  },
];

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
