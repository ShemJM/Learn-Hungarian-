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

  const nav = [
    { path: 'home', label: 'Home', icon: '🏠' },
    { path: 'lessons', label: 'Lessons', icon: '📚' },
    { path: 'grammar', label: 'Grammar', icon: '🧩' },
    { path: 'reading', label: 'Reading', icon: '📖' },
    { path: 'conversation', label: 'Conversation', icon: '💬' },
    { path: 'pronunciation', label: 'Pronunciation', icon: '🎤' },
    { path: 'games', label: 'Games', icon: '🎲' }
  ];
</script>

<header>
  <a class="brand" href="#/home">
    <span class="flag"><i class="r"></i><i class="w"></i><i class="g"></i></span>
    <span>Learn Hungarian <span class="sub">· Tanulj magyarul!</span></span>
  </a>
  <nav>
    {#each nav as item}
      <a href={'#/' + item.path} class:active={$route.page === item.path || ($route.page === 'home' && item.path === 'home')}>
        <span class="icon">{item.icon}</span>{item.label}
      </a>
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
  {:else if $route.page === 'games'}
    <Games game={$route.param} />
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
