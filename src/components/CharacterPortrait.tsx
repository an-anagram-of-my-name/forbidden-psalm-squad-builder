import React, { useState } from 'react';
import { Character } from '../types';
import './CharacterPortrait.css';

export type PortraitSize = 'small' | 'large';

interface CharacterPortraitProps {
  character: Character;
  size?: PortraitSize;
}

const CharacterPortrait: React.FC<CharacterPortraitProps> = ({
  character,
  size = 'small',
}) => {
  const [imageFailed, setImageFailed] = useState(false);

  // Fallback: first two initials of the character name
  const initials = character.name
    .split(' ')
    .slice(0, 2)
    .map((w) => w[0] ?? '')
    .join('')
    .toUpperCase();

  const showImage = !!character.portraitUrl && !imageFailed;

  return (
    <div
      className={`character-portrait character-portrait--${size}`}
      title={character.name}
      aria-label={`Portrait of ${character.name}`}
    >
      {showImage ? (
        <img
          src={character.portraitUrl}
          alt={`Portrait of ${character.name}`}
          className="character-portrait__image"
          onError={() => setImageFailed(true)}
        />
      ) : (
        <div className="character-portrait__initials" aria-hidden="true">
          {initials || '?'}
        </div>
      )}
    </div>
  );
};

export default CharacterPortrait;
