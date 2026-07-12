<script>
  import { lessons, allWords } from '../lib/data/lessons.js';
  import { grammarGuides } from '../lib/data/grammar.js';
  import { readings } from '../lib/data/readings.js';
  import { dialogues } from '../lib/data/dialogues.js';
  import { progress } from '../lib/progress.js';
  import { dayStamp, dueWords } from '../lib/srs.js';

  const features = [
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

  let dueToday = $derived(dueWords(allWords(), $progress.srs, dayStamp()).length);
  let quizzesDone = $derived(Object.keys($progress.quizScores).length);
  let avgScore = $derived(
    quizzesDone ? Math.round(Object.values($progress.quizScores).reduce((a, b) => a + b, 0) / quizzesDone) : 0
  );
</script>

<div class="hero card">
  <h1>Üdvözöllek! 👋</h1>
  <p>
    Welcome to your complete Hungarian course. Hungarian (<span class="hu">magyar</span>) is famous for its
    vowel harmony, its suffixes and its beauty — and it is far more learnable than its reputation suggests.
    Start with the lessons, check the grammar guides when curious, and use the games and the microphone to
    make it stick.
  </p>
</div>

<div class="card stats">
  <div><strong>{lessons.length}</strong><span class="muted">lessons</span></div>
  <div><strong>{allWords().length}</strong><span class="muted">words</span></div>
  <div><strong>{$progress.knownWords.length}</strong><span class="muted">words known</span></div>
  <div><strong>{dueToday}</strong><span class="muted">due for review</span></div>
  <div><strong>{quizzesDone}</strong><span class="muted">quizzes passed</span></div>
  {#if quizzesDone}
    <div><strong>{avgScore}%</strong><span class="muted">avg score</span></div>
  {/if}
</div>

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
  .stats {
    display: flex;
    flex-wrap: wrap;
    gap: 1.5rem;
    justify-content: center;
    text-align: center;
  }
  .stats div {
    display: flex;
    flex-direction: column;
  }
  .stats strong {
    font-size: 1.5rem;
    color: var(--accent);
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
