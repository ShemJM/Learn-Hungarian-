<script>
  /**
   * The workbook's control strip: how much is filled in, and the ways to get
   * the answers off this device — a JSON backup for moving to another browser,
   * a printable revision sheet for the day itself.
   *
   * Answers are stored only in this browser's localStorage, so the panel says
   * so plainly and pushes the backup: clearing site data loses the lot.
   */
  import { workbook, workbookStats, exportWorkbook, parseWorkbook, workbookToText, lastEdited } from '../workbook.js';

  let { questionIds = [], categories = [] } = $props();

  let stats = $derived(workbookStats($workbook, questionIds));
  let edited = $derived(lastEdited($workbook));
  let message = $state('');
  let error = $state('');
  let fileInput;

  function download(contents, filename, type) {
    const url = URL.createObjectURL(new Blob([contents], { type }));
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
  }

  function stampedName(extension) {
    const d = new Date();
    const pad = (n) => String(n).padStart(2, '0');
    return `hungarian-interview-workbook-${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}.${extension}`;
  }

  function backup() {
    download(exportWorkbook($workbook), stampedName('json'), 'application/json');
    say('Backup downloaded — keep it somewhere safe.');
  }

  function revisionSheet() {
    download(workbookToText($workbook, categories), stampedName('txt'), 'text/plain');
    say('Revision sheet downloaded.');
  }

  function say(text) {
    message = text;
    error = '';
  }

  async function onFile(event) {
    const file = event.currentTarget.files?.[0];
    if (!file) return;
    try {
      const incoming = parseWorkbook(await file.text());
      workbook.importWorkbook(incoming);
      const count = Object.keys(incoming.answers).length;
      say(`Restored ${count} answer${count === 1 ? '' : 's'} from the backup.`);
    } catch (e) {
      error = e.message;
      message = '';
    }
    event.currentTarget.value = '';
  }

  function clearAll() {
    if (!confirm('Delete every answer you have written in the workbook? This cannot be undone.')) return;
    workbook.clearAll();
    say('Workbook cleared.');
  }

  function when(stamp) {
    return stamp ? new Date(stamp).toLocaleString(undefined, { dateStyle: 'medium', timeStyle: 'short' }) : '';
  }
</script>

<div class="card panel">
  <div class="top">
    <h3>📓 My interview workbook</h3>
    <span class="count">{stats.written}/{stats.total} written · {stats.ready} ready</span>
  </div>

  <div class="bar" role="progressbar" aria-valuenow={stats.percent} aria-valuemin="0" aria-valuemax="100">
    <div class="fill" style="width: {stats.percent}%"></div>
  </div>

  <p class="muted note">
    🔒 Your answers are saved <strong>on this device only</strong>, in this browser — they are never
    uploaded anywhere. That also means clearing your browser data, or switching to another device or
    browser, loses them: download a backup now and then.
    {#if edited}<br />Last edit: {when(edited)}.{/if}
  </p>

  <div class="actions">
    <button class="btn" type="button" onclick={backup}>⬇️ Download backup (.json)</button>
    <button class="btn" type="button" onclick={() => fileInput.click()}>⬆️ Restore from backup</button>
    <button class="btn" type="button" onclick={revisionSheet}>📄 Revision sheet (.txt)</button>
    <button class="btn" type="button" onclick={() => window.print()}>🖨️ Print</button>
    <button class="btn danger" type="button" onclick={clearAll}>🗑️ Clear workbook</button>
    <input
      class="hidden-input"
      type="file"
      accept="application/json,.json"
      bind:this={fileInput}
      onchange={onFile}
    />
  </div>

  {#if message}<p class="msg good">{message}</p>{/if}
  {#if error}<p class="msg bad">⚠️ {error}</p>{/if}
</div>

<style>
  .panel {
    border-left: 4px solid var(--good);
  }
  .top {
    display: flex;
    align-items: baseline;
    justify-content: space-between;
    gap: 0.5rem;
    flex-wrap: wrap;
  }
  .top h3 {
    margin: 0;
  }
  .count {
    font-size: 0.88rem;
    font-weight: 700;
    color: var(--accent);
  }
  .bar {
    height: 8px;
    border-radius: 999px;
    background: var(--bg);
    border: 1px solid var(--border);
    overflow: hidden;
    margin: 0.5rem 0;
  }
  .fill {
    height: 100%;
    background: var(--good);
    transition: width 0.2s;
  }
  .note {
    font-size: 0.85rem;
    margin: 0.4rem 0 0.6rem;
  }
  .actions {
    display: flex;
    flex-wrap: wrap;
    gap: 0.4rem;
  }
  .btn {
    padding: 0.4rem 0.7rem;
    font-size: 0.85rem;
  }
  .btn.danger {
    color: var(--bad);
  }
  .hidden-input {
    display: none;
  }
  .msg {
    margin: 0.6rem 0 0;
    font-size: 0.88rem;
    font-weight: 600;
  }
  .msg.good {
    color: var(--good);
  }
  .msg.bad {
    color: var(--bad);
  }
  @media print {
    .panel {
      display: none;
    }
  }
</style>
