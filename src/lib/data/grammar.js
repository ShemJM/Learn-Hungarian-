/**
 * Grammar guides. Each guide: id, title, icon, summary, sections, exercises.
 * Sections: { heading, body (plain text, may contain \n for paragraphs), examples: [{hu, en}], table? }.
 * Exercises: { prompt, answer, hint? } — hand-authored typed drills, because
 * Hungarian morphology (harmony variants, assimilation, irregulars) is not
 * safely generatable. `answer` is a string or an array of accepted variants
 * (first one is the display form). Answers are graded accent-leniently.
 */
export const grammarGuides = [
  {
    id: 'alphabet',
    title: 'Alphabet & Pronunciation',
    icon: '🔤',
    summary: 'Hungarian spelling is wonderfully phonetic — once you know the rules, you can pronounce anything.',
    exercises: [
      { prompt: 'Spell the word for "hi", pronounced SEE-yaw', answer: 'szia', hint: 'the English s sound is written sz' },
      { prompt: 'Spell the word for "good", pronounced YOH', answer: 'jó', hint: 'the y sound is written j' },
      { prompt: 'Spell the word for "beer", pronounced SHUHR', answer: 'sör', hint: 'the sh sound is written with a single s' },
      { prompt: 'Spell the word for "beautiful", pronounced SAYP', answer: 'szép', hint: 'sz for the s sound, é for the long ay' },
      { prompt: 'Spell the word for "street", pronounced OOT-tsaw', answer: 'utca', hint: 'the ts sound is written c' },
      { prompt: 'Spell the word for "Hungarian", pronounced MAW-djar', answer: 'magyar', hint: 'the soft dy sound is written gy' },
      { prompt: 'Spell the word for "summer", pronounced NYAHR', answer: 'nyár', hint: 'the canyon-n sound is written ny' },
      { prompt: 'Spell the word for "only", pronounced CHAWK', answer: 'csak', hint: 'the ch sound is written cs' },
      { prompt: 'Spell the word for "and", pronounced AYSH', answer: 'és', hint: 'a single s says sh — even at the end' }
    ],
    sections: [
      {
        heading: 'The golden rule: stress the FIRST syllable',
        body: 'Every Hungarian word is stressed on its first syllable, with no exceptions. Accent marks on vowels indicate length, not stress.'
      },
      {
        heading: 'Long vs short vowels',
        body: 'Accents make vowels longer (and sometimes change quality). The pairs are: a/á, e/é, i/í, o/ó, ö/ő, u/ú, ü/ű. The short "a" sounds like the o in "hot" (British); á is like the a in "father". Short "e" is like in "bed"; é is like the ay in "say" (without the glide).',
        examples: [
          { hu: 'kor / kór', en: 'age / disease — vowel length changes meaning!' },
          { hu: 'öt / őt', en: 'five / him-her' }
        ]
      },
      {
        heading: 'The special consonant pairs (digraphs)',
        body: 'These letter combinations are single sounds:',
        table: {
          headers: ['Letters', 'Sounds like', 'Example'],
          rows: [
            ['cs', 'ch in "church"', 'csak (only)'],
            ['gy', 'd in "during" (soft dy)', 'magyar (Hungarian)'],
            ['ly', 'y in "yes"', 'hely (place)'],
            ['ny', 'ny in "canyon"', 'nyár (summer)'],
            ['sz', 's in "sun"', 'szia (hi)'],
            ['s', 'sh in "shop" (!)', 'és (and)'],
            ['ty', 't in "tube" (soft ty)', 'tyúk (hen)'],
            ['zs', 's in "pleasure"', 'zsemle (bread roll)'],
            ['c', 'ts in "cats"', 'utca (street)'],
            ['j', 'y in "yes"', 'jó (good)']
          ]
        }
      },
      {
        heading: 'Watch out: s and sz are swapped!',
        body: 'Compared to English: Hungarian "s" = English "sh", and Hungarian "sz" = English "s". So Budapest is actually pronounced "BOO-daw-pesht".',
        examples: [
          { hu: 'Budapest', en: 'BOO-daw-pesht' },
          { hu: 'sör', en: 'shuhr (beer)' },
          { hu: 'szép', en: 'sayp (beautiful)' }
        ]
      }
    ]
  },
  {
    id: 'vowel-harmony',
    title: 'Vowel Harmony',
    icon: '🎵',
    summary: 'The melody of Hungarian: suffixes change their vowels to match the word they attach to.',
    exercises: [
      { prompt: 'in the house (ház + -ban/-ben)', answer: 'házban', hint: 'á is a back vowel' },
      { prompt: 'in the garden (kert + -ban/-ben)', answer: 'kertben', hint: 'e is a front vowel' },
      { prompt: 'in London (London + -ban/-ben)', answer: 'Londonban', hint: 'foreign names harmonise too' },
      { prompt: 'in the water (víz + -ban/-ben)', answer: 'vízben', hint: 'í is a front vowel' },
      { prompt: 'in the city (város + -ban/-ben)', answer: 'városban', hint: 'follow the last vowel: o is back' },
      { prompt: 'in the kitchen (konyha + -ban/-ben)', answer: 'konyhában', hint: 'a final short a lengthens to á before a suffix' },
      { prompt: 'I know (tud + -ok/-ek/-ök)', answer: 'tudok', hint: 'u is a back vowel' },
      { prompt: 'I speak (beszél + -ok/-ek/-ök)', answer: 'beszélek', hint: 'front, unrounded' },
      { prompt: 'I sit (ül + -ok/-ek/-ök)', answer: 'ülök', hint: 'ü is front AND rounded' },
      { prompt: 'I cook (főz + -ok/-ek/-ök)', answer: 'főzök', hint: 'ő is front and rounded' }
    ],
    sections: [
      {
        heading: 'Front vs back vowels',
        body: 'Vowels split into two camps. BACK vowels: a, á, o, ó, u, ú. FRONT vowels: e, é, i, í, ö, ő, ü, ű. Most words contain only one camp, and every suffix comes in (at least) two flavours to match.'
      },
      {
        heading: 'Suffixes harmonise',
        body: 'The "in" suffix is -ban after back-vowel words and -ben after front-vowel words. The "I do" verb ending is -ok / -ek / -ök depending on the verb\'s vowels.',
        examples: [
          { hu: 'házban', en: 'in the house (ház has back vowel á)' },
          { hu: 'kertben', en: 'in the garden (kert has front vowel e)' },
          { hu: 'Londonban', en: 'in London — even foreign names harmonise!' },
          { hu: 'tudok', en: 'I know (back)' },
          { hu: 'beszélek', en: 'I speak (front)' },
          { hu: 'ülök', en: 'I sit (front rounded)' }
        ]
      },
      {
        heading: 'How to choose',
        body: 'Look at the LAST vowel of the word: if it is a back vowel, use the back form of the suffix; otherwise use the front form. Words with ö/ő/ü/ű often take the rounded front form (-ök, -höz). Mixed words usually follow their final vowel.'
      }
    ]
  },
  {
    id: 'to-be',
    title: 'The Verb "to be" (lenni)',
    icon: '🧍',
    summary: 'Vagyok, vagy, van... and the famous rule about dropping "van".',
    exercises: [
      { prompt: 'I am tired. → Fáradt ___.', answer: 'vagyok' },
      { prompt: 'You are kind. (informal) → Kedves ___.', answer: 'vagy' },
      { prompt: 'We are at home. → Otthon ___.', answer: 'vagyunk' },
      { prompt: 'You are here. (plural) → Itt ___.', answer: 'vagytok' },
      { prompt: '"Anna is a teacher." — type the whole sentence', answer: 'Anna tanár', hint: 'describing WHAT someone is: no van!' },
      { prompt: '"The house is big." — type the whole sentence', answer: 'A ház nagy', hint: 'adjective in 3rd person: drop van' },
      { prompt: 'Anna is in the garden. → Anna a kertben ___.', answer: 'van', hint: 'location keeps van' },
      { prompt: 'They are in Budapest. → Budapesten ___.', answer: 'vannak', hint: 'location, plural' },
      { prompt: 'Is there beer? → ___ sör?', answer: 'Van', hint: 'existence keeps van' },
      { prompt: 'I am Hungarian. → Magyar ___.', answer: 'vagyok', hint: 'no pronoun needed — the ending says who' }
    ],
    sections: [
      {
        heading: 'Present tense of lenni',
        table: {
          headers: ['Person', 'Hungarian', 'English'],
          rows: [
            ['én', 'vagyok', 'I am'],
            ['te', 'vagy', 'you are (informal)'],
            ['ő / Ön', 'van', 'he/she is / you are (formal)'],
            ['mi', 'vagyunk', 'we are'],
            ['ti', 'vagytok', 'you are (plural)'],
            ['ők / Önök', 'vannak', 'they are / you are (formal pl.)']
          ]
        }
      },
      {
        heading: 'The famous rule: drop "van" with adjectives and nouns',
        body: 'In the 3rd person, when you describe WHAT something is or WHAT it is like, you omit van/vannak entirely. But you keep van for location and existence.',
        examples: [
          { hu: 'Anna tanár.', en: 'Anna is a teacher. (no "van"!)' },
          { hu: 'A ház nagy.', en: 'The house is big. (no "van"!)' },
          { hu: 'Anna a kertben van.', en: 'Anna is in the garden. (location → keep van)' },
          { hu: 'Van sör?', en: 'Is there beer? (existence → keep van)' }
        ]
      },
      {
        heading: 'Personal pronouns are usually dropped',
        body: 'Because the verb ending already shows the person, pronouns are only used for emphasis: "Magyar vagyok" (I am Hungarian) — no need for "én".',
        examples: [
          { hu: 'Éhes vagyok.', en: 'I am hungry.' },
          { hu: 'Én vagyok éhes, nem te!', en: 'I am the hungry one, not you! (emphasis)' }
        ]
      }
    ]
  },
  {
    id: 'verb-conjugation',
    title: 'Present Tense Verbs',
    icon: '⚙️',
    summary: 'One verb, two conjugations: indefinite vs definite — the heart of Hungarian grammar.',
    exercises: [
      { prompt: 'I learn (tanulni)', answer: 'tanulok' },
      { prompt: 'you speak (beszélni, informal singular)', answer: 'beszélsz' },
      { prompt: 'we ask for (kérni)', answer: 'kérünk' },
      { prompt: 'they know (tudni)', answer: 'tudnak' },
      { prompt: 'you learn (tanulni, plural ti)', answer: 'tanultok' },
      { prompt: 'he/she reads (olvasni)', answer: 'olvas' },
      { prompt: 'I would like A coffee: ___ egy kávét.', answer: 'Kérek', hint: 'egy = indefinite conjugation' },
      { prompt: 'I would like THE bill: ___ a számlát.', answer: 'Kérem', hint: 'a definite object takes the definite conjugation' },
      { prompt: 'I go (menni — irregular!)', answer: 'megyek' },
      { prompt: 'I eat (enni — irregular -ik verb)', answer: ['eszem', 'eszek'] }
    ],
    sections: [
      {
        heading: 'Indefinite conjugation (no specific object)',
        body: 'Used when there is no object or an indefinite one ("I read a book"). Endings harmonise with the verb. Example: tanul (to learn, back) and beszél (to speak, front):',
        table: {
          headers: ['Person', 'tanul (back)', 'beszél (front)'],
          rows: [
            ['én', 'tanulok', 'beszélek'],
            ['te', 'tanulsz', 'beszélsz'],
            ['ő', 'tanul', 'beszél'],
            ['mi', 'tanulunk', 'beszélünk'],
            ['ti', 'tanultok', 'beszéltek'],
            ['ők', 'tanulnak', 'beszélnek']
          ]
        }
      },
      {
        heading: 'Definite conjugation (a specific object)',
        body: 'When the object is definite ("I read THE book"), the verb takes different endings: Olvasok egy könyvet (I read a book) vs Olvasom a könyvet (I read the book). As a beginner, just recognise that both exist — fluency comes with practice.',
        examples: [
          { hu: 'Kérek egy kávét.', en: 'I would like a coffee. (indefinite)' },
          { hu: 'Kérem a számlát.', en: 'I would like the bill. (definite)' },
          { hu: 'Szeretek olvasni.', en: 'I like reading. (indefinite)' },
          { hu: 'Szeretem Budapestet.', en: 'I love Budapest. (definite — proper names are definite)' }
        ]
      },
      {
        heading: 'Useful "I" forms to memorise',
        examples: [
          { hu: 'kérek', en: 'I ask for / I would like' },
          { hu: 'tudok', en: 'I know / I can' },
          { hu: 'megyek', en: 'I go' },
          { hu: 'eszem', en: 'I eat' },
          { hu: 'iszom', en: 'I drink' },
          { hu: 'lakom / lakok', en: 'I live (reside)' }
        ]
      }
    ]
  },
  {
    id: 'cases',
    title: 'Cases & Suffixes',
    icon: '🧩',
    summary: 'Hungarian has no prepositions — it glues suffixes onto nouns instead. Here are the essential ones.',
    exercises: [
      { prompt: 'a beer, as a direct object (sör + -t)', answer: 'sört' },
      { prompt: 'in the house (ház)', answer: 'házban' },
      { prompt: 'into the house (ház)', answer: 'házba', hint: '-ba/-be = movement into' },
      { prompt: 'out of the house (ház)', answer: 'házból' },
      { prompt: 'on the table (asztal + linking vowel + -n)', answer: 'asztalon' },
      { prompt: 'onto the table (asztal)', answer: 'asztalra' },
      { prompt: 'in Budapest (careful — Hungarian cities!)', answer: 'Budapesten', hint: 'Hungarian cities take -n/-on/-en' },
      { prompt: 'in London', answer: 'Londonban', hint: 'foreign cities take -ban/-ben' },
      { prompt: 'to the doctor (orvos + -hoz/-hez/-höz)', answer: 'orvoshoz' },
      { prompt: "at five o'clock (öt + -kor)", answer: 'ötkor' }
    ],
    sections: [
      {
        heading: 'The accusative: -t (direct object)',
        body: 'Every direct object takes -t, often with a linking vowel. This is why word order can be free — the -t tells you who is doing what to whom.',
        examples: [
          { hu: 'Kérek egy sört.', en: 'I ask for a beer. (sör → sört)' },
          { hu: 'Látom a hidat.', en: 'I see the bridge. (híd → hidat)' },
          { hu: 'Annát látom.', en: 'It is Anna I see. (word order is free!)' }
        ]
      },
      {
        heading: 'Place suffixes',
        table: {
          headers: ['Suffix', 'Meaning', 'Example'],
          rows: [
            ['-ban / -ben', 'in', 'a házban — in the house'],
            ['-ba / -be', 'into', 'a házba — into the house'],
            ['-ból / -ből', 'out of', 'a házból — out of the house'],
            ['-n / -on / -en / -ön', 'on', 'az asztalon — on the table'],
            ['-ra / -re', 'onto', 'az asztalra — onto the table'],
            ['-nál / -nél', 'at / by', 'a folyónál — by the river'],
            ['-hoz / -hez / -höz', 'to(wards)', 'az orvoshoz — to the doctor']
          ]
        }
      },
      {
        heading: 'City names: -ban or -n?',
        body: 'Most foreign cities take -ban/-ben (Londonban), but most Hungarian cities take -n/-on/-en (Budapesten, Szegeden). You just have to learn these — even Hungarians find it charmingly arbitrary.',
        examples: [
          { hu: 'Budapesten lakom.', en: 'I live in Budapest.' },
          { hu: 'Londonban dolgozom.', en: 'I work in London.' }
        ]
      },
      {
        heading: 'Other key suffixes',
        table: {
          headers: ['Suffix', 'Meaning', 'Example'],
          rows: [
            ['-nak / -nek', 'to / for (dative)', 'Annának — for Anna'],
            ['-val / -vel', 'with', 'tejjel — with milk (v assimilates!)'],
            ['-ig', 'until / as far as', 'a térig — up to the square'],
            ['-kor', 'at (time)', 'ötkor — at five o\'clock']
          ]
        }
      }
    ]
  },
  {
    id: 'articles-plurals',
    title: 'Articles, Plurals & Possession',
    icon: '📦',
    summary: 'A / az / egy, the -k plural, and how "my, your, his" become endings too.',
    exercises: [
      { prompt: 'the apple (a or az + alma?)', answer: 'az alma', hint: 'az before a vowel' },
      { prompt: 'the house (a or az + ház?)', answer: 'a ház' },
      { prompt: 'houses (ház + plural)', answer: 'házak' },
      { prompt: 'gardens (kert + plural)', answer: 'kertek' },
      { prompt: 'three houses (három + ...)', answer: 'három ház', hint: 'nouns stay SINGULAR after numbers' },
      { prompt: 'my friend (barát + possessive)', answer: 'barátom' },
      { prompt: 'your friend (informal)', answer: 'barátod' },
      { prompt: 'his/her friend', answer: 'barátja' },
      { prompt: 'I have a dog. → ___ egy kutyám.', answer: 'Van', hint: '"there is my dog"' },
      { prompt: 'I have no time. → ___ időm.', answer: 'Nincs' }
    ],
    sections: [
      {
        heading: 'Articles',
        body: 'The definite article is "a" before consonants and "az" before vowels (like a/an in English, but for "the"). The indefinite article is "egy" (also the word for "one").',
        examples: [
          { hu: 'a ház', en: 'the house' },
          { hu: 'az alma', en: 'the apple' },
          { hu: 'egy sör', en: 'a beer' }
        ]
      },
      {
        heading: 'Plural: -k',
        body: 'Add -k, with a harmonising linking vowel if the word ends in a consonant. BUT: after numbers and quantity words, keep the singular!',
        examples: [
          { hu: 'házak', en: 'houses' },
          { hu: 'kertek', en: 'gardens' },
          { hu: 'három ház', en: 'three house(s) — singular after numbers!' },
          { hu: 'sok ember', en: 'many people — singular after "sok"!' }
        ]
      },
      {
        heading: 'Possession is a suffix',
        body: 'Instead of "my/your/his", Hungarian puts endings on the noun: -m (my), -d (your), -a/-e/-ja/-je (his/her).',
        examples: [
          { hu: 'barátom', en: 'my friend' },
          { hu: 'barátod', en: 'your friend' },
          { hu: 'barátja', en: 'his/her friend' },
          { hu: 'a családom', en: 'my family' }
        ]
      },
      {
        heading: '"I have" = "there is my..."',
        body: 'Hungarian has no verb "to have". Instead: Van egy kutyám = "There is my dog" = I have a dog.',
        examples: [
          { hu: 'Van egy kutyám.', en: 'I have a dog.' },
          { hu: 'Van két gyerekem.', en: 'I have two children.' },
          { hu: 'Nincs időm.', en: 'I have no time. (nincs = there is not)' }
        ]
      }
    ]
  },
  {
    id: 'word-order',
    title: 'Word Order & Questions',
    icon: '🔀',
    summary: 'Word order is flexible but not random: the position right before the verb is the spotlight.',
    exercises: [
      { prompt: '"I do not understand." — type the whole sentence', answer: 'Nem értem', hint: 'nem goes right before the verb' },
      { prompt: '"Anna is not a teacher." — type the whole sentence', answer: 'Anna nem tanár' },
      { prompt: '"I do not want coffee." — type the whole sentence', answer: 'Nem kérek kávét' },
      { prompt: 'Question word: What?', answer: 'Mi' },
      { prompt: 'Question word: Who?', answer: 'Ki' },
      { prompt: 'Question word: Where?', answer: 'Hol' },
      { prompt: 'Question word: Where to?', answer: ['Hova', 'Hová'] },
      { prompt: 'Question word: When?', answer: 'Mikor' },
      { prompt: 'Question word: Why?', answer: 'Miért' },
      { prompt: 'Emphasise BUDAPEST: Anna ___ lakik.', answer: 'Budapesten', hint: 'the focus slot is right before the verb' }
    ],
    sections: [
      {
        heading: 'Focus position',
        body: 'The element immediately before the verb carries the emphasis (the "focus"). Moving words changes what you stress, not the basic meaning.',
        examples: [
          { hu: 'Anna Budapesten lakik.', en: 'Anna lives in BUDAPEST (not elsewhere).' },
          { hu: 'Budapesten Anna lakik.', en: 'It is ANNA who lives in Budapest.' }
        ]
      },
      {
        heading: 'Yes/no questions: just intonation',
        body: 'A yes/no question has the same word order as a statement — only the melody changes (rise on the second-to-last syllable). In writing, just add a question mark.',
        examples: [
          { hu: 'Beszélsz angolul.', en: 'You speak English.' },
          { hu: 'Beszélsz angolul?', en: 'Do you speak English?' }
        ]
      },
      {
        heading: 'Question words',
        table: {
          headers: ['Hungarian', 'English'],
          rows: [
            ['Mi?', 'What?'],
            ['Ki?', 'Who?'],
            ['Hol?', 'Where?'],
            ['Hova?', 'Where to?'],
            ['Mikor?', 'When?'],
            ['Miért?', 'Why?'],
            ['Hogy(an)?', 'How?'],
            ['Mennyi? / Hány?', 'How much? / How many?']
          ]
        }
      },
      {
        heading: 'Negation: nem before the verb',
        examples: [
          { hu: 'Nem értem.', en: 'I do not understand.' },
          { hu: 'Nem kérek kávét.', en: 'I do not want coffee.' },
          { hu: 'Anna nem tanár.', en: 'Anna is not a teacher.' }
        ]
      }
    ]
  },
  {
    id: 'past-tense',
    title: 'The Past Tense',
    icon: '⏪',
    summary: 'One past tense covers "I went", "I was going" and "I have gone" — add -t- (or -ott/-ett/-ött) and the endings you know.',
    exercises: [
      { prompt: 'I learned (tanulni)', answer: 'tanultam' },
      { prompt: 'you spoke (beszélni, informal singular)', answer: 'beszéltél' },
      { prompt: 'he/she knew (tudni — linking vowel!)', answer: 'tudott' },
      { prompt: 'we went (menni)', answer: 'mentünk' },
      { prompt: 'I was (lenni)', answer: 'voltam' },
      { prompt: 'they were (lenni)', answer: 'voltak' },
      { prompt: 'he/she ate (enni — irregular!)', answer: 'evett' },
      { prompt: 'he/she drank (inni — irregular!)', answer: 'ivott' },
      { prompt: '"Anna was a teacher." — type the whole sentence', answer: 'Anna tanár volt', hint: 'in the past tense volt is NOT dropped' },
      { prompt: 'she drank THE coffee → ___ a kávét.', answer: 'Itta', hint: 'definite object, definite past' },
      { prompt: 'I lived in London (lakni) → Londonban ___.', answer: 'laktam' }
    ],
    sections: [
      {
        heading: 'One past tense — lucky you',
        body: 'Modern Hungarian has a single past tense. "I went", "I was going" and "I have gone" are all mentem. The marker is -t- (after vowels and some consonants written -tt-), followed by the same personal endings you already know from the present.',
        examples: [
          { hu: 'Tegnap dolgoztam.', en: 'Yesterday I worked.' },
          { hu: 'Magyarul tanultam.', en: 'I learned / was learning / have learned Hungarian.' }
        ]
      },
      {
        heading: 'The pattern: stem + t + ending',
        table: {
          headers: ['Person', 'tanul (back)', 'kér (front)'],
          rows: [
            ['én', 'tanultam', 'kértem'],
            ['te', 'tanultál', 'kértél'],
            ['ő', 'tanult', 'kért'],
            ['mi', 'tanultunk', 'kértünk'],
            ['ti', 'tanultatok', 'kértetek'],
            ['ők', 'tanultak', 'kértek']
          ]
        }
      },
      {
        heading: 'The linking vowel: -ott / -ett / -ött',
        body: 'Many verbs take a linking vowel before the -tt in the 3rd person singular (and some in every form). The vowel follows harmony: tudott (back), főzött (front rounded). The irregular pair enni/inni have v-stems here: evett, ivott.',
        examples: [
          { hu: 'tudott', en: 'he/she knew' },
          { hu: 'látott', en: 'he/she saw' },
          { hu: 'olvasott', en: 'he/she read' },
          { hu: 'főzött', en: 'he/she cooked' },
          { hu: 'evett', en: 'he/she ate (irregular)' },
          { hu: 'ivott', en: 'he/she drank (irregular)' }
        ]
      },
      {
        heading: 'The past of lenni: volt-',
        body: 'The past of "to be" is completely regular once you know the stem vol-. And note: the drop-van rule does NOT apply in the past — "Anna is a teacher" is Anna tanár, but "Anna WAS a teacher" is Anna tanár volt.',
        table: {
          headers: ['Person', 'Hungarian', 'English'],
          rows: [
            ['én', 'voltam', 'I was'],
            ['te', 'voltál', 'you were'],
            ['ő', 'volt', 'he/she/it was'],
            ['mi', 'voltunk', 'we were'],
            ['ti', 'voltatok', 'you (pl.) were'],
            ['ők', 'voltak', 'they were']
          ]
        },
        examples: [
          { hu: 'Anna tanár volt.', en: 'Anna was a teacher. (volt is kept!)' },
          { hu: 'Tavaly Budapesten voltunk.', en: 'Last year we were in Budapest.' }
        ]
      },
      {
        heading: 'The definite past',
        body: 'Just like the present, the past has definite endings for specific objects: -tam/-tad/-ta… The 3rd person is the one you will hear most.',
        examples: [
          { hu: 'Ittam egy kávét.', en: 'I drank a coffee. (indefinite)' },
          { hu: 'Itta a kávét.', en: 'She/He drank the coffee. (definite)' },
          { hu: 'Olvastad a könyvet?', en: 'Did you read the book?' }
        ]
      },
      {
        heading: 'Words that put you in the past',
        body: 'These time adverbs almost always come with a past-tense verb — hear one, expect a -t- on the verb.',
        examples: [
          { hu: 'tegnap', en: 'yesterday' },
          { hu: 'tegnapelőtt', en: 'the day before yesterday' },
          { hu: 'múlt héten', en: 'last week' },
          { hu: 'tavaly', en: 'last year' },
          { hu: 'régen', en: 'long ago / in the old days' }
        ]
      }
    ]
  },
  {
    id: 'formal-register',
    title: 'Formal Register (magázás)',
    icon: '🎩',
    summary: 'How officials, doctors and strangers speak to you — Ön, third-person verbs, and the polite -né/-na endings.',
    exercises: [
      { prompt: 'The formal "you" pronoun', answer: 'Ön' },
      { prompt: 'How are you? (formal) → Hogy ___?', answer: 'van', hint: 'Ön takes third-person verbs' },
      { prompt: 'Where do you live? (formal) → Hol ___?', answer: 'lakik' },
      { prompt: 'Do you speak Hungarian? (formal) → ___ magyarul?', answer: 'Beszél' },
      { prompt: 'Could you repeat it? (one word, conditional)', answer: 'Megismételné' },
      { prompt: 'Could you help? (one word, conditional)', answer: 'Segítene' },
      { prompt: 'Could you speak more slowly? → ___ lassabban?', answer: 'Beszélne' },
      { prompt: 'More slowly, please. (two words)', answer: 'Lassabban, kérem' },
      { prompt: 'What is your occupation? → Mi a ___?', answer: 'foglalkozása' },
      { prompt: 'I have been married for eight years. → Nyolc ___ vagyok házas.', answer: 'éve' }
    ],
    sections: [
      {
        heading: 'Ön takes third-person verbs',
        body: 'Hungarian has two "you". With friends you use te and second-person verbs; with officials and strangers you use Ön (or magázás with no pronoun at all) and the verb goes into the THIRD person — grammatically you are talking about the person, not to them. This is why interview questions sound like statements about someone else.',
        table: {
          headers: ['Informal (te)', 'Formal (Ön)', 'English'],
          rows: [
            ['Hogy vagy?', 'Hogy van?', 'How are you?'],
            ['Hol laksz?', 'Hol lakik?', 'Where do you live?'],
            ['Mit csinálsz?', 'Mit csinál?', 'What do you do?'],
            ['Beszélsz magyarul?', 'Beszél magyarul?', 'Do you speak Hungarian?'],
            ['Házas vagy?', 'Ön házas?', 'Are you married?'],
            ['Vannak gyerekeid?', 'Vannak gyermekei?', 'Do you have children?'],
            ['Mikor születtél?', 'Mikor született?', 'When were you born?']
          ]
        }
      },
      {
        heading: 'Polite requests: the conditional -na / -ne / -ná / -né',
        body: 'A request becomes polite by putting the verb in the conditional — literally "would you repeat it?" rather than "repeat it". This is the single most useful pattern in an official conversation.',
        examples: [
          { hu: 'Megismételné?', en: 'Could you repeat it?' },
          { hu: 'Lebetűzné a nevét?', en: 'Could you spell your name?' },
          { hu: 'Segítene?', en: 'Could you help?' },
          { hu: 'Beszélne lassabban?', en: 'Could you speak more slowly?' },
          { hu: 'Megmondaná, hol van a mosdó?', en: 'Could you tell me where the toilet is?' }
        ]
      },
      {
        heading: 'Instructions come as formal imperatives',
        body: 'Officials give instructions with the third-person imperative, which usually ends in -on / -en / -jon / -jen. You mostly need to RECOGNISE these, not produce them.',
        examples: [
          { hu: 'Foglaljon helyet!', en: 'Please take a seat.' },
          { hu: 'Jöjjön be, kérem!', en: 'Come in, please.' },
          { hu: 'Írja alá itt!', en: 'Sign here.' },
          { hu: 'Várjon egy pillanatot!', en: 'Wait a moment.' },
          { hu: 'Mondja el újra!', en: 'Say it again.' }
        ]
      },
      {
        heading: 'When you did not understand',
        body: 'Have these ready — asking for a repeat in Hungarian is far better than switching to English.',
        examples: [
          { hu: 'Elnézést, megismételné?', en: 'Sorry, could you repeat that?' },
          { hu: 'Nem hallottam tisztán.', en: 'I did not hear it clearly.' },
          { hu: 'Lassabban, kérem.', en: 'More slowly, please.' },
          { hu: 'Ezt nem értem. Mit jelent?', en: 'I do not understand this. What does it mean?' },
          { hu: 'Elnézést az akcentusomért.', en: 'Sorry about my accent.' }
        ]
      },
      {
        heading: 'Questions you will hear in an interview',
        body: 'Learn to recognise the question, then answer with a short pattern.',
        table: {
          headers: ['Question', 'English'],
          rows: [
            ['Ön házas?', 'Are you married?'],
            ['Mióta házas?', 'How long have you been married?'],
            ['Mikor házasodtak össze?', 'When did you get married?'],
            ['Milyen nemzetiségű a házastársa?', "What is your spouse's nationality?"],
            ['Vannak gyermekei? Hány évesek?', 'Do you have children? How old are they?'],
            ['Mikor születtek a gyermekei?', 'When were your children born?'],
            ['Hol laknak jelenleg?', 'Where do you currently live?'],
            ['Mi a foglalkozása?', 'What is your occupation?'],
            ['Szereti a munkáját?', 'Do you like your job?'],
            ['Miért szeretne magyar állampolgár lenni?', 'Why do you want to become a Hungarian citizen?']
          ]
        }
      },
      {
        heading: 'Answer patterns',
        body: 'Short and correct beats long and broken. Swap the bracketed part.',
        examples: [
          { hu: '[Nyolc] éve vagyok házas.', en: 'I have been married for [eight] years.' },
          { hu: '[2018] óta vagyunk házasok.', en: 'We have been married since [2018].' },
          { hu: '[Két] gyermekem van: egy fiam és egy lányom.', en: 'I have [two] children: a son and a daughter.' },
          { hu: '[Szoftverfejlesztő] vagyok, egy [gyártó] cégnél dolgozom.', en: 'I am a [software developer], I work at a [manufacturing] company.' },
          { hu: 'Jelenleg [Angliában] lakunk.', en: 'We currently live in [England].' }
        ]
      }
    ]
  },
  {
    id: 'dates-life-events',
    title: 'Dates & Life Events',
    icon: '💍',
    summary: 'How to say when something happened — "We got married on 12 June 2021" — with dates, the past tense and marriage verbs.',
    exercises: [
      { prompt: 'third (3 → ordinal)', answer: 'harmadik' },
      { prompt: 'fifth (5 → ordinal)', answer: 'ötödik' },
      { prompt: 'first (the irregular one!)', answer: 'első' },
      { prompt: 'on the 2nd (spoken form)', answer: 'másodikán' },
      { prompt: 'on the 1st (irregular spoken form)', answer: 'elsején' },
      { prompt: 'in 2010 (digits + ending)', answer: '2010-ben' },
      { prompt: 'June (watch the capitalisation!)', answer: 'június', hint: 'months are not capitalised' },
      { prompt: 'We have been married since 2010. → 2010 ___ vagyunk házasok.', answer: 'óta' },
      { prompt: 'I have been learning Hungarian for six months. → Hat ___ tanulok magyarul.', answer: 'hónapja' },
      { prompt: 'We got married. (couple, neutral — össze + házasodik, past)', answer: 'Összeházasodtunk' }
    ],
    sections: [
      {
        heading: 'The sentence pattern',
        body: 'Dates run big to small: year, month, day. The day takes the "on" ending -án / -én, and the verb goes into the past tense. Swap the bracketed parts for your own date.',
        examples: [
          { hu: '[2021]. [június] [12]-én házasodtunk össze.', en: 'We got married on [12] [June] [2021].' },
          { hu: '2021. június 12-én házasodtunk össze.', en: 'We got married on 12 June 2021.' },
          { hu: '1998. augusztus 8-án született.', en: 'She/He was born on 8 August 1998.' },
          { hu: 'Jövő nyáron lesz az esküvőnk.', en: 'Our wedding will be next summer.' }
        ]
      },
      {
        heading: 'Ordinals: cardinal + -dik',
        body: 'Ordinals are built by adding -dik to the cardinal number, with a linking vowel chosen by vowel harmony (-adik / -edik / -odik / -ödik). Only első (first) is irregular. In writing, use a full stop after the digit: 3. emelet = 3rd floor. To ask, use hányadik? (which one in order?).',
        table: {
          headers: ['Number', 'Cardinal', 'Ordinal'],
          rows: [
            ['1', 'egy', 'első (irregular!)'],
            ['2', 'kettő / két', 'második (irregular!)'],
            ['3', 'három', 'harmadik'],
            ['4', 'négy', 'negyedik'],
            ['5', 'öt', 'ötödik'],
            ['6', 'hat', 'hatodik'],
            ['10', 'tíz', 'tizedik'],
            ['20', 'húsz', 'huszadik'],
            ['21', 'huszonegy', 'huszonegyedik'],
            ['100', 'száz', 'századik']
          ]
        },
        examples: [
          { hu: 'A harmadik emeleten lakunk.', en: 'We live on the third floor.' },
          { hu: 'Ez a második esküvőnk.', en: 'This is our second wedding.' },
          { hu: 'Hányadik vagy a sorban?', en: 'Which place are you in the queue?' }
        ]
      },
      {
        heading: 'The day: -án or -én',
        body: 'The day is an ordinal number and the ending follows vowel harmony: back-vowel ordinals take -án, front-vowel ones -én. The 1st is irregular: elsején. In writing you can leave the ordinal unspelled and just attach the ending to the digits (12-én).',
        table: {
          headers: ['Written', 'Spoken', 'English'],
          rows: [
            ['1-jén', 'elsején', 'on the 1st'],
            ['2-án', 'másodikán', 'on the 2nd'],
            ['3-án', 'harmadikán', 'on the 3rd'],
            ['4-én', 'negyedikén', 'on the 4th'],
            ['5-én', 'ötödikén', 'on the 5th'],
            ['12-én', 'tizenkettedikén', 'on the 12th'],
            ['20-án', 'huszadikán', 'on the 20th'],
            ['31-én', 'harmincegyedikén', 'on the 31st']
          ]
        }
      },
      {
        heading: 'The months',
        body: 'Months are not capitalised in Hungarian, and most are recognisable from English.',
        table: {
          headers: ['Hungarian', 'English'],
          rows: [
            ['január / február / március', 'January / February / March'],
            ['április / május / június', 'April / May / June'],
            ['július / augusztus / szeptember', 'July / August / September'],
            ['október / november / december', 'October / November / December']
          ]
        }
      },
      {
        heading: 'Years: -ban / -ben',
        body: 'For a bare year, use the "in" ending: 2021-ben (kétezer-huszonegyben). If you give the full date, the year takes no ending — only the day does.',
        examples: [
          { hu: '2010-ben házasodtunk össze.', en: 'We got married in 2010.' },
          { hu: '2010 nyarán házasodtunk össze.', en: 'We got married in the summer of 2010.' },
          { hu: '2010 májusában született.', en: 'She/He was born in May 2010.' }
        ]
      },
      {
        heading: 'How long? éve, óta and a "still true" present tense',
        body: 'For a state that started in the past and is STILL true, Hungarian uses the present tense — "I am married for twelve years", not "I have been". Two ways to say it: éve (for a length of time) or óta (since a point in time). After a number, év stays singular: tizenkét éve, never tizenkét évek. Ask with Mióta? (Since when? / How long?).',
        table: {
          headers: ['Hungarian', 'English', 'Built from'],
          rows: [
            ['Tizenkét éve vagyok házas.', 'I have been married for twelve years.', 'number + éve'],
            ['Két éve vagyunk házasok.', 'We have been married for two years.', 'plural subject → házasok'],
            ['2010 óta vagyunk házasok.', 'We have been married since 2010.', 'year + óta'],
            ['Egy éve élünk itt.', 'We have lived here for a year.', 'number + éve'],
            ['Hat hónapja tanulok magyarul.', 'I have been learning Hungarian for six months.', 'number + hónapja'],
            ['Mióta házas?', 'How long have you been married? (formal)', 'question word']
          ]
        },
        examples: [
          { hu: 'Mióta házas? — Tizenkét éve.', en: 'How long have you been married? — Twelve years.' },
          { hu: 'Mikor házasodtak össze? — 2010-ben.', en: 'When did you get married? — In 2010.' },
          { hu: 'Tizenkét éve házasodtunk össze.', en: 'We got married twelve years ago.' }
        ]
      },
      {
        heading: 'Careful: éve means both "for" and "ago"',
        body: 'With a present-tense verb, éve means "for" (a state that continues). With a past-tense verb, the same word means "ago" (a finished event). The verb tense carries the difference.',
        examples: [
          { hu: 'Tizenkét éve vagyok házas.', en: 'I have been married for twelve years. (still married)' },
          { hu: 'Tizenkét éve megnősültem.', en: 'Twelve years ago I got married. (the event)' }
        ]
      },
      {
        heading: 'The past tense: add -t- + endings',
        body: 'Past tense inserts -t- (or -ott/-ett/-ött) before the personal ending: házasodunk (we marry) → házasodtunk (we married).',
        table: {
          headers: ['Person', 'Present', 'Past'],
          rows: [
            ['I', 'megnősülök', 'megnősültem'],
            ['you (sg.)', 'megnősülsz', 'megnősültél'],
            ['he/she', 'megnősül', 'megnősült'],
            ['we', 'összeházasodunk', 'összeházasodtunk'],
            ['you (pl.)', 'összeházasodtok', 'összeházasodtatok'],
            ['they', 'összeházasodnak', 'összeházasodtak']
          ]
        }
      },
      {
        heading: 'Who is marrying changes the verb',
        body: 'A woman "goes to a husband" (férjhez megy), a man "takes a wife" (megnősül), and a couple together "marry each other" (összeházasodnak).',
        examples: [
          { hu: '2021. június 12-én mentem férjhez.', en: 'I got married on 12 June 2021. (woman speaking)' },
          { hu: '2021. június 12-én nősültem meg.', en: 'I got married on 12 June 2021. (man speaking)' },
          { hu: 'Tavaly eljegyeztük egymást.', en: 'We got engaged last year.' },
          { hu: 'Két éve elváltak.', en: 'They divorced two years ago.' }
        ]
      },
      {
        heading: 'Why "házasodtunk össze" and not "összeházasodtunk"?',
        body: 'When something else is in focus — here the date — the verb prefix (össze, meg, férjhez) jumps behind the verb. Same verb, different spotlight.',
        examples: [
          { hu: 'Összeházasodtunk.', en: 'We got married. (neutral)' },
          { hu: 'Június 12-én házasodtunk össze.', en: 'It was on 12 June that we got married.' },
          { hu: 'Megnősültem.', en: 'I got married. (neutral, man speaking)' },
          { hu: 'Tavaly nősültem meg.', en: 'It was last year that I got married.' }
        ]
      }
    ]
  },
  {
    id: 'future',
    title: 'Talking About the Future',
    icon: '🔭',
    summary: 'Three ways forward: the present tense with a time word, majd, and fog + infinitive — plus lesz, the future of van.',
    exercises: [
      { prompt: 'I will cook tomorrow. → Holnap ___ főzni. (fog, én)', answer: 'fogok' },
      { prompt: 'What will you do at the weekend? → Mit ___ csinálni hétvégén? (fog, te)', answer: 'fogsz' },
      { prompt: 'We will learn Hungarian. → Magyarul ___ tanulni. (fog, mi)', answer: 'fogunk' },
      { prompt: 'She will read THE book. → El ___ olvasni a könyvet. (fog, ő, definite)', answer: 'fogja' },
      { prompt: 'She will be a doctor next year. → Jövőre orvos ___.', answer: 'lesz', hint: 'lesz is the future of van' },
      { prompt: 'I will be at home. → Otthon ___.', answer: 'leszek' },
      { prompt: 'It will be cold tomorrow. → Holnap hideg ___.', answer: 'lesz' },
      { prompt: 'They will be happy. → Boldogok ___.', answer: 'lesznek' },
      { prompt: '"See you later / then we will meet" — Akkor ___ találkozunk. (the little future word)', answer: 'majd' }
    ],
    sections: [
      {
        heading: 'The present tense often IS the future',
        body: 'With a time word, Hungarian happily uses the present tense for future plans — like English "I am flying tomorrow". This is the most common future in speech.',
        examples: [
          { hu: 'Holnap dolgozom.', en: 'I am working tomorrow.' },
          { hu: 'Jövőre Magyarországra költözünk.', en: 'We are moving to Hungary next year.' }
        ]
      },
      {
        heading: 'majd — the one-word future',
        body: 'majd ("later / some time") pushes a sentence into the future all by itself, often with a reassuring flavour.',
        examples: [
          { hu: 'Majd megcsinálom.', en: 'I will do it (later, don\'t worry).' },
          { hu: 'Majd meglátjuk.', en: 'We will see.' }
        ]
      },
      {
        heading: 'fog + infinitive — the explicit future',
        body: 'For emphasis or when there is no time word, conjugate fog and add the infinitive. fog takes definite endings when the object is definite, just like any verb.',
        table: {
          headers: ['Person', 'Indefinite', 'Definite'],
          rows: [
            ['én', 'fogok', 'fogom'],
            ['te', 'fogsz', 'fogod'],
            ['ő', 'fog', 'fogja'],
            ['mi', 'fogunk', 'fogjuk'],
            ['ti', 'fogtok', 'fogjátok'],
            ['ők', 'fognak', 'fogják']
          ]
        },
        examples: [
          { hu: 'Sokat fogok tanulni.', en: 'I will study a lot.' },
          { hu: 'El fogja olvasni a könyvet.', en: 'She will read the book.' }
        ]
      },
      {
        heading: 'lesz — the future of van',
        body: '"To be" has a real future: lesz. Use it wherever the future of van/vannak is needed — including weather and becoming.',
        examples: [
          { hu: 'Holnap hideg lesz.', en: 'It will be cold tomorrow.' },
          { hu: 'Orvos lesz.', en: 'She will be(come) a doctor.' },
          { hu: 'Ott leszek hatkor.', en: 'I will be there at six.' }
        ]
      }
    ]
  },
  {
    id: 'conditional-mood',
    title: 'Would: The Conditional',
    icon: '🤔',
    summary: 'Mennék, kérnék, szeretném — wishes, polite requests and if-sentences with the -na/-ne/-ná/-né endings.',
    exercises: [
      { prompt: 'I would know (tudni, indefinite)', answer: 'tudnék', hint: '1sg is ALWAYS -nék, even for back verbs' },
      { prompt: 'I would drink (inni, indefinite)', answer: 'innék' },
      { prompt: 'you would go (menni, informal singular)', answer: 'mennél' },
      { prompt: 'we would cook (főzni, indefinite)', answer: 'főznénk' },
      { prompt: 'they would drink (inni, indefinite)', answer: 'innának' },
      { prompt: 'I would ask for IT (kérni, definite)', answer: 'kérném' },
      { prompt: 'I would buy the house: Megvenném / Megvennék? → Meg___ a házat.', answer: 'venném', hint: 'definite object' },
      { prompt: 'If I were rich… → Ha gazdag ___… (lenni, én)', answer: ['lennék', 'volnék'] },
      { prompt: 'he/she would eat (enni, indefinite)', answer: 'enne' },
      { prompt: '"I would like a coffee" (the polite classic): ___ egy kávét.', answer: 'Szeretnék' }
    ],
    sections: [
      {
        heading: 'The endings',
        body: 'Insert -na/-ne (or -ná/-né before personal endings) after the stem. Watch the famous exception: the 1sg indefinite is -nék for EVERY verb — back verbs included (tudnék, adnék, innék), never *tudnák.',
        table: {
          headers: ['Person', 'tanul (back)', 'kér (front)'],
          rows: [
            ['én', 'tanulnék (!)', 'kérnék'],
            ['te', 'tanulnál', 'kérnél'],
            ['ő', 'tanulna', 'kérne'],
            ['mi', 'tanulnánk', 'kérnénk'],
            ['ti', 'tanulnátok', 'kérnétek'],
            ['ők', 'tanulnának', 'kérnének']
          ]
        }
      },
      {
        heading: 'The definite conditional',
        body: 'With a definite object the endings are -nám/-nád/-ná… (back) and -ném/-néd/-né… (front). A curiosity: a front verb\'s definite 3pl (szeretnék — they would love it) is spelled exactly like the indefinite 1sg (szeretnék — I would like). Context decides.',
        table: {
          headers: ['Person', 'tanul (back)', 'kér (front)'],
          rows: [
            ['én', 'tanulnám', 'kérném'],
            ['te', 'tanulnád', 'kérnéd'],
            ['ő', 'tanulná', 'kérné'],
            ['mi', 'tanulnánk', 'kérnénk'],
            ['ti', 'tanulnátok', 'kérnétek'],
            ['ők', 'tanulnák', 'kérnék']
          ]
        }
      },
      {
        heading: 'szeretnék — your politest tool',
        body: 'The conditional of szeret is how Hungarians say "I would like": szeretnék + infinitive or noun (indefinite), szeretném (definite). You have been using it since lesson one — now you know why it works.',
        examples: [
          { hu: 'Szeretnék egy kávét.', en: 'I would like a coffee.' },
          { hu: 'Szeretnék időpontot kérni.', en: 'I would like to ask for an appointment.' },
          { hu: 'Szeretném megköszönni.', en: 'I would like to say thank you (for it).' }
        ]
      },
      {
        heading: 'If-sentences: ha… (akkor…)',
        body: 'Unreal conditions put BOTH halves in the conditional — unlike English, which mixes "if I had" with "I would".',
        examples: [
          { hu: 'Ha gazdag lennék, házat vennék.', en: 'If I were rich, I would buy a house.' },
          { hu: 'Ha több időm lenne, többet olvasnék.', en: 'If I had more time, I would read more.' },
          { hu: 'Mit csinálnál, ha nyernél?', en: 'What would you do if you won?' }
        ]
      }
    ]
  },
  {
    id: 'imperative-mood',
    title: 'Commands & Requests',
    icon: '📣',
    summary: 'Menj! Kérj! Legyél jó! — the -j imperative, its assimilation tricks, and the fused forms add, edd, lásd.',
    exercises: [
      { prompt: 'Go! (menni, te)', answer: ['menj', 'menjél'] },
      { prompt: 'Ask! (kérni, te)', answer: ['kérj', 'kérjél'] },
      { prompt: 'Read! (olvasni, te — the s doubles!)', answer: ['olvass', 'olvassál'] },
      { prompt: 'Cook! (főzni, te — the z doubles!)', answer: ['főzz', 'főzzél'] },
      { prompt: 'Eat! (enni, te — irregular)', answer: 'egyél' },
      { prompt: 'Come! (jönni, te — the everyday word)', answer: ['gyere', 'jöjj', 'jöjjél'] },
      { prompt: 'Be good! → ___ jó! (lenni, te)', answer: ['legyél', 'légy'] },
      { prompt: 'Give it here! → ___ ide! (adni, te, definite)', answer: ['add', 'adjad'] },
      { prompt: 'See it! (látni, te, definite — irregular fused form)', answer: ['lásd', 'lássad'] },
      { prompt: "Don't go away! → Ne ___ el! (menni, te)", answer: ['menj', 'menjél'], hint: 'ne + imperative; the coverb splits off' }
    ],
    sections: [
      {
        heading: 'The marker: -j + the usual endings',
        body: 'The imperative inserts -j- after the stem: menjek (let me go), menj (go!), menjen (let him go / formal go!), menjünk (let\'s go!), menjetek, menjenek. The 2sg has a short form (menj) and a long form (menjél) — both correct; the short one is snappier.',
        table: {
          headers: ['Person', 'menni', 'English'],
          rows: [
            ['én', 'menjek', 'let me go'],
            ['te', 'menj / menjél', 'go!'],
            ['ő / Ön', 'menjen', 'let him go / go! (formal)'],
            ['mi', 'menjünk', "let's go!"],
            ['ti', 'menjetek', 'go! (plural)'],
            ['ők / Önök', 'menjenek', 'let them go / go! (formal pl.)']
          ]
        }
      },
      {
        heading: 'The -j assimilates',
        body: 'After sibilants and t, the -j- changes shape — these are the forms you hear every day:',
        table: {
          headers: ['Stem ends in', 'What happens', 'Example'],
          rows: [
            ['s', 's doubles', 'olvas → olvass! (read!)'],
            ['z', 'z doubles', 'főz → főzz! (cook!)'],
            ['t after long vowel', 't + j → ss', 'lát → láss! (see!)'],
            ['t after short vowel', 't + j → ss', 'szeret → szeress! (love!)'],
            ['d', 'written dj, said ggy', 'ad → adj! (give!)']
          ]
        }
      },
      {
        heading: 'The famous fused definites',
        body: 'The 2sg definite imperative fuses into a short punchy form — some of the most common words in the language.',
        examples: [
          { hu: 'Add ide!', en: 'Give it here! (adni)' },
          { hu: 'Edd meg!', en: 'Eat it up! (enni)' },
          { hu: 'Idd meg!', en: 'Drink it up! (inni)' },
          { hu: 'Vedd meg!', en: 'Buy it! (venni)' },
          { hu: 'Lásd!', en: 'See it! (látni — mostly in writing)' },
          { hu: 'Írd le!', en: 'Write it down! (írni)' }
        ]
      },
      {
        heading: 'Negative commands: ne + imperative',
        body: 'Prohibition uses ne (not nem) with the imperative. A coverb splits off and follows the verb.',
        examples: [
          { hu: 'Ne menj el!', en: 'Do not go away!' },
          { hu: 'Ne edd meg!', en: 'Do not eat it!' },
          { hu: 'Ne legyél szomorú!', en: 'Do not be sad!' }
        ]
      },
      {
        heading: 'Where else the imperative hides',
        body: 'Hungarian also uses these forms after "akarom, hogy…" (I want that…) and in polite formal instructions — you met those in the Formal Register guide (Foglaljon helyet!).',
        examples: [
          { hu: 'Azt akarom, hogy gyere.', en: 'I want you to come.' },
          { hu: 'Fontos, hogy sokat gyakoroljunk.', en: 'It is important that we practise a lot.' }
        ]
      }
    ]
  },
  {
    id: 'coverbs',
    title: 'Coverbs: meg, el, ki…',
    icon: '🧲',
    summary: 'Tiny prefixes with big power: megír vs ír, and the rules for when the prefix jumps off the verb.',
    exercises: [
      { prompt: '"I write the letter (and finish it)": ___írom a levelet', answer: 'megírom', hint: 'meg- = completed action' },
      { prompt: '"She goes out": ___megy', answer: 'kimegy' },
      { prompt: '"We travel away/off": ___utazunk', answer: 'elutazunk' },
      { prompt: '"I get up": ___kelek', answer: 'felkelek' },
      { prompt: '"They come back": ___jönnek', answer: 'visszajönnek' },
      { prompt: 'Negation splits the coverb: Nem ___ meg a levelet. (írni, én, definite)', answer: 'írom' },
      { prompt: 'Imperative splits it too — "Write it (down)!": ___ meg! (írni, te, definite)', answer: ['írd', 'írjad'] },
      { prompt: '"Did you eat it?" — "Yes." The one-word Hungarian yes-answer to Megetted?', answer: 'Meg', hint: 'answer with the bare coverb' },
      { prompt: '"Don\'t drink it!": Ne ___ meg! (inni, te, definite)', answer: ['idd', 'igyad'] }
    ],
    sections: [
      {
        heading: 'What a coverb does',
        body: 'A coverb (igekötő) glues onto the front of a verb and usually makes the action complete or adds direction. ír = writes (is writing); megír = writes (and finishes). Learning verb + coverb pairs is what makes your Hungarian sound native.',
        examples: [
          { hu: 'Olvasom a könyvet.', en: 'I am reading the book. (in progress)' },
          { hu: 'Elolvasom a könyvet.', en: 'I will read the book (to the end).' }
        ]
      },
      {
        heading: 'The big seven',
        table: {
          headers: ['Coverb', 'Core meaning', 'Example'],
          rows: [
            ['meg-', 'completion', 'megír — write (fully)'],
            ['el-', 'away / off', 'elmegy — go away, leave'],
            ['ki-', 'out', 'kimegy — go out'],
            ['be-', 'in', 'bejön — come in'],
            ['fel-', 'up', 'felkel — get up'],
            ['le-', 'down', 'leül — sit down'],
            ['vissza-', 'back', 'visszajön — come back']
          ]
        }
      },
      {
        heading: 'When the coverb jumps off',
        body: 'The coverb detaches and moves BEHIND the verb whenever something else takes the focus slot before the verb: negation, question words, focused elements — and in the imperative.',
        examples: [
          { hu: 'Megírom a levelet.', en: 'I will write the letter. (neutral)' },
          { hu: 'Nem írom meg.', en: 'I will not write it.' },
          { hu: 'Mikor írod meg?', en: 'When will you write it?' },
          { hu: 'MOST írom meg.', en: 'I am writing it NOW. (focus)' },
          { hu: 'Írd meg!', en: 'Write it!' }
        ]
      },
      {
        heading: 'The world\'s shortest answers',
        body: 'To answer a yes/no question about a coverb verb, Hungarians often reply with just the coverb — a complete, natural answer.',
        examples: [
          { hu: 'Megírtad a levelet? — Meg.', en: 'Did you write the letter? — Yes (did).' },
          { hu: 'Elolvastad? — El.', en: 'Did you read it? — Yes.' },
          { hu: 'Felkeltél? — Fel.', en: 'Are you up? — Yep.' }
        ]
      }
    ]
  },
  {
    id: 'postpositions',
    title: 'Postpositions',
    icon: '📦',
    summary: 'Az asztal alatt, a ház mögött — the little words that come AFTER the noun, and how they conjugate for people.',
    exercises: [
      { prompt: '"under the table": az asztal ___', answer: 'alatt' },
      { prompt: '"next to the house": a ház ___', answer: 'mellett' },
      { prompt: '"behind the door": az ajtó ___', answer: 'mögött' },
      { prompt: '"in front of the school": az iskola ___', answer: 'előtt' },
      { prompt: '"after dinner": vacsora ___', answer: 'után' },
      { prompt: '"between the two houses": a két ház ___', answer: 'között' },
      { prompt: '"because of the weather": az idő ___', answer: 'miatt' },
      { prompt: '"without milk": tej ___', answer: 'nélkül' },
      { prompt: '"next to me" (one word)', answer: 'mellettem' },
      { prompt: '"without you" (informal singular, one word)', answer: 'nélküled' }
    ],
    sections: [
      {
        heading: 'After the noun, not before',
        body: 'Where English uses a preposition, Hungarian puts the word AFTER a bare noun — no suffix on the noun at all: az asztal alatt (under the table).',
        table: {
          headers: ['Postposition', 'Meaning', 'Example'],
          rows: [
            ['alatt', 'under', 'az asztal alatt'],
            ['felett / fölött', 'above', 'a város felett'],
            ['mellett', 'next to', 'a ház mellett'],
            ['mögött', 'behind', 'az ajtó mögött'],
            ['előtt', 'in front of / before', 'az iskola előtt'],
            ['után', 'after', 'vacsora után'],
            ['között', 'between / among', 'a fák között']
          ]
        }
      },
      {
        heading: 'Not just space',
        body: 'Some postpositions carry abstract meanings — these two you will use constantly:',
        examples: [
          { hu: 'az eső miatt', en: 'because of the rain' },
          { hu: 'cukor nélkül', en: 'without sugar' },
          { hu: 'munka után', en: 'after work' },
          { hu: 'az interjú előtt', en: 'before the interview' }
        ]
      },
      {
        heading: 'Postpositions conjugate for people',
        body: 'To say "next to ME", add the possessive endings to the postposition itself — the same -m/-d/-e endings you know from barátom.',
        table: {
          headers: ['Person', 'mellett (next to)', 'nélkül (without)'],
          rows: [
            ['én', 'mellettem', 'nélkülem'],
            ['te', 'melletted', 'nélküled'],
            ['ő', 'mellette', 'nélküle'],
            ['mi', 'mellettünk', 'nélkülünk'],
            ['ti', 'mellettetek', 'nélkületek'],
            ['ők', 'mellettük', 'nélkülük']
          ]
        },
        examples: [
          { hu: 'Ülj mellém!', en: 'Sit next to me! (direction: mellé + m)' },
          { hu: 'Miattam ne aggódj!', en: 'Do not worry because of me!' }
        ]
      }
    ]
  },
  {
    id: 'comparison',
    title: 'Bigger, Best',
    icon: '📈',
    summary: 'nagyobb, a legnagyobb — the -bb comparative, the leg-…-bb superlative, and mint vs -nál/-nél.',
    exercises: [
      { prompt: 'big → bigger (nagy)', answer: 'nagyobb' },
      { prompt: 'beautiful → more beautiful (szép — irregular!)', answer: 'szebb' },
      { prompt: 'good → better (jó — irregular!)', answer: 'jobb' },
      { prompt: 'many/much → more (sok — irregular!)', answer: 'több' },
      { prompt: 'small → smaller (kicsi — irregular!)', answer: 'kisebb' },
      { prompt: 'cold → colder (hideg)', answer: 'hidegebb' },
      { prompt: 'expensive → more expensive (drága)', answer: 'drágább' },
      { prompt: '"the biggest" (nagy, with the article)', answer: ['a legnagyobb', 'legnagyobb'] },
      { prompt: '"the best" (jó, with the article)', answer: ['a legjobb', 'legjobb'] },
      { prompt: 'She is taller THAN me: Magasabb, ___ én.', answer: 'mint' }
    ],
    sections: [
      {
        heading: 'Comparative: -bb',
        body: 'Add -bb (with a linking vowel after consonants): magas → magasabb, hideg → hidegebb. Adjectives ending in a/e lengthen it: drága → drágább, fekete → feketébb.',
        examples: [
          { hu: 'magasabb', en: 'taller' },
          { hu: 'olcsóbb', en: 'cheaper' },
          { hu: 'drágább', en: 'more expensive' }
        ]
      },
      {
        heading: 'Superlative: leg- … -bb',
        body: 'Wrap the comparative in leg- and add the definite article: a legnagyobb (the biggest), a legszebb (the most beautiful).',
        examples: [
          { hu: 'Budapest a legnagyobb magyar város.', en: 'Budapest is the biggest Hungarian city.' },
          { hu: 'Ez a legjobb étterem.', en: 'This is the best restaurant.' }
        ]
      },
      {
        heading: 'The irregulars worth memorising',
        table: {
          headers: ['Base', 'Comparative', 'Superlative'],
          rows: [
            ['jó (good)', 'jobb', 'a legjobb'],
            ['sok (many)', 'több', 'a legtöbb'],
            ['szép (beautiful)', 'szebb', 'a legszebb'],
            ['kicsi (small)', 'kisebb', 'a legkisebb'],
            ['hosszú (long)', 'hosszabb', 'a leghosszabb'],
            ['könnyű (easy/light)', 'könnyebb', 'a legkönnyebb']
          ]
        }
      },
      {
        heading: 'Than: mint, or -nál/-nél',
        body: 'Two equally good ways to compare: "mint + nominative" (magasabb, mint én) or the -nál/-nél suffix on the compared noun (magasabb nálam).',
        examples: [
          { hu: 'A kávé drágább, mint a tea.', en: 'Coffee is more expensive than tea.' },
          { hu: 'A kávé drágább a teánál.', en: 'Coffee is more expensive than tea. (suffix version)' },
          { hu: 'Ő idősebb nálam.', en: 'He is older than me.' }
        ]
      }
    ]
  }
];

export function getGuide(id) {
  return grammarGuides.find((g) => g.id === id) || null;
}
