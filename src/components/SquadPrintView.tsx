import React, { useEffect } from 'react';
import ReactDOM from 'react-dom';
import { Squad } from '../types';
import CharacterPrintCard from './CharacterPrintCard';
import './SquadPrintView.css';

interface SquadPrintViewProps {
  squad: Squad;
  onClose?: () => void;
}

const SquadPrintView: React.FC<SquadPrintViewProps> = ({ squad, onClose }) => {
  const squadTotalCost = squad.characters.reduce((sum, char) => {
    return sum + char.equipment.reduce((eSum, eq) => eSum + eq.cost, 0);
  }, 0);

  // Show the print portal root while this component is mounted
  useEffect(() => {
    const el = document.getElementById('squad-print-root');
    if (el) el.style.display = 'block';
    return () => {
      const el2 = document.getElementById('squad-print-root');
      if (el2) el2.style.display = 'none';
    };
  }, []);

  const handlePrint = () => {
    window.print();
  };

  const content = (
    <div className="squad-print-overlay">
      <div className="squad-print-toolbar">
        <h2>Print Preview: {squad.name}</h2>
        <button className="btn-print" onClick={handlePrint}>
          🖨 Print
        </button>
        {onClose && (
          <button className="btn-close-print" onClick={onClose}>
            ✕ Close
          </button>
        )}
      </div>

      <div className="squad-print-pages">
        <div className="squad-print-title">
          <h1>{squad.name}</h1>
          <span className="squad-print-subtitle">
            {squad.techLevel ? `${squad.techLevel.toUpperCase()} \u00a0|\u00a0 ` : ''}{squad.characters.length} character
            {squad.characters.length !== 1 ? 's' : ''}
          </span>
          <span className="squad-print-cost">Total Cost: {squadTotalCost} cr</span>
        </div>

        {squad.characters.length === 0 ? (
          <div className="print-no-characters">No characters in this squad.</div>
        ) : (
          squad.characters.map((character) => (
            <CharacterPrintCard key={character.id} character={character} />
          ))
        )}
      </div>
    </div>
  );

  const portalRoot = document.getElementById('squad-print-root');
  if (portalRoot) {
    return ReactDOM.createPortal(content, portalRoot);
  }

  // Fallback: render inline if portal root is unavailable
  return content;
};

export default SquadPrintView;
