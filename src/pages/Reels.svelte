<script>
  import { onDestroy } from 'svelte';
  import { get } from 'svelte/store';
  import { progress } from '../lib/progress.js';
  import { speak } from '../lib/speech.js';
  import { navigate } from '../lib/router.js';
  import { lessons } from '../lib/data/lessons.js';
  import { eligibleReviewPool } from '../lib/course.js';
  import { dayStamp } from '../lib/srs.js';
  import { streak } from '../lib/stats.js';
  import {
    buildReel,
    nextBatch,
    dueBatch,
    reviewKeyOf,
    requeueVariant,
    requeueOffset,
    insertAt,
    recapReel,
    goalReel,
    isSavable,
    isInteractive,
    RECAP_EVERY,
    REQUEUE_LIMIT
  } from '../lib/reels.js';
  import ReelCard from '../lib/components/ReelCard.svelte';
  import ReelFilters from '../lib/components/ReelFilters.svelte';

  // A TikTok-style feed: one micro-lesson per screen, swipe up for the next,
  // forever. Scroll-snap does the swiping; an IntersectionObserver works out
  // which reel is on screen so its audio can autoplay.
  //
  // Learning loop: anything answered wrong (or self-graded "not yet") is
  // re-inserted a few reels later as a different exercise on the same item,
  // every RECAP_EVERY reels a recap of the misses appears, and the Due tab
  // builds a feed from what the spaced-repetition deck wants today.

  /** Load another batch when the learner gets this close to the end. */
  const PREFETCH = 5;
  const DOUBLE_TAP_MS = 300;
  /** Lean-back: dwell after the audio ends, and a hard cap in case it never reports ending. */
  const LEAN_DWELL_MS = 3500;
  const LEAN_CAP_MS = 9000;

  let tab = $state('foryou'); // foryou | due | saved
  let feed = $state([]);
  let active = $state(-1);
  let soundOn = $state(true);
  let hearts = $state([]); // { id, x, y } double-tap bursts
  let showFilters = $state(false);
  let typing = $state(false);
  let reelHeight = $state(0);

  let feedEl = $state(null);
  let uid = 0;
  const seen = new Set();
  const watched = new Set();
  const requeued = new Map(); // key -> times re-queued this session
  let misses = []; // { key, hu, en } in the order they were missed
  let recapsShown = 0;
  let goalShown = false;
  let answered = $state(0);
  let correct = $state(0);
  let lastTap = { t: 0, index: -1 };
  let leanTimer = null;
  let typingTimer = null;

  let liked = $derived(new Set($progress.reelsLiked || []));
  let prefs = $derived($progress.reelsPrefs);
  let todayCount = $derived($progress.reelsToday?.day === dayStamp() ? $progress.reelsToday.count : 0);
  let goalPct = $derived(Math.min(1, todayCount / Math.max(1, prefs.goal)));
  let watchedCount = $state(0);

  function toItems(keys, extra = {}) {
    return keys
      .map((key) => buildReel(key))
      .filter(Boolean)
      .map((reel) => ({ ...reel, ...extra, uid: ++uid }));
  }

  function withUid(reel) {
    return { ...reel, uid: ++uid };
  }

  function loadMore() {
    const keys = nextBatch({ progress: get(progress), seen, filters: prefs });
    keys.forEach((k) => seen.add(k));
    feed = [...feed, ...toItems(keys)];
  }

  function buildDue() {
    const p = get(progress);
    return toItems(dueBatch({ pool: eligibleReviewPool(lessons, p), srsState: p.srs || {}, today: dayStamp() }));
  }

  function switchTab(next) {
    if (tab === next && feed.length) return;
    tab = next;
    active = -1; // so the first reel of the new feed counts as freshly shown
    clearLean();
    // Saved and Due are snapshots: un-hearting or answering must not yank a reel off screen.
    if (next === 'saved') feed = toItems(get(progress).reelsLiked || []);
    else if (next === 'due') feed = buildDue();
    else {
      feed = [];
      loadMore();
    }
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
      case 'cloze':
        return null; // hearing the gap word would give the answer away
      case 'verb':
        return reel.verb.inf;
      case 'conj':
        return `${reel.pronoun}… ${reel.verb.inf}`;
      case 'reading':
        return reel.sentence.hu;
      case 'order':
        return reel.sentence.hu;
      case 'dialogue':
        return reel.lines[0].hu;
      case 'tip':
        return reel.examples[0]?.hu ?? null;
      case 'bite':
        return reel.bite.examples[0]?.hu ?? null;
      case 'letter':
        return reel.phrase.hu;
      case 'interview':
        return reel.question.hu;
      case 'say':
        return null; // the mic is about to open — do not have the app speak first
      default:
        return null; // type/drill/table/recap/goal: let the learner try first
    }
  }

  function clearLean() {
    if (leanTimer) clearTimeout(leanTimer);
    leanTimer = null;
  }

  /** Lean-back: after this reel's audio, wait a moment and move on by itself. */
  function armLean(reel) {
    clearLean();
    if (!prefs.leanBack || isInteractive(reel) || document.hidden) return;
    const advance = () => {
      clearLean();
      leanTimer = setTimeout(() => scrollToReel(active + 1), LEAN_DWELL_MS);
    };
    const text = audioFor(reel);
    if (soundOn && text) {
      speak(text, { onend: advance });
      leanTimer = setTimeout(advance, LEAN_CAP_MS); // in case onend never fires
    } else {
      advance();
    }
  }

  function playActive() {
    const reel = feed[active];
    if (prefs.leanBack && !isInteractive(reel)) return armLean(reel);
    const text = audioFor(reel);
    if (soundOn && text) speak(text);
  }

  function setActive(i) {
    if (i === active) return;
    active = i;
    const reel = feed[i];
    if (reel && !watched.has(reel.uid)) {
      watched.add(reel.uid);
      watchedCount = watched.size;
      const before = todayCount;
      progress.bumpReelsToday();
      if (!goalShown && before < prefs.goal && before + 1 >= prefs.goal) {
        goalShown = true;
        feed = insertAt(feed, withUid(goalReel(prefs.goal, streak(get(progress).daysActive, dayStamp()))), i + 1);
      } else if (watched.size % RECAP_EVERY === 0 && misses.length && recapsShown < watched.size / RECAP_EVERY) {
        recapsShown += 1;
        feed = insertAt(feed, withUid(recapReel(misses)), i + 1);
      }
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
    feedEl.scrollTo({ top: i * (reelHeight || feedEl.clientHeight), behavior: 'smooth' });
    if (!observer) setActive(i);
  }

  function toggleLike(reel) {
    if (!isSavable(reel)) return;
    progress.toggleReelLike(reel.key);
  }

  function burst(x, y) {
    const id = ++uid;
    hearts = [...hearts, { id, x, y }];
    setTimeout(() => (hearts = hearts.filter((h) => h.id !== id)), 800);
  }

  /** Double-tap anywhere on a reel to heart it — the TikTok gesture. */
  function onReelTap(e, i, reel) {
    clearLean(); // any touch means the learner is driving
    const now = Date.now();
    if (now - lastTap.t < DOUBLE_TAP_MS && lastTap.index === i) {
      if (isSavable(reel)) {
        if (!liked.has(reel.key)) toggleLike(reel);
        burst(e.clientX, e.clientY);
      }
      lastTap = { t: 0, index: -1 };
    } else {
      lastTap = { t: now, index: i };
    }
  }

  /** Put a retry of `key` into the feed `offset` reels after the current one. */
  function insertRetry(key, offset) {
    const [item] = toItems([key], { requeued: true });
    if (!item) return;
    feed = insertAt(feed, item, Math.min(feed.length, active + 1 + offset));
  }

  function requeue(reel) {
    const times = requeued.get(reel.key) || 0;
    if (times >= REQUEUE_LIMIT) return;
    const variant = requeueVariant(reel.key);
    if (!variant) return;
    requeued.set(reel.key, times + 1);
    insertRetry(variant, requeueOffset());
  }

  function missLabel(reel) {
    switch (reel.type) {
      case 'phrase':
      case 'cloze':
        return { hu: reel.phrase.hu, en: reel.phrase.en };
      case 'conj':
        return { hu: `${reel.pronoun} ${reel.answer}`, en: `${reel.verb.en}, ${reel.tenseLabel}` };
      case 'order':
        return { hu: reel.sentence.hu, en: reel.sentence.en };
      case 'drill':
        return { hu: reel.answer, en: reel.prompt };
      case 'say':
        return { hu: reel.text, en: reel.en };
      default:
        return { hu: reel.word.hu, en: reel.word.en };
    }
  }

  function onAnswer(reel, isCorrect) {
    clearLean();
    answered += 1;
    if (isCorrect) correct += 1;
    // Quick checks are real practice: feed them into spaced repetition.
    const key = reviewKeyOf(reel);
    if (key) progress.recordReview(key, isCorrect);
    if (!isCorrect && isSavable(reel)) {
      // One entry per item, not per variant: a word missed as 'quiz' and again as 'type' is one miss.
      const label = missLabel(reel);
      misses = [...misses.filter((m) => m.hu !== label.hu), { key: reel.key, ...label }];
      requeue(reel);
    }
  }

  /** Recap "try again" button: a fresh variant right after the recap. */
  function onReplay(key) {
    insertRetry(requeueVariant(key) ?? key, 0);
  }

  function onFocusChange(focused) {
    if (typingTimer) clearTimeout(typingTimer);
    // Restore snapping a beat after blur, so the closing keyboard's resize
    // does not re-snap the feed mid-animation.
    if (focused) typing = true;
    else typingTimer = setTimeout(() => (typing = false), 300);
  }

  /**
   * Lock every reel to the feed's height in px (see .reel). Without this the
   * soft keyboard shrinks 100dvh, reflowing every reel and jumping the feed.
   */
  function measure() {
    if (feedEl && !typing) reelHeight = feedEl.clientHeight;
  }

  function measureOnMount() {
    requestAnimationFrame(measure);
  }

  function onKey(e) {
    if (e.target?.closest?.('input, textarea')) return;
    if (showFilters) {
      if (e.key === 'Escape') showFilters = false;
      return;
    }
    if (e.key === 'ArrowDown' || e.key === 'j') {
      e.preventDefault();
      clearLean();
      scrollToReel(active + 1);
    } else if (e.key === 'ArrowUp' || e.key === 'k') {
      e.preventDefault();
      clearLean();
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
    else {
      window.speechSynthesis?.cancel();
      clearLean();
    }
  }

  function onPrefsChange(patch) {
    const restart = 'types' in patch || 'sources' in patch;
    progress.setReelsPrefs(patch);
    if (restart && tab === 'foryou') {
      seen.clear();
      feed = [];
      loadMore();
      active = -1;
      feedEl?.scrollTo?.({ top: 0 });
      if (!observer) setActive(0);
    }
    if ('leanBack' in patch) patch.leanBack ? playActive() : clearLean();
  }

  function onVisibility() {
    if (document.hidden) {
      clearLean();
      window.speechSynthesis?.cancel();
    }
  }

  switchTab('foryou');

  onDestroy(() => {
    observer?.disconnect();
    clearLean();
    if (typingTimer) clearTimeout(typingTimer);
    window.speechSynthesis?.cancel();
    if (watched.size > 1) progress.logReelSession(watched.size, correct, answered);
  });
</script>

<svelte:window onkeydown={onKey} onresize={measure} />
<svelte:document onvisibilitychange={onVisibility} />

<div class="reels" style={reelHeight ? `--reel-h:${reelHeight}px` : ''}>
  <div class="top">
    <button class="icon-btn" onclick={() => navigate('home')} aria-label="Close reels">✕</button>
    <div class="tabs" role="tablist">
      <button role="tab" aria-selected={tab === 'foryou'} class:on={tab === 'foryou'} onclick={() => switchTab('foryou')}>
        For you
      </button>
      <button role="tab" aria-selected={tab === 'due'} class:on={tab === 'due'} onclick={() => switchTab('due')}>
        Due
      </button>
      <button role="tab" aria-selected={tab === 'saved'} class:on={tab === 'saved'} onclick={() => switchTab('saved')}>
        Saved{liked.size ? ` (${liked.size})` : ''}
      </button>
    </div>
    <div class="top-right">
      <button class="icon-btn ring-btn" onclick={() => (showFilters = true)} aria-label="Feed settings — {todayCount} of {prefs.goal} reels today" title="{todayCount}/{prefs.goal} today">
        <svg viewBox="0 0 36 36" aria-hidden="true">
          <circle class="ring-bg" cx="18" cy="18" r="15.5" />
          <circle class="ring-fg" class:done={goalPct >= 1} cx="18" cy="18" r="15.5" style="stroke-dasharray:{(goalPct * 97.4).toFixed(1)} 97.4" />
        </svg>
        <span class="ring-label">{goalPct >= 1 ? '🏆' : todayCount}</span>
      </button>
      <button class="icon-btn" onclick={toggleSound} aria-label={soundOn ? 'Mute autoplay' : 'Unmute autoplay'}>
        {soundOn ? '🔊' : '🔇'}
      </button>
    </div>
  </div>

  <div class="stats">
    {#if prefs.leanBack}🛋️ lean-back · {/if}🔥 {watchedCount} watched{#if answered} · ✅ {correct}/{answered}{/if}
  </div>

  <div class="feed" class:typing bind:this={feedEl} use:measureOnMount>
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
        {#if reel.requeued}<div class="badge">🔁 Again</div>{/if}
        <ReelCard {reel} onanswer={onAnswer} onreplay={onReplay} onfocuschange={onFocusChange} />

        <aside class="rail">
          {#if isSavable(reel)}
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
          {/if}
          {#if audioFor(reel)}
            <button class="rail-btn" onclick={(e) => { e.stopPropagation(); clearLean(); speak(audioFor(reel)); }} aria-label="Play again">
              <span class="glyph">🔊</span>
              <span class="cap">Play</span>
            </button>
            <button
              class="rail-btn"
              onclick={(e) => { e.stopPropagation(); clearLean(); speak(audioFor(reel), { rate: 0.55 }); }}
              aria-label="Play slowly"
            >
              <span class="glyph">🐢</span>
              <span class="cap">Slow</span>
            </button>
          {/if}
        </aside>

        {#if reel.source}
          <a class="source" href={reel.source.href} onclick={(e) => e.stopPropagation()}>
            {reel.source.icon} {reel.source.title} <span class="go">· open ›</span>
          </a>
        {/if}

        {#if i === 0 && tab === 'foryou'}
          <div class="swipe-hint">Swipe up ↑ · double-tap to save</div>
        {/if}
      </section>
    {:else}
      <section class="reel theme-ink empty">
        {#if tab === 'saved'}
          <div>
            <div class="empty-emoji">🤍</div>
            <p>No saved reels yet.</p>
            <p class="dim">Double-tap a reel (or hit the heart) to save it here for later.</p>
            <button class="pill-btn" onclick={() => switchTab('foryou')}>Back to For you</button>
          </div>
        {:else if tab === 'due'}
          <div>
            <div class="empty-emoji">🌤️</div>
            <p>Nothing due right now — nice.</p>
            <p class="dim">Answer quick checks in For you and the deck will have things to bring back tomorrow.</p>
            <button class="pill-btn" onclick={() => switchTab('foryou')}>Back to For you</button>
          </div>
        {:else}
          <div>
            <div class="empty-emoji">🔍</div>
            <p>Nothing matches your filters.</p>
            <button class="pill-btn" onclick={() => (showFilters = true)}>Change filters</button>
          </div>
        {/if}
      </section>
    {/each}
  </div>

  {#each hearts as h (h.id)}
    <div class="burst" style="left:{h.x}px; top:{h.y}px">❤️</div>
  {/each}

  {#if showFilters}
    <ReelFilters {prefs} onchange={onPrefsChange} onclose={() => (showFilters = false)} />
  {/if}
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
  .top-right {
    display: flex;
    gap: 0.4rem;
  }
  .icon-btn {
    border: none;
    background: rgba(0, 0, 0, 0.25);
    color: #fff;
    width: 2.4rem;
    height: 2.4rem;
    border-radius: 50%;
    font-size: 1.15rem;
    position: relative;
  }
  .ring-btn svg {
    position: absolute;
    inset: 0;
    width: 100%;
    height: 100%;
    transform: rotate(-90deg);
  }
  .ring-bg,
  .ring-fg {
    fill: none;
    stroke-width: 3;
  }
  .ring-bg {
    stroke: rgba(255, 255, 255, 0.25);
  }
  .ring-fg {
    stroke: #fff;
    stroke-linecap: round;
    transition: stroke-dasharray 0.3s;
  }
  .ring-fg.done {
    stroke: #7CFFB2;
  }
  .ring-label {
    position: relative;
    font-size: 0.8rem;
    font-weight: 800;
  }
  .tabs {
    display: flex;
    gap: 0.9rem;
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
  /* While the soft keyboard is up, snapping fights the keyboard's resize. */
  .feed.typing {
    scroll-snap-type: none;
  }
  .feed::-webkit-scrollbar {
    display: none;
  }
  .reel {
    position: relative;
    height: 100vh;
    height: 100dvh;
    height: var(--reel-h, 100dvh);
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

  .badge {
    position: absolute;
    top: 4.6rem;
    left: 1rem;
    font-size: 0.78rem;
    font-weight: 700;
    background: rgba(0, 0, 0, 0.35);
    padding: 0.2rem 0.6rem;
    border-radius: 999px;
  }
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
