import { describe, it, expect, beforeEach } from 'vitest';
import { createProgressStore, defaultProgress } from './progress.js';
import { get } from 'svelte/store';

function memoryStorage() {
  const map = new Map();
  return {
    getItem: (k) => (map.has(k) ? map.get(k) : null),
    setItem: (k, v) => map.set(k, String(v)),
    removeItem: (k) => map.delete(k)
  };
}

describe('progress store', () => {
  let storage;
  let store;

  beforeEach(() => {
    storage = memoryStorage();
    store = createProgressStore(storage);
  });

  it('starts with default progress', () => {
    expect(get(store)).toEqual(defaultProgress());
  });

  it('records the best quiz score per lesson', () => {
    store.recordQuiz('food', 60);
    store.recordQuiz('food', 90);
    store.recordQuiz('food', 70); // lower than best — ignored
    expect(get(store).quizScores.food).toBe(90);
  });

  it('toggles known words', () => {
    store.toggleKnownWord('kenyér');
    expect(get(store).knownWords).toContain('kenyér');
    store.toggleKnownWord('kenyér');
    expect(get(store).knownWords).not.toContain('kenyér');
  });

  it('keeps best game scores', () => {
    store.recordGame('matching', 500);
    store.recordGame('matching', 300);
    expect(get(store).gameBest.matching).toBe(500);
  });

  it('marks readings and dialogues done exactly once', () => {
    store.markReadingDone('anna');
    store.markReadingDone('anna');
    store.markDialogueDone('cafe');
    expect(get(store).readingsDone).toEqual(['anna']);
    expect(get(store).dialoguesDone).toEqual(['cafe']);
  });

  it('records best pronunciation scores', () => {
    store.recordPronunciation('szia', 0.5);
    store.recordPronunciation('szia', 0.9);
    store.recordPronunciation('szia', 0.7);
    expect(get(store).pronunciationStars['szia']).toBe(0.9);
  });

  it('tracks spaced-repetition reviews per word', () => {
    const day1 = Date.UTC(2026, 0, 15, 12, 0, 0);
    store.recordReview('alma', true, day1);
    const first = get(store).srs.alma;
    expect(first.box).toBe(2);
    store.recordReview('alma', true, day1 + 86400000);
    expect(get(store).srs.alma.box).toBe(3);
    store.recordReview('alma', false, day1 + 2 * 86400000);
    expect(get(store).srs.alma.box).toBe(1);
    expect(get(store).srs.alma.last).toBe(first.last + 2);
  });

  it('persists srs state to storage', () => {
    store.recordReview('sör', true, Date.UTC(2026, 0, 15, 12, 0, 0));
    const reloaded = createProgressStore(storage);
    expect(get(reloaded).srs['sör'].box).toBe(2);
  });

  it('persists to storage and reloads', () => {
    store.recordQuiz('numbers', 80);
    const reloaded = createProgressStore(storage);
    expect(get(reloaded).quizScores.numbers).toBe(80);
  });

  it('survives corrupted storage', () => {
    storage.setItem('learn-hungarian-progress-v1', '{not json');
    const fresh = createProgressStore(storage);
    expect(get(fresh)).toEqual(defaultProgress());
  });

  it('reset returns to defaults', () => {
    store.recordQuiz('food', 100);
    store.reset();
    expect(get(store)).toEqual(defaultProgress());
  });

  it('works without storage (private mode)', () => {
    const noStore = createProgressStore(null);
    noStore.recordQuiz('food', 50);
    expect(get(noStore).quizScores.food).toBe(50);
  });
});
