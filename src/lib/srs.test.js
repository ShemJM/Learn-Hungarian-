import { describe, it, expect } from 'vitest';
import {
  BOX_COUNT,
  INTERVALS,
  dayStamp,
  isDue,
  dueWords,
  applyReview,
  buildSession,
  srsKey,
  weakCards
} from './srs.js';

const words = [
  { hu: 'alma', en: 'apple' },
  { hu: 'kenyér', en: 'bread' },
  { hu: 'sör', en: 'beer' },
  { hu: 'víz', en: 'water' }
];

describe('dayStamp', () => {
  it('increments by one per 24 hours', () => {
    const noon = Date.UTC(2026, 0, 15, 12, 0, 0);
    expect(dayStamp(noon + 86400000)).toBe(dayStamp(noon) + 1);
  });

  it('is stable within the same day', () => {
    const noon = Date.UTC(2026, 0, 15, 12, 0, 0);
    expect(dayStamp(noon + 60000)).toBe(dayStamp(noon));
  });
});

describe('isDue', () => {
  it('treats unseen words (no entry) as due', () => {
    expect(isDue(undefined, 100)).toBe(true);
  });

  it('box 1 (interval 0) is due the same day', () => {
    expect(isDue({ box: 1, last: 100 }, 100)).toBe(true);
  });

  it('box 2 is due exactly one day later, not before', () => {
    expect(isDue({ box: 2, last: 100 }, 100)).toBe(false);
    expect(isDue({ box: 2, last: 100 }, 101)).toBe(true);
  });

  it('box 5 waits the longest interval', () => {
    const entry = { box: BOX_COUNT, last: 100 };
    expect(isDue(entry, 100 + INTERVALS[BOX_COUNT - 1] - 1)).toBe(false);
    expect(isDue(entry, 100 + INTERVALS[BOX_COUNT - 1])).toBe(true);
  });
});

describe('applyReview', () => {
  it('promotes a correct answer one box and stamps today', () => {
    expect(applyReview({ box: 2, last: 90 }, true, 100)).toEqual({ box: 3, last: 100, reps: 1, lapses: 0 });
  });

  it('starts new words in box 1 on a miss and box 2 on a hit', () => {
    expect(applyReview(undefined, false, 100)).toEqual({ box: 1, last: 100, reps: 1, lapses: 1 });
    expect(applyReview(undefined, true, 100)).toEqual({ box: 2, last: 100, reps: 1, lapses: 0 });
  });

  it('caps at the top box', () => {
    expect(applyReview({ box: BOX_COUNT, last: 90 }, true, 100).box).toBe(BOX_COUNT);
  });

  it('demotes to box 1 on a miss', () => {
    expect(applyReview({ box: 4, last: 90 }, false, 100)).toEqual({ box: 1, last: 100, reps: 1, lapses: 1 });
  });

  it('accumulates reps and lapses across reviews, starting from legacy entries', () => {
    let entry = { box: 3, last: 90 }; // saved before the counters existed
    entry = applyReview(entry, false, 100);
    expect(entry).toEqual({ box: 1, last: 100, reps: 1, lapses: 1 });
    entry = applyReview(entry, true, 101);
    entry = applyReview(entry, false, 102);
    expect(entry.reps).toBe(3);
    expect(entry.lapses).toBe(2);
  });
});

describe('dueWords', () => {
  it('mixes new words with due seen words and skips not-yet-due ones', () => {
    const state = {
      alma: { box: 2, last: 99 }, // due (1 day passed)
      kenyér: { box: 3, last: 99 } // not due (needs 2 days)
    };
    expect(dueWords(words, state, 100).map((w) => w.hu)).toEqual(['alma', 'sör', 'víz']);
  });
});

describe('buildSession', () => {
  const identityRng = () => 0; // shuffle with rng()=0 keeps rotating deterministically

  it('caps unseen words at maxNew', () => {
    const session = buildSession(words, {}, 100, { maxNew: 2, rng: identityRng });
    expect(session.length).toBe(2);
  });

  it('includes due seen words before applying maxCards', () => {
    const state = { alma: { box: 1, last: 100 } };
    const session = buildSession(words, state, 100, { maxNew: 1, rng: identityRng });
    expect(session.map((w) => w.hu)).toContain('alma');
    expect(session.length).toBe(2); // alma + 1 new
  });

  it('caps the whole session at maxCards', () => {
    const session = buildSession(words, {}, 100, { maxCards: 3, maxNew: 10, rng: identityRng });
    expect(session.length).toBe(3);
  });

  it('returns empty when nothing is due', () => {
    const state = Object.fromEntries(words.map((w) => [w.hu, { box: 5, last: 100 }]));
    expect(buildSession(words, state, 101, { rng: identityRng })).toEqual([]);
  });

  it('caps unseen phrase cards at maxNewPhrases, independent of maxNew', () => {
    const phrases = [
      { key: 'p:Jó napot!', hu: 'Jó napot!', en: 'Good day!', isPhrase: true },
      { key: 'p:Szia!', hu: 'Szia!', en: 'Hi!', isPhrase: true },
      { key: 'p:Nem értem.', hu: 'Nem értem.', en: "I don't understand.", isPhrase: true }
    ];
    const session = buildSession([...words, ...phrases], {}, 100, {
      maxNew: 10,
      maxNewPhrases: 1,
      rng: identityRng
    });
    expect(session.filter((c) => c.isPhrase).length).toBe(1);
    expect(session.filter((c) => !c.isPhrase).length).toBe(words.length);
  });

  it('already-seen phrases count as seen, not against maxNewPhrases', () => {
    const phrases = [
      { key: 'p:Jó napot!', hu: 'Jó napot!', en: 'Good day!', isPhrase: true },
      { key: 'p:Szia!', hu: 'Szia!', en: 'Hi!', isPhrase: true }
    ];
    const state = { 'p:Jó napot!': { box: 1, last: 100 } };
    const session = buildSession(phrases, state, 100, { maxNewPhrases: 0, rng: identityRng });
    expect(session.map((c) => c.key)).toEqual(['p:Jó napot!']);
  });
});

describe('weakCards', () => {
  const pool = [
    { hu: 'alma', en: 'apple' },
    { hu: 'kenyér', en: 'bread' },
    { hu: 'sör', en: 'beer' },
    { key: 'p:Jó napot!', hu: 'Jó napot!', en: 'Good day!', isPhrase: true }
  ];

  it('ranks by lapses desc, then box asc, then longest-unseen', () => {
    const state = {
      alma: { box: 2, last: 100, reps: 5, lapses: 2 },
      kenyér: { box: 1, last: 100, reps: 8, lapses: 4 },
      sör: { box: 1, last: 90, reps: 6, lapses: 2 }, // same lapses as alma, lower box → harder
      'p:Jó napot!': { box: 3, last: 100, reps: 9, lapses: 4 } // same lapses as kenyér, higher box
    };
    expect(weakCards(pool, state).map(srsKey)).toEqual(['kenyér', 'p:Jó napot!', 'sör', 'alma']);
  });

  it('excludes cards below minLapses, never-missed cards, unseen cards and legacy entries', () => {
    const state = {
      alma: { box: 2, last: 100, reps: 4, lapses: 1 }, // below threshold
      kenyér: { box: 5, last: 100, reps: 4, lapses: 0 }, // never missed
      sör: { box: 3, last: 100 } // legacy entry, no counters
      // 'p:Jó napot!' unseen
    };
    expect(weakCards(pool, state)).toEqual([]);
  });

  it('respects the limit', () => {
    const state = Object.fromEntries(pool.map((c) => [srsKey(c), { box: 1, last: 100, reps: 5, lapses: 3 }]));
    expect(weakCards(pool, state, { limit: 2 }).length).toBe(2);
  });

  it('returns empty for an empty pool', () => {
    expect(weakCards([], {})).toEqual([]);
  });
});

describe('srsKey', () => {
  it('uses the raw hu string for words (legacy-compatible)', () => {
    expect(srsKey({ hu: 'alma', en: 'apple' })).toBe('alma');
  });

  it('prefers an explicit key for phrase cards', () => {
    expect(srsKey({ key: 'p:alma', hu: 'alma', isPhrase: true })).toBe('p:alma');
  });

  it('keeps a word and a phrase with identical hu in independent boxes', () => {
    const word = { hu: 'Szia' };
    const phrase = { key: 'p:Szia', hu: 'Szia', isPhrase: true };
    let state = {};
    state[srsKey(word)] = applyReview(state[srsKey(word)], true, 100); // word promoted
    state[srsKey(phrase)] = applyReview(state[srsKey(phrase)], false, 100); // phrase missed
    expect(state['Szia'].box).toBe(2);
    expect(state['p:Szia'].box).toBe(1);
    expect(dueWords([word, phrase], state, 100).map(srsKey)).toEqual(['p:Szia']);
  });
});
