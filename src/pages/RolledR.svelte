<script>
  import { technique, tiers, allRolledRItems } from '../lib/data/rolledR.js';
  import { progress } from '../lib/progress.js';
  import { recognitionAvailable, hasHungarianVoice, ttsAvailable } from '../lib/speech.js';
  import PronunciationCheck from '../lib/components/PronunciationCheck.svelte';

  const items = allRolledRItems();

  let mastered = $derived(items.filter((i) => ($progress.pronunciationStars[i.hu] || 0) >= 0.7).length);
</script>

<h1>👅 Roll Your R's</h1>
<p class="muted">
  The Hungarian "r" is trilled — the tongue taps rapidly against the ridge behind your upper teeth,
  not the smooth English "r". Work through the tiers below, from a single tap to full sentences.
  You've mastered <strong>{mastered}</strong> / {items.length} so far.
</p>

{#if !ttsAvailable()}
  <div class="card warn">⚠️ Your browser does not support speech synthesis, so audio will not play.</div>
{:else if !hasHungarianVoice()}
  <div class="card warn">
    ℹ️ No Hungarian voice was found on this device — audio will use your default voice, so it may sound
    less authentic. Chrome and Edge usually include a Hungarian (hu-HU) voice.
  </div>
{/if}
{#if !recognitionAvailable()}
  <div class="card warn">
    ⚠️ Speech recognition is not supported in this browser, so pronunciation scoring is disabled.
    You can still listen and repeat — try Chrome or Edge for full functionality.
  </div>
{/if}

<div class="card">
  <h3>👅 How it works</h3>
  {#each technique as tip}
    <div class="tip">
      <strong>{tip.title}.</strong>
      <span class="muted">{tip.text}</span>
    </div>
  {/each}
</div>

{#each tiers as tier}
  <div class="card">
    <h3>{tier.title}</h3>
    <p class="muted">{tier.description}</p>
    {#each tier.items as item}
      <div class="row">
        <div><span class="hu">{item.hu}</span> <span class="muted">— {item.en}</span>
          {#if ($progress.pronunciationStars[item.hu] || 0) >= 0.7}<span>⭐</span>{/if}
        </div>
        <PronunciationCheck text={item.hu} />
      </div>
    {/each}
  </div>
{/each}

<style>
  .warn {
    background: #fff8e6;
    border-color: #e8d9a0;
  }
  .tip {
    padding: 0.5rem 0;
    border-bottom: 1px solid var(--border);
  }
  .tip:last-child {
    border-bottom: none;
  }
  .tip strong {
    display: block;
  }
  .row {
    padding: 0.6rem 0;
    border-bottom: 1px solid var(--border);
  }
  .row:last-child {
    border-bottom: none;
  }
</style>
