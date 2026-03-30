import React from 'react';
import { Character } from '../types';
import { applyFlawFeatModifiers, calculateFinalDerivedStats } from '../utils/stats';
import { calculateTotalCost } from '../utils/equipment';
import { getGameConfig } from '../types/games';
import CharacterPortrait from './CharacterPortrait';
import './CharacterSummary.css';

interface CharacterSummaryProps {
  character: Character;
}

const CharacterSummary: React.FC<CharacterSummaryProps> = ({ character }) => {
  const config = getGameConfig(character.gameId);
  const effectiveStats = applyFlawFeatModifiers(character.stats, character.flaw, character.feat, character.gameId);
  const derived = calculateFinalDerivedStats(character.stats, character.flaw, character.feat, character.equipment, character.gameId);
  const equipmentCost = calculateTotalCost(character.equipment);
  const slotCapacity = derived.equipmentSlots;
  const slotsUsed = character.equipment.reduce((sum, eq) => sum + eq.slots, 0);

  const fmt = (v: number) => v > 0 ? `+${v}` : `${v}`;

  return (
    <div className="character-summary">
      <div className="summary-header">
        <div className="summary-header-info">
          <CharacterPortrait character={character} size="small" />
          <div className="summary-header-text">
            <h3>{character.name}</h3>
            {character.techLevel && <span className="tech-badge">{character.techLevel}</span>}
          </div>
        </div>
      </div>

      <div className="summary-section">
        <h4>Stats</h4>
        <div className="stats-grid">
          {config.statNames.map((stat) => {
            const derivedInfo = config.derivedStatMap[stat];
            const shortLabel = config.statShortLabels[stat] ?? stat.toUpperCase().slice(0, 4);
            return (
              <React.Fragment key={stat}>
                <div className="stat-box">
                  <span className="stat-name">{shortLabel}</span>
                  <span className="stat-value">{fmt(effectiveStats[stat] ?? 0)}</span>
                </div>
                {derivedInfo ? (
                  <div className="stat-box derived">
                    <span className="stat-name">{derivedInfo.label}</span>
                    <span className="stat-value">{derived[derivedInfo.derivedKey]}</span>
                  </div>
                ) : (
                  <div className="stat-box placeholder">
                    <span className="stat-name">—</span>
                    <span className="stat-value">—</span>
                  </div>
                )}
              </React.Fragment>
            );
          })}
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

      {((character.cybermods && character.cybermods.length > 0) || (character.mutations && character.mutations.length > 0)) && (
        <div className="summary-section">
          <h4>Augmentations</h4>
          {character.cybermods && character.cybermods.length > 0 && (
            <div className="augmentation-subsection">
              <span className="augmentation-label">Cybermods:</span>
              <span className="augmentation-names">
                {character.cybermods.map((cm) => `${cm.name}${cm.isFlawed ? ' ⚠' : ''}`).join(', ')}
              </span>
            </div>
          )}
          {character.mutations && character.mutations.length > 0 && (
            <div className="augmentation-subsection">
              <span className="augmentation-label">Mutations:</span>
              <span className="augmentation-names">
                {character.mutations.map((mut) => mut.name).join(', ')}
              </span>
            </div>
          )}
        </div>
      )}

      <div className="summary-section">
        <h4>Equipment</h4>
        <div className="equipment-info">
          {character.equipment.length > 0 && (
            <ul className="equipment-list">
              {character.equipment.map((eq, idx) => (
                <li key={`${eq.id}-${idx}`} className="equipment-list-item">
                  {eq.category === 'ammo' ? `Ammo: ${eq.name}` : eq.name}
                </li>
              ))}
            </ul>
          )}
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
