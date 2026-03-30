/**
 * Kill Sample Process (KSP) Cybermod data types and data.
 */

export interface CybermodData {
  id: string;
  number: number;
  name: string;
  cost: number;
  description: string;
  canBeFlawed: boolean;
}

export interface SelectedCybermod {
  id: string;
  name: string;
  cost: number;
  isFlawed: boolean;
}

export const cybermodsKSP: CybermodData[] = [
  {
    id: 'edward',
    number: 1,
    name: 'Edward',
    cost: 250,
    description: 'Arm-mounted Katana. Melee weapon installed in the arm, 2D6 damage, Agility.',
    canBeFlawed: true,
  },
  {
    id: 'wrist-mobility',
    number: 2,
    name: 'Wrist Mounted Mobility Device',
    cost: 300,
    description: 'Grappling hook. 1D6 damage, Ranged 6, Agility. Can be used to traverse terrain.',
    canBeFlawed: true,
  },
  {
    id: 'bm-biochip',
    number: 3,
    name: 'BM BIOCHIP',
    cost: 200,
    description: 'Reroll failed Guts tests.',
    canBeFlawed: true,
  },
  {
    id: 'circuit-level-gateway',
    number: 4,
    name: 'Circuit Level Gateway',
    cost: 300,
    description: '-3 to hacking attempts against this character.',
    canBeFlawed: true,
  },
  {
    id: 'network-uplink',
    number: 5,
    name: 'Network Uplink',
    cost: 300,
    description: 'Reroll failed Knowledge tests.',
    canBeFlawed: true,
  },
  {
    id: 'heads-up-display',
    number: 6,
    name: 'Heads Up Display',
    cost: 200,
    description: '+1 to shoot rolls made with Cyber weapons.',
    canBeFlawed: true,
  },
  {
    id: 'lazer-eye',
    number: 7,
    name: 'Lazer Eye',
    cost: 200,
    description: '1D6 damage, Ranged 6, Presence.',
    canBeFlawed: true,
  },
  {
    id: 'go-go-gadget',
    number: 8,
    name: 'Go Go Gadget',
    cost: 200,
    description: 'Ignore terrain less than 4 inches tall.',
    canBeFlawed: true,
  },
  {
    id: 'iron-lung',
    number: 9,
    name: 'Iron Lung',
    cost: 300,
    description: 'Ignore Gas and Smoke effects.',
    canBeFlawed: true,
  },
  {
    id: 'hidden-carry',
    number: 10,
    name: 'Hidden Carry',
    cost: 100,
    description: 'Install one Ranged+Cyber weapon outside of normal equipment slots. Cost includes 100 cr install fee plus the weapon\'s own cost.',
    canBeFlawed: true,
  },
  {
    id: 'tazer-hands',
    number: 11,
    name: 'Tazer Hands',
    cost: 250,
    description: 'Recharge by moving 3 inches. Melee electric attack.',
    canBeFlawed: true,
  },
  {
    id: 'auto-injector',
    number: 12,
    name: 'Auto Injector',
    cost: 350,
    description: 'First time the character is downed: make a Toughness test. On a pass, heal 1D4 HP.',
    canBeFlawed: true,
  },
];
