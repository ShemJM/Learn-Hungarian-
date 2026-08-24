/**
 * The Citizenship Interview Workbook: the learner's *own* answers to the
 * interview questions, written in their own words and kept on their own
 * machine.
 *
 * Everything lives in localStorage under its own key, separate from
 * `progress`, because this is personal data (names, town, job, family) rather
 * than learning progress: it is never sent anywhere, and `exportWorkbook` /
 * `parseWorkbook` let the learner take a backup with them or move it to
 * another browser.
 */
import { writable } from 'svelte/store';

const KEY = 'learn-hungarian-workbook-v1';
export const WORKBOOK_VERSION = 1;

/** Answers longer than this are almost certainly a paste accident, not an interview answer. */
export const MAX_ANSWER_LENGTH = 600;

export function defaultWorkbook() {
  return {
    version: WORKBOOK_VERSION,
    answers: {}, // questionId -> { text, note, ready, updated }
    saved: []    // free-form lines kept from the sentence builders: { id, hu, en, updated }
  };
}

function blankEntry() {
  return { text: '', note: '', ready: false, updated: 0 };
}

function clean(value, limit = MAX_ANSWER_LENGTH) {
  return String(value ?? '').slice(0, limit);
}

/** An entry is worth keeping only while it still holds something the learner typed. */
function isEmptyEntry(entry) {
  return !entry.text.trim() && !entry.note.trim() && !entry.ready;
}

/**
 * Coerce anything (parsed JSON, an older shape, junk) into a valid workbook.
 * Unknown keys are dropped rather than trusted, so a hand-edited or corrupted
 * import can never leave the app with a half-broken store.
 */
export function normaliseWorkbook(raw) {
  const wb = defaultWorkbook();
  if (!raw || typeof raw !== 'object') return wb;

  const answers = raw.answers && typeof raw.answers === 'object' ? raw.answers : {};
  for (const [id, value] of Object.entries(answers)) {
    if (!value || typeof value !== 'object') continue;
    const entry = {
      text: clean(value.text),
      note: clean(value.note, 300),
      ready: value.ready === true,
      updated: Number.isFinite(value.updated) ? value.updated : 0
    };
    if (!isEmptyEntry(entry)) wb.answers[id] = entry;
  }

  if (Array.isArray(raw.saved)) {
    wb.saved = raw.saved
      .filter((s) => s && typeof s === 'object' && String(s.hu ?? '').trim())
      .map((s) => ({
        id: String(s.id ?? ''),
        hu: clean(s.hu),
        en: clean(s.en),
        updated: Number.isFinite(s.updated) ? s.updated : 0
      }));
  }
  return wb;
}

/** How much of the workbook is filled in — drives the progress bar and the "ready" count. */
export function workbookStats(wb, questionIds) {
  const written = questionIds.filter((id) => (wb.answers[id]?.text || '').trim()).length;
  const ready = questionIds.filter((id) => wb.answers[id]?.ready).length;
  const total = questionIds.length;
  return { total, written, ready, percent: total ? Math.round((written / total) * 100) : 0 };
}

/** The most recent edit anywhere in the workbook, or 0 if nothing has been written yet. */
export function lastEdited(wb) {
  const stamps = [
    ...Object.values(wb.answers).map((a) => a.updated || 0),
    ...wb.saved.map((s) => s.updated || 0)
  ];
  return stamps.length ? Math.max(...stamps) : 0;
}

/** Pretty-printed JSON for the "download a backup" button. */
export function exportWorkbook(wb) {
  return JSON.stringify({ ...wb, version: WORKBOOK_VERSION }, null, 2);
}

/** Parse a backup file. Throws with a readable message rather than returning junk. */
export function parseWorkbook(json) {
  let raw;
  try {
    raw = JSON.parse(json);
  } catch {
    throw new Error("That file isn't valid JSON — pick the .json backup this app exported.");
  }
  if (!raw || typeof raw !== 'object' || typeof raw.answers !== 'object' || raw.answers === null) {
    throw new Error("That file doesn't look like a workbook backup — it has no answers in it.");
  }
  return normaliseWorkbook(raw);
}

/** Merge an imported workbook into the current one, newest edit per question wins. */
export function mergeWorkbooks(current, incoming) {
  const merged = normaliseWorkbook(current);
  for (const [id, entry] of Object.entries(incoming.answers)) {
    const mine = merged.answers[id];
    if (!mine || (entry.updated || 0) >= (mine.updated || 0)) merged.answers[id] = { ...entry };
  }
  const byKey = new Map(merged.saved.map((s) => [`${s.hu}|${s.en}`, s]));
  for (const line of incoming.saved) {
    byKey.set(`${line.hu}|${line.en}`, line);
  }
  merged.saved = [...byKey.values()];
  return merged;
}

/**
 * A plain-text revision sheet: the questions with the learner's own answers,
 * grouped by category, for printing out or reading on a phone before the
 * interview. Questions with no answer yet are listed so the gaps are obvious.
 */
export function workbookToText(wb, categories, { title = 'My Citizenship Interview Answers' } = {}) {
  const lines = [title, '='.repeat(title.length), ''];
  for (const cat of categories) {
    lines.push(cat.title.toUpperCase(), '-'.repeat(cat.title.length), '');
    for (const q of cat.questions) {
      const entry = wb.answers[q.id];
      const text = (entry?.text || '').trim();
      lines.push(`Q: ${q.hu}`, `   (${q.en})`);
      lines.push(text ? `A: ${text}` : 'A: [not written yet]');
      if (entry?.note?.trim()) lines.push(`   note: ${entry.note.trim()}`);
      if (entry?.ready) lines.push('   ✔ ready');
      lines.push('');
    }
  }
  if (wb.saved.length) {
    lines.push('SENTENCES I BUILT', '-'.repeat(17), '');
    for (const s of wb.saved) {
      lines.push(s.hu, `   (${s.en})`, '');
    }
  }
  return lines.join('\n');
}

export function createWorkbookStore(storage = typeof localStorage !== 'undefined' ? localStorage : null) {
  function load() {
    try {
      const raw = storage?.getItem(KEY);
      return raw ? normaliseWorkbook(JSON.parse(raw)) : defaultWorkbook();
    } catch {
      return defaultWorkbook();
    }
  }

  const { subscribe, update, set } = writable(load());

  function persist(value) {
    try {
      storage?.setItem(KEY, JSON.stringify(value));
    } catch {
      /* storage may be full or unavailable (private mode) — the answer just won't persist */
    }
  }

  function mutate(fn) {
    update((wb) => {
      const next = fn(structuredClone(wb));
      persist(next);
      return next;
    });
  }

  function entryOf(wb, id) {
    if (!wb.answers[id]) wb.answers[id] = blankEntry();
    return wb.answers[id];
  }

  /** Drop the entry entirely once nothing is left in it, so stats stay honest. */
  function prune(wb, id) {
    if (wb.answers[id] && isEmptyEntry(wb.answers[id])) delete wb.answers[id];
    return wb;
  }

  return {
    subscribe,
    setAnswer: (id, text, now = Date.now()) =>
      mutate((wb) => {
        const entry = entryOf(wb, id);
        entry.text = clean(text);
        entry.updated = now;
        return prune(wb, id);
      }),
    setNote: (id, note, now = Date.now()) =>
      mutate((wb) => {
        const entry = entryOf(wb, id);
        entry.note = clean(note, 300);
        entry.updated = now;
        return prune(wb, id);
      }),
    /** Mark an answer as one the learner can say out loud without reading it. */
    toggleReady: (id, now = Date.now()) =>
      mutate((wb) => {
        const entry = entryOf(wb, id);
        entry.ready = !entry.ready;
        entry.updated = now;
        return prune(wb, id);
      }),
    clearAnswer: (id) =>
      mutate((wb) => {
        delete wb.answers[id];
        return wb;
      }),
    /** Keep a sentence built with one of the sentence builders. */
    saveLine: (id, hu, en, now = Date.now()) =>
      mutate((wb) => {
        const line = { id, hu: clean(hu), en: clean(en), updated: now };
        const at = wb.saved.findIndex((s) => s.id === id);
        if (at >= 0) wb.saved[at] = line;
        else wb.saved.push(line);
        return wb;
      }),
    removeLine: (id) =>
      mutate((wb) => {
        wb.saved = wb.saved.filter((s) => s.id !== id);
        return wb;
      }),
    /** Import a backup: merge into what is here, or replace it outright. */
    importWorkbook: (incoming, { merge = true } = {}) =>
      mutate((wb) => (merge ? mergeWorkbooks(wb, incoming) : normaliseWorkbook(incoming))),
    clearAll: () => {
      const fresh = defaultWorkbook();
      persist(fresh);
      set(fresh);
    }
  };
}

export const workbook = createWorkbookStore();
