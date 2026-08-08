/**
 * Pure logic for the verb conjugation drill: enumerating drillable cells of
 * the conjugation tables and building a randomised question set. Cells span
 * tenses ('present' | 'past'); past forms live under verb.past.
 */
import { PRONOUNS, dictionaryForm } from './data/verbs.js';
import { sample, shuffle } from './text.js';

/** The conjugation table for one tense/definiteness, or null when it does not exist. */
function table(verb, tense, definiteness) {
  return tense === 'past' ? verb.past?.[definiteness] || null : verb[definiteness];
}

/** Accepted answers for one cell, normalised to an array (first = display form). */
export function cellAnswers(verb, definiteness, personIdx, tense = 'present') {
  const cell = table(verb, tense, definiteness)[personIdx];
  return Array.isArray(cell) ? cell : [cell];
}

/** Every askable (verb, person, definiteness, tense) combination; intransitives have no definite cells. */
export function drillableCells(verbs, { tenses = ['present'] } = {}) {
  const cells = [];
  for (const verb of verbs) {
    for (const tense of tenses) {
      for (const definiteness of ['indefinite', 'definite']) {
        if (!table(verb, tense, definiteness)) continue;
        for (let personIdx = 0; personIdx < PRONOUNS.length; personIdx++) {
          cells.push({ verb, personIdx, definiteness, tense });
        }
      }
    }
  }
  return cells;
}

/**
 * Build a drill of `count` questions. In 'choices' mode each question carries
 * multiple-choice options drawn from other cells of the SAME verb — the
 * confusions worth practising (including cross-tense pairs like kértek/kértetek
 * when both tenses are in play).
 */
export function buildDrill(
  verbs,
  { count = 10, mode = 'type', choiceCount = 4, tenses = ['present'], rng = Math.random } = {}
) {
  return sample(drillableCells(verbs, { tenses }), count, rng).map(({ verb, personIdx, definiteness, tense }) => {
    const answers = cellAnswers(verb, definiteness, personIdx, tense);
    const question = {
      verb,
      personIdx,
      pronoun: PRONOUNS[personIdx],
      definiteness,
      tense,
      dictionary: dictionaryForm(verb),
      answers,
      display: answers[0]
    };
    if (mode === 'choices') {
      const others = drillableCells([verb], { tenses })
        .filter((c) => !(c.personIdx === personIdx && c.definiteness === definiteness && c.tense === tense))
        .map((c) => cellAnswers(verb, c.definiteness, c.personIdx, c.tense)[0])
        .filter((form) => !answers.includes(form));
      const distractors = sample([...new Set(others)], choiceCount - 1, rng);
      question.choices = shuffle([answers[0], ...distractors], rng);
    }
    return question;
  });
}
