<script>
  import { readings, getReading } from '../lib/data/readings.js';
  import { progress } from '../lib/progress.js';
  import { shuffle } from '../lib/text.js';
  import AudioButton from '../lib/components/AudioButton.svelte';
  import { speak } from '../lib/speech.js';

  let { id = null } = $props();
  let reading = $derived(id ? getReading(id) : null);

  let revealed = $state(new Set());
  let showAll = $state(false);
  let answers = $state({});
  let submitted = $state(false);
  // Shuffle answer choices once per reading.
  let shuffledQuestions = $derived(
    reading ? reading.questions.map((q) => ({ ...q, choices: shuffle(q.choices) })) : []
  );

  $effect(() => {
    if (id) {
      revealed = new Set();
      showAll = false;
      answers = {};
      submitted = false;
    }
  });

  function toggleSentence(i) {
    const next = new Set(revealed);
    next.has(i) ? next.delete(i) : next.add(i);
    revealed = next;
  }

  function readAloud() {
    speak(reading.text.map((s) => s.hu).join(' '), { rate: 0.8 });
  }

  let correctCount = $derived(
    submitted ? shuffledQuestions.filter((q, i) => answers[i] === q.answer).length : 0
  );

  function submit() {
    submitted = true;
    if (correctCountNow() === reading.questions.length) progress.markReadingDone(reading.id);
  }

  function correctCountNow() {
    return shuffledQuestions.filter((q, i) => answers[i] === q.answer).length;
  }
</script>

{#if !reading}
  <h1>📖 Reading Exercises</h1>
  <p class="muted">
    Graded texts to build real comprehension. Tap any sentence to reveal its translation, listen to the
    audio, then answer the questions at the end.
  </p>
  <div class="grid two">
    {#each readings as r}
      <a class="card item" href={'#/reading/' + r.id}>
        <h3>{r.icon} {r.title}</h3>
        <span class="pill">{r.level}</span>
        {#if $progress.readingsDone.includes(r.id)}
          <span class="pill green">✅ Completed</span>
        {/if}
        <p class="muted">{r.intro}</p>
      </a>
    {/each}
  </div>
{:else}
  <a href="#/reading" class="muted back">← All readings</a>
  <h1>{reading.icon} {reading.title}</h1>
  <p class="muted">{reading.intro}</p>

  <div class="card">
    <div class="toolbar">
      <button class="btn" onclick={readAloud}>🔊 Read the whole text aloud</button>
      <button class="btn" onclick={() => (showAll = !showAll)}>
        {showAll ? '🙈 Hide translations' : '👁️ Show all translations'}
      </button>
    </div>
    {#each reading.text as sentence, i}
      <div class="sentence" onclick={() => toggleSentence(i)} role="button" tabindex="0"
           onkeydown={(e) => e.key === 'Enter' && toggleSentence(i)}>
        <div class="hu-line">
          <span class="hu">{sentence.hu}</span>
          <AudioButton text={sentence.hu} />
        </div>
        {#if showAll || revealed.has(i)}
          <div class="muted en-line">{sentence.en}</div>
        {/if}
      </div>
    {/each}
    <p class="muted hint">💡 Tap a sentence to reveal its translation.</p>
  </div>

  <div class="card">
    <h3>✏️ Comprehension check</h3>
    {#each shuffledQuestions as q, qi}
      <div class="question">
        <p><strong>{qi + 1}. {q.q}</strong></p>
        <div class="choices">
          {#each q.choices as choice}
            <button
              class="btn"
              class:primary={!submitted && answers[qi] === choice}
              class:correct={submitted && choice === q.answer}
              class:wrong={submitted && answers[qi] === choice && choice !== q.answer}
              onclick={() => { if (!submitted) answers = { ...answers, [qi]: choice }; }}
            >
              {choice}
            </button>
          {/each}
        </div>
      </div>
    {/each}
    {#if !submitted}
      <button
        class="btn green"
        disabled={Object.keys(answers).length < reading.questions.length}
        onclick={submit}
      >
        Check answers
      </button>
    {:else}
      <p>
        <strong>{correctCount} / {reading.questions.length} correct.</strong>
        {#if correctCount === reading.questions.length}
          🎉 Kiváló! Reading completed.
        {:else}
          Re-read the text and look at the highlighted answers.
        {/if}
      </p>
      <button class="btn" onclick={() => { answers = {}; submitted = false; }}>🔁 Try again</button>
    {/if}
  </div>
{/if}

<style>
  .item {
    text-decoration: none;
    color: var(--ink);
  }
  .item h3 {
    margin-top: 0;
  }
  .back {
    text-decoration: none;
  }
  .toolbar {
    display: flex;
    gap: 0.5rem;
    flex-wrap: wrap;
    margin-bottom: 1rem;
  }
  .sentence {
    padding: 0.5rem 0.6rem;
    border-radius: 8px;
    cursor: pointer;
  }
  .sentence:hover {
    background: var(--accent-soft);
  }
  .hu-line {
    font-size: 1.08rem;
  }
  .en-line {
    margin-top: 0.15rem;
  }
  .hint {
    font-size: 0.85rem;
    margin-bottom: 0;
  }
  .question {
    margin-bottom: 1rem;
  }
  .choices {
    display: flex;
    flex-wrap: wrap;
    gap: 0.5rem;
  }
</style>
