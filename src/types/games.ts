import { GameId, StatName, Stats, DerivedStats } from './index';

export interface GameConfig {
  id: GameId;
  displayName: string;
  shortName: string;
  hasTechLevel: boolean;
  statNames: StatName[];
  statShortLabels: Partial<Record<StatName, string>>;
  derivedStatMap: Partial<Record<StatName, { label: string; base: number; derivedKey: keyof DerivedStats }>>;
  validDistributions: number[][];
  derivedStatFormulas: (stats: Stats) => DerivedStats;
}

export const GAME_CONFIGS: Record<GameId, GameConfig> = {
  '28-psalms': {
    id: '28-psalms',
    displayName: '28 Psalms',
    shortName: '28P',
    hasTechLevel: true,
    statNames: ['agility', 'presence', 'strength', 'toughness'],
    statShortLabels: {
      agility: 'AGI',
      presence: 'PRE',
      strength: 'STR',
      toughness: 'TOU',
    },
    derivedStatMap: {
      agility: { label: 'MOV', base: 5, derivedKey: 'movement' },
      strength: { label: 'SLOTS', base: 5, derivedKey: 'equipmentSlots' },
      toughness: { label: 'HP', base: 8, derivedKey: 'hp' },
    },
    validDistributions: [
      [3, 1, 0, -3],
      [2, 2, -1, -2],
    ],
    derivedStatFormulas: (stats: Stats) => ({
      hp: 8 + (stats.toughness ?? 0),
      movement: 5 + (stats.agility ?? 0),
      equipmentSlots: 5 + (stats.strength ?? 0),
    }),
  },
  'kill-sample-process': {
    id: 'kill-sample-process',
    displayName: 'Kill Sample Process',
    shortName: 'KSP',
    hasTechLevel: false,
    statNames: ['agility', 'presence', 'strength', 'toughness', 'knowledge'],
    statShortLabels: {
      agility: 'AGI',
      presence: 'PRE',
      strength: 'STR',
      toughness: 'TOU',
      knowledge: 'KNOW',
    },
    derivedStatMap: {
      agility: { label: 'MOV', base: 5, derivedKey: 'movement' },
      strength: { label: 'SLOTS', base: 5, derivedKey: 'equipmentSlots' },
      toughness: { label: 'HP', base: 8, derivedKey: 'hp' },
    },
    validDistributions: [
      [3, 1, 0, 0, -3],
      [2, 2, 0, -1, -2],
    ],
    derivedStatFormulas: (stats: Stats) => ({
      hp: 8 + (stats.toughness ?? 0),
      movement: 5 + (stats.agility ?? 0),
      equipmentSlots: 5 + (stats.strength ?? 0),
    }),
  },
};

export function getGameConfig(gameId: GameId): GameConfig {
  return GAME_CONFIGS[gameId];
}

export function getAllGameConfigs(): GameConfig[] {
  return Object.values(GAME_CONFIGS);
}
