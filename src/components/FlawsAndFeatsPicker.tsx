import React, { useState, useMemo, useEffect } from 'react';
import { Flaw, Feat, FlawType, FeatType, Stats } from '../types';
import { flaws28Psalms, feats28Psalms } from '../types/featsandflaws28Psalms';
import { applyFlawFeatModifiers, calculateDerivedStats } from '../utils/stats';
import './FlawsAndFeatsPicker.css';

interface FlawsAndFeatsPickerProps {
    onSelectionChange?: (flaw: Flaw | null, feat: Feat | null) => void;
    stats?: Stats;
    initialFlawType?: FlawType;
    initialFeatType?: FeatType;
}

const FlawsAndFeatsPicker: React.FC<FlawsAndFeatsPickerProps> = ({ onSelectionChange, stats, initialFlawType, initialFeatType }) => {
    const [selectedFlawType, setSelectedFlawType] = useState<FlawType | null>(initialFlawType ?? null);
    const [selectedFeatType, setSelectedFeatType] = useState<FeatType | null>(initialFeatType ?? null);

    useEffect(() => {
        if (selectedFlawType && selectedFeatType) {
            const flawData = flaws28Psalms.find(f => f.type === selectedFlawType);
            const featData = feats28Psalms.find(f => f.type === selectedFeatType);
            if (flawData && featData) {
                onSelectionChange?.(
                    { type: selectedFlawType, description: flawData.description },
                    { type: selectedFeatType, description: featData.description }
                );
            }
        } else {
            onSelectionChange?.(null, null);
        }
    }, [selectedFlawType, selectedFeatType]); // eslint-disable-line react-hooks/exhaustive-deps

    const getRandomFlaw = () => {
        if (flaws28Psalms.length === 0) return;
        const randomIndex = Math.floor(Math.random() * flaws28Psalms.length);
        setSelectedFlawType(flaws28Psalms[randomIndex].type);
    };

    const getRandomFeat = () => {
        if (feats28Psalms.length === 0) return;
        const randomIndex = Math.floor(Math.random() * feats28Psalms.length);
        setSelectedFeatType(feats28Psalms[randomIndex].type);
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
        return applyFlawFeatModifiers(stats, flawObj, featObj);
    }, [stats, selectedFlawType, selectedFeatType]);

    return (
        <div className="flaws-and-feats-picker">
            <div className="picker-header">
                <h2>Select Flaw & Feat</h2>
            </div>

            {effectiveStats && (
                <div className="current-stats">
                    {(['agility', 'presence', 'strength', 'toughness'] as (keyof Stats)[]).map((stat) => (
                        <div key={stat} className="stat-box">
                            <div className="stat-label">{stat.charAt(0).toUpperCase() + stat.slice(1)}</div>
                            <div className="stat-value">{effectiveStats[stat] > 0 ? `+${effectiveStats[stat]}` : effectiveStats[stat]}</div>
                        </div>
                    ))}
                    <div className="current-stats-divider" />
                    <div className="current-stats-derived">
                        {(() => {
                            const derived = calculateDerivedStats(effectiveStats);
                            return (
                                <>
                                    <div className="stat-box derived">
                                        <div className="stat-label">MOV</div>
                                        <div className="stat-value">{derived.movement}</div>
                                    </div>
                                    <div className="stat-box derived">
                                        <div className="stat-label">SLOTS</div>
                                        <div className="stat-value">{derived.equipmentSlots}</div>
                                    </div>
                                    <div className="stat-box derived">
                                        <div className="stat-label">HP</div>
                                        <div className="stat-value">{derived.hp}</div>
                                    </div>
                                </>
                            );
                        })()}
                    </div>
                </div>
            )}

            <div className="picker-container">
                <div className="flaw-picker">
                    <h3>Flaw</h3>
                    <button
                        className="btn-random"
                        onClick={getRandomFlaw}
                        title="Select a random flaw"
                        aria-label="Select a random flaw"
                    >
                        🎲
                    </button>
                    <div className="options-list">
                        {flaws28Psalms.map((flaw) => (
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
                        className="btn-random"
                        onClick={getRandomFeat}
                        title="Select a random feat"
                        aria-label="Select a random feat"
                    >
                        🎲
                    </button>
                    <div className="options-list">
                        {feats28Psalms.map((feat) => (
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
