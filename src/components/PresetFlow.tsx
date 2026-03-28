import React from 'react';
import { CharacterPreset, GameId } from '../types';
import CharacterCreationFlow from './CharacterCreationFlow';

interface PresetFlowProps {
  preset: CharacterPreset | null;
  gameId: GameId;
  onSavePreset: (preset: CharacterPreset) => void;
  onCancel: () => void;
}

const PresetFlow: React.FC<PresetFlowProps> = ({ preset, gameId, onSavePreset, onCancel }) => {
  return (
    <CharacterCreationFlow
      mode="preset"
      gameId={gameId}
      initialPreset={preset}
      onPresetSaved={onSavePreset}
      onCancel={onCancel}
    />
  );
};

export default PresetFlow;
