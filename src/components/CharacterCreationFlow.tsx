import React, { useState } from 'react';
import { Character, Equipment, Stats, Flaw, Feat, TechLevel } from '../types';
import StatDistributionPicker from './StatDistributionPicker';
import FlawsAndFeatsPicker from './FlawsAndFeatsPicker';
import EquipmentPicker from './EquipmentPicker';
import './CharacterCreationFlow.css';

interface CharacterCreationFlowProps {
    techLevel: TechLevel;
    onCharacterCreated: (character: Character) => void;
    onCancel: () => void;
}

type CreationStep = 'stats' | 'flaws-feats' | 'equipment' | 'review';

const CharacterCreationFlow: React.FC<CharacterCreationFlowProps> = ({ techLevel, onCharacterCreated, onCancel }) => {
    const [currentStep, setCurrentStep] = useState<CreationStep>('stats');
    const [characterName, setCharacterName] = useState('');
    const [stats, setStats] = useState<Stats | null>(null);
    const [flaw, setFlaw] = useState<Flaw | null>(null);
    const [feat, setFeat] = useState<Feat | null>(null);
    const [equipment, setEquipment] = useState<Equipment[]>([]);

    const handleStatsSelected = (selectedStats: Stats) => {
        setStats(selectedStats);
        setCurrentStep('flaws-feats');
    };

    const handleFlawAndFeatSelected = (selectedFlaw: Flaw, selectedFeat: Feat) => {
        setFlaw(selectedFlaw);
        setFeat(selectedFeat);
        setCurrentStep('equipment');
    };

    const handleEquipmentSelected = (selectedEquipment: Equipment[]) => {
        setEquipment(selectedEquipment);
        setCurrentStep('review');
    };

    const handleCharacterNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setCharacterName(e.target.value);
    };

    const handleCreateCharacter = () => {
        if (characterName.trim() && stats && flaw && feat) {
            const newCharacter: Character = {
                id: Date.now().toString(),
                name: characterName,
                stats,
                flaw,
                feat,
                equipment,
                techLevel,
            };
            onCharacterCreated(newCharacter);
        }
    };

    const handleBack = () => {
        if (currentStep === 'flaws-feats') {
            setCurrentStep('stats');
        } else if (currentStep === 'equipment') {
            setCurrentStep('flaws-feats');
        } else if (currentStep === 'review') {
            setCurrentStep('equipment');
        }
    };

    const canProceed = currentStep === 'review' && characterName.trim().length > 0;

    const stepOrder: CreationStep[] = ['stats', 'flaws-feats', 'equipment', 'review'];
    const currentStepIndex = stepOrder.indexOf(currentStep);

    return (
        <div className="character-creation-flow">
            <div className="flow-header">
                <h1>Create Character</h1>
                <div className="step-indicator">
                    <div className={`step ${currentStep === 'stats' ? 'active' : currentStepIndex > 0 ? 'completed' : ''}`}>
                        1. Stats
                    </div>
                    <div className="step-connector"></div>
                    <div className={`step ${currentStep === 'flaws-feats' ? 'active' : currentStepIndex > 1 ? 'completed' : ''}`}>
                        2. Flaws &amp; Feats
                    </div>
                    <div className="step-connector"></div>
                    <div className={`step ${currentStep === 'equipment' ? 'active' : currentStepIndex > 2 ? 'completed' : ''}`}>
                        3. Equipment
                    </div>
                    <div className="step-connector"></div>
                    <div className={`step ${currentStep === 'review' ? 'active' : ''}`}>
                        4. Review
                    </div>
                </div>
            </div>

            <div className="flow-content">
                {currentStep === 'stats' && (
                    <StatDistributionPicker onStatsSelected={handleStatsSelected} />
                )}

                {currentStep === 'flaws-feats' && (
                    <FlawsAndFeatsPicker onSelectFlawAndFeat={handleFlawAndFeatSelected} stats={stats ?? undefined} />
                )}

                {currentStep === 'equipment' && stats && flaw && feat && (
                    <EquipmentPicker
                        character={{
                            id: '',
                            name: '',
                            stats,
                            flaw,
                            feat,
                            equipment,
                            techLevel,
                        }}
                        onEquipmentSelected={handleEquipmentSelected}
                    />
                )}

                {currentStep === 'review' && (
                    <div className="review-section">
                        <div className="picker-header">
                            <h2>Review Your Character</h2>
                        </div>

                        <div className="character-name-input">
                            <label>Character Name</label>
                            <input
                                type="text"
                                value={characterName}
                                onChange={handleCharacterNameChange}
                                placeholder="Enter character name"
                                className="name-input"
                            />
                        </div>

                        <div className="review-grid">
                            <div className="review-section-card">
                                <h3>Stats</h3>
                                {stats && (
                                    <ul className="stats-list">
                                        <li>Agility: {stats.agility > 0 ? '+' : ''}{stats.agility}</li>
                                        <li>Presence: {stats.presence > 0 ? '+' : ''}{stats.presence}</li>
                                        <li>Strength: {stats.strength > 0 ? '+' : ''}{stats.strength}</li>
                                        <li>Toughness: {stats.toughness > 0 ? '+' : ''}{stats.toughness}</li>
                                    </ul>
                                )}
                            </div>

                            <div className="review-section-card">
                                <h3>Flaw</h3>
                                {flaw && (
                                    <div>
                                        <p className="type">{flaw.type}</p>
                                        <p className="description">{flaw.description}</p>
                                    </div>
                                )}
                            </div>

                            <div className="review-section-card">
                                <h3>Feat</h3>
                                {feat && (
                                    <div>
                                        <p className="type">{feat.type}</p>
                                        <p className="description">{feat.description}</p>
                                    </div>
                                )}
                            </div>

                            {equipment.length > 0 && (
                                <div className="review-section-card">
                                    <h3>Equipment</h3>
                                    <ul className="equipment-list">
                                        {equipment.map((eq) => (
                                            <li key={eq.id}>{eq.name} ({eq.cost} cr)</li>
                                        ))}
                                    </ul>
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </div>

            <div className="flow-footer">
                <button onClick={onCancel} className="btn-cancel">
                    Cancel
                </button>
                {currentStep !== 'stats' && (
                    <button onClick={handleBack} className="btn-back">
                        Back
                    </button>
                )}
                {currentStep === 'review' && (
                    <button
                        onClick={handleCreateCharacter}
                        disabled={!canProceed}
                        className="btn-create-character"
                    >
                        Create Character
                    </button>
                )}
            </div>
        </div>
    );
};

export default CharacterCreationFlow;
