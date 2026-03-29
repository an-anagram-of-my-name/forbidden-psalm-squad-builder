import React, { useState, useMemo } from 'react';
import { Character, CharacterPreset, Equipment, Stats, Flaw, Feat, TechLevel, FlawType, FeatType, GameId } from '../types';
import { getGameConfig } from '../types/games';
import StatDistributionPicker from './StatDistributionPicker';
import FlawsAndFeatsPicker from './FlawsAndFeatsPicker';
import EquipmentPicker from './EquipmentPicker';
import CharacterPortrait from './CharacterPortrait';
import AugmentationAllowanceBox from './AugmentationAllowanceBox';
import { applyFlawFeatModifiers, calculateFinalDerivedStats, getDefaultFlawsData, getDefaultFeatsData } from '../utils/stats';
import { calculateAugmentationSelection } from '../utils/augmentationAllowances';
import { characterNames28Psalms } from '../types/characterNames28Psalms';
import './CharacterCreationFlow.css';

interface CharacterCreationFlowProps {
    mode?: 'squad' | 'preset';
    // Required: identifies which game's data to use
    gameId: GameId;
    // Squad mode
    techLevel?: TechLevel;
    onCharacterCreated?: (character: Character) => void;
    // Squad edit mode
    initialCharacter?: Character | null;
    onCharacterUpdated?: (character: Character) => void;
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
    initialCharacter,
    onCharacterUpdated,
    gameId,
    initialPreset,
    onPresetSaved,
    onCancel,
}) => {
    const isEditingPreset = mode === 'preset' && !!initialPreset;
    const isEditingCharacter = mode === 'squad' && !!initialCharacter;

    const resolvedGameId: GameId = gameId;
    const gameConfig = getGameConfig(resolvedGameId);
    const isKSP = resolvedGameId === 'kill-sample-process';

    const [currentStep, setCurrentStep] = useState<CreationStep>(
        (isEditingPreset || isEditingCharacter) ? 'review' : 'stats'
    );
    const [characterName, setCharacterName] = useState(
        initialPreset?.name ?? initialCharacter?.name ?? ''
    );
    const [stats, setStats] = useState<Stats | null>(
        initialPreset?.stats ?? initialCharacter?.stats ?? null
    );
    const [flaw, setFlaw] = useState<Flaw | null>(
        initialPreset?.flaw ?? initialCharacter?.flaw ?? null
    );
    const [feat, setFeat] = useState<Feat | null>(
        initialPreset?.feat ?? initialCharacter?.feat ?? null
    );
    const [equipment, setEquipment] = useState<Equipment[]>(
        initialPreset?.equipment ?? initialCharacter?.equipment ?? []
    );
    const [selectedTechLevel, setSelectedTechLevel] = useState<TechLevel | null>(
        initialPreset?.techLevel ?? null
    );

    // KSP augmentation state (placeholder counts until selection UI is added)
    const cybermodCount = (initialCharacter?.cybermods ?? initialPreset?.cybermods)?.length ?? 0;
    const mutationCount = (initialCharacter?.mutations ?? initialPreset?.mutations)?.length ?? 0;
    const additionalFlaws = useMemo(
        () => initialCharacter?.additionalFlaws ?? initialPreset?.additionalFlaws ?? [],
        [initialCharacter?.additionalFlaws, initialPreset?.additionalFlaws]
    );
    const additionalFeats = useMemo(
        () => initialCharacter?.additionalFeats ?? initialPreset?.additionalFeats ?? [],
        [initialCharacter?.additionalFeats, initialPreset?.additionalFeats]
    );

    const handleStatsChange = (newStats: Stats | null) => {
        setStats(newStats);
    };

    const handleTechLevelSelected = (level: TechLevel) => {
        if (level !== selectedTechLevel) {
            // Reset equipment when tech level changes
            setEquipment([]);
        }
        setSelectedTechLevel(level);
    };

    const handleFlawFeatChange = (newFlaw: Flaw | null, newFeat: Feat | null) => {
        setFlaw(newFlaw);
        setFeat(newFeat);
    };

    const handleEquipmentChange = (newEquipment: Equipment[]) => {
        setEquipment(newEquipment);
    };

    const handleConfirmStats = () => {
        if (stats && (mode !== 'preset' || !!selectedTechLevel)) {
            setCurrentStep('flaws-feats');
        }
    };

    const handleConfirmFlawFeat = () => {
        if (flaw && feat) {
            setCurrentStep('equipment');
        }
    };

    const handleConfirmEquipment = () => {
        setCurrentStep('review');
    };

    const handleClearAllEquipment = () => {
        setEquipment([]);
    };

    const handleCharacterNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setCharacterName(e.target.value);
    };

    const handleGenerateName = () => {
        const names = resolvedGameId === '28-psalms' ? characterNames28Psalms : [];
        if (names.length > 0) {
            const randomName = names[Math.floor(Math.random() * names.length)];
            setCharacterName(randomName);
        }
    };

    const effectiveTechLevel: TechLevel | undefined = mode === 'preset'
        ? selectedTechLevel!   // safe: equipment step is only shown when selectedTechLevel is set
        : techLevel;

    // Load game-specific data to pass down to pickers
    const gameData = useMemo(() => {
        const { equipmentData } = gameConfig;
        return {
            flaws: getDefaultFlawsData(resolvedGameId),
            feats: getDefaultFeatsData(resolvedGameId),
            weapons: equipmentData.weapons,
            armor: equipmentData.armor,
            items: equipmentData.items,
            ammo: equipmentData.ammo,
            consumables: equipmentData.consumables,
        };
    }, [resolvedGameId, gameConfig]);

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
                    gameId: gameId,
                    techLevel: selectedTechLevel,
                    createdAt: initialPreset?.createdAt ?? new Date(),
                    updatedAt: new Date(),
                };
                onPresetSaved?.(preset);
            }
        } else if (isEditingCharacter) {
            if (characterName.trim() && stats && flaw && feat && initialCharacter) {
                const updatedCharacter: Character = {
                    ...initialCharacter,
                    name: characterName.trim(),
                    stats,
                    flaw,
                    feat,
                    equipment,
                };
                onCharacterUpdated?.(updatedCharacter);
            }
        } else {
            if (characterName.trim() && stats && flaw && feat) {
                const newCharacter: Character = {
                    id: Date.now().toString(),
                    name: characterName.trim(),
                    stats,
                    flaw,
                    feat,
                    equipment,
                    gameId: gameId,
                    techLevel: techLevel ?? undefined,
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
        return applyFlawFeatModifiers(stats, flaw, feat, resolvedGameId, gameData.flaws, gameData.feats);
    }, [stats, flaw, feat, resolvedGameId, gameData]);

    // KSP augmentation selection — recalculates whenever flaw/feat change
    const augmentationSelection = useMemo(
        () =>
            calculateAugmentationSelection(
                flaw,
                feat,
                additionalFlaws,
                additionalFeats,
                cybermodCount,
                mutationCount,
                resolvedGameId,
            ),
        [flaw, feat, additionalFlaws, additionalFeats, cybermodCount, mutationCount, resolvedGameId],
    );

    const canSave = canProceed && (!isKSP || augmentationSelection.isComplete);

    // Stable preview character for portrait generation in the review step.
    // characterName is intentionally excluded: it is not part of the image hash
    // or prompt, so including it would cause CharacterPortrait's useMemo to
    // recompute the hash on every keystroke without changing its value.
    const previewCharacter = useMemo<Character | null>(() => {
        if (!stats || !flaw || !feat) return null;
        return {
            id: initialCharacter?.id ?? initialPreset?.id ?? 'preview',
            name: '',   // excluded intentionally — see note above
            stats,
            flaw,
            feat,
            equipment,
            gameId: resolvedGameId,
            techLevel: effectiveTechLevel,
        };
    }, [stats, flaw, feat, equipment, resolvedGameId, effectiveTechLevel, initialCharacter?.id, initialPreset?.id]);

    const getHeaderTitle = (): string => {
        if (mode === 'preset') {
            return isEditingPreset ? 'Edit Character Template' : 'New Character Template';
        }
        if (isEditingCharacter) {
            return `Edit Character: ${initialCharacter?.name ?? 'Character'}`;
        }
        return 'Create Character';
    };

    const getSubmitButtonText = (): string => {
        if (mode === 'preset') {
            return isEditingPreset ? 'Update Preset' : 'Create Preset';
        }
        return isEditingCharacter ? 'Update Character' : 'Create Character';
    };

    return (
        <div className="character-creation-flow">
            <div className="flow-header">
                <h1>{getHeaderTitle()}</h1>
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
                        onStatsChange={handleStatsChange}
                        mode={mode}
                        selectedTechLevel={selectedTechLevel ?? undefined}
                        onTechLevelSelected={handleTechLevelSelected}
                        initialStats={stats ?? undefined}
                        gameId={resolvedGameId}
                    />
                )}

                {currentStep === 'flaws-feats' && (
                    <FlawsAndFeatsPicker
                        onSelectionChange={handleFlawFeatChange}
                        stats={stats ?? undefined}
                        initialFlawType={flaw?.type as FlawType ?? undefined}
                        initialFeatType={feat?.type as FeatType ?? undefined}
                        gameId={resolvedGameId}
                        flawsData={gameData.flaws}
                        featsData={gameData.feats}
                        afterStats={isKSP ? (
                            <div className="augmentation-allowance-wrapper">
                                <AugmentationAllowanceBox
                                    selection={augmentationSelection}
                                    isKSP={isKSP}
                                    variant="compact"
                                />
                            </div>
                        ) : undefined}
                    />
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
                            gameId: resolvedGameId,
                            techLevel: effectiveTechLevel,
                        }}
                        selectedEquipment={equipment}
                        onEquipmentChange={handleEquipmentChange}
                        weaponsData={gameData.weapons}
                        armorData={gameData.armor}
                        itemsData={gameData.items}
                        ammoData={gameData.ammo}
                        consumablesData={gameData.consumables}
                        flawsData={gameData.flaws}
                        featsData={gameData.feats}
                        afterStats={isKSP ? (
                            <div className="augmentation-allowance-wrapper">
                                <AugmentationAllowanceBox
                                    selection={augmentationSelection}
                                    isKSP={isKSP}
                                    variant="compact"
                                />
                            </div>
                        ) : undefined}
                    />
                )}

                {currentStep === 'review' && (
                    <div className="review-section">
                        <div className="picker-header">
                            <h2>Review Your Character</h2>
                        </div>

                        {/* KSP augmentation status on review step */}
                        {isKSP && (
                            <div className="augmentation-allowance-wrapper">
                                <AugmentationAllowanceBox
                                    selection={augmentationSelection}
                                    isKSP={isKSP}
                                    variant="detailed"
                                />
                            </div>
                        )}

                        {/* Portrait preview — shown once stats/flaw/feat are set */}
                        {previewCharacter && (
                            <div className="review-portrait-row">
                                <CharacterPortrait
                                    character={previewCharacter}
                                    size="large"
                                />
                            </div>
                        )}

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
                                {effectiveStats && (() => {
                                    const derived = calculateFinalDerivedStats(stats!, flaw, feat, equipment, resolvedGameId, gameData.flaws, gameData.feats);
                                    const fmt = (v: number) => v > 0 ? `+${v}` : `${v}`;
                                    return (
                                        <ul className="stats-list">
                                            {gameConfig.statNames.map((stat) => {
                                                const derivedInfo = gameConfig.derivedStatMap[stat];
                                                const statLabel = stat.charAt(0).toUpperCase() + stat.slice(1);
                                                return (
                                                    <React.Fragment key={stat}>
                                                        <li>{statLabel}: {fmt(effectiveStats[stat] ?? 0)}</li>
                                                        {derivedInfo ? (
                                                            <li className="derived">{derivedInfo.label}: {derived[derivedInfo.derivedKey]}</li>
                                                        ) : (
                                                            <li className="derived derived-empty">—</li>
                                                        )}
                                                    </React.Fragment>
                                                );
                                            })}
                                        </ul>
                                    );
                                })()}
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
                {currentStep === 'stats' && (
                    <button
                        onClick={handleConfirmStats}
                        disabled={!stats || (mode === 'preset' && !selectedTechLevel)}
                        className="btn-confirm"
                    >
                        Confirm Stats →
                    </button>
                )}
                {currentStep === 'flaws-feats' && (
                    <button
                        onClick={handleConfirmFlawFeat}
                        disabled={!flaw || !feat}
                        className="btn-confirm"
                    >
                        Confirm Selection →
                    </button>
                )}
                {currentStep === 'equipment' && (
                    <>
                        <button
                            onClick={handleClearAllEquipment}
                            className="btn-secondary"
                        >
                            Clear All
                        </button>
                        <button
                            onClick={handleConfirmEquipment}
                            className="btn-confirm"
                        >
                            Confirm Equipment →
                        </button>
                    </>
                )}
                {currentStep === 'review' && (
                    <button
                        onClick={handleCreateCharacter}
                        disabled={!canSave}
                        className="btn-create-character"
                    >
                        {getSubmitButtonText()}
                    </button>
                )}
            </div>
        </div>
    );
};

export default CharacterCreationFlow;
