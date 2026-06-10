<script>
  import { allWords } from '../data/lessons.js';
  import { sample, scrambleWord, checkAnswer } from '../text.js';
  import { progress } from '../progress.js';
  import { speak } from '../speech.js';

  const ROUNDS = 8;

  let rounds = $state([]);
  let index = $state(0);
  let guess = $state('');
  let status = $state('playing'); // playing | revealed | done
  let lastResult = $state(null); // 'exact' | 'accents' | 'wrong' | 'gaveup'
  let score = $state(0);

  function newGame() {
    // Single words only (no spaces) and at least 3 letters scramble nicely.
    const candidates = allWords().filter((w) => !w.hu.includes(' ') && w.hu.length >= 3);
    rounds = sample(candidates, ROUNDS).map((w) => ({ word: w, scrambled: scrambleWord(w.hu.toLowerCase()) }));
    index = 0;
    guess = '';
    status = 'playing';
    lastResult = null;
    score = 0;
  }

  newGame();

  let current = $derived(rounds[index]);

  function submit() {
    if (!guess.trim()) return;
    const result = checkAnswer(guess, current.word.hu);
    lastResult = result;
    if (result === 'exact') score += 10;
    else if (result === 'accents') score += 7;
    if (result !== 'wrong') {
      speak(current.word.hu);
      status = 'revealed';
    }
  }

  function giveUp() {
    lastResult = 'gaveup';
    speak(current.word.hu);
    status = 'revealed';
  }

  function next() {
    if (index + 1 >= rounds.length) {
      status = 'done';
      progress.recordGame('scramble', score);
    } else {
      index += 1;
      guess = '';
      status = 'playing';
      lastResult = null;
    }
  }
</script>

<h1>🔀 Word Scramble</h1>
<p class="muted">
  Unscramble the Hungarian word. The English meaning is your clue. Full points for perfect accents,
  7/10 if only the accents are off.
</p>

{#if status === 'done'}
  <div class="card center">
    <h2>🏁 Final score: {score} / {ROUNDS * 10}</h2>
    {#if $progress.gameBest['scramble']}
      <p class="muted">🏆 Best: {$progress.gameBest['scramble']}</p>
    {/if}
    <button class="btn primary" onclick={newGame}>🔁 Play again</button>
  </div>
{:else if current}
  <div class="card center">
    <div class="meta">
      <span class="pill">Round {index + 1} / {rounds.length}</span>
      <span class="pill green">Score: {score}</span>
    </div>
    <p class="clue muted">Meaning: <strong>{current.word.en}</strong></p>
    <div class="letters">
      {#each current.scrambled.split('') as letter}
        <span class="letter">{letter}</span>
      {/each}
    </div>

    {#if status === 'playing'}
      <form onsubmit={(e) => { e.preventDefault(); submit(); }}>
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
          <button class="btn" type="button" onclick={giveUp}>Reveal</button>
        </div>
      </form>
      {#if lastResult === 'wrong'}
        <p class="pill">❌ Not quite — try again!</p>
      {/if}
    {:else}
      <div class="answer">
        {#if lastResult === 'exact'}
          <p class="pill green">✅ Tökéletes! +10</p>
        {:else if lastResult === 'accents'}
          <p class="pill green">✅ Almost — watch the accents! +7</p>
        {:else}
          <p class="pill">The word was:</p>
        {/if}
        <p class="hu solution">{current.word.hu}</p>
        <button class="btn primary" onclick={next}>
          {index + 1 >= rounds.length ? 'Finish' : 'Next →'}
        </button>
      </div>
    {/if}
  </div>
{/if}

<style>
  .center {
    text-align: center;
  }
  .meta {
    display: flex;
    justify-content: center;
    gap: 0.5rem;
    margin-bottom: 0.5rem;
  }
  .clue {
    font-size: 1.05rem;
  }
  .letters {
    display: flex;
    justify-content: center;
    gap: 0.4rem;
    flex-wrap: wrap;
    margin: 1rem 0;
  }
  .letter {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 2.2rem;
    height: 2.2rem;
    background: var(--accent);
    color: var(--white);
    font-weight: 700;
    font-size: 1.2rem;
    border-radius: 8px;
    text-transform: lowercase;
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
  }
  .solution {
    font-size: 1.6rem;
    margin: 0.5rem 0;
  }
</style>
