import React, { useState } from 'react';
import { Flaw, Feat, FlawType, FeatType } from '../types';
import { flaws28Psalms, feats28Psalms } from '../types/featsandflaws28Psalms';
import './FlawsAndFeatsPicker.css';

interface FlawsAndFeatsPickerProps {
    onSelectFlawAndFeat: (flaw: Flaw, feat: Feat) => void;
}

const FlawsAndFeatsPicker: React.FC<FlawsAndFeatsPickerProps> = ({ onSelectFlawAndFeat }) => {
    const [selectedFlawType, setSelectedFlawType] = useState<FlawType | null>(null);
    const [selectedFeatType, setSelectedFeatType] = useState<FeatType | null>(null);

    const handleConfirm = () => {
        if (selectedFlawType && selectedFeatType) {
            const flawData = flaws28Psalms.find(f => f.type === selectedFlawType);
            const featData = feats28Psalms.find(f => f.type === selectedFeatType);
            if (!flawData || !featData) return;
            const flaw: Flaw = {
                type: selectedFlawType,
                description: flawData.description,
            };
            const feat: Feat = {
                type: selectedFeatType,
                description: featData.description,
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
