<script>
  import { route } from './lib/router.js';
  import Home from './pages/Home.svelte';
  import Lessons from './pages/Lessons.svelte';
  import Lesson from './pages/Lesson.svelte';
  import Grammar from './pages/Grammar.svelte';
  import Reading from './pages/Reading.svelte';
  import Conversation from './pages/Conversation.svelte';
  import Games from './pages/Games.svelte';
  import Pronunciation from './pages/Pronunciation.svelte';
  import RolledR from './pages/RolledR.svelte';
  import Citizenship from './pages/Citizenship.svelte';
  import Review from './pages/Review.svelte';
  import Verbs from './pages/Verbs.svelte';

  import { progress } from './lib/progress.js';

  // Eleven flat links forced a decision on every visit. Four groups + Home keeps
  // the top level small; the dashboard tells the learner what to do next.
  const groups = [
    {
      label: 'Learn',
      items: [
        { path: 'lessons', label: 'Lessons', icon: '📚' },
        { path: 'grammar', label: 'Grammar', icon: '🧩' },
        { path: 'verbs', label: 'Verbs', icon: '⚙️' }
      ]
    },
    {
      label: 'Practice',
      items: [
        { path: 'review', label: 'Daily Review', icon: '🔁' },
        { path: 'games', label: 'Games', icon: '🎲' },
        { path: 'pronunciation', label: 'Pronunciation', icon: '🎤' },
        { path: 'rolled-r', label: "Roll your R's", icon: '👅' }
      ]
    },
    {
      label: 'Immerse',
      items: [
        { path: 'reading', label: 'Reading', icon: '📖' },
        { path: 'conversation', label: 'Conversation', icon: '💬' }
      ]
    },
    {
      label: 'Exam',
      items: [{ path: 'citizenship', label: 'Citizenship', icon: '🪪' }]
    }
  ];

  let openGroup = $state(null);

  progress.startVisit();

  // Any navigation closes the menu.
  $effect(() => {
    $route.page;
    openGroup = null;
  });

  function groupIsActive(group) {
    return group.items.some((i) => i.path === $route.page);
  }
</script>

<svelte:window onkeydown={(e) => e.key === 'Escape' && (openGroup = null)} />

<header>
  <a class="brand" href="#/home">
    <span class="flag"><i class="r"></i><i class="w"></i><i class="g"></i></span>
    <span>Learn Hungarian <span class="sub">· Tanulj magyarul!</span></span>
  </a>
  <nav>
    <a href="#/home" class:active={$route.page === 'home'}><span class="icon">🏠</span>Home</a>
    {#each groups as group}
      <div class="group">
        <button
          class:active={groupIsActive(group)}
          aria-expanded={openGroup === group.label}
          onclick={() => (openGroup = openGroup === group.label ? null : group.label)}
        >
          {group.label} <span class="caret">▾</span>
        </button>
        <div class="menu" class:open={openGroup === group.label}>
          {#each group.items as item}
            <a href={'#/' + item.path} class:active={$route.page === item.path}>
              <span class="icon">{item.icon}</span>{item.label}
            </a>
          {/each}
        </div>
      </div>
    {/each}
  </nav>
</header>

<main class="container">
  {#if $route.page === 'home'}
    <Home />
  {:else if $route.page === 'lessons'}
    {#if $route.param}
      <Lesson id={$route.param} />
    {:else}
      <Lessons />
    {/if}
  {:else if $route.page === 'grammar'}
    <Grammar id={$route.param} />
  {:else if $route.page === 'reading'}
    <Reading id={$route.param} />
  {:else if $route.page === 'conversation'}
    <Conversation id={$route.param} />
  {:else if $route.page === 'pronunciation'}
    <Pronunciation />
  {:else if $route.page === 'rolled-r'}
    <RolledR />
  {:else if $route.page === 'games'}
    <Games game={$route.param} />
  {:else if $route.page === 'review'}
    <Review />
  {:else if $route.page === 'verbs'}
    <Verbs />
  {:else if $route.page === 'citizenship'}
    <Citizenship />
  {:else}
    <Home />
  {/if}
</main>

<footer class="muted">
  Sok sikert a tanuláshoz! (Good luck with your studies!) 🇭🇺
</footer>

<style>
  header {
    background: var(--white);
    border-bottom: 3px solid var(--red);
    padding: 0.75rem 1.25rem;
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    justify-content: space-between;
    gap: 0.5rem;
    position: sticky;
    top: 0;
    z-index: 10;
    box-shadow: var(--shadow);
  }
  .brand {
    display: flex;
    align-items: center;
    gap: 0.6rem;
    font-weight: 800;
    font-size: 1.15rem;
    color: var(--ink);
    text-decoration: none;
  }
  .brand .sub {
    font-weight: 500;
    color: var(--muted);
    font-size: 0.85rem;
  }
  .flag {
    display: inline-flex;
    flex-direction: column;
    width: 26px;
    height: 18px;
    border-radius: 3px;
    overflow: hidden;
    border: 1px solid var(--border);
  }
  .flag i {
    flex: 1;
  }
  .flag .r { background: var(--red); }
  .flag .w { background: var(--white); }
  .flag .g { background: var(--green); }
  nav {
    display: flex;
    flex-wrap: wrap;
    gap: 0.25rem;
  }
  nav a {
    text-decoration: none;
    color: var(--ink);
    font-weight: 600;
    font-size: 0.9rem;
    padding: 0.35rem 0.7rem;
    border-radius: 8px;
  }
  nav a:hover {
    background: var(--accent-soft);
  }
  nav a.active {
    background: var(--accent);
    color: var(--white);
  }
  .group {
    position: relative;
  }
  .group > button {
    font: inherit;
    font-weight: 600;
    font-size: 0.9rem;
    color: var(--ink);
    background: none;
    border: none;
    cursor: pointer;
    padding: 0.35rem 0.7rem;
    border-radius: 8px;
  }
  .group > button:hover {
    background: var(--accent-soft);
  }
  .group > button.active {
    background: var(--accent);
    color: var(--white);
  }
  .caret {
    font-size: 0.7rem;
  }
  .menu {
    display: none;
    flex-direction: column;
    position: absolute;
    top: 100%;
    left: 0;
    z-index: 20;
    min-width: 12rem;
    margin-top: 0.25rem;
    padding: 0.3rem;
    background: var(--white);
    border: 1px solid var(--border);
    border-radius: 10px;
    box-shadow: var(--shadow);
  }
  /* Invisible bridge across the gap, so the menu does not close mid-reach. */
  .menu::before {
    content: '';
    position: absolute;
    top: -0.35rem;
    left: 0;
    right: 0;
    height: 0.35rem;
  }
  .menu.open {
    display: flex;
  }
  /* Hover only where hovering is real — a tap on a phone should not fire this. */
  @media (hover: hover) and (pointer: fine) {
    .group:hover .menu,
    .group:focus-within .menu {
      display: flex;
    }
  }
  .menu a {
    padding: 0.45rem 0.6rem;
    white-space: nowrap;
  }
  .icon {
    margin-right: 0.25rem;
  }
  footer {
    text-align: center;
    padding: 1.5rem;
    font-size: 0.9rem;
  }
  @media (max-width: 700px) {
    nav a {
      font-size: 0.8rem;
      padding: 0.3rem 0.5rem;
    }
  }
</style>
