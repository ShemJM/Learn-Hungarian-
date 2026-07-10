# Learn Hungarian 🇭🇺 — Tanulj magyarul!

An interactive Svelte web app that teaches you Hungarian from scratch: themed vocabulary
lessons, grammar guides, graded reading, real-life conversation practice, audio throughout,
microphone-based pronunciation checks, and mini games to make it all stick.

## Features

- **📚 8 themed lessons** (greetings, numbers, family, food, around town, time, verbs,
  adjectives & colours) — every word with an English translation, a phonetic guide and audio.
  Each lesson has a *Learn*, *Practise speaking* and *Quiz* tab.
- **✏️ Quizzes** — multiple-choice in both directions (HU→EN and EN→HU) with instant feedback,
  mistake review and per-lesson best scores.
- **🔊 Audio everywhere** — Hungarian text-to-speech (Web Speech API, `hu-HU` voice) on every
  word, phrase, example sentence, reading and dialogue line.
- **🎤 Pronunciation checks** — speak into your microphone and get a similarity score against
  the target phrase (speech recognition + Levenshtein scoring), with a dedicated
  *Pronunciation Lab* including a tongue-twister corner (`gyógyszertár`, anyone?) and full
  **alphabet practice**: say each of the 44 letters' names plus a word that uses it (`bé, mint
  bicikli`) — the same way Hungarians spell things out loud.
- **🧩 7 grammar guides** — alphabet & pronunciation, vowel harmony, "to be", present-tense
  conjugation (indefinite vs definite), cases & suffixes, articles/plurals/possession, and
  word order & questions. All with audio examples and tables.
- **📖 Reading exercises** — graded texts with tap-to-reveal translations, read-aloud audio
  and comprehension questions.
- **💬 Conversation skills** — five real-life dialogues (café, market, directions, restaurant,
  meeting someone). Study mode, then *role-play mode*: the app speaks the other part and you
  say your lines out loud with pronunciation scoring.
- **🎲 Mini games** — a full-screen *Quick Fire* speed round (a word flashes up, tap its
  translation before the timer runs out — built for a spare few minutes one-handed),
  flashcards, matching pairs, word scramble and a listening challenge. Best scores are saved.
- **📈 Progress tracking** — quiz scores, known words, completed readings/dialogues and
  pronunciation stars, persisted in `localStorage`.
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
- [Vitest](https://vitest.dev) + jsdom — 66 tests covering the quiz engine, text/scoring
  utilities, progress store, router, course data integrity and a mounted-app smoke test
- No backend, no API keys: audio and speech recognition run entirely in the browser
- Hash-based routing, so the build is a fully static site you can host anywhere

## Project layout

```
src/
  App.svelte            app shell + navigation
  pages/                one component per section (Lessons, Grammar, Reading, ...)
  lib/
    data/               the course content (lessons, grammar, readings, dialogues, citizenship)
    components/         shared UI (AudioButton, PronunciationCheck, Quiz)
    games/              the mini games
    speech.js           text-to-speech + speech recognition + scoring
    quiz.js             quiz generation and grading
    text.js             normalisation, Levenshtein, shuffle/scramble helpers
    progress.js         localStorage-backed progress store
```

Sok sikert a tanuláshoz! (Good luck with your studies!)
