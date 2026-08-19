/**
 * Content for the "Citizenship Interview Prep" section — the personal-details
 * conversation asked during the simplified naturalisation (honosítás) interview:
 * who you are, where you live, your job, and your family.
 *
 * Sentence-builder helpers deliberately avoid needing to compute vowel harmony
 * on user-typed free text (names, town names): they use possessive/invariant
 * constructions ("A fiam neve ...", "Lakóhelyem: ...") so any input is safe.
 */

export const generalTips = [
  'Answer in full sentences, not single words — the interviewer wants to hear you build a sentence, not just recognise it.',
  'Know your numbers solidly (1–100+): they show up in your age, your years in Hungary, your children\'s ages and your company size.',
  'Learn the "-ként" ending ("as a...", e.g. tanárként = as a teacher) and "-nál/-nél" ("at", e.g. egy cégnél = at a company) — they cover most job questions.',
  'Prepare your own real answers in advance from the templates below, and say them out loud a few times before the interview.',
  'Short and correct beats long and risky: "Két gyermekem van" is a safer, stronger answer than a longer sentence you might trip over.',
  'If you don\'t catch a question, it is fine to ask: "Elnézést, megismételné, kérem?" (Sorry, could you repeat that, please?)'
];

export const interviewCategories = [
  {
    id: 'personal',
    icon: '🙋',
    title: 'Introducing Yourself',
    freePrompt: 'Introduce yourself out loud — your name, age, and where you are from.',
    questions: [
      {
        id: 'personal-name',
        hu: 'Mi a neve?',
        en: 'What is your name?',
        tip: 'Either "A nevem ..." (My name is...) or simply "... vagyok" (I am ...) works.',
        answers: [
          { hu: 'A nevem John Smith.', en: 'My name is John Smith.' },
          { hu: 'John Smith vagyok.', en: 'I am John Smith.' }
        ]
      },
      {
        id: 'personal-age',
        hu: 'Hány éves?',
        en: 'How old are you?',
        tip: '[number] + éves + vagyok. The word "éves" never changes, whatever the number.',
        answers: [
          { hu: 'Harminckét éves vagyok.', en: 'I am thirty-two years old.' },
          { hu: 'Negyvenöt éves vagyok.', en: 'I am forty-five years old.' }
        ]
      },
      {
        id: 'personal-origin',
        hu: 'Honnan jött?',
        en: 'Where are you from?',
        tip: 'Country name + "-ból/-ből jöttem" (I came from...), or nationality + "vagyok".',
        answers: [
          { hu: 'Angliából jöttem.', en: 'I came from England.' },
          { hu: 'Brit vagyok.', en: 'I am British.' }
        ]
      }
    ]
  },
  {
    id: 'residence',
    icon: '🏠',
    title: 'Where You Live',
    freePrompt: 'Say out loud where you live, how long you have lived there, and which part of the country it is in.',
    questions: [
      {
        id: 'residence-where',
        hu: 'Hol lakik? / Hol él?',
        en: 'Where do you live?',
        tip: 'Budapest is irregular: "Budapesten" (not Budapestben). Elsewhere, say which part of the country using "az ország ... részén" — the ending on "részén" never changes, only the direction word before it does.',
        answers: [
          { hu: 'Budapesten lakom.', en: 'I live in Budapest.' },
          { hu: 'Magyarországon élek, az ország délnyugati részén.', en: 'I live in Hungary, in the southwestern part of the country.' },
          { hu: 'Az ország északi részén élek, Miskolc közelében.', en: 'I live in the northern part of the country, near Miskolc.' }
        ]
      },
      {
        id: 'residence-since',
        hu: 'Mióta él Magyarországon?',
        en: 'How long have you lived in Hungary?',
        tip: '[number of years] + "éve" (for ... years) + "élek itt / élek Magyarországon".',
        answers: [
          { hu: 'Öt éve élek Magyarországon.', en: 'I have lived in Hungary for five years.' },
          { hu: 'Tíz éve élek itt.', en: 'I have lived here for ten years.' }
        ]
      },
      {
        id: 'residence-town',
        hu: 'Melyik megyében / melyik városban lakik?',
        en: 'Which county / which town do you live in?',
        tip: 'Safe fallback for any town name: "Lakóhelyem: ___" (My place of residence: ___) sidesteps having to work out the correct vowel-harmony ending.',
        answers: [
          { hu: 'Lakóhelyem: Szeged.', en: 'My place of residence: Szeged.' },
          { hu: 'Pécsett lakom, ami az ország délnyugati részén van.', en: 'I live in Pécs, which is in the southwest of the country.' }
        ]
      }
    ]
  },
  {
    id: 'work',
    icon: '💼',
    title: 'Your Job',
    freePrompt: 'Describe your job out loud — what you do, where you work, and roughly how many people work there.',
    questions: [
      {
        id: 'work-what',
        hu: 'Mivel foglalkozik? / Mi a foglalkozása?',
        en: 'What do you do for work?',
        tip: 'Job title + "-ként dolgozom" (I work as a...). "-ként" is invariant — it never changes for vowel harmony, so it is one of the easiest endings to use safely.',
        answers: [
          { hu: 'Szoftverfejlesztőként dolgozom.', en: 'I work as a software developer.' },
          { hu: 'Tanár vagyok.', en: 'I am a teacher.' },
          { hu: 'Jelenleg nem dolgozom, nyugdíjas vagyok.', en: 'I am not currently working, I am retired.' }
        ]
      },
      {
        id: 'work-workplace',
        hu: 'Hol dolgozik?',
        en: 'Where do you work?',
        tip: '"Cég" (company) always takes "-nél": egy [típus] cégnél dolgozom. For a school/hospital/office use "-ban/-ben": iskolában, kórházban, irodában.',
        answers: [
          { hu: 'Egy gyártó cégnél dolgozom.', en: 'I work at a manufacturing company.' },
          { hu: 'Egy iskolában tanítok.', en: 'I teach at a school.' }
        ]
      },
      {
        id: 'work-size',
        hu: 'Hány embert foglalkoztat a cég? / Hányan dolgoznak ott?',
        en: 'How many people does the company employ? / How many people work there?',
        tip: '"Körülbelül [szám] embert foglalkoztat" works for any number. For small teams you can also say "[szám]-an dolgozunk" (ketten, hárman, tízen... — the "there are N of us" ending).',
        answers: [
          { hu: 'Körülbelül kétszáz embert foglalkoztat.', en: 'It employs about two hundred people.' },
          { hu: 'Csak tízen dolgozunk, kis cég vagyunk.', en: 'Only ten of us work there, we are a small company.' }
        ]
      }
    ]
  },
  {
    id: 'family',
    icon: '👨‍👩‍👧‍👦',
    title: 'Family & Children',
    freePrompt: 'Talk out loud about your family — whether you are married, whether you have children, and their names and ages.',
    questions: [
      {
        id: 'family-married',
        hu: 'Nős / férjnél van? Van családja?',
        en: 'Are you married? Do you have a family?',
        tip: '"Nős" is used by men, "férjnél van" by women, for "I am married". "Egyedülálló" = single, "elvált" = divorced, "özvegy" = widowed.',
        answers: [
          { hu: 'Nős vagyok.', en: 'I am married. (said by a man)' },
          { hu: 'Férjnél vagyok.', en: 'I am married. (said by a woman)' },
          { hu: 'Egyedülálló vagyok.', en: 'I am single.' }
        ]
      },
      {
        id: 'family-children',
        hu: 'Van gyereke? Hány gyereke van?',
        en: 'Do you have children? How many?',
        tip: 'The child noun stays singular even after a number: "Két gyermekem van" (not gyermekeim). For none, use "Nincs gyermekem".',
        answers: [
          { hu: 'Nincs gyermekem.', en: 'I have no children.' },
          { hu: 'Egy gyermekem van.', en: 'I have one child.' },
          { hu: 'Két gyermekem van.', en: 'I have two children.' },
          { hu: 'Három gyermekem van.', en: 'I have three children.' }
        ]
      },
      {
        id: 'family-kids-names',
        hu: 'Hogy hívják őket? Hány évesek?',
        en: 'What are they called? How old are they?',
        tip: 'Use "A fiam neve ..." (my son\'s name is) / "A lányom neve ..." (my daughter\'s name is) — this avoids putting a vowel-harmony ending directly on the name itself.',
        answers: [
          { hu: 'A fiam neve Tamás, nyolc éves.', en: 'My son\'s name is Tamás, he is eight.' },
          { hu: 'A lányom neve Zsófia, öt éves. A fiam neve Bence, tíz éves.', en: 'My daughter\'s name is Zsófia, she is five. My son\'s name is Bence, he is ten.' }
        ]
      }
    ]
  },
  {
    id: 'citizenship',
    icon: '🇭🇺',
    title: 'Hungary & Citizenship',
    freePrompt: 'Explain out loud, in your own words, why you want to become a Hungarian citizen.',
    questions: [
      {
        id: 'citizenship-why',
        hu: 'Miért szeretne magyar állampolgár lenni?',
        en: 'Why do you want to become a Hungarian citizen?',
        tip: 'Keep it honest and simple — a short, true sentence is stronger than a long memorised one.',
        answers: [
          { hu: 'Mert itt élek és dolgozom, és teljes jogú tagja szeretnék lenni a társadalomnak.', en: 'Because I live and work here, and I want to be a full member of society.' },
          { hu: 'Mert szeretem Magyarországot, és itt szeretnék maradni.', en: 'Because I love Hungary and want to stay here.' },
          { hu: 'Mert magyar felmenőim vannak.', en: 'Because I have Hungarian ancestors.' }
        ]
      },
      {
        id: 'citizenship-likes',
        hu: 'Mit szeret Magyarországon?',
        en: 'What do you like about Hungary?',
        tip: '"Szeretem a ..." (I love the ...) + a noun is the safest frame — the ending sits on the article, not on the word you choose.',
        answers: [
          { hu: 'Szeretem a magyar konyhát és a nyugodt életet.', en: 'I love Hungarian cuisine and the calm way of life.' },
          { hu: 'Szeretem az embereket és a szép városokat.', en: 'I love the people and the beautiful towns.' },
          { hu: 'Szeretem a Balatont és a magyar borokat.', en: 'I love Lake Balaton and Hungarian wines.' }
        ]
      },
      {
        id: 'citizenship-relatives',
        hu: 'Vannak magyar rokonai? Van magyar felmenője?',
        en: 'Do you have Hungarian relatives? Do you have a Hungarian ancestor?',
        tip: '"Van" / "Nincs" answers this on its own; add the relative afterwards. Family words take "-m" for "my": nagyapám (my grandfather), nagyanyám (my grandmother), feleségem (my wife), férjem (my husband).',
        answers: [
          { hu: 'Igen, a nagyapám magyar volt.', en: 'Yes, my grandfather was Hungarian.' },
          { hu: 'A feleségem magyar.', en: 'My wife is Hungarian.' },
          { hu: 'Nincsenek magyar rokonaim, de itt élek nyolc éve.', en: 'I have no Hungarian relatives, but I have lived here for eight years.' }
        ]
      }
    ]
  },
  {
    id: 'daily',
    icon: '🕘',
    title: 'Everyday Life & Free Time',
    freePrompt: 'Describe an ordinary day out loud — when you get up, what you do, and what you do in the evening.',
    questions: [
      {
        id: 'daily-routine',
        hu: 'Mit csinál egy átlagos napon?',
        en: 'What do you do on an ordinary day?',
        tip: 'Chain simple present-tense verbs with "aztán" (then): felkelek (I get up), dolgozom (I work), hazamegyek (I go home), főzök (I cook), pihenek (I rest).',
        answers: [
          { hu: 'Reggel hatkor felkelek, aztán dolgozom. Este otthon vagyok a családommal.', en: 'I get up at six in the morning, then I work. In the evening I am at home with my family.' },
          { hu: 'Reggel kávézom, aztán bemegyek az irodába. Délután sportolok.', en: 'In the morning I have coffee, then I go into the office. In the afternoon I do sport.' }
        ]
      },
      {
        id: 'daily-hobbies',
        hu: 'Mit szeret csinálni a szabadidejében?',
        en: 'What do you like doing in your free time?',
        tip: '"Szeretek" + an infinitive ending in -ni: olvasni (to read), főzni (to cook), kertészkedni (to garden), sétálni (to walk), zenét hallgatni (to listen to music).',
        answers: [
          { hu: 'Szeretek olvasni és kirándulni.', en: 'I like reading and hiking.' },
          { hu: 'Szabadidőmben főzök és zenét hallgatok.', en: 'In my free time I cook and listen to music.' }
        ]
      },
      {
        id: 'daily-shopping',
        hu: 'Hol szokott vásárolni?',
        en: 'Where do you usually shop?',
        tip: 'Places take "-ban/-ben" (in) or "-on/-en/-ön" (at/on): a boltban (in the shop), a piacon (at the market), a bevásárlóközpontban (in the shopping centre).',
        answers: [
          { hu: 'A közeli boltban vásárolok.', en: 'I shop at the nearby shop.' },
          { hu: 'Hétvégén a piacon veszek zöldséget és gyümölcsöt.', en: 'At the weekend I buy vegetables and fruit at the market.' }
        ]
      }
    ]
  },
  {
    id: 'language',
    icon: '📚',
    title: 'Learning Hungarian',
    freePrompt: 'Say out loud how long you have been learning Hungarian, where you learn, and what you find hardest.',
    questions: [
      {
        id: 'language-since',
        hu: 'Mióta tanul magyarul?',
        en: 'How long have you been learning Hungarian?',
        tip: 'Same frame as your years in Hungary: [number] + "éve tanulok magyarul". For months: "[number] hónapja".',
        answers: [
          { hu: 'Két éve tanulok magyarul.', en: 'I have been learning Hungarian for two years.' },
          { hu: 'Nyolc hónapja tanulok magyarul.', en: 'I have been learning Hungarian for eight months.' }
        ]
      },
      {
        id: 'language-where',
        hu: 'Hol tanul magyarul? Ki tanítja?',
        en: 'Where do you learn Hungarian? Who teaches you?',
        tip: '"Tanárral tanulok" (I study with a teacher — "-val/-vel" = with), "egyedül tanulok" (I study alone), "online tanulok" (I study online).',
        answers: [
          { hu: 'Tanárral tanulok, hetente egyszer.', en: 'I study with a teacher, once a week.' },
          { hu: 'Egyedül tanulok, könyvből és online.', en: 'I study alone, from a book and online.' }
        ]
      },
      {
        id: 'language-hard',
        hu: 'Nehéz a magyar nyelv? Mi a legnehezebb?',
        en: 'Is Hungarian difficult? What is the hardest part?',
        tip: 'A short honest answer is perfect here, and it is a friendly question — the interviewer is making conversation, not testing you.',
        answers: [
          { hu: 'Igen, nehéz, de nagyon szeretem.', en: 'Yes, it is difficult, but I love it very much.' },
          { hu: 'A ragozás nehéz, de a kiejtés könnyebb.', en: 'The endings are hard, but the pronunciation is easier.' }
        ]
      }
    ]
  }
];

/** Every workbook question, flattened, each tagged with the category it came from. */
export function allInterviewQuestions() {
  return interviewCategories.flatMap((cat) =>
    cat.questions.map((q) => ({ ...q, categoryId: cat.id, categoryTitle: cat.title }))
  );
}

// --- Sentence builder: Job & Workplace ---

export const jobOptions = [
  { id: 'dev', label: 'Software developer', hu: 'szoftverfejlesztő', en: 'software developer' },
  { id: 'teacher', label: 'Teacher', hu: 'tanár', en: 'teacher' },
  { id: 'engineer', label: 'Engineer', hu: 'mérnök', en: 'engineer' },
  { id: 'doctor', label: 'Doctor', hu: 'orvos', en: 'doctor' },
  { id: 'nurse', label: 'Nurse', hu: 'ápoló', en: 'nurse' },
  { id: 'accountant', label: 'Accountant', hu: 'könyvelő', en: 'accountant' },
  { id: 'sales', label: 'Salesperson', hu: 'eladó', en: 'salesperson' },
  { id: 'waiter', label: 'Waiter / Waitress', hu: 'pincér', en: 'waiter/waitress' },
  { id: 'driver', label: 'Driver', hu: 'sofőr', en: 'driver' },
  { id: 'manager', label: 'Manager', hu: 'vezető', en: 'manager' },
  { id: 'cook', label: 'Cook / Chef', hu: 'szakács', en: 'cook' },
  { id: 'builder', label: 'Builder', hu: 'építőmunkás', en: 'builder' }
];

export const companyTypeOptions = [
  { id: 'manufacturing', label: 'Manufacturing', hu: 'gyártó', en: 'manufacturing' },
  { id: 'service', label: 'Service', hu: 'szolgáltató', en: 'service' },
  { id: 'it', label: 'IT', hu: 'informatikai', en: 'IT' },
  { id: 'trading', label: 'Trading / Commercial', hu: 'kereskedelmi', en: 'trading' },
  { id: 'construction', label: 'Construction', hu: 'építőipari', en: 'construction' },
  { id: 'healthcare', label: 'Healthcare', hu: 'egészségügyi', en: 'healthcare' },
  { id: 'education', label: 'Education', hu: 'oktatási', en: 'education' },
  { id: 'financial', label: 'Financial', hu: 'pénzügyi', en: 'financial' },
  { id: 'agriculture', label: 'Agricultural', hu: 'mezőgazdasági', en: 'agricultural' }
];

export const companySizeOptions = [
  { id: 'ten', label: '~10 people', hu: 'tíz', en: 'ten' },
  { id: 'fifty', label: '~50 people', hu: 'ötven', en: 'fifty' },
  { id: 'hundred', label: '~100 people', hu: 'száz', en: 'a hundred' },
  { id: 'twohundred', label: '~200 people', hu: 'kétszáz', en: 'two hundred' },
  { id: 'fivehundred', label: '~500 people', hu: 'ötszáz', en: 'five hundred' },
  { id: 'thousand', label: '~1000+ people', hu: 'ezer', en: 'a thousand' }
];

function cap(s) {
  return s.charAt(0).toUpperCase() + s.slice(1);
}

export function buildJobSentence(jobId, companyTypeId, sizeId) {
  const job = jobOptions.find((j) => j.id === jobId) || jobOptions[0];
  const ct = companyTypeOptions.find((c) => c.id === companyTypeId) || companyTypeOptions[0];
  const sz = companySizeOptions.find((s) => s.id === sizeId) || companySizeOptions[0];
  return {
    hu: `${cap(job.hu)}ként dolgozom egy ${ct.hu} cégnél. Körülbelül ${sz.hu} ember dolgozik ott.`,
    en: `I work as a ${job.en} at a ${ct.en} company. About ${sz.en} people work there.`
  };
}

// --- Sentence builder: Where You Live ---

export const regionOptions = [
  { id: 'budapest', label: 'Budapest', hu: 'Budapesten', en: 'in Budapest' },
  { id: 'north', label: 'North', hu: 'északi', en: 'northern' },
  { id: 'south', label: 'South', hu: 'déli', en: 'southern' },
  { id: 'east', label: 'East', hu: 'keleti', en: 'eastern' },
  { id: 'west', label: 'West', hu: 'nyugati', en: 'western' },
  { id: 'southwest', label: 'Southwest', hu: 'délnyugati', en: 'southwestern' },
  { id: 'southeast', label: 'Southeast', hu: 'délkeleti', en: 'southeastern' },
  { id: 'northwest', label: 'Northwest', hu: 'északnyugati', en: 'northwestern' },
  { id: 'northeast', label: 'Northeast', hu: 'északkeleti', en: 'northeastern' },
  { id: 'central', label: 'Central Hungary', hu: 'középső', en: 'central' }
];

export function buildResidenceSentence(regionId, cityName) {
  const r = regionOptions.find((x) => x.id === regionId) || regionOptions[0];
  let hu, en;
  if (r.id === 'budapest') {
    hu = 'Budapesten élek.';
    en = 'I live in Budapest.';
  } else {
    hu = `Magyarországon élek, az ország ${r.hu} részén.`;
    en = `I live in Hungary, in the ${r.en} part of the country.`;
  }
  const city = (cityName || '').trim();
  if (city) {
    hu += ` Lakóhelyem: ${city}.`;
    en += ` My town/city: ${city}.`;
  }
  return { hu, en };
}

// --- Sentence builder: Family & Children ---

export const childGenderOptions = [
  { id: 'son', label: 'Son', hu: 'fiam', en: "son's" },
  { id: 'daughter', label: 'Daughter', hu: 'lányom', en: "daughter's" },
  { id: 'child', label: 'Child (unspecified)', hu: 'gyermekem', en: "child's" }
];

const countWords = { 1: 'Egy', 2: 'Két', 3: 'Három', 4: 'Négy' };
const countWordsEn = { 1: 'one', 2: 'two', 3: 'three', 4: 'four' };

export function childCountSentence(count) {
  if (count === 0) return { hu: 'Nincs gyermekem.', en: 'I have no children.' };
  return {
    hu: `${countWords[count] || count} gyermekem van.`,
    en: `I have ${count === 1 ? 'one child' : `${countWordsEn[count] || count} children`}.`
  };
}

export function buildFamilySentence(count, kids) {
  const base = childCountSentence(count);
  let hu = base.hu;
  let en = base.en;
  for (const k of kids || []) {
    const name = (k.name || '').trim();
    if (!name) continue;
    const g = childGenderOptions.find((g) => g.id === k.gender) || childGenderOptions[2];
    const age = (k.age || '').toString().trim();
    hu += ` A ${g.hu} neve ${name}${age ? `, ${age} éves` : ''}.`;
    en += ` My ${g.en} name is ${name}${age ? `, ${age} years old` : ''}.`;
  }
  return { hu, en };
}
