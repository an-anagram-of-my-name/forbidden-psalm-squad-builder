/**
 * Generates a text prompt for AI portrait generation based on a character's stats and equipment.
 */

import { Character, Equipment } from '../types';

/** Filter to only equipment types that are visually relevant for portrait prompts. */
function promptEquipment(equipment: Equipment[]): Equipment[] {
  return equipment.filter(
    (e) => e.category !== 'ammo' && e.category !== 'consumable',
  );
}

/**
 * Generates a structured prompt describing a character's appearance for the Picsart API.
 *
 * Format:
 *   Part A – General opener.
 *   Part B – Stats qualifiers (high/low stats, skipping 0 and 1).
 *   Part C – Equipment qualifiers (weapons / armor).
 *   Part D – Style closing.
 */
export function generatePortraitPrompt(character: Character): string {
  const sentences: string[] = [];
  
  // --- Part A: General opener ---
  const stylePhrase = character.characterStyle ?? 'grimdark';
  sentences.push(`A torso and head image of a ${stylePhrase} character.`);

  // --- Part B: Stats qualifiers ---
  const highStats: string[] = [];
  const lowStats: string[] = [];

  const statEntries = Object.entries(character.stats) as [string, number][];
  for (const [stat, value] of statEntries) {
    // Use "presence/acuity" for the presence stat
    const label = stat === 'presence' ? 'presence/acuity' : stat;

    if (value >= 2) {
      highStats.push(`very high ${label}`);
    } else if (value >= 1) {
      highStats.push(`high ${label}`);
    } else if (value = -1) {
      lowStats.push(`low ${label}`);
    } else if (value <= -2) {
      lowStats.push(`low ${label}`);
    }
    
  }

  if (highStats.length > 0 && lowStats.length > 0) {
    sentences.push(
      `With ${highStats.join(', ')} but ${lowStats.join(', ')}.`,
    );
  } else if (highStats.length > 0) {
    sentences.push(`With ${highStats.join(', ')}.`);
  } else if (lowStats.length > 0) {
    sentences.push(`With ${lowStats.join(', ')}.`);
  }

  // --- Part C: Equipment qualifiers ---
  const visibleEquipment = promptEquipment(character.equipment);
  const weapons = visibleEquipment
    .filter((e) => e.category === 'weapon')
    .map((e) => e.name);
  const armorPieces = visibleEquipment
    .filter((e) => e.category === 'armor')
    .map((e) => `{e.name} armour`);

  if (weapons.length > 0 && armorPieces.length > 0) {
    sentences.push(
      `The character wields ${weapons.join(' and ')} and is wearing ${armorPieces.join(' and ')}.`,
    );
  } else if (weapons.length > 0) {
    sentences.push(`The character wields ${weapons.join(' and ')}.`);
  } else if (armorPieces.length > 0) {
    sentences.push(`The character is wearing ${armorPieces.join(' and ')}.`);
  } else {
    sentences.push('The character is not wearing armour.');
  }

  // --- Part D: Style closing ---

  const featurePhrase = character.characterFeature ?? 'intense glare';
  
  sentences.push(
    `Do NOT add any writing or labels on the character. Style is corrupted, grim, gritty, ${stylePhrase} with classic cyberpunk neon background. Despite dark subject, the character should be well-lit. Overall light cartoon/animation effect, rather than full realism.  Add some glitch to the picture.`,
    `The character has prominent '${featurePhrase}' feature.`,
  );

  return sentences.join(' ');
}
