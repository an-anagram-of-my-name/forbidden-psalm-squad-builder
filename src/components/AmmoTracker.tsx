import React from 'react';
import './AmmoTracker.css';

interface AmmoTrackerProps {
  shots: number;
}

const AmmoTracker: React.FC<AmmoTrackerProps> = ({ shots }) => {
  return (
    <div className="ammo-tracker">
      {Array.from({ length: shots }, (_, i) => (
        <div key={i} className="ammo-circle" aria-label="Ammo circle" />
      ))}
    </div>
  );
};

export default AmmoTracker;
