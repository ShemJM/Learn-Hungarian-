/**
 * Practice material for training the Hungarian rolled/trilled "r" (an alveolar
 * trill, unlike the English r). `technique` are plain-text coaching tips;
 * `tiers` are graduated practice sets — every hu/en pair here is reused from
 * vocabulary or sentences that already exist elsewhere in the app
 * (alphabet.js, dialogues.js, readings.js, citizenship.js).
 */
export const technique = [
  {
    title: 'Find the spot',
    text: 'The tip of your tongue taps the alveolar ridge — the little bump just behind your upper front teeth. It is the same spot English uses for "d" and "t".'
  },
  {
    title: 'Relax, do not push',
    text: "Don't try to flick your tongue on purpose. Relax it and blow a steady stream of air — the airflow itself makes the loose tongue tip vibrate."
  },
  {
    title: 'Borrow a warm-up trick',
    text: 'Say "dd-dd-dd-dd" fast and loose, or imitate a motorbike engine ("brrrrm") or a purring cat. Both use the same relaxed-tongue-plus-airflow mechanism as the Hungarian r.'
  },
  {
    title: 'Build up gradually',
    text: 'Start with a single tap — like the quick "tt" sound in the American pronunciation of "butter" or "ladder". Once that is easy, try two or three rapid taps in a row, then let it run into a sustained trill.'
  },
  {
    title: 'Common pitfall',
    text: 'If it is not working, check you are not tensing your tongue or trilling from the back of your throat (that is the French r). The Hungarian r happens right at the front, and only works when the tongue is loose.'
  }
];

export const tiers = [
  {
    id: 'single',
    title: '🎯 Single R warm-up',
    description: 'One well-placed tap to start. Go slow and feel where your tongue lands.',
    items: [
      { hu: 'róka', en: 'fox' },
      { hu: 'óra', en: 'clock / hour' },
      { hu: 'sör', en: 'beer' }
    ]
  },
  {
    id: 'multi',
    title: "🎯🎯 Multiple R's in one word",
    description: 'Now keep the trill going, or fire it twice in the same breath.',
    items: [
      { hu: 'orr', en: 'nose' },
      { hu: 'vörösbort', en: 'red wine (object form)' },
      { hu: 'körülbelül', en: 'approximately' }
    ]
  },
  {
    id: 'sentences',
    title: '🏆 Full R-heavy sentences',
    description: 'Real sentences from your lessons — the ultimate test.',
    items: [
      { hu: 'Igen, egy rétest is kérek.', en: 'Yes, I would also like a strudel.' },
      { hu: 'Egy kilót kérek, és két körtét.', en: 'I would like one kilo, and two pears.' },
      { hu: 'Két pohár vörösbort kérünk.', en: 'We would like two glasses of red wine.' },
      { hu: 'Szia! Örülök, hogy megismertelek.', en: 'Hi! Nice to meet you.' },
      { hu: 'Sokat beszélgettek a munkáról és az utazásról.', en: 'They chatted a lot about work and travelling.' },
      { hu: 'Körülbelül kétszáz embert foglalkoztat.', en: 'It employs about two hundred people.' }
    ]
  }
];

/** Flatten every practice item across all tiers. */
export function allRolledRItems() {
  return tiers.flatMap((t) => t.items);
}
