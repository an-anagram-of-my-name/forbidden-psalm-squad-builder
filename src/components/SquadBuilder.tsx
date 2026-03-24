import React, { useState, useEffect } from 'react';
import { Squad, Character, TechLevel } from '../types';
import TechLevelSelector from './TechLevelSelector';
import CharacterCreationFlow from './CharacterCreationFlow';
import CharacterSummary from './CharacterSummary';
import SquadDropdown from './SquadDropdown';
import './SquadBuilder.css';

interface SquadBuilderProps {
  savedSquads: Squad[];
  currentSquadId: string | null;
  initialSquad: Squad | null;
  onSaveSquad: (squad: Squad) => void;
  onLoadSquad: (squadId: string) => void;
  onNewSquad: () => void;
}

const SquadBuilder: React.FC<SquadBuilderProps> = ({
  savedSquads,
  currentSquadId,
  initialSquad,
  onSaveSquad,
  onLoadSquad,
  onNewSquad,
}) => {
  const [currentView, setCurrentView] = useState<'tech-select' | 'squad-builder'>(
    initialSquad ? 'squad-builder' : 'tech-select'
  );
  const [squad, setSquad] = useState<Squad | null>(initialSquad);
  const [showCharacterCreation, setShowCharacterCreation] = useState(false);
  const [isSaved, setIsSaved] = useState(true);
  const [nameError, setNameError] = useState('');
  const [autoSaveMessage, setAutoSaveMessage] = useState('');
  const [saveMessage, setSaveMessage] = useState('');

  // Sync local squad state when the parent switches to a different squad
  useEffect(() => {
    setSquad(initialSquad);
    setCurrentView(initialSquad ? 'squad-builder' : 'tech-select');
    setIsSaved(true);
    setNameError('');
    setShowCharacterCreation(false);
  }, [initialSquad, currentSquadId]);

  const isNameDuplicate = (name: string, excludeId?: string): boolean => {
    return savedSquads.some(
      (s) => s.name.trim().toLowerCase() === name.trim().toLowerCase() && s.id !== excludeId
    );
  };

  const showAutoSaveFeedback = () => {
    setAutoSaveMessage('Squad auto-saved');
    setTimeout(() => setAutoSaveMessage(''), 3000);
  };

  const performAutoSave = (squadToSave: Squad) => {
    onSaveSquad(squadToSave);
    showAutoSaveFeedback();
  };

  const handleDropdownSelect = (selectedId: string | null) => {
    if (selectedId === null) {
      // New Squad
      if (squad && !isSaved) {
        performAutoSave(squad);
      }
      onNewSquad();
    } else {
      if (selectedId === currentSquadId) return;
      if (squad && !isSaved) {
        performAutoSave(squad);
      }
      onLoadSquad(selectedId);
    }
  };

  const handleTechLevelSelected = (techLevel: TechLevel) => {
    const newSquad: Squad = {
      id: Date.now().toString(),
      name: `Squad - ${new Date().toLocaleDateString()}`,
      characters: [],
      techLevel,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    setSquad(newSquad);
    setIsSaved(false);
    setCurrentView('squad-builder');
  };

  const handleCharacterCreated = (character: Character) => {
    if (!squad) return;

    const alignedCharacter: Character = {
      ...character,
      techLevel: squad.techLevel,
    };

    setSquad({
      ...squad,
      characters: [...squad.characters, alignedCharacter],
      updatedAt: new Date(),
    });
    setIsSaved(false);
    setShowCharacterCreation(false);
  };

  const handleRemoveCharacter = (characterId: string) => {
    if (!squad) return;
    setSquad({
      ...squad,
      characters: squad.characters.filter((c) => c.id !== characterId),
      updatedAt: new Date(),
    });
    setIsSaved(false);
  };

  const handleSquadNameChange = (newName: string) => {
    if (!squad) return;
    setSquad({
      ...squad,
      name: newName,
      updatedAt: new Date(),
    });
    setIsSaved(false);

    if (!newName.trim()) {
      setNameError('');
    } else if (isNameDuplicate(newName, squad.id)) {
      setNameError('Squad name already exists');
    } else {
      setNameError('');
    }
  };

  const handleSaveSquad = () => {
    if (!squad) return;
    if (!squad.name.trim()) return;
    if (isNameDuplicate(squad.name, squad.id)) return;

    try {
      onSaveSquad(squad);
      setIsSaved(true);
      setSaveMessage('Squad saved!');
      setTimeout(() => setSaveMessage(''), 3000);
    } catch (error) {
      console.error('Failed to save squad:', error);
      setSaveMessage('Error: could not save squad (storage quota exceeded?)');
      setTimeout(() => setSaveMessage(''), 5000);
    }
  };

  const handleStartOver = () => {
    if (squad && !isSaved) {
      performAutoSave(squad);
    }
    onNewSquad();
  };

  const calculateSquadStats = () => {
    if (!squad || squad.characters.length === 0) {
      return {
        totalCost: 0,
        characterCount: 0,
        techLevel: squad?.techLevel || 'past-tech',
      };
    }

    const totalCost = squad.characters.reduce((sum, char) => {
      const equipmentCost = char.equipment.reduce((eSum, eq) => eSum + eq.cost, 0);
      return sum + equipmentCost;
    }, 0);

    return {
      totalCost,
      characterCount: squad.characters.length,
      techLevel: squad.techLevel,
    };
  };

  const isSaveDisabled = !squad || !squad.name.trim() || !!nameError;

  const dropdownBar = (
    <div className="squad-nav-bar">
      <SquadDropdown
        squads={savedSquads}
        currentSquadId={currentSquadId}
        onSelect={handleDropdownSelect}
      />
      {autoSaveMessage && <span className="auto-save-message">{autoSaveMessage}</span>}
    </div>
  );

  if (currentView === 'tech-select') {
    return (
      <div className="squad-builder">
        <div className="squad-builder-header">
          <h1>Squad Builder</h1>
          {dropdownBar}
        </div>
        <TechLevelSelector onTechLevelSelected={handleTechLevelSelected} />
      </div>
    );
  }

  if (!squad) {
    return (
      <div className="squad-builder">
        <div className="squad-builder-header">
          <h1>Squad Builder</h1>
          {dropdownBar}
        </div>
        <TechLevelSelector onTechLevelSelected={handleTechLevelSelected} />
      </div>
    );
  }

  const squadStats = calculateSquadStats();

  return (
    <div className="squad-builder">
      <div className="squad-builder-header">
        <h1>Squad Builder</h1>
        <div className="squad-builder-header-right">
          {dropdownBar}
          <button onClick={handleStartOver} className="btn-start-over">
            Start Over
          </button>
        </div>
      </div>

      <div className="squad-info">
        <div className="squad-name-section">
          <label htmlFor="squad-name">Squad Name:</label>
          <div className="squad-name-input-wrapper">
            <input
              id="squad-name"
              type="text"
              value={squad.name}
              onChange={(e) => handleSquadNameChange(e.target.value)}
              className={`squad-name-input${nameError ? ' squad-name-input--error' : ''}`}
            />
            {nameError && <span className="squad-name-error">{nameError}</span>}
          </div>
        </div>

        <div className="squad-stats">
          <div className="stat">
            <span className="stat-label">Tech Level:</span>
            <span className="stat-value">{squad.techLevel.toUpperCase()}</span>
          </div>
          <div className="stat">
            <span className="stat-label">Characters:</span>
            <span className="stat-value">{squadStats.characterCount}</span>
          </div>
          <div className="stat">
            <span className="stat-label">Total Cost:</span>
            <span className="stat-value">{squadStats.totalCost} cr</span>
          </div>
        </div>
      </div>

      <div className="squad-content">
        <div className="characters-section">
          <div className="section-header">
            <h2>Squad Members</h2>
            {!showCharacterCreation && (
              <button
                onClick={() => setShowCharacterCreation(true)}
                className="btn-add-character"
              >
                + Add Character
              </button>
            )}
          </div>

          {showCharacterCreation && (
            <div className="character-creation-container">
              <CharacterCreationFlow
                techLevel={squad.techLevel}
                onCharacterCreated={handleCharacterCreated}
                onCancel={() => setShowCharacterCreation(false)}
              />
            </div>
          )}

          {squad.characters.length === 0 && !showCharacterCreation && (
            <div className="empty-state">
              <p>No characters in this squad yet.</p>
              <button
                onClick={() => setShowCharacterCreation(true)}
                className="btn-add-first-character"
              >
                Add First Character
              </button>
            </div>
          )}

          <div className="characters-grid">
            {squad.characters.map((character) => (
              <div key={character.id} className="character-item">
                <CharacterSummary character={character} />
                <button
                  onClick={() => handleRemoveCharacter(character.id)}
                  className="btn-remove-character"
                >
                  Remove
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="squad-builder-footer">
        <button onClick={handleStartOver} className="btn-cancel">
          Cancel
        </button>
        {saveMessage && <span className="save-message">{saveMessage}</span>}
        <button
          className="btn-save"
          onClick={handleSaveSquad}
          disabled={isSaveDisabled}
          title={
            !squad.name.trim()
              ? 'Enter a squad name to save'
              : nameError
                ? nameError
                : 'Save Squad'
          }
        >
          Save Squad
        </button>
      </div>
    </div>
  );
};

export default SquadBuilder;

