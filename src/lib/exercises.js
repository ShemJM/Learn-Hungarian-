/**
 * Pure builders for mixed practice sessions — the learn-by-doing engine.
 *
 * A session is an array of exercise items, a discriminated union on `kind`:
 *   mcq       { prompt, promptLang, choices, answer, hu, en, srsKey }
 *   type      { prompt (en), accepted[], display, audio, pron?, hint?, srsKey }
 *   cloze     { before, after, suffix, en, accepted[], display, audio, srsKey }
 *   order     { en, hu, tokens, tiles }
 *   dictation { audio, accepted[], display, en }
 *
 * `srsKey` is present on items that require producing the Hungarian form
 * (typed translation, cloze, en→hu multiple choice) — the runner feeds those
 * results into the same Leitner deck as Daily Review, so practice counts.
 * Recognition-only items (hu→en mcq, dictation, word order) stay out of the
 * production deck.
 *
 * All builders take an injectable rng so tests are deterministic.
 */
import { getLesson } from './data/lessons.js';
import { getGuide } from './data/grammar.js';
import { getUnit } from './data/course.js';
import { buildQuiz } from './quiz.js';
import { buildRound, isSolved, tokenize } from './games/sentencebuilder.js';
import { checkAnswer, sample, shuffle } from './text.js';

/** How many of each kind go into a standard lesson session. */
export const LESSON_MIX = { mcq: 4, type: 3, cloze: 2, order: 2, dictation: 1 };

function acceptedList(answer) {
  return Array.isArray(answer) ? answer : [answer];
}

function mcqItems(words, count, rng) {
  return buildQuiz(words, { count, direction: 'mixed', rng }).map((q) => ({
    kind: 'mcq',
    prompt: q.prompt,
    promptLang: q.promptLang,
    choices: q.choices,
    answer: q.answer,
    hu: q.word.hu,
    en: q.word.en,
    srsKey: q.promptLang === 'en' ? q.word.hu : null
  }));
}

function typeItems(words, count, rng) {
  return sample(words, count, rng).map((w) => ({
    kind: 'type',
    prompt: w.en,
    accepted: [w.hu],
    display: w.hu,
    audio: w.hu,
    pron: w.pron,
    srsKey: w.hu
  }));
}

/**
 * Blank one word of a phrase. The blanked token must be ≥ 3 letters and we
 * prefer not to blank the first word (its capitalization gives it away less
 * cleanly). Returns null when no token qualifies.
 */
export function buildCloze(phrase, rng = Math.random) {
  const parts = phrase.hu.split(/\s+/);
  const clean = parts.map((p) => tokenize(p)[0] || '');
  const candidates = parts.map((_, i) => i).filter((i) => clean[i].length >= 3);
  if (!candidates.length) return null;
  const preferred = candidates.filter((i) => i > 0);
  const idx = sample(preferred.length ? preferred : candidates, 1, rng)[0];
  const suffix = (parts[idx].match(/[.,!?;:…”")]+$/) || [''])[0];
  return {
    kind: 'cloze',
    before: parts.slice(0, idx).join(' '),
    after: parts.slice(idx + 1).join(' '),
    suffix,
    en: phrase.en,
    accepted: [clean[idx]],
    display: clean[idx],
    audio: phrase.hu,
    srsKey: 'p:' + phrase.hu
  };
}

function clozeItems(phrases, count, rng) {
  return sample(phrases, phrases.length, rng)
    .map((p) => buildCloze(p, rng))
    .filter(Boolean)
    .slice(0, count);
}

function orderItems(phrases, count, rng) {
  const buildable = phrases.filter((p) => {
    const n = tokenize(p.hu).length;
    return n >= 3 && n <= 8;
  });
  return sample(buildable, count, rng).map((p) => {
    const round = buildRound(p, rng);
    return { kind: 'order', en: p.en, hu: p.hu, tokens: round.tokens, tiles: round.tiles };
  });
}

function dictationItems(phrases, words, count, rng) {
  const pool = phrases.length ? phrases : words;
  return sample(pool, count, rng).map((p) => ({
    kind: 'dictation',
    audio: p.hu,
    accepted: [p.hu],
    display: p.hu,
    en: p.en
  }));
}

/**
 * A mixed session over one lesson's words and phrases. Kinds that need
 * phrases degrade gracefully when the lesson has none.
 */
export function buildLessonSession(lesson, { count = 12, mix = LESSON_MIX, rng = Math.random } = {}) {
  const words = lesson.words || [];
  const phrases = lesson.phrases || [];
  const items = [
    ...mcqItems(words, mix.mcq, rng),
    ...typeItems(words, mix.type, rng),
    ...clozeItems(phrases, mix.cloze, rng),
    ...orderItems(phrases, mix.order, rng),
    ...dictationItems(phrases, words, mix.dictation, rng)
  ];
  return shuffle(items, rng).slice(0, count);
}

/** Typed gap/transform drills from a grammar guide's hand-authored exercises. */
export function buildGrammarSession(guide, { rng = Math.random } = {}) {
  return shuffle(guide.exercises || [], rng).map((e) => {
    const accepted = acceptedList(e.answer);
    return {
      kind: 'type',
      prompt: e.prompt,
      accepted,
      display: accepted[0],
      audio: accepted[0],
      hint: e.hint,
      srsKey: null
    };
  });
}

/**
 * The unit's "boss level": a mix drawn from every lesson and grammar guide
 * the unit teaches, so passing it means the whole unit stuck.
 */
export function buildCheckpointSession(unit, { count = 15, rng = Math.random } = {}) {
  const items = [];
  for (const step of unit.steps) {
    if (step.type === 'lesson') {
      const lesson = getLesson(step.ref);
      if (lesson) items.push(...buildLessonSession(lesson, { count: 6, rng }));
    } else if (step.type === 'guide') {
      const guide = getGuide(step.ref);
      if (guide) items.push(...sample(buildGrammarSession(guide, { rng }), 4, rng));
    }
  }
  return shuffle(items, rng).slice(0, count);
}

/** Grade a learner response against an item. quality is null for non-typed kinds. */
export function gradeItem(item, response) {
  if (item.kind === 'mcq') return { correct: response === item.answer, quality: null };
  if (item.kind === 'order') return { correct: isSolved(response, item.tokens), quality: null };
  const quality = checkAnswer(response, item.accepted);
  return { correct: quality !== 'wrong', quality };
}

/**
 * Resolve an exercise-set id to { id, title, icon, build(rng) }, or null.
 * Ids: 'lesson:<lessonId>' | 'grammar:<guideId>' | 'checkpoint:<unitId>'.
 */
export function getExerciseSet(setId) {
  const sep = (setId || '').indexOf(':');
  if (sep < 0) return null;
  const kind = setId.slice(0, sep);
  const ref = setId.slice(sep + 1);
  if (kind === 'lesson') {
    const lesson = getLesson(ref);
    if (!lesson) return null;
    return {
      id: setId,
      title: `Practice: ${lesson.title}`,
      icon: lesson.icon,
      build: (rng = Math.random) => buildLessonSession(lesson, { rng })
    };
  }
  if (kind === 'grammar') {
    const guide = getGuide(ref);
    if (!guide?.exercises?.length) return null;
    return {
      id: setId,
      title: `Practise: ${guide.title}`,
      icon: guide.icon,
      build: (rng = Math.random) => buildGrammarSession(guide, { rng })
    };
  }
  if (kind === 'checkpoint') {
    const unit = getUnit(ref);
    if (!unit) return null;
    return {
      id: setId,
      title: `Checkpoint: ${unit.title}`,
      icon: '🏁',
      build: (rng = Math.random) => buildCheckpointSession(unit, { rng })
    };
  }
  return null;
}
