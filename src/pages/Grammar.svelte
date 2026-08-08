<script>
  import { grammarGuides, getGuide } from '../lib/data/grammar.js';
  import { progress } from '../lib/progress.js';
  import AudioButton from '../lib/components/AudioButton.svelte';

  let { id = null } = $props();
  let guide = $derived(id ? getGuide(id) : null);

  // Opening a guide counts as reading it — it feeds the dashboard's readiness breakdown.
  $effect(() => {
    if (guide) progress.markGuideRead(guide.id);
  });
</script>

{#if !guide}
  <h1>🧩 Grammar Guides</h1>
  <p class="muted">
    Hungarian grammar is logical and consistent — it just works differently from English. These guides
    cover everything a beginner needs, with audio examples throughout.
  </p>
  <div class="grid two">
    {#each grammarGuides as g, i}
      <a class="card guide" href={'#/grammar/' + g.id}>
        <h3>{g.icon} {i + 1}. {g.title}</h3>
        <p class="muted">{g.summary}</p>
      </a>
    {/each}
  </div>
{:else}
  <a href="#/grammar" class="muted back">← All guides</a>
  <h1>{guide.icon} {guide.title}</h1>
  <p class="lead">{guide.summary}</p>

  {#each guide.sections as section}
    <div class="card">
      <h3>{section.heading}</h3>
      {#if section.body}
        <p>{section.body}</p>
      {/if}
      {#if section.table}
        <div class="table-wrap">
          <table>
            <thead>
              <tr>
                {#each section.table.headers as h}<th>{h}</th>{/each}
              </tr>
            </thead>
            <tbody>
              {#each section.table.rows as row}
                <tr>
                  {#each row as cell, ci}
                    <td class:hu={ci === section.table.headers.length - 1 ? false : ci === 0}>
                      {cell}
                      {#if ci === 1 && /^[a-záéíóöőúüű]/i.test(cell) && section.table.headers[1].toLowerCase().includes('hungarian')}
                        <AudioButton text={cell} />
                      {/if}
                    </td>
                  {/each}
                </tr>
              {/each}
            </tbody>
          </table>
        </div>
      {/if}
      {#if section.examples}
        <div class="examples">
          {#each section.examples as ex}
            <div class="example">
              <span class="hu">{ex.hu}</span>
              <AudioButton text={ex.hu} />
              <div class="muted">{ex.en}</div>
            </div>
          {/each}
        </div>
      {/if}
    </div>
  {/each}

  {#if guide.exercises?.length}
    <div class="card practise">
      <div>
        <h3>Put it into practice</h3>
        <p class="muted">
          Reading about grammar is not the same as using it — {guide.exercises.length} quick typed
          drills will make it stick.
        </p>
      </div>
      <a class="btn primary" href={'#/practice/grammar:' + guide.id}>✏️ Practise this</a>
    </div>
  {/if}

  {@const idx = grammarGuides.findIndex((g) => g.id === guide.id)}
  <div class="pager">
    {#if grammarGuides[idx - 1]}
      <a class="btn" href={'#/grammar/' + grammarGuides[idx - 1].id}>← {grammarGuides[idx - 1].title}</a>
    {:else}
      <span></span>
    {/if}
    {#if grammarGuides[idx + 1]}
      <a class="btn primary" href={'#/grammar/' + grammarGuides[idx + 1].id}>{grammarGuides[idx + 1].title} →</a>
    {/if}
  </div>
{/if}

<style>
  .guide {
    text-decoration: none;
    color: var(--ink);
    transition: transform 0.1s;
  }
  .guide:hover {
    transform: translateY(-2px);
  }
  .guide h3 {
    margin-top: 0;
  }
  .back {
    text-decoration: none;
  }
  .lead {
    font-size: 1.05rem;
  }
  .table-wrap {
    overflow-x: auto;
  }
  table {
    width: 100%;
    border-collapse: collapse;
  }
  th {
    text-align: left;
    font-size: 0.8rem;
    text-transform: uppercase;
    color: var(--muted);
    padding: 0.4rem 0.5rem;
    border-bottom: 2px solid var(--border);
  }
  td {
    padding: 0.45rem 0.5rem;
    border-bottom: 1px solid var(--border);
  }
  .examples {
    background: var(--bg);
    border-radius: 10px;
    padding: 0.6rem 0.9rem;
  }
  .example {
    padding: 0.35rem 0;
    border-bottom: 1px dashed var(--border);
  }
  .example:last-child {
    border-bottom: none;
  }
  .practise {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 1rem;
    flex-wrap: wrap;
  }
  .practise h3 {
    margin: 0 0 0.25rem;
  }
  .practise p {
    margin: 0;
  }
  .practise .btn {
    text-decoration: none;
    white-space: nowrap;
  }
  .pager {
    display: flex;
    justify-content: space-between;
    gap: 1rem;
    margin: 1rem 0 2rem;
  }
  .pager .btn {
    text-decoration: none;
  }
</style>
