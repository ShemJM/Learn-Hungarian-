<script>
  import { listenOnce, recognitionAvailable, speak, ttsAvailable } from '../speech.js';

  /** Open-ended speaking practice: record freely, see back what was heard — no fixed target to score against. */
  let { prompt = 'Press record and answer out loud in Hungarian.' } = $props();

  let state = $state('idle'); // idle | listening | done | error
  let transcript = $state('');
  let alternatives = $state([]);
  let error = $state('');

  const supported = recognitionAvailable();

  async function record() {
    state = 'listening';
    error = '';
    transcript = '';
    alternatives = [];
    try {
      const alts = await listenOnce();
      alternatives = alts;
      transcript = alts[0] || '';
      state = 'done';
    } catch (e) {
      error = e.message;
      state = 'error';
    }
  }

  function reset() {
    state = 'idle';
    transcript = '';
    alternatives = [];
    error = '';
  }
</script>

<div class="free-speech">
  <p class="muted prompt">🎙️ {prompt}</p>
  {#if supported}
    <button class="btn primary" onclick={record} disabled={state === 'listening'}>
      {state === 'listening' ? '🎙️ Listening…' : '🎤 Record my answer'}
    </button>
  {:else}
    <span class="muted small">🎤 Free speech practice needs Chrome or Edge</span>
  {/if}

  {#if state === 'done'}
    <div class="result">
      <div class="result-label muted small">What we heard:</div>
      <div class="transcript">
        {transcript || '(nothing recognised — try again, a little louder and slower)'}
      </div>
      <div class="actions">
        {#if transcript && ttsAvailable()}
          <button class="btn" onclick={() => speak(transcript)}>🔊 Play it back</button>
        {/if}
        <button class="btn" onclick={reset}>🔁 Try again</button>
      </div>
      {#if alternatives.length > 1}
        <div class="muted small alts">Other guesses: {alternatives.slice(1).join(' · ')}</div>
      {/if}
    </div>
  {:else if state === 'error'}
    <div class="result bad">
      {error}
      <div class="actions">
        <button class="btn" onclick={reset}>🔁 Try again</button>
      </div>
    </div>
  {/if}
</div>

<style>
  .free-speech {
    margin-top: 0.75rem;
    padding-top: 0.75rem;
    border-top: 1px dashed var(--border);
  }
  .prompt {
    margin-top: 0;
  }
  .result {
    margin-top: 0.6rem;
    padding: 0.6rem 0.9rem;
    border-radius: 10px;
    background: var(--good-soft);
  }
  .result.bad {
    background: var(--bad-soft);
  }
  .result-label {
    margin-bottom: 0.2rem;
  }
  .transcript {
    font-size: 1.05rem;
    font-weight: 600;
  }
  .actions {
    display: flex;
    gap: 0.5rem;
    margin-top: 0.5rem;
  }
  .alts {
    margin-top: 0.4rem;
  }
  .small {
    font-size: 0.85rem;
  }
</style>
