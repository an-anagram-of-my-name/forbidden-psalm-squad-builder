import React from 'react';
import { Character } from '../types';
import { applyFlawFeatModifiers } from '../utils/stats';
import './CharacterSummary.css';

interface CharacterSummaryProps {
  character: Character;
}

const CharacterSummary: React.FC<CharacterSummaryProps> = ({ character }) => {
  const effectiveStats = applyFlawFeatModifiers(character.stats, character.flaw, character.feat);
  const equipmentCost = character.equipment.reduce((sum, eq) => sum + eq.cost, 0);
  const slotCapacity = 5 + effectiveStats.strength;
  const slotsUsed = character.equipment.reduce((sum, eq) => sum + eq.slots, 0);

  return (
    <div className="character-summary">
      <div className="summary-header">
        <h3>{character.name}</h3>
        <span className="tech-badge">{character.techLevel}</span>
      </div>

      <div className="summary-section">
        <h4>Stats</h4>
        <div className="stats-grid">
          <div className="stat-box">
            <span className="stat-name">AGI</span>
            <span className="stat-value">{effectiveStats.agility}</span>
          </div>
          <div className="stat-box">
            <span className="stat-name">PRE</span>
            <span className="stat-value">{effectiveStats.presence}</span>
          </div>
          <div className="stat-box">
            <span className="stat-name">STR</span>
            <span className="stat-value">{effectiveStats.strength}</span>
          </div>
          <div className="stat-box">
            <span className="stat-name">TOU</span>
            <span className="stat-value">{effectiveStats.toughness}</span>
          </div>
        </div>
      </div>

      <div className="summary-section">
        <h4>Traits</h4>
        <div className="traits">
          <div className="trait">
            <span className="trait-type">Flaw:</span>
            <span className="trait-name">{character.flaw.type}</span>
          </div>
          <div className="trait">
            <span className="trait-type">Feat:</span>
            <span className="trait-name">{character.feat.type}</span>
          </div>
        </div>
      </div>

      <div className="summary-section">
        <h4>Equipment</h4>
        <div className="equipment-info">
          <div className="info-row">
            <span>Items:</span>
            <span className="info-value">{character.equipment.length}</span>
          </div>
          <div className="info-row">
            <span>Cost:</span>
            <span className="info-value">{equipmentCost} cr</span>
          </div>
          <div className="info-row">
            <span>Slots:</span>
            <span className={`info-value ${slotsUsed > slotCapacity ? 'over-limit' : ''}`}>
              {slotsUsed} / {slotCapacity}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CharacterSummary;
