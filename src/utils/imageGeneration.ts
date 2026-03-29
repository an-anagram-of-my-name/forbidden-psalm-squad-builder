/**
 * Prompt and cache-key helpers for character portrait descriptions.
 * These utilities are used to build text prompts and stable hashes for
 * integration with a pre-generated image gallery or external renderers.
 */

import { Character, Equipment } from '../types';

// ---------------------------------------------------------------------------
// Hash / cache key
// ---------------------------------------------------------------------------

/**
 * Create a deterministic cache key string from the parts of a character that
 * affect the generated prompt. We keep it simple: JSON stringify the relevant
 * fields and compute a basic hash.
 */
export function createImageHash(character: Character): string {
  const relevant = {
    // Only include stats and the equipment that can appear in the prompt.
    stats: character.stats,
    equipment: promptEquipment(character.equipment).map((e) => e.id).sort(),
  };
  const str = JSON.stringify(relevant);
  // djb2-style hash → hex string
  let hash = 5381;
  for (let i = 0; i < str.length; i++) {
    hash = ((hash << 5) + hash) ^ str.charCodeAt(i);
    hash = hash >>> 0; // keep unsigned 32-bit
  }
  return hash.toString(16);
}

// ---------------------------------------------------------------------------
// Prompt generation
// ---------------------------------------------------------------------------

/** Filter out ammo and consumables from the equipment list for prompt use. */
function promptEquipment(equipment: Equipment[]): Equipment[] {
  return equipment.filter(
    (e) => e.category !== 'ammo' && e.category !== 'consumable',
  );
}

/**
 * Build a Stable Diffusion prompt describing the character appearance based on
 * their stats, flaw/feat, and equipment.
 */
export function generateCharacterPrompt(character: Character): string {
  const parts: string[] = [];

  // --- Base boilerplate ---
  parts.push('A picture from the torso-upwards of a grimdark cyberpunk character');

  // --- Stat qualifiers ---
  const statQualifiers: string[] = [];
  const stats = character.stats;
  const statEntries = Object.entries(stats) as [string, number][];
  for (const [stat, value] of statEntries) {
    if (value >= 3) {
      statQualifiers.push(`very high ${stat}`);
    } else if (value > 1) {
      statQualifiers.push(`high ${stat}`);
    } else if (value <= -3) {
      statQualifiers.push(`very low ${stat}`);
    } else if (value < -1) {
      statQualifiers.push(`low ${stat}`);
    }
  }
  if (statQualifiers.length > 0) {
    parts.push(`with ${statQualifiers.join(' and ')}`);
  }

  // --- Equipment qualifiers ---
  const visibleEquipment = promptEquipment(character.equipment);

  const weapons = visibleEquipment
    .filter((e) => e.category === 'weapon')
    .map((e) => e.name);
  const armor = visibleEquipment
    .filter((e) => e.category === 'armor')
    .map((e) => e.name);
  const items = visibleEquipment
    .filter((e) => e.category === 'item')
    .map((e) => e.name);

  if (weapons.length > 0) {
    parts.push(`armed with ${weapons.join(', ')}`);
  }
  if (armor.length > 0) {
    parts.push(`wearing ${armor.join(', ')}`);
  }
  if (items.length > 0) {
    parts.push(`carrying ${items.join(', ')}`);
  }

  // --- Final style qualifier ---
  parts.push(
    'style is grim, dark, gritty, tactical gear with classic cyberpunk neon background',
  );

  return parts.join(', ') + '.';
}
