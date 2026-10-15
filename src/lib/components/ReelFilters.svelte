<script>
  import { lessons } from '../data/lessons.js';
  import { grammarGuides } from '../data/grammar.js';
  import { TYPE_GROUPS, REEL_STYLE } from '../reels.js';

  // Bottom sheet for tuning the feed: which reel types and which lessons /
  // guides to draw from, the daily goal, and lean-back (hands-free) mode.
  // `prefs` mirrors progress.reelsPrefs; onchange(patch) persists a change.
  let { prefs, onchange = () => {}, onclose = () => {} } = $props();

  const allTypes = TYPE_GROUPS.flatMap((g) => g.types);
  const allSources = [...lessons.map((l) => l.id), ...grammarGuides.map((g) => g.id)];

  let types = $derived(new Set(prefs.types ?? allTypes));
  let sources = $derived(new Set(prefs.sources ?? allSources));

  /** Toggle one id in a Set-valued pref; "everything selected" is stored as null. */
  function toggle(field, all, current, id) {
    const next = new Set(current);
    next.has(id) ? next.delete(id) : next.add(id);
    onchange({ [field]: next.size === all.length ? null : [...next] });
  }

  function setAll(field, on) {
    onchange({ [field]: on ? null : [] });
  }

  function setGoal(delta) {
    onchange({ goal: Math.max(5, Math.min(100, (prefs.goal || 20) + delta)) });
  }
</script>

<!-- svelte-ignore a11y_no_static_element_interactions, a11y_click_events_have_key_events -->
<div class="scrim" onclick={onclose}></div>
<div class="sheet" role="dialog" aria-label="Feed settings">
  <div class="handle"></div>
  <div class="head">
    <h2>Tune your feed</h2>
    <button class="close" onclick={onclose} aria-label="Close settings">✕</button>
  </div>

  <section>
    <div class="row">
      <h3>Daily goal</h3>
      <div class="stepper">
        <button onclick={() => setGoal(-5)} aria-label="Lower goal">−</button>
        <strong>{prefs.goal} reels</strong>
        <button onclick={() => setGoal(5)} aria-label="Raise goal">+</button>
      </div>
    </div>
    <label class="row">
      <span><h3>Lean-back mode</h3><small>Hands-free: plays each reel and moves on by itself. Stops on anything you need to answer.</small></span>
      <input type="checkbox" checked={prefs.leanBack} onchange={(e) => onchange({ leanBack: e.currentTarget.checked })} />
    </label>
  </section>

  <section>
    <div class="row">
      <h3>Reel types</h3>
      <span class="links">
        <button onclick={() => setAll('types', true)}>all</button> · <button onclick={() => setAll('types', false)}>none</button>
      </span>
    </div>
    {#each TYPE_GROUPS as group}
      <div class="group-label">{group.label}</div>
      <div class="chips">
        {#each group.types as t}
          <button class="chip" class:on={types.has(t)} aria-pressed={types.has(t)} onclick={() => toggle('types', allTypes, types, t)}>
            {REEL_STYLE[t].emoji} {REEL_STYLE[t].label}
          </button>
        {/each}
      </div>
    {/each}
  </section>

  <section>
    <div class="row">
      <h3>Topics</h3>
      <span class="links">
        <button onclick={() => setAll('sources', true)}>all</button> · <button onclick={() => setAll('sources', false)}>none</button>
      </span>
    </div>
    <small>Verbs, dialogues, readings and bites are not tied to a topic and always show.</small>
    <div class="group-label">Lessons</div>
    <div class="chips">
      {#each lessons as l}
        <button class="chip" class:on={sources.has(l.id)} aria-pressed={sources.has(l.id)} onclick={() => toggle('sources', allSources, sources, l.id)}>
          {l.icon} {l.title}
        </button>
      {/each}
    </div>
    <div class="group-label">Grammar</div>
    <div class="chips">
      {#each grammarGuides as g}
        <button class="chip" class:on={sources.has(g.id)} aria-pressed={sources.has(g.id)} onclick={() => toggle('sources', allSources, sources, g.id)}>
          {g.icon} {g.title}
        </button>
      {/each}
    </div>
  </section>
</div>

<style>
  .scrim {
    position: fixed;
    inset: 0;
    z-index: 60;
    background: rgba(0, 0, 0, 0.5);
  }
  .sheet {
    position: fixed;
    left: 0;
    right: 0;
    bottom: 0;
    z-index: 61;
    max-height: 85vh;
    max-height: 85dvh;
    overflow-y: auto;
    background: var(--card);
    color: var(--ink);
    border-radius: 18px 18px 0 0;
    padding: 0.5rem 1rem 1.5rem;
    box-shadow: 0 -4px 20px rgba(0, 0, 0, 0.3);
  }
  .handle {
    width: 2.5rem;
    height: 4px;
    border-radius: 2px;
    background: var(--border);
    margin: 0.25rem auto 0.5rem;
  }
  .head {
    display: flex;
    align-items: center;
    justify-content: space-between;
  }
  h2 {
    margin: 0;
    font-size: 1.2rem;
  }
  h3 {
    margin: 0;
    font-size: 1rem;
  }
  small {
    display: block;
    color: var(--muted);
    font-size: 0.82rem;
    margin-top: 0.15rem;
  }
  .close {
    border: none;
    background: transparent;
    font-size: 1.2rem;
    color: var(--muted);
  }
  section {
    padding: 0.8rem 0;
    border-top: 1px solid var(--border);
  }
  .row {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 1rem;
    margin-bottom: 0.4rem;
  }
  label.row {
    cursor: pointer;
  }
  label input {
    width: 1.4rem;
    height: 1.4rem;
    flex: none;
    accent-color: var(--green);
  }
  .stepper {
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }
  .stepper button {
    width: 2.2rem;
    height: 2.2rem;
    border-radius: 50%;
    border: 1px solid var(--border);
    background: var(--white);
    font-size: 1.2rem;
    line-height: 1;
  }
  .links button {
    border: none;
    background: none;
    color: var(--accent);
    font-weight: 600;
    padding: 0;
  }
  .group-label {
    font-size: 0.75rem;
    text-transform: uppercase;
    letter-spacing: 0.06em;
    color: var(--muted);
    margin: 0.6rem 0 0.3rem;
  }
  .chips {
    display: flex;
    flex-wrap: wrap;
    gap: 0.4rem;
  }
  .chip {
    border: 1px solid var(--border);
    background: var(--white);
    color: var(--muted);
    border-radius: 999px;
    padding: 0.35rem 0.75rem;
    font-size: 0.88rem;
    font-weight: 600;
  }
  .chip.on {
    background: var(--accent);
    border-color: var(--accent);
    color: var(--white);
  }
</style>
