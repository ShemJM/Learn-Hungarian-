/**
 * Pure text helpers used by quizzes, games and pronunciation scoring.
 */

/** Lowercase, trim, strip punctuation and collapse whitespace (keeps Hungarian accents). */
export function normalize(text) {
  return (text || '')
    .toLowerCase()
    .replace(/[.,!?;:'"„”’()\-]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

/** Normalize and also fold Hungarian accented vowels to bare vowels (for lenient answer checking). */
export function foldAccents(text) {
  const map = { á: 'a', é: 'e', í: 'i', ó: 'o', ö: 'o', ő: 'o', ú: 'u', ü: 'u', ű: 'u' };
  return normalize(text).replace(/[áéíóöőúüű]/g, (ch) => map[ch]);
}

/** Levenshtein edit distance between two strings. */
export function levenshtein(a, b) {
  if (a === b) return 0;
  if (!a.length) return b.length;
  if (!b.length) return a.length;
  let prev = Array.from({ length: b.length + 1 }, (_, i) => i);
  for (let i = 1; i <= a.length; i++) {
    const curr = [i];
    for (let j = 1; j <= b.length; j++) {
      const cost = a[i - 1] === b[j - 1] ? 0 : 1;
      curr[j] = Math.min(curr[j - 1] + 1, prev[j] + 1, prev[j - 1] + cost);
    }
    prev = curr;
  }
  return prev[b.length];
}

/** Similarity score 0..1 between a spoken/typed attempt and the target phrase. */
export function similarity(attempt, target) {
  const a = normalize(attempt);
  const b = normalize(target);
  if (!a.length && !b.length) return 1;
  if (!a.length || !b.length) return 0;
  const dist = levenshtein(a, b);
  return Math.max(0, 1 - dist / Math.max(a.length, b.length));
}

/**
 * Check a typed answer against one or more accepted answers.
 * Lenient: case-insensitive, punctuation-insensitive, accent-fold fallback.
 * Returns 'exact' | 'accents' | 'wrong'.
 */
export function checkAnswer(attempt, accepted) {
  const answers = Array.isArray(accepted) ? accepted : [accepted];
  const att = normalize(attempt);
  if (answers.some((ans) => normalize(ans) === att)) return 'exact';
  const folded = foldAccents(attempt);
  if (answers.some((ans) => foldAccents(ans) === folded)) return 'accents';
  return 'wrong';
}

/** Fisher–Yates shuffle (returns a new array). Accepts an optional RNG for testability. */
export function shuffle(arr, rng = Math.random) {
  const out = arr.slice();
  for (let i = out.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    [out[i], out[j]] = [out[j], out[i]];
  }
  return out;
}

/** Scramble the letters of a word, guaranteed different from the original when possible. */
export function scrambleWord(word, rng = Math.random) {
  if (word.length < 2) return word;
  const letters = word.split('');
  // If all letters are identical no scramble can differ.
  if (letters.every((l) => l === letters[0])) return word;
  let scrambled = word;
  while (scrambled === word) {
    scrambled = shuffle(letters, rng).join('');
  }
  return scrambled;
}

/** Pick n random distinct items from arr (or fewer if arr is small). */
export function sample(arr, n, rng = Math.random) {
  return shuffle(arr, rng).slice(0, n);
}

/**
 * Pick n distinct items with probability proportional to weightFn(item).
 * Non-positive weights count as 0; if all remaining weights are 0, the rest
 * are drawn uniformly.
 */
export function weightedSample(arr, n, weightFn, rng = Math.random) {
  const pool = arr.slice();
  const out = [];
  while (out.length < n && pool.length) {
    const weights = pool.map((item) => Math.max(0, weightFn(item)));
    const total = weights.reduce((a, b) => a + b, 0);
    if (!total) {
      out.push(...sample(pool, n - out.length, rng));
      break;
    }
    let r = rng() * total;
    const i = weights.findIndex((w) => (r -= w) < 0);
    out.push(pool.splice(Math.max(i, 0), 1)[0]);
  }
  return out;
}
