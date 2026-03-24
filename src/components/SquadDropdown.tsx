import React from 'react';
import { Squad, TechLevel } from '../types';
import './SquadDropdown.css';

interface SquadDropdownProps {
  squads: Squad[];
  currentSquadId: string | null;
  onSelect: (squadId: string | null) => void;
}

function formatTechLevel(techLevel: TechLevel): string {
  return techLevel
    .split('-')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

function formatDate(isoString: string): string {
  const date = new Date(isoString);
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = date.getFullYear();
  return `${day}/${month}/${year}`;
}

const SquadDropdown: React.FC<SquadDropdownProps> = ({ squads, currentSquadId, onSelect }) => {
  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    onSelect(value === '' ? null : value);
  };

  return (
    <div className="squad-dropdown-wrapper">
      <label htmlFor="squad-select" className="squad-dropdown-label">
        Squad:
      </label>
      <select
        id="squad-select"
        className="squad-dropdown-select"
        value={currentSquadId ?? ''}
        onChange={handleChange}
      >
        <option value="">— New Squad —</option>
        {squads.map((squad) => (
          <option key={squad.id} value={squad.id}>
            {squad.name} ({formatTechLevel(squad.techLevel)})
            {squad.dateSaved ? ` - ${formatDate(squad.dateSaved)}` : ''}
          </option>
        ))}
      </select>
    </div>
  );
};

export default SquadDropdown;
