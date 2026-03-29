/**
 * Service for generating AI portraits via the Picsart proxy endpoint.
 */

import { Character } from '../types';
import { generatePortraitPrompt } from '../utils/portraitPromptGenerator';

const PORTRAIT_API_URL = 'https://lyono.com/Generation/picsart-proxy.php';

export interface PortraitGenerationResult {
  success: boolean;
  url?: string;
  error?: string;
}

/**
 * Generates a portrait for the given character by calling the Picsart proxy.
 *
 * On success returns `{ success: true, url: '...' }`.
 * On failure returns `{ success: false, error: '...' }`.
 * Never throws — all errors are caught and returned as failure results.
 */
export async function generateCharacterPortrait(
  character: Character,
): Promise<PortraitGenerationResult> {
  try {
    const prompt = generatePortraitPrompt(character);

    const formData = new FormData();
    formData.append('prompt', prompt);

    const response = await fetch(PORTRAIT_API_URL, {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      return {
        success: false,
        error: `Portrait generation failed (HTTP ${response.status})`,
      };
    }

    const data = await response.json();

    if (!data.url) {
      return {
        success: false,
        error: 'Portrait generation returned no image URL',
      };
    }

    return { success: true, url: data.url as string };
  } catch (err) {
    const message =
      err instanceof Error ? err.message : 'Unknown network error';
    return { success: false, error: `Portrait generation failed: ${message}` };
  }
}
