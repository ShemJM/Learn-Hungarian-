import { describe, it, expect } from 'vitest';
import {
  TOPICS,
  decompose,
  verbStem,
  verbItems,
  possessiveItems,
  caseItems,
  topicItems,
  endingChoices,
  explain,
  buildSuffixDrill
} from './suffixes.js';
import { verbs, getVerb, PRONOUNS } from './data/verbs.js';
import { POSSESSIVE_NOUNS, CASE_NOUNS, CASES, VERB_ENDINGS, POSSESSIVE_ENDINGS } from './data/suffixes.js';

function seededRng(seed = 9) {
  let s = seed;
  return () => {
    s = (s * 1664525 + 1013904223) % 4294967296;
    return s / 4294967296;
  };
}

describe('decompose', () => {
  it('splits a form into a listed stem and a listed ending', () => {
    expect(decompose('házban', ['ház'], ['ban', 'ben'])).toEqual({ stem: 'ház', ending: 'ban' });
    expect(decompose('kutyám', ['kutya', 'kutyá'], ['m', 'om'])).toEqual({ stem: 'kutyá', ending: 'm' });
  });

  it('returns null when no stem + ending spells the form', () => {
    expect(decompose('mész', ['megy'], ['sz', 'ol'])).toBeNull();
    expect(decompose('házban', ['ház'], ['ba', 'be'])).toBeNull();
  });
});

describe('verbStem', () => {
  it('uses the dictionary form, minus -ik for -ik verbs', () => {
    expect(verbStem(getVerb('tanulni'))).toBe('tanul');
    expect(verbStem(getVerb('lakni'))).toBe('lak');
    expect(verbStem(getVerb('dolgozni'))).toBe('dolgoz');
  });
});

describe('verbItems', () => {
  it('asks only about forms that are literally stem + ending, so irregular stems are skipped', () => {
    const present = verbItems('present');
    const answers = present.map((i) => i.answer);
    expect(answers).toContain('tanulok');
    expect(answers).toContain('tanulunk');
    expect(answers).toContain('beszélünk');
    expect(answers).toContain('főzök');
    expect(answers).toContain('dolgozol');
    expect(answers).toContain('olvassa'); // s + ja assimilates — listed as the -sa variant
    expect(answers).not.toContain('mész'); // megy → mész: irregular stem
    expect(answers).not.toContain('jövök');
    expect(answers).not.toContain('vagyok');
    expect(answers).not.toContain('tanul'); // the empty 3sg ending is nothing to pick
  });

  it('covers every pronoun, both conjugations and all three tenses', () => {
    for (const tense of ['present', 'past', 'conditional']) {
      const items = verbItems(tense);
      expect(items.length, tense).toBeGreaterThan(100);
      for (const pronoun of PRONOUNS) {
        if (tense === 'present' && pronoun === 'ő') continue; // indefinite ő has no ending; definite still asked
        expect(items.some((i) => i.pronoun === pronoun), `${tense} ${pronoun}`).toBe(true);
      }
      expect(items.some((i) => i.gloss.includes('definite (a specific object)'))).toBe(true);
    }
    expect(verbItems('past').map((i) => i.answer)).toContain('olvasott');
    expect(verbItems('conditional').map((i) => i.answer)).toContain('tanulnék');
  });

  it('every item really is stem + ending, with the verb harmony attached', () => {
    for (const tense of ['present', 'past', 'conditional']) {
      for (const item of verbItems(tense)) {
        expect(item.stem + item.ending).toBe(item.answer);
        expect(['back', 'front', 'front-rounded']).toContain(item.harmony);
        expect(item.answers).toContain(item.answer);
      }
    }
  });

  it('every listed ending is actually used by some verb in the tables', () => {
    const unused = [];
    for (const tense of ['present', 'past', 'conditional']) {
      const used = new Set(verbItems(tense).map((i) => `${i.gloss.includes('definite (a') ? 'definite' : 'indefinite'}:${i.personIdx}:${i.ending}`));
      for (const definiteness of ['indefinite', 'definite']) {
        VERB_ENDINGS[tense][definiteness].forEach((variants, personIdx) => {
          for (const v of variants) {
            if (v && !used.has(`${definiteness}:${personIdx}:${v}`)) unused.push(`${tense} ${definiteness} ${PRONOUNS[personIdx]} -${v}`);
          }
        });
      }
    }
    // Some variants exist for verbs outside the 20 tables (segítettem-style
    // linking-vowel pasts, the assimilated definite forms after s/sz/z, the
    // -ol/-öl 2sg after sibilants); they stay listed as realistic distractors.
    // Every other ending must be reachable from the real tables.
    const optional = /-(ott|ett|ött)|-(s|z|sz)(a|uk|ük|átok|ák)$|-(ol|öl)$/;
    const unexpected = unused.filter((u) => !optional.test(u));
    expect(unexpected).toEqual([]);
  });
});

describe('possessiveItems', () => {
  it('decomposes every hand-written possessive form', () => {
    const items = possessiveItems();
    expect(items).toHaveLength(POSSESSIVE_NOUNS.length * PRONOUNS.length);
    for (const item of items) expect(item.stem + item.ending).toBe(item.answer);
  });

  it('shows the changed stem for kutya / név / idő', () => {
    const items = possessiveItems();
    expect(items.find((i) => i.answer === 'kutyám')).toMatchObject({ stem: 'kutyá', ending: 'm' });
    expect(items.find((i) => i.answer === 'nevem')).toMatchObject({ stem: 'nev', ending: 'em' });
    expect(items.find((i) => i.answer === 'ideje')).toMatchObject({ stem: 'ide', ending: 'je' });
    expect(items.find((i) => i.answer === 'anyja')).toMatchObject({ stem: 'any', ending: 'ja' });
  });

  it('every possessive ending listed is used by at least one noun', () => {
    const used = new Set(possessiveItems().map((i) => `${i.personIdx}:${i.ending}`));
    POSSESSIVE_ENDINGS.forEach((variants, personIdx) => {
      for (const v of variants) expect(used.has(`${personIdx}:${v}`), `${PRONOUNS[personIdx]} -${v}`).toBe(true);
    });
  });
});

describe('caseItems', () => {
  it('decomposes every hand-written case form', () => {
    const expected = CASE_NOUNS.reduce((n, noun) => n + Object.keys(noun.cases).length, 0);
    const items = caseItems();
    expect(items).toHaveLength(expected);
    for (const item of items) {
      expect(item.stem + item.ending).toBe(item.answer);
      expect(CASES[item.caseKey].variants).toContain(item.ending);
    }
  });

  it('every case key used by a noun exists and every case has at least one example', () => {
    for (const noun of CASE_NOUNS) {
      for (const k of Object.keys(noun.cases)) expect(CASES[k], `${noun.noun} ${k}`).toBeTruthy();
    }
    const items = caseItems();
    for (const k of Object.keys(CASES)) expect(items.some((i) => i.caseKey === k), k).toBe(true);
  });

  it('covers the classic pairs: Budapesten vs Londonban, tejjel, kenyeret', () => {
    const answers = caseItems().map((i) => i.answer);
    for (const a of ['Budapesten', 'Londonban', 'tejjel', 'kenyeret', 'asztalon', 'orvoshoz', 'ötkor']) {
      expect(answers).toContain(a);
    }
  });
});

describe('endingChoices', () => {
  it('always includes the right ending, never duplicates, never a second accepted spelling', () => {
    for (const topic of TOPICS) {
      for (const item of topicItems(topic.id)) {
        const choices = endingChoices(item, { rng: seededRng() });
        expect(choices).toContain(item.ending);
        expect(new Set(choices).size).toBe(choices.length);
        expect(choices.length).toBeGreaterThanOrEqual(2);
        expect(choices.length).toBeLessThanOrEqual(4);
        const alsoRight = choices.filter((e) => e !== item.ending && item.answers.includes(item.stem + e));
        expect(alsoRight, item.answer).toEqual([]);
      }
    }
  });

  it('prefers the harmony siblings as distractors', () => {
    const item = topicItems('verbs-present').find((i) => i.answer === 'tanulok');
    const choices = endingChoices(item, { rng: seededRng() });
    expect(choices).toEqual(expect.arrayContaining(['ok', 'ek', 'ök']));
  });
});

describe('explain and buildSuffixDrill', () => {
  it('explains the harmony and appends the note', () => {
    const item = topicItems('cases').find((i) => i.answer === 'tejjel');
    expect(explain(item)).toContain('front vowels');
    expect(explain(item)).toContain('tejjel');
  });

  it('builds a drill across several topics with choices and explanations', () => {
    const drill = buildSuffixDrill({ topics: ['verbs-present', 'possessive', 'cases'], count: 12, rng: seededRng(2) });
    expect(drill).toHaveLength(12);
    expect(new Set(drill.map((q) => q.key)).size).toBe(12);
    for (const q of drill) {
      expect(q.choices).toContain(q.ending);
      expect(q.explanation).toBeTruthy();
      expect(q.prompt).toContain(q.stem);
    }
    expect(new Set(drill.map((q) => q.topic)).size).toBeGreaterThan(1);
  });

  it('lists five topics and every verb is represented somewhere', () => {
    expect(TOPICS.map((t) => t.id)).toEqual(['verbs-present', 'verbs-past', 'verbs-conditional', 'possessive', 'cases']);
    const stems = new Set(verbItems('present').map((i) => i.stem));
    const missing = verbs.filter((v) => !stems.has(verbStem(v))).map((v) => v.inf);
    // Even "to be" has one regular cell (van + nak = vannak); every verb gets asked about.
    expect(missing).toEqual([]);
  });
});
