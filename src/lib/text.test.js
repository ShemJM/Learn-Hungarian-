import { describe, it, expect } from 'vitest';
import { normalize, foldAccents, levenshtein, similarity, checkAnswer, shuffle, scrambleWord, sample } from './text.js';

describe('normalize', () => {
  it('lowercases, trims and strips punctuation', () => {
    expect(normalize('  Jó napot!  ')).toBe('jó napot');
    expect(normalize('Hogy vagy?')).toBe('hogy vagy');
  });

  it('keeps Hungarian accented characters', () => {
    expect(normalize('Köszönöm szépen')).toBe('köszönöm szépen');
  });

  it('collapses internal whitespace', () => {
    expect(normalize('jó   reggelt')).toBe('jó reggelt');
  });

  it('handles empty and nullish input', () => {
    expect(normalize('')).toBe('');
    expect(normalize(null)).toBe('');
    expect(normalize(undefined)).toBe('');
  });
});

describe('foldAccents', () => {
  it('folds all Hungarian accented vowels', () => {
    expect(foldAccents('áéíóöőúüű')).toBe('aeiooouuu');
  });

  it('folds within words', () => {
    expect(foldAccents('Köszönöm')).toBe('koszonom');
    expect(foldAccents('víz')).toBe('viz');
  });
});

describe('levenshtein', () => {
  it('is 0 for identical strings', () => {
    expect(levenshtein('szia', 'szia')).toBe(0);
  });

  it('counts substitutions, insertions and deletions', () => {
    expect(levenshtein('kor', 'kór')).toBe(1);
    expect(levenshtein('bor', 'bort')).toBe(1);
    expect(levenshtein('', 'haz')).toBe(3);
  });
});

describe('similarity', () => {
  it('is 1 for an exact match (after normalisation)', () => {
    expect(similarity('Jó napot!', 'jó napot')).toBe(1);
  });

  it('is 0 when one side is empty', () => {
    expect(similarity('', 'szia')).toBe(0);
  });

  it('is high for a close pronunciation transcript', () => {
    expect(similarity('koszonom', 'köszönöm')).toBeGreaterThan(0.6);
  });

  it('is low for unrelated words', () => {
    expect(similarity('alma', 'viszontlátásra')).toBeLessThan(0.3);
  });
});

describe('checkAnswer', () => {
  it('accepts exact matches case/punctuation-insensitively', () => {
    expect(checkAnswer('SZIA!', 'szia')).toBe('exact');
  });

  it('accepts accent-folded matches as "accents"', () => {
    expect(checkAnswer('kenyer', 'kenyér')).toBe('accents');
  });

  it('rejects wrong answers', () => {
    expect(checkAnswer('bor', 'sör')).toBe('wrong');
  });

  it('accepts any of multiple accepted answers', () => {
    expect(checkAnswer('hi', ['hello', 'hi'])).toBe('exact');
  });
});

describe('shuffle', () => {
  it('returns a permutation without mutating the input', () => {
    const input = [1, 2, 3, 4, 5];
    const copy = input.slice();
    const out = shuffle(input);
    expect(input).toEqual(copy);
    expect(out.slice().sort()).toEqual(copy);
  });
});

describe('scrambleWord', () => {
  it('returns a different string with the same letters', () => {
    const word = 'kenyér';
    const scrambled = scrambleWord(word);
    expect(scrambled).not.toBe(word);
    expect(scrambled.split('').sort()).toEqual(word.split('').sort());
  });

  it('leaves words it cannot scramble alone', () => {
    expect(scrambleWord('a')).toBe('a');
    expect(scrambleWord('aa')).toBe('aa');
  });
});

describe('sample', () => {
  it('returns n distinct items from the array', () => {
    const arr = [1, 2, 3, 4, 5, 6];
    const out = sample(arr, 3);
    expect(out).toHaveLength(3);
    expect(new Set(out).size).toBe(3);
    out.forEach((x) => expect(arr).toContain(x));
  });

  it('caps at array length', () => {
    expect(sample([1, 2], 10)).toHaveLength(2);
  });
});
