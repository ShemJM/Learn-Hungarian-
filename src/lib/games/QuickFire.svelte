<script>
  import { onDestroy } from 'svelte';
  import { allWords } from '../data/lessons.js';
  import { buildQuiz, scoreQuiz, grade } from '../quiz.js';
  import { progress } from '../progress.js';

  // A fast, full-screen tap game. Each slide shows one word (English or Hungarian);
  // tap the translation before the timer runs out. Built for a spare few minutes.
  const COUNT = 15;
  const SPEEDS = [
    { id: 'relaxed', label: '🐢 Relaxed', ms: 5000 },
    { id: 'normal', label: '⚡ Normal', ms: 3500 },
    { id: 'fast', label: '🔥 Fast', ms: 2200 }
  ];

  let phase = $state('ready'); // ready | playing | done
  let speedId = $state('normal');
  let questions = $state([]);
  let index = $state(0);
  let results = $state([]);
  let selected = $state(null);
  let locked = $state(false);
  let timedOut = $state(false);
  let timeLeft = $state(0);
  let streak = $state(0);
  let bestStreak = $state(0);

  let perCardMs = $derived(SPEEDS.find((s) => s.id === speedId)?.ms ?? 3500);
  let current = $derived(questions[index]);
  let score = $derived(scoreQuiz(results));
  let barPct = $derived(perCardMs ? Math.max(0, (timeLeft / perCardMs) * 100) : 0);

  let tick = null;
  let advanceTimer = null;

  function clearTimers() {
    if (tick) { clearInterval(tick); tick = null; }
    if (advanceTimer) { clearTimeout(advanceTimer); advanceTimer = null; }
  }

  function start() {
    questions = buildQuiz(allWords(), { count: COUNT, choiceCount: 3, direction: 'mixed' });
    index = 0;
    results = [];
    streak = 0;
    bestStreak = 0;
    phase = 'playing';
    startCard();
  }

  function startCard() {
    clearTimers();
    selected = null;
    locked = false;
    timedOut = false;
    timeLeft = perCardMs;
    tick = setInterval(() => {
      timeLeft -= 100;
      if (timeLeft <= 0) {
        timeLeft = 0;
        onTimeout();
      }
    }, 100);
  }

  function settle(correct) {
    clearTimers();
    locked = true;
    results = [...results, { correct }];
    if (correct) {
      streak += 1;
      if (streak > bestStreak) bestStreak = streak;
    } else {
      streak = 0;
    }
    advanceTimer = setTimeout(advance, 650);
  }

  function choose(choice) {
    if (locked) return;
    selected = choice;
    settle(choice === current.answer);
  }

  function onTimeout() {
    if (locked) return;
    timedOut = true;
    settle(false);
  }

  function advance() {
    if (index + 1 >= questions.length) {
      finish();
    } else {
      index += 1;
      startCard();
    }
  }

  function finish() {
    clearTimers();
    phase = 'done';
    progress.recordGame('quickfire', scoreQuiz(results).percent);
  }

  function quit() {
    clearTimers();
    phase = 'ready';
  }

  onDestroy(clearTimers);
</script>

{#if phase === 'ready'}
  <h1>⚡ Quick Fire</h1>
  <p class="muted">
    {COUNT} lightning rounds. A word flashes up — tap its translation before the bar runs out.
    Perfect for a spare few minutes at the bus stop. One thumb, no typing.
  </p>
  <div class="card center">
    <p class="muted small">Choose a speed:</p>
    <div class="speeds">
      {#each SPEEDS as s}
        <button class="btn" class:primary={speedId === s.id} onclick={() => (speedId = s.id)}>{s.label}</button>
      {/each}
    </div>
    <button class="btn primary big-start" onclick={start}>▶️ Start</button>
    {#if $progress.gameBest['quickfire']}
      <p class="muted small">🏆 Best: {$progress.gameBest['quickfire']}%</p>
    {/if}
  </div>
{:else if phase === 'playing' && current}
  <div class="stage">
    <div class="topbar">
      <button class="quit" onclick={quit} aria-label="Quit game">✕</button>
      <div class="count">{index + 1} / {questions.length}</div>
      <div class="streak" class:hot={streak >= 3}>🔥 {streak}</div>
    </div>

    <div class="timer">
      <div class="timer-fill" class:low={barPct < 34} style={`width:${barPct}%`}></div>
    </div>

    <div class="slide">
      <div class="ask muted">{current.promptLang === 'hu' ? 'Tap the English 🇬🇧' : 'Tap the Hungarian 🇭🇺'}</div>
      <div class="prompt" class:hu={current.promptLang === 'hu'}>{current.prompt}</div>
    </div>

    <div class="choices">
      {#each current.choices as choice}
        <button
          class="choice"
          class:hu={current.promptLang === 'en'}
          class:correct={locked && choice === current.answer}
          class:wrong={locked && selected === choice && choice !== current.answer}
          disabled={locked}
          onclick={() => choose(choice)}
        >
          {choice}
        </button>
      {/each}
    </div>

    {#if locked && timedOut}
      <div class="flash">⏱️ Time!</div>
    {/if}
  </div>
{:else if phase === 'done'}
  {@const g = grade(score.percent)}
  <div class="card center">
    <div class="big-emoji">{g.emoji}</div>
    <h2>{g.label}</h2>
    <p>You got <strong>{score.correct} / {score.total}</strong> ({score.percent}%)</p>
    <p class="muted">Best streak this round: 🔥 {bestStreak}</p>
    {#if $progress.gameBest['quickfire']}
      <p class="muted small">🏆 Best ever: {$progress.gameBest['quickfire']}%</p>
    {/if}
    <div class="done-actions">
      <button class="btn primary" onclick={start}>🔁 Go again</button>
      <button class="btn" onclick={() => (phase = 'ready')}>⚙️ Change speed</button>
    </div>
  </div>
{/if}

<style>
  .center {
    text-align: center;
  }
  .small {
    font-size: 0.85rem;
  }
  .speeds {
    display: flex;
    gap: 0.5rem;
    justify-content: center;
    flex-wrap: wrap;
    margin-bottom: 1rem;
  }
  .big-start {
    font-size: 1.3rem;
    padding: 0.9rem 2.4rem;
  }
  .big-emoji {
    font-size: 3rem;
  }
  .done-actions {
    display: flex;
    gap: 0.6rem;
    justify-content: center;
    flex-wrap: wrap;
    margin-top: 1rem;
  }

  /* Full-screen play stage */
  .stage {
    position: fixed;
    inset: 0;
    z-index: 50;
    background: var(--bg);
    display: flex;
    flex-direction: column;
    padding: 1rem;
    gap: 0.75rem;
  }
  .topbar {
    display: flex;
    align-items: center;
    justify-content: space-between;
    font-weight: 700;
  }
  .quit {
    border: none;
    background: transparent;
    font-size: 1.4rem;
    line-height: 1;
    color: var(--muted);
    padding: 0.2rem 0.5rem;
    border-radius: 8px;
  }
  .quit:hover {
    background: var(--accent-soft);
  }
  .count {
    color: var(--muted);
  }
  .streak {
    color: var(--muted);
    transition: transform 0.1s;
  }
  .streak.hot {
    color: var(--accent);
    transform: scale(1.15);
  }
  .timer {
    height: 8px;
    background: var(--border);
    border-radius: 999px;
    overflow: hidden;
  }
  .timer-fill {
    height: 100%;
    background: var(--green);
    border-radius: 999px;
    transition: width 0.1s linear, background 0.2s;
  }
  .timer-fill.low {
    background: var(--red);
  }
  .slide {
    flex: 1;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    text-align: center;
    gap: 0.75rem;
  }
  .ask {
    font-size: 0.95rem;
    text-transform: uppercase;
    letter-spacing: 0.06em;
  }
  .prompt {
    font-size: clamp(2rem, 9vw, 3.5rem);
    font-weight: 800;
  }
  .choices {
    display: flex;
    flex-direction: column;
    gap: 0.6rem;
  }
  .choice {
    border: 2px solid var(--border);
    background: var(--white);
    color: var(--ink);
    border-radius: 14px;
    padding: 1.1rem 1rem;
    font-size: 1.35rem;
    font-weight: 700;
    transition: transform 0.05s, background 0.15s;
  }
  .choice:active:not(:disabled) {
    transform: scale(0.98);
  }
  .choice:disabled {
    cursor: default;
  }
  .choice.hu {
    color: var(--accent);
  }
  .flash {
    text-align: center;
    font-weight: 700;
    color: var(--accent);
    font-size: 1.1rem;
  }

  @media (min-width: 620px) {
    .choices {
      max-width: 460px;
      width: 100%;
      margin: 0 auto;
    }
  }
</style>
