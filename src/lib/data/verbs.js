/**
 * Present-tense conjugation tables for common verbs.
 * Every form is hand-written — Hungarian morphology (sibilant assimilation,
 * -ik verbs, irregulars) is not safely generatable.
 *
 * Each verb: inf (infinitive), en, harmony ('back'|'front'|'front-rounded'),
 * ik (is it an -ik verb), pron (rough phonetic guide for the infinitive),
 * indefinite/definite: arrays of 6 forms in PRONOUNS order. A cell is a
 * string, or an array of accepted variants (first one is the display form).
 * Intransitive verbs have no definite conjugation: definite is null.
 */
export const PRONOUNS = ['én', 'te', 'ő', 'mi', 'ti', 'ők'];

export const verbs = [
  {
    inf: 'tanulni',
    en: 'to learn',
    harmony: 'back',
    ik: false,
    pron: 'TAW-nool-nee',
    indefinite: ['tanulok', 'tanulsz', 'tanul', 'tanulunk', 'tanultok', 'tanulnak'],
    definite: ['tanulom', 'tanulod', 'tanulja', 'tanuljuk', 'tanuljátok', 'tanulják']
  },
  {
    inf: 'beszélni',
    en: 'to speak',
    harmony: 'front',
    ik: false,
    pron: 'BE-sayl-nee',
    indefinite: ['beszélek', 'beszélsz', 'beszél', 'beszélünk', 'beszéltek', 'beszélnek'],
    definite: ['beszélem', 'beszéled', 'beszéli', 'beszéljük', 'beszélitek', 'beszélik']
  },
  {
    inf: 'kérni',
    en: 'to ask for',
    harmony: 'front',
    ik: false,
    pron: 'KAYR-nee',
    indefinite: ['kérek', 'kérsz', 'kér', 'kérünk', 'kértek', 'kérnek'],
    definite: ['kérem', 'kéred', 'kéri', 'kérjük', 'kéritek', 'kérik']
  },
  {
    inf: 'tudni',
    en: 'to know / can',
    harmony: 'back',
    ik: false,
    pron: 'TOOD-nee',
    indefinite: ['tudok', 'tudsz', 'tud', 'tudunk', 'tudtok', 'tudnak'],
    definite: ['tudom', 'tudod', 'tudja', 'tudjuk', 'tudjátok', 'tudják']
  },
  {
    inf: 'látni',
    en: 'to see',
    harmony: 'back',
    ik: false,
    pron: 'LAHT-nee',
    indefinite: ['látok', 'látsz', 'lát', 'látunk', 'láttok', 'látnak'],
    definite: ['látom', 'látod', 'látja', 'látjuk', 'látjátok', 'látják']
  },
  {
    inf: 'szeretni',
    en: 'to love / like',
    harmony: 'front',
    ik: false,
    pron: 'SE-ret-nee',
    indefinite: ['szeretek', 'szeretsz', 'szeret', 'szeretünk', 'szerettek', 'szeretnek'],
    definite: ['szeretem', 'szereted', 'szereti', 'szeretjük', 'szeretitek', 'szeretik']
  },
  {
    inf: 'olvasni',
    en: 'to read',
    harmony: 'back',
    ik: false,
    pron: 'OL-vawsh-nee',
    // Sibilant stem: te takes -ol (olvasol), and definite -j- assimilates: olvassa.
    indefinite: ['olvasok', 'olvasol', 'olvas', 'olvasunk', 'olvastok', 'olvasnak'],
    definite: ['olvasom', 'olvasod', 'olvassa', 'olvassuk', 'olvassátok', 'olvassák']
  },
  {
    inf: 'írni',
    en: 'to write',
    harmony: 'back',
    ik: false,
    pron: 'EER-nee',
    indefinite: ['írok', 'írsz', 'ír', 'írunk', 'írtok', 'írnak'],
    definite: ['írom', 'írod', 'írja', 'írjuk', 'írjátok', 'írják']
  },
  {
    inf: 'várni',
    en: 'to wait (for)',
    harmony: 'back',
    ik: false,
    pron: 'VAHR-nee',
    indefinite: ['várok', 'vársz', 'vár', 'várunk', 'vártok', 'várnak'],
    definite: ['várom', 'várod', 'várja', 'várjuk', 'várjátok', 'várják']
  },
  {
    inf: 'főzni',
    en: 'to cook',
    harmony: 'front-rounded',
    ik: false,
    pron: 'FUHZ-nee',
    // Sibilant stem: te takes -öl (főzöl), and definite -j- assimilates: főzzük.
    indefinite: ['főzök', 'főzöl', 'főz', 'főzünk', 'főztök', 'főznek'],
    definite: ['főzöm', 'főzöd', 'főzi', 'főzzük', 'főzitek', 'főzik']
  },
  {
    inf: 'enni',
    en: 'to eat',
    harmony: 'front',
    ik: true,
    pron: 'EN-nee',
    // Irregular -ik verb (eszik). Traditional 1sg eszem; colloquial eszek also accepted.
    indefinite: [['eszem', 'eszek'], 'eszel', 'eszik', 'eszünk', 'esztek', 'esznek'],
    definite: ['eszem', 'eszed', 'eszi', 'esszük', 'eszitek', 'eszik']
  },
  {
    inf: 'inni',
    en: 'to drink',
    harmony: 'back',
    ik: true,
    pron: 'IN-nee',
    // Irregular -ik verb (iszik). Traditional 1sg iszom; colloquial iszok also accepted.
    indefinite: [['iszom', 'iszok'], 'iszol', 'iszik', 'iszunk', 'isztok', 'isznak'],
    definite: ['iszom', 'iszod', 'issza', 'isszuk', 'isszátok', 'isszák']
  },
  {
    inf: 'lakni',
    en: 'to live (somewhere)',
    harmony: 'back',
    ik: true,
    pron: 'LAWK-nee',
    // -ik verb (lakik), intransitive — no definite conjugation.
    indefinite: [['lakom', 'lakok'], 'laksz', 'lakik', 'lakunk', 'laktok', 'laknak'],
    definite: null
  },
  {
    inf: 'menni',
    en: 'to go',
    harmony: 'front',
    ik: false,
    pron: 'MEN-nee',
    // Irregular (megy), intransitive — no definite conjugation.
    indefinite: ['megyek', 'mész', 'megy', 'megyünk', 'mentek', 'mennek'],
    definite: null
  }
];

export function getVerb(inf) {
  return verbs.find((v) => v.inf === inf) || null;
}

/** Dictionary (3rd person singular indefinite) form — how Hungarian verbs are usually cited. */
export function dictionaryForm(verb) {
  const cell = verb.indefinite[2];
  return Array.isArray(cell) ? cell[0] : cell;
}
