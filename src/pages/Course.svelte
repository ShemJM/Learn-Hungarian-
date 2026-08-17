<script>
  import { course } from '../lib/data/course.js';
  import { courseState, courseCompletion, stepMeta } from '../lib/course.js';
  import { progress } from '../lib/progress.js';

  const typeLabel = {
    lesson: 'Lesson',
    guide: 'Grammar',
    practice: 'Practice',
    reading: 'Reading',
    dialogue: 'Dialogue',
    verbs: 'Verb drill',
    checkpoint: 'Checkpoint'
  };

  let state = $derived(courseState(course, $progress));
  let completion = $derived(courseCompletion(course, $progress));

  function allSkipped(unit) {
    return unit.steps.every((s) => $progress.stepsSkipped?.includes(s.id));
  }

  function skipUnit(unit) {
    progress.skipSteps(unit.steps.map((s) => s.id), unit.title);
  }

  function unskipUnit(unit) {
    progress.unskipSteps(unit.steps.map((s) => s.id));
  }
</script>

<h1>🧭 The Course</h1>
<p class="muted">
  A guided path through everything here: vocabulary, grammar, practice, dialogues and readings, in
  an order that builds. Follow the highlighted step — or jump ahead if you already know something;
  nothing is locked.
</p>

<div class="card overall">
  <div class="rowhead">
    <strong>{completion.doneSteps} / {completion.totalSteps} steps</strong>
    <span class="muted">{completion.unitsDone} of {completion.totalUnits} units complete</span>
  </div>
  <div class="progress-bar"><div style="width: {completion.percent}%"></div></div>
</div>

{#each state as { unit, steps, doneCount, done, current }}
  <div class="card unit" class:done class:current>
    <div class="unit-head">
      <h2>{unit.icon} {unit.title}</h2>
      <span class="head-right">
        {#if allSkipped(unit)}
          <button class="btn skip" onclick={() => unskipUnit(unit)}>Unmark</button>
        {:else if !done}
          <button class="btn skip" onclick={() => skipUnit(unit)}>I know this — mark as done</button>
        {/if}
        <span class="pill" class:green={done}>{doneCount} / {steps.length}</span>
      </span>
    </div>
    <p class="muted blurb">{unit.blurb}</p>
    <ol class="rail">
      {#each steps as { step, done: stepIsDone, isNext }}
        {@const meta = stepMeta(step)}
        <li>
          <a
            href={meta.href}
            class="step"
            class:done={stepIsDone}
            class:next={isNext}
            class:todo={!stepIsDone && !isNext}
            aria-current={isNext ? 'step' : undefined}
          >
            <span class="dot">{stepIsDone ? '✓' : meta.icon}</span>
            <span class="label">
              <span class="kind">{typeLabel[step.type]}</span>
              {meta.title}
            </span>
            {#if isNext}<span class="pill here">You are here</span>{/if}
          </a>
        </li>
      {/each}
    </ol>
  </div>
{/each}

{#if completion.percent === 100}
  <div class="card center">
    <h2>🎓 Gratulálunk! You finished the course!</h2>
    <p class="muted">
      Keep the streak alive with <a href="#/review">daily reviews</a>, <a href="#/games">games</a>
      and the <a href="#/citizenship">interview prep</a>.
    </p>
  </div>
{/if}

<style>
  .overall .rowhead {
    display: flex;
    justify-content: space-between;
    margin-bottom: 0.5rem;
  }
  .unit.current {
    border-left: 5px solid var(--accent);
  }
  .unit.done {
    border-left: 5px solid var(--good);
  }
  .unit-head {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 0.5rem;
  }
  .unit-head h2 {
    margin: 0;
  }
  .head-right {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    flex-wrap: wrap;
  }
  .btn.skip {
    font-size: 0.8rem;
    padding: 0.25rem 0.6rem;
    color: var(--muted);
  }
  .blurb {
    margin: 0.3rem 0 0.8rem;
  }
  .rail {
    list-style: none;
    margin: 0;
    padding: 0;
  }
  .rail li + li {
    border-top: 1px dashed var(--border);
  }
  .step {
    display: flex;
    align-items: center;
    gap: 0.7rem;
    padding: 0.45rem 0.25rem;
    text-decoration: none;
    color: var(--ink);
    border-radius: 8px;
  }
  .step:hover {
    background: var(--accent-soft);
  }
  .dot {
    flex: none;
    width: 2rem;
    height: 2rem;
    display: grid;
    place-items: center;
    border-radius: 50%;
    background: var(--bg);
    border: 2px solid var(--border);
  }
  .step.done .dot {
    background: var(--good-soft);
    border-color: var(--good);
    color: var(--good);
    font-weight: 800;
  }
  .step.next .dot {
    border-color: var(--accent);
    animation: pulse 1.6s ease-in-out infinite;
  }
  .step.todo {
    opacity: 0.65;
  }
  .kind {
    display: block;
    font-size: 0.72rem;
    text-transform: uppercase;
    letter-spacing: 0.04em;
    color: var(--muted);
  }
  .pill.here {
    margin-left: auto;
    background: var(--accent);
    color: var(--white);
  }
  .center {
    text-align: center;
  }
  @keyframes pulse {
    0%,
    100% {
      box-shadow: 0 0 0 0 var(--accent-soft);
    }
    50% {
      box-shadow: 0 0 0 6px var(--accent-soft);
    }
  }
  @media (prefers-reduced-motion: reduce) {
    .step.next .dot {
      animation: none;
    }
  }
</style>
