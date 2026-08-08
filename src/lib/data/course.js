/**
 * The guided course: ordered units, each an ordered list of steps.
 * Steps reference existing content by id; 'practice' and 'checkpoint' steps
 * reference exercise-set ids resolved by exercises.js, and 'verbs' steps
 * reference a drill tense on the Verbs page.
 *
 * Gating is SOFT: everything stays reachable at all times. The course marks
 * the recommended next step — it never locks doors, because a learner who
 * already knows some material should be able to skip ahead.
 *
 * Step types: lesson | guide | practice | reading | dialogue | verbs | checkpoint.
 */
export const course = [
  {
    id: 'u1',
    title: 'First Words',
    icon: '👋',
    blurb: 'The sounds, the greetings, and your first real conversation.',
    steps: [
      { id: 'u1-alphabet', type: 'guide', ref: 'alphabet' },
      { id: 'u1-spelling', type: 'practice', ref: 'grammar:alphabet' },
      { id: 'u1-greetings', type: 'lesson', ref: 'greetings' },
      { id: 'u1-practice', type: 'practice', ref: 'lesson:greetings' },
      { id: 'u1-dialogue', type: 'dialogue', ref: 'meeting' },
      { id: 'u1-check', type: 'checkpoint', ref: 'checkpoint:u1' }
    ]
  },
  {
    id: 'u2',
    title: 'Numbers & Harmony',
    icon: '🔢',
    blurb: 'Count anything — and meet vowel harmony, the melody behind every suffix.',
    steps: [
      { id: 'u2-numbers', type: 'lesson', ref: 'numbers' },
      { id: 'u2-harmony', type: 'guide', ref: 'vowel-harmony' },
      { id: 'u2-harmony-practice', type: 'practice', ref: 'grammar:vowel-harmony' },
      { id: 'u2-practice', type: 'practice', ref: 'lesson:numbers' },
      { id: 'u2-dialogue', type: 'dialogue', ref: 'cafe' },
      { id: 'u2-check', type: 'checkpoint', ref: 'checkpoint:u2' }
    ]
  },
  {
    id: 'u3',
    title: 'To Be & About Me',
    icon: '🧍',
    blurb: 'Vagyok, vagy, van — say who you are and introduce your family.',
    steps: [
      { id: 'u3-tobe', type: 'guide', ref: 'to-be' },
      { id: 'u3-tobe-practice', type: 'practice', ref: 'grammar:to-be' },
      { id: 'u3-family', type: 'lesson', ref: 'family' },
      { id: 'u3-practice', type: 'practice', ref: 'lesson:family' },
      { id: 'u3-check', type: 'checkpoint', ref: 'checkpoint:u3' }
    ]
  },
  {
    id: 'u4',
    title: 'Verbs I',
    icon: '⚙️',
    blurb: 'The present tense and the famous two conjugations.',
    steps: [
      { id: 'u4-guide', type: 'guide', ref: 'verb-conjugation' },
      { id: 'u4-lesson', type: 'lesson', ref: 'verbs' },
      { id: 'u4-drill', type: 'verbs', ref: 'present' },
      { id: 'u4-guide-practice', type: 'practice', ref: 'grammar:verb-conjugation' },
      { id: 'u4-practice', type: 'practice', ref: 'lesson:verbs' },
      { id: 'u4-check', type: 'checkpoint', ref: 'checkpoint:u4' }
    ]
  },
  {
    id: 'u5',
    title: 'Food & Ordering',
    icon: '🍽️',
    blurb: 'Order like a local — with articles, plurals and possession on the side.',
    steps: [
      { id: 'u5-food', type: 'lesson', ref: 'food' },
      { id: 'u5-articles', type: 'guide', ref: 'articles-plurals' },
      { id: 'u5-articles-practice', type: 'practice', ref: 'grammar:articles-plurals' },
      { id: 'u5-practice', type: 'practice', ref: 'lesson:food' },
      { id: 'u5-dialogue', type: 'dialogue', ref: 'restaurant' },
      { id: 'u5-reading', type: 'reading', ref: 'kave' },
      { id: 'u5-check', type: 'checkpoint', ref: 'checkpoint:u5' }
    ]
  },
  {
    id: 'u6',
    title: 'Around Town',
    icon: '🗺️',
    blurb: 'Find your way — cases and suffixes instead of prepositions.',
    steps: [
      { id: 'u6-town', type: 'lesson', ref: 'town' },
      { id: 'u6-cases', type: 'guide', ref: 'cases' },
      { id: 'u6-cases-practice', type: 'practice', ref: 'grammar:cases' },
      { id: 'u6-practice', type: 'practice', ref: 'lesson:town' },
      { id: 'u6-dialogue', type: 'dialogue', ref: 'directions' },
      { id: 'u6-reading', type: 'reading', ref: 'anna' },
      { id: 'u6-check', type: 'checkpoint', ref: 'checkpoint:u6' }
    ]
  },
  {
    id: 'u7',
    title: 'Time & the Past',
    icon: '⏪',
    blurb: 'Days, hours — and the past tense, so yesterday finally exists.',
    steps: [
      { id: 'u7-time', type: 'lesson', ref: 'time' },
      { id: 'u7-time-practice', type: 'practice', ref: 'lesson:time' },
      { id: 'u7-past-guide', type: 'guide', ref: 'past-tense' },
      { id: 'u7-past-guide-practice', type: 'practice', ref: 'grammar:past-tense' },
      { id: 'u7-past-drill', type: 'verbs', ref: 'past' },
      { id: 'u7-past-lesson', type: 'lesson', ref: 'past-life' },
      { id: 'u7-past-practice', type: 'practice', ref: 'lesson:past-life' },
      { id: 'u7-dialogue', type: 'dialogue', ref: 'market' },
      { id: 'u7-reading', type: 'reading', ref: 'piac' },
      { id: 'u7-check', type: 'checkpoint', ref: 'checkpoint:u7' }
    ]
  },
  {
    id: 'u8',
    title: 'Colour & Style',
    icon: '🎨',
    blurb: 'Describe things — and learn why word order is all about the spotlight.',
    steps: [
      { id: 'u8-adjectives', type: 'lesson', ref: 'adjectives' },
      { id: 'u8-practice', type: 'practice', ref: 'lesson:adjectives' },
      { id: 'u8-order', type: 'guide', ref: 'word-order' },
      { id: 'u8-order-practice', type: 'practice', ref: 'grammar:word-order' },
      { id: 'u8-check', type: 'checkpoint', ref: 'checkpoint:u8' }
    ]
  },
  {
    id: 'u9',
    title: 'The Interview',
    icon: '🪪',
    blurb: 'Formal Hungarian, dates and life events — everything the official will ask.',
    steps: [
      { id: 'u9-formal', type: 'guide', ref: 'formal-register' },
      { id: 'u9-formal-practice', type: 'practice', ref: 'grammar:formal-register' },
      { id: 'u9-dates', type: 'guide', ref: 'dates-life-events' },
      { id: 'u9-dates-practice', type: 'practice', ref: 'grammar:dates-life-events' },
      { id: 'u9-lesson', type: 'lesson', ref: 'interview' },
      { id: 'u9-practice', type: 'practice', ref: 'lesson:interview' },
      { id: 'u9-dialogue-personal', type: 'dialogue', ref: 'interview-personal' },
      { id: 'u9-dialogue-work', type: 'dialogue', ref: 'interview-work' },
      { id: 'u9-reading', type: 'reading', ref: 'az-interju' },
      { id: 'u9-check', type: 'checkpoint', ref: 'checkpoint:u9' }
    ]
  },
  {
    id: 'u10',
    title: 'Everyday Life',
    icon: '🌦️',
    blurb: 'Bodies, doctors and the weather — the small talk and the emergencies.',
    steps: [
      { id: 'u10-health', type: 'lesson', ref: 'health' },
      { id: 'u10-health-practice', type: 'practice', ref: 'lesson:health' },
      { id: 'u10-doctor', type: 'dialogue', ref: 'doctor' },
      { id: 'u10-weather', type: 'lesson', ref: 'weather' },
      { id: 'u10-weather-practice', type: 'practice', ref: 'lesson:weather' },
      { id: 'u10-smalltalk', type: 'dialogue', ref: 'weather-smalltalk' },
      { id: 'u10-reading', type: 'reading', ref: 'egy-napom' },
      { id: 'u10-check', type: 'checkpoint', ref: 'checkpoint:u10' }
    ]
  }
];

export function getUnit(id) {
  return course.find((u) => u.id === id) || null;
}
