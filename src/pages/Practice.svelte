<script>
  import { get } from 'svelte/store';
  import { getExerciseSet } from '../lib/exercises.js';
  import { course } from '../lib/data/course.js';
  import { lessons } from '../lib/data/lessons.js';
  import { nextCourseStep, eligibleReviewPool } from '../lib/course.js';
  import ExerciseRunner from '../lib/components/ExerciseRunner.svelte';
  import { progress } from '../lib/progress.js';

  /** Mixed exercise session for one set id, e.g. 'lesson:greetings' or 'grammar:cases'. */
  let { setId } = $props();

  let attempt = $state(0);
  let finished = $state(false);
  let set = $derived(getExerciseSet(setId));

  /**
   * Non-reactive progress snapshot: recordReview during the session must not
   * reshuffle the deck, so the builder reads get(progress), never $progress.
   */
  function sessionCtx() {
    const p = get(progress);
    return { srsState: p.srs, pool: eligibleReviewPool(lessons, p) };
  }

  let items = $derived.by(() => {
    attempt; // a restart bumps this to deal a fresh session
    const built = getExerciseSet(setId, sessionCtx());
    return built ? built.build() : [];
  });
  let nextStep = $derived(nextCourseStep(course, $progress));

  // Navigating to a different set resets the session.
  $effect(() => {
    setId;
    finished = false;
  });

  function finish(percent) {
    progress.recordExercises(setId, percent);
    finished = true;
  }

  function restart() {
    attempt += 1;
    finished = false;
  }
</script>

{#if !set}
  <h1>✏️ Practice</h1>
  <p class="muted">That practice set does not exist. <a href="#/course">Back to the course</a></p>
{:else}
  <h1>{set.icon ?? '✏️'} {set.title}</h1>
  <p class="muted">
    A mix of exercises — multiple choice, typing, gap-fill, word order and listening. Type answers
    in Hungarian; the accent buttons help if your keyboard cannot.
  </p>
  <div class="card">
    {#key attempt}
      <ExerciseRunner {items} onFinish={finish} onRestart={restart} />
    {/key}
  </div>
  {#if finished && nextStep}
    <div class="card onward">
      🧭 Next on the course: <strong>{nextStep.unit.title}</strong>
      <a class="btn green" href={nextStep.href}>{nextStep.icon} {nextStep.title} →</a>
    </div>
  {/if}
{/if}

<style>
  .onward {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 1rem;
    flex-wrap: wrap;
  }
  .onward .btn {
    text-decoration: none;
  }
</style>
