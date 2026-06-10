/**
 * Grammar guides. Each guide: id, title, icon, summary, sections.
 * Sections: { heading, body (plain text, may contain \n for paragraphs), examples: [{hu, en}], table? }.
 */
export const grammarGuides = [
  {
    id: 'alphabet',
    title: 'Alphabet & Pronunciation',
    icon: '🔤',
    summary: 'Hungarian spelling is wonderfully phonetic — once you know the rules, you can pronounce anything.',
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
  }
];

export function getGuide(id) {
  return grammarGuides.find((g) => g.id === id) || null;
}
