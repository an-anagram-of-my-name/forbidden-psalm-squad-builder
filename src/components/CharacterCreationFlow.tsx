import React, { useState } from 'react';
import { Character, Stats, Flaw, Feat } from '../types';
import StatDistributionPicker from './StatDistributionPicker';
import FlawsAndFeatsPicker from './FlawsAndFeatsPicker';
import './CharacterCreationFlow.css';

interface CharacterCreationFlowProps {
    onCharacterCreated: (character: Character) => void;
}

type CreationStep = 'stats' | 'flaws-feats' | 'review';

const CharacterCreationFlow: React.FC<CharacterCreationFlowProps> = ({ onCharacterCreated }) => {
    const [currentStep, setCurrentStep] = useState<CreationStep>('stats');
    const [characterName, setCharacterName] = useState('');
    const [stats, setStats] = useState<Stats | null>(null);
    const [flaw, setFlaw] = useState<Flaw | null>(null);
    const [feat, setFeat] = useState<Feat | null>(null);

    const handleStatsSelected = (selectedStats: Stats) => {
        setStats(selectedStats);
        setCurrentStep('flaws-feats');
    };

    const handleFlawAndFeatSelected = (selectedFlaw: Flaw, selectedFeat: Feat) => {
        setFlaw(selectedFlaw);
        setFeat(selectedFeat);
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
                equipment: [],
                createdAt: new Date(),
                updatedAt: new Date(),
            };
            onCharacterCreated(newCharacter);
        }
    };

    const handleBack = () => {
        if (currentStep === 'flaws-feats') {
            setCurrentStep('stats');
        } else if (currentStep === 'review') {
            setCurrentStep('flaws-feats');
        }
    };

    const canProceed = currentStep === 'review' && characterName.trim().length > 0;

    return (
        <div className="character-creation-flow">
            <div className="flow-header">
                <h1>Create Character</h1>
                <div className="step-indicator">
                    <div className={`step ${currentStep === 'stats' ? 'active' : currentStep === 'review' || currentStep === 'flaws-feats' ? 'completed' : ''}`}>
                        1. Stats
                    </div>
                    <div className="step-connector"></div>
                    <div className={`step ${currentStep === 'flaws-feats' ? 'active' : currentStep === 'review' ? 'completed' : ''}`}>
                        2. Flaw & Feat
                    </div>
                    <div className="step-connector"></div>
                    <div className={`step ${currentStep === 'review' ? 'active' : ''}`}>
                        3. Review
                    </div>
                </div>
            </div>

            <div className="flow-content">
                {currentStep === 'stats' && (
                    <StatDistributionPicker onStatsSelected={handleStatsSelected} />
                )}

                {currentStep === 'flaws-feats' && (
                    <FlawsAndFeatsPicker onSelectFlawAndFeat={handleFlawAndFeatSelected} />
                )}

                {currentStep === 'review' && (
                    <div className="review-section">
                        <h2>Review Your Character</h2>
                        
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
                        </div>
                    </div>
                )}
            </div>

            <div className="flow-footer">
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
                
