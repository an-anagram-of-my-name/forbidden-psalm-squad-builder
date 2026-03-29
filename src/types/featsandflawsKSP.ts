/**
 * Feats and flaws data for Kill Sample Process (KSP) ruleset
 */

import { FlawData } from './featsandflaws28Psalms';

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
