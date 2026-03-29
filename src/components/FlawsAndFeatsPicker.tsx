import React, { useState, useMemo, useEffect } from 'react';
import { Flaw, Feat, FlawType, FeatType, Stats, GameId } from '../types';
import { FlawData, FeatData } from '../types/featsandflaws28Psalms';
import { getGameConfig } from '../types/games';
import { applyFlawFeatModifiers, calculateDerivedStats, getDefaultFlawsData, getDefaultFeatsData } from '../utils/stats';
import './FlawsAndFeatsPicker.css';

interface FlawsAndFeatsPickerProps {
    onSelectionChange?: (flaw: Flaw | null, feat: Feat | null) => void;
    stats?: Stats;
    initialFlawType?: FlawType;
    initialFeatType?: FeatType;
    gameId?: GameId;
    flawsData?: FlawData[];
    featsData?: FeatData[];
}

const FlawsAndFeatsPicker: React.FC<FlawsAndFeatsPickerProps> = ({ onSelectionChange, stats, initialFlawType, initialFeatType, gameId = '28-psalms', flawsData, featsData }) => {
    const config = getGameConfig(gameId);
    const [selectedFlawType, setSelectedFlawType] = useState<FlawType | null>(initialFlawType ?? null);
    const [selectedFeatType, setSelectedFeatType] = useState<FeatType | null>(initialFeatType ?? null);

    const flawsToUse = flawsData ?? getDefaultFlawsData(gameId);
    const featsToUse = featsData ?? getDefaultFeatsData(gameId);

    useEffect(() => {
        if (selectedFlawType && selectedFeatType) {
            const flawEntry = flawsToUse.find(f => f.type === selectedFlawType);
            const featEntry = featsToUse.find(f => f.type === selectedFeatType);
            if (flawEntry && featEntry) {
                onSelectionChange?.(
                    { type: selectedFlawType, description: flawEntry.description },
                    { type: selectedFeatType, description: featEntry.description }
                );
            }
        } else {
            onSelectionChange?.(null, null);
        }
    }, [selectedFlawType, selectedFeatType, flawsToUse, featsToUse, onSelectionChange]);

    const getRandomFlaw = () => {
        if (flawsToUse.length === 0) return;
        const randomIndex = Math.floor(Math.random() * flawsToUse.length);
        setSelectedFlawType(flawsToUse[randomIndex].type);
    };

    const getRandomFeat = () => {
        if (featsToUse.length === 0) return;
        const randomIndex = Math.floor(Math.random() * featsToUse.length);
        setSelectedFeatType(featsToUse[randomIndex].type);
    };

    const effectiveStats = useMemo(() => {
        if (!stats) return null;
        // Create minimal objects with just the type needed for modifier lookup
        const flawObj: Flaw | null = selectedFlawType
            ? { type: selectedFlawType, description: '' }
            : null;
        const featObj: Feat | null = selectedFeatType
            ? { type: selectedFeatType, description: '' }
            : null;
        return applyFlawFeatModifiers(stats, flawObj, featObj, gameId, flawsToUse, featsToUse);
    }, [stats, selectedFlawType, selectedFeatType, gameId, flawsToUse, featsToUse]);

    return (
        <div className="flaws-and-feats-picker">
            <div className="picker-header">
                <h2>Select Flaw & Feat</h2>
            </div>

            {effectiveStats && (
                <div className="current-stats">
                    {config.statNames.map((stat) => (
                        <div key={stat} className="stat-box">
                            <div className="stat-label">{stat.charAt(0).toUpperCase() + stat.slice(1)}</div>
                            <div className="stat-value">{(effectiveStats[stat] ?? 0) > 0 ? `+${effectiveStats[stat] ?? 0}` : effectiveStats[stat] ?? 0}</div>
                        </div>
                    ))}
                    <div className="current-stats-divider" />
                    <div className="current-stats-derived">
                        {(() => {
                            const derived = calculateDerivedStats(effectiveStats, gameId);
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
            )}

            <div className="picker-container">
                <div className="flaw-picker">
                    <h3>Flaw</h3>
                    <button
                        type="button"
                        className="btn-random"
                        onClick={getRandomFlaw}
                        title="Select a random flaw"
                        aria-label="Select a random flaw"
                    >
                        🎲
                    </button>
                    <div className="options-list">
                        {flawsToUse.map((flaw) => (
                            <div
                                key={flaw.type}
                                className={`option ${
                                    selectedFlawType === flaw.type ? 'selected' : ''
                                }`}
                                onClick={() => setSelectedFlawType(flaw.type as FlawType)}
                            >
                                <div className="option-title">{flaw.name}</div>
                                <div className="option-description">{flaw.description}</div>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="feat-picker">
                    <h3>Feat</h3>
                    <button
                        type="button"
                        className="btn-random"
                        onClick={getRandomFeat}
                        title="Select a random feat"
                        aria-label="Select a random feat"
                    >
                        🎲
                    </button>
                    <div className="options-list">
                        {featsToUse.map((feat) => (
                            <div
                                key={feat.type}
                                className={`option ${
                                    selectedFeatType === feat.type ? 'selected' : ''
                                }`}
                                onClick={() => setSelectedFeatType(feat.type as FeatType)}
                            >
                                <div className="option-title">{feat.name}</div>
                                <div className="option-description">{feat.description}</div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

        </div>
    );
};

export default FlawsAndFeatsPicker;
