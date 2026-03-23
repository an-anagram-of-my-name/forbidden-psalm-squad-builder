import React, { useState } from 'react';
import { Squad, Character, TechLevel } from '../types';
import TechLevelSelector from './TechLevelSelector';
import CharacterCreationFlow from './CharacterCreationFlow';
import CharacterSummary from './CharacterSummary';
import './SquadBuilder.css';

const SquadBuilder: React.FC = () => {
  const [currentView, setCurrentView] = useState<'tech-select' | 'squad-builder'>('tech-select');
  const [squad, setSquad] = useState<Squad | null>(null);
  const [showCharacterCreation, setShowCharacterCreation] = useState(false);

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
    setCurrentView('squad-builder');
  };

  const handleCharacterCreated = (character: Character) => {
    if (!squad) return;

    // Ensure character tech level matches squad tech level
    const alignedCharacter: Character = {
      ...character,
      techLevel: squad.techLevel,
    };

    setSquad({
      ...squad,
      characters: [...squad.characters, alignedCharacter],
      updatedAt: new Date(),
    });

    setShowCharacterCreation(false);
  };

  const handleRemoveCharacter = (characterId: string) => {
    if (!squad) return;
    setSquad({
      ...squad,
      characters: squad.characters.filter((c) => c.id !== characterId),
      updatedAt: new Date(),
    });
  };

  const handleSquadNameChange = (newName: string) => {
    if (!squad) return;
    setSquad({
      ...squad,
      name: newName,
      updatedAt: new Date(),
    });
  };

  const handleStartOver = () => {
    setSquad(null);
    setCurrentView('tech-select');
    setShowCharacterCreation(false);
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

  if (currentView === 'tech-select') {
    return <TechLevelSelector onTechLevelSelected={handleTechLevelSelected} />;
  }

  if (!squad) {
    return <TechLevelSelector onTechLevelSelected={handleTechLevelSelected} />;
  }

  const squadStats = calculateSquadStats();

  return (
    <div className="squad-builder">
      <div className="squad-builder-header">
        <h1>Squad Builder</h1>
        <button onClick={handleStartOver} className="btn-start-over">
          Start Over
        </button>
      </div>

      <div className="squad-info">
        <div className="squad-name-section">
          <label htmlFor="squad-name">Squad Name:</label>
          <input
            id="squad-name"
            type="text"
            value={squad.name}
            onChange={(e) => handleSquadNameChange(e.target.value)}
            className="squad-name-input"
          />
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
        <button className="btn-save">
          Save Squad
        </button>
      </div>
    </div>
  );
};

export default SquadBuilder;
