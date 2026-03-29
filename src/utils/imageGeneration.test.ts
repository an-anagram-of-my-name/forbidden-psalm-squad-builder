import { describe, it, expect } from 'vitest';
import { createImageHash, generateCharacterPrompt } from './imageGeneration';
import { Character } from '../types';

// ---------------------------------------------------------------------------
// Minimal fixture helpers
// ---------------------------------------------------------------------------

function makeCharacter(overrides: Partial<Character> = {}): Character {
  return {
    id: 'char-1',
    name: 'Test Character',
    gameId: '28-psalms',
    techLevel: 'past-tech',
    stats: {
      agility: 2,
      presence: 1,
      strength: 0,
      toughness: -3,
      knowledge: 0,
    },
    flaw: { type: 'xeno', description: 'Xeno flaw' },
    feat: { type: 'marine', description: 'Marine feat' },
    equipment: [],
    ...overrides,
  };
}

// ---------------------------------------------------------------------------
// createImageHash
// ---------------------------------------------------------------------------

describe('createImageHash', () => {
  it('returns a non-empty hex string', () => {
    const hash = createImageHash(makeCharacter());
    expect(hash).toBeTruthy();
    expect(/^[0-9a-f]+$/.test(hash)).toBe(true);
  });

  it('produces the same hash for identical character data', () => {
    const c1 = makeCharacter();
    const c2 = makeCharacter();
    expect(createImageHash(c1)).toBe(createImageHash(c2));
  });

  it('produces different hashes when stats differ', () => {
    const c1 = makeCharacter({ stats: { agility: 2, presence: 1, strength: 0, toughness: -3, knowledge: 0 } });
    const c2 = makeCharacter({ stats: { agility: 3, presence: 1, strength: 0, toughness: -3, knowledge: 0 } });
    expect(createImageHash(c1)).not.toBe(createImageHash(c2));
  });

  it('produces the same hash when only flaw differs (flaw not in prompt/hash)', () => {
    const c1 = makeCharacter({ flaw: { type: 'xeno', description: 'Xeno' } });
    const c2 = makeCharacter({ flaw: { type: 'crazed', description: 'Crazed' } });
    expect(createImageHash(c1)).toBe(createImageHash(c2));
  });

  it('produces the same hash when only name differs (name not in prompt/hash)', () => {
    const c1 = makeCharacter({ name: 'Alpha' });
    const c2 = makeCharacter({ name: 'Beta' });
    expect(createImageHash(c1)).toBe(createImageHash(c2));
  });

  it('is insensitive to character.id (id is not part of hash)', () => {
    const c1 = makeCharacter({ id: 'id-1' });
    const c2 = makeCharacter({ id: 'id-2' });
    expect(createImageHash(c1)).toBe(createImageHash(c2));
  });
});

// ---------------------------------------------------------------------------
// generateCharacterPrompt
// ---------------------------------------------------------------------------

describe('generateCharacterPrompt', () => {
  it('starts with the expected boilerplate', () => {
    const prompt = generateCharacterPrompt(makeCharacter());
    expect(prompt).toMatch(/^A picture from the torso-upwards/);
  });

  it('ends with the style qualifier', () => {
    const prompt = generateCharacterPrompt(makeCharacter());
    expect(prompt).toContain('style is grim, dark, gritty');
  });

  it('includes "high agility" for agility +2', () => {
    const c = makeCharacter({ stats: { agility: 2, presence: 0, strength: 0, toughness: 0, knowledge: 0 } });
    expect(generateCharacterPrompt(c)).toContain('high agility');
  });

  it('includes "very high agility" for agility +3', () => {
    const c = makeCharacter({ stats: { agility: 3, presence: 0, strength: 0, toughness: 0, knowledge: 0 } });
    expect(generateCharacterPrompt(c)).toContain('very high agility');
  });

  it('includes "low toughness" for toughness -2', () => {
    const c = makeCharacter({ stats: { agility: 0, presence: 0, strength: 0, toughness: -2, knowledge: 0 } });
    expect(generateCharacterPrompt(c)).toContain('low toughness');
  });

  it('includes "very low toughness" for toughness -3', () => {
    const c = makeCharacter({ stats: { agility: 0, presence: 0, strength: 0, toughness: -3, knowledge: 0 } });
    expect(generateCharacterPrompt(c)).toContain('very low toughness');
  });

  it('does NOT add stat qualifier for stats between -1 and +1', () => {
    const c = makeCharacter({ stats: { agility: 1, presence: -1, strength: 0, toughness: 0, knowledge: 0 } });
    const prompt = generateCharacterPrompt(c);
    expect(prompt).not.toContain('high agility');
    expect(prompt).not.toContain('low presence');
  });

  it('includes weapon name when weapon equipped', () => {
    const c = makeCharacter({
      equipment: [
        {
          id: 'spear',
          name: 'Spear',
          category: 'weapon',
          cost: 3,
          slots: 2,
          damage: '1d6',
          modifier: 'strength',
          specialRules: [],
          isTwoHanded: true,
          isRanged: false,
        },
      ],
    });
    expect(generateCharacterPrompt(c)).toContain('armed with Spear');
  });

  it('includes armor name when armor equipped', () => {
    const c = makeCharacter({
      equipment: [
        {
          id: 'homemade-armor',
          name: 'Homemade Armor',
          category: 'armor',
          cost: 5,
          slots: 2,
          av: 1,
        },
      ],
    });
    expect(generateCharacterPrompt(c)).toContain('wearing Homemade Armor');
  });

  it('includes item name when item equipped', () => {
    const c = makeCharacter({
      equipment: [
        {
          id: 'med-kit',
          name: 'Medical Kit',
          category: 'item',
          cost: 4,
          slots: 1,
          ability: 'Heals',
        },
      ],
    });
    expect(generateCharacterPrompt(c)).toContain('carrying Medical Kit');
  });

  it('does NOT include ammo in the prompt', () => {
    const c = makeCharacter({
      equipment: [
        {
          id: 'bow-ammo',
          name: 'Bow Ammo',
          category: 'ammo',
          cost: 2,
          slots: 1,
          shots: 6,
          compatibleWeapons: ['bow'],
        },
      ],
    });
    const prompt = generateCharacterPrompt(c);
    expect(prompt).not.toContain('Bow Ammo');
  });

  it('does NOT include consumables in the prompt', () => {
    const c = makeCharacter({
      equipment: [
        {
          id: 'bandage',
          name: 'Bandage',
          category: 'consumable',
          cost: 1,
          slots: 1,
          ability: 'Heals bleeding',
        },
      ],
    });
    const prompt = generateCharacterPrompt(c);
    expect(prompt).not.toContain('Bandage');
  });
});
