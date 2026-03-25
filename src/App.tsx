import React, { useState, useEffect } from 'react';
import { AppState, Squad, CharacterPreset } from './types';
import SquadBuilder from './components/SquadBuilder';
import PresetFlow from './components/PresetFlow';
import './App.css';

const App: React.FC = () => {
  const [appState, setAppState] = useState<AppState>({
    presets: [],
    squads: [],
    currentSquadId: null,
  });
  const [showPresetFlow, setShowPresetFlow] = useState(false);
  const [currentPresetId, setCurrentPresetId] = useState<string | null>(null);

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

  const currentSquad = appState.squads.find((s) => s.id === appState.currentSquadId) ?? null;
  const currentPreset = appState.presets.find((p) => p.id === currentPresetId) ?? null;

  if (showPresetFlow) {
    return (
      <div className="app">
        <PresetFlow
          preset={currentPreset}
          onSavePreset={handleSavePreset}
          onCancel={handleCancelPreset}
        />
      </div>
    );
  }

  return (
    <div className="app">
      <SquadBuilder
        savedSquads={appState.squads}
        currentSquadId={appState.currentSquadId}
        initialSquad={currentSquad}
        onSaveSquad={handleSaveSquad}
        onLoadSquad={handleLoadSquad}
        onNewSquad={handleNewSquad}
        onDeleteSquad={handleDeleteSquad}
        presets={appState.presets}
        onNewPreset={handleNewPreset}
        onLoadPreset={handleLoadPreset}
      />
    </div>
  );
};

export default App;

