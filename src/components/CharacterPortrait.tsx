import React, { useState, useEffect, useRef } from 'react';
import { Character } from '../types';
import { createImageHash, getOrGenerateImage, API_KEY_STORAGE_KEY } from '../utils/imageGeneration';
import { getCachedImage } from '../utils/imageCache';
import './CharacterPortrait.css';

export type PortraitSize = 'small' | 'large';

interface CharacterPortraitProps {
  character: Character;
  size?: PortraitSize;
}

type PortraitState = 'idle' | 'loading' | 'loaded' | 'error';

const CharacterPortrait: React.FC<CharacterPortraitProps> = ({
  character,
  size = 'small',
}) => {
  const [state, setState] = useState<PortraitState>('idle');
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const mountedRef = useRef(true);

  useEffect(() => {
    mountedRef.current = true;

    // Check cache synchronously first
    const hash = createImageHash(character);
    const cached = getCachedImage(hash);

    if (cached) {
      setImageUrl(cached.imageUrl);
      setState('loaded');
      return;
    }

    // No cached image — try to generate if API key is available
    const apiKey = localStorage.getItem(API_KEY_STORAGE_KEY);
    if (!apiKey) {
      // No API key configured → stay in idle (show fallback)
      setState('idle');
      return;
    }

    setState('loading');

    getOrGenerateImage(character, apiKey)
      .then((url) => {
        if (!mountedRef.current) return;
        setImageUrl(url);
        setState('loaded');
      })
      .catch(() => {
        if (!mountedRef.current) return;
        setState('error');
      });

    return () => {
      mountedRef.current = false;
    };
    // Re-run when the character's "fingerprint" changes (hash covers name, stats, equipment, flaw, feat)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [createImageHash(character)]);

  // Fallback: first two initials of the character name
  const initials = character.name
    .split(' ')
    .slice(0, 2)
    .map((w) => w[0] ?? '')
    .join('')
    .toUpperCase();

  return (
    <div
      className={`character-portrait character-portrait--${size}`}
      title={character.name}
      aria-label={`Portrait of ${character.name}`}
    >
      {state === 'loaded' && imageUrl ? (
        <img
          src={imageUrl}
          alt={`Portrait of ${character.name}`}
          className="character-portrait__image"
        />
      ) : state === 'loading' ? (
        <div className="character-portrait__spinner" aria-label="Generating portrait…">
          <div className="character-portrait__spinner-ring" />
        </div>
      ) : (
        /* idle or error — show initials fallback */
        <div className="character-portrait__initials" aria-hidden="true">
          {initials || '?'}
        </div>
      )}
    </div>
  );
};

export default CharacterPortrait;
