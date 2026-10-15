/**
 * Hand-authored material for the Suffix Lab: the inventories of endings a
 * learner chooses between, plus nouns with their full possessive and case
 * forms. Everything here is written out by hand because Hungarian suffixing
 * (vowel harmony, linking vowels, stem changes like név → nevem, the v of
 * -val assimilating) is not safely generatable.
 *
 * Verb forms are NOT listed here: the Suffix Lab reads them from the verb
 * tables in verbs.js and only asks about cells that are literally
 * stem + one of the endings below (so irregulars like megy → mész are left
 * to the verb trainer, where they belong).
 */

/** Harmony labels used in explanations. */
export const HARMONY_LABEL = {
  back: 'back vowels (a, á, o, ó, u, ú)',
  front: 'front vowels (e, é, i, í)',
  'front-rounded': 'front rounded vowels (ö, ő, ü, ű)'
};

/**
 * Personal endings of the verb, per tense and conjugation, in PRONOUNS order
 * (én, te, ő, mi, ti, ők). Every variant a learner might reach for is listed,
 * including the linking-vowel past forms (olvas + ott, olvas + ottam) and the
 * assimilated definite forms after s/sz/z (olvas + sa, főz + zük).
 */
export const VERB_ENDINGS = {
  present: {
    indefinite: [
      ['ok', 'ek', 'ök'],
      ['sz', 'ol', 'el', 'öl'],
      [''],
      ['unk', 'ünk'],
      ['tok', 'tek', 'tök'],
      ['nak', 'nek']
    ],
    definite: [
      ['om', 'em', 'öm'],
      ['od', 'ed', 'öd'],
      ['ja', 'i', 'sa', 'za', 'sza'],
      ['juk', 'jük', 'suk', 'zuk', 'zük', 'szuk', 'szük'],
      ['játok', 'itek', 'sátok', 'zátok', 'szátok'],
      ['ják', 'ik', 'sák', 'zák', 'szák']
    ]
  },
  past: {
    indefinite: [
      ['tam', 'tem', 'ottam', 'ettem', 'öttem'],
      ['tál', 'tél', 'ottál', 'ettél', 'öttél'],
      ['t', 'ott', 'ett', 'ött'],
      ['tunk', 'tünk', 'ottunk', 'ettünk', 'öttünk'],
      ['tatok', 'tetek', 'ottatok', 'ettetek', 'öttetek'],
      ['tak', 'tek', 'ottak', 'ettek', 'öttek']
    ],
    definite: [
      ['tam', 'tem', 'ottam', 'ettem', 'öttem'],
      ['tad', 'ted', 'ottad', 'etted', 'ötted'],
      ['ta', 'te', 'otta', 'ette', 'ötte'],
      ['tuk', 'tük', 'ottuk', 'ettük', 'öttük'],
      ['tátok', 'tétek', 'ottátok', 'ettétek', 'öttétek'],
      ['ták', 'ték', 'ották', 'ették', 'ötték']
    ]
  },
  conditional: {
    indefinite: [
      ['nék'],
      ['nál', 'nél'],
      ['na', 'ne'],
      ['nánk', 'nénk'],
      ['nátok', 'nétek'],
      ['nának', 'nének']
    ],
    definite: [
      ['nám', 'ném'],
      ['nád', 'néd'],
      ['ná', 'né'],
      ['nánk', 'nénk'],
      ['nátok', 'nétek'],
      ['nák', 'nék']
    ]
  }
};

/** Possessive endings ("my, your, his/her, our, your (pl.), their"), in PRONOUNS order. */
export const POSSESSIVE_ENDINGS = [
  ['m', 'om', 'am', 'em', 'öm'],
  ['d', 'od', 'ad', 'ed', 'öd'],
  ['a', 'e', 'ja', 'je'],
  ['nk', 'unk', 'ünk'],
  ['tok', 'tek', 'tök', 'otok', 'atok', 'etek', 'ötök'],
  ['uk', 'ük', 'juk', 'jük']
];

/**
 * Nouns with all six possessive forms (én, te, ő, mi, ti, ők). `stems` lists
 * every shape the noun takes before an ending (kutya → kutyá-, név → nev-,
 * idő → ide-), so the lab can show "stem + ___" honestly. `note` is an
 * optional one-liner shown with the answer.
 */
export const POSSESSIVE_NOUNS = [
  { noun: 'ház', en: 'house', harmony: 'back', forms: ['házam', 'házad', 'háza', 'házunk', 'házatok', 'házuk'] },
  { noun: 'kert', en: 'garden', harmony: 'front', forms: ['kertem', 'kerted', 'kertje', 'kertünk', 'kertetek', 'kertjük'] },
  { noun: 'barát', en: 'friend', harmony: 'back', forms: ['barátom', 'barátod', 'barátja', 'barátunk', 'barátotok', 'barátjuk'] },
  { noun: 'család', en: 'family', harmony: 'back', forms: ['családom', 'családod', 'családja', 'családunk', 'családotok', 'családjuk'] },
  { noun: 'gyerek', en: 'child', harmony: 'front', forms: ['gyerekem', 'gyereked', 'gyereke', 'gyerekünk', 'gyereketek', 'gyerekük'] },
  { noun: 'könyv', en: 'book', harmony: 'front-rounded', forms: ['könyvem', 'könyved', 'könyve', 'könyvünk', 'könyvetek', 'könyvük'] },
  { noun: 'sör', en: 'beer', harmony: 'front-rounded', forms: ['söröm', 'söröd', 'söre', 'sörünk', 'sörötök', 'sörük'] },
  { noun: 'lakás', en: 'flat', harmony: 'back', forms: ['lakásom', 'lakásod', 'lakása', 'lakásunk', 'lakásotok', 'lakásuk'] },
  { noun: 'tanár', en: 'teacher', harmony: 'back', forms: ['tanárom', 'tanárod', 'tanára', 'tanárunk', 'tanárotok', 'tanáruk'] },
  { noun: 'telefon', en: 'phone', harmony: 'back', forms: ['telefonom', 'telefonod', 'telefonja', 'telefonunk', 'telefonotok', 'telefonjuk'] },
  { noun: 'kulcs', en: 'key', harmony: 'back', forms: ['kulcsom', 'kulcsod', 'kulcsa', 'kulcsunk', 'kulcsotok', 'kulcsuk'] },
  {
    noun: 'autó', en: 'car', harmony: 'back',
    forms: ['autóm', 'autód', 'autója', 'autónk', 'autótok', 'autójuk'],
    note: 'After a vowel the ending needs no linking vowel: autó + m.'
  },
  {
    noun: 'kávé', en: 'coffee', harmony: 'back',
    forms: ['kávém', 'kávéd', 'kávéja', 'kávénk', 'kávétok', 'kávéjuk'],
    note: 'kávé has an á, so it counts as a back-vowel word despite the é.'
  },
  {
    noun: 'kutya', en: 'dog', harmony: 'back', stems: ['kutyá'],
    forms: ['kutyám', 'kutyád', 'kutyája', 'kutyánk', 'kutyátok', 'kutyájuk'],
    note: 'A final short a lengthens to á before any ending: kutya → kutyá-.'
  },
  {
    noun: 'szoba', en: 'room', harmony: 'back', stems: ['szobá'],
    forms: ['szobám', 'szobád', 'szobája', 'szobánk', 'szobátok', 'szobájuk'],
    note: 'A final short a lengthens to á before any ending: szoba → szobá-.'
  },
  {
    noun: 'munka', en: 'work / job', harmony: 'back', stems: ['munká'],
    forms: ['munkám', 'munkád', 'munkája', 'munkánk', 'munkátok', 'munkájuk'],
    note: 'A final short a lengthens to á before any ending: munka → munká-.'
  },
  {
    noun: 'anya', en: 'mother', harmony: 'back', stems: ['anyá', 'any'],
    forms: ['anyám', 'anyád', 'anyja', 'anyánk', 'anyátok', 'anyjuk'],
    note: 'Irregular: his/her mother is anyja, their mother anyjuk — the a drops out.'
  },
  {
    noun: 'apa', en: 'father', harmony: 'back', stems: ['apá', 'ap'],
    forms: ['apám', 'apád', 'apja', 'apánk', 'apátok', 'apjuk'],
    note: 'Irregular: his/her father is apja, their father apjuk — the a drops out.'
  },
  {
    noun: 'zene', en: 'music', harmony: 'front', stems: ['zené'],
    forms: ['zeném', 'zenéd', 'zenéje', 'zenénk', 'zenétek', 'zenéjük'],
    note: 'A final short e lengthens to é before any ending: zene → zené-.'
  },
  {
    noun: 'név', en: 'name', harmony: 'front', stems: ['nev'],
    forms: ['nevem', 'neved', 'neve', 'nevünk', 'nevetek', 'nevük'],
    note: 'The long é shortens before an ending: név → nev-. (A nevem Anna.)'
  },
  {
    noun: 'idő', en: 'time', harmony: 'front-rounded', stems: ['idő', 'ide'],
    forms: ['időm', 'időd', 'ideje', 'időnk', 'időtök', 'idejük'],
    note: 'Irregular in the 3rd person: ideje, idejük (the ő shortens to e).'
  }
];

/**
 * Case endings by meaning. `variants` is everything a learner might reach
 * for; `label` is how the meaning is shown in a prompt.
 */
export const CASES = {
  in: { label: 'in', variants: ['ban', 'ben'] },
  into: { label: 'into', variants: ['ba', 'be'] },
  'out-of': { label: 'out of', variants: ['ból', 'ből'] },
  on: { label: 'on', variants: ['n', 'on', 'en', 'ön'] },
  onto: { label: 'onto', variants: ['ra', 're'] },
  off: { label: 'off / from (a surface)', variants: ['ról', 'ről'] },
  at: { label: 'at / by', variants: ['nál', 'nél'] },
  towards: { label: 'to (a person / place)', variants: ['hoz', 'hez', 'höz'] },
  from: { label: 'from (a person / place)', variants: ['tól', 'től'] },
  with: { label: 'with', variants: ['val', 'vel', 'jel', 'ral', 'rel', 'sal', 'szal', 'szel', 'tal', 'tel', 'lal', 'kal', 'nal', 'mal', 'zal', 'zel'] },
  for: { label: 'to / for (dative)', variants: ['nak', 'nek'] },
  object: { label: 'as a direct object', variants: ['t', 'ot', 'at', 'et', 'öt'] },
  until: { label: 'until / as far as', variants: ['ig'] },
  'at-time': { label: "at (o'clock)", variants: ['kor'] }
};

/**
 * Nouns with case forms. Each item: noun, en, harmony, stems (optional, as
 * above), cases: { caseKey: form }, note (optional, shown with every case of
 * the noun) and notes (optional, { caseKey: text } shown only for that case
 * and taking precedence over note).
 */
export const CASE_NOUNS = [
  { noun: 'ház', en: 'house', harmony: 'back', cases: { in: 'házban', into: 'házba', 'out-of': 'házból', object: 'házat', for: 'háznak', at: 'háznál' } },
  { noun: 'kert', en: 'garden', harmony: 'front', cases: { in: 'kertben', into: 'kertbe', 'out-of': 'kertből', object: 'kertet', for: 'kertnek' } },
  { noun: 'asztal', en: 'table', harmony: 'back', cases: { on: 'asztalon', onto: 'asztalra', off: 'asztalról', at: 'asztalnál', object: 'asztalt' } },
  { noun: 'szék', en: 'chair', harmony: 'front', cases: { on: 'széken', onto: 'székre', off: 'székről', object: 'széket' } },
  { noun: 'bolt', en: 'shop', harmony: 'back', cases: { in: 'boltban', into: 'boltba', 'out-of': 'boltból', object: 'boltot' } },
  {
    noun: 'iskola', en: 'school', harmony: 'back', stems: ['iskolá'],
    cases: { in: 'iskolában', into: 'iskolába', 'out-of': 'iskolából', object: 'iskolát' },
    note: 'A final short a lengthens to á before an ending: iskola → iskolá-.'
  },
  { noun: 'mozi', en: 'cinema', harmony: 'back', cases: { in: 'moziban', into: 'moziba', 'out-of': 'moziból' }, note: 'mozi has only an o and an i: the o makes it a back-vowel word.' },
  { noun: 'város', en: 'city', harmony: 'back', cases: { in: 'városban', into: 'városba', 'out-of': 'városból', object: 'várost' } },
  { noun: 'piac', en: 'market', harmony: 'back', cases: { on: 'piacon', onto: 'piacra', off: 'piacról' }, note: 'Markets and squares are "on", not "in": a piacon.' },
  {
    noun: 'utca', en: 'street', harmony: 'back', stems: ['utcá'],
    cases: { on: 'utcán', onto: 'utcára', off: 'utcáról' },
    note: 'Streets are "on": az utcán. The final a lengthens to á.'
  },
  { noun: 'busz', en: 'bus', harmony: 'back', cases: { on: 'buszon', onto: 'buszra', off: 'buszról' }, note: 'You travel ON a bus: buszon. (With a bus is busszal — the v of -val assimilates and the double digraph is written ssz.)' },
  { noun: 'vonat', en: 'train', harmony: 'back', cases: { on: 'vonaton', onto: 'vonatra', with: 'vonattal' }, note: 'You travel ON a train: vonaton.', notes: { with: '-val after vonat: the v assimilates to t → vonattal.' } },
  { noun: 'villamos', en: 'tram', harmony: 'back', cases: { on: 'villamoson', onto: 'villamosra', with: 'villamossal' }, note: 'You travel ON a tram: villamoson.', notes: { with: '-val after villamos: the v assimilates to s → villamossal.' } },
  { noun: 'Budapest', en: 'Budapest', harmony: 'front', cases: { on: 'Budapesten', onto: 'Budapestre', off: 'Budapestről', object: 'Budapestet' }, note: 'Hungarian cities take -n/-on/-en, not -ban: Budapesten.' },
  { noun: 'Szeged', en: 'Szeged', harmony: 'front', cases: { on: 'Szegeden', onto: 'Szegedre', off: 'Szegedről' }, note: 'Hungarian cities take -n/-on/-en: Szegeden.' },
  { noun: 'Pécs', en: 'Pécs', harmony: 'front', cases: { on: 'Pécsen', onto: 'Pécsre', off: 'Pécsről' }, note: 'Hungarian cities take -n/-on/-en: Pécsen.' },
  { noun: 'London', en: 'London', harmony: 'back', cases: { in: 'Londonban', into: 'Londonba', 'out-of': 'Londonból' }, note: 'Foreign cities take -ban/-ben: Londonban.' },
  { noun: 'Berlin', en: 'Berlin', harmony: 'front', cases: { in: 'Berlinben', into: 'Berlinbe', 'out-of': 'Berlinből' }, note: 'Foreign cities take -ban/-ben: Berlinben.' },
  { noun: 'orvos', en: 'doctor', harmony: 'back', cases: { towards: 'orvoshoz', at: 'orvosnál', from: 'orvostól', for: 'orvosnak', object: 'orvost' } },
  { noun: 'tanár', en: 'teacher', harmony: 'back', cases: { towards: 'tanárhoz', at: 'tanárnál', from: 'tanártól', for: 'tanárnak', object: 'tanárt' } },
  { noun: 'gyerek', en: 'child', harmony: 'front', cases: { towards: 'gyerekhez', at: 'gyereknél', from: 'gyerektől', for: 'gyereknek', object: 'gyereket' } },
  { noun: 'barát', en: 'friend', harmony: 'back', cases: { towards: 'baráthoz', at: 'barátnál', from: 'baráttól', for: 'barátnak', object: 'barátot', with: 'baráttal' }, notes: { with: '-val after barát: the v assimilates to t → baráttal.' } },
  { noun: 'Anna', en: 'Anna', harmony: 'back', stems: ['Anná'], cases: { for: 'Annának', towards: 'Annához', at: 'Annánál', from: 'Annától', with: 'Annával', object: 'Annát' }, note: 'The final a lengthens: Anna → Anná-.', notes: { with: 'After a vowel -val keeps its v: Annával.' } },
  { noun: 'Péter', en: 'Péter', harmony: 'front', cases: { for: 'Péternek', towards: 'Péterhez', at: 'Péternél', from: 'Pétertől', with: 'Péterrel', object: 'Pétert' }, notes: { with: '-vel after Péter: the v assimilates to r → Péterrel.' } },
  { noun: 'folyó', en: 'river', harmony: 'back', cases: { at: 'folyónál', in: 'folyóban', into: 'folyóba', object: 'folyót' } },
  { noun: 'tej', en: 'milk', harmony: 'front', cases: { with: 'tejjel', object: 'tejet' }, notes: { with: '-vel after tej: the v assimilates to j → tejjel.' } },
  { noun: 'cukor', en: 'sugar', harmony: 'back', stems: ['cukr'], cases: { with: 'cukorral', object: 'cukrot' }, notes: { with: '-val after cukor: the v assimilates to r → cukorral.', object: 'As an object the second o drops out: cukor → cukrot.' } },
  { noun: 'sör', en: 'beer', harmony: 'front-rounded', cases: { object: 'sört', with: 'sörrel' }, notes: { with: '-vel after sör: the v assimilates to r → sörrel.' } },
  { noun: 'kávé', en: 'coffee', harmony: 'back', cases: { object: 'kávét', with: 'kávéval' }, note: 'kávé has an á, so it counts as a back-vowel word despite the é.', notes: { with: 'After a vowel -val keeps its v: kávéval.' } },
  { noun: 'alma', en: 'apple', harmony: 'back', stems: ['almá'], cases: { object: 'almát', with: 'almával' }, note: 'The final a lengthens: alma → almá-.' },
  {
    noun: 'kenyér', en: 'bread', harmony: 'front', stems: ['kenyer'],
    cases: { object: 'kenyeret', with: 'kenyérrel' },
    notes: { object: 'As an object the é shortens: kenyér → kenyeret.', with: '-vel after kenyér: the v assimilates to r → kenyérrel.' }
  },
  { noun: 'víz', en: 'water', harmony: 'front', stems: ['viz'], cases: { object: 'vizet', in: 'vízben', with: 'vízzel' }, notes: { object: 'As an object the í shortens: víz → vizet.', with: '-vel after víz: the v assimilates to z → vízzel.' } },
  { noun: 'könyv', en: 'book', harmony: 'front-rounded', cases: { object: 'könyvet', in: 'könyvben', with: 'könyvvel' }, notes: { with: 'könyv already ends in v, so -vel simply doubles it: könyvvel.' } },
  { noun: 'híd', en: 'bridge', harmony: 'back', stems: ['hid'], cases: { on: 'hídon', object: 'hidat' }, note: 'híd is one of a handful of í-words that take BACK endings: hídon, hidat.' },
  { noun: 'öt', en: 'five', harmony: 'front-rounded', cases: { 'at-time': 'ötkor', until: 'ötig', object: 'ötöt' } },
  { noun: 'hét', en: 'seven', harmony: 'front', cases: { 'at-time': 'hétkor', until: 'hétig' } },
  { noun: 'tíz', en: 'ten', harmony: 'front', cases: { 'at-time': 'tízkor', until: 'tízig' } },
  { noun: 'este', en: 'evening', harmony: 'front', stems: ['est'], cases: { until: 'estig' }, note: 'The final e drops before -ig: estig (until the evening).' },
  { noun: 'reggel', en: 'morning', harmony: 'front', cases: { until: 'reggelig' } },
  { noun: 'tér', en: 'square', harmony: 'front', cases: { until: 'térig', on: 'téren', onto: 'térre' }, note: 'Squares are "on": a téren.' }
];
