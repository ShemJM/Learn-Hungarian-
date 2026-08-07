import { describe, it, expect } from 'vitest';
import { streak, vocabMastery, lastVisitActivity, relativeDay, examReadiness, nextAction, reviewDue, MASTERY_BOX } from './stats.js';
import { dayStamp } from './srs.js';

const DAY = 86400000;
const NOW = Date.UTC(2026, 6, 14, 12, 0, 0);
const TODAY = dayStamp(NOW);

describe('streak', () => {
  it('is zero with no activity', () => {
    expect(streak([], TODAY)).toBe(0);
  });

  it('counts consecutive days ending today', () => {
    expect(streak([TODAY - 2, TODAY - 1, TODAY], TODAY)).toBe(3);
  });

  it('survives until a whole day is missed', () => {
    expect(streak([TODAY - 2, TODAY - 1], TODAY)).toBe(2); // yesterday still counts
    expect(streak([TODAY - 3, TODAY - 2], TODAY)).toBe(0); // nothing since the day before yesterday
  });

  it('breaks on a gap and ignores duplicate days', () => {
    expect(streak([TODAY - 9, TODAY - 1, TODAY, TODAY], TODAY)).toBe(2);
  });
});

describe('vocabMastery', () => {
  const words = [{ hu: 'a' }, { hu: 'b' }, { hu: 'c' }, { hu: 'd' }];

  it('splits words into mastered, learning and unseen', () => {
    const srs = { a: { box: MASTERY_BOX }, b: { box: 5 }, c: { box: 2 } };
    expect(vocabMastery(words, srs)).toEqual({
      total: 4,
      mastered: 2,
      learning: 1,
      unseen: 1,
      percent: 50
    });
  });

  it('handles an empty course and empty srs', () => {
    expect(vocabMastery([], {}).percent).toBe(0);
    expect(vocabMastery(words, {}).unseen).toBe(4);
  });
});

describe('lastVisitActivity', () => {
  it('returns only entries from the previous visit', () => {
    const visit = { previous: 1000, current: 2000 };
    const activity = [
      { t: 2500, label: 'this visit' },
      { t: 1500, label: 'last visit' },
      { t: 1000, label: 'last visit, at its start' },
      { t: 500, label: 'older still' }
    ];
    expect(lastVisitActivity(activity, visit).map((a) => a.label)).toEqual([
      'last visit',
      'last visit, at its start'
    ]);
  });

  it('is empty on a first-ever visit', () => {
    expect(lastVisitActivity([{ t: 1 }], { current: 2000, previous: null })).toEqual([]);
  });
});

describe('relativeDay', () => {
  it('describes the gap in human terms', () => {
    expect(relativeDay(NOW - 1000, NOW)).toBe('earlier today');
    expect(relativeDay(NOW - DAY, NOW)).toBe('yesterday');
    expect(relativeDay(NOW - 3 * DAY, NOW)).toBe('3 days ago');
    expect(relativeDay(NOW - 10 * DAY, NOW)).toBe('last week');
    expect(relativeDay(NOW - 21 * DAY, NOW)).toBe('3 weeks ago');
    expect(relativeDay(null, NOW)).toBeNull();
  });
});

describe('examReadiness', () => {
  const plan = {
    words: [{ hu: 'a' }, { hu: 'b' }],
    dialogueIds: ['d1', 'd2'],
    guideIds: ['g1'],
    phrases: ['p1', 'p2']
  };

  it('is zero for a learner who has done nothing', () => {
    const r = examReadiness({}, plan);
    expect(r.overall).toBe(0);
    expect(r.components.map((c) => c.key)).toEqual(['vocabulary', 'dialogues', 'grammar', 'speaking']);
  });

  it('averages the components and explains each one', () => {
    const r = examReadiness(
      {
        srs: { a: { box: 5 }, b: { box: 1 } }, // 50% vocabulary
        dialoguesDone: ['d1'], // 50% dialogues
        guidesRead: ['g1'], // 100% grammar
        pronunciationStars: { p1: 0.9, p2: 0.4 } // 50% speaking (0.4 is below the bar)
      },
      plan
    );
    expect(r.components.map((c) => c.percent)).toEqual([50, 50, 100, 50]);
    expect(r.overall).toBe(63); // mean of 50/50/100/50 = 62.5, rounded
    expect(r.components[0].detail).toContain('1 of 2 words');
  });

  it('does not divide by zero when part of the plan is empty', () => {
    const r = examReadiness({}, { words: [], dialogueIds: [], guideIds: [], phrases: [] });
    expect(r.overall).toBe(0);
  });
});

describe('reviewDue', () => {
  const words = [{ hu: 'a' }, { hu: 'b' }, { hu: 'c' }];

  it('ignores words the learner has never seen', () => {
    expect(reviewDue(words, {}, TODAY)).toBe(0); // new words are not "forgotten"
  });

  it('counts only seen words whose interval has elapsed', () => {
    const srs = {
      a: { box: 1, last: TODAY - 1 }, // box 1 = due every day
      b: { box: 3, last: TODAY - 1 }, // box 3 waits 2 days — not yet
      c: { box: 3, last: TODAY - 5 } // long overdue
    };
    expect(reviewDue(words, srs, TODAY)).toBe(2);
  });
});

describe('nextAction', () => {
  const step = {
    unit: { id: 'u2', title: 'Numbers & Harmony' },
    title: 'Vowel Harmony',
    href: '#/grammar/vowel-harmony',
    index: 1,
    total: 6
  };

  it('sends a brand-new learner to the course, never to a pile of reviews', () => {
    const action = nextAction({ dueCount: 157, hasStarted: false, nextStep: step });
    expect(action.href).toBe('#/course');
    expect(action.label).toBe('Start the course');
  });

  it('prioritises due reviews for a learner who has started', () => {
    const action = nextAction({ dueCount: 7, hasStarted: true, nextStep: step });
    expect(action.href).toBe('#/review');
    expect(action.label).toContain('7 cards');
  });

  it('continues the course when nothing is due', () => {
    const action = nextAction({ dueCount: 0, nextStep: step });
    expect(action.href).toBe('#/grammar/vowel-harmony');
    expect(action.label).toContain('Numbers & Harmony');
    expect(action.label).toContain('Vowel Harmony');
    expect(action.why).toContain('Step 2 of 6');
  });

  it('falls back to the weakest readiness component, then to games, once the course is done', () => {
    const readiness = { components: [{ label: 'Speaking', percent: 20 }, { label: 'Vocab', percent: 90 }] };
    expect(nextAction({ dueCount: 0, readiness }).why).toContain('Speaking');
    const done = { components: [{ label: 'Speaking', percent: 100 }] };
    expect(nextAction({ dueCount: 0, readiness: done }).href).toBe('#/games');
  });
});
