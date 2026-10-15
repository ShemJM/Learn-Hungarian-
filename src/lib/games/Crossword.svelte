<script>
  import { allWords } from '../data/lessons.js';
  import { buildPuzzle, emptyAnswers, gradeAll, entriesAt, stepAlong } from './crossword.js';
  import { progress } from '../progress.js';
  import { speak } from '../speech.js';
  import AudioButton from '../components/AudioButton.svelte';

  const ACCENTS = ['á', 'é', 'í', 'ó', 'ö', 'ő', 'ú', 'ü', 'ű'];
  const COUNT = 10;

  let puzzle = $state(null);
  let answers = $state([]);
  let active = $state(null); // [r, c]
  let dir = $state('across');
  let grades = $state({}); // entry id -> status, after "Check"
  let revealed = $state(new Set()); // entry ids given away
  let finished = $state(false);
  let score = $state(0);
  let gridEl = $state(null);
  // One off-screen text input receives all typing. Cells are plain buttons, so
  // on a phone the keyboard only opens if a real input has focus.
  let ghost = $state(null);

  function newGame() {
    puzzle = buildPuzzle(allWords(), { count: COUNT });
    answers = emptyAnswers(puzzle);
    grades = {};
    revealed = new Set();
    finished = false;
    score = 0;
    const first = puzzle.entries[0];
    active = first ? first.cells[0] : null;
    dir = first ? first.dir : 'across';
  }

  newGame();

  const k = (r, c) => `${r},${c}`;

  let activeEntry = $derived.by(() => {
    if (!active) return null;
    const here = entriesAt(puzzle, active[0], active[1]);
    return here.find((e) => e.dir === dir) || here[0] || null;
  });

  let activeKeys = $derived(new Set((activeEntry?.cells || []).map(([r, c]) => k(r, c))));

  let across = $derived(puzzle.entries.filter((e) => e.dir === 'across'));
  let down = $derived(puzzle.entries.filter((e) => e.dir === 'down'));

  /** Status of a cell for colouring: 'correct' | 'wrong' | 'accents' | null, from the last check. */
  function cellStatus(r, c) {
    const here = entriesAt(puzzle, r, c).map((e) => grades[e.id]).filter(Boolean);
    if (!here.length) return null;
    if (here.includes('wrong')) return 'wrong';
    if (here.every((s) => s === 'correct')) return 'correct';
    if (here.includes('accents')) return 'accents';
    return null;
  }

  function selectCell(r, c) {
    if (puzzle.grid[r][c] === null) return;
    const here = entriesAt(puzzle, r, c);
    if (active && active[0] === r && active[1] === c && here.length === 2) {
      dir = dir === 'across' ? 'down' : 'across'; // second tap on the same cell flips direction
    } else if (!here.some((e) => e.dir === dir)) {
      dir = here[0].dir;
    }
    active = [r, c];
    focusActive();
  }

  function selectEntry(entry) {
    dir = entry.dir;
    active = entry.cells[0];
    focusActive();
  }

  function focusActive() {
    queueMicrotask(() => ghost?.focus({ preventScroll: true }));
  }

  /** A letter typed into the ghost input (also handles phone keyboards that insert whole syllables). */
  function onGhostInput(e) {
    const typedText = e.target.value;
    e.target.value = '';
    for (const ch of typedText.toLowerCase()) {
      if (/[a-záéíóöőúüű]/.test(ch)) setLetter(ch);
    }
  }

  function setLetter(ch) {
    if (!active || finished) return;
    const [r, c] = active;
    answers[r][c] = ch;
    // Cleared grades on an edited entry so stale colours don't lie.
    for (const e of entriesAt(puzzle, r, c)) delete grades[e.id];
    grades = { ...grades };
    if (ch && activeEntry) {
      const next = stepAlong(activeEntry, r, c, 1);
      if (next) active = next;
    }
    focusActive();
  }

  function onKey(e) {
    if (!active) return;
    const [r, c] = active;
    if (e.key === 'Backspace') {
      e.preventDefault();
      if (answers[r][c]) {
        setLetterNoAdvance('');
      } else if (activeEntry) {
        const prev = stepAlong(activeEntry, r, c, -1);
        if (prev) {
          active = prev;
          setLetterNoAdvance('');
        }
      }
      return;
    }
    const moves = { ArrowRight: [0, 1], ArrowLeft: [0, -1], ArrowDown: [1, 0], ArrowUp: [-1, 0] };
    if (moves[e.key]) {
      e.preventDefault();
      const [dr, dc] = moves[e.key];
      dir = dr ? 'down' : 'across';
      let nr = r + dr;
      let nc = c + dc;
      while (nr >= 0 && nc >= 0 && nr < puzzle.height && nc < puzzle.width) {
        if (puzzle.grid[nr][nc] !== null) {
          active = [nr, nc];
          focusActive();
          return;
        }
        nr += dr;
        nc += dc;
      }
      return;
    }
  }

  function setLetterNoAdvance(ch) {
    const [r, c] = active;
    answers[r][c] = ch;
    for (const e of entriesAt(puzzle, r, c)) delete grades[e.id];
    grades = { ...grades };
    focusActive();
  }

  function check() {
    grades = gradeAll(puzzle, answers);
    const solved = puzzle.entries.filter((e) => grades[e.id] === 'correct' || grades[e.id] === 'accents');
    if (solved.length === puzzle.entries.length) {
      finished = true;
      score = puzzle.entries.reduce((sum, e) => {
        if (revealed.has(e.id)) return sum;
        return sum + (grades[e.id] === 'correct' ? 10 : 7);
      }, 0);
      progress.recordGame('crossword', score);
    }
  }

  function reveal() {
    if (!activeEntry || finished) return;
    activeEntry.cells.forEach(([r, c], i) => (answers[r][c] = activeEntry.answer[i]));
    revealed = new Set([...revealed, activeEntry.id]);
    speak(activeEntry.hu);
    grades = { ...grades, [activeEntry.id]: 'correct' };
    check();
  }

  function cellLabel(r, c) {
    return puzzle.numbers?.[k(r, c)] || null;
  }
</script>

<h1>✏️ Translation Crossword</h1>
<p class="muted">
  Every clue is an English meaning; fill in the Hungarian. Tap a square and type (tap it again to switch
  between across and down), use the accent row for á é ő ű, then <em>Check</em>. Accents off? You still get 7/10.
</p>

{#if activeEntry}
  <div class="current card">
    <span class="pill">{activeEntry.number} {activeEntry.dir}</span>
    <strong>{activeEntry.clue}</strong>
    <span class="muted">({activeEntry.answer.length} letters)</span>
  </div>
{/if}

<div class="layout">
  <div class="card board">
    <input
      class="ghost"
      bind:this={ghost}
      oninput={onGhostInput}
      onkeydown={onKey}
      aria-label="Type letters into the selected crossword square"
      autocomplete="off"
      autocapitalize="off"
      autocorrect="off"
      spellcheck="false"
      disabled={finished}
    />
    <div
      class="grid-cw"
      bind:this={gridEl}
      style={`grid-template-columns: repeat(${puzzle.width}, 1fr)`}
      role="grid"
      aria-label="Crossword grid"
    >
      {#each puzzle.grid as row, r}
        {#each row as solution, c}
          {#if solution === null}
            <div class="black"></div>
          {:else}
            <button
              type="button"
              class="cell"
              class:active={active && active[0] === r && active[1] === c}
              class:word={activeKeys.has(k(r, c))}
              class:correct={cellStatus(r, c) === 'correct'}
              class:accents={cellStatus(r, c) === 'accents'}
              class:wrong={cellStatus(r, c) === 'wrong'}
              onclick={() => selectCell(r, c)}
              aria-label={`row ${r + 1} column ${c + 1}${answers[r][c] ? ': ' + answers[r][c] : ''}`}
            >
              {#if cellLabel(r, c)}<span class="num">{cellLabel(r, c)}</span>{/if}
              <span class="letter">{answers[r][c]}</span>
            </button>
          {/if}
        {/each}
      {/each}
    </div>

    {#if !finished}
      <div class="keys" role="toolbar" aria-label="Hungarian accented letters">
        {#each ACCENTS as ch}
          <button type="button" class="key" onclick={() => setLetter(ch)}>{ch}</button>
        {/each}
        <button type="button" class="key wide" onclick={() => setLetterNoAdvance('')}>⌫</button>
      </div>
      <div class="actions">
        <button class="btn primary" onclick={check}>✅ Check</button>
        <button class="btn" onclick={reveal} disabled={!activeEntry}>👀 Reveal this word</button>
        <button class="btn" onclick={newGame}>🔁 New puzzle</button>
      </div>
    {/if}
  </div>

  <div class="card clues">
    <h3>Across</h3>
    <ol>
      {#each across as e}
        <li
          value={e.number}
          class:active={activeEntry?.id === e.id}
          class:solved={grades[e.id] === 'correct' || grades[e.id] === 'accents'}
        >
          <button type="button" onclick={() => selectEntry(e)}>{e.clue}</button>
          {#if grades[e.id] === 'correct' || grades[e.id] === 'accents'}
            <span class="hu">{e.hu}</span><AudioButton text={e.hu} />
          {/if}
        </li>
      {/each}
    </ol>
    <h3>Down</h3>
    <ol>
      {#each down as e}
        <li
          value={e.number}
          class:active={activeEntry?.id === e.id}
          class:solved={grades[e.id] === 'correct' || grades[e.id] === 'accents'}
        >
          <button type="button" onclick={() => selectEntry(e)}>{e.clue}</button>
          {#if grades[e.id] === 'correct' || grades[e.id] === 'accents'}
            <span class="hu">{e.hu}</span><AudioButton text={e.hu} />
          {/if}
        </li>
      {/each}
    </ol>
  </div>
</div>

{#if finished}
  <div class="card center">
    <h2>🏁 Kész! — Solved!</h2>
    <p>
      Score: <strong>{score}</strong> / {puzzle.entries.length * 10}
      {#if revealed.size}<span class="muted">({revealed.size} revealed)</span>{/if}
    </p>
    {#if $progress.gameBest['crossword']}
      <p class="muted">🏆 Best: {$progress.gameBest['crossword']}</p>
    {/if}
    <button class="btn primary" onclick={newGame}>🔁 New crossword</button>
  </div>
{/if}

<style>
  .current {
    display: flex;
    align-items: center;
    gap: 0.6rem;
    flex-wrap: wrap;
    padding: 0.6rem 1rem;
  }
  .layout {
    display: grid;
    grid-template-columns: minmax(0, 1fr) minmax(200px, 260px);
    gap: 1rem;
    align-items: start;
  }
  .board {
    position: relative;
  }
  .ghost {
    position: absolute;
    top: 0;
    left: 0;
    width: 1px;
    height: 1px;
    opacity: 0;
    border: none;
    padding: 0;
    font-size: 16px; /* keeps iOS from zooming when it gains focus */
  }
  .grid-cw {
    display: grid;
    gap: 2px;
    max-width: 520px;
    margin: 0 auto;
    background: var(--ink);
    padding: 2px;
    border-radius: 6px;
  }
  .black {
    aspect-ratio: 1;
    background: var(--ink);
  }
  .cell {
    position: relative;
    aspect-ratio: 1;
    width: 100%;
    padding: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    font: inherit;
    font-weight: 700;
    font-size: clamp(0.8rem, 3vw, 1.15rem);
    background: var(--white);
    border: 2px solid transparent;
    color: var(--ink);
    cursor: pointer;
    text-transform: lowercase;
  }
  .cell.word {
    background: #fff3c4;
  }
  .cell.active {
    background: #ffe08a;
    border-color: var(--accent);
    outline: none;
  }
  .cell.correct {
    background: var(--good-soft);
    color: var(--good);
  }
  .cell.accents {
    background: #fff3c4;
    color: #8a6d00;
  }
  .cell.wrong {
    background: var(--bad-soft);
    color: var(--bad);
  }
  .num {
    position: absolute;
    top: 1px;
    left: 2px;
    font-size: 0.5rem;
    font-weight: 600;
    color: var(--muted);
    line-height: 1;
  }
  .keys {
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    gap: 0.3rem;
    margin-top: 0.75rem;
  }
  .key {
    font: inherit;
    font-size: 1.05rem;
    min-width: 2.2rem;
    padding: 0.3rem 0.4rem;
    border: 1px solid var(--border);
    border-radius: 8px;
    background: var(--card);
    cursor: pointer;
  }
  .key.wide {
    min-width: 3rem;
  }
  .actions {
    display: flex;
    gap: 0.5rem;
    justify-content: center;
    flex-wrap: wrap;
    margin-top: 0.75rem;
  }
  .clues h3 {
    margin: 0 0 0.25rem;
  }
  .clues h3 + ol {
    margin-bottom: 1rem;
  }
  .clues ol {
    padding-left: 1.5rem;
    margin: 0;
  }
  .clues li {
    padding: 0.2rem 0;
  }
  .clues li button {
    font: inherit;
    background: none;
    border: none;
    padding: 0;
    text-align: left;
    color: var(--ink);
    cursor: pointer;
  }
  .clues li.active button {
    font-weight: 700;
    color: var(--accent);
  }
  .clues li.solved button {
    color: var(--muted);
    text-decoration: line-through;
  }
  .clues li .hu {
    margin-left: 0.4rem;
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
