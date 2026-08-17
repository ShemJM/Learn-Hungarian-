import { describe, it, expect } from 'vitest';
import { course } from './data/course.js';
import { lessons } from './data/lessons.js';
import { defaultProgress } from './progress.js';
import {
  stepDone,
  stepMeta,
  courseState,
  nextCourseStep,
  courseCompletion,
  eligibleReviewPool,
  LESSON_PASS,
  EXERCISE_PASS
} from './course.js';

describe('stepDone', () => {
  it('checks the right progress signal per step type', () => {
    const p = {
      quizScores: { greetings: LESSON_PASS },
      guidesRead: ['alphabet'],
      exerciseScores: { 'lesson:greetings': EXERCISE_PASS, 'verbs:present': EXERCISE_PASS },
      readingsDone: ['anna'],
      dialoguesDone: ['meeting']
    };
    expect(stepDone({ type: 'lesson', ref: 'greetings' }, p)).toBe(true);
    expect(stepDone({ type: 'lesson', ref: 'numbers' }, p)).toBe(false);
    expect(stepDone({ type: 'guide', ref: 'alphabet' }, p)).toBe(true);
    expect(stepDone({ type: 'practice', ref: 'lesson:greetings' }, p)).toBe(true);
    expect(stepDone({ type: 'practice', ref: 'lesson:numbers' }, p)).toBe(false);
    expect(stepDone({ type: 'reading', ref: 'anna' }, p)).toBe(true);
    expect(stepDone({ type: 'dialogue', ref: 'meeting' }, p)).toBe(true);
    expect(stepDone({ type: 'verbs', ref: 'present' }, p)).toBe(true);
    expect(stepDone({ type: 'verbs', ref: 'past' }, p)).toBe(false);
  });

  it('scores below the pass mark do not complete a step', () => {
    const p = { quizScores: { greetings: LESSON_PASS - 1 }, exerciseScores: { 'lesson:greetings': EXERCISE_PASS - 1 } };
    expect(stepDone({ type: 'lesson', ref: 'greetings' }, p)).toBe(false);
    expect(stepDone({ type: 'practice', ref: 'lesson:greetings' }, p)).toBe(false);
  });

  it('survives a legacy progress blob with no exercise-era keys at all', () => {
    const legacy = { quizScores: { greetings: 80 }, guidesRead: [], readingsDone: [], dialoguesDone: [] };
    expect(stepDone({ type: 'practice', ref: 'lesson:greetings' }, legacy)).toBe(false);
    expect(stepDone({ type: 'checkpoint', ref: 'checkpoint:u1' }, legacy)).toBe(false);
    expect(stepDone({ type: 'verbs', ref: 'past' }, legacy)).toBe(false);
  });
});

describe('stepsSkipped', () => {
  it('a skipped step counts as done regardless of type', () => {
    const types = [
      { id: 's1', type: 'lesson', ref: 'greetings' },
      { id: 's2', type: 'guide', ref: 'alphabet' },
      { id: 's3', type: 'practice', ref: 'lesson:greetings' },
      { id: 's4', type: 'reading', ref: 'anna' },
      { id: 's5', type: 'dialogue', ref: 'meeting' },
      { id: 's6', type: 'verbs', ref: 'past' },
      { id: 's7', type: 'checkpoint', ref: 'checkpoint:u1' }
    ];
    const p = { stepsSkipped: types.map((s) => s.id) };
    for (const step of types) expect(stepDone(step, p), step.type).toBe(true);
  });

  it('skipping all of unit 1 moves the next step into unit 2 and counts completion', () => {
    const p = { ...defaultProgress(), stepsSkipped: course[0].steps.map((s) => s.id) };
    expect(nextCourseStep(course, p).unit.id).toBe('u2');
    expect(courseCompletion(course, p).unitsDone).toBe(1);
    expect(courseCompletion(course, p).doneSteps).toBe(course[0].steps.length);
  });

  it('legacy blobs without the key behave as before', () => {
    const legacy = { quizScores: {}, guidesRead: [], readingsDone: [], dialoguesDone: [] };
    expect(stepDone({ id: 'u1-alphabet', type: 'guide', ref: 'alphabet' }, legacy)).toBe(false);
  });
});

describe('nextCourseStep', () => {
  it('starts a fresh learner at the very first step', () => {
    const next = nextCourseStep(course, defaultProgress());
    expect(next.unit.id).toBe('u1');
    expect(next.step.id).toBe('u1-alphabet');
    expect(next.index).toBe(0);
    expect(next.href).toBe('#/grammar/alphabet');
  });

  it('skips completed steps, crossing unit boundaries', () => {
    const p = defaultProgress();
    // Complete all of unit 1.
    p.guidesRead = ['alphabet'];
    p.quizScores = { greetings: 80 };
    p.exerciseScores = {
      'grammar:alphabet': 90,
      'lesson:greetings': 90,
      'checkpoint:u1': 80
    };
    p.dialoguesDone = ['meeting'];
    const next = nextCourseStep(course, p);
    expect(next.unit.id).toBe('u2');
    expect(next.step.id).toBe('u2-numbers');
  });

  it('gives a legacy learner (quiz history only) a mid-course next step without crashing', () => {
    const legacy = {
      quizScores: { greetings: 100, numbers: 90 },
      guidesRead: ['alphabet', 'vowel-harmony'],
      dialoguesDone: ['meeting', 'cafe'],
      readingsDone: []
      // no exerciseScores, no lessonsStarted — pre-course save
    };
    const next = nextCourseStep(course, legacy);
    expect(next).not.toBeNull();
    expect(next.unit.id).toBe('u1'); // the new practice steps are still to do
    expect(next.step.type).toBe('practice');
  });

  it('returns null when every step of every unit is done', () => {
    const p = {
      quizScores: Object.fromEntries(lessons.map((l) => [l.id, 100])),
      guidesRead: course.flatMap((u) => u.steps.filter((s) => s.type === 'guide').map((s) => s.ref)),
      readingsDone: course.flatMap((u) => u.steps.filter((s) => s.type === 'reading').map((s) => s.ref)),
      dialoguesDone: course.flatMap((u) => u.steps.filter((s) => s.type === 'dialogue').map((s) => s.ref)),
      exerciseScores: Object.fromEntries(
        course.flatMap((u) =>
          u.steps
            .filter((s) => ['practice', 'checkpoint'].includes(s.type))
            .map((s) => [s.ref, 100])
            .concat(u.steps.filter((s) => s.type === 'verbs').map((s) => ['verbs:' + s.ref, 100]))
        )
      )
    };
    expect(nextCourseStep(course, p)).toBeNull();
    expect(courseCompletion(course, p).percent).toBe(100);
  });
});

describe('courseState', () => {
  it('marks exactly one step as next', () => {
    const state = courseState(course, defaultProgress());
    const nextSteps = state.flatMap((u) => u.steps.filter((s) => s.isNext));
    expect(nextSteps.length).toBe(1);
    expect(state[0].current).toBe(true);
  });

  it('counts done steps per unit', () => {
    const p = defaultProgress();
    p.guidesRead = ['alphabet'];
    const state = courseState(course, p);
    expect(state[0].doneCount).toBe(1);
    expect(state[0].done).toBe(false);
  });
});

describe('courseCompletion', () => {
  it('starts at zero and counts totals over all units', () => {
    const c = courseCompletion(course, defaultProgress());
    expect(c.doneSteps).toBe(0);
    expect(c.percent).toBe(0);
    expect(c.totalUnits).toBe(course.length);
    expect(c.totalSteps).toBe(course.reduce((n, u) => n + u.steps.length, 0));
  });
});

describe('stepMeta', () => {
  it('resolves titles and hrefs from the referenced content', () => {
    expect(stepMeta({ type: 'lesson', ref: 'greetings' })).toEqual({
      title: 'Greetings & Essentials',
      icon: '👋',
      href: '#/lessons/greetings'
    });
    expect(stepMeta({ type: 'checkpoint', ref: 'checkpoint:u1' }).title).toContain('First Words');
    expect(stepMeta({ type: 'verbs', ref: 'past' }).href).toBe('#/verbs');
  });
});

describe('eligibleReviewPool', () => {
  it('is empty for a brand-new learner — vocabulary follows the course', () => {
    expect(eligibleReviewPool(lessons, defaultProgress())).toEqual([]);
  });

  it('releases words AND phrases of started lessons, with collision-safe phrase keys', () => {
    const p = { ...defaultProgress(), lessonsStarted: ['greetings'] };
    const pool = eligibleReviewPool(lessons, p);
    const greetings = lessons.find((l) => l.id === 'greetings');
    expect(pool.length).toBe(greetings.words.length + greetings.phrases.length);
    const phrases = pool.filter((c) => c.isPhrase);
    expect(phrases.length).toBe(greetings.phrases.length);
    expect(phrases.every((c) => c.key.startsWith('p:'))).toBe(true);
    expect(pool.filter((c) => !c.isPhrase).every((c) => c.key === c.hu)).toBe(true);
  });

  it('keeps the deck of a legacy learner: quizzed lessons and existing SRS entries stay in', () => {
    const p = {
      ...defaultProgress(),
      quizScores: { numbers: 80 }, // legacy signal: quizzed = started
      srs: { Köszönöm: { box: 3, last: 100 } } // reviewed before gating existed
    };
    const pool = eligibleReviewPool(lessons, p);
    expect(pool.some((c) => c.lessonId === 'numbers')).toBe(true);
    expect(pool.some((c) => c.hu === 'Köszönöm')).toBe(true);
    // But un-started lessons stay out.
    expect(pool.some((c) => c.lessonId === 'adjectives')).toBe(false);
  });
});
