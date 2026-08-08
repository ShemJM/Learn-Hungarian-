<script>
  import { get } from 'svelte/store';
  import { allWords, lessons } from '../data/lessons.js';
  import { eligibleReviewPool } from '../course.js';
  import { buildQuiz, scoreQuiz, grade } from '../quiz.js';
  import { checkAnswer, sample } from '../text.js';
  import { progress } from '../progress.js';
  import { speak, ttsAvailable } from '../speech.js';
  import AccentBar from '../components/AccentBar.svelte';
  import AudioButton from '../components/AudioButton.svelte';

  const COUNT = 10;
  const PHRASE_COUNT = 5;

  let mode = $state('words'); // words | phrases

  // ---- words mode (hu→en multiple choice) ----
  let questions = $state(buildQuiz(allWords(), { count: COUNT, direction: 'hu-en' }));
  let index = $state(0);
  let selected = $state(null);
  let results = $state([]);
  let finished = $state(false);
  let played = $state(false);

  let current = $derived(questions[index]);
  let score = $derived(scoreQuiz(results));

  // ---- phrases mode (dictation: hear it, type it) ----
  // Pool snapshot per round via get(progress) — course-gated, non-reactive.
  let phrases = $state([]);
  let pIndex = $state(0);
  let typed = $state('');
  let pResult = $state(null); // null | 'exact' | 'accents' | 'wrong'
  let pResults = $state([]);
  let pFinished = $state(false);
  let pPlayed = $state(false);
  let inputEl = $state(null);

  let currentPhrase = $derived(phrases[pIndex]);
  let pScore = $derived(scoreQuiz(pResults));

  function newPhraseRound() {
    const pool = eligibleReviewPool(lessons, get(progress)).filter((i) => i.isPhrase);
    phrases = sample(pool, PHRASE_COUNT);
    pIndex = 0;
    typed = '';
    pResult = null;
    pResults = [];
    pFinished = false;
    pPlayed = false;
  }

  function setMode(m) {
    if (mode === m) return;
    mode = m;
    if (m === 'phrases') newPhraseRound();
  }

  function play() {
    speak(current.prompt);
    played = true;
  }

  function choose(choice) {
    if (selected !== null || !played) return;
    selected = choice;
    results = [...results, { correct: choice === current.answer }];
  }

  function next() {
    if (index + 1 >= questions.length) {
      finished = true;
      progress.recordGame('listening', scoreQuiz(results).percent);
    } else {
      index += 1;
      selected = null;
      played = false;
    }
  }

  function restart() {
    questions = buildQuiz(allWords(), { count: COUNT, direction: 'hu-en' });
    index = 0;
    selected = null;
    results = [];
    finished = false;
    played = false;
  }

  function playPhrase() {
    speak(currentPhrase.hu);
    pPlayed = true;
  }

  function submitPhrase(e) {
    e?.preventDefault();
    if (!typed.trim() || pResult !== null) return;
    pResult = checkAnswer(typed, currentPhrase.hu);
    pResults = [...pResults, { correct: pResult !== 'wrong' }];
  }

  function nextPhrase() {
    if (pIndex + 1 >= phrases.length) {
      pFinished = true;
      progress.recordGame('listening-phrases', scoreQuiz(pResults).percent);
    } else {
      pIndex += 1;
      typed = '';
      pResult = null;
      pPlayed = false;
    }
  }
</script>

<h1>👂 Listening Challenge</h1>
<p class="muted">
  Nothing is written down — your ears do the work. <strong>Words</strong>: pick the meaning.
  <strong>Phrases</strong>: type exactly what you hear (dictation). Replay as often as you like.
</p>

<div class="tabs">
  <button class="btn" class:primary={mode === 'words'} onclick={() => setMode('words')}>🔤 Words</button>
  <button class="btn" class:primary={mode === 'phrases'} onclick={() => setMode('phrases')}>🗣️ Phrases</button>
</div>

{#if !ttsAvailable()}
  <div class="card">⚠️ This game needs speech synthesis, which your browser does not support.</div>
{:else if mode === 'words'}
  {#if finished}
    {@const g = grade(score.percent)}
    <div class="card center">
      <div class="big">{g.emoji}</div>
      <h2>{g.label}</h2>
      <p>You scored <strong>{score.correct} / {score.total}</strong> ({score.percent}%)</p>
      {#if $progress.gameBest['listening']}
        <p class="muted">🏆 Best: {$progress.gameBest['listening']}%</p>
      {/if}
      <button class="btn primary" onclick={restart}>🔁 Play again</button>
    </div>
  {:else if current}
    <div class="card center">
      <span class="pill">Question {index + 1} / {questions.length}</span>
      <div class="player">
        <button class="btn primary big-play" onclick={play}>🔊 {played ? 'Play again' : 'Play the word'}</button>
      </div>
      <div class="choices" class:dimmed={!played}>
        {#each current.choices as choice}
          <button
            class="btn"
            disabled={!played}
            class:correct={selected !== null && choice === current.answer}
            class:wrong={selected === choice && choice !== current.answer}
            onclick={() => choose(choice)}
          >
            {choice}
          </button>
        {/each}
      </div>
      {#if selected !== null}
        <div class="reveal">
          <p>The word was: <span class="hu">{current.prompt}</span></p>
          <button class="btn green" onclick={next}>{index + 1 >= questions.length ? 'Finish' : 'Next →'}</button>
        </div>
      {/if}
    </div>
  {/if}
{:else if phrases.length < 3}
  <div class="card center">
    <h2>🔒 Not enough phrases yet</h2>
    <p class="muted">
      Phrase dictation draws on the phrases of lessons you have started — work through the course
      and this unlocks itself.
    </p>
    <a class="btn primary" href="#/course">🧭 Continue the course</a>
  </div>
{:else if pFinished}
  {@const g = grade(pScore.percent)}
  <div class="card center">
    <div class="big">{g.emoji}</div>
    <h2>{g.label}</h2>
    <p>You scored <strong>{pScore.correct} / {pScore.total}</strong> ({pScore.percent}%)</p>
    {#if $progress.gameBest['listening-phrases']}
      <p class="muted">🏆 Best: {$progress.gameBest['listening-phrases']}%</p>
    {/if}
    <button class="btn primary" onclick={newPhraseRound}>🔁 Play again</button>
  </div>
{:else if currentPhrase}
  <div class="card center">
    <span class="pill">Phrase {pIndex + 1} / {phrases.length}</span>
    <div class="player">
      <button class="btn primary big-play" onclick={playPhrase}>
        🔊 {pPlayed ? 'Play again' : 'Play the phrase'}
      </button>
    </div>
    {#if pResult === null}
      <form class="dictation" onsubmit={submitPhrase}>
        <input
          type="text"
          bind:value={typed}
          bind:this={inputEl}
          disabled={!pPlayed}
          placeholder={pPlayed ? 'Type what you heard…' : 'Play it first…'}
          autocomplete="off"
          autocapitalize="off"
          spellcheck="false"
          lang="hu"
        />
        <AccentBar input={inputEl} />
        <button class="btn primary" type="submit" disabled={!pPlayed}>Check</button>
      </form>
    {:else}
      <div class="reveal">
        {#if pResult === 'exact'}
          <p class="pill green">✅ Tökéletes!</p>
        {:else if pResult === 'accents'}
          <p class="pill green">✅ Right — just watch the accents!</p>
        {:else}
          <p class="pill">❌ Not quite. It was:</p>
        {/if}
        <p class="hu solution">{currentPhrase.hu} <AudioButton text={currentPhrase.hu} /></p>
        <p class="muted">{currentPhrase.en}</p>
        <button class="btn green" onclick={nextPhrase}>
          {pIndex + 1 >= phrases.length ? 'Finish' : 'Next →'}
        </button>
      </div>
    {/if}
  </div>
{/if}

<style>
  .center {
    text-align: center;
  }
  .tabs {
    display: flex;
    gap: 0.5rem;
    margin-bottom: 1rem;
  }
  .big {
    font-size: 3rem;
  }
  .player {
    margin: 1.25rem 0;
  }
  .big-play {
    font-size: 1.15rem;
    padding: 0.8rem 1.6rem;
  }
  .choices {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(170px, 1fr));
    gap: 0.6rem;
  }
  .choices.dimmed {
    opacity: 0.55;
  }
  .reveal {
    margin-top: 1rem;
  }
  .dictation input {
    font: inherit;
    font-size: 1.1rem;
    padding: 0.6rem 0.9rem;
    border-radius: 10px;
    border: 2px solid var(--border);
    width: min(480px, 100%);
    text-align: center;
  }
  .dictation input:focus {
    outline: none;
    border-color: var(--accent);
  }
  .dictation .btn {
    margin-top: 0.5rem;
  }
  .solution {
    font-size: 1.35rem;
    margin: 0.6rem 0 0.2rem;
  }
</style>
