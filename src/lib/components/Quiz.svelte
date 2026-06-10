<script>
  import { buildQuiz, scoreQuiz, grade } from '../quiz.js';
  import { speak } from '../speech.js';
  import AudioButton from './AudioButton.svelte';

  /** Multiple-choice quiz over `words`; calls onFinish(percent) when done. */
  let { words, count = 10, direction = 'mixed', onFinish = () => {} } = $props();

  // Snapshot the props on purpose: the quiz must not reshuffle mid-game.
  // svelte-ignore state_referenced_locally
  let questions = $state(buildQuiz(words, { count, direction }));
  let index = $state(0);
  let selected = $state(null);
  let results = $state([]);
  let finished = $state(false);

  let current = $derived(questions[index]);
  let score = $derived(scoreQuiz(results));

  function choose(choice) {
    if (selected !== null) return;
    selected = choice;
    const correct = choice === current.answer;
    results = [...results, { question: current, choice, correct }];
    if (current.promptLang === 'en') speak(current.answer);
  }

  function next() {
    if (index + 1 >= questions.length) {
      finished = true;
      onFinish(scoreQuiz(results).percent);
    } else {
      index += 1;
      selected = null;
    }
  }

  function restart() {
    questions = buildQuiz(words, { count, direction });
    index = 0;
    selected = null;
    results = [];
    finished = false;
  }
</script>

{#if !questions.length}
  <p class="muted">Not enough words for a quiz.</p>
{:else if finished}
  {@const g = grade(score.percent)}
  <div class="finish">
    <div class="big">{g.emoji}</div>
    <h2>{g.label}</h2>
    <p>You scored <strong>{score.correct} / {score.total}</strong> ({score.percent}%)</p>
    {#if results.some((r) => !r.correct)}
      <div class="review">
        <h3>Review your mistakes:</h3>
        {#each results.filter((r) => !r.correct) as r}
          <div class="mistake">
            <span class="hu">{r.question.word.hu}</span> = {r.question.word.en}
            <AudioButton text={r.question.word.hu} />
          </div>
        {/each}
      </div>
    {/if}
    <button class="btn primary" onclick={restart}>🔁 Try again</button>
  </div>
{:else}
  <div class="quiz-head">
    <span class="muted">Question {index + 1} / {questions.length}</span>
    <div class="progress-bar"><div style="width: {(index / questions.length) * 100}%"></div></div>
  </div>

  <div class="prompt">
    {#if current.promptLang === 'hu'}
      <span class="hu big-prompt">{current.prompt}</span>
      <AudioButton text={current.prompt} />
      <div class="muted">What does this mean?</div>
    {:else}
      <span class="big-prompt">{current.prompt}</span>
      <div class="muted">How do you say this in Hungarian?</div>
    {/if}
  </div>

  <div class="choices">
    {#each current.choices as choice}
      <button
        class="btn choice"
        class:correct={selected !== null && choice === current.answer}
        class:wrong={selected === choice && choice !== current.answer}
        onclick={() => choose(choice)}
      >
        {choice}
      </button>
    {/each}
  </div>

  {#if selected !== null}
    <div class="feedback">
      {#if selected === current.answer}
        <span class="pill green">✅ Helyes! (Correct!)</span>
      {:else}
        <span class="pill">❌ The answer is: <strong>{current.answer}</strong></span>
      {/if}
      <button class="btn primary" onclick={next}>
        {index + 1 >= questions.length ? 'Finish' : 'Next →'}
      </button>
    </div>
  {/if}
{/if}

<style>
  .quiz-head {
    display: flex;
    align-items: center;
    gap: 1rem;
    margin-bottom: 1rem;
  }
  .quiz-head .progress-bar {
    flex: 1;
  }
  .prompt {
    text-align: center;
    margin: 1.5rem 0;
  }
  .big-prompt {
    font-size: 1.7rem;
    font-weight: 700;
  }
  .choices {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
    gap: 0.6rem;
  }
  .choice {
    padding: 0.8rem;
    font-size: 1rem;
  }
  .feedback {
    margin-top: 1rem;
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 1rem;
    flex-wrap: wrap;
  }
  .finish {
    text-align: center;
  }
  .finish .big {
    font-size: 3rem;
  }
  .review {
    text-align: left;
    background: var(--bg);
    border-radius: 10px;
    padding: 0.75rem 1rem;
    margin: 1rem 0;
  }
  .mistake {
    padding: 0.25rem 0;
  }
</style>
