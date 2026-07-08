<script>
  import { onDestroy } from 'svelte';
  import { allWords } from '../data/lessons.js';
  import { checkAnswer } from '../text.js';
  import { checkPronunciation, recognitionAvailable } from '../speech.js';
  import { progress } from '../progress.js';
  import { spellableWords, buildDeck, isCardWin, PRONOUNCE_THRESHOLD } from './spellsay.js';

  const ROUND_SECONDS = 60;
  const recognitionSupported = recognitionAvailable();
  const pool = spellableWords(allWords());

  let stage = $state('ready'); // ready | playing | done
  let deck = $state([]);
  let index = $state(0);
  let phase = $state('spelling'); // spelling | pronounce | revealed
  let guess = $state('');
  let spellWrong = $state(false);
  let pronStatus = $state('idle'); // idle | listening | done | error
  let pronResult = $state(null); // { transcript, score }
  let pronError = $state('');
  let cardsWon = $state(0);
  let cardsSpelled = $state(0);
  let secondsLeft = $state(ROUND_SECONDS);
  let swipeClass = $state('');

  let timerId = null;

  let current = $derived(deck[index]);
  let pronTone = $derived(
    !pronResult ? null : pronResult.score >= PRONOUNCE_THRESHOLD ? 'good' : pronResult.score >= 0.45 ? 'mid' : 'bad'
  );
  let pronEmoji = $derived(pronTone === 'good' ? '✅' : pronTone === 'mid' ? '🙂' : pronTone === 'bad' ? '🔁' : '');

  function resetCard() {
    phase = 'spelling';
    guess = '';
    spellWrong = false;
    pronStatus = 'idle';
    pronResult = null;
    pronError = '';
  }

  function refillDeckIfNeeded() {
    if (index >= deck.length) {
      deck = buildDeck(pool);
      index = 0;
    }
  }

  function start() {
    deck = buildDeck(pool);
    index = 0;
    resetCard();
    cardsWon = 0;
    cardsSpelled = 0;
    secondsLeft = ROUND_SECONDS;
    swipeClass = '';
    stage = 'playing';

    clearInterval(timerId);
    timerId = setInterval(() => {
      secondsLeft -= 1;
      if (secondsLeft <= 0) endRound();
    }, 1000);
  }

  function endRound() {
    clearInterval(timerId);
    timerId = null;
    stage = 'done';
    progress.recordGame('spellsay', cardsWon);
  }

  onDestroy(() => clearInterval(timerId));

  function submitSpelling() {
    if (!guess.trim() || phase !== 'spelling') return;
    const result = checkAnswer(guess, current.en);
    if (result === 'wrong') {
      spellWrong = true;
      return;
    }
    spellWrong = false;
    cardsSpelled += 1;
    if (!recognitionSupported) {
      cardsWon += 1;
      goNext();
    } else {
      phase = 'pronounce';
    }
  }

  function reveal() {
    phase = 'revealed';
    setTimeout(() => {
      if (stage === 'playing') goNext();
    }, 900);
  }

  async function sayIt() {
    pronStatus = 'listening';
    pronError = '';
    try {
      const result = await checkPronunciation(current.en, { lang: 'en-US' });
      if (stage !== 'playing' || phase !== 'pronounce') return;
      pronResult = result;
      pronStatus = 'done';
    } catch (e) {
      if (stage !== 'playing' || phase !== 'pronounce') return;
      pronError = e.message;
      pronStatus = 'error';
    }
  }

  function goNext() {
    if (phase === 'pronounce') {
      const score = pronResult ? pronResult.score : 0;
      if (isCardWin({ spelled: true, pronScore: score, recognitionSupported: true })) cardsWon += 1;
    }
    swipeClass = 'swipe-out';
    setTimeout(() => {
      index += 1;
      refillDeckIfNeeded();
      resetCard();
      swipeClass = 'swipe-enter';
      requestAnimationFrame(() => {
        swipeClass = '';
      });
    }, 260);
  }
</script>

<h1>⏱️ Spell & Say Sprint</h1>

{#if stage === 'ready'}
  <div class="card center">
    <p class="muted">
      An English word appears. Type it, say it out loud, and see how many you can nail in 60 seconds.
      Get the spelling wrong? Just try again. Stuck? Reveal the answer and it'll swipe on to the next one.
    </p>
    {#if !recognitionSupported}
      <p class="muted small">
        🎤 Your browser doesn't support speech recognition — this round will score spelling only. Try Chrome or Edge
        for the full experience.
      </p>
    {/if}
    {#if $progress.gameBest['spellsay']}
      <p class="muted">🏆 Best: {$progress.gameBest['spellsay']}</p>
    {/if}
    <button class="btn primary" onclick={start}>▶️ Start</button>
  </div>
{:else if stage === 'playing' && current}
  <div class="status">
    <span class="pill">⏱️ {secondsLeft}s</span>
    <span class="pill green">✅ {cardsWon}</span>
  </div>
  <div class="arena">
    <div class="card word-card {swipeClass}">
      {#if phase === 'spelling'}
        <p class="label muted">Spell this word:</p>
        <p class="word">{current.en}</p>
        <form
          onsubmit={(e) => {
            e.preventDefault();
            submitSpelling();
          }}
        >
          <!-- svelte-ignore a11y_autofocus -->
          <input
            type="text"
            bind:value={guess}
            placeholder="Type the word…"
            autocomplete="off"
            autocapitalize="off"
            autofocus
          />
          <div class="actions">
            <button class="btn primary" type="submit">Check</button>
            <button class="btn" type="button" onclick={reveal}>🙈 Reveal</button>
          </div>
        </form>
        {#if spellWrong}
          <p class="pill">❌ Not quite — try again!</p>
        {/if}
      {:else if phase === 'pronounce'}
        <p class="pill green">✅ Spelled it!</p>
        <p class="word">{current.en}</p>
        {#if pronStatus === 'idle' || pronStatus === 'error'}
          <div class="actions">
            <button class="btn primary" onclick={sayIt}>🎤 Say it</button>
            <button class="btn" type="button" onclick={goNext}>Skip →</button>
          </div>
          {#if pronStatus === 'error'}
            <p class="pill">{pronError}</p>
          {/if}
        {:else if pronStatus === 'listening'}
          <button class="btn primary" disabled>🎙️ Listening…</button>
        {:else if pronStatus === 'done'}
          <div class="pron-result" class:good={pronTone === 'good'} class:bad={pronTone === 'bad'}>
            <strong>{pronEmoji} {Math.round(pronResult.score * 100)}%</strong>
            {#if pronResult.transcript}
              <div class="muted small">We heard: „{pronResult.transcript}"</div>
            {/if}
          </div>
          <div class="actions">
            <button class="btn" onclick={sayIt}>🔁 Try again</button>
            <button class="btn primary" onclick={goNext}>Next ▶</button>
          </div>
        {/if}
      {:else if phase === 'revealed'}
        <p class="pill">The word was:</p>
        <p class="word">{current.en}</p>
      {/if}
    </div>
  </div>
{:else if stage === 'done'}
  <div class="card center">
    <h2>🏁 Time's up!</h2>
    <p class="result-big">You got <strong>{cardsWon}</strong> word{cardsWon === 1 ? '' : 's'} right!</p>
    <p class="muted">
      Spelled correctly: {cardsSpelled}{#if recognitionSupported} · Fully correct (spelling + pronunciation): {cardsWon}{/if}
    </p>
    {#if $progress.gameBest['spellsay']}
      <p class="muted">🏆 Best: {$progress.gameBest['spellsay']}</p>
    {/if}
    <button class="btn primary" onclick={start}>🔁 Play again</button>
  </div>
{/if}

<style>
  .center {
    text-align: center;
  }
  .status {
    display: flex;
    justify-content: center;
    gap: 0.5rem;
    margin-bottom: 1rem;
  }
  .arena {
    min-height: 60vh;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 1rem 0;
  }
  .word-card {
    width: min(520px, 92vw);
    min-height: 340px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 0.5rem;
    text-align: center;
    transition: transform 0.25s ease, opacity 0.25s ease;
  }
  .word-card.swipe-out {
    transform: translateX(-120%) rotate(-6deg);
    opacity: 0;
  }
  .word-card.swipe-enter {
    transition: none;
    transform: translateX(120%);
    opacity: 0;
  }
  .label {
    margin: 0;
  }
  .word {
    font-size: 2.2rem;
    font-weight: 800;
    margin: 0.5rem 0 1rem;
  }
  input {
    font: inherit;
    font-size: 1.1rem;
    padding: 0.6rem 0.9rem;
    border-radius: 10px;
    border: 2px solid var(--border);
    width: min(320px, 100%);
    text-align: center;
  }
  input:focus {
    outline: none;
    border-color: var(--accent);
  }
  .actions {
    display: flex;
    justify-content: center;
    gap: 0.5rem;
    margin-top: 0.75rem;
    flex-wrap: wrap;
  }
  .pron-result {
    padding: 0.5rem 0.75rem;
    border-radius: 10px;
    background: var(--accent-soft);
  }
  .pron-result.good {
    background: var(--good-soft);
  }
  .pron-result.bad {
    background: var(--bad-soft);
  }
  .result-big {
    font-size: 1.2rem;
  }
  .small {
    font-size: 0.85rem;
  }
</style>
