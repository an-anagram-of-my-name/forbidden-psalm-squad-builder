import React from 'react';
import { Character, Equipment, Armor, Weapon } from '../types';
import { applyFlawFeatModifiers, calculateFinalDerivedStats } from '../utils/stats';
import { getGameConfig } from '../types/games';
import { flaws28Psalms, feats28Psalms, FlawData, FeatData } from '../types/featsandflaws28Psalms';
import { cybermodsKSP } from '../types/cybermodsKSP';
import { mutationsKSP } from '../types/mutationsKSP';
import HPTrackingBar from './HPTrackingBar';
import AmmoTracker from './AmmoTracker';
import './CharacterPrintCard.css';

interface CharacterPrintCardProps {
  character: Character;
  flawsData?: FlawData[];
  featsData?: FeatData[];
  characterNumber?: number;
}

function fmt(v: number): string {
  return v > 0 ? `+${v}` : `${v}`;
}

function renderEquipmentDetails(item: Equipment): React.ReactNode {
  const details: React.ReactNode[] = [];

  if (item.category === 'armor') {
    const armor = item as Armor;
    if (armor.specialRules) {
      details.push(
        <div key="special" className="print-equipment-detail">
          <strong>Rules:</strong> {armor.specialRules}
        </div>
      );
    }
  } else if (item.category === 'weapon') {
    const weapon = item as Weapon;
    details.push(
      <div key="damage" className="print-equipment-detail">
        <strong>Damage:</strong> {weapon.damage}
      </div>
    );
    details.push(
    <div key="damage" className="print-equipment-detail">
        <strong>Mod:</strong> {weapon.modifier.toUpperCase()}
      </div>
    );
    if (weapon.specialRules.length > 0) {
      details.push(
        <div key="rules" className="print-equipment-detail">
          <strong>Rules:</strong> {weapon.specialRules.join(', ')}
        </div>
      );
    }
    if (weapon.isTwoHanded) {
      details.push(
        <div key="2h" className="print-equipment-detail">Two-handed</div>
      );
    }
  } else if (item.category === 'item' || item.category === 'consumable') {
    const itemWithAbility = item as { ability: string };
    details.push(
      <div key="ability" className="print-equipment-detail">
        {itemWithAbility.ability}
      </div>
    );
  } else if (item.category === 'ammo') {
    const ammo = item as { shots: number; compatibleWeapons: string[] };
    details.push(
      <div key="shots" className="print-equipment-detail">
        <strong>Shots:</strong> {ammo.shots}
      </div>
    );
    details.push(
      <div key="ammo-tracker" className="print-equipment-detail">
        <AmmoTracker shots={ammo.shots} />
      </div>
    );
    if (ammo.compatibleWeapons.length > 0) {
      details.push(
        <div key="compat" className="print-equipment-detail">
          <strong>For:</strong> {ammo.compatibleWeapons.join(', ')}
        </div>
      );
    }
  }

  return details;
}

const CharacterPrintCard: React.FC<CharacterPrintCardProps> = ({ character, flawsData, featsData, characterNumber }) => {
  const config = getGameConfig(character.gameId);
  const isKSP = character.gameId === 'kill-sample-process';
  const flawsToUse = flawsData ?? flaws28Psalms;
  const featsToUse = featsData ?? feats28Psalms;
  const effectiveStats = applyFlawFeatModifiers(character.stats, character.flaw, character.feat, character.gameId, flawsToUse, featsToUse);
  const derived = calculateFinalDerivedStats(
    character.stats,
    character.flaw,
    character.feat,
    character.equipment,
    character.gameId,
    flawsToUse,
    featsToUse
  );

  // Look up full flaw/feat descriptions from data
  const flawData = flawsToUse.find((f) => f.type === character.flaw.type);
  const featData = featsToUse.find((f) => f.type === character.feat.type);

  // Portrait state for fallback initials
  const initials = character.name
    .split(' ')
    .slice(0, 2)
    .map((w) => w[0] ?? '')
    .join('')
    .toUpperCase();

  // Sort equipment: armor first, then rest
  const sortedEquipment = [...character.equipment].sort((a, b) => {
    if (a.category === 'armor' && b.category !== 'armor') return -1;
    if (a.category !== 'armor' && b.category === 'armor') return 1;
    return 0;
  });

  return (
    <div className="character-print-card">
      <div className="print-card-header">
        <h2>{characterNumber !== undefined ? `${characterNumber}. ` : ''}{character.name}</h2>
        {character.techLevel && <span className="print-tech-badge">{character.techLevel}</span>}
      </div>

      <div className="print-card-body">
        {/* Stats + portrait block */}
        <div className="print-stats-portrait-block">
          <div className="print-section print-stats-section">
            <div className="print-section-title">Stats</div>
            <div className="print-stats-grid">
              <div className="print-stats-row-base">
                {config.statNames.map((stat) => {
                  const shortLabel = config.statShortLabels[stat] ?? stat.toUpperCase().slice(0, 4);
                  return (
                    <div key={stat} className="print-stat-box">
                      <span className="print-stat-label">{shortLabel}</span>
                      <span className="print-stat-value">{fmt(effectiveStats[stat] ?? 0)}</span>
                    </div>
                  );
                })}
              </div>
              <div className="print-stats-row-derived">
                {config.statNames
                  .filter((stat) => !!config.derivedStatMap[stat])
                  .map((stat) => {
                    const derivedInfo = config.derivedStatMap[stat]!;
                    return (
                      <div key={stat} className="print-stat-box derived">
                        <span className="print-stat-label">{derivedInfo.label}</span>
                        <span className="print-stat-value">{derived[derivedInfo.derivedKey]}</span>
                      </div>
                    );
                  })
                }
              </div>
            </div>
          </div>

          <div className="print-section print-hp-section">
            <div className="print-section-title">HP Tracker</div>
            <HPTrackingBar maxHP={derived.hp} />
          </div>

          {/* Portrait: 150px square to the right of stats */}
          <div className="print-card-portrait">
            {character.portraitUrl ? (
              <img
                src={character.portraitUrl}
                alt={`Portrait of ${character.name}`}
                className="print-portrait-img"
              />
            ) : (
              <div className="print-portrait-initials">{initials || '?'}</div>
            )}
          </div>
        </div>

        {/* Traits column */}
        <div>
          <div className="print-section">
            <div className="print-section-title">Flaw</div>
            <div className="print-trait">
              <div className="print-trait-name">{flawData?.name ?? character.flaw.type}</div>
              <div className="print-trait-description">
                {flawData?.description ?? character.flaw.description}
              </div>
            </div>
          </div>

          <div className="print-section">
            <div className="print-section-title">Feat</div>
            <div className="print-trait">
              <div className="print-trait-name">{featData?.name ?? character.feat.type}</div>
              <div className="print-trait-description">
                {featData?.description ?? character.feat.description}
              </div>
            </div>
          </div>

          {/* Cybermods & Mutations (KSP only) */}
          {isKSP && character.cybermods && character.cybermods.length > 0 && (
            <div className="print-section">
              <div className="print-section-title">Cybermods</div>
              {character.cybermods.map((cm) => {
                const cmData = cybermodsKSP.find((c) => c.id === cm.id);
                return (
                  <div key={cm.id} className="print-trait">
                    <div className="print-trait-name">
                      {cm.name}{cm.isFlawed ? ' ⚠ FLAWED' : ''}
                    </div>
                    {cmData && (
                      <div className="print-trait-description">{cmData.description}</div>
                    )}
                  </div>
                );
              })}
            </div>
          )}

          {isKSP && character.mutations && character.mutations.length > 0 && (
            <div className="print-section">
              <div className="print-section-title">Mutations</div>
              {character.mutations.map((mut) => {
                const mutData = mutationsKSP.find((m) => m.id === mut.id);
                return (
                  <div key={mut.id} className="print-trait">
                    <div className="print-trait-name">{mut.name}</div>
                    {mutData && (
                      <div className="print-trait-description">
                        {mutData.description}
                        {mutData.drawback && ` Drawback: ${mutData.drawback}`}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Equipment spanning full width */}
        <div className="print-section print-equipment-section">
          <div className="print-section-title">Equipment</div>
          <div className="print-equipment-list">
            {sortedEquipment.map((item, idx) => (
              <div
                key={`${item.id}-${idx}`}
                className={`print-equipment-item${item.category === 'armor' ? ' armor-item' : ''}`}
              >
                <div className="print-equipment-category">{item.category}</div>
                <div className="print-equipment-name">{item.name}</div>
                {item.category === 'armor' && (
                  <div className="print-av">AV: {(item as Armor).av}</div>
                )}
                {renderEquipmentDetails(item)}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CharacterPrintCard;
