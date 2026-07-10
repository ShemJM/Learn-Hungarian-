import { describe, it, expect } from 'vitest';
import { lessons, getLesson, allWords, allPhrases } from './lessons.js';
import { grammarGuides, getGuide } from './grammar.js';
import { readings, getReading } from './readings.js';
import { dialogues, getDialogue } from './dialogues.js';
import {
  generalTips,
  interviewCategories,
  buildJobSentence,
  buildResidenceSentence,
  buildFamilySentence,
  childCountSentence
} from './citizenship.js';
import { alphabet, groups, letterPhrase } from './alphabet.js';
import { technique, tiers, allRolledRItems } from './rolledR.js';

describe('lessons data', () => {
  it('has at least 8 lessons with unique ids', () => {
    expect(lessons.length).toBeGreaterThanOrEqual(8);
    expect(new Set(lessons.map((l) => l.id)).size).toBe(lessons.length);
  });

  it('every lesson has enough words for a quiz, each fully defined', () => {
    for (const lesson of lessons) {
      expect(lesson.words.length, lesson.id).toBeGreaterThanOrEqual(10);
      for (const w of lesson.words) {
        expect(w.hu, lesson.id).toBeTruthy();
        expect(w.en, lesson.id).toBeTruthy();
        expect(w.pron, lesson.id).toBeTruthy();
      }
    }
  });

  it('has no duplicate Hungarian words across the course', () => {
    const words = allWords().map((w) => w.hu.toLowerCase());
    const dupes = words.filter((w, i) => words.indexOf(w) !== i);
    expect(dupes).toEqual([]);
  });

  it('every lesson has practice phrases with translations', () => {
    for (const lesson of lessons) {
      expect(lesson.phrases.length, lesson.id).toBeGreaterThanOrEqual(3);
      for (const p of lesson.phrases) {
        expect(p.hu).toBeTruthy();
        expect(p.en).toBeTruthy();
      }
    }
    expect(allPhrases().length).toBeGreaterThan(20);
  });

  it('getLesson finds by id and returns null otherwise', () => {
    expect(getLesson('food')?.title).toBe('Food & Drink');
    expect(getLesson('nope')).toBeNull();
  });
});

describe('grammar data', () => {
  it('has at least 7 guides, each with sections', () => {
    expect(grammarGuides.length).toBeGreaterThanOrEqual(7);
    for (const g of grammarGuides) {
      expect(g.sections.length, g.id).toBeGreaterThan(0);
      for (const s of g.sections) {
        expect(s.heading, g.id).toBeTruthy();
      }
    }
  });

  it('tables are rectangular', () => {
    for (const g of grammarGuides) {
      for (const s of g.sections) {
        if (s.table) {
          for (const row of s.table.rows) {
            expect(row.length, `${g.id}: ${s.heading}`).toBe(s.table.headers.length);
          }
        }
      }
    }
  });

  it('getGuide works', () => {
    expect(getGuide('vowel-harmony')?.title).toBe('Vowel Harmony');
    expect(getGuide('nope')).toBeNull();
  });
});

describe('readings data', () => {
  it('every reading has sentences with translations and valid questions', () => {
    expect(readings.length).toBeGreaterThanOrEqual(3);
    for (const r of readings) {
      expect(r.text.length, r.id).toBeGreaterThanOrEqual(5);
      for (const s of r.text) {
        expect(s.hu, r.id).toBeTruthy();
        expect(s.en, r.id).toBeTruthy();
      }
      expect(r.questions.length, r.id).toBeGreaterThanOrEqual(3);
      for (const q of r.questions) {
        // The correct answer must be one of the choices.
        expect(q.choices, `${r.id}: ${q.q}`).toContain(q.answer);
        expect(new Set(q.choices).size).toBe(q.choices.length);
      }
    }
  });

  it('getReading works', () => {
    expect(getReading('anna')?.title).toBe('Anna Budapesten');
    expect(getReading('nope')).toBeNull();
  });
});

describe('dialogues data', () => {
  it('every dialogue alternates content with both speakers and full translations', () => {
    expect(dialogues.length).toBeGreaterThanOrEqual(4);
    for (const d of dialogues) {
      expect(d.lines.length, d.id).toBeGreaterThanOrEqual(6);
      const speakers = new Set(d.lines.map((l) => l.speaker));
      expect(speakers, d.id).toEqual(new Set(['A', 'B']));
      for (const line of d.lines) {
        expect(line.hu, d.id).toBeTruthy();
        expect(line.en, d.id).toBeTruthy();
        expect(line.name, d.id).toBeTruthy();
      }
    }
  });

  it('getDialogue works', () => {
    expect(getDialogue('cafe')?.title).toBe('At the Café');
    expect(getDialogue('nope')).toBeNull();
  });
});

describe('citizenship interview data', () => {
  it('has general tips', () => {
    expect(generalTips.length).toBeGreaterThanOrEqual(3);
  });

  it('every category has questions with tips, at least one answer, and a free-speech prompt', () => {
    expect(interviewCategories.length).toBeGreaterThanOrEqual(4);
    for (const cat of interviewCategories) {
      expect(cat.freePrompt, cat.id).toBeTruthy();
      expect(cat.questions.length, cat.id).toBeGreaterThan(0);
      for (const q of cat.questions) {
        expect(q.hu, `${cat.id}: ${q.hu}`).toBeTruthy();
        expect(q.en, `${cat.id}: ${q.hu}`).toBeTruthy();
        expect(q.tip, `${cat.id}: ${q.hu}`).toBeTruthy();
        expect(q.answers.length, `${cat.id}: ${q.hu}`).toBeGreaterThan(0);
        for (const a of q.answers) {
          expect(a.hu, `${cat.id}: ${q.hu}`).toBeTruthy();
          expect(a.en, `${cat.id}: ${q.hu}`).toBeTruthy();
        }
      }
    }
  });

  it('covers having no children, one child and multiple children', () => {
    expect(childCountSentence(0).hu).toBe('Nincs gyermekem.');
    expect(childCountSentence(1).hu).toBe('Egy gyermekem van.');
    expect(childCountSentence(2).hu).toBe('Két gyermekem van.');
  });

  it('builds a job sentence from any valid option combination', () => {
    const s = buildJobSentence('dev', 'manufacturing', 'twohundred');
    expect(s.hu).toBe('Szoftverfejlesztőként dolgozom egy gyártó cégnél. Körülbelül kétszáz ember dolgozik ott.');
    expect(s.en).toContain('software developer');
    expect(s.en).toContain('two hundred');
  });

  it('builds a residence sentence for Budapest and for a region, with an optional city', () => {
    expect(buildResidenceSentence('budapest').hu).toBe('Budapesten élek.');
    const regional = buildResidenceSentence('southwest', 'Pécs');
    expect(regional.hu).toBe('Magyarországon élek, az ország délnyugati részén. Lakóhelyem: Pécs.');
  });

  it('builds a family sentence covering zero, one and several children with names', () => {
    expect(buildFamilySentence(0, []).hu).toBe('Nincs gyermekem.');
    const one = buildFamilySentence(1, [{ gender: 'son', name: 'Tamás', age: '8' }]);
    expect(one.hu).toBe('Egy gyermekem van. A fiam neve Tamás, 8 éves.');
    const two = buildFamilySentence(2, [
      { gender: 'daughter', name: 'Zsófia', age: '5' },
      { gender: 'son', name: 'Bence', age: '' }
    ]);
    expect(two.hu).toBe('Két gyermekem van. A lányom neve Zsófia, 5 éves. A fiam neve Bence.');
  });
});

describe('alphabet data', () => {
  it('covers the full 44-letter Hungarian alphabet with unique letters', () => {
    expect(alphabet.length).toBe(44);
    expect(new Set(alphabet.map((l) => l.letter)).size).toBe(alphabet.length);
  });

  it('every letter has a name, pronunciation guide and a full example word', () => {
    for (const l of alphabet) {
      expect(l.name, l.letter).toBeTruthy();
      expect(l.namePron, l.letter).toBeTruthy();
      expect(groups.map((g) => g.id), l.letter).toContain(l.group);
      expect(l.example.hu, l.letter).toBeTruthy();
      expect(l.example.en, l.letter).toBeTruthy();
      expect(l.example.pron, l.letter).toBeTruthy();
      expect(l.example.hu.toLowerCase(), l.letter).toContain(l.letter.toLowerCase());
    }
  });

  it('groups every letter into vowel, consonant, digraph or foreign', () => {
    const byGroup = {};
    for (const l of alphabet) byGroup[l.group] = (byGroup[l.group] || 0) + 1;
    expect(byGroup.vowel).toBe(14);
    expect(byGroup.consonant).toBe(17);
    expect(byGroup.digraph).toBe(9);
    expect(byGroup.foreign).toBe(4);
  });

  it('builds a spell-it-out phrase from the letter name and example word', () => {
    const b = alphabet.find((l) => l.letter === 'b');
    expect(letterPhrase(b)).toEqual({ hu: 'Bé, mint bicikli.', en: 'B, as in "bicycle".' });
  });
});

describe('rolled R practice data', () => {
  it('has technique tips with a title and explanation', () => {
    expect(technique.length).toBeGreaterThanOrEqual(3);
    for (const tip of technique) {
      expect(tip.title).toBeTruthy();
      expect(tip.text).toBeTruthy();
    }
  });

  it('has graduated practice tiers, each fully defined', () => {
    expect(tiers.length).toBeGreaterThanOrEqual(3);
    for (const tier of tiers) {
      expect(tier.title, tier.id).toBeTruthy();
      expect(tier.description, tier.id).toBeTruthy();
      expect(tier.items.length, tier.id).toBeGreaterThan(0);
      for (const item of tier.items) {
        expect(item.hu, tier.id).toBeTruthy();
        expect(item.en, tier.id).toBeTruthy();
      }
    }
  });

  it('has no duplicate practice items across tiers', () => {
    const items = allRolledRItems().map((i) => i.hu);
    expect(new Set(items).size).toBe(items.length);
  });
});
