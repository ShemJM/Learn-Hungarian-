/**
 * Pure spaced-repetition scheduling (Leitner boxes) for vocabulary review.
 * State per word: { box: 1..BOX_COUNT, last: dayStamp }. Words with no entry
 * are new and always due. All functions take the current day explicitly so
 * tests stay deterministic — only default parameters touch the real clock.
 */
import { shuffle } from './text.js';

export const BOX_COUNT = 5;

/** Days to wait before a word in box N (1-based) comes up again. */
export const INTERVALS = [0, 1, 2, 4, 8];

/** Integer day number at local midnight, so "due tomorrow" matches the learner's calendar day. */
export function dayStamp(now = Date.now()) {
  return Math.floor((now - new Date(now).getTimezoneOffset() * 60000) / 86400000);
}

/** Whether a word is due for review today. New words (no entry) are always due. */
export function isDue(entry, today) {
  if (!entry) return true;
  return today >= entry.last + INTERVALS[entry.box - 1];
}

/** All words due today, preserving input order. */
export function dueWords(words, srsState, today) {
  return words.filter((w) => isDue(srsState[w.hu], today));
}

/** Next SRS entry after a review: promote on success (capped), back to box 1 on a miss. */
export function applyReview(entry, correct, today) {
  const box = correct ? Math.min((entry?.box || 1) + 1, BOX_COUNT) : 1;
  return { box, last: today };
}

/**
 * Build today's review session: previously-seen due words first, then at most
 * maxNew unseen words (so day one doesn't flood the learner with the whole
 * course), shuffled together and capped at maxCards.
 */
export function buildSession(words, srsState, today, { maxCards = 20, maxNew = 10, rng = Math.random } = {}) {
  const due = dueWords(words, srsState, today);
  const seen = due.filter((w) => srsState[w.hu]);
  const fresh = due.filter((w) => !srsState[w.hu]).slice(0, maxNew);
  return shuffle([...seen, ...fresh], rng).slice(0, maxCards);
}
