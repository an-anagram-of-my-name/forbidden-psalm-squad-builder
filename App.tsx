import React, { useState, useEffect } from 'react';
import { AppState } from './types';
import SquadBuilder from './components/SquadBuilder';
import './App.css';

const App: React.FC = () => {
  const [appState, setAppState] = useState<AppState>({
    presets: [],
    squads: [],
  });

  // Load app state from localStorage on mount
  useEffect(() => {
    const savedState = localStorage.getItem('forbidden-psalm-state');
    if (savedState) {
      try {
        setAppState(JSON.parse(savedState));
      } catch (error) {
        console.error('Failed to load saved state:', error);
      }
    }
  }, []);

  // Save app state to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('forbidden-psalm-state', JSON.stringify(appState));
  }, [appState]);

  return (
    <div className="app">
      <SquadBuilder />
    </div>
  );
};

export default App;
