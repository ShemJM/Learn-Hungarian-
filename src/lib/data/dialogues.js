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
  },
  {
    id: 'doctor',
    title: "At the Doctor's",
    icon: '🩺',
    scene: 'You (B) feel unwell and visit the doctor (orvos), who uses the formal Ön form.',
    lines: [
      { speaker: 'A', name: 'Doctor', hu: 'Jó napot! Mi a panasza?', en: 'Good day! What is your complaint?' },
      { speaker: 'B', name: 'You', hu: 'Jó napot! Fáj a fejem és a torkom.', en: 'Good day! My head and my throat hurt.' },
      { speaker: 'A', name: 'Doctor', hu: 'Van láza?', en: 'Do you have a fever?' },
      { speaker: 'B', name: 'You', hu: 'Igen, tegnap este volt egy kis lázam.', en: 'Yes, I had a slight fever last night.' },
      { speaker: 'A', name: 'Doctor', hu: 'Értem. Kérem, nyissa ki a száját!', en: 'I see. Please open your mouth.' },
      { speaker: 'B', name: 'You', hu: 'Komoly a baj, doktor úr?', en: 'Is it serious, doctor?' },
      { speaker: 'A', name: 'Doctor', hu: 'Nem, csak megfázás. Felírok egy gyógyszert.', en: 'No, just a cold. I will prescribe a medicine.' },
      { speaker: 'B', name: 'You', hu: 'Köszönöm. Hol van a legközelebbi gyógyszertár?', en: 'Thank you. Where is the nearest pharmacy?' },
      { speaker: 'A', name: 'Doctor', hu: 'Itt van a sarkon. Jobbulást kívánok!', en: 'It is here on the corner. I wish you a speedy recovery!' },
      { speaker: 'B', name: 'You', hu: 'Köszönöm szépen. Viszontlátásra!', en: 'Thank you very much. Goodbye!' }
    ]
  },
  {
    id: 'weather-smalltalk',
    title: 'Small Talk About the Weather',
    icon: '🌦️',
    scene: 'You (B) chat with your neighbour Erzsi néni in the stairwell — the national sport.',
    lines: [
      { speaker: 'A', name: 'Erzsi', hu: 'Jó reggelt! Milyen szép napos idő van ma!', en: 'Good morning! What lovely sunny weather today!' },
      { speaker: 'B', name: 'You', hu: 'Jó reggelt! Igen, végre süt a nap.', en: 'Good morning! Yes, the sun is finally shining.' },
      { speaker: 'A', name: 'Erzsi', hu: 'Tegnap egész nap esett az eső.', en: 'Yesterday it rained all day.' },
      { speaker: 'B', name: 'You', hu: 'Igen, és fújt a szél is. Nagyon hideg volt.', en: 'Yes, and the wind was blowing too. It was very cold.' },
      { speaker: 'A', name: 'Erzsi', hu: 'Holnap állítólag vihar jön.', en: 'Tomorrow a storm is supposedly coming.' },
      { speaker: 'B', name: 'You', hu: 'Akkor viszek esernyőt.', en: 'Then I will take an umbrella.' },
      { speaker: 'A', name: 'Erzsi', hu: 'Okos! Az ősz már ilyen.', en: 'Smart! Autumn is like that.' },
      { speaker: 'B', name: 'You', hu: 'Igen, de én szeretem az őszt. Szép évszak.', en: 'Yes, but I like autumn. It is a beautiful season.' }
    ]
  },
  {
    id: 'phone-appointment',
    title: 'Booking an Appointment',
    icon: '📞',
    scene: "You (B) phone Dr. Nagy's surgery for an appointment. Formal (magázás) throughout — and watch the coverbs at work.",
    lines: [
      { speaker: 'A', name: 'Assistant', hu: 'Jó napot kívánok, doktor Nagy rendelője!', en: "Good day, Dr. Nagy's surgery!" },
      { speaker: 'B', name: 'You', hu: 'Jó napot! Szeretnék időpontot kérni a jövő hétre.', en: 'Good day! I would like to ask for an appointment for next week.' },
      { speaker: 'A', name: 'Assistant', hu: 'Természetesen. Milyen panasza van?', en: 'Of course. What is your complaint?' },
      { speaker: 'B', name: 'You', hu: 'Napok óta fáj a torkom. Tegnap felhívtam Önöket, de senki nem vette fel.', en: 'My throat has been hurting for days. I called you yesterday, but nobody picked up.' },
      { speaker: 'A', name: 'Assistant', hu: 'Elnézést kérünk, nagyon sok betegünk volt. Most megbeszéljük az időpontot.', en: 'We apologise, we had very many patients. We will arrange the appointment now.' },
      { speaker: 'B', name: 'You', hu: 'Köszönöm. Mikor tudna fogadni a doktor úr?', en: 'Thank you. When could the doctor see me?' },
      { speaker: 'A', name: 'Assistant', hu: 'Kedden tíz órakor van egy szabad időpont. Megfelel?', en: 'There is a free slot on Tuesday at ten. Does that suit you?' },
      { speaker: 'B', name: 'You', hu: 'Igen, megfelel. Felírom magamnak.', en: 'Yes, that suits me. I will write it down for myself.' },
      { speaker: 'A', name: 'Assistant', hu: 'Rendben, kedden tízre várjuk. Viszonthallásra!', en: 'All right, we expect you Tuesday at ten. Goodbye! (on the phone)' },
      { speaker: 'B', name: 'You', hu: 'Köszönöm szépen, viszonthallásra!', en: 'Thank you very much, goodbye!' }
    ]
  },
  {
    id: 'holiday-plans',
    title: 'Holiday Plans',
    icon: '🏖️',
    scene: 'You (B) and your friend Bence debate the summer holiday — conditional wishes, future plans. Informal.',
    lines: [
      { speaker: 'A', name: 'Bence', hu: 'Hova mennél nyáron, ha lenne pénzed?', en: 'Where would you go in the summer if you had money?' },
      { speaker: 'B', name: 'You', hu: 'Ha lenne pénzem, a tengerhez utaznék.', en: 'If I had money, I would travel to the sea.' },
      { speaker: 'A', name: 'Bence', hu: 'Én inkább a Balatonra mennék. Olcsóbb, mint a tenger.', en: 'I would rather go to Lake Balaton. It is cheaper than the sea.' },
      { speaker: 'B', name: 'You', hu: 'Igazad van, de a tenger szebb, mint a Balaton!', en: 'You are right, but the sea is more beautiful than Balaton!' },
      { speaker: 'A', name: 'Bence', hu: 'Talán. De a Balatonnál ott a legjobb lángos!', en: 'Maybe. But at Balaton there is the best lángos!' },
      { speaker: 'B', name: 'You', hu: 'Jó, meggyőztél. Jövőre biztosan elutazunk valahova.', en: 'Fine, you convinced me. Next year we will definitely travel somewhere.' },
      { speaker: 'A', name: 'Bence', hu: 'Remek! Majd megbeszéljük a részleteket.', en: 'Great! We will discuss the details later.' },
      { speaker: 'B', name: 'You', hu: 'Rendben. Addig is gyűjtöm a pénzt.', en: 'All right. Until then I am saving up the money.' }
    ]
  }
];

export function getDialogue(id) {
  return dialogues.find((d) => d.id === id) || null;
}
