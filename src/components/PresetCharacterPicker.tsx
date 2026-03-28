import React from 'react';
import { CharacterPreset, TechLevel, Character } from '../types';
import CharacterSummary from './CharacterSummary';
import './PresetCharacterPicker.css';

interface PresetCharacterPickerProps {
  presets: CharacterPreset[];
  squadTechLevel: TechLevel | undefined;
  onSelectPreset: (preset: CharacterPreset) => void;
  onCancel: () => void;
}

const PresetCharacterPicker: React.FC<PresetCharacterPickerProps> = ({
  presets,
  squadTechLevel,
  onSelectPreset,
  onCancel,
}) => {
  const compatiblePresets = squadTechLevel
    ? presets.filter((p) => p.techLevel === squadTechLevel)
    : presets;

  const techLevelLabel = squadTechLevel
    ? squadTechLevel === 'past-tech' ? 'Past-Tech' : 'Future-Tech'
    : 'All';

  return (
    <div className="preset-picker-overlay" onClick={onCancel}>
      <div className="preset-picker-modal" onClick={(e) => e.stopPropagation()}>
        <div className="preset-picker-header">
          <h2>Select a Character Preset</h2>
          <button className="preset-picker-close" onClick={onCancel} aria-label="Close">
            ✕
          </button>
        </div>

        <p className="preset-picker-filter-info">
          Showing {compatiblePresets.length} of {presets.length} presets ({techLevelLabel})
        </p>

        {compatiblePresets.length === 0 ? (
          <div className="preset-picker-empty">
            <p>
              {squadTechLevel
                ? 'No compatible presets for this tech-level.'
                : 'No presets available.'}
            </p>
            {squadTechLevel && (
              <p>Create a {techLevelLabel} character preset to add it to your squad.</p>
            )}
          </div>
        ) : (
          <div className="preset-picker-grid">
            {compatiblePresets.map((preset) => {
              // Convert CharacterPreset to Character shape for CharacterSummary
              const previewCharacter: Character = {
                id: preset.id,
                name: preset.name,
                stats: preset.stats,
                flaw: preset.flaw,
                feat: preset.feat,
                equipment: preset.equipment,
                gameId: preset.gameId,
                techLevel: preset.techLevel,
              };
              return (
                <div
                  key={preset.id}
                  className="preset-picker-card"
                  onClick={() => onSelectPreset(preset)}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      onSelectPreset(preset);
                    }
                  }}
                >
                  <div className="preset-picker-card-inner">
                    <CharacterSummary character={previewCharacter} />
                  </div>
                </div>
              );
            })}
          </div>
        )}

        <div className="preset-picker-footer">
          <button className="btn-secondary" onClick={onCancel}>
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default PresetCharacterPicker;
