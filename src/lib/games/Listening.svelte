<script>
  import { allWords } from '../data/lessons.js';
  import { buildQuiz, scoreQuiz, grade } from '../quiz.js';
  import { progress } from '../progress.js';
  import { speak, ttsAvailable } from '../speech.js';

  const COUNT = 10;

  let questions = $state(buildQuiz(allWords(), { count: COUNT, direction: 'hu-en' }));
  let index = $state(0);
  let selected = $state(null);
  let results = $state([]);
  let finished = $state(false);
  let played = $state(false);

  let current = $derived(questions[index]);

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
      const percent = scoreQuiz(results).percent;
      progress.recordGame('listening', percent);
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

  let score = $derived(scoreQuiz(results));
</script>

<h1>👂 Listening Challenge</h1>
<p class="muted">
  Press play, listen carefully to the Hungarian word — you will NOT see it written — and pick the meaning.
  Replay as often as you like.
</p>

{#if !ttsAvailable()}
  <div class="card">⚠️ This game needs speech synthesis, which your browser does not support.</div>
{:else if finished}
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

<style>
  .center {
    text-align: center;
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
</style>
