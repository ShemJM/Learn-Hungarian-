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
  STARTED_BOOST
} from './reels.js';

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
