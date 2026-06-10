import { describe, it, expect } from 'vitest';
import { buildQuiz, scoreQuiz, grade } from './quiz.js';

const words = [
  { hu: 'kenyér', en: 'bread' },
  { hu: 'víz', en: 'water' },
  { hu: 'bor', en: 'wine' },
  { hu: 'sör', en: 'beer' },
  { hu: 'kávé', en: 'coffee' },
  { hu: 'tej', en: 'milk' }
];

describe('buildQuiz', () => {
  it('builds the requested number of questions', () => {
    expect(buildQuiz(words, { count: 4 })).toHaveLength(4);
  });

  it('caps the question count at the word pool size', () => {
    expect(buildQuiz(words, { count: 100 })).toHaveLength(words.length);
  });

  it('returns an empty quiz for tiny pools', () => {
    expect(buildQuiz([], {})).toEqual([]);
    expect(buildQuiz([words[0]], {})).toEqual([]);
  });

  it('always includes the correct answer among the choices', () => {
    for (const q of buildQuiz(words, { count: 6, direction: 'mixed' })) {
      expect(q.choices).toContain(q.answer);
    }
  });

  it('has no duplicate choices', () => {
    for (const q of buildQuiz(words, { count: 6 })) {
      expect(new Set(q.choices).size).toBe(q.choices.length);
    }
  });

  it('respects hu-en direction', () => {
    for (const q of buildQuiz(words, { count: 6, direction: 'hu-en' })) {
      expect(q.promptLang).toBe('hu');
      expect(q.prompt).toBe(q.word.hu);
      expect(q.answer).toBe(q.word.en);
    }
  });

  it('respects en-hu direction', () => {
    for (const q of buildQuiz(words, { count: 6, direction: 'en-hu' })) {
      expect(q.promptLang).toBe('en');
      expect(q.prompt).toBe(q.word.en);
      expect(q.answer).toBe(q.word.hu);
    }
  });

  it('builds 4 choices when the pool allows', () => {
    for (const q of buildQuiz(words, { count: 6, choiceCount: 4 })) {
      expect(q.choices).toHaveLength(4);
    }
  });
});

describe('scoreQuiz', () => {
  it('computes correct count and percent', () => {
    const results = [{ correct: true }, { correct: true }, { correct: false }, { correct: true }];
    expect(scoreQuiz(results)).toEqual({ correct: 3, total: 4, percent: 75 });
  });

  it('handles empty results', () => {
    expect(scoreQuiz([])).toEqual({ correct: 0, total: 0, percent: 0 });
  });
});

describe('grade', () => {
  it('grades by thresholds', () => {
    expect(grade(95).label).toContain('Kiváló');
    expect(grade(75).label).toContain('Nagyon jó');
    expect(grade(55).label).toContain('Jó');
    expect(grade(20).label).toContain('Gyakorolj');
  });
});
