import { describe, it, expect } from 'vitest';
import { verbs, PRONOUNS, getVerb, dictionaryForm } from './data/verbs.js';
import { cellAnswers, drillableCells, buildDrill } from './verbdrill.js';

// A cheap deterministic rng.
function seededRng(seed = 42) {
  let s = seed;
  return () => {
    s = (s * 1664525 + 1013904223) % 4294967296;
    return s / 4294967296;
  };
}

describe('verbs data helpers', () => {
  it('getVerb finds by infinitive and returns null otherwise', () => {
    expect(getVerb('tanulni')?.en).toBe('to learn');
    expect(getVerb('nope')).toBeNull();
  });

  it('dictionaryForm returns the 3sg indefinite display form', () => {
    expect(dictionaryForm(getVerb('tanulni'))).toBe('tanul');
    expect(dictionaryForm(getVerb('enni'))).toBe('eszik');
  });
});

describe('cellAnswers', () => {
  it('wraps a plain string cell in an array', () => {
    expect(cellAnswers(getVerb('tanulni'), 'indefinite', 0)).toEqual(['tanulok']);
  });

  it('returns all accepted variants for -ik first person', () => {
    expect(cellAnswers(getVerb('enni'), 'indefinite', 0)).toEqual(['eszem', 'eszek']);
  });

  it('reads past-tense cells when asked', () => {
    expect(cellAnswers(getVerb('tanulni'), 'indefinite', 0, 'past')).toEqual(['tanultam']);
    expect(cellAnswers(getVerb('enni'), 'indefinite', 2, 'past')).toEqual(['evett']);
    expect(cellAnswers(getVerb('inni'), 'definite', 2, 'past')).toEqual(['itta']);
    expect(cellAnswers(getVerb('lenni'), 'indefinite', 0, 'past')).toEqual(['voltam']);
  });
});

describe('drillableCells', () => {
  it('skips definite cells for intransitive verbs', () => {
    const cells = drillableCells([getVerb('menni')]);
    expect(cells.length).toBe(PRONOUNS.length);
    expect(cells.every((c) => c.definiteness === 'indefinite')).toBe(true);
  });

  it('yields 12 cells for a transitive verb', () => {
    expect(drillableCells([getVerb('tanulni')]).length).toBe(12);
  });

  it('doubles the cells when both tenses are requested', () => {
    const cells = drillableCells([getVerb('tanulni')], { tenses: ['present', 'past'] });
    expect(cells.length).toBe(24);
    expect(cells.filter((c) => c.tense === 'past').length).toBe(12);
  });

  it('past-only cells skip definite tables for intransitives', () => {
    const cells = drillableCells([getVerb('menni')], { tenses: ['past'] });
    expect(cells.length).toBe(PRONOUNS.length);
    expect(cells.every((c) => c.tense === 'past' && c.definiteness === 'indefinite')).toBe(true);
  });
});

describe('buildDrill', () => {
  it('builds the requested number of questions with answers and pronouns', () => {
    const drill = buildDrill(verbs, { count: 10, rng: seededRng() });
    expect(drill.length).toBe(10);
    for (const q of drill) {
      expect(Array.isArray(q.answers)).toBe(true);
      expect(q.answers.length).toBeGreaterThan(0);
      expect(q.display).toBe(q.answers[0]);
      expect(PRONOUNS).toContain(q.pronoun);
      expect(['indefinite', 'definite']).toContain(q.definiteness);
    }
  });

  it('choices mode includes exactly one correct option and no duplicates', () => {
    const drill = buildDrill(verbs, { count: 20, mode: 'choices', rng: seededRng(7) });
    for (const q of drill) {
      expect(q.choices.length).toBeGreaterThanOrEqual(2);
      expect(new Set(q.choices).size).toBe(q.choices.length);
      const correct = q.choices.filter((c) => q.answers.includes(c));
      expect(correct, `${q.dictionary} ${q.pronoun} ${q.definiteness}`).toEqual([q.display]);
    }
  });

  it('builds past-tense questions when asked', () => {
    const drill = buildDrill(verbs, { count: 15, tenses: ['past'], rng: seededRng(3) });
    for (const q of drill) {
      expect(q.tense).toBe('past');
      expect(q.answers.length).toBeGreaterThan(0);
    }
  });

  it('is deterministic for a fixed rng', () => {
    const a = buildDrill(verbs, { count: 5, rng: seededRng(1) });
    const b = buildDrill(verbs, { count: 5, rng: seededRng(1) });
    expect(a.map((q) => q.display)).toEqual(b.map((q) => q.display));
  });
});
