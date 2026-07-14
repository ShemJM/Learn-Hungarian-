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
  },
  {
    id: 'formal-register',
    title: 'Formal Register (magázás)',
    icon: '🎩',
    summary: 'How officials, doctors and strangers speak to you — Ön, third-person verbs, and the polite -né/-na endings.',
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
  }
];

export function getGuide(id) {
  return grammarGuides.find((g) => g.id === id) || null;
}
