import React, { useState, useMemo } from 'react';
import { Character, CharacterPreset, Equipment, Stats, Flaw, Feat, TechLevel, FlawType, FeatType, GameId, StatName } from '../types';
import { getGameConfig } from '../types/games';
import StatDistributionPicker from './StatDistributionPicker';
import FlawsAndFeatsPicker from './FlawsAndFeatsPicker';
import EquipmentPicker from './EquipmentPicker';
import CybermodPicker from './CybermodPicker';
import CharacterPortrait from './CharacterPortrait';
import AugmentationAllowanceBox from './AugmentationAllowanceBox';
import PortraitGeneratingModal from './PortraitGeneratingModal';
import { applyFlawFeatModifiers, calculateFinalDerivedStats, getDefaultFlawsData, getDefaultFeatsData } from '../utils/stats';
import { calculateAugmentationSelection } from '../utils/augmentationAllowances';
import { generateCharacterPortrait } from '../services/portraitGenerationService';
import { characterNames28Psalms } from '../types/characterNames28Psalms';
import { cybermodsKSP, SelectedCybermod } from '../types/cybermodsKSP';
import { mutationsKSP, SelectedMutation } from '../types/mutationsKSP';
import MutationPicker from './MutationPicker';
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

type CreationStep = 'stats' | 'flaws-feats' | 'cybermods' | 'mutations' | 'equipment' | 'review';

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

    const [isGeneratingPortrait, setIsGeneratingPortrait] = useState(false);
    const [portraitGenerationError, setPortraitGenerationError] = useState<string | null>(null);

    // KSP cybermod selection state
    const [selectedCybermods, setSelectedCybermods] = useState<SelectedCybermod[]>(
        initialCharacter?.cybermods ?? initialPreset?.cybermods ?? [],
    );

    // KSP mutation selection state — normalize from persisted string[] format if needed
    const [selectedMutations, setSelectedMutations] = useState<SelectedMutation[]>(() => {
        const raw = initialCharacter?.mutations ?? initialPreset?.mutations ?? [];
        if (raw.length === 0) return [];
        // Backwards-compat: old format stored mutation IDs as plain strings
        if (typeof raw[0] === 'string') {
            return (raw as unknown as string[]).flatMap((id) => {
                const data = mutationsKSP.find((m) => m.id === id);
                return data ? [{ id: data.id, name: data.name, statMods: data.statMods }] : [];
            });
        }
        return raw as SelectedMutation[];
    });

    // KSP augmentation counts
    const cybermodCount = selectedCybermods.length;
    const mutationCount = selectedMutations.length;
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
            setCurrentStep(isKSP ? 'cybermods' : 'equipment');
        }
    };

    const handleCybermodsChange = (cybermods: SelectedCybermod[]) => {
        setSelectedCybermods(cybermods);
    };

    const handleConfirmCybermods = () => {
        setCurrentStep(isKSP ? 'mutations' : 'equipment');
    };

    const handleMutationsChange = (mutations: SelectedMutation[]) => {
        setSelectedMutations(mutations);
    };

    const handleConfirmMutations = () => {
        setCurrentStep('equipment');
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

    const handleCreateCharacter = async () => {
        setPortraitGenerationError(null);

        // For KSP, always carry the selected cybermods and mutations into the saved object.
        const kspCybermods = isKSP ? { cybermods: selectedCybermods, mutations: selectedMutations } : {};

        if (mode === 'preset') {
            if (characterName.trim() && stats && flaw && feat && selectedTechLevel) {
                // Build the character object to use for portrait generation
                const presetCharacterForPortrait: Character = {
                    id: initialPreset?.id ?? Date.now().toString(),
                    name: characterName.trim(),
                    stats,
                    flaw,
                    feat,
                    equipment,
                    gameId: gameId,
                    techLevel: selectedTechLevel,
                };

                setIsGeneratingPortrait(true);
                const portraitResult = await generateCharacterPortrait(presetCharacterForPortrait);
                setIsGeneratingPortrait(false);

                if (!portraitResult.success) {
                    setPortraitGenerationError(portraitResult.error ?? 'Portrait generation failed');
                }

                const preset: CharacterPreset = {
                    id: initialPreset?.id ?? Date.now().toString(),
                    name: characterName.trim(),
                    stats,
                    flaw,
                    feat,
                    equipment,
                    gameId: gameId,
                    techLevel: selectedTechLevel,
                    portraitUrl: portraitResult.url,
                    ...kspCybermods,
                    createdAt: initialPreset?.createdAt ?? new Date(),
                    updatedAt: new Date(),
                };
                onPresetSaved?.(preset);
            }
        } else if (isEditingCharacter) {
            if (characterName.trim() && stats && flaw && feat && initialCharacter) {
                const characterForPortrait: Character = {
                    ...initialCharacter,
                    name: characterName.trim(),
                    stats,
                    flaw,
                    feat,
                    equipment,
                    ...kspCybermods,
                };

                setIsGeneratingPortrait(true);
                const portraitResult = await generateCharacterPortrait(characterForPortrait);
                setIsGeneratingPortrait(false);

                if (!portraitResult.success) {
                    setPortraitGenerationError(portraitResult.error ?? 'Portrait generation failed');
                }

                const updatedCharacter: Character = {
                    ...characterForPortrait,
                    portraitUrl: portraitResult.url ?? initialCharacter.portraitUrl,
                };
                onCharacterUpdated?.(updatedCharacter);
            }
        } else {
            if (characterName.trim() && stats && flaw && feat) {
                const newCharacterBase: Character = {
                    id: Date.now().toString(),
                    name: characterName.trim(),
                    stats,
                    flaw,
                    feat,
                    equipment,
                    gameId: gameId,
                    techLevel: techLevel ?? undefined,
                    ...kspCybermods,
                };

                setIsGeneratingPortrait(true);
                const portraitResult = await generateCharacterPortrait(newCharacterBase);
                setIsGeneratingPortrait(false);

                if (!portraitResult.success) {
                    setPortraitGenerationError(portraitResult.error ?? 'Portrait generation failed');
                }

                const newCharacter: Character = {
                    ...newCharacterBase,
                    portraitUrl: portraitResult.url,
                };
                onCharacterCreated?.(newCharacter);
            }
        }
    };

    const handleBack = () => {
        if (currentStep === 'flaws-feats') {
            setCurrentStep('stats');
        } else if (currentStep === 'cybermods') {
            setCurrentStep('flaws-feats');
        } else if (currentStep === 'mutations') {
            setCurrentStep('cybermods');
        } else if (currentStep === 'equipment') {
            setCurrentStep(isKSP ? 'mutations' : 'flaws-feats');
        } else if (currentStep === 'review') {
            setCurrentStep('equipment');
        }
    };

    const canProceed = currentStep === 'review' &&
        characterName.trim().length > 0 &&
        (mode !== 'preset' || !!selectedTechLevel);

    const stepOrder: CreationStep[] = isKSP
        ? ['stats', 'flaws-feats', 'cybermods', 'mutations', 'equipment', 'review']
        : ['stats', 'flaws-feats', 'equipment', 'review'];
    const currentStepIndex = stepOrder.indexOf(currentStep);

    const effectiveStats = useMemo(() => {
        if (!stats) return null;
        const withFlawFeat = applyFlawFeatModifiers(stats, flaw, feat, resolvedGameId, gameData.flaws, gameData.feats);
        if (!isKSP || selectedMutations.length === 0) return withFlawFeat;
        // Apply mutation stat mods on top of flaw/feat mods for display purposes
        const withMutations: Stats = { ...withFlawFeat };
        selectedMutations.forEach((sm) => {
            (Object.keys(sm.statMods) as StatName[]).forEach((key) => {
                const delta = sm.statMods[key];
                if (typeof delta === 'number') {
                    withMutations[key] = withMutations[key] + delta;
                }
            });
        });
        return withMutations;
    }, [stats, flaw, feat, resolvedGameId, gameData, isKSP, selectedMutations]);

    // KSP augmentation selection — recalculates whenever flaw/feat/mutations change
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
                selectedMutations.map((m) => m.id),
            ),
        [flaw, feat, additionalFlaws, additionalFeats, cybermodCount, mutationCount, resolvedGameId, selectedMutations],
    );

    const canSave = canProceed && (!isKSP || augmentationSelection.isComplete) && !isGeneratingPortrait;

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
            {isGeneratingPortrait && (
                <PortraitGeneratingModal characterName={characterName} />
            )}
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
                    {isKSP && (
                        <>
                            <div className={`step ${currentStep === 'cybermods' ? 'active' : currentStepIndex > 2 ? 'completed' : ''}`}>
                                3. Cybermods
                            </div>
                            <div className="step-connector"></div>
                            <div className={`step ${currentStep === 'mutations' ? 'active' : currentStepIndex > 3 ? 'completed' : ''}`}>
                                4. Mutations
                            </div>
                            <div className="step-connector"></div>
                            <div className={`step ${currentStep === 'equipment' ? 'active' : currentStepIndex > 4 ? 'completed' : ''}`}>
                                5. Equipment
                            </div>
                            <div className="step-connector"></div>
                            <div className={`step ${currentStep === 'review' ? 'active' : ''}`}>
                                6. Review
                            </div>
                        </>
                    )}
                    {!isKSP && (
                        <>
                            <div className={`step ${currentStep === 'equipment' ? 'active' : currentStepIndex > 2 ? 'completed' : ''}`}>
                                3. Equipment
                            </div>
                            <div className="step-connector"></div>
                            <div className={`step ${currentStep === 'review' ? 'active' : ''}`}>
                                4. Review
                            </div>
                        </>
                    )}
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

                {currentStep === 'cybermods' && isKSP && stats && flaw && feat && (
                    <CybermodPicker
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
                        cybermods={cybermodsKSP}
                        selectedCybermods={selectedCybermods}
                        allowedCount={augmentationSelection.cybermods.allowed}
                        onCybermodsChange={handleCybermodsChange}
                        flawsData={gameData.flaws}
                        featsData={gameData.feats}
                    />
                )}

                {currentStep === 'mutations' && isKSP && stats && flaw && feat && (
                    <MutationPicker
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
                        mutations={mutationsKSP}
                        selectedMutations={selectedMutations}
                        allowedCount={augmentationSelection.mutations.allowed}
                        onMutationsChange={handleMutationsChange}
                        flawsData={gameData.flaws}
                        featsData={gameData.feats}
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
                                    // Build mutation-adjusted base stats so calculateFinalDerivedStats
                                    // can apply flaw/feat and equipment mods correctly on top.
                                    const mutationAdjustedBase: Stats = { ...stats! };
                                    if (isKSP) {
                                        selectedMutations.forEach((sm) => {
                                            (Object.keys(sm.statMods) as StatName[]).forEach((key) => {
                                                const delta = sm.statMods[key];
                                                if (typeof delta === 'number') {
                                                    mutationAdjustedBase[key] = mutationAdjustedBase[key] + delta;
                                                }
                                            });
                                        });
                                    }
                                    const derived = calculateFinalDerivedStats(mutationAdjustedBase, flaw, feat, equipment, resolvedGameId, gameData.flaws, gameData.feats);
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

                            {isKSP && selectedCybermods.length > 0 && (
                                <>
                                    {selectedCybermods.map((cm) => {
                                        const cmData = cybermodsKSP.find((c) => c.id === cm.id);
                                        return (
                                            <div key={cm.id} className="review-section-card">
                                                <h3>Cybermod</h3>
                                                <div>
                                                    <p className="type">
                                                        {cm.name}{cm.isFlawed && <span className="review-flawed-tag"> ⚠ FLAWED</span>}
                                                    </p>
                                                    {cmData && <p className="description">{cmData.description}</p>}
                                                </div>
                                            </div>
                                        );
                                    })}
                                </>
                            )}

                            {isKSP && selectedMutations.length > 0 && (
                                <>
                                    {selectedMutations.map((mut) => {
                                        const mutData = mutationsKSP.find((m) => m.id === mut.id);
                                        return (
                                            <div key={mut.id} className="review-section-card">
                                                <h3>Mutation</h3>
                                                <div>
                                                    <p className="type">{mut.name}</p>
                                                    {mutData && (
                                                        <p className="description">
                                                            {mutData.description}
                                                            {mutData.drawback && ` Drawback: ${mutData.drawback}`}
                                                        </p>
                                                    )}
                                                    {Object.entries(mut.statMods).filter(([, v]) => v !== 0).length > 0 && (
                                                        <div className="review-stat-mods">
                                                            {Object.entries(mut.statMods).filter(([, v]) => v !== 0).map(([stat, value]) => {
                                                                const label = gameConfig.statShortLabels[stat as keyof typeof gameConfig.statShortLabels] ?? stat.toUpperCase();
                                                                return (
                                                                    <span
                                                                        key={stat}
                                                                        className={`review-stat-mod-tag ${(value ?? 0) >= 0 ? 'positive' : 'negative'}`}
                                                                    >
                                                                        {(value ?? 0) > 0 ? `+${value}` : value} {label}
                                                                    </span>
                                                                );
                                                            })}
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        );
                                    })}
                                </>
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
                {currentStep === 'cybermods' && (
                    <button
                        onClick={handleConfirmCybermods}
                        className="btn-confirm"
                    >
                        Confirm Cybermods →
                    </button>
                )}
                {currentStep === 'mutations' && (
                    <button
                        onClick={handleConfirmMutations}
                        className="btn-confirm"
                    >
                        Confirm Mutations →
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
                    <>
                        {portraitGenerationError && (
                            <div
                                className="portrait-error-banner"
                                role="alert"
                                aria-live="polite"
                            >
                                ⚠️ Portrait generation failed: {portraitGenerationError}. {mode === 'preset' ? 'The preset was saved without a portrait.' : 'The character was saved without a portrait.'}
                            </div>
                        )}
                        <button
                            onClick={handleCreateCharacter}
                            disabled={!canSave}
                            className="btn-create-character"
                        >
                            {getSubmitButtonText()}
                        </button>
                    </>
                )}
            </div>
        </div>
    );
};

export default CharacterCreationFlow;
