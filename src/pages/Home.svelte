<script>
  import { lessons, allWords } from '../lib/data/lessons.js';
  import { grammarGuides } from '../lib/data/grammar.js';
  import { readings } from '../lib/data/readings.js';
  import { dialogues, getDialogue } from '../lib/data/dialogues.js';
  import { getLesson } from '../lib/data/lessons.js';
  import { progress } from '../lib/progress.js';
  import { dayStamp } from '../lib/srs.js';
  import { streak, vocabMastery, lastVisitActivity, relativeDay, examReadiness, nextAction, reviewDue } from '../lib/stats.js';
  import { course } from '../lib/data/course.js';
  import { nextCourseStep, courseCompletion, eligibleReviewPool } from '../lib/course.js';

  /**
   * What the citizenship interview actually asks of a learner. Kept here (not in
   * stats.js) so the scoring stays course-agnostic and this is the only place
   * that names Hungarian content.
   */
  const EXAM_PLAN = {
    words: getLesson('interview')?.words ?? [],
    dialogueIds: ['interview-personal', 'interview-work'],
    guideIds: ['formal-register', 'dates-life-events'],
    phrases: (getLesson('interview')?.phrases ?? []).map((p) => p.hu)
  };

  const features = [
    { href: '#/course', icon: '🧭', title: 'The Course', desc: 'The guided path: every lesson, guide and practice session in the order that builds.' },
    { href: '#/lessons', icon: '📚', title: 'Lessons', desc: `${lessons.length} themed vocabulary lessons with audio, pronunciation guides and quizzes.` },
    { href: '#/review', icon: '🔁', title: 'Daily Review', desc: 'Spaced repetition keeps every word fresh — a few cards a day, scheduled just before you would forget them.' },
    { href: '#/grammar', icon: '🧩', title: 'Grammar Guides', desc: `${grammarGuides.length} clear guides: vowel harmony, cases, conjugation and more.` },
    { href: '#/verbs', icon: '⚙️', title: 'Verb Trainer', desc: 'Full conjugation tables for common verbs, plus drills for the definite vs indefinite forms.' },
    { href: '#/reading', icon: '📖', title: 'Reading', desc: `${readings.length} graded reading texts with tap-to-translate and comprehension questions.` },
    { href: '#/conversation', icon: '💬', title: 'Conversation', desc: `${dialogues.length} real-life dialogues — listen, then play your role out loud.` },
    { href: '#/pronunciation', icon: '🎤', title: 'Pronunciation Lab', desc: 'Listen to native-style audio and get instant feedback on your speech.' },
    { href: '#/games', icon: '🎲', title: 'Mini Games', desc: 'Flashcards, matching pairs, word scramble and a listening challenge.' },
    { href: '#/citizenship', icon: '🪪', title: 'Citizenship Interview Prep', desc: 'Common naturalisation interview questions, model answers and tips, plus builders for your own job, home and family sentences.' }
  ];

  const words = allWords();

  // Only cards already met count as "due" — an unseen word is new, not forgotten.
  // The pool is course-gated: words and phrases of started lessons only.
  let dueToday = $derived(reviewDue(eligibleReviewPool(lessons, $progress), $progress.srs, dayStamp()));
  let mastery = $derived(vocabMastery(words, $progress.srs));
  let days = $derived(streak($progress.daysActive, dayStamp()));
  let readiness = $derived(examReadiness($progress, EXAM_PLAN));
  let lastVisit = $derived(lastVisitActivity($progress.activity, $progress.visit));
  let lastVisitWhen = $derived(relativeDay($progress.visit.previous));
  let returning = $derived(Boolean($progress.visit.previous));
  let hasStarted = $derived(
    Object.keys($progress.srs).length > 0 ||
      Object.keys($progress.quizScores).length > 0 ||
      ($progress.stepsSkipped?.length ?? 0) > 0
  );

  let nextStep = $derived(nextCourseStep(course, $progress));
  let completion = $derived(courseCompletion(course, $progress));
  let action = $derived(nextAction({ dueCount: dueToday, hasStarted, nextStep, readiness }));

  /** Turn a logged activity id into something a human recognises. */
  function pretty(entry) {
    if (entry.type === 'quiz') return `Quiz — ${getLesson(entry.id)?.title ?? entry.id}`;
    if (entry.type === 'dialogue') return `Dialogue — ${getDialogue(entry.id)?.title ?? entry.id}`;
    if (entry.type === 'guide') return `Grammar — ${grammarGuides.find((g) => g.id === entry.id)?.title ?? entry.id}`;
    return entry.label;
  }
</script>

<div class="hero card">
  {#if returning}
    <h1>Üdv újra! 👋 <span class="sub">Welcome back</span></h1>
    <p class="muted">
      {#if days > 1}
        You are on a <strong>{days}-day streak</strong>. Last visit was {lastVisitWhen}.
      {:else}
        Last visit was {lastVisitWhen}. Do something small today and the streak starts again.
      {/if}
    </p>
    {#if lastVisit.length}
      <div class="lastvisit">
        <h3>Last time you…</h3>
        <ul>
          {#each lastVisit.slice(0, 4) as entry}
            <li>{pretty(entry)}</li>
          {/each}
        </ul>
      </div>
    {/if}
  {:else}
    <h1>Üdvözöllek! 👋</h1>
    <p>
      Welcome to your complete Hungarian course. Hungarian (<span class="hu">magyar</span>) is famous for its
      vowel harmony, its suffixes and its beauty — and it is far more learnable than its reputation suggests.
      Start with a lesson below; the app will remember where you got to and schedule your reviews.
    </p>
  {/if}
</div>

<a class="card action" href={action.href}>
  <div class="icon">▶️</div>
  <div>
    <h2>{action.label}</h2>
    <p class="muted">{action.why}</p>
  </div>
</a>

{#if completion.doneSteps > 0}
  <a class="card course-strip" href="#/course">
    <span>🧭 <strong>Course:</strong> {completion.doneSteps} / {completion.totalSteps} steps · {completion.unitsDone} of {completion.totalUnits} units</span>
    <span class="bar thin course-bar"><span class="fill mastered" style={`width:${completion.percent}%`}></span></span>
    <strong>{completion.percent}%</strong>
  </a>
{/if}

<div class="grid two">
  <div class="card">
    <h3>📈 Vocabulary</h3>
    <div class="bar" role="img" aria-label={`${mastery.percent}% of words mastered`}>
      <span class="fill mastered" style={`width:${mastery.percent}%`}></span>
      <span class="fill learning" style={`width:${(mastery.total ? (mastery.learning / mastery.total) * 100 : 0)}%`}></span>
    </div>
    <p class="big">{mastery.percent}%<span class="muted"> of {mastery.total} words mastered</span></p>
    <p class="muted small">
      <strong>{mastery.mastered}</strong> mastered · <strong>{mastery.learning}</strong> still learning ·
      <strong>{mastery.unseen}</strong> not started · <strong>{dueToday}</strong> due today
    </p>
    <p class="muted small">A word counts as mastered once it survives four spaced reviews.</p>
  </div>

  <div class="card">
    <h3>🪪 Exam readiness <span class="muted small">— {readiness.overall}%</span></h3>
    {#each readiness.components as c}
      <div class="row">
        <div class="rowhead">
          <span>{c.label}</span>
          <strong>{c.percent}%</strong>
        </div>
        <div class="bar thin"><span class="fill mastered" style={`width:${c.percent}%`}></span></div>
        <p class="muted small">{c.detail}</p>
      </div>
    {/each}
    <p class="muted small caveat">
      This counts what you have <em>practised</em> — it cannot predict what an examiner will ask. Treat it as a
      checklist, not a forecast.
    </p>
  </div>
</div>

<h2 class="section">Everything else</h2>
<div class="grid two">
  {#each features as f}
    <a class="card feature" href={f.href}>
      <div class="icon">{f.icon}</div>
      <h3>{f.title}</h3>
      <p class="muted">{f.desc}</p>
    </a>
  {/each}
</div>

<div class="card">
  <h3>💡 Tip of the day</h3>
  <p>
    Stress is <strong>always on the first syllable</strong> in Hungarian — even in long words like
    <span class="hu">Viszontlátásra</span> (VEE-sont-lah-tahsh-raw). Get this one habit right and you will
    instantly sound more natural.
  </p>
</div>

<style>
  .hero h1 {
    margin-top: 0;
  }
  .hero h1 .sub {
    font-size: 1rem;
    font-weight: 500;
    color: var(--muted);
  }
  .lastvisit h3 {
    margin: 0.8rem 0 0.3rem;
    font-size: 0.95rem;
  }
  .lastvisit ul {
    margin: 0;
    padding-left: 1.1rem;
    color: var(--muted);
  }
  .action {
    display: flex;
    align-items: center;
    gap: 1rem;
    text-decoration: none;
    color: var(--ink);
    border-left: 5px solid var(--accent);
  }
  .action h2 {
    margin: 0 0 0.2rem;
  }
  .action p {
    margin: 0;
  }
  .action .icon {
    font-size: 1.8rem;
  }
  .action:hover {
    background: var(--accent-soft);
  }
  .course-strip {
    display: flex;
    align-items: center;
    gap: 0.8rem;
    flex-wrap: wrap;
    text-decoration: none;
    color: var(--ink);
    padding: 0.7rem 1.2rem;
  }
  .course-strip:hover {
    background: var(--accent-soft);
  }
  .course-bar {
    flex: 1;
    min-width: 8rem;
  }
  .bar {
    display: flex;
    height: 12px;
    border-radius: 99px;
    overflow: hidden;
    background: var(--border);
  }
  .bar.thin {
    height: 8px;
  }
  .fill.mastered {
    background: var(--accent);
  }
  .fill.learning {
    background: var(--accent-soft);
  }
  .big {
    font-size: 1.6rem;
    font-weight: 700;
    margin: 0.6rem 0 0.2rem;
  }
  .big .muted {
    font-size: 0.9rem;
    font-weight: 400;
  }
  .small {
    font-size: 0.85rem;
  }
  .row {
    margin-bottom: 0.7rem;
  }
  .rowhead {
    display: flex;
    justify-content: space-between;
    font-size: 0.9rem;
    margin-bottom: 0.25rem;
  }
  .row p {
    margin: 0.2rem 0 0;
  }
  .caveat {
    border-top: 1px solid var(--border);
    padding-top: 0.6rem;
  }
  .section {
    margin: 1.5rem 0 0.75rem;
  }
  .feature {
    text-decoration: none;
    color: var(--ink);
    transition: transform 0.1s, box-shadow 0.1s;
  }
  .feature:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);
  }
  .feature .icon {
    font-size: 1.8rem;
  }
  .feature h3 {
    margin: 0.4rem 0 0.2rem;
  }
  .feature p {
    margin: 0;
    font-size: 0.92rem;
  }
</style>
