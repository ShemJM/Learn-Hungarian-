/**
 * The vocabulary course. Each lesson: id, title, icon, intro, words.
 * Each word: hu (Hungarian), en (English), pron (rough phonetic guide for English speakers).
 * Hungarian stress is ALWAYS on the first syllable.
 */
export const lessons = [
  {
    id: 'greetings',
    title: 'Greetings & Essentials',
    icon: '👋',
    intro:
      'The survival kit. Hungarians greet formally with strangers (Jó napot!) and informally with friends (Szia!). Stress is always on the first syllable.',
    words: [
      { hu: 'Szia', en: 'Hi / Bye (informal)', pron: 'SEE-yaw' },
      { hu: 'Jó reggelt', en: 'Good morning', pron: 'YOH REG-gelt' },
      { hu: 'Jó napot', en: 'Good day / Hello (formal)', pron: 'YOH NAW-pote' },
      { hu: 'Jó estét', en: 'Good evening', pron: 'YOH ESH-tayt' },
      { hu: 'Jó éjszakát', en: 'Good night', pron: 'YOH AY-saw-kaht' },
      { hu: 'Viszontlátásra', en: 'Goodbye (formal)', pron: 'VEE-sont-lah-tahsh-raw' },
      { hu: 'Köszönöm', en: 'Thank you', pron: 'KUH-suh-nuhm' },
      { hu: 'Kérem', en: 'Please / You are welcome', pron: 'KAY-rem' },
      { hu: 'Igen', en: 'Yes', pron: 'EE-gen' },
      { hu: 'Nem', en: 'No', pron: 'nem' },
      { hu: 'Bocsánat', en: 'Sorry / Excuse me', pron: 'BO-chah-nawt' },
      { hu: 'Hogy vagy?', en: 'How are you? (informal)', pron: 'hodj VAWDJ' },
      { hu: 'Jól vagyok', en: 'I am well', pron: 'yohl VAW-djok' },
      { hu: 'Nem értem', en: 'I do not understand', pron: 'nem AYR-tem' }
    ],
    phrases: [
      { hu: 'Szia, hogy vagy?', en: 'Hi, how are you?' },
      { hu: 'Köszönöm, jól vagyok.', en: 'Thank you, I am well.' },
      { hu: 'Bocsánat, nem értem.', en: 'Sorry, I do not understand.' }
    ]
  },
  {
    id: 'numbers',
    title: 'Numbers',
    icon: '🔢',
    intro:
      'Hungarian numbers are wonderfully regular: 23 is huszonhárom (twenty-three), 35 is harmincöt. Note: after numbers, nouns stay SINGULAR — két sör (two beer), never két sörök! Ordinals (1st, 2nd, 3rd…) just add -dik with vowel harmony: hat → hatodik. The only oddball is első (first) — nobody says "egyedik".',
    words: [
      { hu: 'egy', en: 'one', pron: 'edj' },
      { hu: 'kettő', en: 'two', pron: 'KET-tuh' },
      { hu: 'három', en: 'three', pron: 'HAH-rom' },
      { hu: 'négy', en: 'four', pron: 'naydj' },
      { hu: 'öt', en: 'five', pron: 'uht' },
      { hu: 'hat', en: 'six', pron: 'hawt' },
      { hu: 'hét', en: 'seven', pron: 'hayt' },
      { hu: 'nyolc', en: 'eight', pron: 'nyolts' },
      { hu: 'kilenc', en: 'nine', pron: 'KEE-lents' },
      { hu: 'tíz', en: 'ten', pron: 'teez' },
      { hu: 'húsz', en: 'twenty', pron: 'hooss' },
      { hu: 'harminc', en: 'thirty', pron: 'HAWR-mints' },
      { hu: 'száz', en: 'one hundred', pron: 'sahz' },
      { hu: 'ezer', en: 'one thousand', pron: 'EH-zer' },
      { hu: 'első', en: 'first (1st)', pron: 'EL-shuh' },
      { hu: 'második', en: 'second (2nd)', pron: 'MAH-sho-deek' },
      { hu: 'harmadik', en: 'third (3rd)', pron: 'HAWR-maw-deek' },
      { hu: 'negyedik', en: 'fourth (4th)', pron: 'NEH-djeh-deek' },
      { hu: 'ötödik', en: 'fifth (5th)', pron: 'UH-tuh-deek' },
      { hu: 'hatodik', en: 'sixth (6th)', pron: 'HAW-to-deek' },
      { hu: 'hetedik', en: 'seventh (7th)', pron: 'HEH-teh-deek' },
      { hu: 'nyolcadik', en: 'eighth (8th)', pron: 'NYOL-tsaw-deek' },
      { hu: 'kilencedik', en: 'ninth (9th)', pron: 'KEE-len-tseh-deek' },
      { hu: 'tizedik', en: 'tenth (10th)', pron: 'TEE-zeh-deek' },
      { hu: 'huszadik', en: 'twentieth (20th)', pron: 'HOO-saw-deek' },
      { hu: 'utolsó', en: 'last', pron: 'OO-tol-shoh' },
      { hu: 'hányadik?', en: 'which one (in order)?', pron: 'HAH-nyaw-deek' }
    ],
    phrases: [
      { hu: 'Két kávét kérek.', en: 'Two coffees, please.' },
      { hu: 'Mennyibe kerül?', en: 'How much does it cost?' },
      { hu: 'Ezer forint.', en: 'One thousand forints.' },
      { hu: 'A második emeleten lakom.', en: 'I live on the second floor.' },
      { hu: 'Hányadika van ma?', en: 'What is the date today?' },
      { hu: 'Ma huszadika van.', en: 'Today is the 20th.' },
      { hu: 'Ez az első alkalom.', en: 'This is the first time.' }
    ]
  },
  {
    id: 'family',
    title: 'Family & People',
    icon: '👨‍👩‍👧‍👦',
    intro:
      'Hungarian distinguishes older and younger siblings: báty (older brother) vs öcs (younger brother), nővér (older sister) vs húg (younger sister).',
    words: [
      { hu: 'család', en: 'family', pron: 'CHAW-lahd' },
      { hu: 'anya', en: 'mother', pron: 'AW-nyaw' },
      { hu: 'apa', en: 'father', pron: 'AW-paw' },
      { hu: 'gyerek', en: 'child', pron: 'DJEH-rek' },
      { hu: 'fiú', en: 'boy / son', pron: 'FEE-oo' },
      { hu: 'lány', en: 'girl / daughter', pron: 'lahny' },
      { hu: 'báty', en: 'older brother', pron: 'bahty' },
      { hu: 'öcs', en: 'younger brother', pron: 'uhch' },
      { hu: 'nővér', en: 'older sister', pron: 'NUH-vayr' },
      { hu: 'húg', en: 'younger sister', pron: 'hoog' },
      { hu: 'férfi', en: 'man', pron: 'FAYR-fee' },
      { hu: 'nő', en: 'woman', pron: 'nuh' },
      { hu: 'barát', en: 'friend', pron: 'BAW-raht' },
      { hu: 'nagymama', en: 'grandmother', pron: 'NAWDJ-maw-maw' },
      { hu: 'nagypapa', en: 'grandfather', pron: 'NAWDJ-paw-paw' }
    ],
    phrases: [
      { hu: 'Ez a családom.', en: 'This is my family.' },
      { hu: 'Van egy nővérem.', en: 'I have an older sister.' },
      { hu: 'Ő a barátom.', en: 'He/She is my friend.' }
    ]
  },
  {
    id: 'food',
    title: 'Food & Drink',
    icon: '🍲',
    intro:
      'Essential for any visit to Hungary. Try the gulyás (goulash soup) and lángos (fried dough). "Egészségedre!" means "Cheers!" (literally: to your health).',
    words: [
      { hu: 'kenyér', en: 'bread', pron: 'KEH-nyayr' },
      { hu: 'víz', en: 'water', pron: 'veez' },
      { hu: 'bor', en: 'wine', pron: 'bor' },
      { hu: 'sör', en: 'beer', pron: 'shuhr' },
      { hu: 'kávé', en: 'coffee', pron: 'KAH-vay' },
      { hu: 'tej', en: 'milk', pron: 'tey' },
      { hu: 'alma', en: 'apple', pron: 'AWL-maw' },
      { hu: 'sajt', en: 'cheese', pron: 'shoyt' },
      { hu: 'hús', en: 'meat', pron: 'hoosh' },
      { hu: 'leves', en: 'soup', pron: 'LEH-vesh' },
      { hu: 'gulyás', en: 'goulash', pron: 'GOO-yahsh' },
      { hu: 'étterem', en: 'restaurant', pron: 'AYT-teh-rem' },
      { hu: 'éhes', en: 'hungry', pron: 'AY-hesh' },
      { hu: 'szomjas', en: 'thirsty', pron: 'SOM-yawsh' },
      { hu: 'finom', en: 'delicious', pron: 'FEE-nom' }
    ],
    phrases: [
      { hu: 'Éhes vagyok.', en: 'I am hungry.' },
      { hu: 'Egy gulyást kérek.', en: 'One goulash, please.' },
      { hu: 'Nagyon finom!', en: 'Very delicious!' },
      { hu: 'Egészségedre!', en: 'Cheers! / To your health!' }
    ]
  },
  {
    id: 'town',
    title: 'Around Town',
    icon: '🏙️',
    intro:
      'Navigate Budapest like a local. "Hol van...?" (Where is...?) is your key question. Directions: jobbra (right), balra (left), egyenesen (straight ahead).',
    words: [
      { hu: 'város', en: 'city / town', pron: 'VAH-rosh' },
      { hu: 'utca', en: 'street', pron: 'OOT-tsaw' },
      { hu: 'tér', en: 'square', pron: 'tayr' },
      { hu: 'híd', en: 'bridge', pron: 'heed' },
      { hu: 'állomás', en: 'station', pron: 'AHL-lo-mahsh' },
      { hu: 'bolt', en: 'shop', pron: 'bolt' },
      { hu: 'piac', en: 'market', pron: 'PEE-awts' },
      { hu: 'templom', en: 'church', pron: 'TEMP-lom' },
      { hu: 'múzeum', en: 'museum', pron: 'MOO-zeh-oom' },
      { hu: 'mozi', en: 'cinema', pron: 'MO-zee' },
      { hu: 'jobbra', en: 'to the right', pron: 'YOB-braw' },
      { hu: 'balra', en: 'to the left', pron: 'BAWL-raw' },
      { hu: 'egyenesen', en: 'straight ahead', pron: 'EH-djeh-neh-shen' },
      { hu: 'itt', en: 'here', pron: 'itt' },
      { hu: 'ott', en: 'there', pron: 'ott' }
    ],
    phrases: [
      { hu: 'Hol van az állomás?', en: 'Where is the station?' },
      { hu: 'Menjen egyenesen, aztán jobbra.', en: 'Go straight ahead, then right.' },
      { hu: 'Messze van?', en: 'Is it far?' }
    ]
  },
  {
    id: 'time',
    title: 'Time & Days',
    icon: '🕐',
    intro:
      'The Hungarian week starts on Monday (hétfő, literally "week-head"). Fun fact: hét means both "seven" and "week" — a week has seven days!',
    words: [
      { hu: 'hétfő', en: 'Monday', pron: 'HAYT-fuh' },
      { hu: 'kedd', en: 'Tuesday', pron: 'kedd' },
      { hu: 'szerda', en: 'Wednesday', pron: 'SER-daw' },
      { hu: 'csütörtök', en: 'Thursday', pron: 'CHEW-tuhr-tuhk' },
      { hu: 'péntek', en: 'Friday', pron: 'PAYN-tek' },
      { hu: 'szombat', en: 'Saturday', pron: 'SOM-bawt' },
      { hu: 'vasárnap', en: 'Sunday', pron: 'VAW-shahr-nawp' },
      { hu: 'ma', en: 'today', pron: 'maw' },
      { hu: 'holnap', en: 'tomorrow', pron: 'HOL-nawp' },
      { hu: 'tegnap', en: 'yesterday', pron: 'TEG-nawp' },
      { hu: 'most', en: 'now', pron: 'mosht' },
      { hu: 'reggel', en: 'morning', pron: 'REG-gel' },
      { hu: 'este', en: 'evening', pron: 'ESH-teh' },
      { hu: 'óra', en: 'hour / clock', pron: 'OH-raw' }
    ],
    phrases: [
      { hu: 'Hány óra van?', en: 'What time is it?' },
      { hu: 'Ma péntek van.', en: 'Today is Friday.' },
      { hu: 'Holnap találkozunk!', en: 'See you tomorrow!' }
    ]
  },
  {
    id: 'verbs',
    title: 'Essential Verbs',
    icon: '⚡',
    intro:
      'Dictionary forms end in -ni. Hungarian verbs conjugate richly — see the Grammar section. The forms below in brackets are the "I" form: beszélni → beszélek (I speak). Note the marriage verbs: a woman "goes to a husband" (férjhez megy) while a man "takes a wife" (megnősül) — the verb depends on who is marrying.',
    words: [
      { hu: 'lenni', en: 'to be', pron: 'LEN-nee' },
      { hu: 'menni', en: 'to go', pron: 'MEN-nee' },
      { hu: 'jönni', en: 'to come', pron: 'YUHN-nee' },
      { hu: 'enni', en: 'to eat', pron: 'EN-nee' },
      { hu: 'inni', en: 'to drink', pron: 'IN-nee' },
      { hu: 'beszélni', en: 'to speak', pron: 'BEH-sayl-nee' },
      { hu: 'érteni', en: 'to understand', pron: 'AYR-teh-nee' },
      { hu: 'tudni', en: 'to know / can', pron: 'TOOD-nee' },
      { hu: 'szeretni', en: 'to love / like', pron: 'SEH-ret-nee' },
      { hu: 'kérni', en: 'to ask for', pron: 'KAYR-nee' },
      { hu: 'látni', en: 'to see', pron: 'LAHT-nee' },
      { hu: 'tanulni', en: 'to learn / study', pron: 'TAW-nool-nee' },
      { hu: 'dolgozni', en: 'to work', pron: 'DOL-goz-nee' },
      { hu: 'lakni', en: 'to live (reside)', pron: 'LAWK-nee' },
      { hu: 'randevúzni', en: 'to date / go on a date', pron: 'RAWN-deh-vooz-nee' },
      { hu: 'eljegyezni', en: 'to get engaged to / betroth', pron: 'EL-yeh-djez-nee' },
      { hu: 'megkérni a kezét', en: 'to propose (ask for her hand)', pron: 'MEG-kayr-nee aw KEH-zayt' },
      { hu: 'összeházasodni', en: 'to get married (to each other)', pron: 'UHS-seh-hah-zaw-shod-nee' },
      { hu: 'férjhez menni', en: 'to get married (of a woman)', pron: 'FAYRY-hez MEN-nee' },
      { hu: 'megnősülni', en: 'to get married (of a man)', pron: 'MEG-nuh-shewl-nee' },
      { hu: 'esküdni', en: 'to vow / swear (esküvő = wedding)', pron: 'ESH-kewd-nee' },
      { hu: 'elválni', en: 'to divorce / separate', pron: 'EL-vahl-nee' }
    ],
    phrases: [
      { hu: 'Magyarul tanulok.', en: 'I am learning Hungarian.' },
      { hu: 'Beszélsz angolul?', en: 'Do you speak English?' },
      { hu: 'Budapesten lakom.', en: 'I live in Budapest.' },
      { hu: 'Szeretem a magyar nyelvet.', en: 'I love the Hungarian language.' },
      { hu: 'Megkérte a kezét.', en: 'He proposed to her.' },
      { hu: 'Nyáron összeházasodunk.', en: 'We are getting married in the summer.' },
      { hu: '2021. június 12-én házasodtunk össze.', en: 'We got married on 12 June 2021.' },
      { hu: 'Anna férjhez megy, Péter megnősül.', en: 'Anna is getting married, Péter is getting married.' },
      { hu: 'Mikor van az esküvő?', en: 'When is the wedding?' }
    ]
  },
  {
    id: 'interview',
    title: 'Interviews & Personal Details',
    icon: '🛂',
    intro:
      'The vocabulary of official conversations: registry offices, citizenship interviews, forms. Officials use the formal Ön form, so questions come in the third person: Hol lakik? (Where do you live?), not Hol laksz? See the Formal Register guide. Answers below are patterns — swap the bracketed part for your own details.',
    words: [
      { hu: 'állampolgárság', en: 'citizenship', pron: 'AHL-lawm-pol-gahr-shahg' },
      { hu: 'nemzetiség', en: 'nationality', pron: 'NEM-zeh-tee-shayg' },
      { hu: 'foglalkozás', en: 'occupation', pron: 'FOG-lawl-ko-zahsh' },
      { hu: 'munkahely', en: 'workplace', pron: 'MOON-kaw-hey' },
      { hu: 'munkaidő', en: 'working hours', pron: 'MOON-kaw-ee-duh' },
      { hu: 'távmunka', en: 'remote work', pron: 'TAHV-moon-kaw' },
      { hu: 'cég', en: 'company', pron: 'tsayg' },
      { hu: 'alkalmazott', en: 'employee', pron: 'AWL-kawl-maw-zott' },
      { hu: 'házas', en: 'married', pron: 'HAH-zawsh' },
      { hu: 'házastárs', en: 'spouse', pron: 'HAH-zawsh-tahrsh' },
      { hu: 'feleség', en: 'wife', pron: 'FEH-leh-shayg' },
      { hu: 'férj', en: 'husband', pron: 'fayry' },
      { hu: 'gyermek', en: 'child (formal)', pron: 'DJER-mek' },
      { hu: 'születni', en: 'to be born', pron: 'SEW-let-nee' },
      { hu: 'lakcím', en: 'address', pron: 'LAWK-tseem' },
      { hu: 'jelenleg', en: 'currently', pron: 'YEH-len-leg' },
      { hu: 'körülbelül', en: 'approximately (kb.)', pron: 'KUH-rewl-beh-lewl' },
      { hu: 'lebetűzni', en: 'to spell out', pron: 'LEH-beh-tewz-nee' },
      { hu: 'kiejtés', en: 'pronunciation', pron: 'KEE-ey-taysh' },
      { hu: 'aláírni', en: 'to sign', pron: 'AW-lah-eer-nee' }
    ],
    phrases: [
      { hu: 'Elnézést, megismételné?', en: 'Sorry, could you repeat that?' },
      { hu: 'Nem hallottam tisztán.', en: 'I did not hear it clearly.' },
      { hu: 'Lassabban, kérem.', en: 'More slowly, please.' },
      { hu: 'Elnézést az akcentusomért.', en: 'Sorry about my accent.' },
      { hu: 'Néhány magyar szó kiejtése bonyolult nekem.', en: 'The pronunciation of some Hungarian words is difficult for me.' },
      { hu: 'Igen, házas vagyok.', en: 'Yes, I am married.' },
      { hu: '[Nyolc] éve vagyok házas.', en: 'I have been married for [eight] years.' },
      { hu: '[2010]-ben házasodtunk össze.', en: 'We got married in [2010].' },
      { hu: '[2010] óta vagyunk házasok.', en: 'We have been married since [2010].' },
      { hu: '[Két] gyermekem van.', en: 'I have [two] children.' },
      { hu: '[Szoftverfejlesztő] vagyok.', en: 'I am a [software developer].' },
      { hu: 'Jelenleg [Angliában] lakunk.', en: 'We currently live in [England].' },
      { hu: 'Leginkább távmunkában dolgozom.', en: 'I mostly work remotely.' }
    ]
  },
  {
    id: 'adjectives',
    title: 'Adjectives & Colours',
    icon: '🎨',
    intro:
      'Adjectives come before the noun and do not agree when attributive: a nagy ház (the big house). The Hungarian flag is piros-fehér-zöld (red-white-green).',
    words: [
      { hu: 'nagy', en: 'big', pron: 'nawdj' },
      { hu: 'kicsi', en: 'small', pron: 'KEE-chee' },
      { hu: 'jó', en: 'good', pron: 'yoh' },
      { hu: 'rossz', en: 'bad', pron: 'ross' },
      { hu: 'szép', en: 'beautiful', pron: 'sayp' },
      { hu: 'drága', en: 'expensive / dear', pron: 'DRAH-gaw' },
      { hu: 'olcsó', en: 'cheap', pron: 'OL-choh' },
      { hu: 'új', en: 'new', pron: 'ooy' },
      { hu: 'régi', en: 'old (things)', pron: 'RAY-gee' },
      { hu: 'piros', en: 'red', pron: 'PEE-rosh' },
      { hu: 'fehér', en: 'white', pron: 'FEH-hayr' },
      { hu: 'zöld', en: 'green', pron: 'zuhld' },
      { hu: 'kék', en: 'blue', pron: 'kayk' },
      { hu: 'sárga', en: 'yellow', pron: 'SHAHR-gaw' },
      { hu: 'fekete', en: 'black', pron: 'FEH-keh-teh' }
    ],
    phrases: [
      { hu: 'Budapest nagyon szép.', en: 'Budapest is very beautiful.' },
      { hu: 'Ez túl drága!', en: 'This is too expensive!' },
      { hu: 'A magyar zászló piros, fehér és zöld.', en: 'The Hungarian flag is red, white and green.' }
    ]
  }
];

export function getLesson(id) {
  return lessons.find((l) => l.id === id) || null;
}

/** Every vocabulary word across all lessons. */
export function allWords() {
  return lessons.flatMap((l) => l.words);
}

/** Every practice phrase across all lessons (for pronunciation practice). */
export function allPhrases() {
  return lessons.flatMap((l) => (l.phrases || []).map((p) => ({ ...p, lessonId: l.id })));
}
