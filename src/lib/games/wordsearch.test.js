import { describe, it, expect } from 'vitest';
import { searchableWords, buildGrid, buildPuzzle, lineBetween, findWord, DIRECTIONS } from './wordsearch.js';
import { allWords } from '../data/lessons.js';

function seededRng(seed = 7) {
  let s = seed;
  return () => {
    s = (s * 1664525 + 1013904223) % 4294967296;
    return s / 4294967296;
  };
}

describe('searchableWords', () => {
  it('keeps single lowercase-able words of 3–10 letters and drops phrases', () => {
    const words = searchableWords([
      { hu: 'Szia', en: 'hi' },
      { hu: 'Jó napot', en: 'good day' },
      { hu: 'ez', en: 'this' },
      { hu: 'hányadik?', en: 'which' },
      { hu: 'Viszontlátásra', en: 'goodbye' },
      { hu: 'szia', en: 'duplicate' }
    ]);
    expect(words.map((w) => w.answer)).toEqual(['szia']);
  });

  it('finds plenty of words in the real course', () => {
    expect(searchableWords(allWords()).length).toBeGreaterThan(100);
  });
});

describe('buildGrid', () => {
  const words = ['kenyér', 'sör', 'alma', 'víz'].map((answer) => ({ answer, en: answer }));

  it('fills every cell and places every word so it can be read back from its cells', () => {
    const { grid, placed } = buildGrid(words, { size: 8, rng: seededRng() });
    expect(grid).toHaveLength(8);
    for (const row of grid) {
      expect(row).toHaveLength(8);
      for (const ch of row) expect(ch).toMatch(/^[a-záéíóöőúüű]$/);
    }
    expect(placed).toHaveLength(4);
    for (const w of placed) {
      expect(w.cells.map(([r, c]) => grid[r][c]).join('')).toBe(w.answer);
    }
  });

  it('only runs words forwards when backwards is off', () => {
    for (let seed = 1; seed < 15; seed++) {
      const { placed } = buildGrid(words, { size: 8, backwards: false, rng: seededRng(seed) });
      for (const w of placed) {
        const [r0, c0] = w.cells[0];
        const [r1, c1] = w.cells[1];
        expect([r1 - r0, c1 - c0]).not.toEqual(expect.arrayContaining([-1]));
      }
    }
  });

  it('drops a word that is longer than the grid instead of failing', () => {
    const { placed } = buildGrid([{ answer: 'viszontlátásra' }, { answer: 'sör' }], { size: 6, rng: seededRng() });
    expect(placed.map((w) => w.answer)).toEqual(['sör']);
  });
});

describe('buildPuzzle', () => {
  it('builds a 10×10 puzzle with a clue list that matches the grid', () => {
    const puzzle = buildPuzzle(allWords(), { count: 8, size: 10, rng: seededRng(3) });
    expect(puzzle.size).toBe(10);
    expect(puzzle.words.length).toBeGreaterThanOrEqual(6);
    for (const w of puzzle.words) {
      expect(w.en).toBeTruthy();
      expect(w.cells.map(([r, c]) => puzzle.grid[r][c]).join('')).toBe(w.answer);
    }
  });
});

describe('lineBetween', () => {
  it('returns the cells along a row, column or diagonal', () => {
    expect(lineBetween([0, 0], [0, 2])).toEqual([[0, 0], [0, 1], [0, 2]]);
    expect(lineBetween([2, 1], [0, 1])).toEqual([[2, 1], [1, 1], [0, 1]]);
    expect(lineBetween([0, 0], [2, 2])).toEqual([[0, 0], [1, 1], [2, 2]]);
  });

  it('rejects a knight-move shaped selection', () => {
    expect(lineBetween([0, 0], [1, 2])).toBeNull();
  });

  it('covers all eight directions', () => {
    expect(DIRECTIONS).toHaveLength(8);
  });
});

describe('findWord', () => {
  const placed = [{ answer: 'sör', cells: [[1, 1], [1, 2], [1, 3]] }];

  it('matches a selection in either direction and rejects others', () => {
    expect(findWord([[1, 1], [1, 2], [1, 3]], placed)?.answer).toBe('sör');
    expect(findWord([[1, 3], [1, 2], [1, 1]], placed)?.answer).toBe('sör');
    expect(findWord([[1, 1], [1, 2]], placed)).toBeNull();
    expect(findWord([[1, 1]], placed)).toBeNull();
  });
});
