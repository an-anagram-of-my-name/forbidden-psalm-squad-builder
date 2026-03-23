import React from 'react';
import { TechLevel } from '../types';
import './TechLevelSelector.css';

interface TechLevelSelectorProps {
  onTechLevelSelected: (techLevel: TechLevel) => void;
}

const TechLevelSelector: React.FC<TechLevelSelectorProps> = ({ onTechLevelSelected }) => {
  return (
    <div className="tech-level-selector">
      <div className="selector-container">
        <h1>Select Technology Level</h1>
        <p className="selector-description">
          Choose the technology level for your squad. This determines which equipment and weapons are available.
        </p>

        <div className="tech-options">
          <div
            className="tech-card past-tech"
            onClick={() => onTechLevelSelected('past-tech')}
          >
            <div className="tech-icon">⚔️</div>
            <h2>Past Tech</h2>
            <p>Medieval and gunpowder era weapons and equipment.</p>
            <div className="tech-examples">
              <span>Swords</span>
              <span>Crossbows</span>
              <span>Revolvers</span>
            </div>
          </div>

          <div
            className="tech-card future-tech"
            onClick={() => onTechLevelSelected('future-tech')}
          >
            <div className="tech-icon">⚡</div>
            <h2>Future Tech</h2>
            <p>Advanced sci-fi weapons and technology.</p>
            <div className="tech-examples">
              <span>Plasma Rifles</span>
              <span>Laser Weapons</span>
              <span>Cyber Equipment</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TechLevelSelector;
