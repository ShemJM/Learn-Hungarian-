/**
 * Pure derived statistics for the dashboard. Nothing here knows which language
 * is being taught: callers pass in the words, dialogue ids and guide ids that
 * matter, so this module works for any course built on the same data shape.
 *
 * All functions take `now`/`today` explicitly so tests stay deterministic.
 */
import { dayStamp, srsKey, INTERVALS } from './srs.js';

/** An SRS box at or above this counts as "mastered" (survived ~4+ days of spacing). */
export const MASTERY_BOX = 4;

/** A pronunciation score at or above this counts as "said well enough". */
export const SPOKEN_OK = 0.7;

/**
 * Consecutive days of activity ending today (or yesterday — a streak is not
 * broken until you miss a whole day). Returns 0 when nothing was done recently.
 */
export function streak(daysActive, today = dayStamp()) {
  if (!daysActive?.length) return 0;
  const days = [...new Set(daysActive)].sort((a, b) => b - a); // newest first
  if (days[0] < today - 1) return 0; // last activity was before yesterday: broken
  let count = 1;
  for (let i = 1; i < days.length; i++) {
    if (days[i - 1] - days[i] === 1) count++;
    else break;
  }
  return count;
}

/** Vocabulary split by SRS state: mastered / learning / not yet seen. */
export function vocabMastery(words, srs = {}) {
  const total = words.length;
  let mastered = 0;
  let learning = 0;
  for (const w of words) {
    const entry = srs[srsKey(w)];
    if (!entry) continue;
    if (entry.box >= MASTERY_BOX) mastered++;
    else learning++;
  }
  return {
    total,
    mastered,
    learning,
    unseen: total - mastered - learning,
    percent: total ? Math.round((mastered / total) * 100) : 0
  };
}

/** The activity entries that happened during the previous visit. */
export function lastVisitActivity(activity = [], visit = {}) {
  const { current, previous } = visit;
  if (!previous || !current) return [];
  return activity.filter((a) => a.t >= previous && a.t < current);
}

/** Coarse human-readable gap: "yesterday", "3 days ago", "just now". */
export function relativeDay(then, now = Date.now()) {
  if (!then) return null;
  const days = dayStamp(now) - dayStamp(then);
  if (days <= 0) return 'earlier today';
  if (days === 1) return 'yesterday';
  if (days < 7) return `${days} days ago`;
  if (days < 14) return 'last week';
  if (days < 60) return `${Math.floor(days / 7)} weeks ago`;
  return `${Math.floor(days / 30)} months ago`;
}

/**
 * Exam readiness as a transparent breakdown, NOT a black-box score.
 *
 * `plan` describes what the exam actually asks of the learner:
 *   { words, dialogueIds, guideIds, phrases }
 * Each component is the fraction of that plan the learner has demonstrably
 * practised. The overall figure is the plain mean of the components, so a
 * learner can always see exactly why it says what it says.
 *
 * This measures practice completed — it cannot predict what an examiner will
 * ask. The UI should say so.
 */
export function examReadiness(progress, plan) {
  const { words = [], dialogueIds = [], guideIds = [], phrases = [] } = plan || {};
  const srs = progress.srs || {};

  const vocab = vocabMastery(words, srs);

  const rehearsed = dialogueIds.filter((id) => (progress.dialoguesDone || []).includes(id)).length;
  const read = guideIds.filter((id) => (progress.guidesRead || []).includes(id)).length;
  const spoken = phrases.filter((p) => (progress.pronunciationStars || {})[p] >= SPOKEN_OK).length;

  const pct = (done, total) => (total ? Math.round((done / total) * 100) : 0);

  const components = [
    {
      key: 'vocabulary',
      label: 'Interview vocabulary mastered',
      percent: vocab.percent,
      detail: `${vocab.mastered} of ${vocab.total} words at box ${MASTERY_BOX}+`
    },
    {
      key: 'dialogues',
      label: 'Interview dialogues rehearsed',
      percent: pct(rehearsed, dialogueIds.length),
      detail: `${rehearsed} of ${dialogueIds.length} role-played`
    },
    {
      key: 'grammar',
      label: 'Key grammar guides read',
      percent: pct(read, guideIds.length),
      detail: `${read} of ${guideIds.length} guides`
    },
    {
      key: 'speaking',
      label: 'Answers said out loud',
      percent: pct(spoken, phrases.length),
      detail: `${spoken} of ${phrases.length} phrases scored ${Math.round(SPOKEN_OK * 100)}%+`
    }
  ];

  const overall = Math.round(components.reduce((sum, c) => sum + c.percent, 0) / components.length);
  return { overall, components };
}

/** Cards the learner has actually met before and that are due again today. */
export function reviewDue(words, srs = {}, today = dayStamp()) {
  return words.filter((w) => {
    const entry = srs[srsKey(w)];
    return entry && today >= entry.last + INTERVALS[entry.box - 1];
  }).length;
}

/**
 * The single thing the learner should do next. A tutor gives one instruction,
 * not a menu — due reviews always win, because forgetting is the enemy.
 *
 * `dueCount` must count only words already seen: telling a brand-new learner to
 * "review 157 cards" is both wrong and demoralising.
 */
export function nextAction({
  dueCount = 0,
  hasStarted = true,
  nextLessonId = null,
  readiness,
  unreadGuideId = null,
  unrehearsedDialogueId = null
}) {
  if (!hasStarted) {
    return {
      label: 'Start your first lesson',
      href: nextLessonId ? `#/lessons/${nextLessonId}` : '#/lessons',
      why: 'Fifteen words, with audio. Reviews will schedule themselves from there.'
    };
  }
  if (dueCount > 0) {
    return {
      label: `Review ${dueCount} card${dueCount === 1 ? '' : 's'}`,
      href: '#/review',
      why: 'These words are scheduled for today — do them before they fade.'
    };
  }
  if (nextLessonId) {
    return {
      label: 'Start the next lesson',
      href: `#/lessons/${nextLessonId}`,
      why: 'Nothing is due for review, so this is the best use of today.'
    };
  }
  if (unreadGuideId) {
    return {
      label: 'Read the next grammar guide',
      href: `#/grammar/${unreadGuideId}`,
      why: 'Vocabulary is under control — grammar is what turns words into sentences.'
    };
  }
  if (unrehearsedDialogueId) {
    return {
      label: 'Role-play a dialogue',
      href: `#/conversation/${unrehearsedDialogueId}`,
      why: 'Speaking is the weakest link for most learners — practise out loud.'
    };
  }
  const weakest = readiness?.components?.slice().sort((a, b) => a.percent - b.percent)[0];
  if (weakest && weakest.percent < 100) {
    return {
      label: 'Practise your weakest area',
      href: '#/citizenship',
      why: `Your lowest score is "${weakest.label}" (${weakest.percent}%).`
    };
  }
  return {
    label: 'Play a game to keep it fresh',
    href: '#/games',
    why: 'Everything is up to date — nice work. Keep the habit going.'
  };
}
