<script>
  import { progress } from '../lib/progress.js';
  import Flashcards from '../lib/games/Flashcards.svelte';
  import Matching from '../lib/games/Matching.svelte';
  import Scramble from '../lib/games/Scramble.svelte';
  import Listening from '../lib/games/Listening.svelte';
  import QuickFire from '../lib/games/QuickFire.svelte';
  import SpellSay from '../lib/games/SpellSay.svelte';
  import SentenceBuilder from '../lib/games/SentenceBuilder.svelte';

  let { game = null } = $props();

  const games = [
    { id: 'quickfire', icon: '⚡', title: 'Quick Fire', desc: 'Full-screen speed round: a word flashes up, tap its translation before the timer runs out.' },
    { id: 'flashcards', icon: '🃏', title: 'Flashcards', desc: 'Flip cards and mark the words you know.' },
    { id: 'matching', icon: '🧠', title: 'Matching Pairs', desc: 'Match Hungarian words with their English meanings against the clock.' },
    { id: 'scramble', icon: '🔀', title: 'Word Scramble', desc: 'Unscramble the Hungarian word from its English meaning.' },
    { id: 'listening', icon: '👂', title: 'Listening Challenge', desc: 'Hear a Hungarian word and pick what it means.' },
    { id: 'spellsay', icon: '⏱️', title: 'Spell & Say Sprint', desc: 'Type the English word, say it out loud, and see how many you can nail in 60 seconds.' },
    { id: 'sentencebuilder', icon: '🧱', title: 'Sentence Builder', desc: 'Rebuild the Hungarian sentence from shuffled word tiles — perfect word-order practice.' }
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
  {#if game === 'quickfire'}
    <QuickFire />
  {:else if game === 'flashcards'}
    <Flashcards />
  {:else if game === 'matching'}
    <Matching />
  {:else if game === 'scramble'}
    <Scramble />
  {:else if game === 'listening'}
    <Listening />
  {:else if game === 'spellsay'}
    <SpellSay />
  {:else if game === 'sentencebuilder'}
    <SentenceBuilder />
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
