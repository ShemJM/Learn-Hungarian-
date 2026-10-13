<script>
  import { onDestroy } from 'svelte';
  import { get } from 'svelte/store';
  import { progress } from '../lib/progress.js';
  import { speak } from '../lib/speech.js';
  import { navigate } from '../lib/router.js';
  import { buildReel, nextBatch } from '../lib/reels.js';
  import ReelCard from '../lib/components/ReelCard.svelte';

  // A TikTok-style feed: one micro-lesson per screen, swipe up for the next,
  // forever. Scroll-snap does the swiping; an IntersectionObserver works out
  // which reel is on screen so its audio can autoplay.

  /** Load another batch when the learner gets this close to the end. */
  const PREFETCH = 5;
  const DOUBLE_TAP_MS = 300;

  let tab = $state('foryou'); // foryou | saved
  let feed = $state([]);
  let active = $state(-1);
  let soundOn = $state(true);
  let hearts = $state([]); // { id, x, y } double-tap bursts

  let feedEl = $state(null);
  let uid = 0;
  const seen = new Set();
  const watched = new Set();
  let answered = $state(0);
  let correct = $state(0);
  let lastTap = { t: 0, index: -1 };

  let liked = $derived(new Set($progress.reelsLiked || []));
  let watchedCount = $state(0);

  function toItems(keys) {
    return keys
      .map((key) => buildReel(key))
      .filter(Boolean)
      .map((reel) => ({ ...reel, uid: ++uid }));
  }

  function loadMore() {
    const keys = nextBatch({ progress: get(progress), seen });
    keys.forEach((k) => seen.add(k));
    feed = [...feed, ...toItems(keys)];
  }

  function switchTab(next) {
    if (tab === next && feed.length) return;
    tab = next;
    active = -1; // so the first reel of the new feed counts as freshly shown
    // Snapshot the saved list so un-hearting a reel doesn't yank it off screen.
    feed = next === 'saved' ? toItems(get(progress).reelsLiked || []) : [];
    if (next === 'foryou') loadMore();
    feedEl?.scrollTo?.({ top: 0 });
    if (!observer) setActive(0);
  }

  /** The Hungarian worth hearing when a reel comes on screen (null = stay quiet). */
  function audioFor(reel) {
    switch (reel?.type) {
      case 'word':
      case 'quiz':
      case 'listen':
        return reel.word.hu;
      case 'phrase':
        return reel.phrase.hu;
      case 'verb':
        return reel.verb.inf;
      case 'reading':
        return reel.sentence.hu;
      case 'dialogue':
        return reel.lines[0].hu;
      case 'tip':
        return reel.examples[0]?.hu ?? null;
      default:
        return null; // drills: let the learner try first
    }
  }

  function playActive() {
    const text = audioFor(feed[active]);
    if (soundOn && text) speak(text);
  }

  function setActive(i) {
    if (i === active) return;
    active = i;
    const reel = feed[i];
    if (reel && !watched.has(reel.uid)) {
      watched.add(reel.uid);
      watchedCount = watched.size;
    }
    playActive();
    if (tab === 'foryou' && i >= feed.length - PREFETCH) loadMore();
  }

  const observer =
    typeof IntersectionObserver !== 'undefined'
      ? new IntersectionObserver(
          (entries) => {
            for (const e of entries) {
              if (e.isIntersecting) setActive(Number(e.target.dataset.index));
            }
          },
          { threshold: 0.6 }
        )
      : null;

  function observe(node) {
    observer?.observe(node);
    return { destroy: () => observer?.unobserve(node) };
  }

  function scrollToReel(i) {
    if (!feedEl || i < 0 || i >= feed.length) return;
    feedEl.scrollTo({ top: i * feedEl.clientHeight, behavior: 'smooth' });
    if (!observer) setActive(i);
  }

  function toggleLike(reel) {
    progress.toggleReelLike(reel.key);
  }

  function burst(x, y) {
    const id = ++uid;
    hearts = [...hearts, { id, x, y }];
    setTimeout(() => (hearts = hearts.filter((h) => h.id !== id)), 800);
  }

  /** Double-tap anywhere on a reel to heart it — the TikTok gesture. */
  function onReelTap(e, i, reel) {
    const now = Date.now();
    if (now - lastTap.t < DOUBLE_TAP_MS && lastTap.index === i) {
      if (!liked.has(reel.key)) toggleLike(reel);
      burst(e.clientX, e.clientY);
      lastTap = { t: 0, index: -1 };
    } else {
      lastTap = { t: now, index: i };
    }
  }

  function onAnswer(reel, isCorrect) {
    answered += 1;
    if (isCorrect) correct += 1;
    // Quick checks are real practice: feed them into spaced repetition.
    progress.recordReview(reel.word.hu, isCorrect);
  }

  function onKey(e) {
    if (e.target?.closest?.('input, textarea')) return;
    if (e.key === 'ArrowDown' || e.key === 'j') {
      e.preventDefault();
      scrollToReel(active + 1);
    } else if (e.key === 'ArrowUp' || e.key === 'k') {
      e.preventDefault();
      scrollToReel(active - 1);
    } else if (e.key === 'l' && feed[active]) {
      toggleLike(feed[active]);
    } else if (e.key === 'Escape') {
      navigate('home');
    }
  }

  function toggleSound() {
    soundOn = !soundOn;
    if (soundOn) playActive();
    else window.speechSynthesis?.cancel();
  }

  switchTab('foryou');

  onDestroy(() => {
    observer?.disconnect();
    if (watched.size > 1) progress.logReelSession(watched.size, correct, answered);
  });
</script>

<svelte:window onkeydown={onKey} />

<div class="reels">
  <div class="top">
    <button class="icon-btn" onclick={() => navigate('home')} aria-label="Close reels">✕</button>
    <div class="tabs" role="tablist">
      <button role="tab" aria-selected={tab === 'foryou'} class:on={tab === 'foryou'} onclick={() => switchTab('foryou')}>
        For you
      </button>
      <button role="tab" aria-selected={tab === 'saved'} class:on={tab === 'saved'} onclick={() => switchTab('saved')}>
        Saved{liked.size ? ` (${liked.size})` : ''}
      </button>
    </div>
    <button class="icon-btn" onclick={toggleSound} aria-label={soundOn ? 'Mute autoplay' : 'Unmute autoplay'}>
      {soundOn ? '🔊' : '🔇'}
    </button>
  </div>

  <div class="stats">
    🔥 {watchedCount} watched{#if answered} · ✅ {correct}/{answered}{/if}
  </div>

  <div class="feed" bind:this={feedEl}>
    {#each feed as reel, i (reel.uid)}
      <!-- Double-tap to save is a pointer shortcut; the heart button and the 'l' key do the same. -->
      <!-- svelte-ignore a11y_click_events_have_key_events, a11y_no_noninteractive_element_interactions -->
      <section
        class="reel theme-{reel.theme}"
        data-index={i}
        use:observe
        onclick={(e) => onReelTap(e, i, reel)}
        aria-label={reel.label}
      >
        <ReelCard {reel} onanswer={onAnswer} />

        <aside class="rail">
          <button
            class="rail-btn"
            class:liked={liked.has(reel.key)}
            onclick={(e) => { e.stopPropagation(); toggleLike(reel); }}
            aria-label={liked.has(reel.key) ? 'Unsave reel' : 'Save reel'}
            aria-pressed={liked.has(reel.key)}
          >
            <span class="glyph">{liked.has(reel.key) ? '❤️' : '🤍'}</span>
            <span class="cap">Save</span>
          </button>
          {#if audioFor(reel)}
            <button class="rail-btn" onclick={(e) => { e.stopPropagation(); speak(audioFor(reel)); }} aria-label="Play again">
              <span class="glyph">🔊</span>
              <span class="cap">Play</span>
            </button>
            <button
              class="rail-btn"
              onclick={(e) => { e.stopPropagation(); speak(audioFor(reel), { rate: 0.55 }); }}
              aria-label="Play slowly"
            >
              <span class="glyph">🐢</span>
              <span class="cap">Slow</span>
            </button>
          {/if}
        </aside>

        <a class="source" href={reel.source.href} onclick={(e) => e.stopPropagation()}>
          {reel.source.icon} {reel.source.title} <span class="go">· open ›</span>
        </a>

        {#if i === 0 && tab === 'foryou'}
          <div class="swipe-hint">Swipe up ↑ · double-tap to save</div>
        {/if}
      </section>
    {:else}
      <section class="reel theme-ink empty">
        <div>
          <div class="empty-emoji">🤍</div>
          <p>No saved reels yet.</p>
          <p class="dim">Double-tap a reel (or hit the heart) to save it here for later.</p>
          <button class="pill-btn" onclick={() => switchTab('foryou')}>Back to For you</button>
        </div>
      </section>
    {/each}
  </div>

  {#each hearts as h (h.id)}
    <div class="burst" style="left:{h.x}px; top:{h.y}px">❤️</div>
  {/each}
</div>

<style>
  .reels {
    position: fixed;
    inset: 0;
    z-index: 50;
    background: #111;
    color: #fff;
  }
  .top {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    z-index: 3;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0.6rem 0.75rem;
    background: linear-gradient(rgba(0, 0, 0, 0.35), transparent);
    pointer-events: none;
  }
  .top > * {
    pointer-events: auto;
  }
  .icon-btn {
    border: none;
    background: rgba(0, 0, 0, 0.25);
    color: #fff;
    width: 2.4rem;
    height: 2.4rem;
    border-radius: 50%;
    font-size: 1.15rem;
  }
  .tabs {
    display: flex;
    gap: 1rem;
  }
  .tabs button {
    border: none;
    background: none;
    color: rgba(255, 255, 255, 0.65);
    font-weight: 700;
    font-size: 1.02rem;
    padding: 0.25rem 0;
    border-bottom: 2px solid transparent;
  }
  .tabs button.on {
    color: #fff;
    border-bottom-color: #fff;
  }
  .stats {
    position: absolute;
    top: 3.3rem;
    left: 0;
    right: 0;
    z-index: 3;
    text-align: center;
    font-size: 0.8rem;
    font-weight: 600;
    opacity: 0.8;
    pointer-events: none;
  }
  .feed {
    height: 100vh;
    height: 100dvh;
    overflow-y: scroll;
    scroll-snap-type: y mandatory;
    overscroll-behavior: contain;
    scrollbar-width: none;
  }
  .feed::-webkit-scrollbar {
    display: none;
  }
  .reel {
    position: relative;
    height: 100vh;
    height: 100dvh;
    scroll-snap-align: start;
    scroll-snap-stop: always;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 5.5rem 4.6rem 4.5rem 1.25rem;
    overflow: hidden;
    user-select: none;
    -webkit-tap-highlight-color: transparent;
  }
  @media (min-width: 620px) {
    .reel {
      padding-left: 4.6rem;
    }
  }
  .theme-red { background: linear-gradient(160deg, #c8102e, #5e0716); }
  .theme-green { background: linear-gradient(160deg, #00843d, #013d1d); }
  .theme-ink { background: linear-gradient(160deg, #2b2b2b, #0b0b0b); }
  .theme-plum { background: linear-gradient(160deg, #6d2a7a, #2a0d33); }
  .theme-teal { background: linear-gradient(160deg, #0f7c80, #06363a); }
  .theme-amber { background: linear-gradient(160deg, #c46b0a, #5a2c00); }
  .theme-navy { background: linear-gradient(160deg, #23408e, #0b1a3d); }

  .rail {
    position: absolute;
    right: 0.6rem;
    bottom: 5.5rem;
    display: flex;
    flex-direction: column;
    gap: 1rem;
  }
  .rail-btn {
    border: none;
    background: none;
    color: #fff;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 0.1rem;
  }
  .glyph {
    width: 3rem;
    height: 3rem;
    border-radius: 50%;
    background: rgba(0, 0, 0, 0.25);
    display: grid;
    place-items: center;
    font-size: 1.45rem;
    transition: transform 0.15s;
  }
  .rail-btn.liked .glyph {
    transform: scale(1.12);
  }
  .rail-btn:active .glyph {
    transform: scale(0.9);
  }
  .cap {
    font-size: 0.72rem;
    font-weight: 700;
  }
  .source {
    position: absolute;
    left: 1rem;
    right: 4.6rem;
    bottom: 1.4rem;
    color: #fff;
    font-weight: 700;
    text-decoration: none;
    font-size: 0.95rem;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  .go {
    opacity: 0.75;
    font-weight: 600;
  }
  .swipe-hint {
    position: absolute;
    left: 0;
    right: 0;
    bottom: 3.6rem;
    text-align: center;
    font-size: 0.85rem;
    opacity: 0.75;
    animation: nudge 1.6s ease-in-out infinite;
    pointer-events: none;
  }
  @keyframes nudge {
    0%, 100% { transform: translateY(0); }
    50% { transform: translateY(-6px); }
  }
  .empty {
    text-align: center;
    padding: 1.5rem;
  }
  .empty-emoji {
    font-size: 3rem;
  }
  .dim {
    opacity: 0.75;
  }
  .pill-btn {
    border: 2px solid #fff;
    background: none;
    color: #fff;
    border-radius: 999px;
    padding: 0.5rem 1.2rem;
    font-weight: 700;
  }
  .burst {
    position: fixed;
    z-index: 4;
    font-size: 5rem;
    pointer-events: none;
    transform: translate(-50%, -50%);
    animation: pop 0.8s ease-out forwards;
  }
  @keyframes pop {
    0% { transform: translate(-50%, -50%) scale(0.3); opacity: 0; }
    25% { transform: translate(-50%, -50%) scale(1.2); opacity: 1; }
    100% { transform: translate(-50%, -110%) scale(1); opacity: 0; }
  }
  @media (prefers-reduced-motion: reduce) {
    .swipe-hint,
    .burst {
      animation: none;
    }
  }
</style>
