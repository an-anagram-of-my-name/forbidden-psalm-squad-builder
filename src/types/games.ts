import { GameId } from './index';

export interface GameConfig {
  id: GameId;
  displayName: string;
  shortName: string;
  hasTechLevel: boolean;
}

export const GAME_CONFIGS: Record<GameId, GameConfig> = {
  '28-psalms': {
    id: '28-psalms',
    displayName: '28 Psalms',
    shortName: '28P',
    hasTechLevel: true,
  },
  'kill-sample-process': {
    id: 'kill-sample-process',
    displayName: 'Kill Sample Process',
    shortName: 'KSP',
    hasTechLevel: false,
  },
};

export function getGameConfig(gameId: GameId): GameConfig {
  return GAME_CONFIGS[gameId];
}

export function getAllGameConfigs(): GameConfig[] {
  return Object.values(GAME_CONFIGS);
}
