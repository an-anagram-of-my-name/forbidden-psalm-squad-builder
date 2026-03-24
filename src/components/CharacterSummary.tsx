import React from 'react';
import { Character } from '../types';
import { applyFlawFeatModifiers, calculateDerivedStats } from '../utils/stats';
import './CharacterSummary.css';

interface CharacterSummaryProps {
  character: Character;
}

const CharacterSummary: React.FC<CharacterSummaryProps> = ({ character }) => {
  const effectiveStats = applyFlawFeatModifiers(character.stats, character.flaw, character.feat);
  const derived = calculateDerivedStats(effectiveStats);
  const equipmentCost = character.equipment.reduce((sum, eq) => sum + eq.cost, 0);
  const slotCapacity = 5 + effectiveStats.strength;
  const slotsUsed = character.equipment.reduce((sum, eq) => sum + eq.slots, 0);

  const fmt = (v: number) => v > 0 ? `+${v}` : `${v}`;

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
            <span className="stat-value">{fmt(effectiveStats.agility)}</span>
          </div>
          <div className="stat-box derived">
            <span className="stat-name">MOV</span>
            <span className="stat-value">{derived.movement}</span>
          </div>
          <div className="stat-box">
            <span className="stat-name">PRE</span>
            <span className="stat-value">{fmt(effectiveStats.presence)}</span>
          </div>
          <div className="stat-box placeholder">
            <span className="stat-name">—</span>
            <span className="stat-value">—</span>
          </div>
          <div className="stat-box">
            <span className="stat-name">STR</span>
            <span className="stat-value">{fmt(effectiveStats.strength)}</span>
          </div>
          <div className="stat-box derived">
            <span className="stat-name">SLOTS</span>
            <span className="stat-value">{derived.equipmentSlots}</span>
          </div>
          <div className="stat-box">
            <span className="stat-name">TOU</span>
            <span className="stat-value">{fmt(effectiveStats.toughness)}</span>
          </div>
          <div className="stat-box derived">
            <span className="stat-name">HP</span>
            <span className="stat-value">{derived.hp}</span>
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
