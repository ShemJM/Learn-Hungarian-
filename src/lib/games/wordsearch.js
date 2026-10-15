/**
 * Pure logic for the Word Search game: choosing hideable vocabulary, laying
 * the words into a letter grid, and checking a selected run of cells.
 *
 * Cells hold single characters. Hungarian digraphs (sz, gy, cs…) are kept as
 * two cells on purpose: that is how the word is spelled, and spotting them
 * inside a grid is part of the practice.
 */
import { shuffle, sample } from '../text.js';

/** Straight-line directions a word may run in: right, down, diagonal down-right, and the reverse of each. */
export const DIRECTIONS = [
  [0, 1],
  [1, 0],
  [1, 1],
  [0, -1],
  [-1, 0],
  [-1, -1],
  [1, -1],
  [-1, 1]
];

/** The Hungarian lowercase alphabet (single characters), weighted roughly by frequency for filler cells. */
const FILLER = 'aaaeeeiiooőöuüáéíóúttttnnnnsssszzzlllkkkkrrrmmmgggyyyjjddbbvvhhpcfz';

/**
 * Vocabulary that reads well in a grid: a single word, letters only, 3–10
 * characters long. Returns lowercase `hu` plus the original entry.
 */
export function searchableWords(words, { minLen = 3, maxLen = 10 } = {}) {
  const seen = new Set();
  return words
    .filter((w) => /^[a-záéíóöőúüű]+$/i.test(w.hu) && w.hu.length >= minLen && w.hu.length <= maxLen)
    .map((w) => ({ ...w, answer: w.hu.toLowerCase() }))
    .filter((w) => {
      if (seen.has(w.answer)) return false;
      seen.add(w.answer);
      return true;
    });
}

/** Whether `word` fits at (row, col) heading `dir` without clashing with letters already on the grid. */
function fits(grid, word, row, col, [dr, dc]) {
  const size = grid.length;
  for (let i = 0; i < word.length; i++) {
    const r = row + dr * i;
    const c = col + dc * i;
    if (r < 0 || c < 0 || r >= size || c >= size) return false;
    const cell = grid[r][c];
    if (cell && cell !== word[i]) return false;
  }
  return true;
}

function write(grid, word, row, col, [dr, dc]) {
  const cells = [];
  for (let i = 0; i < word.length; i++) {
    const r = row + dr * i;
    const c = col + dc * i;
    grid[r][c] = word[i];
    cells.push([r, c]);
  }
  return cells;
}

/**
 * Lay `words` (objects with `answer`) into a size×size grid. Each word is
 * tried in random positions and directions; a word that cannot be placed is
 * dropped rather than failing the whole puzzle. Empty cells are filled with
 * random Hungarian letters. Returns { grid, placed } where placed carries
 * each word's cells.
 *
 * `backwards` false restricts directions to right / down / diagonal so the
 * easier puzzle never asks the learner to read a word in reverse.
 */
export function buildGrid(words, { size = 10, backwards = true, attempts = 60, rng = Math.random } = {}) {
  const grid = Array.from({ length: size }, () => Array(size).fill(''));
  const dirs = backwards ? DIRECTIONS : DIRECTIONS.slice(0, 3);
  const placed = [];
  // Longest first: they are the hardest to fit once the grid fills up.
  const ordered = [...words].sort((a, b) => b.answer.length - a.answer.length);
  for (const word of ordered) {
    if (word.answer.length > size) continue;
    let done = null;
    for (let attempt = 0; attempt < attempts && !done; attempt++) {
      const dir = dirs[Math.floor(rng() * dirs.length)];
      const row = Math.floor(rng() * size);
      const col = Math.floor(rng() * size);
      if (fits(grid, word.answer, row, col, dir)) {
        done = write(grid, word.answer, row, col, dir);
      }
    }
    if (done) placed.push({ ...word, cells: done });
  }
  for (let r = 0; r < size; r++) {
    for (let c = 0; c < size; c++) {
      if (!grid[r][c]) grid[r][c] = FILLER[Math.floor(rng() * FILLER.length)];
    }
  }
  return { grid, placed };
}

/**
 * Build a complete puzzle: pick `count` words, lay them out, and return
 * everything the UI needs. Words that did not fit are simply not part of the
 * puzzle, so the clue list always matches the grid.
 */
export function buildPuzzle(words, { count = 8, size = 10, backwards = true, rng = Math.random } = {}) {
  const chosen = sample(searchableWords(words), count, rng);
  const { grid, placed } = buildGrid(chosen, { size, backwards, rng });
  return { grid, words: shuffle(placed, rng), size };
}

/**
 * The straight line of cells from `from` to `to` (inclusive), or null when
 * the two cells are not on a horizontal, vertical or 45° diagonal line.
 */
export function lineBetween(from, to) {
  const dr = Math.sign(to[0] - from[0]);
  const dc = Math.sign(to[1] - from[1]);
  const len = Math.max(Math.abs(to[0] - from[0]), Math.abs(to[1] - from[1]));
  if (dr !== 0 && dc !== 0 && Math.abs(to[0] - from[0]) !== Math.abs(to[1] - from[1])) return null;
  const cells = [];
  for (let i = 0; i <= len; i++) cells.push([from[0] + dr * i, from[1] + dc * i]);
  return cells;
}

function sameCells(a, b) {
  return a.length === b.length && a.every(([r, c], i) => r === b[i][0] && c === b[i][1]);
}

/**
 * Which placed word (if any) the selected cells spell out. A selection may
 * run in either direction along the word.
 */
export function findWord(selection, placed) {
  if (!selection || selection.length < 2) return null;
  const reversed = [...selection].reverse();
  return placed.find((w) => sameCells(w.cells, selection) || sameCells(w.cells, reversed)) || null;
}
