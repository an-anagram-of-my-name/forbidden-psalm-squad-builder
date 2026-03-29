/**
 * Image cache service for character portraits.
 * Stores generated image URLs in localStorage keyed by a hash of character data.
 */

const CACHE_KEY = 'image-cache';

export interface ImageCacheEntry {
  characterId: string;
  imageUrl: string;
  generatedAt: string;
  prompt: string;
}

type ImageCache = Record<string, ImageCacheEntry>;

function loadCache(): ImageCache {
  try {
    const raw = localStorage.getItem(CACHE_KEY);
    if (!raw) return {};
    return JSON.parse(raw) as ImageCache;
  } catch {
    return {};
  }
}

function saveCache(cache: ImageCache): void {
  try {
    localStorage.setItem(CACHE_KEY, JSON.stringify(cache));
  } catch {
    // Storage quota exceeded or unavailable — silently ignore
  }
}

export function getCachedImage(hash: string): ImageCacheEntry | null {
  const cache = loadCache();
  return cache[hash] ?? null;
}

export function setCachedImage(hash: string, entry: ImageCacheEntry): void {
  const cache = loadCache();
  cache[hash] = entry;
  saveCache(cache);
}

export function clearImageCache(): void {
  try {
    localStorage.removeItem(CACHE_KEY);
  } catch {
    // Storage unavailable — silently ignore
  }
}
