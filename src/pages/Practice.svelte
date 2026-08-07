<script>
  import { getExerciseSet } from '../lib/exercises.js';
  import ExerciseRunner from '../lib/components/ExerciseRunner.svelte';
  import { progress } from '../lib/progress.js';

  /** Mixed exercise session for one set id, e.g. 'lesson:greetings' or 'grammar:cases'. */
  let { setId } = $props();

  let attempt = $state(0);
  let set = $derived(getExerciseSet(setId));
  let items = $derived.by(() => {
    attempt; // a restart bumps this to deal a fresh session
    return set ? set.build() : [];
  });

  function finish(percent) {
    progress.recordExercises(setId, percent);
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
      <ExerciseRunner {items} onFinish={finish} onRestart={() => (attempt += 1)} />
    {/key}
  </div>
{/if}
