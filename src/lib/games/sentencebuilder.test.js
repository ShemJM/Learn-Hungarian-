import { describe, it, expect } from 'vitest';
import { tokenize, sentencePool, buildRound, isSolved } from './sentencebuilder.js';
import { dialogues } from '../data/dialogues.js';
import { readings } from '../data/readings.js';

function seededRng(seed = 42) {
  let s = seed;
  return () => {
    s = (s * 1664525 + 1013904223) % 4294967296;
    return s / 4294967296;
  };
}

describe('tokenize', () => {
  it('splits words and strips terminal punctuation', () => {
    expect(tokenize('Szia! Kata vagyok.')).toEqual(['Szia', 'Kata', 'vagyok']);
  });

  it('strips commas, question marks and Hungarian quotes', () => {
    expect(tokenize('„Jó napot! Mennyibe kerül az alma?"')).toEqual([
      'Jó',
      'napot',
      'Mennyibe',
      'kerül',
      'az',
      'alma'
    ]);
    expect(tokenize('Tejjel, köszönöm.')).toEqual(['Tejjel', 'köszönöm']);
  });

  it('keeps accents and inner hyphens intact', () => {
    expect(tokenize('Örülök, hogy megismertelek.')).toEqual(['Örülök', 'hogy', 'megismertelek']);
  });

  it('handles empty input', () => {
    expect(tokenize('')).toEqual([]);
  });
});

describe('sentencePool', () => {
  const fakeDialogues = [
    {
      lines: [
        { speaker: 'A', hu: 'Szia!', en: 'Hi!' }, // too short
        { speaker: 'B', hu: 'Egy kávét kérek.', en: 'I would like a coffee.' },
        { speaker: 'A', hu: 'Egy kávét kérek.', en: 'duplicate' }
      ]
    }
  ];
  const fakeReadings = [
    {
      text: [
        { hu: 'Anna Budapesten lakik.', en: 'Anna lives in Budapest.' },
        { hu: 'a b c d e f g h i j', en: 'too long' }
      ]
    }
  ];

  it('filters by word count and dedupes by Hungarian text', () => {
    const pool = sentencePool(fakeDialogues, fakeReadings);
    expect(pool.map((s) => s.hu)).toEqual(['Egy kávét kérek.', 'Anna Budapesten lakik.']);
  });

  it('finds plenty of sentences in the real course data', () => {
    expect(sentencePool(dialogues, readings).length).toBeGreaterThanOrEqual(20);
  });
});

describe('buildRound', () => {
  const sentence = { hu: 'Anna Budapesten lakik.', en: 'Anna lives in Budapest.' };

  it('produces tiles that are a permutation of the tokens with unique ids', () => {
    const { tokens, tiles } = buildRound(sentence, seededRng());
    expect(tiles.map((t) => t.word).sort()).toEqual([...tokens].sort());
    expect(new Set(tiles.map((t) => t.id)).size).toBe(tokens.length);
  });

  it('never presents tiles in the solved order when a different order exists', () => {
    for (let seed = 1; seed <= 25; seed++) {
      const { tokens, tiles } = buildRound(sentence, seededRng(seed));
      expect(tiles.map((t) => t.word)).not.toEqual(tokens);
    }
  });
});

describe('isSolved', () => {
  it('accepts the right word order and rejects a wrong one', () => {
    const tokens = ['Egy', 'kávét', 'kérek'];
    const tiles = tokens.map((word, id) => ({ id, word }));
    expect(isSolved(tiles, tokens)).toBe(true);
    expect(isSolved([tiles[1], tiles[0], tiles[2]], tokens)).toBe(false);
    expect(isSolved(tiles.slice(0, 2), tokens)).toBe(false);
  });

  it('accepts swapped tiles for duplicate words', () => {
    const tokens = ['a', 'macska', 'a', 'széken'];
    const tiles = tokens.map((word, id) => ({ id, word }));
    const swapped = [tiles[2], tiles[1], tiles[0], tiles[3]]; // the two "a" tiles trade places
    expect(isSolved(swapped, tokens)).toBe(true);
  });
});
