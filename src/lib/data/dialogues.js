/**
 * Conversation practice dialogues. Each: id, title, icon, scene,
 * lines: { speaker ('A'|'B'), name, hu, en }.
 * In practice mode the learner plays speaker B.
 */
export const dialogues = [
  {
    id: 'meeting',
    title: 'Meeting Someone',
    icon: '🤝',
    scene: 'You (B) meet Kata at a party in Budapest.',
    lines: [
      { speaker: 'A', name: 'Kata', hu: 'Szia! Kata vagyok.', en: 'Hi! I am Kata.' },
      { speaker: 'B', name: 'You', hu: 'Szia! Örülök, hogy megismertelek.', en: 'Hi! Nice to meet you.' },
      { speaker: 'A', name: 'Kata', hu: 'Honnan jöttél?', en: 'Where did you come from?' },
      { speaker: 'B', name: 'You', hu: 'Angliából jöttem.', en: 'I came from England.' },
      { speaker: 'A', name: 'Kata', hu: 'Beszélsz magyarul?', en: 'Do you speak Hungarian?' },
      { speaker: 'B', name: 'You', hu: 'Egy kicsit. Magyarul tanulok.', en: 'A little. I am learning Hungarian.' },
      { speaker: 'A', name: 'Kata', hu: 'Nagyon ügyes vagy!', en: 'You are doing really well!' },
      { speaker: 'B', name: 'You', hu: 'Köszönöm szépen!', en: 'Thank you very much!' }
    ]
  },
  {
    id: 'cafe',
    title: 'At the Café',
    icon: '☕',
    scene: 'You (B) order at a café. The waiter (pincér) greets you.',
    lines: [
      { speaker: 'A', name: 'Waiter', hu: 'Jó napot kívánok! Mit kér?', en: 'Good day! What would you like?' },
      { speaker: 'B', name: 'You', hu: 'Jó napot! Egy kávét kérek.', en: 'Good day! I would like a coffee.' },
      { speaker: 'A', name: 'Waiter', hu: 'Tejjel vagy cukorral?', en: 'With milk or with sugar?' },
      { speaker: 'B', name: 'You', hu: 'Tejjel, köszönöm.', en: 'With milk, thank you.' },
      { speaker: 'A', name: 'Waiter', hu: 'Valami mást?', en: 'Anything else?' },
      { speaker: 'B', name: 'You', hu: 'Igen, egy rétest is kérek.', en: 'Yes, I would also like a strudel.' },
      { speaker: 'A', name: 'Waiter', hu: 'Máris hozom.', en: 'I will bring it right away.' },
      { speaker: 'B', name: 'You', hu: 'Köszönöm. A számlát is kérem.', en: 'Thank you. The bill as well, please.' }
    ]
  },
  {
    id: 'directions',
    title: 'Asking for Directions',
    icon: '🗺️',
    scene: 'You (B) are lost in Budapest and ask a passer-by for help.',
    lines: [
      { speaker: 'B', name: 'You', hu: 'Bocsánat, segítene?', en: 'Excuse me, could you help?' },
      { speaker: 'A', name: 'Passer-by', hu: 'Persze, miben segíthetek?', en: 'Of course, how can I help?' },
      { speaker: 'B', name: 'You', hu: 'Hol van a Lánchíd?', en: 'Where is the Chain Bridge?' },
      { speaker: 'A', name: 'Passer-by', hu: 'Menjen egyenesen, aztán forduljon balra.', en: 'Go straight ahead, then turn left.' },
      { speaker: 'B', name: 'You', hu: 'Messze van?', en: 'Is it far?' },
      { speaker: 'A', name: 'Passer-by', hu: 'Nem, csak öt perc gyalog.', en: 'No, only five minutes on foot.' },
      { speaker: 'B', name: 'You', hu: 'Köszönöm szépen a segítséget!', en: 'Thank you very much for the help!' },
      { speaker: 'A', name: 'Passer-by', hu: 'Szívesen! Viszontlátásra!', en: 'You are welcome! Goodbye!' }
    ]
  },
  {
    id: 'market',
    title: 'At the Market',
    icon: '🧺',
    scene: 'You (B) buy fruit at the Great Market Hall (Nagyvásárcsarnok).',
    lines: [
      { speaker: 'A', name: 'Seller', hu: 'Jó reggelt! Tessék, mit adhatok?', en: 'Good morning! What can I get you?' },
      { speaker: 'B', name: 'You', hu: 'Jó reggelt! Mennyibe kerül az alma?', en: 'Good morning! How much are the apples?' },
      { speaker: 'A', name: 'Seller', hu: 'Hatszáz forint egy kiló.', en: 'Six hundred forints a kilo.' },
      { speaker: 'B', name: 'You', hu: 'Egy kilót kérek, és két körtét.', en: 'I would like one kilo, and two pears.' },
      { speaker: 'A', name: 'Seller', hu: 'Tessék. Más valamit?', en: 'Here you are. Anything else?' },
      { speaker: 'B', name: 'You', hu: 'Nem, köszönöm. Mennyit fizetek?', en: 'No, thank you. How much do I pay?' },
      { speaker: 'A', name: 'Seller', hu: 'Nyolcszáz forint lesz.', en: 'That will be eight hundred forints.' },
      { speaker: 'B', name: 'You', hu: 'Tessék. Köszönöm, viszlát!', en: 'Here you are. Thanks, bye!' }
    ]
  },
  {
    id: 'interview-personal',
    title: 'Official Interview: Personal Details',
    icon: '🛂',
    scene:
      'You (B) sit a formal interview. The official uses the polite Ön form. The answers are a fictional applicant — swap in your own facts.',
    lines: [
      { speaker: 'A', name: 'Official', hu: 'Jó napot kívánok! Foglaljon helyet.', en: 'Good day! Please take a seat.' },
      { speaker: 'B', name: 'You', hu: 'Jó napot kívánok! Köszönöm.', en: 'Good day! Thank you.' },
      { speaker: 'A', name: 'Official', hu: 'Lebetűzné a nevét, kérem?', en: 'Could you spell your name, please?' },
      { speaker: 'B', name: 'You', hu: 'Természetesen. Elnézést az akcentusomért.', en: 'Of course. Sorry about my accent.' },
      { speaker: 'A', name: 'Official', hu: 'Ön házas? Mióta?', en: 'Are you married? Since when?' },
      { speaker: 'B', name: 'You', hu: 'Igen, házas vagyok. Öt éve vagyunk házasok.', en: 'Yes, I am married. We have been married for five years.' },
      { speaker: 'A', name: 'Official', hu: 'Milyen nemzetiségű a házastársa?', en: "What is your spouse's nationality?" },
      { speaker: 'B', name: 'You', hu: 'A házastársam magyar.', en: 'My spouse is Hungarian.' },
      { speaker: 'A', name: 'Official', hu: 'Mikor születtek a gyermekei?', en: 'When were your children born?' },
      { speaker: 'B', name: 'You', hu: 'Elnézést, megismételné? Nem hallottam tisztán.', en: 'Sorry, could you repeat that? I did not hear it clearly.' },
      { speaker: 'A', name: 'Official', hu: 'Mikor születtek a gyermekei?', en: 'When were your children born?' },
      { speaker: 'B', name: 'You', hu: 'Az egyik gyermekem 2019-ben, a másik 2022-ben született.', en: 'One of my children was born in 2019, the other in 2022.' }
    ]
  },
  {
    id: 'interview-work',
    title: 'Official Interview: Work & Plans',
    icon: '💼',
    scene:
      'The second half of the interview (B is you): work, home and why you are applying. Again, the answers are patterns to adapt.',
    lines: [
      { speaker: 'A', name: 'Official', hu: 'Mi a foglalkozása?', en: 'What is your occupation?' },
      { speaker: 'B', name: 'You', hu: 'Szoftverfejlesztő vagyok. Egy körülbelül kétszáz fős cégnél dolgozom.', en: 'I am a software developer. I work at a company of about two hundred people.' },
      { speaker: 'A', name: 'Official', hu: 'Szereti a munkáját?', en: 'Do you like your job?' },
      { speaker: 'B', name: 'You', hu: 'Igen. A munkaidő rugalmas, és kedves emberekkel dolgozom.', en: 'Yes. The working hours are flexible, and I work with kind people.' },
      { speaker: 'A', name: 'Official', hu: 'Az irodában dolgozik?', en: 'Do you work in the office?' },
      { speaker: 'B', name: 'You', hu: 'Leginkább távmunkában dolgozom, otthonról.', en: 'I mostly work remotely, from home.' },
      { speaker: 'A', name: 'Official', hu: 'Hol laknak jelenleg?', en: 'Where do you currently live?' },
      { speaker: 'B', name: 'You', hu: 'Jelenleg Angliában lakunk, de gyakran járunk Magyarországra.', en: 'We currently live in England, but we often travel to Hungary.' },
      { speaker: 'A', name: 'Official', hu: 'Miért szeretne magyar állampolgár lenni?', en: 'Why do you want to become a Hungarian citizen?' },
      { speaker: 'B', name: 'You', hu: 'A házastársam magyar, és közel állok a családjához. Szeretem az országot és a nyelvet.', en: 'My spouse is Hungarian, and I am close to their family. I love the country and the language.' },
      { speaker: 'A', name: 'Official', hu: 'Köszönöm. Kérem, írja alá itt.', en: 'Thank you. Please sign here.' },
      { speaker: 'B', name: 'You', hu: 'Köszönöm szépen. Viszontlátásra!', en: 'Thank you very much. Goodbye!' }
    ]
  },
  {
    id: 'restaurant',
    title: 'At the Restaurant',
    icon: '🍽️',
    scene: 'You (B) have dinner in a traditional Hungarian restaurant (étterem).',
    lines: [
      { speaker: 'A', name: 'Waiter', hu: 'Jó estét! Hányan lesznek?', en: 'Good evening! How many of you will there be?' },
      { speaker: 'B', name: 'You', hu: 'Jó estét! Ketten leszünk.', en: 'Good evening! There will be two of us.' },
      { speaker: 'A', name: 'Waiter', hu: 'Tessék, itt az étlap. Mit kérnek?', en: 'Here is the menu. What would you like?' },
      { speaker: 'B', name: 'You', hu: 'Egy gulyáslevest és egy pörköltet kérünk.', en: 'We would like a goulash soup and a stew.' },
      { speaker: 'A', name: 'Waiter', hu: 'És inni mit hozhatok?', en: 'And what can I bring you to drink?' },
      { speaker: 'B', name: 'You', hu: 'Két pohár vörösbort kérünk.', en: 'We would like two glasses of red wine.' },
      { speaker: 'A', name: 'Waiter', hu: 'Egészségükre! Jó étvágyat!', en: 'Cheers! Enjoy your meal!' },
      { speaker: 'B', name: 'You', hu: 'Köszönjük! Nagyon finom!', en: 'Thank you! It is very delicious!' }
    ]
  }
];

export function getDialogue(id) {
  return dialogues.find((d) => d.id === id) || null;
}
