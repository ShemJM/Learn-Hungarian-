/**
 * Conjugation tables for common verbs, present and past tense.
 * Every form is hand-written — Hungarian morphology (sibilant assimilation,
 * -ik verbs, irregulars) is not safely generatable.
 *
 * Each verb: inf (infinitive), en, harmony ('back'|'front'|'front-rounded'),
 * ik (is it an -ik verb), pron (rough phonetic guide for the infinitive),
 * indefinite/definite: arrays of 6 forms in PRONOUNS order. A cell is a
 * string, or an array of accepted variants (first one is the display form).
 * Intransitive verbs have no definite conjugation: definite is null.
 * past: { indefinite, definite } with the same cell conventions; definite is
 * null exactly when the present definite is null.
 */
export const PRONOUNS = ['én', 'te', 'ő', 'mi', 'ti', 'ők'];

export const verbs = [
  {
    inf: 'lenni',
    en: 'to be',
    harmony: 'back',
    ik: false,
    pron: 'LEN-nee',
    // Fully irregular: present from the vagy- stem, past from vol-.
    indefinite: ['vagyok', 'vagy', 'van', 'vagyunk', 'vagytok', 'vannak'],
    definite: null,
    past: {
      indefinite: ['voltam', 'voltál', 'volt', 'voltunk', 'voltatok', 'voltak'],
      definite: null
    }
  },
  {
    inf: 'tanulni',
    en: 'to learn',
    harmony: 'back',
    ik: false,
    pron: 'TAW-nool-nee',
    indefinite: ['tanulok', 'tanulsz', 'tanul', 'tanulunk', 'tanultok', 'tanulnak'],
    definite: ['tanulom', 'tanulod', 'tanulja', 'tanuljuk', 'tanuljátok', 'tanulják'],
    past: {
      indefinite: ['tanultam', 'tanultál', 'tanult', 'tanultunk', 'tanultatok', 'tanultak'],
      definite: ['tanultam', 'tanultad', 'tanulta', 'tanultuk', 'tanultátok', 'tanulták']
    }
  },
  {
    inf: 'beszélni',
    en: 'to speak',
    harmony: 'front',
    ik: false,
    pron: 'BE-sayl-nee',
    indefinite: ['beszélek', 'beszélsz', 'beszél', 'beszélünk', 'beszéltek', 'beszélnek'],
    definite: ['beszélem', 'beszéled', 'beszéli', 'beszéljük', 'beszélitek', 'beszélik'],
    past: {
      indefinite: ['beszéltem', 'beszéltél', 'beszélt', 'beszéltünk', 'beszéltetek', 'beszéltek'],
      definite: ['beszéltem', 'beszélted', 'beszélte', 'beszéltük', 'beszéltétek', 'beszélték']
    }
  },
  {
    inf: 'kérni',
    en: 'to ask for',
    harmony: 'front',
    ik: false,
    pron: 'KAYR-nee',
    indefinite: ['kérek', 'kérsz', 'kér', 'kérünk', 'kértek', 'kérnek'],
    definite: ['kérem', 'kéred', 'kéri', 'kérjük', 'kéritek', 'kérik'],
    past: {
      indefinite: ['kértem', 'kértél', 'kért', 'kértünk', 'kértetek', 'kértek'],
      definite: ['kértem', 'kérted', 'kérte', 'kértük', 'kértétek', 'kérték']
    }
  },
  {
    inf: 'tudni',
    en: 'to know / can',
    harmony: 'back',
    ik: false,
    pron: 'TOOD-nee',
    indefinite: ['tudok', 'tudsz', 'tud', 'tudunk', 'tudtok', 'tudnak'],
    definite: ['tudom', 'tudod', 'tudja', 'tudjuk', 'tudjátok', 'tudják'],
    past: {
      // 3sg takes the linking vowel: tudott.
      indefinite: ['tudtam', 'tudtál', 'tudott', 'tudtunk', 'tudtatok', 'tudtak'],
      definite: ['tudtam', 'tudtad', 'tudta', 'tudtuk', 'tudtátok', 'tudták']
    }
  },
  {
    inf: 'látni',
    en: 'to see',
    harmony: 'back',
    ik: false,
    pron: 'LAHT-nee',
    indefinite: ['látok', 'látsz', 'lát', 'látunk', 'láttok', 'látnak'],
    definite: ['látom', 'látod', 'látja', 'látjuk', 'látjátok', 'látják'],
    past: {
      // Stem-final t doubles (lát + t), 3sg takes the linking vowel: látott.
      indefinite: ['láttam', 'láttál', 'látott', 'láttunk', 'láttatok', 'láttak'],
      definite: ['láttam', 'láttad', 'látta', 'láttuk', 'láttátok', 'látták']
    }
  },
  {
    inf: 'szeretni',
    en: 'to love / like',
    harmony: 'front',
    ik: false,
    pron: 'SE-ret-nee',
    indefinite: ['szeretek', 'szeretsz', 'szeret', 'szeretünk', 'szerettek', 'szeretnek'],
    definite: ['szeretem', 'szereted', 'szereti', 'szeretjük', 'szeretitek', 'szeretik'],
    past: {
      // Stem-final t doubles throughout (szeret + t), 3sg linking vowel: szeretett.
      indefinite: ['szerettem', 'szerettél', 'szeretett', 'szerettünk', 'szerettetek', 'szerettek'],
      definite: ['szerettem', 'szeretted', 'szerette', 'szerettük', 'szerettétek', 'szerették']
    }
  },
  {
    inf: 'olvasni',
    en: 'to read',
    harmony: 'back',
    ik: false,
    pron: 'OL-vawsh-nee',
    // Sibilant stem: te takes -ol (olvasol), and definite -j- assimilates: olvassa.
    indefinite: ['olvasok', 'olvasol', 'olvas', 'olvasunk', 'olvastok', 'olvasnak'],
    definite: ['olvasom', 'olvasod', 'olvassa', 'olvassuk', 'olvassátok', 'olvassák'],
    past: {
      // 3sg linking vowel: olvasott.
      indefinite: ['olvastam', 'olvastál', 'olvasott', 'olvastunk', 'olvastatok', 'olvastak'],
      definite: ['olvastam', 'olvastad', 'olvasta', 'olvastuk', 'olvastátok', 'olvasták']
    }
  },
  {
    inf: 'írni',
    en: 'to write',
    harmony: 'back',
    ik: false,
    pron: 'EER-nee',
    indefinite: ['írok', 'írsz', 'ír', 'írunk', 'írtok', 'írnak'],
    definite: ['írom', 'írod', 'írja', 'írjuk', 'írjátok', 'írják'],
    past: {
      indefinite: ['írtam', 'írtál', 'írt', 'írtunk', 'írtatok', 'írtak'],
      definite: ['írtam', 'írtad', 'írta', 'írtuk', 'írtátok', 'írták']
    }
  },
  {
    inf: 'várni',
    en: 'to wait (for)',
    harmony: 'back',
    ik: false,
    pron: 'VAHR-nee',
    indefinite: ['várok', 'vársz', 'vár', 'várunk', 'vártok', 'várnak'],
    definite: ['várom', 'várod', 'várja', 'várjuk', 'várjátok', 'várják'],
    past: {
      indefinite: ['vártam', 'vártál', 'várt', 'vártunk', 'vártatok', 'vártak'],
      definite: ['vártam', 'vártad', 'várta', 'vártuk', 'vártátok', 'várták']
    }
  },
  {
    inf: 'főzni',
    en: 'to cook',
    harmony: 'front-rounded',
    ik: false,
    pron: 'FUHZ-nee',
    // Sibilant stem: te takes -öl (főzöl), and definite -j- assimilates: főzzük.
    indefinite: ['főzök', 'főzöl', 'főz', 'főzünk', 'főztök', 'főznek'],
    definite: ['főzöm', 'főzöd', 'főzi', 'főzzük', 'főzitek', 'főzik'],
    past: {
      // 3sg linking vowel (rounded): főzött.
      indefinite: ['főztem', 'főztél', 'főzött', 'főztünk', 'főztetek', 'főztek'],
      definite: ['főztem', 'főzted', 'főzte', 'főztük', 'főztétek', 'főzték']
    }
  },
  {
    inf: 'enni',
    en: 'to eat',
    harmony: 'front',
    ik: true,
    pron: 'EN-nee',
    // Irregular -ik verb (eszik). Traditional 1sg eszem; colloquial eszek also accepted.
    indefinite: [['eszem', 'eszek'], 'eszel', 'eszik', 'eszünk', 'esztek', 'esznek'],
    definite: ['eszem', 'eszed', 'eszi', 'esszük', 'eszitek', 'eszik'],
    past: {
      // Irregular past stem ett-, 3sg evett (v-stem).
      indefinite: ['ettem', 'ettél', 'evett', 'ettünk', 'ettetek', 'ettek'],
      definite: ['ettem', 'etted', 'ette', 'ettük', 'ettétek', 'ették']
    }
  },
  {
    inf: 'inni',
    en: 'to drink',
    harmony: 'back',
    ik: true,
    pron: 'IN-nee',
    // Irregular -ik verb (iszik). Traditional 1sg iszom; colloquial iszok also accepted.
    indefinite: [['iszom', 'iszok'], 'iszol', 'iszik', 'iszunk', 'isztok', 'isznak'],
    definite: ['iszom', 'iszod', 'issza', 'isszuk', 'isszátok', 'isszák'],
    past: {
      // Irregular past stem itt-, 3sg ivott (v-stem).
      indefinite: ['ittam', 'ittál', 'ivott', 'ittunk', 'ittatok', 'ittak'],
      definite: ['ittam', 'ittad', 'itta', 'ittuk', 'ittátok', 'itták']
    }
  },
  {
    inf: 'lakni',
    en: 'to live (somewhere)',
    harmony: 'back',
    ik: true,
    pron: 'LAWK-nee',
    // -ik verb (lakik), intransitive — no definite conjugation.
    indefinite: [['lakom', 'lakok'], 'laksz', 'lakik', 'lakunk', 'laktok', 'laknak'],
    definite: null,
    past: {
      // 3sg linking vowel: lakott.
      indefinite: ['laktam', 'laktál', 'lakott', 'laktunk', 'laktatok', 'laktak'],
      definite: null
    }
  },
  {
    inf: 'menni',
    en: 'to go',
    harmony: 'front',
    ik: false,
    pron: 'MEN-nee',
    // Irregular (megy), intransitive — no definite conjugation.
    indefinite: ['megyek', 'mész', 'megy', 'megyünk', 'mentek', 'mennek'],
    definite: null,
    past: {
      // Past from the men- stem: mentem.
      indefinite: ['mentem', 'mentél', 'ment', 'mentünk', 'mentetek', 'mentek'],
      definite: null
    }
  },
  {
    inf: 'jönni',
    en: 'to come',
    harmony: 'front-rounded',
    ik: false,
    pron: 'YUHN-nee',
    // Fully irregular: jöv-/jön-/jöt- stems (note the double s in jössz). Intransitive.
    indefinite: ['jövök', 'jössz', 'jön', 'jövünk', 'jöttök', 'jönnek'],
    definite: null,
    past: {
      indefinite: ['jöttem', 'jöttél', 'jött', 'jöttünk', 'jöttetek', 'jöttek'],
      definite: null
    }
  },
  {
    inf: 'dolgozni',
    en: 'to work',
    harmony: 'back',
    ik: true,
    pron: 'DOL-goz-nee',
    // -ik verb (dolgozik): standard 1sg dolgozom, colloquial dolgozok; sibilant z stem gives te -ol. Intransitive.
    indefinite: [['dolgozom', 'dolgozok'], 'dolgozol', 'dolgozik', 'dolgozunk', 'dolgoztok', 'dolgoznak'],
    definite: null,
    past: {
      // 3sg linking vowel: dolgozott.
      indefinite: ['dolgoztam', 'dolgoztál', 'dolgozott', 'dolgoztunk', 'dolgoztatok', 'dolgoztak'],
      definite: null
    }
  },
  {
    inf: 'csinálni',
    en: 'to do / make',
    harmony: 'back',
    ik: false,
    pron: 'CHEE-nahl-nee',
    indefinite: ['csinálok', 'csinálsz', 'csinál', 'csinálunk', 'csináltok', 'csinálnak'],
    definite: ['csinálom', 'csinálod', 'csinálja', 'csináljuk', 'csináljátok', 'csinálják'],
    past: {
      indefinite: ['csináltam', 'csináltál', 'csinált', 'csináltunk', 'csináltatok', 'csináltak'],
      definite: ['csináltam', 'csináltad', 'csinálta', 'csináltuk', 'csináltátok', 'csinálták']
    }
  },
  {
    inf: 'venni',
    en: 'to buy / take',
    harmony: 'front',
    ik: false,
    pron: 'VEN-nee',
    // Irregular v-stem: present vesz-, past vett-; definite 1pl doubles the sz: vesszük.
    indefinite: ['veszek', 'veszel', 'vesz', 'veszünk', 'vesztek', 'vesznek'],
    definite: ['veszem', 'veszed', 'veszi', 'vesszük', 'veszitek', 'veszik'],
    past: {
      indefinite: ['vettem', 'vettél', 'vett', 'vettünk', 'vettetek', 'vettek'],
      definite: ['vettem', 'vetted', 'vette', 'vettük', 'vettétek', 'vették']
    }
  },
  {
    inf: 'adni',
    en: 'to give',
    harmony: 'back',
    ik: false,
    pron: 'AWD-nee',
    // Definite -j- assimilates in speech but is written (adja); past 3sg takes the linking vowel: adott.
    indefinite: ['adok', 'adsz', 'ad', 'adunk', 'adtok', 'adnak'],
    definite: ['adom', 'adod', 'adja', 'adjuk', 'adjátok', 'adják'],
    past: {
      indefinite: ['adtam', 'adtál', 'adott', 'adtunk', 'adtatok', 'adtak'],
      definite: ['adtam', 'adtad', 'adta', 'adtuk', 'adtátok', 'adták']
    }
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
