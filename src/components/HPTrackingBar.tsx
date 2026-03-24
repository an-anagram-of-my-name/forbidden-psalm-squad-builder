import React from 'react';
import './HPTrackingBar.css';

interface HPTrackingBarProps {
  maxHP: number;
  orientation?: 'horizontal' | 'vertical';
}

const HPTrackingBar: React.FC<HPTrackingBarProps> = ({ maxHP, orientation = 'horizontal' }) => {
  const circleCount = Math.max(0, maxHP - 1);

  return (
    <div
      className="hp-tracking-bar"
      style={orientation === 'vertical' ? { flexDirection: 'column' } : undefined}
    >
      {Array.from({ length: circleCount }, (_, i) => (
        <div key={i} className="hp-position" aria-label="HP circle" />
      ))}
      <div className="hp-position skull" aria-label="Death">
        ☠
      </div>
    </div>
  );
};

export default HPTrackingBar;
