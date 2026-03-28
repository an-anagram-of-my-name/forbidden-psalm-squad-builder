import React, { useState, useEffect } from 'react';
import { AppState, Squad, CharacterPreset, GameId } from './types';
import SquadBuilder from './components/SquadBuilder';
import PresetFlow from './components/PresetFlow';
import GameSelector from './components/GameSelector';
import './App.css';

const STORAGE_KEY = 'squad-builder-state';

const App: React.FC = () => {
  const [appState, setAppState] = useState<AppState>({
    presets: [],
    squads: [],
    currentSquadId: null,
    currentGameId: null,
  });
  const [showPresetFlow, setShowPresetFlow] = useState(false);
  const [currentPresetId, setCurrentPresetId] = useState<string | null>(null);

  // Load app state from localStorage on mount
  useEffect(() => {
    const savedState = localStorage.getItem(STORAGE_KEY);
    if (savedState) {
      try {
        const parsed = JSON.parse(savedState);
        setAppState({
          presets: parsed.presets || [],
          squads: parsed.squads || [],
          currentSquadId: parsed.currentSquadId ?? null,
          currentGameId: parsed.currentGameId ?? null,
        });
      } catch (error) {
        console.error('Failed to load saved state:', error);
      }
    }
  }, []);

  // Save app state to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(appState));
  }, [appState]);

  const handleGameSelected = (gameId: GameId) => {
    setAppState((prev) => ({ ...prev, currentGameId: gameId, currentSquadId: null }));
    setShowPresetFlow(false);
    setCurrentPresetId(null);
  };

  const handleChangeGame = () => {
    setAppState((prev) => ({ ...prev, currentGameId: null, currentSquadId: null }));
    setShowPresetFlow(false);
    setCurrentPresetId(null);
  };

  const handleSaveSquad = (squad: Squad) => {
    const savedSquad: Squad = {
      ...squad,
      dateSaved: new Date().toISOString(),
    };
    setAppState((prev) => {
      const squads = prev.squads.filter((s) => s.id !== squad.id);
      return {
        ...prev,
        squads: [...squads, savedSquad],
        currentSquadId: squad.id,
      };
    });
  };

  const handleLoadSquad = (squadId: string) => {
    setAppState((prev) => ({ ...prev, currentSquadId: squadId }));
  };

  const handleNewSquad = () => {
    setAppState((prev) => ({ ...prev, currentSquadId: null }));
  };

  const handleDeleteSquad = (squadId: string) => {
    setAppState((prev) => ({
      ...prev,
      squads: prev.squads.filter((s) => s.id !== squadId),
      currentSquadId: null,
    }));
  };

  const handleNewPreset = () => {
    setCurrentPresetId(null);
    setShowPresetFlow(true);
  };

  const handleLoadPreset = (presetId: string) => {
    setCurrentPresetId(presetId);
    setShowPresetFlow(true);
  };

  const handleSavePreset = (preset: CharacterPreset) => {
    setAppState((prev) => {
      const presets = prev.presets.filter((p) => p.id !== preset.id);
      return { ...prev, presets: [...presets, preset] };
    });
    setShowPresetFlow(false);
    setCurrentPresetId(null);
  };

  const handleCancelPreset = () => {
    setShowPresetFlow(false);
    setCurrentPresetId(null);
  };

  // Show game selector when no game is selected
  if (appState.currentGameId === null) {
    return (
      <div className="app">
        <GameSelector onGameSelected={handleGameSelected} />
      </div>
    );
  }

  // Placeholder for Kill Sample Process
  if (appState.currentGameId === 'kill-sample-process') {
    return (
      <div className="app">
        <div className="game-placeholder">
          <button onClick={handleChangeGame} className="btn-change-game">
            ← Change Game
          </button>
          <h1>Kill Sample Process</h1>
          <p>Squad builder support for Kill Sample Process is coming soon.</p>
        </div>
      </div>
    );
  }

  // Filter squads and presets to the current game
  const gameSquads = appState.squads.filter((s) => s.gameId === appState.currentGameId);
  const gamePresets = appState.presets.filter((p) => p.gameId === appState.currentGameId);

  const currentSquad = gameSquads.find((s) => s.id === appState.currentSquadId) ?? null;
  const currentPreset = gamePresets.find((p) => p.id === currentPresetId) ?? null;

  if (showPresetFlow) {
    return (
      <div className="app">
        <PresetFlow
          preset={currentPreset}
          gameId={appState.currentGameId}
          onSavePreset={handleSavePreset}
          onCancel={handleCancelPreset}
        />
      </div>
    );
  }

  return (
    <div className="app">
      <SquadBuilder
        gameId={appState.currentGameId}
        onChangeGame={handleChangeGame}
        savedSquads={gameSquads}
        currentSquadId={appState.currentSquadId}
        initialSquad={currentSquad}
        onSaveSquad={handleSaveSquad}
        onLoadSquad={handleLoadSquad}
        onNewSquad={handleNewSquad}
        onDeleteSquad={handleDeleteSquad}
        presets={gamePresets}
        onNewPreset={handleNewPreset}
        onLoadPreset={handleLoadPreset}
      />
    </div>
  );
};

export default App;

