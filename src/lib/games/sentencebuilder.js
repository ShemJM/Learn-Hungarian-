/**
 * Pure logic for the Sentence Builder game: pooling sentences from the
 * dialogues and readings, tokenizing them into word tiles, and checking a
 * rebuilt sentence.
 */
import { shuffle } from '../text.js';

/**
 * Split a Hungarian sentence into clean word tokens: whitespace-separated,
 * with edge punctuation stripped (including „Hungarian” quotes and ellipsis)
 * but hyphens/apostrophes inside words kept.
 */
export function tokenize(hu) {
  return (hu || '')
    .split(/\s+/)
    .map((t) => t.replace(/^[„“"'(¿—-]+|[.,!?;:”"')…—-]+$/g, ''))
    .filter(Boolean);
}

/**
 * Collect buildable sentences from dialogues and readings: { hu, en } pairs
 * whose word count falls in [minWords, maxWords], deduplicated by hu.
 */
export function sentencePool(dialogues, readings, { minWords = 3, maxWords = 8 } = {}) {
  const candidates = [
    ...dialogues.flatMap((d) => d.lines.map(({ hu, en }) => ({ hu, en }))),
    ...readings.flatMap((r) => r.text.map(({ hu, en }) => ({ hu, en })))
  ];
  const seen = new Set();
  return candidates.filter(({ hu }) => {
    if (seen.has(hu)) return false;
    seen.add(hu);
    const n = tokenize(hu).length;
    return n >= minWords && n <= maxWords;
  });
}

/**
 * Build one round: the sentence's tokens plus shuffled tiles, guaranteed to
 * differ from the original order when the tokens aren't all identical
 * (shuffle can no-op — same guard as scrambleWord).
 */
export function buildRound(sentence, rng = Math.random) {
  const tokens = tokenize(sentence.hu);
  let tiles = tokens.map((word, id) => ({ id, word }));
  if (!tokens.every((t) => t === tokens[0])) {
    while (tiles.every((tile, i) => tile.word === tokens[i])) {
      tiles = shuffle(tiles, rng);
    }
  }
  return { sentence, tokens, tiles };
}

/**
 * Whether the placed tiles rebuild the sentence. Compared by word sequence,
 * not tile identity, so duplicate words accept either tile.
 */
export function isSolved(placedTiles, tokens) {
  return placedTiles.length === tokens.length && placedTiles.every((tile, i) => tile.word === tokens[i]);
}
