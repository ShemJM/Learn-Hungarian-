<script>
  /**
   * Tappable row of Hungarian accented vowels that inserts into a text input,
   * for learners on keyboards without á é í ó ö ő ú ü ű.
   * Pass the target via `input` (bind:this on the <input>).
   */
  let { input = null } = $props();

  const CHARS = ['á', 'é', 'í', 'ó', 'ö', 'ő', 'ú', 'ü', 'ű'];

  function insert(ch) {
    if (!input) return;
    const start = input.selectionStart ?? input.value.length;
    const end = input.selectionEnd ?? start;
    input.value = input.value.slice(0, start) + ch + input.value.slice(end);
    input.selectionStart = input.selectionEnd = start + ch.length;
    // Bubbling input event so Svelte's bind:value sees the change.
    input.dispatchEvent(new Event('input', { bubbles: true }));
    input.focus();
  }
</script>

<div class="accent-bar" role="toolbar" aria-label="Hungarian accented letters">
  {#each CHARS as ch}
    <button
      type="button"
      class="accent"
      tabindex="-1"
      onmousedown={(e) => e.preventDefault()}
      onclick={() => insert(ch)}
    >
      {ch}
    </button>
  {/each}
</div>

<style>
  .accent-bar {
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    gap: 0.3rem;
    margin: 0.5rem 0;
  }
  .accent {
    font: inherit;
    font-size: 1.05rem;
    min-width: 2.2rem;
    padding: 0.3rem 0.4rem;
    border: 1px solid var(--border);
    border-radius: 8px;
    background: var(--card);
    cursor: pointer;
  }
  .accent:hover {
    background: var(--bg);
  }
</style>
