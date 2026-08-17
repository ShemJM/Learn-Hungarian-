/**
 * Conjugation tables for common verbs: present, past, conditional, imperative.
 * Every form is hand-written — Hungarian morphology (sibilant assimilation,
 * -ik verbs, irregulars) is not safely generatable.
 *
 * Each verb: inf (infinitive), en, harmony ('back'|'front'|'front-rounded'),
 * ik (is it an -ik verb), pron (rough phonetic guide for the infinitive),
 * indefinite/definite: arrays of 6 forms in PRONOUNS order. A cell is a
 * string, or an array of accepted variants (first one is the display form).
 * Intransitive verbs have no definite conjugation: definite is null.
 * past/conditional/imperative: { indefinite, definite } with the same cell
 * conventions; definite is null exactly when the present definite is null.
 *
 * Conditional: the 1sg indefinite ending is ALWAYS -nék, even for back-vowel
 * verbs (tudnék, adnék, innék) — the mood's famous exception. Definite endings
 * are -nám/-nád/-ná/-nánk/-nátok/-nák (back) and -ném/-néd/-né/-nénk/-nétek/
 * -nék (front) — so a front verb's definite 3pl is spelled like its indefinite
 * 1sg (szeretnék), a real ambiguity, not a typo.
 *
 * Imperative display policy: non-ik verbs show the short 2sg first with the
 * long -jál/-jél form accepted (['menj','menjél']); -ik verbs show the long
 * form first. 2sg definite shows the fused form first (['add','adjad']).
 * For -ik verbs the everyday -jak/-jon 1sg/3sg forms are displayed and the
 * formal ikes -jam/-jék variants accepted.
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
    },
    conditional: {
      // Both the lenn- and the older voln- stems are current (Ha gazdag lennék/volnék…).
      indefinite: [
        ['lennék', 'volnék'],
        ['lennél', 'volnál'],
        ['lenne', 'volna'],
        ['lennénk', 'volnánk'],
        ['lennétek', 'volnátok'],
        ['lennének', 'volnának']
      ],
      definite: null
    },
    imperative: {
      // Irregular legy- stem; the short 2sg légy survives in set phrases (Légy jó!).
      indefinite: ['legyek', ['legyél', 'légy'], 'legyen', 'legyünk', 'legyetek', 'legyenek'],
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
    },
    conditional: {
      // 1sg is tanulnék, not *tanulnák — back verbs still take -nék in the 1sg.
      indefinite: ['tanulnék', 'tanulnál', 'tanulna', 'tanulnánk', 'tanulnátok', 'tanulnának'],
      definite: ['tanulnám', 'tanulnád', 'tanulná', 'tanulnánk', 'tanulnátok', 'tanulnák']
    },
    imperative: {
      indefinite: ['tanuljak', ['tanulj', 'tanuljál'], 'tanuljon', 'tanuljunk', 'tanuljatok', 'tanuljanak'],
      // 3sg onward are spelled like the present definite (tanulja…) — a real Hungarian ambiguity.
      definite: ['tanuljam', ['tanuld', 'tanuljad'], 'tanulja', 'tanuljuk', 'tanuljátok', 'tanulják']
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
    },
    conditional: {
      indefinite: ['beszélnék', 'beszélnél', 'beszélne', 'beszélnénk', 'beszélnétek', 'beszélnének'],
      // Definite 3pl beszélnék = indefinite 1sg, by rule.
      definite: ['beszélném', 'beszélnéd', 'beszélné', 'beszélnénk', 'beszélnétek', 'beszélnék']
    },
    imperative: {
      indefinite: ['beszéljek', ['beszélj', 'beszéljél'], 'beszéljen', 'beszéljünk', 'beszéljetek', 'beszéljenek'],
      definite: ['beszéljem', ['beszéld', 'beszéljed'], 'beszélje', 'beszéljük', 'beszéljétek', 'beszéljék']
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
    },
    conditional: {
      indefinite: ['kérnék', 'kérnél', 'kérne', 'kérnénk', 'kérnétek', 'kérnének'],
      definite: ['kérném', 'kérnéd', 'kérné', 'kérnénk', 'kérnétek', 'kérnék']
    },
    imperative: {
      indefinite: ['kérjek', ['kérj', 'kérjél'], 'kérjen', 'kérjünk', 'kérjetek', 'kérjenek'],
      definite: ['kérjem', ['kérd', 'kérjed'], 'kérje', 'kérjük', 'kérjétek', 'kérjék']
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
    },
    conditional: {
      indefinite: ['tudnék', 'tudnál', 'tudna', 'tudnánk', 'tudnátok', 'tudnának'],
      definite: ['tudnám', 'tudnád', 'tudná', 'tudnánk', 'tudnátok', 'tudnák']
    },
    imperative: {
      // d + j stays written dj (pronounced ggy): tudj.
      indefinite: ['tudjak', ['tudj', 'tudjál'], 'tudjon', 'tudjunk', 'tudjatok', 'tudjanak'],
      definite: ['tudjam', ['tudd', 'tudjad'], 'tudja', 'tudjuk', 'tudjátok', 'tudják']
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
    },
    conditional: {
      indefinite: ['látnék', 'látnál', 'látna', 'látnánk', 'látnátok', 'látnának'],
      definite: ['látnám', 'látnád', 'látná', 'látnánk', 'látnátok', 'látnák']
    },
    imperative: {
      // Long vowel + t: t + j → ss (lássak); 2sg definite is the irregular fused lásd.
      indefinite: ['lássak', ['láss', 'lássál'], 'lásson', 'lássunk', 'lássatok', 'lássanak'],
      // lássuk = "let's see", everyday idiom.
      definite: ['lássam', ['lásd', 'lássad'], 'lássa', 'lássuk', 'lássátok', 'lássák']
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
    },
    conditional: {
      // szeretnék/szeretném — THE polite request forms ("I would like…").
      indefinite: ['szeretnék', 'szeretnél', 'szeretne', 'szeretnénk', 'szeretnétek', 'szeretnének'],
      definite: ['szeretném', 'szeretnéd', 'szeretné', 'szeretnénk', 'szeretnétek', 'szeretnék']
    },
    imperative: {
      // Short vowel + t: t + j → ss (szeressek).
      indefinite: ['szeressek', ['szeress', 'szeressél'], 'szeressen', 'szeressünk', 'szeressetek', 'szeressenek'],
      definite: ['szeressem', ['szeresd', 'szeressed'], 'szeresse', 'szeressük', 'szeressétek', 'szeressék']
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
    },
    conditional: {
      indefinite: ['olvasnék', 'olvasnál', 'olvasna', 'olvasnánk', 'olvasnátok', 'olvasnának'],
      definite: ['olvasnám', 'olvasnád', 'olvasná', 'olvasnánk', 'olvasnátok', 'olvasnák']
    },
    imperative: {
      // Sibilant s stem: j assimilates, s doubles: olvass.
      indefinite: ['olvassak', ['olvass', 'olvassál'], 'olvasson', 'olvassunk', 'olvassatok', 'olvassanak'],
      definite: ['olvassam', ['olvasd', 'olvassad'], 'olvassa', 'olvassuk', 'olvassátok', 'olvassák']
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
    },
    conditional: {
      indefinite: ['írnék', 'írnál', 'írna', 'írnánk', 'írnátok', 'írnának'],
      definite: ['írnám', 'írnád', 'írná', 'írnánk', 'írnátok', 'írnák']
    },
    imperative: {
      indefinite: ['írjak', ['írj', 'írjál'], 'írjon', 'írjunk', 'írjatok', 'írjanak'],
      // Írd le! — write it down.
      definite: ['írjam', ['írd', 'írjad'], 'írja', 'írjuk', 'írjátok', 'írják']
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
    },
    conditional: {
      indefinite: ['várnék', 'várnál', 'várna', 'várnánk', 'várnátok', 'várnának'],
      definite: ['várnám', 'várnád', 'várná', 'várnánk', 'várnátok', 'várnák']
    },
    imperative: {
      indefinite: ['várjak', ['várj', 'várjál'], 'várjon', 'várjunk', 'várjatok', 'várjanak'],
      // Várd meg! — wait for it/him.
      definite: ['várjam', ['várd', 'várjad'], 'várja', 'várjuk', 'várjátok', 'várják']
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
    },
    conditional: {
      // The conditional has no rounded variant — front-rounded verbs take plain front -né.
      indefinite: ['főznék', 'főznél', 'főzne', 'főznénk', 'főznétek', 'főznének'],
      definite: ['főzném', 'főznéd', 'főzné', 'főznénk', 'főznétek', 'főznék']
    },
    imperative: {
      // Sibilant z stem: j assimilates, z doubles: főzz; 3sg rounded -zön.
      indefinite: ['főzzek', ['főzz', 'főzzél'], 'főzzön', 'főzzünk', 'főzzetek', 'főzzenek'],
      definite: ['főzzem', ['főzd', 'főzzed'], 'főzze', 'főzzük', 'főzzétek', 'főzzék']
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
    },
    conditional: {
      // Conditional from the enn- stem (like the infinitive).
      indefinite: ['ennék', 'ennél', 'enne', 'ennénk', 'ennétek', 'ennének'],
      definite: ['enném', 'ennéd', 'enné', 'ennénk', 'ennétek', 'ennék']
    },
    imperative: {
      // Irregular egy- stem; formal ikes egyem/egyék accepted.
      indefinite: [['egyek', 'egyem'], 'egyél', ['egyen', 'egyék'], 'együnk', 'egyetek', 'egyenek'],
      // Edd meg! — eat it up.
      definite: ['egyem', ['edd', 'egyed'], 'egye', 'együk', 'egyétek', 'egyék']
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
    },
    conditional: {
      // Back verb, yet 1sg is innék — the -nék exception's flagship example.
      indefinite: ['innék', 'innál', 'inna', 'innánk', 'innátok', 'innának'],
      definite: ['innám', 'innád', 'inná', 'innánk', 'innátok', 'innák']
    },
    imperative: {
      // Irregular igy- stem; formal ikes igyam/igyék accepted.
      indefinite: [['igyak', 'igyam'], 'igyál', ['igyon', 'igyék'], 'igyunk', 'igyatok', 'igyanak'],
      // Idd meg! — drink it up.
      definite: ['igyam', ['idd', 'igyad'], 'igya', 'igyuk', 'igyátok', 'igyák']
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
    },
    conditional: {
      indefinite: ['laknék', 'laknál', 'lakna', 'laknánk', 'laknátok', 'laknának'],
      definite: null
    },
    imperative: {
      // -ik verb: long 2sg displayed; archaic ikes lakjam/lakjék no longer in living use.
      indefinite: ['lakjak', ['lakjál', 'lakj'], 'lakjon', 'lakjunk', 'lakjatok', 'lakjanak'],
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
    },
    conditional: {
      indefinite: ['mennék', 'mennél', 'menne', 'mennénk', 'mennétek', 'mennének'],
      definite: null
    },
    imperative: {
      indefinite: ['menjek', ['menj', 'menjél'], 'menjen', 'menjünk', 'menjetek', 'menjenek'],
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
    },
    conditional: {
      indefinite: ['jönnék', 'jönnél', 'jönne', 'jönnénk', 'jönnétek', 'jönnének'],
      definite: null
    },
    imperative: {
      // Irregular jöjj- stem, with suppletive gyere/gyerünk/gyertek dominating everyday speech.
      indefinite: [
        'jöjjek',
        ['gyere', 'jöjj', 'jöjjél'],
        'jöjjön',
        ['jöjjünk', 'gyerünk'],
        ['gyertek', 'jöjjetek'],
        'jöjjenek'
      ],
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
    },
    conditional: {
      indefinite: ['dolgoznék', 'dolgoznál', 'dolgozna', 'dolgoznánk', 'dolgoznátok', 'dolgoznának'],
      definite: null
    },
    imperative: {
      // z doubles (dolgozz-); everyday -zak/-zon displayed, formal ikes -zam/-zék accepted.
      indefinite: [
        ['dolgozzak', 'dolgozzam'],
        ['dolgozzál', 'dolgozz'],
        ['dolgozzon', 'dolgozzék'],
        'dolgozzunk',
        'dolgozzatok',
        'dolgozzanak'
      ],
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
    },
    conditional: {
      indefinite: ['csinálnék', 'csinálnál', 'csinálna', 'csinálnánk', 'csinálnátok', 'csinálnának'],
      definite: ['csinálnám', 'csinálnád', 'csinálná', 'csinálnánk', 'csinálnátok', 'csinálnák']
    },
    imperative: {
      indefinite: ['csináljak', ['csinálj', 'csináljál'], 'csináljon', 'csináljunk', 'csináljatok', 'csináljanak'],
      // Csináld! — do it!
      definite: ['csináljam', ['csináld', 'csináljad'], 'csinálja', 'csináljuk', 'csináljátok', 'csinálják']
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
    },
    conditional: {
      // Conditional from the venn- stem (like the infinitive).
      indefinite: ['vennék', 'vennél', 'venne', 'vennénk', 'vennétek', 'vennének'],
      definite: ['venném', 'vennéd', 'venné', 'vennénk', 'vennétek', 'vennék']
    },
    imperative: {
      // Irregular vegy- stem; literary short 2sg végy accepted.
      indefinite: ['vegyek', ['vegyél', 'végy'], 'vegyen', 'vegyünk', 'vegyetek', 'vegyenek'],
      // Vedd meg! — buy it.
      definite: ['vegyem', ['vedd', 'vegyed'], 'vegye', 'vegyük', 'vegyétek', 'vegyék']
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
    },
    conditional: {
      indefinite: ['adnék', 'adnál', 'adna', 'adnánk', 'adnátok', 'adnának'],
      definite: ['adnám', 'adnád', 'adná', 'adnánk', 'adnátok', 'adnák']
    },
    imperative: {
      indefinite: ['adjak', ['adj', 'adjál'], 'adjon', 'adjunk', 'adjatok', 'adjanak'],
      // Add ide! — give it here.
      definite: ['adjam', ['add', 'adjad'], 'adja', 'adjuk', 'adjátok', 'adják']
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
