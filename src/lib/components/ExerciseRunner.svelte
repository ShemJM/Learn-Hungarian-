<script>
  import { gradeItem } from '../exercises.js';
  import { grade } from '../quiz.js';
  import { speak } from '../speech.js';
  import { progress } from '../progress.js';
  import AudioButton from './AudioButton.svelte';
  import AccentBar from './AccentBar.svelte';

  /**
   * Runs a mixed exercise session (items from exercises.js builders).
   * Production items (with an srsKey) feed the same Leitner deck as Daily
   * Review. Calls onFinish(percent, results) once, when the last item is done.
   */
  let { items = [], onFinish = () => {}, onRestart = null } = $props();

  let index = $state(0);
  let typed = $state('');
  let placed = $state([]);
  let result = $state(null); // null while answering, { correct, quality } after
  let results = $state([]);
  let finished = $state(false);
  let inputEl = $state(null);

  let current = $derived(items[index]);
  let bank = $derived(
    current?.kind === 'order' ? current.tiles.filter((t) => !placed.some((p) => p.id === t.id)) : []
  );
  let correctCount = $derived(results.filter((r) => r.correct).length);
  let percent = $derived(items.length ? Math.round((correctCount / items.length) * 100) : 0);

  function settle(response) {
    if (result) return;
    const graded = gradeItem(current, response);
    result = { ...graded, response };
    results = [...results, { item: current, response, ...graded }];
    if (current.srsKey) progress.recordReview(current.srsKey, graded.correct);
    speak(current.kind === 'mcq' ? current.hu : (current.audio ?? current.hu));
  }

  function submitTyped(e) {
    e?.preventDefault();
    if (!typed.trim()) return;
    settle(typed);
  }

  function place(tile) {
    placed = [...placed, tile];
    if (placed.length === current.tokens.length) settle(placed);
  }

  function unplace(tile) {
    if (result) return;
    placed = placed.filter((p) => p.id !== tile.id);
  }

  function next() {
    if (index + 1 >= items.length) {
      finished = true;
      onFinish(percent, results);
    } else {
      index += 1;
      typed = '';
      placed = [];
      result = null;
    }
  }

  function restart() {
    index = 0;
    typed = '';
    placed = [];
    result = null;
    results = [];
    finished = false;
    onRestart?.();
  }
</script>

{#if !items.length}
  <p class="muted">Nothing to practise here yet.</p>
{:else if finished}
  {@const g = grade(percent)}
  <div class="finish">
    <div class="big">{g.emoji}</div>
    <h2>{g.label}</h2>
    <p>You scored <strong>{correctCount} / {items.length}</strong> ({percent}%)</p>
    {#if results.some((r) => !r.correct)}
      <div class="review">
        <h3>Review your mistakes:</h3>
        {#each results.filter((r) => !r.correct) as r}
          <div class="mistake">
            <span class="hu">{r.item.kind === 'order' ? r.item.hu : (r.item.display ?? r.item.answer)}</span>
            = {r.item.en ?? r.item.prompt}
            <AudioButton text={r.item.kind === 'order' ? r.item.hu : (r.item.audio ?? r.item.hu)} />
          </div>
        {/each}
      </div>
    {/if}
    <button class="btn primary" onclick={restart}>🔁 Try again</button>
  </div>
{:else}
  <div class="run-head">
    <span class="muted">Exercise {index + 1} / {items.length}</span>
    <div class="progress-bar"><div style="width: {(index / items.length) * 100}%"></div></div>
  </div>

  {#if current.kind === 'mcq'}
    <div class="prompt">
      {#if current.promptLang === 'hu'}
        <span class="hu big-prompt">{current.prompt}</span>
        <AudioButton text={current.prompt} />
        <div class="muted">What does this mean?</div>
      {:else}
        <span class="big-prompt">{current.prompt}</span>
        <div class="muted">How do you say this in Hungarian?</div>
      {/if}
    </div>
    <div class="choices">
      {#each current.choices as choice}
        <button
          class="btn choice"
          class:correct={result && choice === current.answer}
          class:wrong={result && result.response === choice && choice !== current.answer}
          onclick={() => settle(choice)}
        >
          {choice}
        </button>
      {/each}
    </div>
  {:else if current.kind === 'order'}
    <div class="prompt">
      <span class="big-prompt">{current.en}</span>
      <div class="muted">Build the Hungarian sentence from the tiles.</div>
    </div>
    <div class="row answer-row">
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
  {:else}
    <div class="prompt">
      {#if current.kind === 'type'}
        <span class="big-prompt">{current.prompt}</span>
        <div class="muted">Type it in Hungarian.</div>
      {:else if current.kind === 'cloze'}
        <div class="hu big-prompt cloze-line">
          {current.before}
          <span class="blank">{result ? current.display : '____'}</span>{current.suffix}
          {current.after}
        </div>
        <div class="muted">“{current.en}” — type the missing word.</div>
      {:else}
        <AudioButton text={current.audio} />
        <div class="muted">Listen and type what you hear.</div>
      {/if}
      {#if current.hint && !result}
        <div class="muted hint-line">💡 {current.hint}</div>
      {/if}
    </div>
    <form class="type-form" onsubmit={submitTyped}>
      <input
        class="type-input"
        type="text"
        bind:value={typed}
        bind:this={inputEl}
        disabled={result !== null}
        placeholder="Írd be… (type here)"
        autocapitalize="off"
        autocomplete="off"
        autocorrect="off"
        spellcheck="false"
        lang="hu"
      />
      {#if !result}
        <button class="btn primary" type="submit">Check</button>
      {/if}
    </form>
    {#if !result}
      <AccentBar input={inputEl} />
    {/if}
  {/if}

  {#if result}
    <div class="feedback">
      {#if result.quality === 'accents'}
        <span class="pill green">
          ✅ Almost — watch the accents: <strong class="hu">{current.display}</strong>
        </span>
      {:else if result.correct}
        <span class="pill green">✅ Helyes! (Correct!)</span>
      {:else}
        <span class="pill">
          ❌ The answer is:
          <strong class="hu">{current.kind === 'order' ? current.hu : (current.display ?? current.answer)}</strong>
        </span>
      {/if}
      <button class="btn primary" onclick={next}>
        {index + 1 >= items.length ? 'Finish' : 'Next →'}
      </button>
    </div>
  {/if}
{/if}

<style>
  .run-head {
    display: flex;
    align-items: center;
    gap: 1rem;
    margin-bottom: 1rem;
  }
  .run-head .progress-bar {
    flex: 1;
  }
  .prompt {
    text-align: center;
    margin: 1.5rem 0;
  }
  .big-prompt {
    font-size: 1.7rem;
    font-weight: 700;
  }
  .cloze-line {
    font-size: 1.4rem;
  }
  .blank {
    border-bottom: 2px solid var(--accent);
    padding: 0 0.35rem;
    color: var(--accent);
  }
  .hint-line {
    margin-top: 0.4rem;
    font-size: 0.95rem;
  }
  .choices {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
    gap: 0.6rem;
  }
  .choice {
    padding: 0.8rem;
    font-size: 1rem;
  }
  .type-form {
    display: flex;
    justify-content: center;
    gap: 0.5rem;
    flex-wrap: wrap;
  }
  .type-input {
    font: inherit;
    font-size: 1.1rem;
    padding: 0.55rem 0.75rem;
    border: 1px solid var(--border);
    border-radius: 10px;
    min-width: min(20rem, 80vw);
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
  .feedback {
    margin-top: 1rem;
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 1rem;
    flex-wrap: wrap;
  }
  .finish {
    text-align: center;
  }
  .finish .big {
    font-size: 3rem;
  }
  .review {
    text-align: left;
    background: var(--bg);
    border-radius: 10px;
    padding: 0.75rem 1rem;
    margin: 1rem 0;
  }
  .mistake {
    padding: 0.25rem 0;
  }
</style>
