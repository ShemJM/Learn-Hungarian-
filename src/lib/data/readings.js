/**
 * Reading exercises. Each: id, title, level, text (array of {hu, en} sentences),
 * questions: multiple-choice comprehension checks.
 */
export const readings = [
  {
    id: 'anna',
    title: 'Anna Budapesten',
    level: 'Beginner',
    icon: '🌆',
    intro: 'A short introduction text. Tap any sentence to reveal its translation, or use the audio button to hear it.',
    text: [
      { hu: 'Anna Budapesten lakik.', en: 'Anna lives in Budapest.' },
      { hu: 'Tanár, és egy iskolában dolgozik.', en: 'She is a teacher, and she works in a school.' },
      { hu: 'Reggel kávét iszik és kenyeret eszik.', en: 'In the morning she drinks coffee and eats bread.' },
      { hu: 'Van egy kutyája, a neve Bodri.', en: 'She has a dog, his name is Bodri.' },
      { hu: 'Este Anna a parkban sétál a kutyával.', en: 'In the evening Anna walks in the park with the dog.' },
      { hu: 'Anna szereti Budapestet, mert a város nagyon szép.', en: 'Anna loves Budapest, because the city is very beautiful.' }
    ],
    questions: [
      {
        q: 'Where does Anna live?',
        choices: ['In Szeged', 'In Budapest', 'In London', 'In a village'],
        answer: 'In Budapest'
      },
      {
        q: 'What is Anna\'s job?',
        choices: ['Doctor', 'Engineer', 'Teacher', 'Cook'],
        answer: 'Teacher'
      },
      {
        q: 'What does she drink in the morning?',
        choices: ['Tea', 'Milk', 'Water', 'Coffee'],
        answer: 'Coffee'
      },
      {
        q: 'Why does Anna love Budapest?',
        choices: ['Because the city is very beautiful', 'Because it is cheap', 'Because her family lives there', 'Because of the food'],
        answer: 'Because the city is very beautiful'
      }
    ]
  },
  {
    id: 'piac',
    title: 'A piacon',
    level: 'Beginner+',
    icon: '🍎',
    intro: 'At the market — practise food words and numbers.',
    text: [
      { hu: 'Péter a piacra megy.', en: 'Péter goes to the market.' },
      { hu: 'A piacon sok gyümölcs van: alma, körte és szilva.', en: 'At the market there is a lot of fruit: apples, pears and plums.' },
      { hu: '„Jó napot! Mennyibe kerül az alma?" — kérdezi Péter.', en: '"Good day! How much do the apples cost?" — asks Péter.' },
      { hu: '„Ötszáz forint egy kiló" — mondja az eladó.', en: '"Five hundred forints a kilo" — says the seller.' },
      { hu: 'Péter két kiló almát és egy kenyeret vesz.', en: 'Péter buys two kilos of apples and a loaf of bread.' },
      { hu: 'Otthon almás pitét süt a családnak.', en: 'At home he bakes apple pie for the family.' }
    ],
    questions: [
      {
        q: 'Where does Péter go?',
        choices: ['To the cinema', 'To the market', 'To school', 'To the station'],
        answer: 'To the market'
      },
      {
        q: 'How much does a kilo of apples cost?',
        choices: ['200 forints', '1000 forints', '500 forints', '50 forints'],
        answer: '500 forints'
      },
      {
        q: 'How many kilos of apples does Péter buy?',
        choices: ['One', 'Two', 'Three', 'Five'],
        answer: 'Two'
      },
      {
        q: 'What does he bake at home?',
        choices: ['Bread', 'Goulash', 'Apple pie', 'Pancakes'],
        answer: 'Apple pie'
      }
    ]
  },
  {
    id: 'kave',
    title: 'A kávéházban',
    level: 'Intermediate',
    icon: '☕',
    intro: 'Budapest is famous for its historic coffee houses. This text uses the past tense — see how much you can follow!',
    text: [
      { hu: 'Tegnap délután Eszter és Gábor egy régi kávéházban találkoztak.', en: 'Yesterday afternoon Eszter and Gábor met in an old coffee house.' },
      { hu: 'A kávéház a Duna mellett van, és száz éves.', en: 'The coffee house is next to the Danube, and it is a hundred years old.' },
      { hu: 'Eszter egy kapucsínót kért, Gábor pedig egy forró csokoládét.', en: 'Eszter asked for a cappuccino, while Gábor asked for a hot chocolate.' },
      { hu: 'Sokat beszélgettek a munkáról és az utazásról.', en: 'They chatted a lot about work and travelling.' },
      { hu: 'Gábor nyáron Olaszországba utazik, Eszter pedig a Balatonhoz megy.', en: 'Gábor is travelling to Italy in the summer, while Eszter is going to Lake Balaton.' },
      { hu: 'A számla kétezer forint volt, és Gábor fizetett.', en: 'The bill was two thousand forints, and Gábor paid.' }
    ],
    questions: [
      {
        q: 'Where did Eszter and Gábor meet?',
        choices: ['In a restaurant', 'In an old coffee house', 'At the station', 'In a park'],
        answer: 'In an old coffee house'
      },
      {
        q: 'What did Gábor order?',
        choices: ['A cappuccino', 'A beer', 'A hot chocolate', 'A tea'],
        answer: 'A hot chocolate'
      },
      {
        q: 'Where is Eszter going in the summer?',
        choices: ['To Italy', 'To Lake Balaton', 'To London', 'To the Danube'],
        answer: 'To Lake Balaton'
      },
      {
        q: 'Who paid the bill?',
        choices: ['Eszter', 'They split it', 'Gábor', 'Nobody'],
        answer: 'Gábor'
      }
    ]
  },
  {
    id: 'egy-napom',
    title: 'Egy napom',
    level: 'Beginner+',
    icon: '☀️',
    intro: 'A day in the past tense — weather, shopping and work all make an appearance.',
    text: [
      { hu: 'Tegnap nagyon hosszú napom volt.', en: 'Yesterday I had a very long day.' },
      { hu: 'Reggel esett az eső, ezért otthon dolgoztam.', en: 'In the morning it was raining, so I worked at home.' },
      { hu: 'Délben kimentem a boltba, és vettem kenyeret meg tejet.', en: 'At noon I went out to the shop and bought bread and milk.' },
      { hu: 'Délután végre kisütött a nap.', en: 'In the afternoon the sun finally came out.' },
      { hu: 'A parkban sétáltam, és találkoztam egy régi barátommal.', en: 'I walked in the park and met an old friend of mine.' },
      { hu: 'Este vacsorát csináltam: gulyáslevest főztem.', en: 'In the evening I made dinner: I cooked goulash soup.' },
      { hu: 'A férjem mosogatott, én pedig olvastam.', en: 'My husband did the dishes, and I read.' },
      { hu: 'Tizenegykor lefeküdtem, mert nagyon fáradt voltam.', en: 'At eleven I went to bed, because I was very tired.' }
    ],
    questions: [
      {
        q: 'Why did the writer work at home in the morning?',
        choices: ['It was raining', 'It was snowing', 'The office was closed', 'She was sick'],
        answer: 'It was raining'
      },
      {
        q: 'What did she buy at the shop?',
        choices: ['Coffee and cake', 'Bread and milk', 'Fruit and wine', 'Medicine'],
        answer: 'Bread and milk'
      },
      {
        q: 'Whom did she meet in the park?',
        choices: ['Her husband', 'A doctor', 'An old friend', 'Her teacher'],
        answer: 'An old friend'
      },
      {
        q: 'What did she cook for dinner?',
        choices: ['Goulash soup', 'Stew', 'Strudel', 'Nothing — they ate out'],
        answer: 'Goulash soup'
      }
    ]
  },
  {
    id: 'az-interju',
    title: 'Az interjú',
    level: 'Intermediate',
    icon: '🪪',
    intro: 'A citizenship interview retold — formal register and past tense, exactly what the exam sounds like.',
    text: [
      { hu: 'Kedden reggel Tom a hivatalba ment.', en: 'On Tuesday morning Tom went to the office.' },
      { hu: 'Kicsit izgult, mert ez volt az állampolgársági interjúja.', en: 'He was a little nervous, because this was his citizenship interview.' },
      { hu: 'Az ügyintéző kedvesen köszöntötte: „Jó reggelt! Foglaljon helyet!”', en: 'The official greeted him kindly: "Good morning! Take a seat!"' },
      { hu: 'Először a családjáról kérdezte: „Mióta házas?”', en: 'First she asked about his family: "How long have you been married?"' },
      { hu: 'Tom válaszolt: „Nyolc éve vagyok házas, a feleségem magyar.”', en: 'Tom answered: "I have been married for eight years; my wife is Hungarian."' },
      { hu: 'Aztán a munkájáról beszélt: szoftverfejlesztőként dolgozik egy angol cégnél.', en: 'Then he talked about his job: he works as a software developer at an English company.' },
      { hu: 'Egyszer nem értette a kérdést, ezért azt mondta: „Elnézést, megismételné?”', en: 'Once he did not understand the question, so he said: "Sorry, could you repeat that?"' },
      { hu: 'Az interjú végén az ügyintéző mosolygott: „Nagyon szépen beszél magyarul.”', en: 'At the end of the interview the official smiled: "You speak Hungarian very nicely."' },
      { hu: 'Tom boldogan ment haza, és felhívta a feleségét.', en: 'Tom went home happily and called his wife.' }
    ],
    questions: [
      {
        q: 'Why was Tom nervous?',
        choices: ['It was his citizenship interview', 'He was late', 'He forgot his documents', 'He lost his job'],
        answer: 'It was his citizenship interview'
      },
      {
        q: 'How long has Tom been married?',
        choices: ['Two years', 'Five years', 'Eight years', 'Ten years'],
        answer: 'Eight years'
      },
      {
        q: 'What did Tom say when he did not understand a question?',
        choices: ['"Elnézést, megismételné?"', '"Viszontlátásra!"', '"Nem tudom."', '"Jó napot kívánok!"'],
        answer: '"Elnézést, megismételné?"'
      },
      {
        q: 'What did the official say at the end?',
        choices: [
          'That he speaks Hungarian very nicely',
          'That he must come back next week',
          'That the interview failed',
          'That he needs more documents'
        ],
        answer: 'That he speaks Hungarian very nicely'
      }
    ]
  },
  {
    id: 'budapesti-level',
    title: 'Levél Budapestről',
    level: 'Intermediate+',
    icon: '✉️',
    intro: 'A letter from a friend — coverbs, comparisons and the future, all in one page.',
    text: [
      { hu: 'Kedves Anna!', en: 'Dear Anna,' },
      { hu: 'Tavaly elköltöztem Budapestre, és nagyon boldog vagyok itt.', en: 'Last year I moved to Budapest, and I am very happy here.' },
      { hu: 'A város nagyobb és zajosabb, mint a falum, de sokkal érdekesebb.', en: 'The city is bigger and noisier than my village, but much more interesting.' },
      { hu: 'Minden nap felfedezek valami újat: egy kávézót, egy parkot, egy régi utcát.', en: 'Every day I discover something new: a café, a park, an old street.' },
      { hu: 'Megismertem néhány kedves embert, és esténként együtt főzünk.', en: 'I have got to know some kind people, and in the evenings we cook together.' },
      { hu: 'A legjobb dolog a Duna: reggelente a part mellett futok.', en: 'The best thing is the Danube: in the mornings I run along the bank.' },
      { hu: 'Jövőre el fogunk utazni a Balatonhoz is.', en: 'Next year we will also travel to Lake Balaton.' },
      { hu: 'Remélem, hamarosan meglátogatsz, és mindent megmutatok neked.', en: 'I hope you will visit me soon, and I will show you everything.' },
      { hu: 'Ölel: Eszter', en: 'Hugs, Eszter' }
    ],
    questions: [
      {
        q: 'When did Eszter move to Budapest?',
        choices: ['Last year', 'Last week', 'Two years ago', 'She has always lived there'],
        answer: 'Last year'
      },
      {
        q: 'How does the city compare to her village?',
        choices: [
          'Bigger, noisier and much more interesting',
          'Smaller but quieter',
          'Exactly the same',
          'Cheaper and sunnier'
        ],
        answer: 'Bigger, noisier and much more interesting'
      },
      {
        q: 'What is the best thing about Budapest for her?',
        choices: ['The Danube', 'The cafés', 'The old streets', 'The parks'],
        answer: 'The Danube'
      },
      {
        q: 'What will they do next year?',
        choices: ['Travel to Lake Balaton', 'Move back to the village', 'Open a café', 'Run a marathon'],
        answer: 'Travel to Lake Balaton'
      }
    ]
  }
];

export function getReading(id) {
  return readings.find((r) => r.id === id) || null;
}
