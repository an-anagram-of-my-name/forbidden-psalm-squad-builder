import React, { useState } from 'react';
import { Flaw, Feat, FlawType, FeatType } from '../types';
import './FlawsAndFeatsPicker.css';

interface FlawsAndFeatsPickerProps {
    onSelectFlawAndFeat: (flaw: Flaw, feat: Feat) => void;
}

// Hardcoded descriptions for flaws and feats
const flawDescriptions: Record<FlawType, string> = {
    'xeno': 'Alien or otherworldly nature',
    'too-many-teeth': 'Disturbing dental configuration',
    'dead-man-walking': 'Undead or cursed to walk',
    'ratman': 'Rodent-like appearance',
    'crazed': 'Mentally unstable or feral',
    'worship': 'Fanatical devotion to something',
    'superstitious': 'Bound by superstitious beliefs',
    'late': 'Cursed with terrible timing',
    'purge': 'Driven to destroy something',
    'weak-bones': 'Fragile skeletal structure',
};

const featDescriptions: Record<FeatType, string> = {
    'marine': 'Military or combat training',
    'zealous': 'Passionate and driven',
    'unpainted': 'Raw and untested potential',
    'rogue': 'Cunning and deceptive',
    'tnt': 'Explosive personality or skills',
    'gambler': 'Risk-taker with lucky streaks',
    'mother-of-crows': 'Connected to nature or the occult',
    'skulls': 'Death-obsessed or fearsome',
    'bibliotech': 'Scholarly or tech-savvy',
    'undead': 'Risen from the dead',
};

const FlawsAndFeatsPicker: React.FC<FlawsAndFeatsPickerProps> = ({ onSelectFlawAndFeat }) => {
    const [selectedFlawType, setSelectedFlawType] = useState<FlawType | null>(null);
    const [selectedFeatType, setSelectedFeatType] = useState<FeatType | null>(null);

    const handleConfirm = () => {
        if (selectedFlawType && selectedFeatType) {
            const flaw: Flaw = {
                type: selectedFlawType,
                description: flawDescriptions[selectedFlawType],
            };
            const feat: Feat = {
                type: selectedFeatType,
                description: featDescriptions[selectedFeatType],
            };
            onSelectFlawAndFeat(flaw, feat);
        }
    };

    const isComplete = selectedFlawType !== null && selectedFeatType !== null;

    return (
        <div className="flaws-and-feats-picker">
            <h2>Select Flaw & Feat</h2>

            <div className="picker-container">
                <div className="flaw-picker">
                    <h3>Flaw</h3>
                    <div className="options-list">
                        {Object.entries(flawDescriptions).map(([flawType, description]) => (
                            <div
                                key={flawType}
                                className={`option ${
                                    selectedFlawType === flawType ? 'selected' : ''
                                }`}
                                onClick={() => setSelectedFlawType(flawType as FlawType)}
                            >
                                <div className="option-title">{flawType}</div>
                                <div className="option-description">{description}</div>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="feat-picker">
                    <h3>Feat</h3>
                    <div className="options-list">
                        {Object.entries(featDescriptions).map(([featType, description]) => (
                            <div
                                key={featType}
                                className={`option ${
                                    selectedFeatType === featType ? 'selected' : ''
                                }`}
                                onClick={() => setSelectedFeatType(featType as FeatType)}
                            >
                                <div className="option-title">{featType}</div>
                                <div className="option-description">{description}</div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            <button
                onClick={handleConfirm}
                disabled={!isComplete}
                className="btn-confirm"
            >
                Confirm Selection
            </button>
        </div>
    );
};

export default FlawsAndFeatsPicker;
