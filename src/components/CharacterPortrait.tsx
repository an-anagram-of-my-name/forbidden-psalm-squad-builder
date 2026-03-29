import React from 'react';
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
      {character.portraitUrl ? (
        <img
          src={character.portraitUrl}
          alt={`Portrait of ${character.name}`}
          className="character-portrait__image"
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
