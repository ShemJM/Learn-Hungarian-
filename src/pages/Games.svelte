<script>
  import { progress } from '../lib/progress.js';
  import Flashcards from '../lib/games/Flashcards.svelte';
  import Matching from '../lib/games/Matching.svelte';
  import Scramble from '../lib/games/Scramble.svelte';
  import Listening from '../lib/games/Listening.svelte';

  let { game = null } = $props();

  const games = [
    { id: 'flashcards', icon: '🃏', title: 'Flashcards', desc: 'Flip cards and mark the words you know.' },
    { id: 'matching', icon: '🧠', title: 'Matching Pairs', desc: 'Match Hungarian words with their English meanings against the clock.' },
    { id: 'scramble', icon: '🔀', title: 'Word Scramble', desc: 'Unscramble the Hungarian word from its English meaning.' },
    { id: 'listening', icon: '👂', title: 'Listening Challenge', desc: 'Hear a Hungarian word and pick what it means.' }
  ];
</script>

{#if !game}
  <h1>🎲 Mini Games</h1>
  <p class="muted">Five minutes of play beats an hour of staring at word lists. Best scores are saved.</p>
  <div class="grid two">
    {#each games as g}
      <a class="card item" href={'#/games/' + g.id}>
        <h3>{g.icon} {g.title}</h3>
        <p class="muted">{g.desc}</p>
        {#if $progress.gameBest[g.id]}
          <span class="pill green">🏆 Best: {$progress.gameBest[g.id]}</span>
        {/if}
      </a>
    {/each}
  </div>
{:else}
  <a href="#/games" class="muted back">← All games</a>
  {#if game === 'flashcards'}
    <Flashcards />
  {:else if game === 'matching'}
    <Matching />
  {:else if game === 'scramble'}
    <Scramble />
  {:else if game === 'listening'}
    <Listening />
  {:else}
    <p>Game not found.</p>
  {/if}
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
</style>
