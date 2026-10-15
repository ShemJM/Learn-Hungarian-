/**
 * Pure logic for the Reels feed: an endless, TikTok-style vertical stream of
 * one-screen Hungarian micro-lessons cut from the existing course content.
 *
 * Every catalog reel is addressed by a stable string key ('word:food:3',
 * 'tip:cases:1', 'conj:enni:past:def:2', ...). The feed is just a list of
 * keys; a reel's content is rebuilt from its key on demand. That keeps saved
 * ("liked") reels tiny in localStorage and lets a liked reel survive content
 * edits that do not touch it — a key whose content disappeared simply builds
 * to null.
 *
 * A few reels are *ephemeral* (recap of this session's misses, the daily-goal
 * celebration): they depend on session state, have `key: null`, and can
 * never be saved.
 */
import { lessons, getLesson, allWords, allPhrases } from './data/lessons.js';
import { grammarGuides, getGuide } from './data/grammar.js';
import { verbs, getVerb, PRONOUNS, dictionaryForm } from './data/verbs.js';
import { dialogues, getDialogue } from './data/dialogues.js';
import { readings, getReading } from './data/readings.js';
import { alphabet, letterPhrase } from './data/alphabet.js';
import { allInterviewQuestions } from './data/citizenship.js';
import { allRolledRItems } from './data/rolledR.js';
import { bites, getBite, BITE_KINDS } from './data/bites.js';
import { buildCloze, reviewWeight } from './exercises.js';
import { tokenize, buildRound } from './games/sentencebuilder.js';
import { cellAnswers, cellChoices, drillableCells } from './verbdrill.js';
import { dueWords, weakCards, srsKey } from './srs.js';
import { shuffle, sample, weightedSample } from './text.js';

/** How many dialogue lines one dialogue reel shows. */
export const DIALOGUE_WINDOW = 4;

/** Reels drawn per feed batch; the page asks for another batch near the end. */
export const BATCH_SIZE = 20;

/** Word-order reels only use sentences of this many tiles — more is a chore on a phone. */
export const ORDER_MIN = 3;
export const ORDER_MAX = 7;

/** Grammar-table reels show at most this many rows; the rest is a tap away. */
export const TABLE_ROWS = 6;

/** Verb cells drilled by conj reels (present is covered by the verb-table reel). */
export const CONJ_TENSES = ['past', 'conditional', 'imperative'];

/** A missed reel comes back this many reels later (inclusive range). */
export const REQUEUE_MIN = 4;
export const REQUEUE_MAX = 7;

/** Per key, per session: never nag more than this. */
export const REQUEUE_LIMIT = 2;

/** A recap of this session's misses appears after every this-many watched reels. */
export const RECAP_EVERY = 12;

/**
 * Rough share of the feed each reel type should get, independent of how many
 * reels of that type exist (there are ~300 words but only 20 verbs). Words
 * and quick checks dominate — that is the "doom scroll" rhythm — with grammar
 * and context reels sprinkled through.
 */
export const TYPE_SHARE = {
  word: 0.14,
  quiz: 0.11,
  listen: 0.07,
  phrase: 0.08,
  tip: 0.08,
  drill: 0.06,
  verb: 0.04,
  dialogue: 0.05,
  reading: 0.05,
  cloze: 0.06,
  order: 0.05,
  type: 0.06,
  say: 0.04,
  letter: 0.03,
  conj: 0.05,
  table: 0.03,
  interview: 0.03,
  bite: 0.07
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
  reading: { label: 'Read it', emoji: '📖', theme: 'red' },
  cloze: { label: 'Fill the gap', emoji: '🕳️', theme: 'teal' },
  order: { label: 'Put it in order', emoji: '🧱', theme: 'navy' },
  type: { label: 'Type it', emoji: '⌨️', theme: 'ink' },
  say: { label: 'Say it', emoji: '🎤', theme: 'plum' },
  letter: { label: 'The alphabet', emoji: '🔤', theme: 'amber' },
  conj: { label: 'Conjugate', emoji: '🔧', theme: 'navy' },
  table: { label: 'At a glance', emoji: '📊', theme: 'teal' },
  interview: { label: 'Interview question', emoji: '🪪', theme: 'ink' },
  bite: { label: 'Bite', emoji: '💡', theme: 'amber' },
  // Ephemeral, session-built reels: not in the catalog, never savable.
  recap: { label: 'Recap', emoji: '🔁', theme: 'ink' },
  goal: { label: 'Daily goal', emoji: '🏆', theme: 'green' }
};

/** Reel types the learner answers (lean-back mode never auto-advances past these). */
export const INTERACTIVE_TYPES = new Set(['quiz', 'listen', 'cloze', 'order', 'type', 'conj', 'say', 'drill', 'recap']);

/** Groups for the filter sheet — what each type family is for. */
export const TYPE_GROUPS = [
  { label: 'Vocabulary', types: ['word', 'phrase', 'quiz', 'listen', 'type', 'cloze'] },
  { label: 'Grammar', types: ['tip', 'drill', 'table', 'verb', 'conj', 'order'] },
  { label: 'Real life', types: ['dialogue', 'reading', 'interview', 'say', 'letter', 'bite'] }
];

/** The type part of a reel key. */
export function reelType(key) {
  return String(key).split(':')[0];
}

const LESSON_TYPES = new Set(['word', 'quiz', 'listen', 'phrase', 'cloze', 'type', 'say']);
const GUIDE_TYPES = new Set(['tip', 'drill', 'table']);

/** The lesson id a key belongs to, for lesson-bound reel types (else null). */
export function lessonOf(key) {
  const [type, ref] = String(key).split(':');
  return LESSON_TYPES.has(type) && getLesson(ref) ? ref : null;
}

/** The grammar guide id a key belongs to (else null). */
export function guideOf(key) {
  const [type, ref] = String(key).split(':');
  return GUIDE_TYPES.has(type) ? ref : null;
}

/** Whether a sentence makes a sane word-order reel. */
function orderable(hu) {
  const n = tokenize(hu).length;
  return n >= ORDER_MIN && n <= ORDER_MAX;
}

let catalogCache = null;

/** Every catalog reel key the content supports, grouped by type. Content is static, so built once. */
export function reelCatalog() {
  if (catalogCache) return catalogCache;
  const cat = Object.fromEntries(Object.keys(TYPE_SHARE).map((t) => [t, []]));
  for (const l of lessons) {
    l.words.forEach((_, i) => {
      cat.word.push(`word:${l.id}:${i}`);
      cat.quiz.push(`quiz:${l.id}:${i}`);
      cat.listen.push(`listen:${l.id}:${i}`);
      cat.type.push(`type:${l.id}:${i}`);
    });
    (l.phrases || []).forEach((p, i) => {
      cat.phrase.push(`phrase:${l.id}:${i}`);
      cat.say.push(`say:${l.id}:${i}`);
      // buildCloze's null-ness depends only on token lengths, never on rng.
      if (buildCloze(p)) cat.cloze.push(`cloze:${l.id}:${i}`);
    });
  }
  for (const g of grammarGuides) {
    g.sections.forEach((s, i) => {
      cat.tip.push(`tip:${g.id}:${i}`);
      if (s.table) cat.table.push(`table:${g.id}:${i}`);
    });
    (g.exercises || []).forEach((_, i) => cat.drill.push(`drill:${g.id}:${i}`));
  }
  for (const v of verbs) cat.verb.push(`verb:${v.inf}`);
  for (const { verb, tense, definiteness, personIdx } of drillableCells(verbs, { tenses: CONJ_TENSES })) {
    cat.conj.push(`conj:${verb.inf}:${tense}:${definiteness === 'definite' ? 'def' : 'indef'}:${personIdx}`);
  }
  for (const d of dialogues) {
    for (let i = 0; i < d.lines.length; i += DIALOGUE_WINDOW) cat.dialogue.push(`dialogue:${d.id}:${i}`);
    d.lines.forEach((line, i) => orderable(line.hu) && cat.order.push(`order:dialogue/${d.id}:${i}`));
  }
  for (const r of readings) {
    r.text.forEach((s, i) => {
      cat.reading.push(`reading:${r.id}:${i}`);
      if (orderable(s.hu)) cat.order.push(`order:reading/${r.id}:${i}`);
    });
  }
  allRolledRItems().forEach((_, i) => cat.say.push(`say:rolledr:${i}`));
  for (const a of alphabet) cat.letter.push(`letter:${a.letter}`);
  for (const q of allInterviewQuestions()) cat.interview.push(`interview:${q.id}`);
  for (const b of bites) cat.bite.push(`bite:${b.id}`);
  catalogCache = cat;
  return cat;
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

/** Options for a cloze gap: the blanked word plus words blanked from other phrases of the lesson. */
function clozeChoices(cloze, lesson, rng, count = 3) {
  const pool = (lesson.phrases.length > count ? lesson.phrases : allPhrases())
    .map((p) => buildCloze(p, rng)?.display)
    .filter((w) => w && w.toLowerCase() !== cloze.display.toLowerCase());
  return shuffle([cloze.display, ...sample([...new Set(pool)], count - 1, rng)], rng);
}

const TENSE_LABEL = { past: 'past', conditional: 'conditional (would)', imperative: 'imperative (command)' };

/**
 * Build a reel's content from its key, or null if the key no longer points
 * at anything. Reels with choices shuffle them with `rng`.
 */
export function buildReel(key, rng = Math.random) {
  const parts = String(key).split(':');
  const [type, ref, rawIdx] = parts;
  const idx = Number(rawIdx);
  const base = { key, type, ...REEL_STYLE[type] };

  switch (type) {
    case 'word':
    case 'quiz':
    case 'listen':
    case 'type': {
      const lesson = getLesson(ref);
      const word = lesson?.words[idx];
      if (!word) return null;
      const source = { title: lesson.title, icon: lesson.icon, href: '#/lessons/' + lesson.id };
      if (type === 'word') return { ...base, word, source };
      if (type === 'type') return { ...base, word, source, prompt: word.en, accepted: [word.hu], display: word.hu };
      return { ...base, word, source, answer: word.en, choices: choicesFor(word, rng) };
    }
    case 'phrase':
    case 'cloze': {
      const lesson = getLesson(ref);
      const phrase = lesson?.phrases?.[idx];
      if (!phrase) return null;
      const source = { title: lesson.title, icon: lesson.icon, href: '#/lessons/' + lesson.id };
      if (type === 'phrase') return { ...base, phrase, source };
      const cloze = buildCloze(phrase, rng);
      if (!cloze) return null;
      return {
        ...base,
        phrase,
        source,
        before: cloze.before,
        after: cloze.after,
        suffix: cloze.suffix,
        answer: cloze.display,
        choices: clozeChoices(cloze, lesson, rng)
      };
    }
    case 'say': {
      if (ref === 'rolledr') {
        const item = allRolledRItems()[idx];
        if (!item) return null;
        return { ...base, text: item.hu, en: item.en, focus: 'Roll that R', source: { title: "Roll your R's", icon: '👅', href: '#/rolled-r' } };
      }
      const lesson = getLesson(ref);
      const phrase = lesson?.phrases?.[idx];
      if (!phrase) return null;
      return { ...base, text: phrase.hu, en: phrase.en, focus: null, source: { title: lesson.title, icon: lesson.icon, href: '#/lessons/' + lesson.id } };
    }
    case 'tip':
    case 'table': {
      const guide = getGuide(ref);
      const section = guide?.sections[idx];
      if (!section) return null;
      const source = { title: guide.title, icon: guide.icon, href: '#/grammar/' + guide.id };
      if (type === 'tip') {
        return { ...base, heading: section.heading, body: section.body, examples: (section.examples || []).slice(0, 2), source };
      }
      if (!section.table) return null;
      return {
        ...base,
        heading: section.heading,
        headers: section.table.headers,
        rows: section.table.rows.slice(0, TABLE_ROWS),
        truncated: section.table.rows.length > TABLE_ROWS,
        source
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
    case 'conj': {
      const [, inf, tense, def, person] = parts;
      const verb = getVerb(inf);
      const personIdx = Number(person);
      const definiteness = def === 'def' ? 'definite' : 'indefinite';
      if (!verb || !CONJ_TENSES.includes(tense) || !PRONOUNS[personIdx]) return null;
      if (!verb[tense]?.[definiteness]) return null;
      const cell = { personIdx, definiteness, tense };
      const answers = cellAnswers(verb, definiteness, personIdx, tense);
      return {
        ...base,
        verb,
        pronoun: PRONOUNS[personIdx],
        tense,
        tenseLabel: TENSE_LABEL[tense],
        definiteness,
        dictionary: dictionaryForm(verb),
        answer: answers[0],
        answers,
        choices: cellChoices(verb, cell, { tenses: CONJ_TENSES, choiceCount: 4, rng }),
        source: { title: 'Verb trainer', icon: '⚙️', href: '#/verbs' }
      };
    }
    case 'dialogue': {
      const d = getDialogue(ref);
      const lines = d?.lines.slice(idx, idx + DIALOGUE_WINDOW) ?? [];
      if (!lines.length) return null;
      return { ...base, scene: d.scene, lines, source: { title: d.title, icon: d.icon, href: '#/conversation/' + d.id } };
    }
    case 'reading': {
      const r = getReading(ref);
      const sentence = r?.text[idx];
      if (!sentence) return null;
      return { ...base, sentence, level: r.level, source: { title: r.title, icon: r.icon, href: '#/reading/' + r.id } };
    }
    case 'order': {
      const [kind, id] = ref.split('/');
      let sentence = null;
      let source = null;
      if (kind === 'dialogue') {
        const d = getDialogue(id);
        sentence = d?.lines[idx];
        if (d) source = { title: d.title, icon: d.icon, href: '#/conversation/' + d.id };
      } else if (kind === 'reading') {
        const r = getReading(id);
        sentence = r?.text[idx];
        if (r) source = { title: r.title, icon: r.icon, href: '#/reading/' + r.id };
      }
      if (!sentence || !orderable(sentence.hu)) return null;
      const round = buildRound({ hu: sentence.hu, en: sentence.en }, rng);
      return { ...base, sentence: round.sentence, tokens: round.tokens, tiles: round.tiles, source };
    }
    case 'letter': {
      const entry = alphabet.find((a) => a.letter === ref);
      if (!entry) return null;
      return { ...base, entry, phrase: letterPhrase(entry), source: { title: 'Pronunciation Lab', icon: '🎤', href: '#/pronunciation' } };
    }
    case 'interview': {
      const q = allInterviewQuestions().find((x) => x.id === ref);
      if (!q) return null;
      return {
        ...base,
        question: { hu: q.hu, en: q.en, tip: q.tip },
        answers: q.answers,
        source: { title: q.categoryTitle, icon: '🪪', href: '#/citizenship' }
      };
    }
    case 'bite': {
      const bite = getBite(ref);
      if (!bite) return null;
      const kind = BITE_KINDS[bite.kind];
      return { ...base, bite, label: kind.label, emoji: kind.emoji, source: { title: 'More bites', icon: '💡', href: '#/reels' } };
    }
    default:
      return null;
  }
}

/** Only catalog reels (string key) can be hearted and come back in Saved. */
export function isSavable(reel) {
  return typeof reel?.key === 'string';
}

/** Whether lean-back mode should wait for the learner instead of auto-advancing. */
export function isInteractive(reel) {
  return INTERACTIVE_TYPES.has(reel?.type);
}

/**
 * The spaced-repetition key a reel's answer should be recorded under, or
 * null for reels that stay out of the deck (verb cells, word order, speaking
 * — the deck is en→hu vocabulary only, matching exercises.js).
 */
export function reviewKeyOf(reel) {
  switch (reel?.type) {
    case 'word':
    case 'quiz':
    case 'listen':
    case 'type':
      return reel.word.hu;
    case 'phrase':
    case 'cloze':
      return 'p:' + reel.phrase.hu;
    default:
      return null;
  }
}

/**
 * The key to re-show a missed reel under: a *different* exercise on the same
 * item where one exists (so the retry is recall, not recognition of the
 * same screen), else the same key; null for reels with nothing to retry.
 */
export function requeueVariant(key, rng = Math.random) {
  const parts = String(key).split(':');
  const [type, ref, idx] = parts;
  const word = ['word', 'quiz', 'listen', 'type'];
  if (word.includes(type)) {
    const options = ['quiz', 'type'].filter((t) => t !== type);
    return `${sample(options, 1, rng)[0]}:${ref}:${idx}`;
  }
  if (type === 'phrase') return buildReel(`cloze:${ref}:${idx}`) ? `cloze:${ref}:${idx}` : `phrase:${ref}:${idx}`;
  if (type === 'cloze') return `phrase:${ref}:${idx}`;
  if (['conj', 'order', 'drill', 'say'].includes(type)) return key;
  return null;
}

/** How many reels after the current one a retry lands. */
export function requeueOffset(rng = Math.random) {
  return REQUEUE_MIN + Math.floor(rng() * (REQUEUE_MAX - REQUEUE_MIN + 1));
}

/** Insert `item` at index `at` (clamped to the list), returning a new list. */
export function insertAt(list, item, at) {
  const i = Math.max(0, Math.min(list.length, at));
  return [...list.slice(0, i), item, ...list.slice(i)];
}

/**
 * A recap reel of this session's misses: [{ key, hu, en }], newest last.
 * Shows the last few so it stays one screen.
 */
export function recapReel(misses, limit = 6) {
  return { key: null, type: 'recap', ...REEL_STYLE.recap, items: misses.slice(-limit) };
}

/** The daily-goal celebration reel. */
export function goalReel(goal, streakDays = 0) {
  return { key: null, type: 'goal', ...REEL_STYLE.goal, goal, streakDays };
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
 * Whether a key passes the learner's filters: { types: string[]|null,
 * sources: string[]|null }. null means "everything". Keys bound to no lesson
 * or guide (verbs, bites, dialogues…) pass any source filter.
 */
export function passesFilters(key, filters) {
  if (!filters) return true;
  if (filters.types && !filters.types.includes(reelType(key))) return false;
  if (filters.sources) {
    const src = lessonOf(key) ?? guideOf(key);
    if (src && !filters.sources.includes(src)) return false;
  }
  return true;
}

/**
 * Draw the next batch of reel keys.
 *
 * progress: the learner's progress blob (only lessonsStarted is read).
 * seen: keys already shown this session — never repeated until the whole
 * (filtered) catalog is exhausted, then the feed simply starts over.
 * filters: see passesFilters. Returns [] when nothing matches.
 */
export function nextBatch({ progress = {}, seen = new Set(), count = BATCH_SIZE, rng = Math.random, filters = null } = {}) {
  const cat = reelCatalog();
  const started = new Set(progress.lessonsStarted || []);
  const all = Object.values(cat).flat().filter((k) => passesFilters(k, filters));
  if (!all.length) return [];
  let pool = all.filter((k) => !seen.has(k));
  if (pool.length < Math.min(count, all.length)) pool = all;

  // Weights are computed once up front: weightedSample re-reads them per pick.
  const weights = new Map(
    pool.map((key) => {
      const type = reelType(key);
      const share = TYPE_SHARE[type] / Math.max(1, cat[type].length);
      const lesson = lessonOf(key);
      return [key, share * (lesson && started.has(lesson) ? STARTED_BOOST : 1)];
    })
  );
  return spreadTypes(weightedSample(pool, Math.min(count, pool.length), (k) => weights.get(k), rng));
}

let cardIndexCache = null;

/** srsKey -> { lessonId, idx, isPhrase } for every word and phrase in the course. */
export function cardIndex() {
  if (cardIndexCache) return cardIndexCache;
  cardIndexCache = new Map();
  for (const l of lessons) {
    l.words.forEach((w, idx) => cardIndexCache.set(w.hu, { lessonId: l.id, idx, isPhrase: false }));
    (l.phrases || []).forEach((p, idx) => cardIndexCache.set('p:' + p.hu, { lessonId: l.id, idx, isPhrase: true }));
  }
  return cardIndexCache;
}

/**
 * The "Due" channel: reel keys for the cards the spaced-repetition deck
 * wants today — due cards first, then the learner's weakest — each shown as
 * a recall exercise (quiz/type for words, cloze or phrase for phrases).
 *
 * pool: review cards ({ hu, en, key? }) e.g. from eligibleReviewPool().
 */
export function dueBatch({ pool = [], srsState = {}, today, count = BATCH_SIZE, rng = Math.random } = {}) {
  const index = cardIndex();
  const due = dueWords(pool, srsState, today).filter((c) => srsState[srsKey(c)]); // seen cards only
  const weak = weakCards(pool, srsState, { limit: count });
  const cards = [...new Map([...due, ...weak].map((c) => [srsKey(c), c])).values()];
  const picked = weightedSample(cards, Math.min(count, cards.length), (c) => reviewWeight(srsState[srsKey(c)]), rng);
  const keys = picked
    .map((c) => {
      const at = index.get(srsKey(c));
      if (!at) return null;
      if (at.isPhrase) {
        const cloze = `cloze:${at.lessonId}:${at.idx}`;
        return buildReel(cloze) ? cloze : `phrase:${at.lessonId}:${at.idx}`;
      }
      return `${rng() < 0.5 ? 'quiz' : 'type'}:${at.lessonId}:${at.idx}`;
    })
    .filter(Boolean);
  return spreadTypes(keys);
}
