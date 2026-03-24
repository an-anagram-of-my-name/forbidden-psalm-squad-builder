import React, { useState } from 'react';
import { Stats, StatName } from '../types';
import { getValidStatDistributions, getAvailableModifiers } from '../utils/stats';
import './StatDistributionPicker.css';

interface StatDistributionPickerProps {
    onStatsSelected: (stats: Stats) => void;
}

const StatDistributionPicker: React.FC<StatDistributionPickerProps> = ({ onStatsSelected }) => {
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

    const isComplete =
        statAssignments.agility !== undefined &&
        statAssignments.presence !== undefined &&
        statAssignments.strength !== undefined &&
        statAssignments.toughness !== undefined;

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
                        return (
                            <div key={stat} className="stat-assignment">
                                <label>{stat.charAt(0).toUpperCase() + stat.slice(1)}</label>
                                <select
                                    value={statAssignments[stat] ?? ''}
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
                        );
                    })}

                    <button
                        onClick={handleConfirm}
                        disabled={!isComplete}
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
