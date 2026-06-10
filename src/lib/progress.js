/**
 * Learner progress, persisted to localStorage as a Svelte store.
 * Tracks quiz scores per lesson, known flashcard words, game best scores,
 * completed readings and practised dialogues.
 */
import { writable } from 'svelte/store';

const KEY = 'learn-hungarian-progress-v1';

export function defaultProgress() {
  return {
    quizScores: {},      // lessonId -> best percent
    knownWords: [],      // hungarian words marked as known
    gameBest: {},        // gameId -> best score
    readingsDone: [],    // reading ids
    dialoguesDone: [],   // dialogue ids
    pronunciationStars: {} // phrase -> best score 0..1
  };
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
    recordQuiz: (lessonId, percent) =>
      mutate((p) => {
        p.quizScores[lessonId] = Math.max(p.quizScores[lessonId] || 0, percent);
        return p;
      }),
    toggleKnownWord: (hu) =>
      mutate((p) => {
        p.knownWords = p.knownWords.includes(hu) ? p.knownWords.filter((w) => w !== hu) : [...p.knownWords, hu];
        return p;
      }),
    recordGame: (gameId, score) =>
      mutate((p) => {
        p.gameBest[gameId] = Math.max(p.gameBest[gameId] || 0, score);
        return p;
      }),
    markReadingDone: (id) =>
      mutate((p) => {
        if (!p.readingsDone.includes(id)) p.readingsDone.push(id);
        return p;
      }),
    markDialogueDone: (id) =>
      mutate((p) => {
        if (!p.dialoguesDone.includes(id)) p.dialoguesDone.push(id);
        return p;
      }),
    recordPronunciation: (phrase, score) =>
      mutate((p) => {
        p.pronunciationStars[phrase] = Math.max(p.pronunciationStars[phrase] || 0, score);
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
