<script>
  import { allWords } from '../data/lessons.js';
  import { buildPuzzle, lineBetween, findWord } from './wordsearch.js';
  import { progress } from '../progress.js';
  import { speak } from '../speech.js';
  import AudioButton from '../components/AudioButton.svelte';

  const LEVELS = {
    easy: { label: 'Easy', size: 8, count: 6, backwards: false, hint: 'forwards only' },
    normal: { label: 'Normal', size: 10, count: 8, backwards: true, hint: 'any direction, even backwards' },
    hard: { label: 'Hard', size: 12, count: 12, backwards: true, hint: 'bigger grid, more words' }
  };

  let level = $state('normal');
  let puzzle = $state(null);
  let found = $state(new Set()); // answers found
  let anchor = $state(null); // first tapped cell [r, c], waiting for the second
  let drag = $state(null); // { start: [r,c], end: [r,c] } while the pointer is down
  let flash = $state(null); // cells of a wrong selection, briefly
  let hintCells = $state(new Set()); // 'r,c' keys of hinted first letters
  let hints = $state(0);
  let startedAt = $state(0);
  let finishedAt = $state(null);
  let score = $state(0);
  let gridEl = $state(null);

  function newGame() {
    const cfg = LEVELS[level];
    puzzle = buildPuzzle(allWords(), { count: cfg.count, size: cfg.size, backwards: cfg.backwards });
    found = new Set();
    anchor = null;
    drag = null;
    flash = null;
    hintCells = new Set();
    hints = 0;
    startedAt = Date.now();
    finishedAt = null;
    score = 0;
  }

  newGame();

  const k = (r, c) => `${r},${c}`;

  let selectedKeys = $derived.by(() => {
    const line = drag ? lineBetween(drag.start, drag.end) : null;
    const cells = line || (anchor ? [anchor] : []);
    return new Set(cells.map(([r, c]) => k(r, c)));
  });

  let foundKeys = $derived(
    new Set(puzzle.words.filter((w) => found.has(w.answer)).flatMap((w) => w.cells.map(([r, c]) => k(r, c))))
  );

  let flashKeys = $derived(new Set((flash || []).map(([r, c]) => k(r, c))));

  function finishSelection(from, to) {
    const line = lineBetween(from, to);
    const hit = line && findWord(line, puzzle.words);
    if (hit && !found.has(hit.answer)) {
      found = new Set([...found, hit.answer]);
      speak(hit.hu);
      if (found.size === puzzle.words.length) finish();
    } else if (line && line.length > 1) {
      flash = line;
      setTimeout(() => (flash = null), 350);
    }
  }

  function finish() {
    finishedAt = Date.now();
    const seconds = Math.round((finishedAt - startedAt) / 1000);
    score = Math.max(0, found.size * 10 - hints * 3 + Math.max(0, 120 - seconds));
    progress.recordGame('wordsearch', score);
  }

  function cellFromEvent(e) {
    const el = document.elementFromPoint(e.clientX, e.clientY);
    const cell = el?.closest?.('[data-r]');
    if (!cell || !gridEl?.contains(cell)) return null;
    return [Number(cell.dataset.r), Number(cell.dataset.c)];
  }

  function onPointerDown(e, r, c) {
    if (finishedAt) return;
    e.preventDefault();
    drag = { start: [r, c], end: [r, c] };
    e.currentTarget.closest('.grid-ws')?.setPointerCapture?.(e.pointerId);
  }

  function onPointerMove(e) {
    if (!drag) return;
    const cell = cellFromEvent(e);
    if (cell && lineBetween(drag.start, cell)) drag = { ...drag, end: cell };
  }

  function onPointerUp() {
    if (!drag) return;
    const { start, end } = drag;
    drag = null;
    const tapped = start[0] === end[0] && start[1] === end[1];
    if (!tapped) {
      anchor = null;
      finishSelection(start, end);
    } else if (!anchor) {
      anchor = start;
    } else if (anchor[0] === start[0] && anchor[1] === start[1]) {
      anchor = null;
    } else {
      const from = anchor;
      anchor = null;
      finishSelection(from, start);
    }
  }

  function hint() {
    const remaining = puzzle.words.filter((w) => !found.has(w.answer) && !hintCells.has(k(...w.cells[0])));
    if (!remaining.length) return;
    const w = remaining[Math.floor(Math.random() * remaining.length)];
    hintCells = new Set([...hintCells, k(...w.cells[0])]);
    hints += 1;
  }

  function changeLevel(l) {
    level = l;
    newGame();
  }
</script>

<svelte:window onpointerup={onPointerUp} onpointermove={onPointerMove} />

<h1>🔍 Word Search</h1>
<p class="muted">
  The clues are in English — find the Hungarian word hidden in the grid. Tap the first letter, then the
  last (or drag across). Every word you find is read aloud.
</p>

<div class="levels">
  {#each Object.entries(LEVELS) as [id, cfg]}
    <button class="btn" class:primary={level === id} onclick={() => changeLevel(id)} title={cfg.hint}>
      {cfg.label}
    </button>
  {/each}
</div>

<div class="layout">
  <div class="card">
    <div class="meta">
      <span class="pill green">Found {found.size} / {puzzle.words.length}</span>
      {#if hints}<span class="pill">Hints used: {hints}</span>{/if}
    </div>
    <div
      class="grid-ws"
      bind:this={gridEl}
      style={`grid-template-columns: repeat(${puzzle.size}, 1fr)`}
      role="grid"
      aria-label="Word search grid"
    >
      {#each puzzle.grid as row, r}
        {#each row as letter, c}
          <button
            type="button"
            class="cell"
            class:selected={selectedKeys.has(k(r, c))}
            class:found={foundKeys.has(k(r, c))}
            class:flash={flashKeys.has(k(r, c))}
            class:hint={hintCells.has(k(r, c)) && !foundKeys.has(k(r, c))}
            data-r={r}
            data-c={c}
            onpointerdown={(e) => onPointerDown(e, r, c)}
            aria-label={`row ${r + 1} column ${c + 1}: ${letter}`}
          >
            {letter}
          </button>
        {/each}
      {/each}
    </div>
    {#if !finishedAt}
      <div class="actions">
        <button class="btn" onclick={hint} disabled={hintCells.size >= puzzle.words.length - found.size}>
          💡 Hint (−3)
        </button>
        <button class="btn" onclick={newGame}>🔁 New puzzle</button>
      </div>
    {/if}
  </div>

  <div class="card clues">
    <h3>Find the Hungarian for…</h3>
    <ul>
      {#each puzzle.words as w}
        <li class:done={found.has(w.answer)}>
          <span class="en">{w.en}</span>
          {#if found.has(w.answer)}
            <span class="hu">{w.hu}</span>
            <AudioButton text={w.hu} />
          {:else}
            <span class="muted len">{w.answer.length} letters</span>
          {/if}
        </li>
      {/each}
    </ul>
  </div>
</div>

{#if finishedAt}
  <div class="card center">
    <h2>🏁 Megtaláltad mind! — You found them all!</h2>
    <p>
      Score: <strong>{score}</strong>
      <span class="muted">({found.size} words, {hints} hints, {Math.round((finishedAt - startedAt) / 1000)}s)</span>
    </p>
    {#if $progress.gameBest['wordsearch']}
      <p class="muted">🏆 Best: {$progress.gameBest['wordsearch']}</p>
    {/if}
    <button class="btn primary" onclick={newGame}>🔁 Play again</button>
  </div>
{/if}

<style>
  .levels {
    display: flex;
    gap: 0.5rem;
    flex-wrap: wrap;
    margin-bottom: 1rem;
  }
  .layout {
    display: grid;
    grid-template-columns: minmax(0, 1fr) minmax(200px, 260px);
    gap: 1rem;
    align-items: start;
  }
  .meta {
    display: flex;
    gap: 0.5rem;
    margin-bottom: 0.75rem;
    flex-wrap: wrap;
  }
  .grid-ws {
    display: grid;
    gap: 3px;
    touch-action: none;
    user-select: none;
    -webkit-user-select: none;
    max-width: 520px;
    margin: 0 auto;
  }
  .cell {
    aspect-ratio: 1;
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    font: inherit;
    font-weight: 700;
    font-size: clamp(0.85rem, 3.2vw, 1.2rem);
    text-transform: lowercase;
    background: var(--bg);
    border: 1px solid var(--border);
    border-radius: 6px;
    color: var(--ink);
    padding: 0;
    cursor: pointer;
    transition: background 0.1s;
  }
  .cell.selected {
    background: var(--accent);
    color: var(--white);
    border-color: var(--accent);
  }
  .cell.found {
    background: var(--good-soft);
    border-color: var(--good);
    color: var(--good);
  }
  .cell.hint {
    box-shadow: inset 0 0 0 3px #f2b705;
  }
  .cell.flash {
    background: var(--bad-soft);
    border-color: var(--bad);
  }
  .actions {
    display: flex;
    gap: 0.5rem;
    justify-content: center;
    margin-top: 0.75rem;
    flex-wrap: wrap;
  }
  .clues h3 {
    margin-top: 0;
  }
  .clues ul {
    list-style: none;
    padding: 0;
    margin: 0;
  }
  .clues li {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: 0.4rem;
    padding: 0.35rem 0;
    border-bottom: 1px dashed var(--border);
  }
  .clues li.done .en {
    text-decoration: line-through;
    color: var(--muted);
  }
  .len {
    font-size: 0.8rem;
  }
  .center {
    text-align: center;
  }
  @media (max-width: 640px) {
    .layout {
      grid-template-columns: 1fr;
    }
  }
</style>
