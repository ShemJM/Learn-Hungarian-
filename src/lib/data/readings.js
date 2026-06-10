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
  }
];

export function getReading(id) {
  return readings.find((r) => r.id === id) || null;
}
