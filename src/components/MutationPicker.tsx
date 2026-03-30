import React, { useMemo } from 'react';
import { Character } from '../types';
import { FlawData, FeatData } from '../types/featsandflaws28Psalms';
import { MutationData, SelectedMutation } from '../types/mutationsKSP';
import { applyFlawFeatModifiers, calculateFinalDerivedStats } from '../utils/stats';
import { getGameConfig } from '../types/games';
import './MutationPicker.css';

interface MutationPickerProps {
  character: Character;
  mutations: MutationData[];
  selectedMutations: SelectedMutation[];
  allowedCount: number;
  onMutationsChange: (mutations: SelectedMutation[]) => void;
  flawsData?: FlawData[];
  featsData?: FeatData[];
}

const MutationPicker: React.FC<MutationPickerProps> = ({
  character,
  mutations,
  selectedMutations,
  allowedCount,
  onMutationsChange,
  flawsData,
  featsData,
}) => {
  const config = getGameConfig(character.gameId);

  const effectiveStats = useMemo(
    () => applyFlawFeatModifiers(character.stats, character.flaw, character.feat, character.gameId, flawsData, featsData),
    [character.stats, character.flaw, character.feat, character.gameId, flawsData, featsData],
  );

  const isFull = selectedMutations.length >= allowedCount;

  const isSelected = (mut: MutationData) =>
    selectedMutations.some((sm) => sm.id === mut.id);

  /** For grouped mutations (e.g. mutable-form), check if any variant in the group is selected. */
  const isGroupSelected = (mut: MutationData) =>
    mut.groupId
      ? selectedMutations.some((sm) => mutations.find((m) => m.id === sm.id)?.groupId === mut.groupId)
      : false;

  const handleToggle = (mut: MutationData) => {
    if (isSelected(mut)) {
      // Deselect this specific variant
      onMutationsChange(selectedMutations.filter((sm) => sm.id !== mut.id));
    } else if (mut.groupId) {
      // For grouped mutations: replace any existing selection in the group with this variant
      const filtered = selectedMutations.filter(
        (sm) => mutations.find((m) => m.id === sm.id)?.groupId !== mut.groupId,
      );
      if (filtered.length < allowedCount) {
        onMutationsChange([
          ...filtered,
          { id: mut.id, name: mut.name, statMods: mut.statMods },
        ]);
      }
    } else if (!isFull) {
      // Normal mutation: add if not full
      onMutationsChange([
        ...selectedMutations,
        { id: mut.id, name: mut.name, statMods: mut.statMods },
      ]);
    }
  };

  const handleRandomize = () => {
    if (selectedMutations.length >= allowedCount) return;

    // Collect candidates: ungrouped mutations not already selected,
    // plus one representative per group that doesn't already have a selection.
    const seenGroups = new Set(
      selectedMutations
        .map((sm) => mutations.find((m) => m.id === sm.id)?.groupId)
        .filter(Boolean),
    );
    const alreadySelectedIds = new Set(selectedMutations.map((sm) => sm.id));

    const candidates = mutations.filter((mut) => {
      if (alreadySelectedIds.has(mut.id)) return false;
      if (mut.groupId && seenGroups.has(mut.groupId)) return false;
      return true;
    });

    // De-duplicate by groupId so we don't double-count group representatives
    const seen = new Set<string>();
    const uniqueCandidates = candidates.filter((mut) => {
      const key = mut.groupId ?? mut.id;
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    });

    if (uniqueCandidates.length === 0) return;

    let current = [...selectedMutations];
    let remaining = allowedCount - current.length;
    const pool = [...uniqueCandidates];

    while (remaining > 0 && pool.length > 0) {
      const idx = Math.floor(Math.random() * pool.length);
      const chosen = pool.splice(idx, 1)[0];
      current = [...current, { id: chosen.id, name: chosen.name, statMods: chosen.statMods }];
      remaining--;
    }

    onMutationsChange(current);
  };

  // Render stat mod badges (e.g. "-1 PRE, -2 KNOW")
  const renderStatMods = (statMods: SelectedMutation['statMods']) => {
    const entries = Object.entries(statMods).filter(([, v]) => v !== 0);
    if (entries.length === 0) return null;
    return (
      <div className="mutation-stat-mods">
        {entries.map(([stat, value]) => {
          const label = config.statShortLabels[stat as keyof typeof config.statShortLabels] ?? stat.toUpperCase();
          return (
            <span
              key={stat}
              className={`mutation-stat-mod-badge ${(value ?? 0) >= 0 ? 'positive' : 'negative'}`}
            >
              {(value ?? 0) > 0 ? `+${value}` : value} {label}
            </span>
          );
        })}
      </div>
    );
  };

  // Group mutations for display: non-grouped first, then grouped
  const groupedDisplay = useMemo(() => {
    const groups: Record<string, MutationData[]> = {};
    const ungrouped: MutationData[] = [];
    mutations.forEach((mut) => {
      if (mut.groupId) {
        if (!groups[mut.groupId]) groups[mut.groupId] = [];
        groups[mut.groupId].push(mut);
      } else {
        ungrouped.push(mut);
      }
    });
    return { ungrouped, groups };
  }, [mutations]);

  return (
    <div className="mutation-picker">
      <div className="picker-header">
        <h2>Select Mutations</h2>
        <button
          className="btn-random"
          onClick={handleRandomize}
          disabled={isFull}
          title={isFull ? 'Mutation allowance is already full' : 'Randomly fill remaining mutation slots'}
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
      </div>

      {/* Allowance indicator */}
      <div className={`mutation-allowance ${isFull ? 'full' : ''}`}>
        {selectedMutations.length}/{allowedCount} mutations selected
        {isFull && allowedCount > 0 && <span className="allowance-full-badge"> (full)</span>}
      </div>

      {/* Mutation grid — ungrouped */}
      <div className="mutation-grid">
        {groupedDisplay.ungrouped.map((mut) => {
          const selected = isSelected(mut);
          const disabled = !selected && isFull;
          return (
            <div
              key={mut.id}
              className={`mutation-card${selected ? ' selected' : ''}${disabled ? ' disabled' : ''}`}
              onClick={() => handleToggle(mut)}
              role="checkbox"
              aria-checked={selected}
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === ' ' || e.key === 'Enter') {
                  e.preventDefault();
                  handleToggle(mut);
                }
              }}
            >
              <div className="mutation-header">
                <div className="mutation-number">#{mut.number}</div>
                <div className="mutation-name">{mut.name}</div>
                {renderStatMods(mut.statMods)}
              </div>
              <div className="mutation-description">{mut.description}</div>
              <div className="mutation-drawback">⚠ {mut.drawback}</div>
              {selected && <div className="checkmark">✓</div>}
            </div>
          );
        })}

        {/* Grouped mutations (e.g. Mutable Form variants) */}
        {Object.entries(groupedDisplay.groups).map(([groupId, variants]) => {
          const anyGroupSelected = isGroupSelected(variants[0]);
          const groupDisabled = !anyGroupSelected && isFull;
          return (
            <div key={groupId} className="mutation-group">
              <div className="mutation-group-label">
                #{variants[0].number} {variants[0].name}
                <span className="mutation-group-subtitle"> — choose a scenario variant</span>
              </div>
              <div className="mutation-group-variants">
                {variants.map((mut, i) => {
                  const selected = isSelected(mut);
                  const disabled = !selected && groupDisabled;
                  return (
                    <div
                      key={mut.id}
                      className={`mutation-card mutation-variant${selected ? ' selected' : ''}${disabled ? ' disabled' : ''}`}
                      onClick={() => handleToggle(mut)}
                      role="radio"
                      aria-checked={selected}
                      tabIndex={0}
                      onKeyDown={(e) => {
                        if (e.key === ' ' || e.key === 'Enter') {
                          e.preventDefault();
                          handleToggle(mut);
                        }
                      }}
                    >
                      <div className="mutation-header">
                        <div className="mutation-number">D6:{i + 1}</div>
                        <div className="mutation-description">{mut.description}</div>
                      </div>
                      {i === 0 && (
                        <div className="mutation-drawback">⚠ {mut.drawback}</div>
                      )}
                      {selected && <div className="checkmark">✓</div>}
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default MutationPicker;
