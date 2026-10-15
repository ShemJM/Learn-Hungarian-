import { describe, it, expect } from 'vitest';
import {
  reelCatalog,
  buildReel,
  nextBatch,
  spreadTypes,
  reelType,
  TYPE_SHARE,
  REEL_STYLE,
  BATCH_SIZE,
  STARTED_BOOST,
  ORDER_MIN,
  ORDER_MAX,
  TABLE_ROWS,
  REQUEUE_MIN,
  REQUEUE_MAX,
  lessonOf,
  guideOf,
  isSavable,
  isInteractive,
  reviewKeyOf,
  requeueVariant,
  requeueOffset,
  insertAt,
  recapReel,
  goalReel,
  passesFilters,
  cardIndex,
  dueBatch
} from './reels.js';
import { tokenize } from './games/sentencebuilder.js';
import { getLesson } from './data/lessons.js';

/** Small deterministic RNG (mulberry32) so batches are reproducible. */
function seeded(seed = 1) {
  return () => {
    seed |= 0;
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

describe('reel catalog', () => {
  const cat = reelCatalog();

  it('has reels of every type', () => {
    for (const type of Object.keys(TYPE_SHARE)) expect(cat[type].length).toBeGreaterThan(0);
  });

  it('every type has a style', () => {
    for (const type of Object.keys(TYPE_SHARE)) expect(REEL_STYLE[type]).toBeTruthy();
  });

  it('every catalog key builds to a complete reel', () => {
    for (const key of Object.values(cat).flat()) {
      const reel = buildReel(key, seeded());
      expect(reel, key).toBeTruthy();
      expect(reel.key).toBe(key);
      expect(reel.type).toBe(reelType(key));
      expect(reel.source?.href, key).toMatch(/^#\//);
    }
  });

  it('keys are unique', () => {
    const all = Object.values(cat).flat();
    expect(new Set(all).size).toBe(all.length);
  });
});

describe('buildReel', () => {
  it('returns null for keys that point at nothing', () => {
    expect(buildReel('word:nope:0')).toBeNull();
    expect(buildReel('word:food:9999')).toBeNull();
    expect(buildReel('tip:cases:999')).toBeNull();
    expect(buildReel('verb:nope')).toBeNull();
    expect(buildReel('bogus:x:1')).toBeNull();
  });

  it('builds a word reel with its lesson as source', () => {
    const reel = buildReel('word:greetings:0');
    expect(reel.word.hu).toBe('Szia');
    expect(reel.source.href).toBe('#/lessons/greetings');
  });

  it('builds quiz choices that contain the answer exactly once, with no duplicates', () => {
    for (let i = 0; i < 30; i++) {
      const reel = buildReel(`quiz:food:${i % 10}`, seeded(i + 1));
      expect(reel.choices).toContain(reel.answer);
      expect(new Set(reel.choices).size).toBe(reel.choices.length);
      expect(reel.choices.length).toBe(3);
    }
  });

  it('builds a verb reel with six present-tense rows', () => {
    const reel = buildReel('verb:beszélni');
    expect(reel.rows).toHaveLength(6);
    expect(reel.rows[0]).toEqual({ pronoun: 'én', form: 'beszélek' });
  });

  it('builds a drill reel showing the display form of the answer', () => {
    const reel = buildReel('drill:alphabet:0');
    expect(reel.answer).toBe('szia');
    expect(reel.hint).toBeTruthy();
  });

  it('builds a dialogue reel with a window of lines', () => {
    const reel = buildReel('dialogue:cafe:0');
    expect(reel.lines.length).toBeGreaterThan(1);
    expect(reel.lines.length).toBeLessThanOrEqual(4);
    expect(reel.lines[0].hu).toContain('Jó napot');
  });
});

describe('spreadTypes', () => {
  it('avoids neighbours of the same type when possible', () => {
    const out = spreadTypes(['word:a:1', 'word:a:2', 'word:a:3', 'tip:b:1', 'tip:b:2', 'verb:c']);
    for (let i = 1; i < out.length; i++) expect(reelType(out[i])).not.toBe(reelType(out[i - 1]));
  });

  it('keeps every key even when a repeat is unavoidable', () => {
    const keys = ['word:a:1', 'word:a:2', 'tip:b:1'];
    expect(spreadTypes(keys).sort()).toEqual(keys.slice().sort());
  });
});

describe('nextBatch', () => {
  it('returns a full batch of distinct, buildable keys', () => {
    const keys = nextBatch({ rng: seeded(7) });
    expect(keys).toHaveLength(BATCH_SIZE);
    expect(new Set(keys).size).toBe(keys.length);
    for (const k of keys) expect(buildReel(k)).toBeTruthy();
  });

  it('never repeats keys already seen this session', () => {
    const seen = new Set();
    for (let round = 0; round < 10; round++) {
      const keys = nextBatch({ seen, rng: seeded(round + 1) });
      for (const k of keys) {
        expect(seen.has(k)).toBe(false);
        seen.add(k);
      }
    }
  });

  it('mixes reel types instead of drowning the feed in words', () => {
    const seen = new Set();
    const types = new Set();
    for (let round = 0; round < 5; round++) {
      for (const k of nextBatch({ seen, rng: seeded(round + 11) })) {
        seen.add(k);
        types.add(reelType(k));
      }
    }
    expect(types.size).toBeGreaterThanOrEqual(7);
  });

  it('leans toward lessons the learner has started', () => {
    const count = (progress) => {
      let hits = 0;
      for (let s = 1; s <= 40; s++) {
        hits += nextBatch({ progress, rng: seeded(s) }).filter((k) => k.split(':')[1] === 'food').length;
      }
      return hits;
    };
    expect(STARTED_BOOST).toBeGreaterThan(1);
    expect(count({ lessonsStarted: ['food'] })).toBeGreaterThan(count({}));
  });

  it('starts over once the whole catalog has been seen', () => {
    const all = new Set(Object.values(reelCatalog()).flat());
    expect(nextBatch({ seen: all, rng: seeded(3) })).toHaveLength(BATCH_SIZE);
  });
});

describe('new reel types', () => {
  const cat = reelCatalog();

  it('parses multi-part keys by their first two parts only', () => {
    expect(reelType('conj:enni:past:def:2')).toBe('conj');
    expect(reelType('order:dialogue/cafe:1')).toBe('order');
    expect(lessonOf('cloze:food:1')).toBe('food');
    expect(lessonOf('say:rolledr:1')).toBeNull();
    expect(lessonOf('conj:enni:past:def:2')).toBeNull();
    expect(guideOf('table:cases:2')).toBe('cases');
    expect(guideOf('word:food:1')).toBeNull();
  });

  it('builds a cloze reel whose choices contain the gap word exactly once', () => {
    for (const key of cat.cloze.slice(0, 40)) {
      const reel = buildReel(key, seeded(3));
      expect(reel.choices).toHaveLength(3);
      expect(reel.choices.filter((c) => c === reel.answer)).toHaveLength(1);
      expect(new Set(reel.choices.map((c) => c.toLowerCase())).size).toBe(3);
      expect(reel.phrase.hu).toContain(reel.answer);
    }
  });

  it('builds order reels only from sentences of a sane length, with shuffled tiles', () => {
    for (const key of cat.order) {
      const reel = buildReel(key, seeded(5));
      expect(reel.tokens.length).toBeGreaterThanOrEqual(ORDER_MIN);
      expect(reel.tokens.length).toBeLessThanOrEqual(ORDER_MAX);
      expect(reel.tiles.map((t) => t.word).sort()).toEqual(reel.tokens.slice().sort());
      expect(reel.tokens).toEqual(tokenize(reel.sentence.hu));
    }
    expect(cat.order.some((k) => k.startsWith('order:dialogue/'))).toBe(true);
    expect(cat.order.some((k) => k.startsWith('order:reading/'))).toBe(true);
  });

  it('builds a type reel that accepts the Hungarian word', () => {
    const reel = buildReel('type:greetings:0');
    expect(reel.prompt).toBe('Hi / Bye (informal)');
    expect(reel.accepted).toEqual(['Szia']);
    expect(reel.display).toBe('Szia');
  });

  it('builds say reels from lesson phrases and the rolled-R trainer', () => {
    expect(buildReel('say:greetings:0').text).toBe('Szia, hogy vagy?');
    const r = buildReel('say:rolledr:0');
    expect(r.text).toBeTruthy();
    expect(r.source.href).toBe('#/rolled-r');
  });

  it('builds letter reels with the spell-it-out phrase', () => {
    const reel = buildReel('letter:cs');
    expect(reel.entry.name).toBe('csé');
    expect(reel.phrase.hu).toMatch(/^Csé, mint/);
    expect(buildReel('letter:zz')).toBeNull();
  });

  it('builds conj reels for past/conditional/imperative cells with the answer among four choices', () => {
    expect(cat.conj.length).toBeGreaterThan(300);
    for (const key of cat.conj.filter((_, i) => i % 9 === 0)) {
      const reel = buildReel(key, seeded(2));
      expect(reel.choices).toHaveLength(4);
      expect(reel.choices.filter((c) => c === reel.answer)).toHaveLength(1);
      expect(reel.pronoun).toBeTruthy();
      expect(reel.tenseLabel).toBeTruthy();
    }
    const reel = buildReel('conj:enni:past:def:2');
    expect(reel.answer).toBe('ette');
    expect(reel.definiteness).toBe('definite');
    expect(buildReel('conj:enni:present:def:2')).toBeNull();
    expect(buildReel('conj:lenni:past:def:2')).toBeNull(); // intransitive: no definite table
    expect(buildReel('conj:enni:past:def:9')).toBeNull();
  });

  it('builds table reels only for sections that have a table, capped in rows', () => {
    expect(cat.table.length).toBeGreaterThan(10);
    for (const key of cat.table) {
      const reel = buildReel(key);
      expect(reel.headers.length).toBeGreaterThan(1);
      expect(reel.rows.length).toBeLessThanOrEqual(TABLE_ROWS);
      expect(typeof reel.truncated).toBe('boolean');
    }
    expect(buildReel('table:alphabet:0')).toBeNull(); // the first section has no table
  });

  it('builds interview reels with model answers', () => {
    const reel = buildReel('interview:personal-name');
    expect(reel.question.hu).toBe('Mi a neve?');
    expect(reel.answers.length).toBeGreaterThan(0);
    expect(reel.source.href).toBe('#/citizenship');
  });

  it('builds bite reels styled by their kind', () => {
    const reel = buildReel('bite:ff-szimpatikus');
    expect(reel.label).toBe('False friend');
    expect(reel.bite.examples[0].hu).toBeTruthy();
    expect(buildReel('bite:nope')).toBeNull();
  });
});

describe('ephemeral reels', () => {
  it('recap and goal reels have no key and cannot be saved', () => {
    const recap = recapReel([{ key: 'word:food:1', hu: 'kenyér', en: 'bread' }]);
    expect(recap.key).toBeNull();
    expect(recap.items).toHaveLength(1);
    expect(isSavable(recap)).toBe(false);
    expect(isSavable(goalReel(20))).toBe(false);
    expect(isSavable(buildReel('word:food:1'))).toBe(true);
    expect(recapReel([]).items).toEqual([]);
  });

  it('recap keeps only the most recent misses', () => {
    const misses = Array.from({ length: 10 }, (_, i) => ({ key: `word:food:${i}`, hu: String(i), en: '' }));
    expect(recapReel(misses).items.map((m) => m.hu)).toEqual(['4', '5', '6', '7', '8', '9']);
  });

  it('isInteractive marks the reels the learner answers', () => {
    expect(isInteractive(buildReel('quiz:food:1'))).toBe(true);
    expect(isInteractive(buildReel('type:food:1'))).toBe(true);
    expect(isInteractive(buildReel('word:food:1'))).toBe(false);
    expect(isInteractive(buildReel('bite:no-gender'))).toBe(false);
  });
});

describe('spaced repetition hooks', () => {
  it('reviewKeyOf maps word reels to the word and phrase reels to the p: key', () => {
    expect(reviewKeyOf(buildReel('word:food:1'))).toBe(getLesson('food').words[1].hu);
    expect(reviewKeyOf(buildReel('type:food:1'))).toBe(getLesson('food').words[1].hu);
    expect(reviewKeyOf(buildReel('phrase:food:0'))).toBe('p:' + getLesson('food').phrases[0].hu);
    expect(reviewKeyOf(buildReel('cloze:food:0'))).toBe('p:' + getLesson('food').phrases[0].hu);
    expect(reviewKeyOf(buildReel('conj:enni:past:def:2'))).toBeNull();
    expect(reviewKeyOf(buildReel('bite:no-gender'))).toBeNull();
  });

  it('requeueVariant swaps to a different exercise on the same item', () => {
    for (let i = 0; i < 20; i++) {
      const v = requeueVariant('word:food:3', seeded(i + 1));
      expect(['quiz:food:3', 'type:food:3']).toContain(v);
      expect(requeueVariant('quiz:food:3', seeded(i + 1))).toBe('type:food:3');
      expect(requeueVariant('type:food:3', seeded(i + 1))).toBe('quiz:food:3');
    }
    expect(requeueVariant('cloze:food:0')).toBe('phrase:food:0');
    expect(requeueVariant('phrase:food:0')).toBe('cloze:food:0');
    expect(requeueVariant('conj:enni:past:def:2')).toBe('conj:enni:past:def:2');
    expect(requeueVariant('tip:cases:1')).toBeNull();
    expect(requeueVariant('bite:no-gender')).toBeNull();
  });

  it('requeueOffset stays within range', () => {
    for (let i = 0; i < 200; i++) {
      const o = requeueOffset(seeded(i + 1));
      expect(o).toBeGreaterThanOrEqual(REQUEUE_MIN);
      expect(o).toBeLessThanOrEqual(REQUEUE_MAX);
    }
  });

  it('insertAt clamps and does not mutate', () => {
    const list = [1, 2, 3];
    expect(insertAt(list, 9, 1)).toEqual([1, 9, 2, 3]);
    expect(insertAt(list, 9, 99)).toEqual([1, 2, 3, 9]);
    expect(insertAt(list, 9, -5)).toEqual([9, 1, 2, 3]);
    expect(list).toEqual([1, 2, 3]);
  });

  it('cardIndex maps every word and phrase back to its lesson slot', () => {
    const index = cardIndex();
    expect(index.get('kenyér')).toEqual({ lessonId: 'food', idx: expect.any(Number), isPhrase: false });
    expect(index.get('p:' + getLesson('food').phrases[0].hu)).toMatchObject({ lessonId: 'food', idx: 0, isPhrase: true });
  });

  it('dueBatch turns due and weak cards into recall reels, never repeating a card', () => {
    const food = getLesson('food');
    const pool = [
      ...food.words.map((w) => ({ ...w, key: w.hu })),
      ...food.phrases.map((p) => ({ ...p, key: 'p:' + p.hu, isPhrase: true }))
    ];
    const today = 1000;
    const srsState = {
      [food.words[0].hu]: { box: 1, last: today - 1, reps: 3, lapses: 3 }, // due and weak
      [food.words[1].hu]: { box: 5, last: today, reps: 1, lapses: 0 }, // not due
      [food.words[2].hu]: { box: 2, last: today - 5, reps: 2, lapses: 0 }, // due
      ['p:' + food.phrases[0].hu]: { box: 1, last: today - 1, reps: 2, lapses: 2 } // due phrase
    };
    const keys = dueBatch({ pool, srsState, today, rng: seeded(4) });
    expect(keys.length).toBe(3);
    const reels = keys.map((k) => buildReel(k, seeded(1)));
    const hus = reels.map((r) => reviewKeyOf(r));
    expect(new Set(hus).size).toBe(3);
    expect(hus).toContain(food.words[0].hu);
    expect(hus).toContain(food.words[2].hu);
    expect(hus).toContain('p:' + food.phrases[0].hu);
    expect(hus).not.toContain(food.words[1].hu);
    for (const r of reels) expect(['quiz', 'type', 'cloze', 'phrase']).toContain(r.type);
  });

  it('dueBatch is empty when nothing has been reviewed yet', () => {
    const food = getLesson('food');
    const pool = food.words.map((w) => ({ ...w, key: w.hu }));
    expect(dueBatch({ pool, srsState: {}, today: 10, rng: seeded(1) })).toEqual([]);
  });
});

describe('filters', () => {
  it('passesFilters honours type and source lists, letting unbound keys through', () => {
    expect(passesFilters('word:food:1', null)).toBe(true);
    expect(passesFilters('word:food:1', { types: ['word'], sources: null })).toBe(true);
    expect(passesFilters('word:food:1', { types: ['quiz'], sources: null })).toBe(false);
    expect(passesFilters('word:food:1', { types: null, sources: ['greetings'] })).toBe(false);
    expect(passesFilters('tip:cases:1', { types: null, sources: ['cases'] })).toBe(true);
    expect(passesFilters('verb:enni', { types: null, sources: ['greetings'] })).toBe(true);
    expect(passesFilters('bite:no-gender', { types: null, sources: ['greetings'] })).toBe(true);
  });

  it('nextBatch respects filters', () => {
    const keys = nextBatch({ rng: seeded(2), filters: { types: ['word', 'bite'], sources: ['food'] } });
    expect(keys.length).toBe(BATCH_SIZE);
    for (const k of keys) {
      expect(['word', 'bite']).toContain(reelType(k));
      if (reelType(k) === 'word') expect(lessonOf(k)).toBe('food');
    }
  });

  it('nextBatch returns an empty batch when nothing matches', () => {
    expect(nextBatch({ rng: seeded(2), filters: { types: [], sources: null } })).toEqual([]);
  });

  it('nextBatch copes with a filtered catalog smaller than a batch', () => {
    const keys = nextBatch({ rng: seeded(2), filters: { types: ['verb'], sources: null } });
    expect(keys.length).toBe(20);
    expect(new Set(keys).size).toBe(20);
  });
});
