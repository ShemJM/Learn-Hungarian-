/**
 * The Hungarian alphabet, for spelling/pronunciation practice.
 * Each letter: letter (as written), group (vowel|consonant|digraph|foreign),
 * name (how the letter is called aloud), namePron (rough phonetic guide),
 * example { hu, en, pron } — a common word containing the letter, and an
 * optional note for letters with quirks (never word-initial, foreign-only, etc.).
 *
 * The practice phrase mirrors how Hungarians actually spell things out loud —
 * "[letter name], mint [word]" ("[letter], as in [word]") — so learners practise
 * a real, useful sentence structure while saying the letter and a word that uses it.
 */
export const groups = [
  { id: 'all', label: 'All letters' },
  { id: 'vowel', label: 'Vowels' },
  { id: 'consonant', label: 'Consonants' },
  { id: 'digraph', label: 'Digraphs (two-letter sounds)' },
  { id: 'foreign', label: 'Foreign letters (loanwords only)' }
];

export const alphabet = [
  { letter: 'a', group: 'vowel', name: 'a', namePron: 'aw', example: { hu: 'alma', en: 'apple', pron: 'AWL-maw' } },
  { letter: 'á', group: 'vowel', name: 'á', namePron: 'ah', example: { hu: 'állat', en: 'animal', pron: 'AHL-lawt' } },
  { letter: 'b', group: 'consonant', name: 'bé', namePron: 'bay', example: { hu: 'bicikli', en: 'bicycle', pron: 'BEE-tseek-lee' } },
  { letter: 'c', group: 'consonant', name: 'cé', namePron: 'tsay', example: { hu: 'cica', en: 'kitten', pron: 'TSEE-tsaw' } },
  { letter: 'cs', group: 'digraph', name: 'csé', namePron: 'chay', example: { hu: 'csirke', en: 'chicken', pron: 'CHEER-keh' } },
  { letter: 'd', group: 'consonant', name: 'dé', namePron: 'day', example: { hu: 'dinnye', en: 'melon', pron: 'DEEN-nyeh' } },
  {
    letter: 'dz',
    group: 'digraph',
    name: 'dzé',
    namePron: 'dzay',
    example: { hu: 'edzés', en: 'workout', pron: 'ED-zaysh' },
    note: 'Rare — only appears inside a handful of words, never at the start.'
  },
  {
    letter: 'dzs',
    group: 'digraph',
    name: 'dzsé',
    namePron: 'jay',
    example: { hu: 'dzsungel', en: 'jungle', pron: 'JOON-gel' },
    note: 'Rare — mostly seen in words borrowed from English.'
  },
  { letter: 'e', group: 'vowel', name: 'e', namePron: 'eh', example: { hu: 'ember', en: 'person', pron: 'EM-ber' } },
  { letter: 'é', group: 'vowel', name: 'é', namePron: 'ay', example: { hu: 'élet', en: 'life', pron: 'AY-let' } },
  { letter: 'f', group: 'consonant', name: 'ef', namePron: 'eff', example: { hu: 'fa', en: 'tree', pron: 'faw' } },
  { letter: 'g', group: 'consonant', name: 'gé', namePron: 'gay', example: { hu: 'gomba', en: 'mushroom', pron: 'GOM-baw' } },
  { letter: 'gy', group: 'digraph', name: 'gyé', namePron: 'dyay', example: { hu: 'gyerek', en: 'child', pron: 'DYEH-rek' } },
  { letter: 'h', group: 'consonant', name: 'há', namePron: 'hah', example: { hu: 'ház', en: 'house', pron: 'hahz' } },
  { letter: 'i', group: 'vowel', name: 'i', namePron: 'ee', example: { hu: 'iskola', en: 'school', pron: 'ISH-ko-law' } },
  {
    letter: 'í',
    group: 'vowel',
    name: 'í',
    namePron: 'EE (long)',
    example: { hu: 'híd', en: 'bridge', pron: 'heed' },
    note: 'Just a longer "ee" than plain i — few words start with í.'
  },
  { letter: 'j', group: 'consonant', name: 'jé', namePron: 'yay', example: { hu: 'jó', en: 'good', pron: 'yoh' } },
  { letter: 'k', group: 'consonant', name: 'ká', namePron: 'kah', example: { hu: 'kutya', en: 'dog', pron: 'KOO-tyaw' } },
  { letter: 'l', group: 'consonant', name: 'el', namePron: 'el', example: { hu: 'lámpa', en: 'lamp', pron: 'LAHM-paw' } },
  {
    letter: 'ly',
    group: 'digraph',
    name: 'elly',
    namePron: 'EL-yuh',
    example: { hu: 'hely', en: 'place', pron: 'hey' },
    note: 'Sounds exactly like "j" (y) — a historical spelling that survives in older words.'
  },
  { letter: 'm', group: 'consonant', name: 'em', namePron: 'em', example: { hu: 'macska', en: 'cat', pron: 'MAWCH-kaw' } },
  { letter: 'n', group: 'consonant', name: 'en', namePron: 'en', example: { hu: 'nap', en: 'sun / day', pron: 'nawp' } },
  { letter: 'ny', group: 'digraph', name: 'eny', namePron: 'EN-yuh', example: { hu: 'nyár', en: 'summer', pron: 'nyahr' } },
  { letter: 'o', group: 'vowel', name: 'o', namePron: 'oh', example: { hu: 'orr', en: 'nose', pron: 'ohr' } },
  { letter: 'ó', group: 'vowel', name: 'ó', namePron: 'OH (long)', example: { hu: 'óra', en: 'clock / hour', pron: 'OH-raw' } },
  { letter: 'ö', group: 'vowel', name: 'ö', namePron: 'ur (rounded)', example: { hu: 'öt', en: 'five', pron: 'uht' } },
  { letter: 'ő', group: 'vowel', name: 'ő', namePron: 'ur (long)', example: { hu: 'őz', en: 'deer', pron: 'urz' } },
  { letter: 'p', group: 'consonant', name: 'pé', namePron: 'pay', example: { hu: 'papír', en: 'paper', pron: 'PAW-peer' } },
  {
    letter: 'q',
    group: 'foreign',
    name: 'ku',
    namePron: 'koo',
    example: { hu: 'quiz', en: 'quiz', pron: 'kviz' },
    note: 'Only used in foreign words and names — Hungarian normally spells the "kv" sound as "kv".'
  },
  { letter: 'r', group: 'consonant', name: 'er', namePron: 'er (rolled)', example: { hu: 'róka', en: 'fox', pron: 'ROH-kaw' } },
  { letter: 's', group: 'consonant', name: 'es', namePron: 'esh', example: { hu: 'sör', en: 'beer', pron: 'shuhr' } },
  { letter: 'sz', group: 'digraph', name: 'esz', namePron: 'ess', example: { hu: 'szia', en: 'hi', pron: 'SEE-yaw' } },
  { letter: 't', group: 'consonant', name: 'té', namePron: 'tay', example: { hu: 'tea', en: 'tea', pron: 'TEH-aw' } },
  { letter: 'ty', group: 'digraph', name: 'tyé', namePron: 'tyay', example: { hu: 'tyúk', en: 'hen', pron: 'tyook' } },
  { letter: 'u', group: 'vowel', name: 'u', namePron: 'oo', example: { hu: 'uborka', en: 'cucumber', pron: 'OO-bor-kaw' } },
  { letter: 'ú', group: 'vowel', name: 'ú', namePron: 'OO (long)', example: { hu: 'út', en: 'road', pron: 'oot' } },
  { letter: 'ü', group: 'vowel', name: 'ü', namePron: 'ew', example: { hu: 'üveg', en: 'bottle', pron: 'EW-veg' } },
  {
    letter: 'ű',
    group: 'vowel',
    name: 'ű',
    namePron: 'ew (long)',
    example: { hu: 'tűz', en: 'fire', pron: 'tewz' },
    note: 'A longer "ü" — very few words start with ű.'
  },
  { letter: 'v', group: 'consonant', name: 'vé', namePron: 'vay', example: { hu: 'víz', en: 'water', pron: 'veez' } },
  {
    letter: 'w',
    group: 'foreign',
    name: 'duplavé',
    namePron: 'DOO-plaw-vay',
    example: { hu: 'wifi', en: 'wifi', pron: 'VEE-fee' },
    note: 'Only used in foreign words and names — pronounced the same as "v".'
  },
  {
    letter: 'x',
    group: 'foreign',
    name: 'iksz',
    namePron: 'iks',
    example: { hu: 'taxi', en: 'taxi', pron: 'TAWK-see' },
    note: 'Only used in foreign words and names.'
  },
  {
    letter: 'y',
    group: 'foreign',
    name: 'ipszilon',
    namePron: 'IP-see-lon',
    example: { hu: 'yeti', en: 'yeti', pron: 'YEH-tee' },
    note: 'Alone it only appears in loanwords — its normal job is teaming up in gy, ly, ny, ty.'
  },
  { letter: 'z', group: 'consonant', name: 'zé', namePron: 'zay', example: { hu: 'zöld', en: 'green', pron: 'ZURLD' } },
  { letter: 'zs', group: 'digraph', name: 'zsé', namePron: 'zhay', example: { hu: 'zsemle', en: 'bread roll', pron: 'ZHEM-leh' } }
];

/** The real spell-it-out phrase: "[letter name], as in [word]." */
export function letterPhrase(entry) {
  const nameCap = entry.name.charAt(0).toUpperCase() + entry.name.slice(1);
  return {
    hu: `${nameCap}, mint ${entry.example.hu}.`,
    en: `${entry.letter.toUpperCase()}, as in "${entry.example.en}".`
  };
}
