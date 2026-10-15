/**
 * Pure logic for the Suffix Lab: turning the verb tables and the hand-written
 * noun material into "stem + ___" questions about personal endings
 * (én / te / ő / mi / ti / ők), possessive endings and case endings.
 *
 * Every question is built by DECOMPOSING a real, hand-written form into
 * stem + one listed ending. A form that does not split cleanly (mész, jövök,
 * evett…) is simply never asked here: irregular stems are the verb
 * trainer's job, while this lab is about choosing the right ending.
 */
import { verbs as allVerbs, PRONOUNS, dictionaryForm } from './data/verbs.js';
import {
  VERB_ENDINGS,
  POSSESSIVE_ENDINGS,
  POSSESSIVE_NOUNS,
  CASES,
  CASE_NOUNS,
  HARMONY_LABEL
} from './data/suffixes.js';
import { sample, shuffle } from './text.js';

export const TOPICS = [
  { id: 'verbs-present', icon: '⚙️', label: 'Verb endings: present', desc: 'tanul + ok / unk / tok… — who is doing it?' },
  { id: 'verbs-past', icon: '⏪', label: 'Verb endings: past', desc: 'tanul + tam / tál / tunk… — and the -ott / -ett forms' },
  { id: 'verbs-conditional', icon: '💭', label: 'Verb endings: would', desc: 'tanul + nék / nál / nánk… — the conditional' },
  { id: 'possessive', icon: '🏠', label: 'My, your, our…', desc: 'ház + am / ad / unk… — possession is a suffix' },
  { id: 'cases', icon: '📍', label: 'Case endings', desc: 'ház + ban / ba / ból… — in, into, with, at…' }
];

const PRONOUN_GLOSS = ['I', 'you', 'he / she', 'we', 'you (plural)', 'they'];
const POSSESSOR_GLOSS = ['my', 'your', 'his / her', 'our', 'your (plural)', 'their'];
const TENSE_GLOSS = { present: 'present', past: 'past', conditional: 'would (conditional)' };

/** Split `form` into stem + ending, trying every stem and every ending; null when it does not split. */
export function decompose(form, stems, endings) {
  for (const stem of stems) {
    if (!form.startsWith(stem)) continue;
    const ending = form.slice(stem.length);
    if (endings.includes(ending)) return { stem, ending };
  }
  return null;
}

/** The stem a verb's regular forms are built on: the dictionary form, minus -ik for -ik verbs. */
export function verbStem(verb) {
  const dict = dictionaryForm(verb);
  return verb.ik && dict.endsWith('ik') ? dict.slice(0, -2) : dict;
}

function cellForms(verb, tense, definiteness, personIdx) {
  const table = tense === 'present' ? verb[definiteness] : verb[tense]?.[definiteness];
  if (!table) return null;
  const cell = table[personIdx];
  return Array.isArray(cell) ? cell : [cell];
}

/** Every askable verb-ending question for one tense: regular cells of every verb, both conjugations. */
export function verbItems(tense, verbs = allVerbs) {
  const items = [];
  for (const verb of verbs) {
    const stem = verbStem(verb);
    for (const definiteness of ['indefinite', 'definite']) {
      for (let personIdx = 0; personIdx < PRONOUNS.length; personIdx++) {
        const forms = cellForms(verb, tense, definiteness, personIdx);
        if (!forms) continue;
        const variants = VERB_ENDINGS[tense][definiteness][personIdx];
        const split = decompose(forms[0], [stem], variants);
        if (!split || !split.ending) continue;
        const defGloss = definiteness === 'definite' ? 'definite (a specific object)' : 'indefinite';
        items.push({
          topic: `verbs-${tense}`,
          key: `${tense}:${definiteness}:${verb.inf}:${personIdx}`,
          stem,
          ending: split.ending,
          answer: forms[0],
          answers: forms,
          pronoun: PRONOUNS[personIdx],
          personIdx,
          variants,
          others: VERB_ENDINGS[tense][definiteness].flat().filter((e) => e && !variants.includes(e)),
          harmony: verb.harmony,
          prompt: `${PRONOUNS[personIdx]} + ${stem}`,
          gloss: `${PRONOUN_GLOSS[personIdx]} · ${verb.en.replace(/^to /, '')} · ${TENSE_GLOSS[tense]} · ${defGloss}`,
          note: verb.ik ? `${dictionaryForm(verb)} is an -ik verb: the stem is ${stem}-.` : null
        });
      }
    }
  }
  return items;
}

/** Every askable possessive question: noun + my / your / his… */
export function possessiveItems(nouns = POSSESSIVE_NOUNS) {
  const items = [];
  for (const noun of nouns) {
    const stems = [noun.noun, ...(noun.stems || [])];
    for (let personIdx = 0; personIdx < PRONOUNS.length; personIdx++) {
      const form = noun.forms[personIdx];
      const variants = POSSESSIVE_ENDINGS[personIdx];
      const split = decompose(form, stems, variants);
      if (!split) continue;
      items.push({
        topic: 'possessive',
        key: `poss:${noun.noun}:${personIdx}`,
        stem: split.stem,
        ending: split.ending,
        answer: form,
        answers: [form],
        pronoun: PRONOUNS[personIdx],
        personIdx,
        variants,
        others: POSSESSIVE_ENDINGS.flat().filter((e) => !variants.includes(e)),
        harmony: noun.harmony,
        prompt: `${PRONOUNS[personIdx]} + ${split.stem}`,
        gloss: `${POSSESSOR_GLOSS[personIdx]} ${noun.en}`,
        note: noun.note || null
      });
    }
  }
  return items;
}

/** Every askable case question: noun + in / into / with… */
export function caseItems(nouns = CASE_NOUNS) {
  const items = [];
  for (const noun of nouns) {
    const stems = [noun.noun, ...(noun.stems || [])];
    for (const [caseKey, form] of Object.entries(noun.cases)) {
      const c = CASES[caseKey];
      const split = decompose(form, stems, c.variants);
      if (!split) continue;
      items.push({
        topic: 'cases',
        key: `case:${noun.noun}:${caseKey}`,
        stem: split.stem,
        ending: split.ending,
        answer: form,
        answers: [form],
        caseKey,
        variants: c.variants,
        others: Object.entries(CASES)
          .filter(([k]) => k !== caseKey)
          .flatMap(([, v]) => v.variants),
        harmony: noun.harmony,
        prompt: `${split.stem} + ${c.label}`,
        gloss: `${c.label} · ${noun.en}`,
        note: noun.notes?.[caseKey] || noun.note || null
      });
    }
  }
  return items;
}

/** All questions for a topic id. */
export function topicItems(topicId) {
  switch (topicId) {
    case 'verbs-present':
      return verbItems('present');
    case 'verbs-past':
      return verbItems('past');
    case 'verbs-conditional':
      return verbItems('conditional');
    case 'possessive':
      return possessiveItems();
    case 'cases':
      return caseItems();
    default:
      return [];
  }
}

/**
 * Multiple-choice endings for an item: the right one plus distractors, taken
 * first from the same slot's other variants (the harmony confusion: -ok vs
 * -ek vs -ök) and then from other slots. Never an ending that would also
 * spell an accepted answer. Shuffled.
 */
export function endingChoices(item, { choiceCount = 4, rng = Math.random } = {}) {
  const accepted = new Set(item.answers);
  const usable = (e) => e !== item.ending && e && !accepted.has(item.stem + e);
  const siblings = [...new Set(item.variants.filter(usable))];
  const others = [...new Set(item.others.filter(usable))];
  const distractors = [...sample(siblings, choiceCount - 1, rng)];
  if (distractors.length < choiceCount - 1) {
    distractors.push(...sample(others.filter((e) => !distractors.includes(e)), choiceCount - 1 - distractors.length, rng));
  }
  return shuffle([item.ending, ...distractors], rng);
}

/** A one-line explanation of why the ending is what it is. */
export function explain(item) {
  const harmony = item.harmony ? `${item.stem} has ${HARMONY_LABEL[item.harmony]}, so the ending is -${item.ending}.` : '';
  return [harmony, item.note].filter(Boolean).join(' ');
}

/**
 * Build a drill: `count` questions sampled evenly-ish across the chosen
 * topics, each with multiple-choice endings and an explanation.
 */
export function buildSuffixDrill({ topics = ['verbs-present'], count = 10, choiceCount = 4, rng = Math.random } = {}) {
  const pool = topics.flatMap((t) => topicItems(t));
  return sample(pool, count, rng).map((item) => ({
    ...item,
    choices: endingChoices(item, { choiceCount, rng }),
    explanation: explain(item)
  }));
}
