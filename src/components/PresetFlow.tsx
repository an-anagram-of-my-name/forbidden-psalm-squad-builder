import React from 'react';
import { CharacterPreset } from '../types';
import CharacterCreationFlow from './CharacterCreationFlow';

interface PresetFlowProps {
  preset: CharacterPreset | null;
  onSavePreset: (preset: CharacterPreset) => void;
  onCancel: () => void;
}

const PresetFlow: React.FC<PresetFlowProps> = ({ preset, onSavePreset, onCancel }) => {
  return (
    <CharacterCreationFlow
      mode="preset"
      initialPreset={preset}
      onPresetSaved={onSavePreset}
      onCancel={onCancel}
    />
  );
};

export default PresetFlow;
