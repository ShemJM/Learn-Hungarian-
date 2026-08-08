import { describe, it, expect } from 'vitest';
import {
  LESSON_MIX,
  buildCloze,
  buildLessonSession,
  buildGrammarSession,
  gradeItem,
  getExerciseSet
} from './exercises.js';
import { getLesson, lessons } from './data/lessons.js';

/** Deterministic LCG so sessions are reproducible in tests. */
function seededRng(seed = 1) {
  let s = seed;
  return () => {
    s = (s * 1664525 + 1013904223) % 4294967296;
    return s / 4294967296;
  };
}

/** The response that should always grade as correct for a given item. */
function perfectResponse(item) {
  if (item.kind === 'mcq') return item.answer;
  if (item.kind === 'order') return item.tokens.map((word, id) => ({ id, word }));
  return item.display;
}

describe('buildLessonSession', () => {
  const lesson = getLesson('greetings');

  it('is deterministic for a seeded rng', () => {
    const a = buildLessonSession(lesson, { rng: seededRng(7) });
    const b = buildLessonSession(lesson, { rng: seededRng(7) });
    expect(a).toEqual(b);
  });

  it('mixes multiple exercise kinds', () => {
    const kinds = new Set(buildLessonSession(lesson, { rng: seededRng(3) }).map((i) => i.kind));
    expect(kinds.size).toBeGreaterThanOrEqual(4);
  });

  it('caps the session at count', () => {
    expect(buildLessonSession(lesson, { count: 5, rng: seededRng(1) }).length).toBe(5);
  });

  it('degrades gracefully for a lesson without phrases', () => {
    const bare = { words: lesson.words.slice(0, 6), phrases: [] };
    const session = buildLessonSession(bare, { rng: seededRng(1) });
    expect(session.length).toBeGreaterThan(0);
    // dictation falls back to words; cloze/order need phrases and drop out
    expect(session.every((i) => i.kind !== 'cloze' && i.kind !== 'order')).toBe(true);
  });

  it('every item in every lesson self-grades as correct (catches authoring typos)', () => {
    for (const l of lessons) {
      const session = buildLessonSession(l, { rng: seededRng(42) });
      for (const item of session) {
        const { correct } = gradeItem(item, perfectResponse(item));
        expect(correct, `${l.id} ${item.kind}: ${JSON.stringify(item)}`).toBe(true);
      }
    }
  });

  it('marks production items with an srsKey and recognition items without', () => {
    const session = buildLessonSession(lesson, { rng: seededRng(9) });
    for (const item of session) {
      if (item.kind === 'type') expect(item.srsKey).toBe(item.display);
      if (item.kind === 'cloze') expect(item.srsKey).toMatch(/^p:/);
      if (item.kind === 'order' || item.kind === 'dictation') expect(item.srsKey ?? null).toBeNull();
      if (item.kind === 'mcq') {
        expect(item.srsKey).toBe(item.promptLang === 'en' ? item.hu : null);
      }
    }
  });
});

describe('buildCloze', () => {
  it('never blanks a token shorter than 3 letters', () => {
    const rng = seededRng(5);
    for (let i = 0; i < 20; i++) {
      const item = buildCloze({ hu: 'Ez egy jó nap ma.', en: 'This is a good day today.' }, rng);
      expect(item.display.length).toBeGreaterThanOrEqual(3);
    }
  });

  it('prefers not to blank the first word', () => {
    const rng = seededRng(2);
    for (let i = 0; i < 20; i++) {
      const item = buildCloze({ hu: 'Köszönöm, jól vagyok.', en: 'Thanks, I am well.' }, rng);
      expect(item.before.length).toBeGreaterThan(0);
    }
  });

  it('keeps trailing punctuation out of the accepted answer', () => {
    const item = buildCloze({ hu: 'Szia, hogy vagy?', en: 'Hi, how are you?' }, seededRng(1));
    expect(item.accepted[0]).not.toMatch(/[.,!?]/);
    expect(gradeItem(item, item.display).correct).toBe(true);
  });

  it('returns null when no token is long enough', () => {
    expect(buildCloze({ hu: 'Jó éj', en: 'Good night' }, seededRng(1))).toBeNull();
  });
});

describe('buildGrammarSession', () => {
  const guide = {
    title: 'Test guide',
    exercises: [
      { prompt: 'in the garden (kert + -ban/-ben)', answer: 'kertben', hint: 'front vowel' },
      { prompt: 'He is a teacher.', answer: ['Ő tanár', 'tanár'] }
    ]
  };

  it('turns authored exercises into typed items, accepting variants', () => {
    const session = buildGrammarSession(guide, { rng: seededRng(1) });
    expect(session.length).toBe(2);
    expect(session.every((i) => i.kind === 'type')).toBe(true);
    const variant = session.find((i) => i.accepted.length === 2);
    expect(gradeItem(variant, 'tanár').correct).toBe(true);
    expect(gradeItem(variant, 'Ő tanár').correct).toBe(true);
  });

  it('returns empty for a guide with no exercises', () => {
    expect(buildGrammarSession({ title: 'x' }, { rng: seededRng(1) })).toEqual([]);
  });
});

describe('gradeItem', () => {
  it('is accent-lenient on typed answers but reports the quality', () => {
    const item = { kind: 'type', accepted: ['Köszönöm'], display: 'Köszönöm' };
    expect(gradeItem(item, 'koszonom')).toEqual({ correct: true, quality: 'accents' });
    expect(gradeItem(item, 'Köszönöm')).toEqual({ correct: true, quality: 'exact' });
    expect(gradeItem(item, 'kérem')).toEqual({ correct: false, quality: 'wrong' });
  });

  it('grades word order by sequence, not tile identity', () => {
    const item = { kind: 'order', tokens: ['jó', 'napot', 'jó'] };
    expect(gradeItem(item, [{ id: 2, word: 'jó' }, { id: 1, word: 'napot' }, { id: 0, word: 'jó' }]).correct).toBe(
      true
    );
    expect(gradeItem(item, [{ id: 1, word: 'napot' }, { id: 0, word: 'jó' }, { id: 2, word: 'jó' }]).correct).toBe(
      false
    );
  });
});

describe('getExerciseSet', () => {
  it('resolves lesson sets', () => {
    const set = getExerciseSet('lesson:greetings');
    expect(set.title).toContain('Greetings');
    const items = set.build(seededRng(1));
    expect(items.length).toBeGreaterThan(0);
  });

  it('returns null for junk ids', () => {
    expect(getExerciseSet('lesson:nope')).toBeNull();
    expect(getExerciseSet('grammar:nope')).toBeNull();
    expect(getExerciseSet('nonsense')).toBeNull();
    expect(getExerciseSet('')).toBeNull();
    expect(getExerciseSet(null)).toBeNull();
  });
});
