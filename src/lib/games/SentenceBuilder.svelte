<script>
  import { dialogues } from '../data/dialogues.js';
  import { readings } from '../data/readings.js';
  import { sample } from '../text.js';
  import { sentencePool, buildRound, isSolved } from './sentencebuilder.js';
  import { progress } from '../progress.js';
  import { speak } from '../speech.js';

  const ROUNDS = 8;

  let rounds = $state([]);
  let index = $state(0);
  let placed = $state([]);
  let missed = $state(false); // a wrong attempt this round halves the points
  let status = $state('playing'); // playing | solved | revealed | done
  let score = $state(0);

  function newGame() {
    rounds = sample(sentencePool(dialogues, readings), ROUNDS).map((s) => buildRound(s));
    index = 0;
    placed = [];
    missed = false;
    status = 'playing';
    score = 0;
  }

  newGame();

  let current = $derived(rounds[index]);
  let bank = $derived(current ? current.tiles.filter((t) => !placed.some((p) => p.id === t.id)) : []);

  function place(tile) {
    placed = [...placed, tile];
    if (placed.length === current.tokens.length) {
      if (isSolved(placed, current.tokens)) {
        score += missed ? 5 : 10;
        speak(current.sentence.hu);
        status = 'solved';
      } else {
        missed = true;
        placed = [];
      }
    }
  }

  function unplace(tile) {
    placed = placed.filter((p) => p.id !== tile.id);
  }

  function giveUp() {
    speak(current.sentence.hu);
    status = 'revealed';
  }

  function next() {
    if (index + 1 >= rounds.length) {
      status = 'done';
      progress.recordGame('sentencebuilder', score);
    } else {
      index += 1;
      placed = [];
      missed = false;
      status = 'playing';
    }
  }
</script>

<h1>🧱 Sentence Builder</h1>
<p class="muted">
  Rebuild the Hungarian sentence from the shuffled tiles — the English is your clue. Tap a tile to
  place it, tap again to take it back. 10 points first try, 5 after a miss.
</p>

{#if status === 'done'}
  <div class="card center">
    <h2>🏁 Final score: {score} / {ROUNDS * 10}</h2>
    {#if $progress.gameBest['sentencebuilder']}
      <p class="muted">🏆 Best: {$progress.gameBest['sentencebuilder']}</p>
    {/if}
    <button class="btn primary" onclick={newGame}>🔁 Play again</button>
  </div>
{:else if current}
  <div class="card center">
    <div class="meta">
      <span class="pill">Round {index + 1} / {rounds.length}</span>
      <span class="pill green">Score: {score}</span>
    </div>
    <p class="clue muted">Meaning: <strong>{current.sentence.en}</strong></p>

    {#if status === 'playing'}
      <div class="row answer-row" class:missed>
        {#if placed.length === 0}
          <span class="muted hint">Tap the tiles below in order…</span>
        {/if}
        {#each placed as tile (tile.id)}
          <button class="tile placed" onclick={() => unplace(tile)}>{tile.word}</button>
        {/each}
      </div>
      <div class="row">
        {#each bank as tile (tile.id)}
          <button class="tile" onclick={() => place(tile)}>{tile.word}</button>
        {/each}
      </div>
      {#if missed}
        <p class="pill">❌ Not that order — try again!</p>
      {/if}
      <div class="actions">
        <button class="btn" type="button" onclick={giveUp}>Reveal</button>
      </div>
    {:else}
      <div class="answer">
        {#if status === 'solved'}
          <p class="pill green">✅ Tökéletes! +{missed ? 5 : 10}</p>
        {:else}
          <p class="pill">The sentence was:</p>
        {/if}
        <p class="hu solution">{current.sentence.hu}</p>
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
  .row {
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 0.4rem;
    flex-wrap: wrap;
    margin: 0.75rem 0;
    min-height: 2.6rem;
  }
  .answer-row {
    border: 2px dashed var(--border);
    border-radius: 10px;
    padding: 0.4rem;
  }
  .hint {
    font-size: 0.9rem;
  }
  .tile {
    font: inherit;
    font-weight: 700;
    padding: 0.45rem 0.75rem;
    border-radius: 8px;
    border: none;
    background: var(--accent);
    color: var(--white);
    cursor: pointer;
  }
  .tile.placed {
    background: var(--green);
  }
  .actions {
    display: flex;
    justify-content: center;
    gap: 0.5rem;
    margin-top: 0.5rem;
  }
  .solution {
    font-size: 1.3rem;
    margin: 0.5rem 0;
  }
</style>
