<script>
  /**
   * One question's slot in the interview workbook: the learner types their own
   * true answer, hears it read back, and marks it "ready" once they can say it
   * without reading. Every keystroke is saved to localStorage on this device —
   * nothing leaves the browser.
   */
  import AudioButton from './AudioButton.svelte';
  import { workbook } from '../workbook.js';
  import { MAX_ANSWER_LENGTH } from '../workbook.js';

  let { question, suggestions = [] } = $props();

  let entry = $derived($workbook.answers[question.id] ?? { text: '', note: '', ready: false, updated: 0 });
  let text = $derived(entry.text);
  let showNote = $state(false);
  let justSaved = $state(false);
  let savedTimer;

  function flashSaved() {
    justSaved = true;
    clearTimeout(savedTimer);
    savedTimer = setTimeout(() => (justSaved = false), 1200);
  }

  function onInput(event) {
    workbook.setAnswer(question.id, event.currentTarget.value);
    flashSaved();
  }

  function onNote(event) {
    workbook.setNote(question.id, event.currentTarget.value);
    flashSaved();
  }

  function useModel(hu) {
    workbook.setAnswer(question.id, hu);
    flashSaved();
  }

  function clear() {
    workbook.clearAnswer(question.id);
    showNote = false;
  }

  function when(stamp) {
    if (!stamp) return '';
    const d = new Date(stamp);
    return d.toLocaleDateString(undefined, { day: 'numeric', month: 'short' });
  }
</script>

<div class="editor" class:ready={entry.ready}>
  <div class="head">
    <label class="lbl" for="ans-{question.id}">✍️ My answer</label>
    <div class="head-actions">
      {#if justSaved}
        <span class="saved-flash">Saved on this device ✓</span>
      {:else if entry.updated}
        <span class="muted stamp">Saved {when(entry.updated)}</span>
      {/if}
      {#if text.trim()}
        <AudioButton text={text} label="Hear mine" />
      {/if}
    </div>
  </div>

  <textarea
    id="ans-{question.id}"
    rows="2"
    maxlength={MAX_ANSWER_LENGTH}
    placeholder="Write your own true answer in Hungarian…"
    value={text}
    oninput={onInput}
  ></textarea>

  <!-- Textareas clip their own scroll when printed, so the revision printout gets plain text. -->
  <p class="print-only">{text.trim() || '…'}</p>

  {#if suggestions.length && !text.trim()}
    <div class="starters">
      <span class="muted">Start from a model answer:</span>
      {#each suggestions as s}
        <button class="chip" type="button" onclick={() => useModel(s.hu)} title={s.en}>{s.hu}</button>
      {/each}
    </div>
  {/if}

  {#if showNote || entry.note}
    <textarea
      class="note"
      rows="1"
      maxlength="300"
      placeholder="A private note — pronunciation reminder, the tricky word, anything…"
      value={entry.note}
      oninput={onNote}
    ></textarea>
  {/if}

  <div class="actions">
    <button
      class="btn tiny"
      type="button"
      aria-pressed={entry.ready}
      onclick={() => workbook.toggleReady(question.id)}
    >
      {entry.ready ? '✅ Ready to say' : '☐ Mark as ready'}
    </button>
    {#if !showNote && !entry.note}
      <button class="btn tiny ghost" type="button" onclick={() => (showNote = true)}>📝 Add a note</button>
    {/if}
    {#if text.trim() || entry.note || entry.ready}
      <button class="btn tiny ghost" type="button" onclick={clear}>🗑️ Clear</button>
    {/if}
  </div>
</div>

<style>
  .editor {
    margin-top: 0.6rem;
    border: 1px solid var(--border);
    border-left: 4px solid var(--accent);
    border-radius: 10px;
    padding: 0.6rem 0.75rem;
    background: var(--card);
  }
  .editor.ready {
    border-left-color: var(--good);
    background: var(--good-soft);
  }
  .head {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 0.5rem;
    flex-wrap: wrap;
  }
  .lbl {
    font-size: 0.85rem;
    font-weight: 700;
    color: var(--muted);
  }
  .head-actions {
    display: flex;
    align-items: center;
    gap: 0.4rem;
  }
  .stamp,
  .saved-flash {
    font-size: 0.78rem;
  }
  .saved-flash {
    color: var(--good);
    font-weight: 600;
  }
  textarea {
    font: inherit;
    width: 100%;
    margin-top: 0.35rem;
    padding: 0.45rem 0.6rem;
    border: 1px solid var(--border);
    border-radius: 8px;
    resize: vertical;
    background: var(--white);
  }
  textarea.note {
    font-size: 0.88rem;
    color: var(--muted);
  }
  .starters {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: 0.35rem;
    margin-top: 0.4rem;
    font-size: 0.82rem;
  }
  .chip {
    border: 1px dashed var(--border);
    background: var(--bg);
    border-radius: 999px;
    padding: 0.2rem 0.6rem;
    font-size: 0.82rem;
    max-width: 100%;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
  .chip:hover {
    background: var(--accent-soft);
    border-color: var(--accent);
  }
  .actions {
    display: flex;
    flex-wrap: wrap;
    gap: 0.4rem;
    margin-top: 0.5rem;
  }
  .btn.tiny {
    padding: 0.3rem 0.6rem;
    font-size: 0.82rem;
    border-radius: 8px;
  }
  .btn.ghost {
    color: var(--muted);
  }
  .print-only {
    display: none;
  }
  @media print {
    .editor {
      background: none;
      border: none;
      border-left: 3px solid #999;
      padding: 0.2rem 0.6rem;
    }
    textarea,
    .starters,
    .actions,
    .head-actions {
      display: none;
    }
    .print-only {
      display: block;
      margin: 0.2rem 0;
      font-weight: 600;
    }
  }
</style>
