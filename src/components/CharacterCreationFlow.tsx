import React, { useState, useMemo } from 'react';
import { Character, CharacterPreset, Equipment, Stats, Flaw, Feat, TechLevel } from '../types';
import StatDistributionPicker from './StatDistributionPicker';
import FlawsAndFeatsPicker from './FlawsAndFeatsPicker';
import EquipmentPicker from './EquipmentPicker';
import { applyFlawFeatModifiers } from '../utils/stats';
import { characterNames28Psalms } from '../types/characterNames28Psalms';
import './CharacterCreationFlow.css';

interface CharacterCreationFlowProps {
    mode?: 'squad' | 'preset';
    // Squad mode
    techLevel?: TechLevel;
    onCharacterCreated?: (character: Character) => void;
    // Preset mode
    initialPreset?: CharacterPreset | null;
    onPresetSaved?: (preset: CharacterPreset) => void;
    // Common
    onCancel: () => void;
}

type CreationStep = 'stats' | 'flaws-feats' | 'equipment' | 'review';

const CharacterCreationFlow: React.FC<CharacterCreationFlowProps> = ({
    mode = 'squad',
    techLevel,
    onCharacterCreated,
    initialPreset,
    onPresetSaved,
    onCancel,
}) => {
    const isEditingPreset = mode === 'preset' && !!initialPreset;

    const [currentStep, setCurrentStep] = useState<CreationStep>(
        isEditingPreset ? 'review' : 'stats'
    );
    const [characterName, setCharacterName] = useState(initialPreset?.name ?? '');
    const [stats, setStats] = useState<Stats | null>(initialPreset?.stats ?? null);
    const [flaw, setFlaw] = useState<Flaw | null>(initialPreset?.flaw ?? null);
    const [feat, setFeat] = useState<Feat | null>(initialPreset?.feat ?? null);
    const [equipment, setEquipment] = useState<Equipment[]>(initialPreset?.equipment ?? []);
    const [selectedTechLevel, setSelectedTechLevel] = useState<TechLevel | null>(
        initialPreset?.techLevel ?? null
    );

    const handleStatsSelected = (selectedStats: Stats) => {
        setStats(selectedStats);
        setCurrentStep('flaws-feats');
    };

    const handleTechLevelSelected = (level: TechLevel) => {
        if (level !== selectedTechLevel) {
            // Reset equipment when tech level changes
            setEquipment([]);
        }
        setSelectedTechLevel(level);
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

    const handleGenerateName = () => {
        const randomName = characterNames28Psalms[Math.floor(Math.random() * characterNames28Psalms.length)];
        setCharacterName(randomName);
    };

    const effectiveTechLevel: TechLevel = mode === 'preset'
        ? selectedTechLevel!   // safe: equipment step is only shown when selectedTechLevel is set
        : techLevel!;

    const handleCreateCharacter = () => {
        if (mode === 'preset') {
            if (characterName.trim() && stats && flaw && feat && selectedTechLevel) {
                const preset: CharacterPreset = {
                    id: initialPreset?.id ?? Date.now().toString(),
                    name: characterName.trim(),
                    stats,
                    flaw,
                    feat,
                    equipment,
                    techLevel: selectedTechLevel,
                    createdAt: initialPreset?.createdAt ?? new Date(),
                    updatedAt: new Date(),
                };
                onPresetSaved?.(preset);
            }
        } else {
            if (characterName.trim() && stats && flaw && feat && techLevel) {
                const newCharacter: Character = {
                    id: Date.now().toString(),
                    name: characterName.trim(),
                    stats,
                    flaw,
                    feat,
                    equipment,
                    techLevel,
                };
                onCharacterCreated?.(newCharacter);
            }
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

    const canProceed = currentStep === 'review' &&
        characterName.trim().length > 0 &&
        (mode !== 'preset' || !!selectedTechLevel);

    const stepOrder: CreationStep[] = ['stats', 'flaws-feats', 'equipment', 'review'];
    const currentStepIndex = stepOrder.indexOf(currentStep);

    const effectiveStats = useMemo(() => {
        if (!stats) return null;
        return applyFlawFeatModifiers(stats, flaw, feat);
    }, [stats, flaw, feat]);

    return (
        <div className="character-creation-flow">
            <div className="flow-header">
                <h1>{mode === 'preset' ? (isEditingPreset ? 'Edit Character Template' : 'New Character Template') : 'Create Character'}</h1>
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
                    <StatDistributionPicker
                        onStatsSelected={handleStatsSelected}
                        mode={mode}
                        selectedTechLevel={selectedTechLevel ?? undefined}
                        onTechLevelSelected={handleTechLevelSelected}
                    />
                )}

                {currentStep === 'flaws-feats' && (
                    <FlawsAndFeatsPicker onSelectFlawAndFeat={handleFlawAndFeatSelected} stats={stats ?? undefined} />
                )}

                {currentStep === 'equipment' && stats && flaw && feat && (mode !== 'preset' || selectedTechLevel) && (
                    <EquipmentPicker
                        character={{
                            id: '',
                            name: '',
                            stats,
                            flaw,
                            feat,
                            equipment,
                            techLevel: effectiveTechLevel,
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
                            <div className="name-input-row">
                                <input
                                    type="text"
                                    value={characterName}
                                    onChange={handleCharacterNameChange}
                                    placeholder="Enter character name"
                                    className="name-input"
                                />
                                <button
                                    onClick={handleGenerateName}
                                    className="btn-generate-name"
                                    type="button"
                                >
                                    Generate Name
                                </button>
                            </div>
                        </div>

                        <div className="review-grid">
                            <div className="review-section-card">
                                <h3>Stats</h3>
                                {effectiveStats && (
                                    <ul className="stats-list">
                                        <li>Agility: {effectiveStats.agility > 0 ? '+' : ''}{effectiveStats.agility}</li>
                                        <li>Presence: {effectiveStats.presence > 0 ? '+' : ''}{effectiveStats.presence}</li>
                                        <li>Strength: {effectiveStats.strength > 0 ? '+' : ''}{effectiveStats.strength}</li>
                                        <li>Toughness: {effectiveStats.toughness > 0 ? '+' : ''}{effectiveStats.toughness}</li>
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
                        {mode === 'preset'
                            ? isEditingPreset
                                ? 'Update Preset'
                                : 'Create Preset'
                            : 'Create Character'}
                    </button>
                )}
            </div>
        </div>
    );
};

export default CharacterCreationFlow;
