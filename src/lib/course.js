/**
 * Pure logic for the guided course: which steps count as done, what the
 * learner should do next, and which vocabulary the course has released into
 * the spaced-repetition pool.
 *
 * Everything guards against progress blobs saved before these features
 * existed (no exerciseScores / lessonsStarted keys) — legacy learners keep
 * their history and land on a sensible next step.
 */
import { getLesson } from './data/lessons.js';
import { getGuide } from './data/grammar.js';
import { getReading } from './data/readings.js';
import { getDialogue } from './data/dialogues.js';
import { getExerciseSet } from './exercises.js';

/** A lesson quiz at or above this percent completes its course step. */
export const LESSON_PASS = 60;

/** An exercise set (practice, checkpoint, drill) at or above this percent passes. */
export const EXERCISE_PASS = 70;

/** Whether one course step is complete, given the learner's progress. */
export function stepDone(step, p) {
  // A step the learner marked as already known counts as done. Skipping a
  // lesson deliberately does NOT release its vocabulary into the SRS pool —
  // "I know this" shouldn't flood the review deck; opening the lesson still
  // calls markLessonStarted for learners who change their mind.
  if (p.stepsSkipped?.includes(step.id)) return true;
  switch (step.type) {
    case 'lesson':
      return (p.quizScores?.[step.ref] || 0) >= LESSON_PASS;
    case 'guide':
      return (p.guidesRead || []).includes(step.ref);
    case 'practice':
    case 'checkpoint':
      return (p.exerciseScores?.[step.ref] || 0) >= EXERCISE_PASS;
    case 'reading':
      return (p.readingsDone || []).includes(step.ref);
    case 'dialogue':
      return (p.dialoguesDone || []).includes(step.ref);
    case 'verbs':
      return (p.exerciseScores?.['verbs:' + step.ref] || 0) >= EXERCISE_PASS;
    default:
      return false;
  }
}

/** Display title, icon and href for a step, resolved from the referenced content. */
export function stepMeta(step) {
  switch (step.type) {
    case 'lesson': {
      const l = getLesson(step.ref);
      return { title: l?.title ?? step.ref, icon: l?.icon ?? '📚', href: '#/lessons/' + step.ref };
    }
    case 'guide': {
      const g = getGuide(step.ref);
      return { title: g?.title ?? step.ref, icon: g?.icon ?? '🧩', href: '#/grammar/' + step.ref };
    }
    case 'practice': {
      const set = getExerciseSet(step.ref);
      return { title: set?.title ?? step.ref, icon: '✏️', href: '#/practice/' + step.ref };
    }
    case 'checkpoint': {
      const set = getExerciseSet(step.ref);
      return { title: set?.title ?? 'Checkpoint', icon: '🏁', href: '#/practice/' + step.ref };
    }
    case 'reading': {
      const r = getReading(step.ref);
      return { title: r?.title ?? step.ref, icon: '📖', href: '#/reading/' + step.ref };
    }
    case 'dialogue': {
      const d = getDialogue(step.ref);
      return { title: d?.title ?? step.ref, icon: '💬', href: '#/conversation/' + step.ref };
    }
    case 'verbs':
      return { title: `Verb drill (${step.ref} tense)`, icon: '🏋️', href: '#/verbs' };
    default:
      return { title: step.ref, icon: '❓', href: '#/course' };
  }
}

/**
 * The whole course annotated with progress: every step gets done/isNext, and
 * each unit reports its done-count. Exactly one step is `isNext` (the first
 * not-done one) unless the course is finished.
 */
export function courseState(course, p) {
  let nextFound = false;
  return course.map((unit) => {
    const steps = unit.steps.map((step) => {
      const done = stepDone(step, p);
      const isNext = !done && !nextFound;
      if (isNext) nextFound = true;
      return { step, done, isNext };
    });
    const doneCount = steps.filter((s) => s.done).length;
    return { unit, steps, doneCount, done: doneCount === steps.length, current: steps.some((s) => s.isNext) };
  });
}

/**
 * The learner's single next step: the first not-done step in course order,
 * with its unit and position. Null when the whole course is complete.
 */
export function nextCourseStep(course, p) {
  for (const unit of course) {
    for (let i = 0; i < unit.steps.length; i++) {
      const step = unit.steps[i];
      if (!stepDone(step, p)) {
        return { unit, step, index: i, total: unit.steps.length, ...stepMeta(step) };
      }
    }
  }
  return null;
}

/** Overall completion: steps done, total, percent, and fully-finished units. */
export function courseCompletion(course, p) {
  let doneSteps = 0;
  let totalSteps = 0;
  let unitsDone = 0;
  for (const unit of course) {
    const done = unit.steps.filter((s) => stepDone(s, p)).length;
    doneSteps += done;
    totalSteps += unit.steps.length;
    if (done === unit.steps.length) unitsDone += 1;
  }
  return {
    doneSteps,
    totalSteps,
    percent: totalSteps ? Math.round((doneSteps / totalSteps) * 100) : 0,
    unitsDone,
    totalUnits: course.length
  };
}

/**
 * The review cards the course has released so far: words AND phrases of every
 * started lesson, plus anything that already has SRS history (so learners from
 * before course gating keep their whole deck). Quiz scores count as a legacy
 * "started" signal. Course progression — not the calendar — introduces new
 * vocabulary; buildSession's maxNew still smooths the daily rate.
 */
export function eligibleReviewPool(lessons, p) {
  const started = new Set([...(p.lessonsStarted || []), ...Object.keys(p.quizScores || {})]);
  const srs = p.srs || {};
  return lessons.flatMap((l) => {
    const items = [
      ...l.words.map((w) => ({ ...w, key: w.hu, lessonId: l.id })),
      ...(l.phrases || []).map((ph) => ({ ...ph, key: 'p:' + ph.hu, isPhrase: true, lessonId: l.id }))
    ];
    return items.filter((it) => started.has(l.id) || srs[it.key]);
  });
}
