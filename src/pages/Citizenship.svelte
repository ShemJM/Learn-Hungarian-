<script>
  import AudioButton from '../lib/components/AudioButton.svelte';
  import FreeSpeech from '../lib/components/FreeSpeech.svelte';
  import {
    generalTips,
    interviewCategories,
    jobOptions,
    companyTypeOptions,
    companySizeOptions,
    buildJobSentence,
    regionOptions,
    buildResidenceSentence,
    childGenderOptions,
    buildFamilySentence
  } from '../lib/data/citizenship.js';

  // Job & workplace builder
  let jobId = $state(jobOptions[0].id);
  let companyTypeId = $state(companyTypeOptions[0].id);
  let sizeId = $state(companySizeOptions[3].id);
  let jobSentence = $derived(buildJobSentence(jobId, companyTypeId, sizeId));

  // Residence builder
  let regionId = $state(regionOptions[0].id);
  let cityName = $state('');
  let residenceSentence = $derived(buildResidenceSentence(regionId, cityName));

  // Family builder — a fixed pool of up to 4 kid slots, sliced to the chosen count,
  // so typed names/ages survive the count being changed up and down.
  let childCount = $state(0);
  let kidSlots = $state(Array.from({ length: 4 }, () => ({ gender: 'child', name: '', age: '' })));
  let activeKids = $derived(kidSlots.slice(0, childCount));

  let familySentence = $derived(buildFamilySentence(childCount, activeKids));
</script>

<h1>🪪 Citizenship Interview Prep</h1>
<p class="muted">
  During the simplified naturalisation (<span class="hu">honosítás</span>) interview you will be asked
  simple questions about yourself in Hungarian — your job, where you live, and your family. Study the
  questions and model answers below, then use the sentence builders to practise saying <em>your own</em>
  true answers out loud.
</p>

<div class="card tips">
  <h3>💡 General tips</h3>
  <ul>
    {#each generalTips as tip}
      <li>{tip}</li>
    {/each}
  </ul>
</div>

{#each interviewCategories as cat}
  <div class="card">
    <h2>{cat.icon} {cat.title}</h2>
    {#each cat.questions as q}
      <div class="question">
        <div class="q-line">
          <span class="hu big">{q.hu}</span>
          <AudioButton text={q.hu} />
        </div>
        <div class="muted">{q.en}</div>
        <div class="tip-box">💡 {q.tip}</div>
        <div class="answers">
          {#each q.answers as a}
            <div class="answer">
              <span class="hu">{a.hu}</span>
              <AudioButton text={a.hu} />
              <div class="muted en">{a.en}</div>
            </div>
          {/each}
        </div>
      </div>
    {/each}
    {#if cat.freePrompt}
      <FreeSpeech prompt={cat.freePrompt} />
    {/if}
  </div>
{/each}

<h2>🛠️ Build your own answers</h2>
<p class="muted">
  Pick the options that match your real situation. The Hungarian is assembled from pre-checked,
  grammatically safe building blocks, so whatever you choose comes out correct.
</p>

<div class="card builder">
  <h3>💼 Your job &amp; workplace</h3>
  <div class="fields">
    <label>
      Job
      <select bind:value={jobId}>
        {#each jobOptions as j}<option value={j.id}>{j.label}</option>{/each}
      </select>
    </label>
    <label>
      Company type
      <select bind:value={companyTypeId}>
        {#each companyTypeOptions as c}<option value={c.id}>{c.label}</option>{/each}
      </select>
    </label>
    <label>
      Company size
      <select bind:value={sizeId}>
        {#each companySizeOptions as s}<option value={s.id}>{s.label}</option>{/each}
      </select>
    </label>
  </div>
  <div class="result">
    <div class="hu big">{jobSentence.hu}</div>
    <AudioButton text={jobSentence.hu} />
    <div class="muted">{jobSentence.en}</div>
  </div>
</div>

<div class="card builder">
  <h3>🏠 Where you live</h3>
  <div class="fields">
    <label>
      Part of the country
      <select bind:value={regionId}>
        {#each regionOptions as r}<option value={r.id}>{r.label}</option>{/each}
      </select>
    </label>
    <label>
      Town/city (optional)
      <input type="text" placeholder="e.g. Szeged" bind:value={cityName} />
    </label>
  </div>
  <div class="result">
    <div class="hu big">{residenceSentence.hu}</div>
    <AudioButton text={residenceSentence.hu} />
    <div class="muted">{residenceSentence.en}</div>
  </div>
</div>

<div class="card builder">
  <h3>👨‍👩‍👧‍👦 Your children</h3>
  <div class="fields">
    <label>
      Number of children
      <select bind:value={childCount}>
        {#each [0, 1, 2, 3, 4] as n}<option value={n}>{n}</option>{/each}
      </select>
    </label>
  </div>
  {#each activeKids as kid, i}
    <div class="fields kid-row">
      <label>
        Child {i + 1}
        <select bind:value={kid.gender}>
          {#each childGenderOptions as g}<option value={g.id}>{g.label}</option>{/each}
        </select>
      </label>
      <label>
        Name
        <input type="text" placeholder="e.g. Anna" bind:value={kid.name} />
      </label>
      <label>
        Age (optional)
        <input type="text" placeholder="e.g. 5" bind:value={kid.age} />
      </label>
    </div>
  {/each}
  <div class="result">
    <div class="hu big">{familySentence.hu}</div>
    <AudioButton text={familySentence.hu} />
    <div class="muted">{familySentence.en}</div>
  </div>
</div>

<style>
  .tips ul {
    margin: 0.5rem 0 0;
    padding-left: 1.2rem;
  }
  .tips li {
    margin: 0.3rem 0;
  }
  .question {
    padding: 0.75rem 0;
    border-bottom: 1px dashed var(--border);
  }
  .question:last-child {
    border-bottom: none;
  }
  .q-line {
    display: flex;
    align-items: center;
    gap: 0.3rem;
  }
  .big {
    font-size: 1.15rem;
  }
  .tip-box {
    background: var(--accent-soft);
    border-radius: 8px;
    padding: 0.5rem 0.7rem;
    margin: 0.5rem 0;
    font-size: 0.9rem;
  }
  .answers {
    background: var(--bg);
    border-radius: 10px;
    padding: 0.5rem 0.9rem;
  }
  .answer {
    padding: 0.35rem 0;
    border-bottom: 1px dashed var(--border);
  }
  .answer:last-child {
    border-bottom: none;
  }
  .en {
    font-size: 0.88rem;
  }
  .builder h3 {
    margin-top: 0;
  }
  .fields {
    display: flex;
    flex-wrap: wrap;
    gap: 1rem;
    margin-bottom: 0.75rem;
  }
  .fields label {
    display: flex;
    flex-direction: column;
    gap: 0.25rem;
    font-size: 0.85rem;
    color: var(--muted);
    font-weight: 600;
  }
  .fields select,
  .fields input {
    font: inherit;
    padding: 0.4rem 0.5rem;
    border-radius: 8px;
    border: 1px solid var(--border);
    min-width: 10rem;
  }
  .kid-row {
    border-top: 1px dashed var(--border);
    padding-top: 0.75rem;
  }
  .result {
    background: var(--good-soft);
    border-radius: 10px;
    padding: 0.6rem 0.9rem;
    margin-top: 0.5rem;
  }
</style>
