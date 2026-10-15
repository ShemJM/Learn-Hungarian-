/**
 * Bites: hand-written one-screen micro-lessons for the Reels feed — the
 * things a textbook puts in a sidebar and a good teacher says in passing.
 * Each: id, kind, title, body, examples: [{ hu, en }].
 *
 * kinds: didyouknow (how the language works), falsefriend (looks English,
 * isn't), mistake (what learners get wrong), idiom (say it like a local),
 * mnemonic (a hook to remember by), culture (life in Hungary).
 */
export const BITE_KINDS = {
  didyouknow: { label: 'Did you know?', emoji: '💡' },
  falsefriend: { label: 'False friend', emoji: '🎭' },
  mistake: { label: 'Common mistake', emoji: '🚫' },
  idiom: { label: 'Say it like a local', emoji: '🗣️' },
  mnemonic: { label: 'Memory hook', emoji: '🪝' },
  culture: { label: 'Life in Hungary', emoji: '🇭🇺' }
};

export const bites = [
  // ---- how the language works -------------------------------------------
  {
    id: 'no-gender',
    kind: 'didyouknow',
    title: 'There is no he or she',
    body: 'Hungarian has one word, ő, for he, she and it (for people). No grammatical gender anywhere — no le/la, no der/die/das. Hungarians speaking English famously mix up "he" and "she" for exactly this reason.',
    examples: [
      { hu: 'Ő tanár.', en: 'He / she is a teacher.' },
      { hu: 'Ő a barátom.', en: 'He / she is my friend.' }
    ]
  },
  {
    id: 'no-to-have',
    kind: 'didyouknow',
    title: 'There is no verb "to have"',
    body: 'To say you have something, you say it exists "to you": van + the thing with a possessive ending. Literally "to-me is a dog".',
    examples: [
      { hu: 'Van egy kutyám.', en: 'I have a dog. (lit. there-is a dog-of-mine)' },
      { hu: 'Nincs időm.', en: "I don't have time." }
    ]
  },
  {
    id: 'stress-first',
    kind: 'didyouknow',
    title: 'Stress is ALWAYS on the first syllable',
    body: 'No exceptions, ever — not even in long words or foreign names. The accent marks are vowel length, not stress. Get this one habit right and you instantly sound more Hungarian.',
    examples: [
      { hu: 'BUdapest, nem BudaPEST', en: 'BU-da-pesht, never bu-da-PEST' },
      { hu: 'KÖszönöm', en: 'KUH-suh-nuhm' }
    ]
  },
  {
    id: 'suffix-stack',
    kind: 'didyouknow',
    title: 'One word, a whole English sentence',
    body: 'Hungarian glues endings onto words instead of using little words like "in", "my" and "with". The endings stack in a fixed order: word + plural + possessive + case.',
    examples: [
      { hu: 'ház-a-i-m-ban', en: 'in my houses (house + possessive + plural + my + in)' },
      { hu: 'barátaimmal', en: 'with my friends' }
    ]
  },
  {
    id: 'number-singular',
    kind: 'didyouknow',
    title: 'After a number, nouns stay singular',
    body: 'Two beers is két sör, never két sörök. The number already says "more than one", so the plural would be saying it twice. Same after sok (many), kevés (few) and hány (how many).',
    examples: [
      { hu: 'három kávé', en: 'three coffee(s)' },
      { hu: 'sok ember', en: 'many person = many people' }
    ]
  },
  {
    id: 'yes-no-echo',
    kind: 'didyouknow',
    title: 'Answer a question by echoing the verb',
    body: 'Igen and nem work, but a native answer often repeats the verb (or its coverb). "Do you speak Hungarian?" — "Beszélek." Coverb questions get the coverb back on its own: "Megetted?" — "Meg."',
    examples: [
      { hu: 'Szereted a kávét? — Szeretem.', en: 'Do you like coffee? — I do.' },
      { hu: 'Elmész? — El.', en: 'Are you leaving? — Yes (I am).' }
    ]
  },
  {
    id: 'word-order-focus',
    kind: 'didyouknow',
    title: 'The word before the verb is the point',
    body: 'Word order is flexible, but whatever sits right before the verb is what you are emphasising. Move a word there and you change what the sentence is "about".',
    examples: [
      { hu: 'Péter Budapesten lakik.', en: 'Péter lives in BUDAPEST (not elsewhere).' },
      { hu: 'Budapesten Péter lakik.', en: 'It is PÉTER who lives in Budapest.' }
    ]
  },
  {
    id: 'long-vowels-matter',
    kind: 'didyouknow',
    title: 'The accent can change the meaning',
    body: 'Accents mark long vowels, and length is a real difference — not decoration. Some pairs are only a vowel-length apart.',
    examples: [
      { hu: 'kor / kór', en: 'age / disease' },
      { hu: 'szel / szél', en: 'slices / wind' }
    ]
  },
  {
    id: 'two-you',
    kind: 'didyouknow',
    title: 'Two ways to say "you"',
    body: 'Te is for friends, family, children and anyone your age in a casual setting. Ön (with 3rd-person verb forms) is for strangers, officials, shop staff and older people. When unsure, start with Ön — being offered "tegezés" is a small honour.',
    examples: [
      { hu: 'Hogy vagy?', en: 'How are you? (informal)' },
      { hu: 'Hogy van?', en: 'How are you? (formal)' }
    ]
  },
  {
    id: 'definite-indefinite',
    kind: 'didyouknow',
    title: 'The verb knows about "the"',
    body: 'Verbs have two sets of endings. Use the definite set when the object is specific — "the", "this", a name, "it" — and the indefinite set otherwise. English never does this, so it needs deliberate practice.',
    examples: [
      { hu: 'Kérek egy kávét.', en: 'I want A coffee. (indefinite)' },
      { hu: 'Kérem a számlát.', en: 'I want THE bill. (definite)' }
    ]
  },

  // ---- false friends -----------------------------------------------------
  {
    id: 'ff-szimpatikus',
    kind: 'falsefriend',
    title: 'szimpatikus ≠ sympathetic',
    body: 'Szimpatikus means likeable, nice — someone you warm to. It says nothing about sympathy. "Sympathetic" in the English sense is együttérző.',
    examples: [{ hu: 'Nagyon szimpatikus a főnököm.', en: 'My boss is really likeable.' }]
  },
  {
    id: 'ff-aktualis',
    kind: 'falsefriend',
    title: 'aktuális ≠ actual',
    body: 'Aktuális means current, topical, up-to-date. "Actual" (real) is tényleges or valódi.',
    examples: [{ hu: 'Ez az aktuális menetrend.', en: 'This is the current timetable.' }]
  },
  {
    id: 'ff-farmer',
    kind: 'falsefriend',
    title: 'farmer = jeans',
    body: 'A farmer is a pair of jeans, not a person who farms (that is gazda or farmergazda). "Farmernadrág" if you want to be precise.',
    examples: [{ hu: 'Új farmert vettem.', en: 'I bought new jeans.' }]
  },
  {
    id: 'ff-konkurencia',
    kind: 'falsefriend',
    title: 'konkurencia = the competition',
    body: 'Konkurencia means your business rivals, not concurrency. Likewise konkrét means specific, not concrete (the material, beton).',
    examples: [{ hu: 'Erős a konkurencia.', en: 'The competition is strong.' }]
  },
  {
    id: 'ff-szolid',
    kind: 'falsefriend',
    title: 'szolid ≠ solid',
    body: 'Szolid means modest, understated, reasonable (of prices, of dress, of behaviour). Solid as in firm is szilárd.',
    examples: [{ hu: 'Szolid árak.', en: 'Reasonable prices.' }]
  },
  {
    id: 'ff-mondat',
    kind: 'falsefriend',
    title: 'novella, szónok, gimnázium…',
    body: 'A novella is a short story (a novel is regény). A gimnázium is an academic secondary school, not a gym (that is edzőterem or konditerem). A szónok is a public speaker, not a snorer.',
    examples: [{ hu: 'A fiam gimnáziumba jár.', en: 'My son goes to grammar school.' }]
  },

  // ---- common mistakes ---------------------------------------------------
  {
    id: 'mistake-van-adjective',
    kind: 'mistake',
    title: 'Drop "van" with adjectives',
    body: 'In the 3rd person, "to be" disappears before an adjective or a noun: A ház nagy, not "A ház van nagy". Keep van only for location and existence ("A ház ott van").',
    examples: [
      { hu: 'A kávé forró.', en: 'The coffee is hot.' },
      { hu: 'A kávé az asztalon van.', en: 'The coffee is on the table.' }
    ]
  },
  {
    id: 'mistake-plural-after-number',
    kind: 'mistake',
    title: '"két sörök" ✗',
    body: 'The single most common beginner slip. Numbers, sok, kevés, néhány: all take the singular.',
    examples: [
      { hu: 'két sör ✓ — két sörök ✗', en: 'two beers' },
      { hu: 'sok gyerek ✓ — sok gyerekek ✗', en: 'many children' }
    ]
  },
  {
    id: 'mistake-s-sz',
    kind: 'mistake',
    title: 'Reading s as "s"',
    body: 'A plain s is always "sh". The English s sound is written sz. So "és" (and) is aysh, "sör" is shur, and sajt (cheese) is shoyt. Get this backwards and nobody understands you.',
    examples: [
      { hu: 'sajt, sör, és', en: 'cheese, beer, and — all with sh' },
      { hu: 'szia, szép, szeretem', en: 'hi, beautiful, I love it — plain s' }
    ]
  },
  {
    id: 'mistake-tegezes-boss',
    kind: 'mistake',
    title: 'Using "te" with an official',
    body: 'At the immigration office, a bank or a doctor, use Ön and the 3rd-person verb. "Hogy vagy?" to a clerk sounds like a child talking. Wait for them to offer the informal form.',
    examples: [{ hu: 'Segítene, kérem?', en: 'Could you help me, please? (formal)' }]
  },
  {
    id: 'mistake-ik-verbs',
    kind: 'mistake',
    title: 'eszek? iszok? — it is eszem, iszom',
    body: 'A handful of verbs end in -ik in the 3rd person (eszik, iszik, lakik, dolgozik). Their "I" form takes -m, not -k: eszem, iszom, lakom, dolgozom. You will hear "eszek" on the street, but the exam wants eszem.',
    examples: [
      { hu: 'Budapesten lakom.', en: 'I live in Budapest.' },
      { hu: 'Egy irodában dolgozom.', en: 'I work in an office.' }
    ]
  },
  {
    id: 'mistake-nak-nek-have',
    kind: 'mistake',
    title: '"Én van egy autó" ✗',
    body: 'Do not translate "I have" word for word. The owner gets -nak/-nek (or just the possessive ending on the thing), and the verb is van/vannak.',
    examples: [
      { hu: 'Van egy autóm.', en: 'I have a car.' },
      { hu: 'Péternek két gyereke van.', en: 'Péter has two children.' }
    ]
  },
  {
    id: 'mistake-is-position',
    kind: 'mistake',
    title: '"is" (also) goes AFTER the word',
    body: 'Is means "also/too" and always follows the word it belongs to — never before it, never at the end of the sentence like English "too".',
    examples: [
      { hu: 'Én is kérek kávét.', en: 'I also want coffee. (me too)' },
      { hu: 'Kávét is kérek.', en: 'I want coffee as well. (coffee, too)' }
    ]
  },

  // ---- idioms & set phrases ----------------------------------------------
  {
    id: 'idiom-egeszsegedre',
    kind: 'idiom',
    title: 'Egészségedre! — cheers AND bless you',
    body: 'Literally "to your health". Say it when clinking glasses and when someone sneezes. Formal: Egészségére!',
    examples: [{ hu: 'Egészségedre!', en: 'Cheers! / Bless you!' }]
  },
  {
    id: 'idiom-jo-etvagyat',
    kind: 'idiom',
    title: 'Jó étvágyat!',
    body: 'Said before eating, to anyone at the table — even strangers in a canteen. The reply is Köszönöm, viszont! (thanks, likewise).',
    examples: [{ hu: 'Jó étvágyat! — Köszönöm, viszont!', en: 'Enjoy your meal! — Thanks, you too!' }]
  },
  {
    id: 'idiom-semmi-baj',
    kind: 'idiom',
    title: 'Semmi baj.',
    body: 'Literally "no trouble". The all-purpose "no worries / never mind / it is fine" when someone apologises.',
    examples: [{ hu: 'Bocsánat! — Semmi baj.', en: 'Sorry! — No worries.' }]
  },
  {
    id: 'idiom-nem-tudom',
    kind: 'idiom',
    title: 'Fogalmam sincs.',
    body: '"I have no idea" — stronger and more natural than a bare Nem tudom. Literally "I don\'t even have a concept".',
    examples: [{ hu: 'Hol van Péter? — Fogalmam sincs.', en: 'Where is Péter? — No idea.' }]
  },
  {
    id: 'idiom-rendben',
    kind: 'idiom',
    title: 'Rendben. / Jó. / Oké.',
    body: 'Three ways to say OK. Rendben (literally "in order") is the polite, neutral one; Jó is the everyday one; Oké is just as common as in English.',
    examples: [{ hu: 'Holnap tízkor? — Rendben.', en: 'Tomorrow at ten? — Fine.' }]
  },
  {
    id: 'idiom-tessek',
    kind: 'idiom',
    title: 'Tessék — the magic word',
    body: 'Hand something over: Tessék (here you are). Someone knocks: Tessék! (come in). Did not catch it: Tessék? (pardon?). Shop assistant greeting you: Tessék! (yes, what can I get you?).',
    examples: [{ hu: 'Tessék, a számla.', en: 'Here you are, the bill.' }]
  },
  {
    id: 'idiom-nem-fog-a-feje',
    kind: 'idiom',
    title: 'Mi a pálya?',
    body: 'Slang for "what is up?", literally "what is the track?". Among friends only. The classic reply: Semmi különös (nothing special).',
    examples: [{ hu: 'Szia, mi a pálya? — Semmi különös.', en: "Hi, what's up? — Nothing much." }]
  },
  {
    id: 'idiom-hogy-hogy',
    kind: 'idiom',
    title: 'Hogyhogy?',
    body: '"How come?" — the natural way to ask why something surprising is the case. Not the same as Hogy? (how?).',
    examples: [{ hu: 'Nem jövök. — Hogyhogy?', en: "I'm not coming. — How come?" }]
  },

  // ---- memory hooks --------------------------------------------------------
  {
    id: 'mnemonic-harmony',
    kind: 'mnemonic',
    title: 'Vowel harmony in one sentence',
    body: 'Back vowels are the ones in "a u o" (think: a loud, open mouth — a, á, o, ó, u, ú). Front vowels are the rest (e, é, i, í, ö, ő, ü, ű). Match the ending to the LAST vowel-type in the word: házBAN, but kertBEN.',
    examples: [
      { hu: 'házban, autóban', en: 'in the house, in the car (back)' },
      { hu: 'kertben, Szegeden', en: 'in the garden, in Szeged (front)' }
    ]
  },
  {
    id: 'mnemonic-ban-on',
    kind: 'mnemonic',
    title: '-ban is IN, -n is ON',
    body: 'Think "in a BAN(k)" → -ban/-ben = inside. Think "oN" → -n/-on/-en/-ön = on the surface. Cities are the exception: most Hungarian towns take -n (Budapesten), foreign ones take -ban (Londonban).',
    examples: [
      { hu: 'a táskában', en: 'in the bag' },
      { hu: 'az asztalon', en: 'on the table' }
    ]
  },
  {
    id: 'mnemonic-t-object',
    kind: 'mnemonic',
    title: 'The object wears a -t',
    body: 'Whatever gets the action takes -t (sometimes with a linking vowel: -ot/-et/-öt/-at). Spot the -t, spot the object: it lets you scramble word order freely.',
    examples: [
      { hu: 'Kérek egy kávét.', en: 'I want a coffee.' },
      { hu: 'Szeretem a zenét.', en: 'I love music.' }
    ]
  },
  {
    id: 'mnemonic-nyolc',
    kind: 'mnemonic',
    title: 'nyolc — "nyol-ts"',
    body: 'Eight is the number every learner stumbles over. Say "NYOL" like "canyon" + "ts" of "cats". Then nyolcvan (eighty) is just "nyolts-van".',
    examples: [{ hu: 'nyolc, nyolcvan, nyolcadik', en: 'eight, eighty, eighth' }]
  },
  {
    id: 'mnemonic-days',
    kind: 'mnemonic',
    title: 'Days of the week hooks',
    body: 'Hétfő = "week-head" (hét + fő), Monday. Kedd = second (ketted). Szerda, csütörtök, péntek are Slavic loans — just memorise. Szombat sounds like Sabbath. Vasárnap = "market day" (vásár + nap).',
    examples: [{ hu: 'hétfő, kedd, szerda, csütörtök, péntek, szombat, vasárnap', en: 'Mon, Tue, Wed, Thu, Fri, Sat, Sun' }]
  },
  {
    id: 'mnemonic-past-t',
    kind: 'mnemonic',
    title: 'Past tense = add a T',
    body: 'Almost every past tense form has a t (or tt) right before the person ending: beszélTem, tudTad, lakoTT. If you hear a t in there, it probably already happened.',
    examples: [
      { hu: 'Tegnap dolgoztam.', en: 'Yesterday I worked.' },
      { hu: 'Láttad?', en: 'Did you see it?' }
    ]
  },

  // ---- culture -------------------------------------------------------------
  {
    id: 'culture-name-order',
    kind: 'culture',
    title: 'Surname first',
    body: 'Hungarians write and say the family name first: Kovács János, not János Kovács. On forms, "vezetéknév" is the surname and "keresztnév" the given name. Foreign names keep their own order.',
    examples: [{ hu: 'Kovács János vagyok.', en: 'I am János Kovács.' }]
  },
  {
    id: 'culture-name-day',
    kind: 'culture',
    title: 'Name days matter',
    body: 'Every first name has a date in the calendar (névnap), and people celebrate it almost like a birthday — a small gift, flowers, a round of drinks. Say Boldog névnapot! The day is printed in most diaries.',
    examples: [{ hu: 'Boldog névnapot!', en: 'Happy name day!' }]
  },
  {
    id: 'culture-palinka',
    kind: 'culture',
    title: 'Pálinka',
    body: 'Fruit brandy, usually 40–50%, offered as a welcome, a toast, or a cure for everything. Refusing outright can seem rude; a tiny sip and "Egészségedre!" keeps everyone happy.',
    examples: [{ hu: 'Egy kis pálinkát?', en: 'A little pálinka?' }]
  },
  {
    id: 'culture-shoes-off',
    kind: 'culture',
    title: 'Shoes off at the door',
    body: 'In most homes you take your shoes off; the host will offer papucs (slippers). Bring flowers (an odd number, never chrysanthemums — those are for graves) or a bottle.',
    examples: [{ hu: 'Levegyem a cipőmet?', en: 'Shall I take my shoes off?' }]
  },
  {
    id: 'culture-csokolom',
    kind: 'culture',
    title: 'Csókolom',
    body: 'Literally "I kiss (your hand)". Children say it to adults, and adults still say it to elderly women as a polite greeting. You will hear it in every village shop.',
    examples: [{ hu: 'Csókolom!', en: '(respectful greeting to an older woman)' }]
  },
  {
    id: 'culture-forint',
    kind: 'culture',
    title: 'Forint, and rounding',
    body: 'Prices are in forint (Ft, HUF); there are no coins under 5 Ft, so cash totals round to the nearest 5. "Ezer" (thousand) is the everyday unit: háromezer = 3,000 Ft.',
    examples: [{ hu: 'Háromezer-ötszáz forint lesz.', en: 'That will be 3,500 forints.' }]
  },
  {
    id: 'culture-august-20',
    kind: 'culture',
    title: 'The three national days',
    body: 'March 15 (the 1848 revolution), August 20 (St Stephen\'s Day, with the new bread and fireworks over the Danube) and October 23 (1956). Expect these on the citizenship test.',
    examples: [{ hu: 'Augusztus huszadika nemzeti ünnep.', en: 'The 20th of August is a national holiday.' }]
  }
];

export function getBite(id) {
  return bites.find((b) => b.id === id) || null;
}
