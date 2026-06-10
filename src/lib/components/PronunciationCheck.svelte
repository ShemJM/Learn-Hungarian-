<script>
  import { speak, checkPronunciation, recognitionAvailable, pronunciationFeedback } from '../speech.js';
  import { progress } from '../progress.js';

  /** Record the learner saying `text` and score the attempt. */
  let { text, compact = false } = $props();

  let state = $state('idle'); // idle | listening | done | error
  let result = $state(null); // { transcript, score }
  let error = $state('');

  const supported = recognitionAvailable();

  async function record() {
    state = 'listening';
    error = '';
    result = null;
    try {
      result = await checkPronunciation(text);
      progress.recordPronunciation(text, result.score);
      state = 'done';
    } catch (e) {
      error = e.message;
      state = 'error';
    }
  }

  let feedback = $derived(result ? pronunciationFeedback(result.score) : null);
</script>

<div class="pron" class:compact>
  <button class="btn" onclick={() => speak(text)}>🔊 Listen</button>
  {#if supported}
    <button class="btn primary" onclick={record} disabled={state === 'listening'}>
      {state === 'listening' ? '🎙️ Listening…' : '🎤 Say it'}
    </button>
  {:else}
    <span class="muted small">🎤 Pronunciation check needs Chrome or Edge</span>
  {/if}

  {#if state === 'done' && result}
    <div class="result" class:good={feedback.tone === 'good'} class:bad={feedback.tone === 'bad'}>
      <strong>{feedback.emoji} {feedback.label}</strong>
      <span class="score">{Math.round(result.score * 100)}%</span>
      {#if result.transcript}
        <div class="muted small">We heard: „{result.transcript}”</div>
      {/if}
    </div>
  {:else if state === 'error'}
    <div class="result bad small">{error}</div>
  {/if}
</div>

<style>
  .pron {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: 0.5rem;
    margin: 0.5rem 0;
  }
  .result {
    flex-basis: 100%;
    padding: 0.5rem 0.75rem;
    border-radius: 10px;
    background: var(--accent-soft);
  }
  .result.good {
    background: var(--good-soft);
  }
  .result.bad {
    background: var(--bad-soft);
  }
  .score {
    margin-left: 0.5rem;
    font-weight: 700;
  }
  .small {
    font-size: 0.85rem;
  }
</style>
