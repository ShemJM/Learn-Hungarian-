<script>
  import { lessons, allPhrases } from '../lib/data/lessons.js';
  import { progress } from '../lib/progress.js';
  import { recognitionAvailable, hasHungarianVoice, ttsAvailable } from '../lib/speech.js';
  import PronunciationCheck from '../lib/components/PronunciationCheck.svelte';

  const phrases = allPhrases();

  let filter = $state('all');
  let filtered = $derived(filter === 'all' ? phrases : phrases.filter((p) => p.lessonId === filter));

  const tricky = [
    { hu: 'gyógyszertár', en: 'pharmacy — the ultimate gy challenge!' },
    { hu: 'egészségedre', en: 'cheers / bless you' },
    { hu: 'köszönöm szépen', en: 'thank you very much' },
    { hu: 'Magyarország', en: 'Hungary' },
    { hu: 'szeretlek', en: 'I love you' },
    { hu: 'jó éjszakát', en: 'good night' }
  ];

  let starsEarned = $derived(Object.values($progress.pronunciationStars).filter((s) => s >= 0.7).length);
</script>

<h1>🎤 Pronunciation Lab</h1>
<p class="muted">
  Listen to each phrase, then record yourself and get an instant similarity score. Scores of 70%+ earn a ⭐.
  You have earned <strong>{starsEarned}</strong> star{starsEarned === 1 ? '' : 's'} so far.
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
  <h3>😅 Tongue-twister corner</h3>
  <p class="muted">The sounds that make Hungarian famous. Master these and nothing can stop you.</p>
  {#each tricky as t}
    <div class="row">
      <div><span class="hu">{t.hu}</span> <span class="muted">— {t.en}</span>
        {#if ($progress.pronunciationStars[t.hu] || 0) >= 0.7}<span>⭐</span>{/if}
      </div>
      <PronunciationCheck text={t.hu} />
    </div>
  {/each}
</div>

<div class="card">
  <h3>🗣️ Phrases from the lessons</h3>
  <label class="muted">
    Filter:
    <select bind:value={filter}>
      <option value="all">All lessons</option>
      {#each lessons as l}
        <option value={l.id}>{l.icon} {l.title}</option>
      {/each}
    </select>
  </label>
  {#each filtered as p}
    <div class="row">
      <div><span class="hu">{p.hu}</span> <span class="muted">— {p.en}</span>
        {#if ($progress.pronunciationStars[p.hu] || 0) >= 0.7}<span>⭐</span>{/if}
      </div>
      <PronunciationCheck text={p.hu} />
    </div>
  {/each}
</div>

<style>
  .warn {
    background: #fff8e6;
    border-color: #e8d9a0;
  }
  .row {
    padding: 0.6rem 0;
    border-bottom: 1px solid var(--border);
  }
  .row:last-child {
    border-bottom: none;
  }
  select {
    font: inherit;
    padding: 0.3rem 0.5rem;
    border-radius: 8px;
    border: 1px solid var(--border);
    margin-left: 0.4rem;
  }
</style>
