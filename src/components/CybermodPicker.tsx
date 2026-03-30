import React, { useMemo } from 'react';
import { Character } from '../types';
import { FlawData, FeatData } from '../types/featsandflaws28Psalms';
import { CybermodData, SelectedCybermod } from '../types/cybermodsKSP';
import { applyFlawFeatModifiers, calculateFinalDerivedStats } from '../utils/stats';
import { getGameConfig } from '../types/games';
import './CybermodPicker.css';

interface CybermodPickerProps {
  character: Character;
  cybermods: CybermodData[];
  selectedCybermods: SelectedCybermod[];
  allowedCount: number;
  onCybermodsChange: (cybermods: SelectedCybermod[]) => void;
  flawsData?: FlawData[];
  featsData?: FeatData[];
  afterStats?: React.ReactNode;
}

const CybermodPicker: React.FC<CybermodPickerProps> = ({
  character,
  cybermods,
  selectedCybermods,
  allowedCount,
  onCybermodsChange,
  flawsData,
  featsData,
  afterStats,
}) => {
  const config = getGameConfig(character.gameId);

  const effectiveStats = useMemo(
    () => applyFlawFeatModifiers(character.stats, character.flaw, character.feat, character.gameId, flawsData, featsData),
    [character.stats, character.flaw, character.feat, character.gameId, flawsData, featsData],
  );

  const totalCost = useMemo(
    () => selectedCybermods.reduce((sum, cm) => sum + cm.cost, 0),
    [selectedCybermods],
  );

  const isFull = selectedCybermods.length >= allowedCount;

  const isSelected = (mod: CybermodData) =>
    selectedCybermods.some((cm) => cm.id === mod.id);

  const handleRandomize = () => {
    if (selectedCybermods.length >= allowedCount) return;

    const alreadySelectedIds = new Set(selectedCybermods.map((cm) => cm.id));
    const candidates = cybermods.filter((mod) => !alreadySelectedIds.has(mod.id));
    if (candidates.length === 0) return;

    let current = [...selectedCybermods];
    let remaining = allowedCount - current.length;
    const pool = [...candidates];

    while (remaining > 0 && pool.length > 0) {
      const idx = Math.floor(Math.random() * pool.length);
      const chosen = pool.splice(idx, 1)[0];
      current = [...current, { id: chosen.id, name: chosen.name, cost: chosen.cost, isFlawed: false }];
      remaining--;
    }

    onCybermodsChange(current);
  };

  const handleToggle = (mod: CybermodData) => {
    if (isSelected(mod)) {
      // Deselect: remove
      onCybermodsChange(selectedCybermods.filter((cm) => cm.id !== mod.id));
    } else if (!isFull) {
      // Select: add
      onCybermodsChange([
        ...selectedCybermods,
        { id: mod.id, name: mod.name, cost: mod.cost, isFlawed: false },
      ]);
    }
  };

  const handleFlawedToggle = (e: React.ChangeEvent<HTMLInputElement>, modId: string) => {
    e.stopPropagation();
    onCybermodsChange(
      selectedCybermods.map((cm) =>
        cm.id === modId ? { ...cm, isFlawed: e.target.checked } : cm,
      ),
    );
  };

  return (
    <div className="cybermod-picker">
      <div className="picker-header">
        <h2>Select Cybermods</h2>
        <button
          className="btn-random"
          onClick={handleRandomize}
          disabled={isFull}
          aria-label={isFull ? 'Cybermod allowance is already full' : 'Randomly fill remaining cybermod slots'}
          title={isFull ? 'Cybermod allowance is already full' : 'Randomly fill remaining cybermod slots'}
          type="button"
        >
          🎲
        </button>
      </div>

      {/* Stats row */}
      <div className="current-stats">
        {config.statNames.map((stat) => {
            const statValue = effectiveStats[stat] ?? 0;
            return (
              <div key={stat} className="stat-box">
                <div className="stat-label">{stat.charAt(0).toUpperCase() + stat.slice(1)}</div>
                <div className="stat-value">{statValue > 0 ? `+${statValue}` : statValue}</div>
              </div>
            );
          })}
        <div className="current-stats-divider" />
        <div className="current-stats-derived">
          {(() => {
            const derived = calculateFinalDerivedStats(
              character.stats,
              character.flaw,
              character.feat,
              character.equipment,
              character.gameId,
              flawsData,
              featsData,
            );
            return config.statNames
              .filter((stat) => !!config.derivedStatMap[stat])
              .map((stat) => {
                const derivedInfo = config.derivedStatMap[stat]!;
                return (
                  <div key={stat} className="stat-box derived">
                    <div className="stat-label">{derivedInfo.label}</div>
                    <div className="stat-value">{derived[derivedInfo.derivedKey]}</div>
                  </div>
                );
              });
          })()}
        </div>
        <div className="current-stats-divider" />
        <div className="stat-box cost">
          <div className="stat-label">CR</div>
          <div className="stat-value">{totalCost}</div>
        </div>
      </div>

      {/* Allowance indicator */}
      <div className={`cybermod-allowance ${isFull ? 'full' : ''}`}>
        {selectedCybermods.length}/{allowedCount} cybermods selected
        {isFull && allowedCount > 0 && <span className="allowance-full-badge"> (full)</span>}
      </div>

      {afterStats}

      {/* Cybermod grid */}
      <div className="cybermod-grid">
        {cybermods.map((mod) => {
          const selected = isSelected(mod);
          const disabled = !selected && isFull;
          const selectedMod = selectedCybermods.find((cm) => cm.id === mod.id);

          return (
            <div
              key={mod.id}
              className={`cybermod-card${selected ? ' selected' : ''}${disabled ? ' disabled' : ''}`}
              onClick={() => handleToggle(mod)}
              role="checkbox"
              aria-checked={selected}
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === ' ' || e.key === 'Enter') {
                  e.preventDefault();
                  handleToggle(mod);
                }
              }}
            >
              <div className="cybermod-header">
                <div className="cybermod-number">#{mod.number}</div>
                <div className="cybermod-name">{mod.name}</div>
                <div className="cybermod-cost">{mod.cost} cr</div>
              </div>

              <div className="cybermod-description">{mod.description}</div>

              {selected && (
                <label
                  className="cybermod-flawed-label"
                  onClick={(e) => e.stopPropagation()}
                >
                  <input
                    type="checkbox"
                    className="cybermod-flawed-checkbox"
                    checked={selectedMod?.isFlawed ?? false}
                    onChange={(e) => handleFlawedToggle(e, mod.id)}
                  />
                  Mark as Flawed
                </label>
              )}

              {selected && !selectedMod?.isFlawed && (
                <div className="checkmark">✓</div>
              )}
              {selected && selectedMod?.isFlawed && (
                <div className="flawed-badge">⚠ FLAWED</div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default CybermodPicker;
