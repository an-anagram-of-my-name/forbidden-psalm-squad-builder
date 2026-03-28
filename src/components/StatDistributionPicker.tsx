import React, { useState } from 'react';
import { Stats, StatName, TechLevel, GameId } from '../types';
import { getGameConfig } from '../types/games';
import { getValidStatDistributions, getAvailableModifiers, makeEmptyStats } from '../utils/stats';
import './StatDistributionPicker.css';

interface StatDistributionPickerProps {
    onStatsChange?: (stats: Stats | null) => void;
    mode?: 'squad' | 'preset';
    selectedTechLevel?: TechLevel;
    onTechLevelSelected?: (techLevel: TechLevel) => void;
    initialStats?: Stats;
    gameId?: GameId;
}

const StatDistributionPicker: React.FC<StatDistributionPickerProps> = ({
    onStatsChange,
    mode = 'squad',
    selectedTechLevel,
    onTechLevelSelected,
    initialStats,
    gameId = '28-psalms',
}) => {
    const config = getGameConfig(gameId);
    const distributions = getValidStatDistributions(gameId);
    const statNames: StatName[] = config.statNames;

    const getInitialDistribution = (): number[] | null => {
        if (!initialStats) return null;
        const statValues = statNames.map((stat) => initialStats[stat] ?? 0);
        const sortedValues = [...statValues].sort((a, b) => b - a);
        return distributions.find(d => {
            const sortedDist = [...d].sort((a, b) => b - a);
            return sortedDist.length === sortedValues.length && sortedDist.every((v, i) => v === sortedValues[i]);
        }) ?? null;
    };

    const [selectedDistribution, setSelectedDistribution] = useState<number[] | null>(getInitialDistribution);
    const [statAssignments, setStatAssignments] = useState<Partial<Stats>>(initialStats ?? {});

    const handleDistributionSelect = (distribution: number[]) => {
        setSelectedDistribution(distribution);
        setStatAssignments({});
        onStatsChange?.(null);
    };

    const handleStatAssignment = (stat: StatName, modifier: number) => {
        const newAssignments = { ...statAssignments, [stat]: modifier };
        setStatAssignments(newAssignments);
        const isNowComplete = statNames.every(s => newAssignments[s] !== undefined);
        if (isNowComplete) {
            // Build a full Stats object using makeEmptyStats so no stat keys are hardcoded here.
            const fullStats = statNames.reduce((acc, s) => {
                acc[s] = newAssignments[s] ?? 0;
                return acc;
            }, makeEmptyStats());
            onStatsChange?.(fullStats);
        } else {
            onStatsChange?.(null);
        }
    };

    const handleTechLevelSelect = (techLevel: TechLevel) => {
        onTechLevelSelected?.(techLevel);
    };

    // Calculate available modifiers for each stat
    const getAvailableModifiersForStat = (currentStat: StatName) => {
        if (!selectedDistribution) return [];

        const otherAssignments = statNames
            .filter((stat) => stat !== currentStat && statAssignments[stat] !== undefined)
            .map((stat) => statAssignments[stat]!);

        return getAvailableModifiers(selectedDistribution, otherAssignments);
    };

    return (
        <div className="stat-distribution-picker">
            <div className="picker-header">
                <h2>Select Your Stat Distribution</h2>
            </div>

            {mode === 'preset' && (
                <div className="compact-tech-level-picker">
                    <label className="compact-tech-label">Tech Level:</label>
                    <div className="compact-tech-btns">
                        <button
                            type="button"
                            className={`compact-tech-btn ${selectedTechLevel === 'past-tech' ? 'selected' : ''}`}
                            onClick={() => handleTechLevelSelect('past-tech')}
                        >
                            Past-Tech
                        </button>
                        <button
                            type="button"
                            className={`compact-tech-btn ${selectedTechLevel === 'future-tech' ? 'selected' : ''}`}
                            onClick={() => handleTechLevelSelect('future-tech')}
                        >
                            Future-Tech
                        </button>
                    </div>
                    {!selectedTechLevel && (
                        <span className="compact-tech-hint">Select a tech level to proceed</span>
                    )}
                </div>
            )}

            <div className="distributions">
                {distributions.map((dist, index) => (
                    <button
                        key={index}
                        className={`distribution-btn ${
                            selectedDistribution?.join(',') === dist.join(',') ? 'selected' : ''
                        }`}
                        onClick={() => handleDistributionSelect(dist)}
                    >
                        {dist.map((mod) => (mod > 0 ? `+${mod}` : mod)).join(', ')}
                    </button>
                ))}
            </div>

            {selectedDistribution && (
                <div className="stat-assignments">
                    <h3>Assign Modifiers to Stats</h3>
                    {statNames.map((stat) => {
                        const availableOptions = getAvailableModifiersForStat(stat);
                        const derivedInfo = config.derivedStatMap[stat];
                        const assignedValue = statAssignments[stat];
                        return (
                            <div key={stat} className="stat-assignment">
                                <label className="stat-assignment-label">
                                    {stat.charAt(0).toUpperCase() + stat.slice(1)}
                                </label>
                                <div className="stat-assignment-selector">
                                    <select
                                        value={assignedValue ?? ''}
                                        onChange={(e) =>
                                            handleStatAssignment(stat, parseInt(e.target.value))
                                        }
                                        disabled={availableOptions.length === 0}
                                    >
                                        <option value="">Select Modifier</option>
                                        {availableOptions.map((mod) => (
                                            <option key={mod} value={mod}>
                                                {mod > 0 ? `+${mod}` : mod}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                                {derivedInfo ? (
                                    <div className={`stat-box${assignedValue !== undefined ? ' derived' : ' placeholder'}`}>
                                        <span className="stat-label">{derivedInfo.label}</span>
                                        <span className="stat-value">
                                            {assignedValue !== undefined ? derivedInfo.base + assignedValue : '—'}
                                        </span>
                                    </div>
                                ) : (
                                    <div className="stat-box placeholder">
                                        <span className="stat-label">—</span>
                                        <span className="stat-value">—</span>
                                    </div>
                                )}
                            </div>
                        );
                    })}

                </div>
            )}
        </div>
    );
};

export default StatDistributionPicker;
