import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { mount, unmount, flushSync } from 'svelte';
import App from './App.svelte';

describe('App (smoke test)', () => {
  let app;
  let target;

  beforeEach(() => {
    location.hash = '';
    target = document.createElement('div');
    document.body.appendChild(target);
    app = mount(App, { target });
    flushSync();
  });

  afterEach(() => {
    unmount(app);
    target.remove();
  });

  function navigate(hash) {
    location.hash = hash;
    window.dispatchEvent(new Event('hashchange'));
    flushSync();
  }

  it('renders the home page with the main navigation', () => {
    expect(target.textContent).toContain('Learn Hungarian');
    expect(target.textContent).toContain('Üdvözöllek');
    for (const label of ['Lessons', 'Grammar', 'Reading', 'Conversation', 'Pronunciation', "Roll your R's", 'Games', 'Citizenship']) {
      expect(target.textContent).toContain(label);
    }
  });

  it('routes to the lessons list', () => {
    navigate('#/lessons');
    expect(target.textContent).toContain('Greetings & Essentials');
    expect(target.textContent).toContain('Numbers');
  });

  it('routes to a single lesson and shows its vocabulary', () => {
    navigate('#/lessons/food');
    expect(target.textContent).toContain('Food & Drink');
    expect(target.textContent).toContain('kenyér');
    expect(target.textContent).toContain('bread');
  });

  it('routes to a grammar guide with tables', () => {
    navigate('#/grammar/vowel-harmony');
    expect(target.textContent).toContain('Vowel Harmony');
    expect(target.textContent).toContain('házban');
  });

  it('routes to a reading exercise', () => {
    navigate('#/reading/anna');
    expect(target.textContent).toContain('Anna Budapesten lakik');
    expect(target.textContent).toContain('Comprehension check');
  });

  it('routes to a dialogue', () => {
    navigate('#/conversation/cafe');
    expect(target.textContent).toContain('Jó napot kívánok');
    expect(target.textContent).toContain('Role-play');
  });

  it('routes to the games hub and a game', () => {
    navigate('#/games');
    expect(target.textContent).toContain('Matching Pairs');
    expect(target.textContent).toContain('Quick Fire');
    navigate('#/games/scramble');
    expect(target.textContent).toContain('Word Scramble');
  });

  it('routes to the reels feed and saves a reel', () => {
    navigate('#/reels');
    expect(target.textContent).toContain('For you');
    const reels = target.querySelectorAll('section.reel');
    expect(reels.length).toBeGreaterThan(5);
    expect(target.textContent).toContain('Swipe up');

    target.querySelector('[aria-label="Save reel"]').click();
    flushSync();
    expect(JSON.parse(localStorage.getItem('learn-hungarian-progress-v1')).reelsLiked).toHaveLength(1);

    [...target.querySelectorAll('[role="tab"]')].find((b) => b.textContent.includes('Saved')).click();
    flushSync();
    expect(target.querySelectorAll('section.reel')).toHaveLength(1);
    expect(target.querySelector('[aria-label="Unsave reel"]')).toBeTruthy();
  });

  it('shows the Due tab empty state and the feed settings sheet', () => {
    navigate('#/reels');
    [...target.querySelectorAll('[role="tab"]')].find((b) => b.textContent.includes('Due')).click();
    flushSync();
    expect(target.textContent).toContain('Nothing due right now');

    target.querySelector('.ring-btn').click();
    flushSync();
    expect(target.textContent).toContain('Tune your feed');
    expect(target.textContent).toContain('Lean-back mode');
    [...target.querySelectorAll('.chip')].find((c) => c.textContent.includes('Quick check')).click();
    flushSync();
    const prefs = JSON.parse(localStorage.getItem('learn-hungarian-progress-v1')).reelsPrefs;
    expect(prefs.types).not.toContain('quiz');
    expect(prefs.types).toContain('word');
  });

  it('routes to the quick fire game', () => {
    navigate('#/games/quickfire');
    expect(target.textContent).toContain('Quick Fire');
    expect(target.textContent).toContain('Start');
  });

  it('lists the puzzle games and the suffix lab on the games hub', () => {
    navigate('#/games');
    for (const title of ['Translation Crossword', 'Word Search', 'Suffix Lab']) {
      expect(target.textContent).toContain(title);
    }
  });

  it('renders a word search grid whose clues match hidden words', () => {
    navigate('#/games/wordsearch');
    expect(target.textContent).toContain('Word Search');
    const cells = target.querySelectorAll('.grid-ws .cell');
    expect(cells).toHaveLength(100); // normal level: 10 × 10
    expect(target.querySelectorAll('.clues li').length).toBeGreaterThanOrEqual(6);
    expect(target.textContent).toContain('Find the Hungarian for');
  });

  it('renders a crossword with numbered cells and across / down clues', () => {
    navigate('#/games/crossword');
    expect(target.textContent).toContain('Translation Crossword');
    expect(target.textContent).toContain('Across');
    expect(target.textContent).toContain('Down');
    expect(target.querySelectorAll('.grid-cw .cell').length).toBeGreaterThan(20);
    expect(target.querySelectorAll('.grid-cw .num').length).toBeGreaterThanOrEqual(5);
    expect(target.querySelector('.current')).toBeTruthy();

    // Reveal the active word: its cells fill in and its clue is struck through.
    [...target.querySelectorAll('button')].find((b) => b.textContent.includes('Reveal this word')).click();
    flushSync();
    expect(target.querySelector('.clues li.solved')).toBeTruthy();
  });

  it('runs a suffix lab drill from setup to the first answer', () => {
    navigate('#/games/suffixlab');
    expect(target.textContent).toContain('Suffix Lab');
    expect(target.textContent).toContain('Verb endings: present');
    expect(target.textContent).toContain('Case endings');

    [...target.querySelectorAll('button')].find((b) => b.textContent.includes('Start')).click();
    flushSync();
    expect(target.textContent).toContain('1 / 10');
    const choices = target.querySelectorAll('.choice');
    expect(choices.length).toBeGreaterThanOrEqual(2);
    expect(choices.length).toBeLessThanOrEqual(4);
    for (const c of choices) expect(c.textContent.trim()).toMatch(/^-/);

    choices[0].click();
    flushSync();
    expect(target.textContent).toMatch(/Helyes|Not this time/);
    expect(target.textContent).toMatch(/vowels/); // the one-line harmony explanation
    expect(target.textContent).toContain('Next →');
  });

  it('opens the suffix lab from the grammar guides page', () => {
    navigate('#/grammar');
    expect(target.textContent).toContain('Suffix Lab');
    expect(target.querySelector('a[href="#/games/suffixlab"]')).toBeTruthy();
  });

  it('shows alphabet practice on the pronunciation page', () => {
    navigate('#/pronunciation');
    expect(target.textContent).toContain('Alphabet Practice');
    expect(target.textContent).toContain('bicikli');
  });

  it('routes to the rolled R trainer', () => {
    navigate('#/rolled-r');
    expect(target.textContent).toContain('Roll Your R');
    expect(target.textContent).toContain('róka');
  });

  it('routes to the citizenship interview prep section', () => {
    navigate('#/citizenship');
    expect(target.textContent).toContain('Citizenship Interview Prep');
    expect(target.textContent).toContain('Build your own answers');
    expect(target.textContent).toContain('Introduce yourself out loud');
  });

  it('saves a workbook answer to localStorage and shows it again after a remount', () => {
    navigate('#/citizenship');
    expect(target.textContent).toContain('My interview workbook');

    const box = target.querySelector('#ans-personal-name');
    expect(box).toBeTruthy();
    box.value = 'A nevem Anna.';
    box.dispatchEvent(new Event('input', { bubbles: true }));
    flushSync();

    expect(localStorage.getItem('learn-hungarian-workbook-v1')).toContain('A nevem Anna.');

    // Remounting is the closest thing to a page reload: the answer must come back.
    unmount(app);
    target.remove();
    target = document.createElement('div');
    document.body.appendChild(target);
    app = mount(App, { target });
    flushSync();
    navigate('#/citizenship');
    expect(target.querySelector('#ans-personal-name').value).toBe('A nevem Anna.');
  });

  it('falls back to home for unknown routes', () => {
    navigate('#/does-not-exist');
    expect(target.textContent).toContain('Üdvözöllek');
  });
});
