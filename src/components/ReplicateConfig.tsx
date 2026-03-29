import React, { useState } from 'react';
import { API_KEY_STORAGE_KEY } from '../utils/imageGeneration';
import './ReplicateConfig.css';

interface ReplicateConfigProps {
  onClose: () => void;
}

const ReplicateConfig: React.FC<ReplicateConfigProps> = ({ onClose }) => {
  const savedKey = localStorage.getItem(API_KEY_STORAGE_KEY) ?? '';
  const [apiKey, setApiKey] = useState('');
  const [saved, setSaved] = useState(false);

  const maskedKey = savedKey
    ? `••••••••••${savedKey.slice(-6)}`
    : '(not set)';

  const handleSave = () => {
    const trimmed = apiKey.trim();
    if (trimmed) {
      localStorage.setItem(API_KEY_STORAGE_KEY, trimmed);
      setSaved(true);
      setApiKey('');
      setTimeout(onClose, 800);
    }
  };

  const handleClear = () => {
    localStorage.removeItem(API_KEY_STORAGE_KEY);
    setApiKey('');
    setSaved(false);
  };

  return (
    <div className="replicate-config-overlay" onClick={onClose}>
      <div
        className="replicate-config-modal"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="replicate-config-header">
          <h2>🎨 Image Generation Settings</h2>
          <button
            className="replicate-config-close"
            onClick={onClose}
            aria-label="Close"
          >
            ✕
          </button>
        </div>

        <div className="replicate-config-body">
          <p className="replicate-config-description">
            Enter your{' '}
            <a
              href="https://replicate.com/account/api-tokens"
              target="_blank"
              rel="noopener noreferrer"
            >
              Replicate API key
            </a>{' '}
            to generate AI character portraits. The key is stored locally in
            your browser only.
          </p>

          <div className="replicate-config-current">
            <span className="replicate-config-label">Current key:</span>
            <span className="replicate-config-masked">{maskedKey}</span>
            {savedKey && (
              <button
                className="btn-clear-key"
                onClick={handleClear}
                type="button"
              >
                Clear
              </button>
            )}
          </div>

          <label className="replicate-config-label" htmlFor="replicate-api-key">
            New API key
          </label>
          <input
            id="replicate-api-key"
            type="password"
            className="replicate-config-input"
            value={apiKey}
            onChange={(e) => setApiKey(e.target.value)}
            placeholder="r8_••••••••••••••••••••••••••••••••••••••••"
            autoComplete="off"
            onKeyDown={(e) => {
              if (e.key === 'Enter') handleSave();
            }}
          />

          {saved && (
            <p className="replicate-config-success">✓ API key saved!</p>
          )}
        </div>

        <div className="replicate-config-footer">
          <button className="btn-secondary" onClick={onClose} type="button">
            Cancel
          </button>
          <button
            className="btn-save-key"
            onClick={handleSave}
            type="button"
            disabled={!apiKey.trim()}
          >
            Save Key
          </button>
        </div>
      </div>
    </div>
  );
};

export default ReplicateConfig;
