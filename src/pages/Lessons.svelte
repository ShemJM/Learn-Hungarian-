<script>
  import { lessons } from '../lib/data/lessons.js';
  import { progress } from '../lib/progress.js';
</script>

<h1>📚 Lessons</h1>
<p class="muted">
  Each lesson teaches a themed set of words with audio and pronunciation guides, then tests you with a quiz.
  Aim for 70% or better before moving on.
</p>

<div class="grid two">
  {#each lessons as lesson, i}
    <a class="card lesson" href={'#/lessons/' + lesson.id}>
      <div class="top">
        <span class="icon">{lesson.icon}</span>
        <div>
          <h3>{i + 1}. {lesson.title}</h3>
          <span class="muted">{lesson.words.length} words</span>
        </div>
      </div>
      {#if $progress.quizScores[lesson.id] !== undefined}
        <div class="score">
          <div class="progress-bar"><div style="width: {$progress.quizScores[lesson.id]}%"></div></div>
          <span class="pill" class:green={$progress.quizScores[lesson.id] >= 70}>
            Best: {$progress.quizScores[lesson.id]}%
          </span>
        </div>
      {:else}
        <span class="pill" style="background: var(--border); color: var(--muted)">Not started</span>
      {/if}
    </a>
  {/each}
</div>

<style>
  .lesson {
    text-decoration: none;
    color: var(--ink);
    transition: transform 0.1s;
  }
  .lesson:hover {
    transform: translateY(-2px);
  }
  .top {
    display: flex;
    gap: 0.75rem;
    align-items: center;
    margin-bottom: 0.6rem;
  }
  .icon {
    font-size: 1.7rem;
  }
  h3 {
    margin: 0;
  }
  .score {
    display: flex;
    align-items: center;
    gap: 0.6rem;
  }
  .score .progress-bar {
    flex: 1;
  }
</style>
