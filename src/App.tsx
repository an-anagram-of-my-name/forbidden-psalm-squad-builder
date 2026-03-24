import React, { useState, useEffect } from 'react';
import { AppState, Squad } from './types';
import SquadBuilder from './components/SquadBuilder';
import './App.css';

const App: React.FC = () => {
  const [appState, setAppState] = useState<AppState>({
    presets: [],
    squads: [],
    currentSquadId: null,
  });

  // Load app state from localStorage on mount
  useEffect(() => {
    const savedState = localStorage.getItem('forbidden-psalm-state');
    if (savedState) {
      try {
        const parsed = JSON.parse(savedState);
        setAppState({
          presets: parsed.presets || [],
          squads: parsed.squads || [],
          currentSquadId: parsed.currentSquadId ?? null,
        });
      } catch (error) {
        console.error('Failed to load saved state:', error);
      }
    }
  }, []);

  // Save app state to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('forbidden-psalm-state', JSON.stringify(appState));
  }, [appState]);

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

  const currentSquad = appState.squads.find((s) => s.id === appState.currentSquadId) ?? null;

  return (
    <div className="app">
      <SquadBuilder
        savedSquads={appState.squads}
        currentSquadId={appState.currentSquadId}
        initialSquad={currentSquad}
        onSaveSquad={handleSaveSquad}
        onLoadSquad={handleLoadSquad}
        onNewSquad={handleNewSquad}
      />
    </div>
  );
};

export default App;

