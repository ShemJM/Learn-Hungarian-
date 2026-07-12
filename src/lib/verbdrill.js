/**
 * Pure logic for the verb conjugation drill: enumerating drillable cells of
 * the conjugation tables and building a randomised question set.
 */
import { PRONOUNS, dictionaryForm } from './data/verbs.js';
import { sample, shuffle } from './text.js';

/** Accepted answers for one cell, normalised to an array (first = display form). */
export function cellAnswers(verb, definiteness, personIdx) {
  const cell = verb[definiteness][personIdx];
  return Array.isArray(cell) ? cell : [cell];
}

/** Every askable (verb, person, definiteness) combination; intransitives have no definite cells. */
export function drillableCells(verbs) {
  const cells = [];
  for (const verb of verbs) {
    for (const definiteness of ['indefinite', 'definite']) {
      if (!verb[definiteness]) continue;
      for (let personIdx = 0; personIdx < PRONOUNS.length; personIdx++) {
        cells.push({ verb, personIdx, definiteness });
      }
    }
  }
  return cells;
}

/**
 * Build a drill of `count` questions. In 'choices' mode each question carries
 * multiple-choice options drawn from other cells of the SAME verb — the
 * confusions worth practising.
 */
export function buildDrill(verbs, { count = 10, mode = 'type', choiceCount = 4, rng = Math.random } = {}) {
  return sample(drillableCells(verbs), count, rng).map(({ verb, personIdx, definiteness }) => {
    const answers = cellAnswers(verb, definiteness, personIdx);
    const question = {
      verb,
      personIdx,
      pronoun: PRONOUNS[personIdx],
      definiteness,
      dictionary: dictionaryForm(verb),
      answers,
      display: answers[0]
    };
    if (mode === 'choices') {
      const others = drillableCells([verb])
        .filter((c) => !(c.personIdx === personIdx && c.definiteness === definiteness))
        .map((c) => cellAnswers(verb, c.definiteness, c.personIdx)[0])
        .filter((form) => !answers.includes(form));
      const distractors = sample([...new Set(others)], choiceCount - 1, rng);
      question.choices = shuffle([answers[0], ...distractors], rng);
    }
    return question;
  });
}
