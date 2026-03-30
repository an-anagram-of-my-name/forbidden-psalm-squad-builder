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

const PORTRAIT_TIMEOUT_MS = 120_000;

/**
 * Generates a portrait for the given character by calling the Picsart proxy.
 *
 * On success returns `{ success: true, url: '...' }`.
 * On failure returns `{ success: false, error: '...' }`.
 * Never throws — all errors are caught and returned as failure results.
 * The request is aborted after 30 seconds if no response is received.
 */
export async function generateCharacterPortrait(
  character: Character,
): Promise<PortraitGenerationResult> {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), PORTRAIT_TIMEOUT_MS);

  try {
    const prompt = generatePortraitPrompt(character);

    const formData = new FormData();
    formData.append('prompt', prompt);

    const response = await fetch(PORTRAIT_API_URL, {
      method: 'POST',
      body: formData,
      signal: controller.signal,
    });

    if (!response.ok) {
      return {
        success: false,
        error: `Portrait generation failed (HTTP ${response.status})`,
      };
    }

    const data: unknown = await response.json();

    if (
      typeof data !== 'object' ||
      data === null ||
      !('url' in data) ||
      typeof (data as { url: unknown }).url !== 'string'
    ) {
      return {
        success: false,
        error: 'Portrait generation returned an invalid image URL',
      };
    }

    const imageUrl = (data as { url: string }).url;

    let parsedUrl: URL;
    try {
      parsedUrl = new URL(imageUrl);
    } catch {
      return {
        success: false,
        error: 'Portrait generation returned a malformed image URL',
      };
    }

    if (parsedUrl.protocol !== 'https:') {
      return {
        success: false,
        error: 'Portrait generation returned an unsupported URL scheme',
      };
    }

    return { success: true, url: imageUrl };
  } catch (err) {
    const message =
      err instanceof Error
        ? err.name === 'AbortError'
          ? 'Request timed out after 30 seconds'
          : err.message
        : 'Unknown network error';
    return { success: false, error: `Portrait generation failed: ${message}` };
  } finally {
    clearTimeout(timeoutId);
  }
}
