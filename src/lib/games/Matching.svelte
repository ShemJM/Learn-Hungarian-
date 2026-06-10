<script>
  import { allWords } from '../data/lessons.js';
  import { sample, shuffle } from '../text.js';
  import { progress } from '../progress.js';
  import { speak } from '../speech.js';

  const PAIRS = 6;

  let tiles = $state([]);
  let selected = $state(null); // index of first selected tile
  let matchedIds = $state(new Set());
  let wrongPair = $state([]);
  let moves = $state(0);
  let startTime = $state(0);
  let finishedAt = $state(null);

  function newGame() {
    const words = sample(allWords(), PAIRS);
    tiles = shuffle(
      words.flatMap((w, id) => [
        { id, lang: 'hu', label: w.hu },
        { id, lang: 'en', label: w.en }
      ])
    );
    selected = null;
    matchedIds = new Set();
    wrongPair = [];
    moves = 0;
    startTime = Date.now();
    finishedAt = null;
  }

  newGame();

  function pick(i) {
    if (finishedAt || wrongPair.length) return;
    const tile = tiles[i];
    if (matchedIds.has(tile.id) && selectedMatches(i)) return;
    if (matchedIds.has(tile.id)) return;
    if (selected === i) {
      selected = null;
      return;
    }
    if (selected === null) {
      selected = i;
      if (tile.lang === 'hu') speak(tile.label);
      return;
    }
    moves += 1;
    const first = tiles[selected];
    if (first.id === tile.id && first.lang !== tile.lang) {
      matchedIds = new Set([...matchedIds, tile.id]);
      if (tile.lang === 'hu') speak(tile.label);
      selected = null;
      if (matchedIds.size === PAIRS) {
        finishedAt = Date.now();
        const seconds = Math.round((finishedAt - startTime) / 1000);
        // Score: fewer moves and less time = higher score.
        const score = Math.max(0, 1000 - (moves - PAIRS) * 50 - seconds * 5);
        progress.recordGame('matching', score);
      }
    } else {
      wrongPair = [selected, i];
      setTimeout(() => {
        wrongPair = [];
        selected = null;
      }, 700);
    }
  }

  function selectedMatches(i) {
    return selected === i;
  }

  let seconds = $derived(finishedAt ? Math.round((finishedAt - startTime) / 1000) : 0);
</script>

<h1>🧠 Matching Pairs</h1>
<p class="muted">Match each Hungarian word with its English meaning. Fewer moves, better score!</p>

<div class="status">
  <span class="pill">Moves: {moves}</span>
  <span class="pill green">Matched: {matchedIds.size} / {PAIRS}</span>
  {#if $progress.gameBest['matching']}
    <span class="pill">🏆 Best: {$progress.gameBest['matching']}</span>
  {/if}
</div>

<div class="board">
  {#each tiles as tile, i}
    <button
      class="tile"
      class:hu-tile={tile.lang === 'hu'}
      class:selected={selected === i}
      class:matched={matchedIds.has(tile.id)}
      class:shake={wrongPair.includes(i)}
      onclick={() => pick(i)}
      disabled={matchedIds.has(tile.id)}
    >
      {tile.label}
    </button>
  {/each}
</div>

{#if finishedAt}
  <div class="card win">
    <h2>🎉 Gratulálok! (Congratulations!)</h2>
    <p>Finished in <strong>{moves} moves</strong> and <strong>{seconds}s</strong>.</p>
    <button class="btn primary" onclick={newGame}>🔁 Play again</button>
  </div>
{:else}
  <button class="btn" onclick={newGame}>🔄 New game</button>
{/if}

<style>
  .status {
    display: flex;
    gap: 0.5rem;
    margin-bottom: 1rem;
    flex-wrap: wrap;
  }
  .board {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
    gap: 0.6rem;
    margin-bottom: 1rem;
  }
  .tile {
    padding: 1rem 0.5rem;
    border-radius: 10px;
    border: 2px solid var(--border);
    background: var(--white);
    font-weight: 600;
    font-size: 0.95rem;
    min-height: 64px;
  }
  .tile.hu-tile {
    color: var(--accent);
  }
  .tile.selected {
    border-color: var(--accent);
    background: var(--accent-soft);
  }
  .tile.matched {
    background: var(--good-soft);
    border-color: var(--good);
    color: var(--good);
    opacity: 0.7;
  }
  .tile.shake {
    animation: shake 0.3s;
    border-color: var(--bad);
    background: var(--bad-soft);
  }
  @keyframes shake {
    0%, 100% { transform: translateX(0); }
    25% { transform: translateX(-5px); }
    75% { transform: translateX(5px); }
  }
  .win {
    text-align: center;
  }
</style>
