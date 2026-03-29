/**
 * Image generation utilities for character portraits using the Replicate API.
 */

import { Character, Equipment } from '../types';
import { getCachedImage, setCachedImage } from './imageCache';

/** Replicate SDXL model version to use for portrait generation. */
export const REPLICATE_MODEL =
  'stability-ai/sdxl:39ed52f2a60768f4ca6f357410f3469d3d4964546d6a99c0f3de2b8a4e50f9a4';

const REPLICATE_API_BASE = 'https://api.replicate.com/v1';

/** localStorage key for the Replicate API key. */
export const API_KEY_STORAGE_KEY = 'replicate-api-key';

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

// ---------------------------------------------------------------------------
// Replicate API
// ---------------------------------------------------------------------------

interface ReplicatePrediction {
  id: string;
  status: 'starting' | 'processing' | 'succeeded' | 'failed' | 'canceled';
  output?: string[];
  error?: string;
}

/** Call the Replicate API to start an image generation prediction. */
async function startPrediction(
  prompt: string,
  apiKey: string,
): Promise<string> {
  const response = await fetch(`${REPLICATE_API_BASE}/predictions`, {
    method: 'POST',
    headers: {
      Authorization: `Token ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      version: REPLICATE_MODEL.split(':')[1],
      input: {
        prompt,
        num_inference_steps: 25,
        guidance_scale: 7.5,
      },
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Replicate API error (${response.status}): ${errorText}`);
  }

  const prediction: ReplicatePrediction = await response.json();
  return prediction.id;
}

/** Poll a Replicate prediction until it completes (succeeded or failed). */
async function pollPrediction(
  predictionId: string,
  apiKey: string,
  timeoutMs = 60_000,
): Promise<string> {
  const deadline = Date.now() + timeoutMs;

  while (Date.now() < deadline) {
    await new Promise((resolve) => setTimeout(resolve, 2000));

    const response = await fetch(
      `${REPLICATE_API_BASE}/predictions/${predictionId}`,
      {
        headers: { Authorization: `Token ${apiKey}` },
      },
    );

    if (!response.ok) {
      throw new Error(`Replicate poll error (${response.status})`);
    }

    const prediction: ReplicatePrediction = await response.json();

    if (prediction.status === 'succeeded') {
      const url = prediction.output?.[0];
      if (!url) throw new Error('No output URL in prediction response');
      return url;
    }

    if (prediction.status === 'failed' || prediction.status === 'canceled') {
      throw new Error(
        `Prediction ${prediction.status}: ${prediction.error ?? 'unknown error'}`,
      );
    }
    // still starting/processing — keep polling
  }

  throw new Error(
    `Image generation timed out after ${Math.round(timeoutMs / 1000)} seconds`,
  );
}

/**
 * Generate a character portrait using the Replicate API.
 * Returns the URL of the generated image.
 */
export async function generateCharacterImage(
  character: Character,
  apiKey: string,
): Promise<string> {
  const prompt = generateCharacterPrompt(character);
  const predictionId = await startPrediction(prompt, apiKey);
  const imageUrl = await pollPrediction(predictionId, apiKey);
  return imageUrl;
}

/**
 * Get a character portrait URL, using the cache if available.
 * If not cached and an API key is provided, generates a new image.
 * Returns null if no API key is configured or on error.
 */
export async function getOrGenerateImage(
  character: Character,
  apiKey: string,
): Promise<string> {
  const hash = createImageHash(character);
  const prompt = generateCharacterPrompt(character);

  // Check cache first
  const cached = getCachedImage(hash);
  if (cached) {
    return cached.imageUrl;
  }

  // Generate new image
  const imageUrl = await generateCharacterImage(character, apiKey);

  // Cache the result
  setCachedImage(hash, {
    characterId: character.id,
    imageUrl,
    generatedAt: new Date().toISOString(),
    prompt,
  });

  return imageUrl;
}
