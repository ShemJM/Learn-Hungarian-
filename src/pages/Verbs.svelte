<script>
  import { verbs, PRONOUNS, dictionaryForm } from '../lib/data/verbs.js';
  import { buildDrill } from '../lib/verbdrill.js';
  import { checkAnswer } from '../lib/text.js';
  import { speak } from '../lib/speech.js';
  import { progress } from '../lib/progress.js';
  import AudioButton from '../lib/components/AudioButton.svelte';
  import AccentBar from '../lib/components/AccentBar.svelte';

  const ROUNDS = 10;
  const harmonyLabel = { back: 'back vowels', front: 'front vowels', 'front-rounded': 'front rounded' };

  let tab = $state('browse'); // browse | drill

  let drill = $state([]);
  let index = $state(0);
  let guess = $state('');
  let status = $state('playing'); // playing | revealed | done
  let lastResult = $state(null); // 'exact' | 'accents' | 'wrong' | 'gaveup'
  let score = $state(0);
  let inputEl = $state(null);

  function newDrill() {
    drill = buildDrill(verbs, { count: ROUNDS });
    index = 0;
    guess = '';
    status = 'playing';
    lastResult = null;
    score = 0;
  }

  newDrill();

  let current = $derived(drill[index]);

  function submit() {
    if (!guess.trim()) return;
    const result = checkAnswer(guess, current.answers);
    lastResult = result;
    if (result === 'exact') score += 10;
    else if (result === 'accents') score += 7;
    if (result !== 'wrong') {
      speak(current.display);
      status = 'revealed';
    }
  }

  function giveUp() {
    lastResult = 'gaveup';
    speak(current.display);
    status = 'revealed';
  }

  function next() {
    if (index + 1 >= drill.length) {
      status = 'done';
      progress.recordGame('verbdrill', score);
    } else {
      index += 1;
      guess = '';
      status = 'playing';
      lastResult = null;
    }
  }

  function display(cell) {
    return Array.isArray(cell) ? cell.join(' / ') : cell;
  }

  function speakable(cell) {
    return Array.isArray(cell) ? cell[0] : cell;
  }
</script>

<h1>⚙️ Verbs</h1>
<p class="muted">
  One verb, two conjugations: <strong>indefinite</strong> (kérek egy kávét — <em>a</em> coffee) and
  <strong>definite</strong> (kérem a számlát — <em>the</em> bill). Browse the tables, then drill until it sticks.
</p>

<div class="tabs">
  <button class="btn" class:primary={tab === 'browse'} onclick={() => (tab = 'browse')}>📖 Browse</button>
  <button class="btn" class:primary={tab === 'drill'} onclick={() => (tab = 'drill')}>🏋️ Drill</button>
</div>

{#if tab === 'browse'}
  {#each verbs as verb}
    <div class="card">
      <h3>
        {dictionaryForm(verb)} <span class="muted inf">({verb.inf} — {verb.en})</span>
        <AudioButton text={dictionaryForm(verb)} />
      </h3>
      <p class="muted pron-line">
        {verb.pron}
        <span class="pill">{harmonyLabel[verb.harmony]}</span>
        {#if verb.ik}<span class="pill green">-ik verb</span>{/if}
        {#if !verb.definite}<span class="pill">intransitive — no definite forms</span>{/if}
      </p>
      <div class="table-wrap">
        <table>
          <thead>
            <tr>
              <th></th>
              <th>Indefinite</th>
              {#if verb.definite}<th>Definite</th>{/if}
            </tr>
          </thead>
          <tbody>
            {#each PRONOUNS as pronoun, i}
              <tr>
                <th>{pronoun}</th>
                <td><span class="hu">{display(verb.indefinite[i])}</span> <AudioButton text={speakable(verb.indefinite[i])} /></td>
                {#if verb.definite}
                  <td><span class="hu">{display(verb.definite[i])}</span> <AudioButton text={speakable(verb.definite[i])} /></td>
                {/if}
              </tr>
            {/each}
          </tbody>
        </table>
      </div>
    </div>
  {/each}
{:else if status === 'done'}
  <div class="card center">
    <h2>🏁 Final score: {score} / {ROUNDS * 10}</h2>
    {#if $progress.gameBest['verbdrill']}
      <p class="muted">🏆 Best: {$progress.gameBest['verbdrill']}</p>
    {/if}
    <button class="btn primary" onclick={newDrill}>🔁 Drill again</button>
  </div>
{:else if current}
  <div class="card center">
    <div class="meta">
      <span class="pill">Question {index + 1} / {drill.length}</span>
      <span class="pill green">Score: {score}</span>
    </div>
    <p class="clue muted">
      <span class="hu big">{current.dictionary}</span> ({current.verb.inf} — {current.verb.en})
    </p>
    <p class="ask">
      <strong>{current.pronoun}</strong> · {current.definiteness}
      <span class="muted">{current.definiteness === 'definite' ? '(a specific object: THE thing)' : '(no object, or an unspecific one)'}</span>
    </p>

    {#if status === 'playing'}
      <form onsubmit={(e) => { e.preventDefault(); submit(); }}>
        <!-- svelte-ignore a11y_autofocus -->
        <input
          type="text"
          bind:value={guess}
          bind:this={inputEl}
          placeholder="Type the conjugated form…"
          autocomplete="off"
          autocapitalize="off"
          autofocus
        />
        <AccentBar input={inputEl} />
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
          <p class="pill">The form is:</p>
        {/if}
        <p class="hu solution">{current.pronoun} {current.display} <AudioButton text={current.display} /></p>
        {#if current.answers.length > 1}
          <p class="muted">Also accepted: {current.answers.slice(1).join(', ')}</p>
        {/if}
        <button class="btn primary" onclick={next}>
          {index + 1 >= drill.length ? 'Finish' : 'Next →'}
        </button>
      </div>
    {/if}
  </div>
{/if}

<style>
  .tabs {
    display: flex;
    gap: 0.5rem;
    margin-bottom: 1rem;
  }
  .inf {
    font-weight: 500;
    font-size: 0.9rem;
  }
  .pron-line {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    flex-wrap: wrap;
  }
  .table-wrap {
    overflow-x: auto;
  }
  table {
    border-collapse: collapse;
    width: 100%;
  }
  th,
  td {
    text-align: left;
    padding: 0.35rem 0.6rem;
    border-bottom: 1px solid var(--border);
  }
  thead th {
    color: var(--muted);
    font-size: 0.85rem;
    text-transform: uppercase;
  }
  tbody th {
    color: var(--muted);
    font-weight: 600;
    width: 3.5rem;
  }
  .center {
    text-align: center;
  }
  .meta {
    display: flex;
    justify-content: center;
    gap: 0.5rem;
    margin-bottom: 0.5rem;
  }
  .big {
    font-size: 1.4rem;
    font-weight: 700;
  }
  .ask {
    font-size: 1.15rem;
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
    font-size: 1.5rem;
    margin: 0.5rem 0;
  }
</style>
