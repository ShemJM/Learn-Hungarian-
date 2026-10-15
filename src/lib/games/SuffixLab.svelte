<script>
  import { TOPICS, buildSuffixDrill } from '../suffixes.js';
  import { checkAnswer } from '../text.js';
  import { progress } from '../progress.js';
  import { speak } from '../speech.js';
  import AccentBar from '../components/AccentBar.svelte';
  import AudioButton from '../components/AudioButton.svelte';

  const COUNT = 10;

  let { topic = null } = $props();

  let selected = $state(new Set(topic ? [topic] : ['verbs-present']));
  let mode = $state('tap'); // tap | type
  let questions = $state([]);
  let index = $state(0);
  let phase = $state('setup'); // setup | asking | answered | done
  let picked = $state(null); // chosen ending in tap mode
  let typed = $state('');
  let result = $state(null); // 'exact' | 'accents' | 'wrong'
  let score = $state(0);
  let mistakes = $state([]);
  let inputEl = $state(null);

  let current = $derived(questions[index]);

  function toggleTopic(id) {
    const next = new Set(selected);
    if (next.has(id)) {
      if (next.size === 1) return; // keep at least one
      next.delete(id);
    } else {
      next.add(id);
    }
    selected = next;
  }

  function start() {
    questions = buildSuffixDrill({ topics: [...selected], count: COUNT });
    index = 0;
    score = 0;
    mistakes = [];
    resetQuestion();
    phase = 'asking';
  }

  function resetQuestion() {
    picked = null;
    typed = '';
    result = null;
    queueMicrotask(() => inputEl?.focus());
  }

  function pick(ending) {
    if (phase !== 'asking') return;
    picked = ending;
    result = ending === current.ending ? 'exact' : 'wrong';
    settle();
  }

  function submitTyped() {
    if (phase !== 'asking' || !typed.trim()) return;
    result = checkAnswer(typed, current.answers);
    settle();
  }

  function settle() {
    if (result === 'exact') score += 10;
    else if (result === 'accents') score += 7;
    else mistakes = [...mistakes, current];
    speak(current.answer);
    phase = 'answered';
  }

  function next() {
    if (index + 1 >= questions.length) {
      phase = 'done';
      progress.recordGame('suffixlab', score);
    } else {
      index += 1;
      resetQuestion();
      phase = 'asking';
    }
  }

  function retryMistakes() {
    questions = mistakes.map((q) => ({ ...q }));
    index = 0;
    score = 0;
    mistakes = [];
    resetQuestion();
    phase = 'asking';
  }

  function topicLabel(id) {
    return TOPICS.find((t) => t.id === id)?.label || id;
  }
</script>

<h1>🧪 Suffix Lab</h1>
<p class="muted">
  Hungarian glues its grammar onto the end of words: <em>who</em> is doing it (én, te, mi…), <em>whose</em>
  it is, and <em>where</em> it is. Pick the right ending, hear the whole word, and learn why.
</p>

{#if phase === 'setup'}
  <div class="card">
    <h3>What do you want to drill?</h3>
    <div class="topics">
      {#each TOPICS as t}
        <button
          type="button"
          class="topic"
          class:on={selected.has(t.id)}
          aria-pressed={selected.has(t.id)}
          onclick={() => toggleTopic(t.id)}
        >
          <span class="icon">{t.icon}</span>
          <span>
            <strong>{t.label}</strong>
            <span class="muted desc">{t.desc}</span>
          </span>
        </button>
      {/each}
    </div>

    <h3>How?</h3>
    <div class="modes">
      <button class="btn" class:primary={mode === 'tap'} onclick={() => (mode = 'tap')}>👆 Tap the ending</button>
      <button class="btn" class:primary={mode === 'type'} onclick={() => (mode = 'type')}>⌨️ Type the whole word</button>
    </div>
    <p class="muted small">
      {mode === 'tap'
        ? 'Four endings, one is right — great for learning the harmony pattern.'
        : 'No options: type the finished word. Accent slips still score 7/10.'}
    </p>
    <button class="btn primary big" onclick={start}>Start · {COUNT} questions</button>
  </div>
{:else if phase === 'done'}
  <div class="card center">
    <h2>🏁 Final score: {score} / {questions.length * 10}</h2>
    {#if $progress.gameBest['suffixlab']}
      <p class="muted">🏆 Best: {$progress.gameBest['suffixlab']}</p>
    {/if}
    {#if mistakes.length}
      <h3>Worth another look</h3>
      <ul class="review">
        {#each mistakes as m}
          <li>
            <span class="muted">{m.prompt} →</span>
            <span class="hu">{m.answer}</span>
            <AudioButton text={m.answer} />
            <span class="muted small">{m.gloss}</span>
          </li>
        {/each}
      </ul>
      <div class="actions">
        <button class="btn primary" onclick={retryMistakes}>🔁 Retry my {mistakes.length} mistakes</button>
        <button class="btn" onclick={() => (phase = 'setup')}>⚙️ New drill</button>
      </div>
    {:else}
      <p>Tökéletes! Every ending right. 🎉</p>
      <div class="actions">
        <button class="btn primary" onclick={start}>🔁 Play again</button>
        <button class="btn" onclick={() => (phase = 'setup')}>⚙️ Change topics</button>
      </div>
    {/if}
  </div>
{:else if current}
  <div class="card">
    <div class="meta">
      <span class="pill">{index + 1} / {questions.length}</span>
      <span class="pill">{topicLabel(current.topic)}</span>
      <span class="pill green">Score: {score}</span>
    </div>

    <p class="gloss muted">{current.gloss}</p>
    <p class="prompt">
      <span class="stem">{current.prompt}</span>
      <span class="blank">
        {#if phase === 'answered'}
          <span class="ending">-{current.ending}</span>
        {:else if mode === 'tap'}
          + ___
        {:else}
          = ?
        {/if}
      </span>
    </p>

    {#if phase === 'asking'}
      {#if mode === 'tap'}
        <div class="choices">
          {#each current.choices as ending}
            <button type="button" class="choice" onclick={() => pick(ending)}>-{ending}</button>
          {/each}
        </div>
      {:else}
        <form onsubmit={(e) => { e.preventDefault(); submitTyped(); }}>
          <!-- svelte-ignore a11y_autofocus -->
          <input
            type="text"
            bind:this={inputEl}
            bind:value={typed}
            placeholder="Type the finished word…"
            autocomplete="off"
            autocapitalize="off"
            autofocus
          />
          <AccentBar input={inputEl} />
          <div class="actions">
            <button class="btn primary" type="submit">Check</button>
          </div>
        </form>
      {/if}
    {:else}
      <div class="feedback" class:good={result !== 'wrong'} class:bad={result === 'wrong'}>
        {#if result === 'exact'}
          <p class="pill green">✅ Helyes! +10</p>
        {:else if result === 'accents'}
          <p class="pill green">✅ Right ending — mind the accents! +7</p>
        {:else}
          <p class="pill">❌ Not this time{picked ? ` (you chose -${picked})` : ''}</p>
        {/if}
        <p class="answer">
          <span class="hu big">{current.answer}</span>
          <AudioButton text={current.answer} />
        </p>
        {#if current.answers.length > 1}
          <p class="muted small">Also accepted: {current.answers.slice(1).join(', ')}</p>
        {/if}
        <p class="why">{current.explanation}</p>
        <button class="btn primary" onclick={next}>
          {index + 1 >= questions.length ? 'Finish' : 'Next →'}
        </button>
      </div>
    {/if}
  </div>
{/if}

<style>
  .topics {
    display: grid;
    gap: 0.5rem;
    margin-bottom: 1rem;
  }
  .topic {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    text-align: left;
    font: inherit;
    padding: 0.6rem 0.8rem;
    border: 2px solid var(--border);
    border-radius: 10px;
    background: var(--card);
    color: var(--ink);
    cursor: pointer;
  }
  .topic.on {
    border-color: var(--accent);
    background: var(--accent-soft);
  }
  .topic .icon {
    font-size: 1.4rem;
  }
  .topic .desc {
    display: block;
    font-size: 0.85rem;
  }
  .modes {
    display: flex;
    gap: 0.5rem;
    flex-wrap: wrap;
  }
  .small {
    font-size: 0.85rem;
  }
  .big {
    font-size: 1.05rem;
  }
  .meta {
    display: flex;
    gap: 0.5rem;
    flex-wrap: wrap;
    margin-bottom: 0.75rem;
  }
  .gloss {
    margin: 0;
    font-size: 0.95rem;
  }
  .prompt {
    font-size: 1.8rem;
    font-weight: 700;
    margin: 0.25rem 0 1rem;
    display: flex;
    flex-wrap: wrap;
    gap: 0.5rem;
    align-items: baseline;
  }
  .blank {
    color: var(--muted);
  }
  .ending {
    color: var(--good);
  }
  .choices {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(110px, 1fr));
    gap: 0.5rem;
  }
  .choice {
    font: inherit;
    font-size: 1.3rem;
    font-weight: 700;
    padding: 0.8rem 0.5rem;
    border: 2px solid var(--border);
    border-radius: 12px;
    background: var(--card);
    color: var(--accent);
    cursor: pointer;
  }
  .choice:hover {
    border-color: var(--accent);
    background: var(--accent-soft);
  }
  input {
    font: inherit;
    font-size: 1.1rem;
    padding: 0.6rem 0.9rem;
    border-radius: 10px;
    border: 2px solid var(--border);
    width: min(360px, 100%);
  }
  input:focus {
    outline: none;
    border-color: var(--accent);
  }
  .actions {
    display: flex;
    gap: 0.5rem;
    flex-wrap: wrap;
    margin-top: 0.75rem;
  }
  .feedback {
    border-radius: 12px;
    padding: 0.9rem 1rem;
  }
  .feedback.good {
    background: var(--good-soft);
  }
  .feedback.bad {
    background: var(--bad-soft);
  }
  .feedback .pill {
    margin: 0 0 0.5rem;
  }
  .answer {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    margin: 0.25rem 0;
  }
  .hu.big {
    font-size: 1.6rem;
  }
  .why {
    margin: 0.5rem 0 0.9rem;
  }
  .center {
    text-align: center;
  }
  .review {
    list-style: none;
    padding: 0;
    text-align: left;
  }
  .review li {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: 0.4rem;
    padding: 0.35rem 0;
    border-bottom: 1px dashed var(--border);
  }
  .center .actions {
    justify-content: center;
  }
</style>
