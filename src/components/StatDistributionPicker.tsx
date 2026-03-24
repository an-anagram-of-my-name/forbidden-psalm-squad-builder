import React, { useState } from 'react';
import { Stats, StatName, TechLevel } from '../types';
import { getValidStatDistributions, getAvailableModifiers } from '../utils/stats';
import './StatDistributionPicker.css';

type DerivedStatInfo = { label: string; base: number };
const DERIVED_STAT_MAP: Partial<Record<StatName, DerivedStatInfo>> = {
    agility: { label: 'MOV', base: 5 },
    strength: { label: 'SLOTS', base: 5 },
    toughness: { label: 'HP', base: 8 },
};

interface StatDistributionPickerProps {
    onStatsSelected: (stats: Stats) => void;
    mode?: 'squad' | 'preset';
    selectedTechLevel?: TechLevel;
    onTechLevelSelected?: (techLevel: TechLevel) => void;
}

const StatDistributionPicker: React.FC<StatDistributionPickerProps> = ({
    onStatsSelected,
    mode = 'squad',
    selectedTechLevel,
    onTechLevelSelected,
}) => {
    const distributions = getValidStatDistributions();
    const [selectedDistribution, setSelectedDistribution] = useState<number[] | null>(null);
    const [statAssignments, setStatAssignments] = useState<Partial<Stats>>({});

    const statNames: StatName[] = ['agility', 'presence', 'strength', 'toughness'];

    const handleDistributionSelect = (distribution: number[]) => {
        setSelectedDistribution(distribution);
        setStatAssignments({});
    };

    const handleStatAssignment = (stat: StatName, modifier: number) => {
        setStatAssignments({
            ...statAssignments,
            [stat]: modifier,
        });
    };

    const handleConfirm = () => {
        if (
            statAssignments.agility !== undefined &&
            statAssignments.presence !== undefined &&
            statAssignments.strength !== undefined &&
            statAssignments.toughness !== undefined
        ) {
            onStatsSelected(statAssignments as Stats);
        }
    };

    const handleTechLevelSelect = (techLevel: TechLevel) => {
        onTechLevelSelected?.(techLevel);
    };

    const isComplete =
        statAssignments.agility !== undefined &&
        statAssignments.presence !== undefined &&
        statAssignments.strength !== undefined &&
        statAssignments.toughness !== undefined;

    const isConfirmEnabled = isComplete && (mode !== 'preset' || !!selectedTechLevel);

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
                        const derivedInfo = DERIVED_STAT_MAP[stat];
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

                    <button
                        onClick={handleConfirm}
                        disabled={!isConfirmEnabled}
                        className="btn-confirm"
                    >
                        Confirm Stats
                    </button>
                </div>
            )}
        </div>
    );
};

export default StatDistributionPicker;
