/**
 * Pure logic for the Reels feed: an endless, TikTok-style vertical stream of
 * one-screen Hungarian micro-lessons cut from the existing course content.
 *
 * Every reel is addressed by a stable string key ('word:food:3',
 * 'tip:cases:1', 'verb:enni', ...). The feed is just a list of keys; a reel's
 * content is rebuilt from its key on demand. That keeps saved ("liked") reels
 * tiny in localStorage and lets a liked reel survive content edits that do
 * not touch it — a key whose content disappeared simply builds to null.
 */
import { lessons, getLesson, allWords } from './data/lessons.js';
import { grammarGuides, getGuide } from './data/grammar.js';
import { verbs, getVerb, PRONOUNS } from './data/verbs.js';
import { dialogues, getDialogue } from './data/dialogues.js';
import { readings, getReading } from './data/readings.js';
import { shuffle, sample, weightedSample } from './text.js';

/** How many dialogue lines one dialogue reel shows. */
export const DIALOGUE_WINDOW = 4;

/** Reels drawn per feed batch; the page asks for another batch near the end. */
export const BATCH_SIZE = 20;

/**
 * Rough share of the feed each reel type should get, independent of how many
 * reels of that type exist (there are ~300 words but only 20 verbs). Words
 * and quick checks dominate — that is the "doom scroll" rhythm — with grammar
 * and context reels sprinkled through.
 */
export const TYPE_SHARE = {
  word: 0.2,
  quiz: 0.16,
  listen: 0.1,
  phrase: 0.12,
  tip: 0.12,
  drill: 0.1,
  verb: 0.06,
  dialogue: 0.07,
  reading: 0.07
};

/** Words and phrases of lessons the learner has opened come up this many times more often. */
export const STARTED_BOOST = 3;

/** A reel type's display label, emoji and background theme. */
export const REEL_STYLE = {
  word: { label: 'New word', emoji: '✨', theme: 'red' },
  phrase: { label: 'Useful phrase', emoji: '💬', theme: 'green' },
  quiz: { label: 'Quick check', emoji: '⚡', theme: 'ink' },
  listen: { label: 'Listen up', emoji: '👂', theme: 'plum' },
  tip: { label: 'Grammar bite', emoji: '🧩', theme: 'teal' },
  drill: { label: 'Can you say it?', emoji: '🧠', theme: 'amber' },
  verb: { label: 'Verb of the moment', emoji: '⚙️', theme: 'navy' },
  dialogue: { label: 'Overheard', emoji: '🎭', theme: 'green' },
  reading: { label: 'Read it', emoji: '📖', theme: 'red' }
};

/** The type part of a reel key. */
export function reelType(key) {
  return String(key).split(':')[0];
}

/** Every reel key the content supports, grouped by type. */
export function reelCatalog() {
  const cat = Object.fromEntries(Object.keys(TYPE_SHARE).map((t) => [t, []]));
  for (const l of lessons) {
    l.words.forEach((_, i) => {
      cat.word.push(`word:${l.id}:${i}`);
      cat.quiz.push(`quiz:${l.id}:${i}`);
      cat.listen.push(`listen:${l.id}:${i}`);
    });
    (l.phrases || []).forEach((_, i) => cat.phrase.push(`phrase:${l.id}:${i}`));
  }
  for (const g of grammarGuides) {
    g.sections.forEach((_, i) => cat.tip.push(`tip:${g.id}:${i}`));
    (g.exercises || []).forEach((_, i) => cat.drill.push(`drill:${g.id}:${i}`));
  }
  for (const v of verbs) cat.verb.push(`verb:${v.inf}`);
  for (const d of dialogues) {
    for (let i = 0; i < d.lines.length; i += DIALOGUE_WINDOW) cat.dialogue.push(`dialogue:${d.id}:${i}`);
  }
  for (const r of readings) r.text.forEach((_, i) => cat.reading.push(`reading:${r.id}:${i}`));
  return cat;
}

/** The lesson a key belongs to, for lesson-bound reel types (else null). */
function lessonOf(key) {
  const [type, ref] = key.split(':');
  return ['word', 'quiz', 'listen', 'phrase'].includes(type) ? ref : null;
}

/** A cell may be a string or an array of accepted variants; show the first. */
function display(cell) {
  return Array.isArray(cell) ? cell[0] : cell;
}

/** Multiple-choice options for a word: its English plus distractors from the whole course. */
function choicesFor(word, rng, count = 3) {
  const others = allWords().filter((w) => w.en !== word.en);
  return shuffle([word.en, ...sample(others, count - 1, rng).map((w) => w.en)], rng);
}

/**
 * Build a reel's content from its key, or null if the key no longer points
 * at anything. Quiz-type reels shuffle their choices with `rng`.
 */
export function buildReel(key, rng = Math.random) {
  const [type, ref, rawIdx] = String(key).split(':');
  const idx = Number(rawIdx);
  const base = { key, type, ...REEL_STYLE[type] };

  switch (type) {
    case 'word':
    case 'quiz':
    case 'listen': {
      const lesson = getLesson(ref);
      const word = lesson?.words[idx];
      if (!word) return null;
      const source = { title: lesson.title, icon: lesson.icon, href: '#/lessons/' + lesson.id };
      if (type === 'word') return { ...base, word, source };
      return { ...base, word, source, answer: word.en, choices: choicesFor(word, rng) };
    }
    case 'phrase': {
      const lesson = getLesson(ref);
      const phrase = lesson?.phrases?.[idx];
      if (!phrase) return null;
      return { ...base, phrase, source: { title: lesson.title, icon: lesson.icon, href: '#/lessons/' + lesson.id } };
    }
    case 'tip': {
      const guide = getGuide(ref);
      const section = guide?.sections[idx];
      if (!section) return null;
      return {
        ...base,
        heading: section.heading,
        body: section.body,
        examples: (section.examples || []).slice(0, 2),
        source: { title: guide.title, icon: guide.icon, href: '#/grammar/' + guide.id }
      };
    }
    case 'drill': {
      const guide = getGuide(ref);
      const ex = guide?.exercises?.[idx];
      if (!ex) return null;
      return {
        ...base,
        prompt: ex.prompt,
        answer: display(ex.answer),
        hint: ex.hint ?? null,
        source: { title: guide.title, icon: guide.icon, href: '#/grammar/' + guide.id }
      };
    }
    case 'verb': {
      const verb = getVerb(ref);
      if (!verb) return null;
      return {
        ...base,
        verb,
        rows: PRONOUNS.map((p, i) => ({ pronoun: p, form: display(verb.indefinite[i]) })),
        source: { title: 'Verb trainer', icon: '⚙️', href: '#/verbs' }
      };
    }
    case 'dialogue': {
      const d = getDialogue(ref);
      const lines = d?.lines.slice(idx, idx + DIALOGUE_WINDOW) ?? [];
      if (!lines.length) return null;
      return {
        ...base,
        scene: d.scene,
        lines,
        source: { title: d.title, icon: d.icon, href: '#/conversation/' + d.id }
      };
    }
    case 'reading': {
      const r = getReading(ref);
      const sentence = r?.text[idx];
      if (!sentence) return null;
      return {
        ...base,
        sentence,
        level: r.level,
        source: { title: r.title, icon: r.icon, href: '#/reading/' + r.id }
      };
    }
    default:
      return null;
  }
}

/**
 * Reorder keys so no two neighbours share a type where that is possible —
 * three word reels in a row feels like a flashcard list, not a feed.
 */
export function spreadTypes(keys) {
  const pool = keys.slice();
  const out = [];
  while (pool.length) {
    const prev = out.length ? reelType(out[out.length - 1]) : null;
    const i = pool.findIndex((k) => reelType(k) !== prev);
    out.push(pool.splice(i === -1 ? 0 : i, 1)[0]);
  }
  return out;
}

/**
 * Draw the next batch of reel keys.
 *
 * progress: the learner's progress blob (only lessonsStarted is read).
 * seen: keys already shown this session — never repeated until the whole
 * catalog is exhausted (then the feed simply starts over).
 */
export function nextBatch({ progress = {}, seen = new Set(), count = BATCH_SIZE, rng = Math.random } = {}) {
  const cat = reelCatalog();
  const started = new Set(progress.lessonsStarted || []);
  const all = Object.values(cat).flat();
  let pool = all.filter((k) => !seen.has(k));
  if (pool.length < count) pool = all;

  const weight = (key) => {
    const type = reelType(key);
    const share = TYPE_SHARE[type] / Math.max(1, cat[type].length);
    const lesson = lessonOf(key);
    return share * (lesson && started.has(lesson) ? STARTED_BOOST : 1);
  };
  return spreadTypes(weightedSample(pool, count, weight, rng));
}
