<script>
  import { getLesson } from '../lib/data/lessons.js';
  import { course } from '../lib/data/course.js';
  import { nextCourseStep } from '../lib/course.js';
  import { progress } from '../lib/progress.js';
  import AudioButton from '../lib/components/AudioButton.svelte';
  import PronunciationCheck from '../lib/components/PronunciationCheck.svelte';
  import Quiz from '../lib/components/Quiz.svelte';

  let { id } = $props();

  let lesson = $derived(getLesson(id));
  let nextStep = $derived(nextCourseStep(course, $progress));
  let tab = $state('learn'); // learn | practise | quiz

  // Reset to the learn tab when navigating between lessons, and release the
  // lesson's words and phrases into the spaced-repetition pool.
  $effect(() => {
    if (id) tab = 'learn';
    if (lesson) progress.markLessonStarted(id);
  });

  function onQuizFinish(percent) {
    progress.recordQuiz(id, percent);
  }
</script>

{#if !lesson}
  <p>Lesson not found. <a href="#/lessons">Back to lessons</a></p>
{:else}
  <a href="#/lessons" class="muted back">← All lessons</a>
  <h1>{lesson.icon} {lesson.title}</h1>
  <p>{lesson.intro}</p>

  <div class="tabs">
    <button class="btn" class:primary={tab === 'learn'} onclick={() => (tab = 'learn')}>📖 Learn</button>
    <button class="btn" class:primary={tab === 'practise'} onclick={() => (tab = 'practise')}>🎤 Practise speaking</button>
    <button class="btn" class:primary={tab === 'quiz'} onclick={() => (tab = 'quiz')}>✏️ Quiz</button>
  </div>

  {#if tab === 'learn'}
    <div class="card">
      <table>
        <thead>
          <tr><th>Hungarian</th><th>English</th><th>Sounds like</th><th></th><th>Known?</th></tr>
        </thead>
        <tbody>
          {#each lesson.words as word}
            <tr>
              <td><span class="hu">{word.hu}</span></td>
              <td>{word.en}</td>
              <td class="muted pron">{word.pron}</td>
              <td><AudioButton text={word.hu} /></td>
              <td>
                <button
                  class="know"
                  class:known={$progress.knownWords.includes(word.hu)}
                  onclick={() => progress.toggleKnownWord(word.hu)}
                  title="Mark as known"
                >
                  {$progress.knownWords.includes(word.hu) ? '✅' : '☐'}
                </button>
              </td>
            </tr>
          {/each}
        </tbody>
      </table>
    </div>

    {#if lesson.phrases?.length}
      <div class="card">
        <h3>🗣️ Useful phrases</h3>
        {#each lesson.phrases as phrase}
          <div class="phrase">
            <div>
              <span class="hu">{phrase.hu}</span>
              <AudioButton text={phrase.hu} />
              <div class="muted">{phrase.en}</div>
            </div>
          </div>
        {/each}
      </div>
    {/if}
  {:else if tab === 'practise'}
    <div class="card">
      <h3>🎤 Say each word out loud</h3>
      <p class="muted">
        Listen first, then press “Say it” and pronounce the word. You will get a similarity score —
        70% or more counts as good. (Speech recognition works best in Chrome or Edge.)
      </p>
      {#each lesson.words as word}
        <div class="practise-row">
          <div class="word">
            <span class="hu">{word.hu}</span>
            <span class="muted"> — {word.en} · <em>{word.pron}</em></span>
            {#if ($progress.pronunciationStars[word.hu] || 0) >= 0.7}
              <span title="Pronounced well">⭐</span>
            {/if}
          </div>
          <PronunciationCheck text={word.hu} />
        </div>
      {/each}
    </div>
  {:else}
    <div class="card">
      {#key id}
        <Quiz words={lesson.words} onFinish={onQuizFinish} />
      {/key}
    </div>
    {#if ($progress.quizScores[id] || 0) >= 70}
      <div class="card next">
        🎉 Nice score! Now make it stick with mixed exercises.
        <span class="next-actions">
          <a class="btn primary" href={'#/practice/lesson:' + id}>✏️ Practise this lesson</a>
          {#if nextStep}
            <a class="btn green" href={nextStep.href}>{nextStep.icon} Course: {nextStep.title} →</a>
          {/if}
        </span>
      </div>
    {/if}
  {/if}
{/if}

<style>
  .back {
    text-decoration: none;
  }
  .tabs {
    display: flex;
    gap: 0.5rem;
    margin-bottom: 1rem;
    flex-wrap: wrap;
  }
  table {
    width: 100%;
    border-collapse: collapse;
  }
  th {
    text-align: left;
    font-size: 0.8rem;
    text-transform: uppercase;
    color: var(--muted);
    padding: 0.4rem 0.5rem;
    border-bottom: 2px solid var(--border);
  }
  td {
    padding: 0.5rem;
    border-bottom: 1px solid var(--border);
  }
  .pron {
    font-style: italic;
    font-size: 0.9rem;
  }
  .know {
    border: none;
    background: transparent;
    font-size: 1.1rem;
  }
  .phrase {
    padding: 0.5rem 0;
    border-bottom: 1px solid var(--border);
  }
  .phrase:last-child {
    border-bottom: none;
  }
  .practise-row {
    padding: 0.6rem 0;
    border-bottom: 1px solid var(--border);
  }
  .practise-row:last-child {
    border-bottom: none;
  }
  .next {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 1rem;
    flex-wrap: wrap;
  }
  .next-actions {
    display: flex;
    gap: 0.5rem;
    flex-wrap: wrap;
  }
  .next-actions .btn {
    text-decoration: none;
  }
  @media (max-width: 600px) {
    .pron {
      display: none;
    }
  }
</style>
