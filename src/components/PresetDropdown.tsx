import React from 'react';
import { CharacterPreset } from '../types';
import './PresetDropdown.css';

interface PresetDropdownProps {
  presets: CharacterPreset[];
  currentPresetId: string | null;
  onNewPreset: () => void;
  onSelectPreset: (presetId: string) => void;
}

function formatDate(date: Date | string): string {
  const d = new Date(date);
  const day = String(d.getDate()).padStart(2, '0');
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const year = d.getFullYear();
  return `${day}/${month}/${year}`;
}

function calcTotalCost(preset: CharacterPreset): number {
  return preset.equipment.reduce((sum, eq) => sum + eq.cost, 0);
}

const PresetDropdown: React.FC<PresetDropdownProps> = ({
  presets,
  currentPresetId,
  onNewPreset,
  onSelectPreset,
}) => {
  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    if (value === '__new__') {
      onNewPreset();
    } else if (value !== '') {
      onSelectPreset(value);
    }
  };

  const sortedPresets = [...presets].sort((a, b) =>
    a.name.localeCompare(b.name)
  );

  return (
    <div className="preset-dropdown-wrapper">
      <label htmlFor="preset-select" className="preset-dropdown-label">
        Presets:
      </label>
      <select
        id="preset-select"
        className="preset-dropdown-select"
        value={currentPresetId ?? ''}
        onChange={handleChange}
      >
        <option value="">— Select Preset —</option>
        <option value="__new__">+ New Character Template</option>
        {sortedPresets.map((preset) => (
          <option key={preset.id} value={preset.id}>
            {preset.name} ({calcTotalCost(preset)} cr) - {formatDate(preset.updatedAt)}
          </option>
        ))}
      </select>
    </div>
  );
};

export default PresetDropdown;
