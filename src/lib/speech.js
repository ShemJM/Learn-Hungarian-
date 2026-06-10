/**
 * Audio (text-to-speech) and pronunciation checking (speech recognition)
 * built on the Web Speech API. Both prefer a Hungarian (hu-HU) voice.
 */
import { similarity } from './text.js';

let cachedVoice = null;

function pickHungarianVoice() {
  if (cachedVoice) return cachedVoice;
  const voices = window.speechSynthesis?.getVoices?.() || [];
  cachedVoice =
    voices.find((v) => v.lang?.toLowerCase().startsWith('hu')) ||
    voices.find((v) => v.name?.toLowerCase().includes('hungar')) ||
    null;
  return cachedVoice;
}

// Voice lists often load asynchronously.
if (typeof window !== 'undefined' && window.speechSynthesis) {
  window.speechSynthesis.onvoiceschanged = () => {
    cachedVoice = null;
    pickHungarianVoice();
  };
}

export function ttsAvailable() {
  return typeof window !== 'undefined' && 'speechSynthesis' in window;
}

/** Speak Hungarian text aloud. rate < 1 slows it down for learners. */
export function speak(text, { rate = 0.85 } = {}) {
  if (!ttsAvailable()) return false;
  window.speechSynthesis.cancel();
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = 'hu-HU';
  utterance.rate = rate;
  const voice = pickHungarianVoice();
  if (voice) utterance.voice = voice;
  window.speechSynthesis.speak(utterance);
  return true;
}

export function hasHungarianVoice() {
  return Boolean(pickHungarianVoice());
}

const SpeechRecognition =
  typeof window !== 'undefined' ? window.SpeechRecognition || window.webkitSpeechRecognition : null;

export function recognitionAvailable() {
  return Boolean(SpeechRecognition);
}

/**
 * Listen once for Hungarian speech and resolve with the transcript.
 * Rejects with an Error whose message describes the failure.
 */
export function listenOnce({ lang = 'hu-HU', timeoutMs = 8000 } = {}) {
  return new Promise((resolve, reject) => {
    if (!SpeechRecognition) {
      reject(new Error('Speech recognition is not supported in this browser. Try Chrome or Edge.'));
      return;
    }
    const rec = new SpeechRecognition();
    rec.lang = lang;
    rec.interimResults = false;
    rec.maxAlternatives = 3;
    let settled = false;
    const timer = setTimeout(() => {
      if (!settled) {
        settled = true;
        rec.abort();
        reject(new Error('No speech detected — try again.'));
      }
    }, timeoutMs);
    rec.onresult = (e) => {
      if (settled) return;
      settled = true;
      clearTimeout(timer);
      const alternatives = Array.from(e.results[0]).map((r) => r.transcript);
      resolve(alternatives);
    };
    rec.onerror = (e) => {
      if (settled) return;
      settled = true;
      clearTimeout(timer);
      reject(new Error(e.error === 'not-allowed' ? 'Microphone access was denied.' : `Recognition error: ${e.error}`));
    };
    rec.onend = () => {
      if (!settled) {
        settled = true;
        clearTimeout(timer);
        reject(new Error('No speech detected — try again.'));
      }
    };
    rec.start();
  });
}

/**
 * Record one utterance and score it against the target phrase.
 * Resolves { transcript, score } where score is the best similarity (0..1)
 * across the recognizer's alternatives.
 */
export async function checkPronunciation(target) {
  const alternatives = await listenOnce();
  let best = { transcript: alternatives[0] || '', score: 0 };
  for (const transcript of alternatives) {
    const score = similarity(transcript, target);
    if (score > best.score) best = { transcript, score };
  }
  return best;
}

/** Human feedback for a pronunciation score. */
export function pronunciationFeedback(score) {
  if (score >= 0.9) return { label: 'Tökéletes! (Perfect!)', emoji: '🌟', tone: 'good' };
  if (score >= 0.7) return { label: 'Nagyon jó! (Very good!)', emoji: '✅', tone: 'good' };
  if (score >= 0.45) return { label: 'Majdnem! (Almost!) Listen and try again.', emoji: '🙂', tone: 'mid' };
  return { label: 'Próbáld újra! (Try again!) Listen carefully first.', emoji: '🔁', tone: 'bad' };
}
