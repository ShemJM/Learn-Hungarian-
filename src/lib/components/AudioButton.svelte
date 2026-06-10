<script>
  import { speak, ttsAvailable } from '../speech.js';

  let { text, rate = 0.85, label = '' } = $props();
  let unavailable = $state(false);

  function play() {
    if (!speak(text, { rate })) unavailable = true;
  }
</script>

{#if ttsAvailable()}
  <button class="audio-btn" onclick={play} title="Listen ({text})" aria-label="Listen to {text}">
    🔊{#if label}<span>{label}</span>{/if}
  </button>
{:else if unavailable}
  <span class="muted" title="Text-to-speech not supported in this browser">🔇</span>
{/if}

<style>
  .audio-btn {
    border: none;
    background: transparent;
    font-size: 1.05rem;
    padding: 0.1rem 0.3rem;
    border-radius: 8px;
    display: inline-flex;
    align-items: center;
    gap: 0.3rem;
  }
  .audio-btn:hover {
    background: var(--accent-soft);
  }
  .audio-btn span {
    font-size: 0.85rem;
    font-weight: 600;
    color: var(--accent);
  }
</style>
