<script>
  import { dialogues, getDialogue } from '../lib/data/dialogues.js';
  import { progress } from '../lib/progress.js';
  import { speak } from '../lib/speech.js';
  import AudioButton from '../lib/components/AudioButton.svelte';
  import PronunciationCheck from '../lib/components/PronunciationCheck.svelte';

  let { id = null } = $props();
  let dialogue = $derived(id ? getDialogue(id) : null);

  let mode = $state('study'); // study | roleplay
  let step = $state(0); // roleplay progress: index of next line to handle
  let showHints = $state(true);

  $effect(() => {
    if (id) {
      mode = 'study';
      step = 0;
    }
  });

  function playAll() {
    // Speak the dialogue line by line with small pauses (single utterance keeps it simple).
    speak(dialogue.lines.map((l) => l.hu).join('. '), { rate: 0.8 });
  }

  function advance() {
    const line = dialogue.lines[step];
    if (line && line.speaker === 'A') speak(line.hu);
    step += 1;
    if (step >= dialogue.lines.length) progress.markDialogueDone(dialogue.id);
  }

  let finishedRoleplay = $derived(dialogue && step >= dialogue.lines.length);
</script>

{#if !dialogue}
  <h1>💬 Conversation Practice</h1>
  <p class="muted">
    Real-life dialogues you will actually use. Study the conversation first, then switch to
    <strong>role-play mode</strong>: the app speaks the other part, and you say your lines out loud.
  </p>
  <div class="grid two">
    {#each dialogues as d}
      <a class="card item" href={'#/conversation/' + d.id}>
        <h3>{d.icon} {d.title}</h3>
        <p class="muted">{d.scene}</p>
        {#if $progress.dialoguesDone.includes(d.id)}
          <span class="pill green">✅ Practised</span>
        {/if}
      </a>
    {/each}
  </div>
{:else}
  <a href="#/conversation" class="muted back">← All dialogues</a>
  <h1>{dialogue.icon} {dialogue.title}</h1>
  <p class="muted">{dialogue.scene}</p>

  <div class="tabs">
    <button class="btn" class:primary={mode === 'study'} onclick={() => (mode = 'study')}>📖 Study</button>
    <button class="btn" class:primary={mode === 'roleplay'} onclick={() => { mode = 'roleplay'; step = 0; }}>
      🎭 Role-play (you are “{dialogue.lines.find((l) => l.speaker === 'B')?.name}”)
    </button>
  </div>

  {#if mode === 'study'}
    <div class="card">
      <button class="btn" onclick={playAll}>🔊 Play the whole dialogue</button>
      {#each dialogue.lines as line}
        <div class="line" class:you={line.speaker === 'B'}>
          <div class="bubble">
            <div class="who muted">{line.name}</div>
            <span class="hu">{line.hu}</span>
            <AudioButton text={line.hu} />
            <div class="muted en">{line.en}</div>
          </div>
        </div>
      {/each}
    </div>
  {:else}
    <div class="card">
      <label class="hints">
        <input type="checkbox" bind:checked={showHints} />
        Show my lines (turn off for a real challenge!)
      </label>

      {#each dialogue.lines.slice(0, step) as line}
        <div class="line" class:you={line.speaker === 'B'}>
          <div class="bubble done">
            <div class="who muted">{line.name}</div>
            <span class="hu">{line.hu}</span>
            <div class="muted en">{line.en}</div>
          </div>
        </div>
      {/each}

      {#if !finishedRoleplay}
        {@const current = dialogue.lines[step]}
        {#if current.speaker === 'A'}
          <div class="turn">
            <p><strong>{current.name}</strong> speaks — press play to hear them:</p>
            <button class="btn primary" onclick={advance}>▶️ Hear {current.name}</button>
          </div>
        {:else}
          <div class="turn you-turn">
            <p><strong>Your turn!</strong> Say this line out loud:</p>
            {#if showHints}
              <p class="hu big">{current.hu}</p>
              <p class="muted">({current.en})</p>
            {:else}
              <p class="muted">Your line means: <em>{current.en}</em></p>
            {/if}
            <PronunciationCheck text={current.hu} />
            <button class="btn green" onclick={advance}>Done — next →</button>
          </div>
        {/if}
      {:else}
        <div class="turn">
          <h3>🎉 Szuper! You completed the dialogue.</h3>
          <button class="btn primary" onclick={() => (step = 0)}>🔁 Role-play again</button>
        </div>
      {/if}
    </div>
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
  .tabs {
    display: flex;
    gap: 0.5rem;
    margin-bottom: 1rem;
    flex-wrap: wrap;
  }
  .line {
    display: flex;
    margin: 0.6rem 0;
  }
  .line.you {
    justify-content: flex-end;
  }
  .bubble {
    background: var(--bg);
    border: 1px solid var(--border);
    border-radius: 14px;
    padding: 0.5rem 0.9rem;
    max-width: 80%;
  }
  .line.you .bubble {
    background: var(--good-soft);
  }
  .who {
    font-size: 0.75rem;
    text-transform: uppercase;
    letter-spacing: 0.04em;
  }
  .en {
    font-size: 0.88rem;
  }
  .turn {
    border: 2px dashed var(--border);
    border-radius: 12px;
    padding: 1rem;
    margin-top: 1rem;
  }
  .you-turn {
    border-color: var(--green);
  }
  .big {
    font-size: 1.3rem;
  }
  .hints {
    display: flex;
    align-items: center;
    gap: 0.4rem;
    font-size: 0.9rem;
    color: var(--muted);
  }
</style>
