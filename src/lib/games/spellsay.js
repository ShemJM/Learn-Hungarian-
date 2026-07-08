/**
 * Pure logic for the "Spell & Say Sprint" game: filtering vocabulary down to
 * clean English typing targets, building a shuffled deck, and deciding whether
 * a card counts as a win.
 */
import { shuffle } from '../text.js';

/** Pronunciation similarity score (0..1) at or above which a spoken attempt counts as correct. */
export const PRONOUNCE_THRESHOLD = 0.7;

/**
 * Keep only words whose English side is a clean typing target — excludes
 * entries with slashes or parentheses (e.g. "Hi / Bye (informal)").
 */
export function spellableWords(words) {
  return words.filter((w) => !/[/()]/.test(w.en));
}

/** Build a shuffled deck of words. Accepts an optional RNG for testability. */
export function buildDeck(words, rng = Math.random) {
  return shuffle(words, rng);
}

/** Whether a card counts as "gotten right" toward the final score. */
export function isCardWin({ spelled, pronScore, recognitionSupported }) {
  if (!spelled) return false;
  if (!recognitionSupported) return true;
  return pronScore >= PRONOUNCE_THRESHOLD;
}
