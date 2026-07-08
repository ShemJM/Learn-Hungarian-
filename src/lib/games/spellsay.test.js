import { describe, it, expect } from 'vitest';
import { spellableWords, buildDeck, isCardWin, PRONOUNCE_THRESHOLD } from './spellsay.js';

describe('spellableWords', () => {
  it('excludes entries with slashes or parentheses', () => {
    const words = [
      { hu: 'szia', en: 'Hi / Bye (informal)' },
      { hu: 'család', en: 'family' },
      { hu: 'fiú', en: 'boy / son' },
      { hu: 'száz', en: 'one hundred' }
    ];
    expect(spellableWords(words).map((w) => w.en)).toEqual(['family', 'one hundred']);
  });

  it('keeps clean multi-word entries', () => {
    const words = [{ hu: 'báty', en: 'older brother' }];
    expect(spellableWords(words)).toHaveLength(1);
  });
});

describe('buildDeck', () => {
  it('returns a permutation without mutating the input', () => {
    const words = [{ en: 'a' }, { en: 'b' }, { en: 'c' }];
    const copy = words.slice();
    const deck = buildDeck(words);
    expect(words).toEqual(copy);
    expect(deck).toHaveLength(3);
    expect(new Set(deck)).toEqual(new Set(words));
  });
});

describe('isCardWin', () => {
  it('is false if spelling was never correct', () => {
    expect(isCardWin({ spelled: false, pronScore: 1, recognitionSupported: true })).toBe(false);
  });

  it('counts spelling alone when recognition is unsupported', () => {
    expect(isCardWin({ spelled: true, pronScore: 0, recognitionSupported: false })).toBe(true);
  });

  it('requires pronunciation at or above the threshold when supported', () => {
    expect(isCardWin({ spelled: true, pronScore: PRONOUNCE_THRESHOLD, recognitionSupported: true })).toBe(true);
    expect(isCardWin({ spelled: true, pronScore: PRONOUNCE_THRESHOLD - 0.01, recognitionSupported: true })).toBe(false);
  });
});
