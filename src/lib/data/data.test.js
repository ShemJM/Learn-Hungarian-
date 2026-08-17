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
import { verbs, PRONOUNS } from './verbs.js';
import { technique, tiers, allRolledRItems } from './rolledR.js';
import { course, getUnit } from './course.js';
import { getExerciseSet } from '../exercises.js';
import { checkAnswer } from '../text.js';

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
    expect(getLesson('weather')?.title).toBe('Weather & Seasons');
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

  it('every guide has practice exercises that self-grade as exact', () => {
    for (const g of grammarGuides) {
      expect(g.exercises.length, g.id).toBeGreaterThanOrEqual(6);
      for (const e of g.exercises) {
        expect(e.prompt, g.id).toBeTruthy();
        const answers = Array.isArray(e.answer) ? e.answer : [e.answer];
        expect(answers.length, `${g.id}: ${e.prompt}`).toBeGreaterThan(0);
        for (const a of answers) {
          // Catches stray whitespace/empty variants mechanically.
          expect(checkAnswer(a, answers), `${g.id}: ${e.prompt}`).toBe('exact');
        }
        if ('hint' in e) expect(e.hint, `${g.id}: ${e.prompt}`).toBeTruthy();
      }
    }
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

describe('verbs data', () => {
  it('has at least 12 verbs with unique infinitives', () => {
    expect(verbs.length).toBeGreaterThanOrEqual(12);
    expect(new Set(verbs.map((v) => v.inf)).size).toBe(verbs.length);
  });

  it('every verb is fully defined with a valid harmony class', () => {
    for (const v of verbs) {
      expect(v.en, v.inf).toBeTruthy();
      expect(v.pron, v.inf).toBeTruthy();
      expect(typeof v.ik, v.inf).toBe('boolean');
      expect(['back', 'front', 'front-rounded'], v.inf).toContain(v.harmony);
    }
  });

  it('conjugation tables have one non-empty form per pronoun (or null definite)', () => {
    for (const v of verbs) {
      expect(v.indefinite.length, v.inf).toBe(PRONOUNS.length);
      const tables = v.definite ? [v.indefinite, v.definite] : [v.indefinite];
      if (v.definite) expect(v.definite.length, v.inf).toBe(PRONOUNS.length);
      for (const table of tables) {
        for (const cell of table) {
          const variants = Array.isArray(cell) ? cell : [cell];
          expect(variants.length, v.inf).toBeGreaterThan(0);
          for (const form of variants) expect(form, v.inf).toBeTruthy();
        }
      }
    }
  });

  it('includes intransitive verbs without a definite conjugation', () => {
    expect(verbs.some((v) => v.definite === null)).toBe(true);
  });

  it('every verb has full past, conditional and imperative tables matching its transitivity', () => {
    for (const v of verbs) {
      for (const mood of ['past', 'conditional', 'imperative']) {
        const t = v[mood];
        expect(t, `${v.inf} ${mood}`).toBeTruthy();
        expect(t.indefinite.length, `${v.inf} ${mood}`).toBe(PRONOUNS.length);
        // Definite tables exist exactly when the present definite does.
        expect(t.definite === null, `${v.inf} ${mood}`).toBe(v.definite === null);
        const tables = t.definite ? [t.indefinite, t.definite] : [t.indefinite];
        if (t.definite) expect(t.definite.length, `${v.inf} ${mood}`).toBe(PRONOUNS.length);
        for (const table of tables) {
          for (const cell of table) {
            const variants = Array.isArray(cell) ? cell : [cell];
            expect(variants.length, `${v.inf} ${mood}`).toBeGreaterThan(0);
            for (const form of variants) expect(form, `${v.inf} ${mood}`).toBeTruthy();
          }
        }
      }
    }
  });

  it('the conditional 1sg indefinite always ends in -nék, even for back verbs', () => {
    for (const v of verbs) {
      const cell = v.conditional.indefinite[0];
      const display = Array.isArray(cell) ? cell[0] : cell;
      expect(display.endsWith('nék'), `${v.inf}: ${display}`).toBe(true);
    }
  });

  it('spot-checks the trickiest imperative and conditional forms', () => {
    const byInf = Object.fromEntries(verbs.map((v) => [v.inf, v]));
    expect(byInf['látni'].imperative.indefinite[0]).toBe('lássak'); // t+j → ss
    expect(byInf['enni'].imperative.definite[1]).toEqual(['edd', 'egyed']); // fused 2sg
    expect(byInf['venni'].imperative.indefinite[1][0]).toBe('vegyél'); // vegy- stem
    expect(byInf['lenni'].imperative.indefinite[1][0]).toBe('legyél');
    expect(byInf['jönni'].imperative.indefinite[1][0]).toBe('gyere'); // suppletive
    expect(byInf['dolgozni'].imperative.indefinite[0]).toEqual(['dolgozzak', 'dolgozzam']); // -ik variants
    expect(byInf['szeretni'].conditional.definite[0]).toBe('szeretném'); // the polite classic
    expect(byInf['főzni'].imperative.indefinite[2]).toBe('főzzön'); // z doubles, rounded 3sg
  });

  it('includes lenni, the most important verb of all', () => {
    const lenni = verbs.find((v) => v.inf === 'lenni');
    expect(lenni.indefinite).toEqual(['vagyok', 'vagy', 'van', 'vagyunk', 'vagytok', 'vannak']);
    expect(lenni.past.indefinite).toEqual(['voltam', 'voltál', 'volt', 'voltunk', 'voltatok', 'voltak']);
  });

  it('spot-checks the irregular v-stem venni and the -ik verb dolgozni', () => {
    const venni = verbs.find((v) => v.inf === 'venni');
    expect(venni.indefinite).toEqual(['veszek', 'veszel', 'vesz', 'veszünk', 'vesztek', 'vesznek']);
    expect(venni.definite[3]).toBe('vesszük'); // geminate sz
    expect(venni.past.definite).toEqual(['vettem', 'vetted', 'vette', 'vettük', 'vettétek', 'vették']);
    const dolgozni = verbs.find((v) => v.inf === 'dolgozni');
    expect(dolgozni.indefinite[0]).toEqual(['dolgozom', 'dolgozok']); // standard first, colloquial accepted
    expect(dolgozni.past.indefinite[2]).toBe('dolgozott');
  });
});

describe('course data', () => {
  const allSteps = course.flatMap((u) => u.steps);

  it('has units with unique ids, titles and globally unique step ids', () => {
    expect(course.length).toBeGreaterThanOrEqual(8);
    expect(new Set(course.map((u) => u.id)).size).toBe(course.length);
    for (const u of course) {
      expect(u.title, u.id).toBeTruthy();
      expect(u.icon, u.id).toBeTruthy();
      expect(u.blurb, u.id).toBeTruthy();
      expect(u.steps.length, u.id).toBeGreaterThan(0);
    }
    expect(new Set(allSteps.map((s) => s.id)).size).toBe(allSteps.length);
    expect(getUnit('u1')?.title).toBe('First Words');
    expect(getUnit('u10')?.title).toBe('Everyday Life');
    expect(getUnit('nope')).toBeNull();
  });

  it('every step reference resolves to real content', () => {
    for (const step of allSteps) {
      const label = `${step.id} (${step.type}:${step.ref})`;
      switch (step.type) {
        case 'lesson':
          expect(getLesson(step.ref), label).not.toBeNull();
          break;
        case 'guide':
          expect(getGuide(step.ref), label).not.toBeNull();
          break;
        case 'reading':
          expect(getReading(step.ref), label).not.toBeNull();
          break;
        case 'dialogue':
          expect(getDialogue(step.ref), label).not.toBeNull();
          break;
        case 'practice':
        case 'checkpoint':
          expect(getExerciseSet(step.ref), label).not.toBeNull();
          break;
        case 'verbs':
          expect(['present', 'past', 'conditional', 'imperative'], label).toContain(step.ref);
          break;
        default:
          throw new Error(`unknown step type: ${label}`);
      }
    }
  });

  it('covers every lesson and every grammar guide exactly once — no orphaned content', () => {
    const lessonRefs = allSteps.filter((s) => s.type === 'lesson').map((s) => s.ref);
    expect(lessonRefs.sort()).toEqual(lessons.map((l) => l.id).sort());
    const guideRefs = allSteps.filter((s) => s.type === 'guide').map((s) => s.ref);
    expect(guideRefs.sort()).toEqual(grammarGuides.map((g) => g.id).sort());
  });

  it('references every reading and dialogue at most once', () => {
    const readingRefs = allSteps.filter((s) => s.type === 'reading').map((s) => s.ref);
    expect(new Set(readingRefs).size).toBe(readingRefs.length);
    const dialogueRefs = allSteps.filter((s) => s.type === 'dialogue').map((s) => s.ref);
    expect(new Set(dialogueRefs).size).toBe(dialogueRefs.length);
  });

  it('every unit ends with its own checkpoint', () => {
    for (const u of course) {
      const last = u.steps[u.steps.length - 1];
      expect(last.type, u.id).toBe('checkpoint');
      expect(last.ref, u.id).toBe('checkpoint:' + u.id);
    }
  });

  it('checkpoint sessions build non-empty item sets', () => {
    let s = 5;
    const rng = () => {
      s = (s * 1664525 + 1013904223) % 4294967296;
      return s / 4294967296;
    };
    for (const u of course) {
      const set = getExerciseSet('checkpoint:' + u.id);
      expect(set.build(rng).length, u.id).toBeGreaterThanOrEqual(10);
    }
  });

  it('no lesson word or phrase collides with the phrase key prefix', () => {
    // Documented invariant: phrase SRS keys are 'p:' + hu, so no raw hu may start with 'p:'.
    for (const w of [...allWords(), ...allPhrases()]) {
      expect(w.hu.startsWith('p:')).toBe(false);
    }
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
