import { describe, it, expect, beforeEach } from 'vitest';
import { get } from 'svelte/store';
import {
  createWorkbookStore,
  defaultWorkbook,
  normaliseWorkbook,
  workbookStats,
  lastEdited,
  exportWorkbook,
  parseWorkbook,
  mergeWorkbooks,
  workbookToText,
  MAX_ANSWER_LENGTH
} from './workbook.js';
import { interviewCategories, allInterviewQuestions } from './data/citizenship.js';

function memoryStorage() {
  const map = new Map();
  return {
    getItem: (k) => (map.has(k) ? map.get(k) : null),
    setItem: (k, v) => map.set(k, String(v)),
    removeItem: (k) => map.delete(k),
    dump: () => map
  };
}

describe('workbook store', () => {
  let storage;
  let store;

  beforeEach(() => {
    storage = memoryStorage();
    store = createWorkbookStore(storage);
  });

  it('starts empty', () => {
    expect(get(store)).toEqual(defaultWorkbook());
  });

  it('saves an answer and persists it to storage', () => {
    store.setAnswer('personal-name', 'A nevem Shem.', 1000);
    expect(get(store).answers['personal-name']).toEqual({
      text: 'A nevem Shem.',
      note: '',
      ready: false,
      updated: 1000
    });
    const reloaded = createWorkbookStore(storage);
    expect(get(reloaded).answers['personal-name'].text).toBe('A nevem Shem.');
  });

  it('survives a storage round-trip through a second store instance', () => {
    store.setAnswer('work-what', 'Tanárként dolgozom.');
    store.toggleReady('work-what');
    store.setNote('work-what', 'stress the first syllable');
    const reloaded = get(createWorkbookStore(storage));
    expect(reloaded.answers['work-what'].ready).toBe(true);
    expect(reloaded.answers['work-what'].note).toBe('stress the first syllable');
  });

  it('drops an entry once the learner empties it again', () => {
    store.setAnswer('personal-age', 'Negyven éves vagyok.');
    store.setAnswer('personal-age', '   ');
    expect(get(store).answers['personal-age']).toBeUndefined();
  });

  it('keeps an emptied answer while a note or ready flag is still on it', () => {
    store.setAnswer('personal-age', 'x');
    store.setNote('personal-age', 'ask the teacher');
    store.setAnswer('personal-age', '');
    expect(get(store).answers['personal-age'].note).toBe('ask the teacher');
  });

  it('toggles ready on and off', () => {
    store.toggleReady('family-children');
    expect(get(store).answers['family-children'].ready).toBe(true);
    store.toggleReady('family-children');
    expect(get(store).answers['family-children']).toBeUndefined(); // nothing left to keep
  });

  it('clears one answer and the whole workbook', () => {
    store.setAnswer('a', 'egy');
    store.setAnswer('b', 'kettő');
    store.clearAnswer('a');
    expect(get(store).answers.a).toBeUndefined();
    expect(get(store).answers.b).toBeDefined();
    store.clearAll();
    expect(get(store)).toEqual(defaultWorkbook());
    expect(get(createWorkbookStore(storage))).toEqual(defaultWorkbook());
  });

  it('caps very long answers instead of storing a whole pasted document', () => {
    store.setAnswer('personal-name', 'a'.repeat(MAX_ANSWER_LENGTH + 500));
    expect(get(store).answers['personal-name'].text.length).toBe(MAX_ANSWER_LENGTH);
  });

  it('saves and replaces built sentences by id', () => {
    store.saveLine('builder-job', 'Tanárként dolgozom.', 'I work as a teacher.');
    store.saveLine('builder-job', 'Orvosként dolgozom.', 'I work as a doctor.');
    expect(get(store).saved).toHaveLength(1);
    expect(get(store).saved[0].hu).toBe('Orvosként dolgozom.');
    store.removeLine('builder-job');
    expect(get(store).saved).toHaveLength(0);
  });

  it('keeps working when storage throws (private browsing)', () => {
    const hostile = {
      getItem: () => null,
      setItem: () => {
        throw new Error('QuotaExceededError');
      }
    };
    const s = createWorkbookStore(hostile);
    expect(() => s.setAnswer('personal-name', 'A nevem Anna.')).not.toThrow();
    expect(get(s).answers['personal-name'].text).toBe('A nevem Anna.');
  });

  it('falls back to an empty workbook when stored JSON is corrupt', () => {
    storage.setItem('learn-hungarian-workbook-v1', '{not json');
    expect(get(createWorkbookStore(storage))).toEqual(defaultWorkbook());
  });
});

describe('normaliseWorkbook', () => {
  it('drops junk entries and unknown fields', () => {
    const wb = normaliseWorkbook({
      answers: {
        good: { text: 'Jó', note: 5, ready: 'yes', updated: 12, evil: 'x' },
        blank: { text: '  ', note: '', ready: false },
        broken: null
      },
      saved: [{ hu: 'Szia', en: 'Hi' }, { en: 'no hungarian' }, 'nope'],
      extra: 'ignored'
    });
    expect(Object.keys(wb.answers)).toEqual(['good']);
    expect(wb.answers.good).toEqual({ text: 'Jó', note: '5', ready: false, updated: 12 });
    expect(wb.saved).toEqual([{ id: '', hu: 'Szia', en: 'Hi', updated: 0 }]);
    expect(wb.extra).toBeUndefined();
  });

  it('returns a default workbook for anything that is not an object', () => {
    expect(normaliseWorkbook(null)).toEqual(defaultWorkbook());
    expect(normaliseWorkbook('nope')).toEqual(defaultWorkbook());
  });
});

describe('workbookStats', () => {
  const ids = ['a', 'b', 'c', 'd'];

  it('counts written and ready answers over the real question list', () => {
    const wb = normaliseWorkbook({
      answers: {
        a: { text: 'egy', ready: true },
        b: { text: 'kettő' },
        c: { text: '   ', ready: true },
        z: { text: 'not in the list' }
      }
    });
    expect(workbookStats(wb, ids)).toEqual({ total: 4, written: 2, ready: 2, percent: 50 });
  });

  it('handles an empty question list without dividing by zero', () => {
    expect(workbookStats(defaultWorkbook(), []).percent).toBe(0);
  });
});

describe('backup export and import', () => {
  it('round-trips a workbook through JSON', () => {
    const wb = normaliseWorkbook({
      answers: { 'personal-name': { text: 'A nevem Anna.', ready: true, updated: 7 } },
      saved: [{ id: 'builder-job', hu: 'Tanár vagyok.', en: 'I am a teacher.', updated: 7 }]
    });
    expect(parseWorkbook(exportWorkbook(wb))).toEqual(wb);
  });

  it('rejects files that are not workbook backups', () => {
    expect(() => parseWorkbook('nonsense')).toThrow(/valid JSON/);
    expect(() => parseWorkbook('{"hello":"world"}')).toThrow(/workbook backup/);
  });

  it('merges a backup in, newest edit per question winning', () => {
    const mine = normaliseWorkbook({
      answers: {
        keep: { text: 'newer here', updated: 200 },
        old: { text: 'older here', updated: 100 }
      },
      saved: [{ id: 'builder-job', hu: 'Tanár vagyok.', en: 'I am a teacher.', updated: 1 }]
    });
    const backup = normaliseWorkbook({
      answers: {
        keep: { text: 'older there', updated: 150 },
        old: { text: 'newer there', updated: 300 },
        fresh: { text: 'only in backup', updated: 50 }
      },
      saved: [{ id: 'builder-residence', hu: 'Budapesten élek.', en: 'I live in Budapest.', updated: 2 }]
    });
    const merged = mergeWorkbooks(mine, backup);
    expect(merged.answers.keep.text).toBe('newer here');
    expect(merged.answers.old.text).toBe('newer there');
    expect(merged.answers.fresh.text).toBe('only in backup');
    expect(merged.saved).toHaveLength(2);
  });

  it('replaces instead of merging when asked', () => {
    const store = createWorkbookStore(memoryStorage());
    store.setAnswer('personal-name', 'mine', 500);
    store.importWorkbook(normaliseWorkbook({ answers: { other: { text: 'theirs', updated: 1 } } }), {
      merge: false
    });
    expect(get(store).answers['personal-name']).toBeUndefined();
    expect(get(store).answers.other.text).toBe('theirs');
  });

  it('reports the most recent edit', () => {
    const wb = normaliseWorkbook({
      answers: { a: { text: 'x', updated: 10 }, b: { text: 'y', updated: 90 } },
      saved: [{ id: 's', hu: 'z', en: 'z', updated: 40 }]
    });
    expect(lastEdited(wb)).toBe(90);
    expect(lastEdited(defaultWorkbook())).toBe(0);
  });
});

describe('workbookToText', () => {
  it('lays out every question with the learner answer, flagging the gaps', () => {
    const wb = normaliseWorkbook({
      answers: { 'personal-name': { text: 'A nevem Anna.', note: 'slow down', ready: true, updated: 1 } },
      saved: [{ id: 'builder-job', hu: 'Tanár vagyok.', en: 'I am a teacher.', updated: 1 }]
    });
    const text = workbookToText(wb, interviewCategories);
    expect(text).toContain('Mi a neve?');
    expect(text).toContain('A: A nevem Anna.');
    expect(text).toContain('note: slow down');
    expect(text).toContain('✔ ready');
    expect(text).toContain('A: [not written yet]');
    expect(text).toContain('SENTENCES I BUILT');
    expect(text).toContain('Tanár vagyok.');
  });

  it('covers every interview question in the sheet', () => {
    const text = workbookToText(defaultWorkbook(), interviewCategories);
    for (const q of allInterviewQuestions()) {
      expect(text, q.id).toContain(q.hu);
    }
  });
});
