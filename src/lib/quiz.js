import { shuffle, sample } from './text.js';

/**
 * Build a multiple-choice quiz from a list of vocabulary entries ({ hu, en }).
 *
 * direction: 'hu-en' (show Hungarian, choose English), 'en-hu', or 'mixed'.
 * Returns questions: { prompt, promptLang, answer, choices[], word }.
 */
export function buildQuiz(words, { count = 10, choiceCount = 4, direction = 'mixed', rng = Math.random } = {}) {
  if (!words || words.length < 2) return [];
  const pool = sample(words, Math.min(count, words.length), rng);
  return pool.map((word) => {
    const dir = direction === 'mixed' ? (rng() < 0.5 ? 'hu-en' : 'en-hu') : direction;
    const askHu = dir === 'hu-en';
    const prompt = askHu ? word.hu : word.en;
    const answer = askHu ? word.en : word.hu;
    const distractors = sample(
      words.filter((w) => w !== word && (askHu ? w.en !== word.en : w.hu !== word.hu)),
      choiceCount - 1,
      rng
    ).map((w) => (askHu ? w.en : w.hu));
    return {
      prompt,
      promptLang: askHu ? 'hu' : 'en',
      answer,
      choices: shuffle([answer, ...distractors], rng),
      word
    };
  });
}

/** Score a finished quiz: array of { correct: boolean } -> { correct, total, percent }. */
export function scoreQuiz(results) {
  const total = results.length;
  const correct = results.filter((r) => r.correct).length;
  return { correct, total, percent: total ? Math.round((correct / total) * 100) : 0 };
}

/** Grade a percent into feedback. */
export function grade(percent) {
  if (percent >= 90) return { label: 'Kiváló! (Excellent!)', emoji: '🏆' };
  if (percent >= 70) return { label: 'Nagyon jó! (Very good!)', emoji: '🎉' };
  if (percent >= 50) return { label: 'Jó! (Good!)', emoji: '👍' };
  return { label: 'Gyakorolj még! (Keep practising!)', emoji: '💪' };
}
