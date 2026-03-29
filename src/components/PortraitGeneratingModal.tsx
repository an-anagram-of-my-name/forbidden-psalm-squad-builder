import React from 'react';
import './PortraitGeneratingModal.css';

interface PortraitGeneratingModalProps {
  characterName: string;
}

const PortraitGeneratingModal: React.FC<PortraitGeneratingModalProps> = ({
  characterName,
}) => {
  return (
    <div className="portrait-modal-overlay" aria-modal="true" role="dialog" aria-label="Generating portrait">
      <div className="portrait-modal">
        <div className="portrait-modal__spinner" aria-hidden="true">
          <div className="portrait-modal__spinner-ring" />
        </div>
        <p className="portrait-modal__message">
          Creating an AI portrait for <strong>{characterName}</strong>...
        </p>
      </div>
    </div>
  );
};

export default PortraitGeneratingModal;
