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
    navigate('#/games/scramble');
    expect(target.textContent).toContain('Word Scramble');
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
  });

  it('falls back to home for unknown routes', () => {
    navigate('#/does-not-exist');
    expect(target.textContent).toContain('Üdvözöllek');
  });
});
