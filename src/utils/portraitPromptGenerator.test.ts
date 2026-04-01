import { describe, it, expect } from 'vitest';
import { generatePortraitPrompt } from './portraitPromptGenerator';
import { Character } from '../types';

function makeCharacter(overrides: Partial<Character> = {}): Character {
  return {
    id: 'char-1',
    name: 'Test Character',
    gameId: '28-psalms',
    techLevel: 'past-tech',
    stats: {
      agility: 0,
      presence: 0,
      strength: 0,
      toughness: 0,
      knowledge: 0,
    },
    flaw: { type: 'xeno', description: 'Xeno flaw' },
    feat: { type: 'marine', description: 'Marine feat' },
    equipment: [],
    ...overrides,
  };
}

describe('generatePortraitPrompt', () => {
  it('starts with the expected opener', () => {
    const prompt = generatePortraitPrompt(makeCharacter());
    expect(prompt).toMatch(/^A torso and head image of a grimdark cyberpunk character\./);
  });

  it('ends with the style closing', () => {
    const prompt = generatePortraitPrompt(makeCharacter());
    expect(prompt).toContain('Style is corrupted, grim, gritty, tactical gear with classic cyberpunk neon background.');
    expect(prompt).toContain('the character should be well-lit.');
  });

  it('uses the selected characterStyle when defined', () => {
    const c = makeCharacter({ characterStyle: 'Acid panda' });
    const prompt = generatePortraitPrompt(c);
    expect(prompt).toContain('Style is corrupted, grim, gritty, Acid panda with classic cyberpunk neon background.');
    expect(prompt).not.toContain('tactical gear');
  });

  it('falls back to tactical gear when characterStyle is undefined', () => {
    const c = makeCharacter({ characterStyle: undefined });
    const prompt = generatePortraitPrompt(c);
    expect(prompt).toContain('Style is corrupted, grim, gritty, tactical gear with classic cyberpunk neon background.');
  });

  it('uses "presence/acuity" for the presence stat', () => {
    const c = makeCharacter({ stats: { agility: 0, presence: 2, strength: 0, toughness: 0, knowledge: 0 } });
    expect(generatePortraitPrompt(c)).toContain('high presence/acuity');
  });

  it('includes high stats for values > 1', () => {
    const c = makeCharacter({ stats: { agility: 2, presence: 0, strength: 0, toughness: 0, knowledge: 0 } });
    expect(generatePortraitPrompt(c)).toContain('high agility');
  });

  it('includes low stats for values < 0', () => {
    const c = makeCharacter({ stats: { agility: 0, presence: 0, strength: -1, toughness: 0, knowledge: 0 } });
    expect(generatePortraitPrompt(c)).toContain('low strength');
  });

  it('skips stats with value 0', () => {
    const c = makeCharacter({ stats: { agility: 0, presence: 0, strength: 0, toughness: 0, knowledge: 0 } });
    const prompt = generatePortraitPrompt(c);
    expect(prompt).not.toContain('high agility');
    expect(prompt).not.toContain('low agility');
  });

  it('skips stats with value 1', () => {
    const c = makeCharacter({ stats: { agility: 1, presence: 1, strength: 1, toughness: 1, knowledge: 1 } });
    const prompt = generatePortraitPrompt(c);
    expect(prompt).not.toContain('high agility');
    expect(prompt).not.toContain('high presence');
  });

  it('uses "With high ... but low ..." format when both high and low stats exist', () => {
    const c = makeCharacter({
      stats: { agility: 2, presence: 0, strength: -1, toughness: 0, knowledge: 0 },
    });
    const prompt = generatePortraitPrompt(c);
    expect(prompt).toContain('With high agility but low strength.');
  });

  it('uses "With high ..." format when only high stats exist', () => {
    const c = makeCharacter({
      stats: { agility: 2, presence: 0, strength: 0, toughness: 0, knowledge: 0 },
    });
    const prompt = generatePortraitPrompt(c);
    expect(prompt).toContain('With high agility.');
  });

  it('uses "With low ..." format when only low stats exist', () => {
    const c = makeCharacter({
      stats: { agility: -2, presence: 0, strength: 0, toughness: 0, knowledge: 0 },
    });
    const prompt = generatePortraitPrompt(c);
    expect(prompt).toContain('With low agility.');
  });

  it('includes weapon name with "wields" when weapon is equipped', () => {
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
    expect(generatePortraitPrompt(c)).toContain('The character wields Spear.');
  });

  it('includes armor name with "is wearing" when armor is equipped', () => {
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
    expect(generatePortraitPrompt(c)).toContain('The character is wearing Homemade Armor.');
  });

  it('uses combined "wields ... and is wearing ..." when both weapon and armor present', () => {
    const c = makeCharacter({
      equipment: [
        {
          id: 'sword',
          name: 'Sword',
          category: 'weapon',
          cost: 5,
          slots: 1,
          damage: '1d6',
          modifier: 'strength',
          specialRules: [],
          isTwoHanded: false,
          isRanged: false,
        },
        {
          id: 'shield',
          name: 'Shield',
          category: 'armor',
          cost: 4,
          slots: 1,
          av: 1,
        },
      ],
    });
    const prompt = generatePortraitPrompt(c);
    expect(prompt).toContain('The character wields Sword and is wearing Shield.');
  });

  it('shows "not wearing armor" when no equipment at all', () => {
    const c = makeCharacter({ equipment: [] });
    expect(generatePortraitPrompt(c)).toContain('The character is not wearing armor.');
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
    expect(generatePortraitPrompt(c)).not.toContain('Bow Ammo');
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
    expect(generatePortraitPrompt(c)).not.toContain('Bandage');
  });

  it('shows "not wearing armor" when only consumables and ammo are equipped', () => {
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
    expect(generatePortraitPrompt(c)).toContain('The character is not wearing armor.');
  });
});
