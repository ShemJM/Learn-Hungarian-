<script>
  import { lessons, allWords } from '../data/lessons.js';
  import { shuffle } from '../text.js';
  import { progress } from '../progress.js';
  import AudioButton from '../components/AudioButton.svelte';

  let lessonId = $state('all');
  let deck = $state(shuffle(allWords()));
  let index = $state(0);
  let flipped = $state(false);
  let frontLang = $state('hu');

  function rebuild() {
    const words = lessonId === 'all' ? allWords() : lessons.find((l) => l.id === lessonId)?.words || [];
    deck = shuffle(words);
    index = 0;
    flipped = false;
  }

  function next(dir = 1) {
    index = (index + dir + deck.length) % deck.length;
    flipped = false;
  }

  let card = $derived(deck[index]);
  let known = $derived(card ? $progress.knownWords.includes(card.hu) : false);
</script>

<h1>🃏 Flashcards</h1>
<div class="controls">
  <label class="muted">
    Deck:
    <select bind:value={lessonId} onchange={rebuild}>
      <option value="all">All words ({allWords().length})</option>
      {#each lessons as l}
        <option value={l.id}>{l.icon} {l.title}</option>
      {/each}
    </select>
  </label>
  <label class="muted">
    Front side:
    <select bind:value={frontLang}>
      <option value="hu">Hungarian</option>
      <option value="en">English</option>
    </select>
  </label>
</div>

{#if card}
  <div
    class="flashcard card"
    class:flipped
    onclick={() => (flipped = !flipped)}
    role="button"
    tabindex="0"
    onkeydown={(e) => e.key === ' ' && (e.preventDefault(), (flipped = !flipped))}
  >
    {#if !flipped}
      <div class="side">
        <span class="word" class:hu={frontLang === 'hu'}>{frontLang === 'hu' ? card.hu : card.en}</span>
        {#if frontLang === 'hu'}
          <div class="muted pron">{card.pron}</div>
        {/if}
        <div class="muted hint">tap to flip</div>
      </div>
    {:else}
      <div class="side">
        <span class="word" class:hu={frontLang === 'en'}>{frontLang === 'hu' ? card.en : card.hu}</span>
        {#if frontLang === 'en'}
          <div class="muted pron">{card.pron}</div>
        {/if}
      </div>
    {/if}
  </div>

  <div class="actions">
    <button class="btn" onclick={() => next(-1)}>← Previous</button>
    <AudioButton text={card.hu} label="Listen" />
    <button class="btn" class:green={known} onclick={() => progress.toggleKnownWord(card.hu)}>
      {known ? '✅ Known' : '☐ Mark known'}
    </button>
    <button class="btn primary" onclick={() => next(1)}>Next →</button>
  </div>
  <p class="muted center">Card {index + 1} / {deck.length} · {$progress.knownWords.length} words marked known</p>
{/if}

<style>
  .controls {
    display: flex;
    gap: 1.5rem;
    flex-wrap: wrap;
    margin-bottom: 1rem;
  }
  select {
    font: inherit;
    padding: 0.3rem 0.5rem;
    border-radius: 8px;
    border: 1px solid var(--border);
    margin-left: 0.3rem;
  }
  .flashcard {
    min-height: 200px;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    user-select: none;
    text-align: center;
    transition: transform 0.15s;
  }
  .flashcard:hover {
    transform: translateY(-2px);
  }
  .flashcard.flipped {
    background: var(--good-soft);
  }
  .word {
    font-size: 2rem;
    font-weight: 700;
  }
  .pron {
    font-style: italic;
    margin-top: 0.3rem;
  }
  .hint {
    font-size: 0.8rem;
    margin-top: 0.8rem;
  }
  .actions {
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 0.6rem;
    flex-wrap: wrap;
    margin: 1rem 0 0.5rem;
  }
  .center {
    text-align: center;
  }
</style>
