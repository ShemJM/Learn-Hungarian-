/**
 * Pure logic for the Translation Crossword: lay Hungarian vocabulary into a
 * crossword grid where every clue is the English meaning, number the entries
 * the classic way, and grade what the learner typed.
 *
 * Generation is the usual greedy approach: the longest word goes down the
 * middle, then every other word is tried at every letter it shares with a
 * word already on the grid, perpendicular to it, keeping the placement that
 * crosses the most letters while growing the grid the least. Words that do
 * not fit anywhere are dropped, so the clue list always matches the grid.
 * Several shuffles are tried and the fullest layout wins.
 */
import { shuffle, sample, foldAccents } from '../text.js';

const key = (r, c) => `${r},${c}`;

/** Vocabulary that works as a crossword answer: one word, letters only, 3–10 characters. Deduplicated. */
export function crosswordWords(words, { minLen = 3, maxLen = 10 } = {}) {
  const seen = new Set();
  return words
    .filter((w) => /^[a-záéíóöőúüű]+$/i.test(w.hu) && w.hu.length >= minLen && w.hu.length <= maxLen)
    .map((w) => ({ ...w, answer: w.hu.toLowerCase(), clue: w.en }))
    .filter((w) => {
      if (seen.has(w.answer)) return false;
      seen.add(w.answer);
      return true;
    });
}

/**
 * Can `word` sit at (row, col) in direction `dir` on the current layout?
 * Rules: an occupied cell must carry the same letter (and counts as a
 * crossing); an empty cell may not touch another word side-on; the cells
 * before the first and after the last letter must be empty. Returns the
 * number of crossings, or -1 when the placement is illegal.
 */
function placementScore(cells, word, row, col, dir) {
  const [dr, dc] = dir === 'across' ? [0, 1] : [1, 0];
  const before = cells.get(key(row - dr, col - dc));
  const after = cells.get(key(row + dr * word.length, col + dc * word.length));
  if (before || after) return -1;
  let crossings = 0;
  let prevOccupied = false;
  for (let i = 0; i < word.length; i++) {
    const r = row + dr * i;
    const c = col + dc * i;
    const existing = cells.get(key(r, c));
    if (existing) {
      if (existing !== word[i]) return -1;
      // Two occupied cells in a row along our direction means we are running
      // over an existing word going the same way (beszélni over szél) — not a crossing.
      if (prevOccupied) return -1;
      prevOccupied = true;
      crossings += 1;
    } else {
      prevOccupied = false;
      // Side neighbours (perpendicular to the word) must be empty, else we'd
      // create an unintended two-letter "word".
      const sideA = cells.get(key(r + dc, c + dr));
      const sideB = cells.get(key(r - dc, c - dr));
      if (sideA || sideB) return -1;
    }
  }
  return crossings;
}

function bounds(cells) {
  let minR = Infinity, minC = Infinity, maxR = -Infinity, maxC = -Infinity;
  for (const k of cells.keys()) {
    const [r, c] = k.split(',').map(Number);
    minR = Math.min(minR, r);
    maxR = Math.max(maxR, r);
    minC = Math.min(minC, c);
    maxC = Math.max(maxC, c);
  }
  return { minR, minC, maxR, maxC };
}

function area({ minR, minC, maxR, maxC }) {
  return (maxR - minR + 1) * (maxC - minC + 1);
}

/** Lay one ordering of words out. Returns { cells, entries }. */
function layout(words, maxSize) {
  const cells = new Map();
  const entries = [];
  if (!words.length) return { cells, entries };

  const place = (word, row, col, dir) => {
    const [dr, dc] = dir === 'across' ? [0, 1] : [1, 0];
    const wordCells = [];
    for (let i = 0; i < word.answer.length; i++) {
      const r = row + dr * i;
      const c = col + dc * i;
      cells.set(key(r, c), word.answer[i]);
      wordCells.push([r, c]);
    }
    entries.push({ ...word, dir, row, col, cells: wordCells });
  };

  place(words[0], 0, 0, 'down');

  for (const word of words.slice(1)) {
    let best = null;
    const currentArea = area(bounds(cells));
    for (const entry of entries) {
      const dir = entry.dir === 'across' ? 'down' : 'across';
      const [dr, dc] = dir === 'across' ? [0, 1] : [1, 0];
      for (let i = 0; i < word.answer.length; i++) {
        for (let j = 0; j < entry.answer.length; j++) {
          if (word.answer[i] !== entry.answer[j]) continue;
          const [cr, cc] = entry.cells[j];
          const row = cr - dr * i;
          const col = cc - dc * i;
          const crossings = placementScore(cells, word.answer, row, col, dir);
          if (crossings < 1) continue;
          // Would the grid still fit the size cap?
          const b = bounds(cells);
          const endR = row + dr * (word.answer.length - 1);
          const endC = col + dc * (word.answer.length - 1);
          const height = Math.max(b.maxR, endR) - Math.min(b.minR, row) + 1;
          const width = Math.max(b.maxC, endC) - Math.min(b.minC, col) + 1;
          if (height > maxSize || width > maxSize) continue;
          const growth = width * height - currentArea;
          const score = crossings * 100 - growth;
          if (!best || score > best.score) best = { score, row, col, dir };
        }
      }
    }
    if (best) place(word, best.row, best.col, best.dir);
  }
  return { cells, entries };
}

/**
 * Build a crossword from `words` (objects with `answer` and `clue`). Tries
 * `tries` random orderings (always starting from a long word) and keeps the
 * one that places the most words, breaking ties by compactness.
 * Returns { width, height, grid, entries } where grid[r][c] is the solution
 * letter or null for a black cell, and entries carry number/dir/row/col/cells.
 */
export function buildCrossword(words, { maxSize = 13, tries = 12, rng = Math.random } = {}) {
  if (!words.length) return normalise({ cells: new Map(), entries: [] });
  let best = null;
  const byLength = [...words].sort((a, b) => b.answer.length - a.answer.length);
  for (let t = 0; t < tries; t++) {
    // Start from one of the three longest words, then a random order for the rest.
    const starters = byLength.slice(0, Math.min(3, byLength.length));
    const first = starters[Math.floor(rng() * starters.length)];
    const rest = shuffle(words.filter((w) => w !== first), rng);
    const result = layout([first, ...rest], maxSize);
    const a = result.entries.length ? area(bounds(result.cells)) : 0;
    if (
      !best ||
      result.entries.length > best.entries.length ||
      (result.entries.length === best.entries.length && a < best.area)
    ) {
      best = { ...result, area: a };
    }
  }
  return normalise(best);
}

/** Shift the layout to the origin, build the 2D grid and assign clue numbers. */
function normalise({ cells, entries }) {
  if (!entries.length) return { width: 0, height: 0, grid: [], entries: [] };
  const { minR, minC, maxR, maxC } = bounds(cells);
  const height = maxR - minR + 1;
  const width = maxC - minC + 1;
  const grid = Array.from({ length: height }, () => Array(width).fill(null));
  for (const [k, ch] of cells) {
    const [r, c] = k.split(',').map(Number);
    grid[r - minR][c - minC] = ch;
  }
  const shifted = entries.map((e) => ({
    ...e,
    row: e.row - minR,
    col: e.col - minC,
    cells: e.cells.map(([r, c]) => [r - minR, c - minC])
  }));
  // Classic numbering: scan row-major; a cell that starts any entry gets the
  // next number, shared by an across and a down entry starting there.
  let n = 0;
  const numbers = new Map();
  for (let r = 0; r < height; r++) {
    for (let c = 0; c < width; c++) {
      const starts = shifted.filter((e) => e.row === r && e.col === c);
      if (!starts.length) continue;
      n += 1;
      numbers.set(key(r, c), n);
    }
  }
  const numbered = shifted
    .map((e) => ({ ...e, number: numbers.get(key(e.row, e.col)), id: `${numbers.get(key(e.row, e.col))}-${e.dir}` }))
    .sort((a, b) => a.number - b.number || (a.dir === 'across' ? -1 : 1));
  return { width, height, grid, entries: numbered, numbers: Object.fromEntries(numbers) };
}

/**
 * Build a complete puzzle from the vocabulary: pick a pool of candidate
 * words larger than the target so the greedy layout has choices, lay them
 * out and keep at most `count` entries.
 */
export function buildPuzzle(words, { count = 10, poolSize = 18, maxSize = 13, rng = Math.random } = {}) {
  const pool = sample(crosswordWords(words), poolSize, rng);
  const full = buildCrossword(pool, { maxSize, rng });
  if (full.entries.length <= count) return full;
  // Too many fit: rebuild from the first `count` that were placed, so the
  // grid stays connected (later placements only ever hang off earlier ones).
  const keep = full.entries.slice(0, count);
  return buildCrossword(
    pool.filter((w) => keep.some((e) => e.answer === w.answer)),
    { maxSize, rng }
  );
}

/** Empty answer grid (same shape as the solution grid) for the UI to type into. */
export function emptyAnswers(puzzle) {
  return puzzle.grid.map((row) => row.map((ch) => (ch === null ? null : '')));
}

/**
 * Grade one entry against the typed answers: 'correct' when every letter
 * matches, 'accents' when it only differs by accents, 'incomplete' when any
 * cell is still empty, else 'wrong'.
 */
export function gradeEntry(entry, answers) {
  const typed = entry.cells.map(([r, c]) => (answers[r][c] || '').toLowerCase());
  if (typed.some((ch) => !ch)) return 'incomplete';
  const word = typed.join('');
  if (word === entry.answer) return 'correct';
  if (foldAccents(word) === foldAccents(entry.answer)) return 'accents';
  return 'wrong';
}

/** Grade every entry; returns { [entry.id]: status }. */
export function gradeAll(puzzle, answers) {
  return Object.fromEntries(puzzle.entries.map((e) => [e.id, gradeEntry(e, answers)]));
}

/** The entries (at most two: across and down) that pass through a cell. */
export function entriesAt(puzzle, r, c) {
  return puzzle.entries.filter((e) => e.cells.some(([er, ec]) => er === r && ec === c));
}

/** Move one cell along an entry from (r, c); returns the next cell or null at the end. */
export function stepAlong(entry, r, c, delta = 1) {
  const i = entry.cells.findIndex(([er, ec]) => er === r && ec === c);
  const next = entry.cells[i + delta];
  return next || null;
}
