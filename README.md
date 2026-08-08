# Learn Hungarian 🇭🇺 — Tanulj magyarul!

An interactive Svelte web app that teaches you Hungarian from scratch: a guided course,
themed vocabulary lessons, grammar guides with typed drills, mixed practice sessions,
spaced-repetition review, graded reading, real-life conversation practice, audio throughout,
microphone-based pronunciation checks, and mini games to make it all stick.

## Features

- **🧭 A guided course** — nine ordered units that interleave lessons, grammar, practice
  sessions, dialogues and readings in an order that builds, each ending in a mixed
  *checkpoint*. The course recommends exactly one next step (soft gating — nothing is ever
  locked), and the Home dashboard's main button always knows where you left off.
- **✏️ A learn-by-doing exercise engine** — every lesson and grammar guide has a practice
  session mixing multiple choice, typed translation (EN→HU), cloze gap-fill, word-order
  tiles, and listening dictation. Typed answers are graded accent-leniently, corrections are
  always shown, and production items feed the spaced-repetition deck so practice counts.
- **📚 10 themed lessons** (greetings, numbers, family, food, around town, time, talking
  about the past, verbs, interviews, adjectives & colours) — every word with an English
  translation, a phonetic guide and audio. Each lesson has a *Learn*, *Practise speaking* and
  *Quiz* tab.
- **🔁 Spaced repetition** — a Leitner deck of words *and* phrases, released lesson-by-lesson
  as you progress through the course, with an on-screen accent bar (á é í ó ö ő ú ü ű) for
  keyboards without Hungarian accents.
- **✏️ Quizzes** — multiple-choice in both directions (HU→EN and EN→HU) with instant feedback,
  mistake review and per-lesson best scores.
- **🔊 Audio everywhere** — Hungarian text-to-speech (Web Speech API, `hu-HU` voice) on every
  word, phrase, example sentence, reading and dialogue line.
- **🎤 Pronunciation checks** — speak into your microphone and get a similarity score against
  the target phrase (speech recognition + Levenshtein scoring), with a dedicated
  *Pronunciation Lab* including a tongue-twister corner (`gyógyszertár`, anyone?) and full
  **alphabet practice**: say each of the 44 letters' names plus a word that uses it (`bé, mint
  bicikli`) — the same way Hungarians spell things out loud.
- **🧩 10 grammar guides, each with typed drills** — alphabet & pronunciation, vowel harmony,
  "to be", present-tense conjugation (indefinite vs definite), cases & suffixes,
  articles/plurals/possession, word order & questions, the past tense, formal register, and
  dates & life events. All with audio examples, tables and a *Practise this* session.
- **⚙️ Verb trainer with two tenses** — full present *and* past conjugation tables (including
  lenni: vagyok… / voltam…) with a Present/Past toggle on both the browsable tables and the
  typing drill.
- **📖 Reading exercises** — graded texts with tap-to-reveal translations, read-aloud audio
  and comprehension questions.
- **💬 Conversation skills** — five real-life dialogues (café, market, directions, restaurant,
  meeting someone). Study mode, then *role-play mode*: the app speaks the other part and you
  say your lines out loud with pronunciation scoring.
- **🎲 Mini games** — a full-screen *Quick Fire* speed round (a word flashes up, tap its
  translation before the timer runs out — built for a spare few minutes one-handed),
  flashcards, matching pairs, word scramble and a listening challenge. Best scores are saved.
- **📈 Progress tracking** — course steps, quiz and exercise scores, spaced-repetition state,
  known words, completed readings/dialogues and pronunciation stars, persisted in
  `localStorage`.
- **🪪 Citizenship interview prep** — common naturalisation (honosítás) interview questions
  about yourself, your home, your job and your family, each with model answers and grammar
  tips, plus interactive sentence builders so you can assemble grammatically correct answers
  about your own real job, region and children.

## Getting started

```bash
npm install
npm run dev      # start the dev server
npm run build    # production build into dist/
npm run preview  # serve the production build
npm test         # run the unit + smoke test suite (vitest)
```

Then open the printed URL (typically http://localhost:5173).

## Browser notes

- **Audio (text-to-speech)** works in all modern browsers. A Hungarian (`hu-HU`) voice gives
  the most authentic audio — Chrome and Edge ship one; other browsers fall back to the default voice.
- **Pronunciation checking (speech recognition)** uses the Web Speech API's
  `SpeechRecognition`, currently supported in **Chrome and Edge**. The app detects support and
  degrades gracefully elsewhere (you can still listen and repeat).
- The microphone permission prompt appears the first time you press "🎤 Say it".

## Tech

- [Svelte 5](https://svelte.dev) (runes) + [Vite](https://vitejs.dev)
- [Vitest](https://vitest.dev) + jsdom — 200+ tests covering the course engine, exercise
  builders, spaced repetition, quiz engine, text/scoring utilities, progress store (including
  legacy-save migration), router, data integrity and a mounted-app smoke test
- No backend, no API keys: audio and speech recognition run entirely in the browser
- Hash-based routing, so the build is a fully static site you can host anywhere

## Project layout

```
src/
  App.svelte            app shell + navigation
  pages/                one component per section (Lessons, Grammar, Reading, ...)
  lib/
    data/               the course content (course units, lessons, grammar, readings, dialogues, citizenship)
    components/         shared UI (AudioButton, PronunciationCheck, Quiz, ExerciseRunner, AccentBar)
    games/              the mini games
    course.js           course progression: step completion, next step, review-pool gating
    exercises.js        exercise session builders (mcq / typed / cloze / word order / dictation)
    srs.js              Leitner spaced-repetition scheduling
    speech.js           text-to-speech + speech recognition + scoring
    quiz.js             quiz generation and grading
    verbdrill.js        conjugation drill builder (present + past)
    text.js             normalisation, Levenshtein, shuffle/scramble helpers
    progress.js         localStorage-backed progress store
```

Sok sikert a tanuláshoz! (Good luck with your studies!)
