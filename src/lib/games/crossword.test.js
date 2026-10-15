import { describe, it, expect } from 'vitest';
import {
  crosswordWords,
  buildCrossword,
  buildPuzzle,
  emptyAnswers,
  gradeEntry,
  gradeAll,
  entriesAt,
  stepAlong
} from './crossword.js';
import { allWords } from '../data/lessons.js';

function seededRng(seed = 11) {
  let s = seed;
  return () => {
    s = (s * 1664525 + 1013904223) % 4294967296;
    return s / 4294967296;
  };
}

const sample = ['kenyér', 'sör', 'alma', 'kávé', 'tej', 'víz', 'asztal', 'szék'].map((answer) => ({
  hu: answer,
  en: `clue for ${answer}`
}));

/** Every entry must read its answer off the grid, and no two entries may disagree on a shared cell. */
function assertConsistent(puzzle) {
  for (const e of puzzle.entries) {
    expect(e.cells.map(([r, c]) => puzzle.grid[r][c]).join('')).toBe(e.answer);
    expect(e.number).toBeGreaterThan(0);
    expect(['across', 'down']).toContain(e.dir);
  }
}

/** No run of two or more adjacent letters may exist that is not one of the entries. */
function assertNoStrayWords(puzzle) {
  const runs = [];
  for (let r = 0; r < puzzle.height; r++) {
    let run = [];
    for (let c = 0; c <= puzzle.width; c++) {
      if (c < puzzle.width && puzzle.grid[r][c]) run.push([r, c]);
      else {
        if (run.length > 1) runs.push({ dir: 'across', cells: run });
        run = [];
      }
    }
  }
  for (let c = 0; c < puzzle.width; c++) {
    let run = [];
    for (let r = 0; r <= puzzle.height; r++) {
      if (r < puzzle.height && puzzle.grid[r][c]) run.push([r, c]);
      else {
        if (run.length > 1) runs.push({ dir: 'down', cells: run });
        run = [];
      }
    }
  }
  for (const run of runs) {
    const match = puzzle.entries.find(
      (e) =>
        e.dir === run.dir &&
        e.cells.length === run.cells.length &&
        e.cells.every(([r, c], i) => r === run.cells[i][0] && c === run.cells[i][1])
    );
    expect(match, `stray ${run.dir} run at ${run.cells[0]}`).toBeTruthy();
  }
  expect(runs).toHaveLength(puzzle.entries.length);
}

describe('crosswordWords', () => {
  it('keeps single words and attaches the English meaning as the clue', () => {
    const words = crosswordWords([
      { hu: 'Köszönöm', en: 'thank you' },
      { hu: 'Jó napot', en: 'good day' },
      { hu: 'köszönöm', en: 'dup' }
    ]);
    expect(words).toHaveLength(1);
    expect(words[0]).toMatchObject({ answer: 'köszönöm', clue: 'thank you' });
  });
});

describe('buildCrossword', () => {
  it('lays out crossing words with a consistent grid and classic numbering', () => {
    const puzzle = buildCrossword(crosswordWords(sample), { rng: seededRng() });
    expect(puzzle.entries.length).toBeGreaterThanOrEqual(4);
    expect(puzzle.grid).toHaveLength(puzzle.height);
    assertConsistent(puzzle);
    assertNoStrayWords(puzzle);
    const numbers = puzzle.entries.map((e) => e.number);
    expect(numbers).toEqual([...numbers].sort((a, b) => a - b));
    expect(Math.max(...numbers)).toBeLessThanOrEqual(puzzle.entries.length);
  });

  it('every entry after the first crosses at least one other entry', () => {
    const puzzle = buildCrossword(crosswordWords(sample), { rng: seededRng(5) });
    for (const e of puzzle.entries) {
      const crosses = e.cells.some(([r, c]) => entriesAt(puzzle, r, c).length === 2);
      expect(crosses, e.answer).toBe(true);
    }
  });

  it('never exceeds the size cap', () => {
    for (let seed = 1; seed <= 10; seed++) {
      const puzzle = buildCrossword(crosswordWords(sample), { maxSize: 9, rng: seededRng(seed) });
      expect(puzzle.width).toBeLessThanOrEqual(9);
      expect(puzzle.height).toBeLessThanOrEqual(9);
    }
  });

  it('returns an empty puzzle for no words', () => {
    expect(buildCrossword([])).toEqual({ width: 0, height: 0, grid: [], entries: [] });
  });
});

describe('buildPuzzle with the real course vocabulary', () => {
  it('produces a playable puzzle of at most the requested size, with no stray words', () => {
    for (let seed = 1; seed <= 8; seed++) {
      const puzzle = buildPuzzle(allWords(), { count: 10, rng: seededRng(seed) });
      expect(puzzle.entries.length).toBeGreaterThanOrEqual(6);
      expect(puzzle.entries.length).toBeLessThanOrEqual(10);
      expect(puzzle.width).toBeLessThanOrEqual(13);
      expect(puzzle.height).toBeLessThanOrEqual(13);
      assertConsistent(puzzle);
      assertNoStrayWords(puzzle);
      for (const e of puzzle.entries) expect(e.clue).toBeTruthy();
    }
  });
});

describe('grading and navigation', () => {
  const puzzle = buildCrossword(crosswordWords(sample), { rng: seededRng() });

  it('grades incomplete, correct, accent-only and wrong entries', () => {
    const answers = emptyAnswers(puzzle);
    const entry = puzzle.entries[0];
    expect(gradeEntry(entry, answers)).toBe('incomplete');
    entry.cells.forEach(([r, c], i) => (answers[r][c] = entry.answer[i].toUpperCase()));
    expect(gradeEntry(entry, answers)).toBe('correct');
    entry.cells.forEach(([r, c], i) => (answers[r][c] = entry.answer[i].normalize('NFD').replace(/[̀-ͯ]/g, '')));
    expect(gradeEntry(entry, answers)).toBe(entry.answer.match(/[áéíóöőúüű]/) ? 'accents' : 'correct');
    entry.cells.forEach(([r, c]) => (answers[r][c] = 'x'));
    expect(gradeEntry(entry, answers)).toBe('wrong');
    expect(Object.keys(gradeAll(puzzle, answers))).toHaveLength(puzzle.entries.length);
  });

  it('emptyAnswers mirrors the grid shape with blanks for letters and null for black cells', () => {
    const answers = emptyAnswers(puzzle);
    for (let r = 0; r < puzzle.height; r++) {
      for (let c = 0; c < puzzle.width; c++) {
        expect(answers[r][c]).toBe(puzzle.grid[r][c] === null ? null : '');
      }
    }
  });

  it('steps along an entry and stops at its ends', () => {
    const entry = puzzle.entries[0];
    const [r0, c0] = entry.cells[0];
    expect(stepAlong(entry, r0, c0, 1)).toEqual(entry.cells[1]);
    expect(stepAlong(entry, r0, c0, -1)).toBeNull();
    const [rl, cl] = entry.cells[entry.cells.length - 1];
    expect(stepAlong(entry, rl, cl, 1)).toBeNull();
  });
});
