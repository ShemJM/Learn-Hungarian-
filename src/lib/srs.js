/**
 * Pure spaced-repetition scheduling (Leitner boxes) for vocabulary review.
 * State per card: { box: 1..BOX_COUNT, last: dayStamp, reps, lapses }.
 * reps counts every review, lapses every miss — the raw material for finding
 * the learner's hardest cards. Entries written before these counters existed
 * are just { box, last }; every reader must guard with (entry?.lapses || 0).
 * Cards with no entry are new and always due. All functions take the current
 * day explicitly so tests stay deterministic — only default parameters touch
 * the real clock.
 *
 * Cards are keyed by srsKey(): plain words use their raw `hu` string (frozen —
 * existing saved progress depends on it), while phrase cards carry an explicit
 * `key` of 'p:' + hu so a phrase can never collide with a word's Leitner box.
 *
 * The deck deliberately runs one direction only, en→hu production: grading
 * free-text English would mark honest answers wrong ("Jó napot" has many valid
 * renderings), and recognition is already covered by MCQ, listening and
 * dictation exercises.
 */
import { shuffle } from './text.js';

/** The key a card's SRS state lives under. Words: raw hu; phrases: 'p:' + hu. */
export function srsKey(item) {
  return item.key ?? item.hu;
}

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

/** All cards due today, preserving input order. */
export function dueWords(words, srsState, today) {
  return words.filter((w) => isDue(srsState[srsKey(w)], today));
}

/** Next SRS entry after a review: promote on success (capped), back to box 1 on a miss. */
export function applyReview(entry, correct, today) {
  const box = correct ? Math.min((entry?.box || 1) + 1, BOX_COUNT) : 1;
  return {
    box,
    last: today,
    reps: (entry?.reps || 0) + 1,
    lapses: (entry?.lapses || 0) + (correct ? 0 : 1)
  };
}

/**
 * Annotate a freshly built session: cards with no SRS entry yet get isNew, so
 * the UI can teach them (show the answer) before testing them. Snapshot at
 * session start — recording reviews mid-session must not flip the flag.
 */
export function annotateNew(cards, srsState) {
  return cards.map((card) => ({ ...card, isNew: !srsState[srsKey(card)] }));
}

/**
 * The learner's hardest cards, hardest first: most lapses, then lowest box,
 * then longest-unseen. Cards below minLapses (including all never-missed and
 * legacy-format entries) don't qualify — a weak card is one that keeps
 * failing, not one that is merely new.
 */
export function weakCards(pool, srsState, { minLapses = 2, limit = 10 } = {}) {
  return pool
    .map((card) => ({ card, entry: srsState[srsKey(card)] }))
    .filter(({ entry }) => (entry?.lapses || 0) >= minLapses)
    .sort(
      (a, b) =>
        (b.entry.lapses || 0) - (a.entry.lapses || 0) ||
        a.entry.box - b.entry.box ||
        a.entry.last - b.entry.last
    )
    .slice(0, limit)
    .map(({ card }) => card);
}

/**
 * Build today's review session: previously-seen due cards first, then at most
 * maxNew unseen cards (so day one doesn't flood the learner with the whole
 * course), shuffled together and capped at maxCards. Unseen phrase cards
 * (item.isPhrase) get their own tighter cap — they're heavier to type, so they
 * trickle in at maxNewPhrases per session on top of the word count.
 */
export function buildSession(
  words,
  srsState,
  today,
  { maxCards = 20, maxNew = 10, maxNewPhrases = 3, rng = Math.random } = {}
) {
  const due = dueWords(words, srsState, today);
  const seen = due.filter((w) => srsState[srsKey(w)]);
  const freshWords = due.filter((w) => !srsState[srsKey(w)] && !w.isPhrase).slice(0, maxNew);
  const freshPhrases = due.filter((w) => !srsState[srsKey(w)] && w.isPhrase).slice(0, maxNewPhrases);
  return shuffle([...seen, ...freshWords, ...freshPhrases], rng).slice(0, maxCards);
}
