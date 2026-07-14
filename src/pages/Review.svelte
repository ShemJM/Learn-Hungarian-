<script>
  import { allWords } from '../lib/data/lessons.js';
  import { dayStamp, dueWords, buildSession, BOX_COUNT } from '../lib/srs.js';
  import { checkAnswer } from '../lib/text.js';
  import { speak } from '../lib/speech.js';
  import { progress } from '../lib/progress.js';
  import AudioButton from '../lib/components/AudioButton.svelte';

  // Snapshot the session once — deriving it from $progress would reshuffle
  // the deck after every recordReview call.
  let session = $state([]);
  let index = $state(0);
  let guess = $state('');
  let status = $state('idle'); // idle | playing | revealed | done
  let lastResult = $state(null); // 'exact' | 'accents' | 'wrong' | 'gaveup'
  let correctCount = $state(0);
  let totalDue = $state(0);

  function refresh() {
    totalDue = dueWords(allWords(), $progress.srs, dayStamp()).length;
    status = 'idle';
  }

  function start() {
    session = buildSession(allWords(), $progress.srs, dayStamp());
    index = 0;
    guess = '';
    lastResult = null;
    correctCount = 0;
    status = session.length ? 'playing' : 'done';
  }

  refresh();

  let current = $derived(session[index]);
  let boxOf = $derived((hu) => $progress.srs[hu]?.box || null);

  function submit() {
    if (!guess.trim()) return;
    const result = checkAnswer(guess, current.hu);
    lastResult = result;
    if (result === 'wrong') {
      progress.recordReview(current.hu, false);
    } else {
      correctCount += 1;
      progress.recordReview(current.hu, true);
    }
    speak(current.hu);
    status = 'revealed';
  }

  function giveUp() {
    lastResult = 'gaveup';
    progress.recordReview(current.hu, false);
    speak(current.hu);
    status = 'revealed';
  }

  function next() {
    if (index + 1 >= session.length) {
      status = 'done';
      progress.logReviewSession(session.length, correctCount); // one log entry per session, not per card
      totalDue = dueWords(allWords(), $progress.srs, dayStamp()).length;
    } else {
      index += 1;
      guess = '';
      lastResult = null;
      status = 'playing';
    }
  }
</script>

<h1>🔁 Daily Review</h1>
<p class="muted">
  Spaced repetition: words you know well come back rarely, words you miss come back tomorrow.
  A few minutes a day keeps the whole course fresh.
</p>

{#if status === 'idle'}
  <div class="card center">
    {#if totalDue}
      <h2>{totalDue} word{totalDue === 1 ? '' : 's'} due today</h2>
      <p class="muted">Sessions are capped at 20 cards, with at most 10 brand-new words.</p>
      <button class="btn primary" onclick={start}>▶️ Start review</button>
    {:else}
      <h2>🎉 All caught up!</h2>
      <p class="muted">Nothing is due right now. Come back tomorrow — or learn new words in the lessons.</p>
      <a class="btn primary" href="#/lessons">📚 Go to lessons</a>
    {/if}
  </div>
{:else if status === 'done'}
  <div class="card center">
    <h2>🏁 Session complete: {correctCount} / {session.length}</h2>
    {#if totalDue}
      <p class="muted">{totalDue} word{totalDue === 1 ? ' is' : 's are'} still due — keep going?</p>
      <button class="btn primary" onclick={start}>▶️ Next session</button>
    {:else}
      <p class="muted">That's everything for today. Viszlát holnap! (See you tomorrow!)</p>
    {/if}
  </div>
{:else if current}
  <div class="card center">
    <div class="meta">
      <span class="pill">Card {index + 1} / {session.length}</span>
      {#if boxOf(current.hu)}
        <span class="pill green">Box {boxOf(current.hu)} / {BOX_COUNT}</span>
      {:else}
        <span class="pill">✨ New word</span>
      {/if}
    </div>
    <p class="clue muted">How do you say…</p>
    <p class="prompt">{current.en}</p>

    {#if status === 'playing'}
      <form onsubmit={(e) => { e.preventDefault(); submit(); }}>
        <!-- svelte-ignore a11y_autofocus -->
        <input
          type="text"
          bind:value={guess}
          placeholder="Type it in Hungarian…"
          autocomplete="off"
          autocapitalize="off"
          autofocus
        />
        <div class="actions">
          <button class="btn primary" type="submit">Check</button>
          <button class="btn" type="button" onclick={giveUp}>Reveal</button>
        </div>
      </form>
    {:else}
      <div class="answer">
        {#if lastResult === 'exact'}
          <p class="pill green">✅ Tökéletes!</p>
        {:else if lastResult === 'accents'}
          <p class="pill green">✅ Right — just watch the accents!</p>
        {:else if lastResult === 'wrong'}
          <p class="pill">❌ Not this time — it comes back tomorrow.</p>
        {:else}
          <p class="pill">The answer was:</p>
        {/if}
        <p class="hu solution">{current.hu} <AudioButton text={current.hu} /></p>
        {#if current.pron}
          <p class="muted">{current.pron}</p>
        {/if}
        <button class="btn primary" onclick={next}>
          {index + 1 >= session.length ? 'Finish' : 'Next →'}
        </button>
      </div>
    {/if}
  </div>
{/if}

<style>
  .center {
    text-align: center;
  }
  .meta {
    display: flex;
    justify-content: center;
    gap: 0.5rem;
    margin-bottom: 0.5rem;
  }
  .clue {
    margin-bottom: 0;
  }
  .prompt {
    font-size: 1.4rem;
    font-weight: 700;
    margin: 0.3rem 0 1rem;
  }
  input {
    font: inherit;
    font-size: 1.1rem;
    padding: 0.6rem 0.9rem;
    border-radius: 10px;
    border: 2px solid var(--border);
    width: min(320px, 100%);
    text-align: center;
  }
  input:focus {
    outline: none;
    border-color: var(--accent);
  }
  .actions {
    display: flex;
    justify-content: center;
    gap: 0.5rem;
    margin-top: 0.75rem;
  }
  .solution {
    font-size: 1.6rem;
    margin: 0.5rem 0 0.2rem;
  }
</style>
