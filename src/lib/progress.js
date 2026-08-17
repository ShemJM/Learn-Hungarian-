/**
 * Learner progress, persisted to localStorage as a Svelte store.
 * Tracks quiz scores per lesson, known flashcard words, game best scores,
 * completed readings and practised dialogues, plus the visit history the
 * dashboard needs (streak, "what you did last time", recent activity).
 */
import { writable } from 'svelte/store';
import { applyReview, dayStamp } from './srs.js';

const KEY = 'learn-hungarian-progress-v1';

/** Reloads within this window count as the same visit, not a new one. */
export const SESSION_GAP_MS = 30 * 60 * 1000;

/** How many recent activity entries to keep. */
export const ACTIVITY_LIMIT = 30;

export function defaultProgress() {
  return {
    quizScores: {},      // lessonId -> best percent
    knownWords: [],      // target-language words marked as known
    gameBest: {},        // gameId -> best score
    readingsDone: [],    // reading ids
    dialoguesDone: [],   // dialogue ids
    guidesRead: [],      // grammar guide ids opened
    pronunciationStars: {}, // phrase -> best score 0..1
    srs: {},             // srsKey -> { box: 1..5, last: dayStamp, reps, lapses } spaced-repetition state
    exerciseScores: {},  // exercise set id ('lesson:food', 'grammar:cases', 'checkpoint:u3', 'verbs:past') -> best percent
    lessonsStarted: [],  // lesson ids whose vocabulary has been released into the review pool
    stepsSkipped: [],    // course step ids the learner marked as already known
    activity: [],        // newest first: { t, type, id, label }
    daysActive: [],      // dayStamps on which the learner did something (ascending)
    visit: { current: null, previous: null } // epoch ms of this visit and the one before
  };
}

/** Record that the learner was active on the day of `now` (idempotent per day). */
function touchDay(p, now) {
  const day = dayStamp(now);
  if (!p.daysActive.includes(day)) p.daysActive = [...p.daysActive, day].sort((a, b) => a - b);
}

/** Push an activity entry, newest first, capped. */
function appendActivity(p, entry, now) {
  p.activity = [{ t: now, ...entry }, ...p.activity].slice(0, ACTIVITY_LIMIT);
  touchDay(p, now);
}

function load(storage) {
  try {
    const raw = storage?.getItem(KEY);
    if (!raw) return defaultProgress();
    return { ...defaultProgress(), ...JSON.parse(raw) };
  } catch {
    return defaultProgress();
  }
}

export function createProgressStore(storage = typeof localStorage !== 'undefined' ? localStorage : null) {
  const { subscribe, update, set } = writable(load(storage));

  function persist(value) {
    try {
      storage?.setItem(KEY, JSON.stringify(value));
    } catch {
      /* storage may be unavailable (private mode) — progress just won't persist */
    }
  }

  function mutate(fn) {
    update((p) => {
      const next = fn(structuredClone(p));
      persist(next);
      return next;
    });
  }

  return {
    subscribe,
    /**
     * Call once when the app loads. Rotates visit.current into visit.previous
     * so the dashboard can show "what you did last time", unless this is just
     * a reload within SESSION_GAP_MS.
     */
    startVisit: (now = Date.now()) =>
      mutate((p) => {
        const sameSession = p.visit.current && now - p.visit.current < SESSION_GAP_MS;
        if (!sameSession) {
          p.visit = { current: now, previous: p.visit.current ?? null };
        }
        touchDay(p, now);
        return p;
      }),
    recordQuiz: (lessonId, percent, now = Date.now()) =>
      mutate((p) => {
        p.quizScores[lessonId] = Math.max(p.quizScores[lessonId] || 0, percent);
        appendActivity(p, { type: 'quiz', id: lessonId, label: `Quiz: ${lessonId} — ${percent}%` }, now);
        return p;
      }),
    toggleKnownWord: (hu) =>
      mutate((p) => {
        p.knownWords = p.knownWords.includes(hu) ? p.knownWords.filter((w) => w !== hu) : [...p.knownWords, hu];
        return p;
      }),
    recordGame: (gameId, score, now = Date.now()) =>
      mutate((p) => {
        p.gameBest[gameId] = Math.max(p.gameBest[gameId] || 0, score);
        appendActivity(p, { type: 'game', id: gameId, label: `Game: ${gameId} — ${score} points` }, now);
        return p;
      }),
    markReadingDone: (id, now = Date.now()) =>
      mutate((p) => {
        if (!p.readingsDone.includes(id)) p.readingsDone.push(id);
        appendActivity(p, { type: 'reading', id, label: `Read: ${id}` }, now);
        return p;
      }),
    markDialogueDone: (id, now = Date.now()) =>
      mutate((p) => {
        if (!p.dialoguesDone.includes(id)) p.dialoguesDone.push(id);
        appendActivity(p, { type: 'dialogue', id, label: `Dialogue: ${id}` }, now);
        return p;
      }),
    markGuideRead: (id, now = Date.now()) =>
      mutate((p) => {
        if (p.guidesRead.includes(id)) return p; // don't spam the log on re-reads
        p.guidesRead.push(id);
        appendActivity(p, { type: 'guide', id, label: `Grammar guide: ${id}` }, now);
        return p;
      }),
    recordReview: (hu, correct, now = Date.now()) =>
      mutate((p) => {
        p.srs[hu] = applyReview(p.srs[hu], correct, dayStamp(now));
        touchDay(p, now); // individual cards are too noisy for the activity log
        return p;
      }),
    /** Called once when a review session ends, so the log gets one entry, not twenty. */
    logReviewSession: (cardCount, correctCount, now = Date.now()) =>
      mutate((p) => {
        appendActivity(
          p,
          { type: 'review', id: 'review', label: `Review: ${correctCount}/${cardCount} correct` },
          now
        );
        return p;
      }),
    recordExercises: (setId, percent, now = Date.now()) =>
      mutate((p) => {
        p.exerciseScores[setId] = Math.max(p.exerciseScores[setId] || 0, percent);
        appendActivity(p, { type: 'exercises', id: setId, label: `Practice: ${setId} — ${percent}%` }, now);
        return p;
      }),
    /**
     * Mark course steps as already known (idempotent union). label names what
     * was skipped in the activity log, e.g. the unit title. Logs only when
     * something actually changed.
     */
    skipSteps: (stepIds, label, now = Date.now()) =>
      mutate((p) => {
        const before = p.stepsSkipped.length;
        p.stepsSkipped = [...new Set([...p.stepsSkipped, ...stepIds])];
        if (p.stepsSkipped.length !== before) {
          appendActivity(p, { type: 'skip', id: label, label: `Marked "${label}" as known` }, now);
        }
        return p;
      }),
    /** Undo skipSteps. Silent — unmarking is bookkeeping, not an achievement. */
    unskipSteps: (stepIds, now = Date.now()) =>
      mutate((p) => {
        p.stepsSkipped = p.stepsSkipped.filter((id) => !stepIds.includes(id));
        touchDay(p, now);
        return p;
      }),
    /** Releases the lesson's words and phrases into the SRS review pool (idempotent). */
    markLessonStarted: (lessonId, now = Date.now()) =>
      mutate((p) => {
        if (!p.lessonsStarted.includes(lessonId)) p.lessonsStarted.push(lessonId);
        touchDay(p, now);
        return p;
      }),
    recordPronunciation: (phrase, score, now = Date.now()) =>
      mutate((p) => {
        p.pronunciationStars[phrase] = Math.max(p.pronunciationStars[phrase] || 0, score);
        touchDay(p, now);
        return p;
      }),
    reset: () => {
      const fresh = defaultProgress();
      persist(fresh);
      set(fresh);
    }
  };
}

export const progress = createProgressStore();
