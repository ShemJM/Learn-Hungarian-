<script>
  import { speak } from '../speech.js';

  // One full-screen micro-lesson. The feed owns scrolling, likes and audio
  // autoplay; this component owns the reel's own interaction (reveal, answer).
  let { reel, onanswer = () => {} } = $props();

  let revealed = $state(false);
  let picked = $state(null);

  let answered = $derived(picked !== null);

  function pick(choice) {
    if (answered) return;
    picked = choice;
    const correct = choice === reel.answer;
    onanswer(reel, correct);
    // Hearing the word again right after answering is what makes it stick.
    speak(reel.word.hu);
  }

  /** Taps on buttons inside the card must not count toward the feed's double-tap like. */
  function own(fn) {
    return (e) => {
      e.stopPropagation();
      fn();
    };
  }
</script>

<div class="content">
  <div class="kicker">{reel.emoji} {reel.label}</div>

  {#if reel.type === 'word'}
    <div class="big hu-text">{reel.word.hu}</div>
    {#if reel.word.pron}<div class="pron">/{reel.word.pron}/</div>{/if}
    {#if revealed}
      <div class="meaning">{reel.word.en}</div>
    {:else}
      <button class="reveal" onclick={own(() => (revealed = true))}>Tap to see the meaning</button>
    {/if}
  {:else if reel.type === 'phrase'}
    <div class="mid hu-text">{reel.phrase.hu}</div>
    {#if revealed}
      <div class="meaning">{reel.phrase.en}</div>
    {:else}
      <button class="reveal" onclick={own(() => (revealed = true))}>Tap to translate</button>
    {/if}
  {:else if reel.type === 'quiz' || reel.type === 'listen'}
    {#if reel.type === 'quiz'}
      <div class="ask">What does this mean?</div>
      <div class="big hu-text">{reel.word.hu}</div>
    {:else}
      <div class="ask">What did you hear?</div>
      <button class="ear" onclick={own(() => speak(reel.word.hu))} aria-label="Play the word again">🔊</button>
      {#if answered}<div class="mid hu-text">{reel.word.hu}</div>{/if}
    {/if}
    <div class="choices">
      {#each reel.choices as choice}
        <button
          class="choice"
          class:right={answered && choice === reel.answer}
          class:miss={answered && picked === choice && choice !== reel.answer}
          disabled={answered}
          onclick={own(() => pick(choice))}
        >
          {choice}
        </button>
      {/each}
    </div>
    {#if answered}
      <div class="verdict">{picked === reel.answer ? 'Ügyes! 🎉 Nice one.' : 'Majdnem! It means “' + reel.answer + '”.'}</div>
    {/if}
  {:else if reel.type === 'tip'}
    <div class="heading">{reel.heading}</div>
    <p class="body">{reel.body}</p>
    {#each reel.examples as ex}
      <button class="example" onclick={own(() => speak(ex.hu))}>
        <span class="hu-text">🔊 {ex.hu}</span>
        <span class="ex-en">{ex.en}</span>
      </button>
    {/each}
  {:else if reel.type === 'drill'}
    <div class="mid">{reel.prompt}</div>
    {#if revealed}
      <div class="big hu-text">{reel.answer}</div>
      {#if reel.hint}<div class="hint">💡 {reel.hint}</div>{/if}
    {:else}
      <div class="hint">Say it out loud first…</div>
      <button class="reveal" onclick={own(() => { revealed = true; speak(reel.answer); })}>Show the answer</button>
    {/if}
  {:else if reel.type === 'verb'}
    <div class="big hu-text">{reel.verb.inf}</div>
    <div class="meaning small">{reel.verb.en}</div>
    <div class="table">
      {#each reel.rows as row}
        <button class="cell" onclick={own(() => speak(`${row.pronoun} ${row.form}`))}>
          <span class="pronoun">{row.pronoun}</span>
          <span class="hu-text">{row.form}</span>
        </button>
      {/each}
    </div>
  {:else if reel.type === 'dialogue'}
    <div class="scene">{reel.scene}</div>
    <div class="chat">
      {#each reel.lines as line}
        <button class="bubble" class:me={line.speaker === 'B'} onclick={own(() => speak(line.hu))}>
          <span class="who">{line.name}</span>
          <span class="hu-text">{line.hu}</span>
          {#if revealed}<span class="ex-en">{line.en}</span>{/if}
        </button>
      {/each}
    </div>
    {#if !revealed}
      <button class="reveal" onclick={own(() => (revealed = true))}>Show translations</button>
    {/if}
  {:else if reel.type === 'reading'}
    <div class="level">{reel.level}</div>
    <div class="mid hu-text">{reel.sentence.hu}</div>
    {#if revealed}
      <div class="meaning">{reel.sentence.en}</div>
    {:else}
      <button class="reveal" onclick={own(() => (revealed = true))}>Tap to translate</button>
    {/if}
  {/if}
</div>

<style>
  .content {
    width: 100%;
    max-width: 30rem;
    display: flex;
    flex-direction: column;
    align-items: center;
    text-align: center;
    gap: 0.9rem;
  }
  .kicker {
    font-size: 0.8rem;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.08em;
    opacity: 0.85;
  }
  .hu-text {
    font-weight: 800;
  }
  .big {
    font-size: clamp(2.2rem, 11vw, 3.6rem);
    line-height: 1.1;
    overflow-wrap: anywhere;
  }
  .mid {
    font-size: clamp(1.4rem, 6.5vw, 2.1rem);
    line-height: 1.25;
  }
  .pron {
    font-size: 1.05rem;
    opacity: 0.8;
    font-style: italic;
  }
  .meaning {
    font-size: 1.35rem;
    font-weight: 600;
    background: rgba(255, 255, 255, 0.16);
    padding: 0.4rem 0.9rem;
    border-radius: 12px;
  }
  .meaning.small {
    font-size: 1.05rem;
  }
  .ask,
  .scene,
  .level,
  .hint {
    font-size: 1rem;
    opacity: 0.9;
  }
  .reveal {
    border: 2px dashed rgba(255, 255, 255, 0.6);
    background: transparent;
    color: inherit;
    padding: 0.6rem 1.1rem;
    border-radius: 999px;
    font-weight: 700;
  }
  .ear {
    font-size: 3.2rem;
    width: 6rem;
    height: 6rem;
    border-radius: 50%;
    border: none;
    background: rgba(255, 255, 255, 0.18);
    color: inherit;
  }
  .choices {
    width: 100%;
    display: flex;
    flex-direction: column;
    gap: 0.55rem;
  }
  .choice {
    width: 100%;
    border: 2px solid rgba(255, 255, 255, 0.45);
    background: rgba(255, 255, 255, 0.12);
    color: inherit;
    font-size: 1.1rem;
    font-weight: 700;
    padding: 0.8rem 1rem;
    border-radius: 14px;
  }
  .choice:disabled {
    cursor: default;
    opacity: 0.75;
  }
  .choice.right {
    background: var(--green);
    border-color: #fff;
    opacity: 1;
  }
  .choice.miss {
    background: #7a0a1c;
    border-color: #fff;
    opacity: 1;
  }
  .verdict {
    font-weight: 700;
    font-size: 1.05rem;
  }
  .heading {
    font-size: clamp(1.3rem, 6vw, 1.8rem);
    font-weight: 800;
    line-height: 1.2;
  }
  .body {
    margin: 0;
    font-size: 1.02rem;
    line-height: 1.5;
    white-space: pre-line;
  }
  .example,
  .bubble,
  .cell {
    border: none;
    color: inherit;
    background: rgba(255, 255, 255, 0.14);
    border-radius: 14px;
    padding: 0.55rem 0.85rem;
    display: flex;
    flex-direction: column;
    gap: 0.15rem;
    text-align: left;
  }
  .example {
    width: 100%;
  }
  .ex-en {
    font-size: 0.9rem;
    opacity: 0.85;
  }
  .table {
    width: 100%;
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 0.45rem;
  }
  .cell {
    flex-direction: row;
    justify-content: space-between;
    align-items: baseline;
    font-size: 1.05rem;
  }
  .pronoun {
    opacity: 0.75;
  }
  .chat {
    width: 100%;
    display: flex;
    flex-direction: column;
    gap: 0.45rem;
  }
  .bubble {
    max-width: 85%;
    align-self: flex-start;
    border-bottom-left-radius: 4px;
  }
  .bubble.me {
    align-self: flex-end;
    background: rgba(255, 255, 255, 0.28);
    border-bottom-left-radius: 14px;
    border-bottom-right-radius: 4px;
  }
  .who {
    font-size: 0.75rem;
    font-weight: 700;
    opacity: 0.75;
    text-transform: uppercase;
  }
</style>
