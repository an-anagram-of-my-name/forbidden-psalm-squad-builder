import React from 'react';
import './AmmoTracker.css';

interface AmmoTrackerProps {
  shots: number;
}

const AmmoTracker: React.FC<AmmoTrackerProps> = ({ shots }) => {
  return (
    <div
      className="ammo-tracker"
      aria-label={`Ammo tracker: ${shots} ${shots === 1 ? 'shot' : 'shots'}`}
    >
      {Array.from({ length: shots }, (_, i) => (
        <div key={i} className="ammo-circle" aria-hidden="true" />
      ))}
    </div>
  );
};

export default AmmoTracker;
