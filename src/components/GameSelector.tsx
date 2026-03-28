import React from 'react';
import { GameId } from '../types';
import { getAllGameConfigs } from '../types/games';
import './GameSelector.css';

interface GameSelectorProps {
  onGameSelected: (gameId: GameId) => void;
}

const GameSelector: React.FC<GameSelectorProps> = ({ onGameSelected }) => {
  const games = getAllGameConfigs();

  return (
    <div className="game-selector">
      <div className="game-selector-container">
        <h1>Forbidden Psalm Squad Builder</h1>
        <p className="game-selector-description">
          Select a game to start building your squad.
        </p>

        <div className="game-options">
          {games.map((game) => (
            <div
              key={game.id}
              className={`game-card game-card--${game.id}`}
              onClick={() => onGameSelected(game.id)}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  onGameSelected(game.id);
                }
              }}
            >
              <div className="game-card-short-name">{game.shortName}</div>
              <h2>{game.displayName}</h2>
              {game.id === '28-psalms' && (
                <p>Build squads of 5 characters with feats, flaws and equipment.</p>
              )}
              {game.id === 'kill-sample-process' && (
                <p>Coming soon — support for Kill Sample Process.</p>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default GameSelector;
