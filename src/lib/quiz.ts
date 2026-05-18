import type { Country, LevelKey } from '../data/countries';
import { shuffle, sample } from './shuffle';

/**
 * Pick the next country for a round.
 * Preference order:
 *   1. Unmastered + not recently seen
 *   2. Unmastered (even if recently seen) — when all unmastered have been seen
 *   3. Any (post-mastery free play) — least recently seen wins
 */
export function pickNext(
  pool: Country[],
  mastered: string[],
  recentlySeen: string[],
): Country {
  const masteredSet = new Set(mastered);
  const recentSet = new Set(recentlySeen);
  const unmastered = pool.filter((c) => !masteredSet.has(c.code));
  const candidates =
    unmastered.length === 0
      ? pool
      : unmastered.filter((c) => !recentSet.has(c.code)).length > 0
        ? unmastered.filter((c) => !recentSet.has(c.code))
        : unmastered;
  return candidates[Math.floor(Math.random() * candidates.length)];
}

/** Build N options for Easy round — 1 correct + (N-1) distinct random distractors */
export function buildEasyOptions(
  pool: Country[],
  answer: Country,
  count = 4,
): Country[] {
  const others = pool.filter((c) => c.code !== answer.code);
  const distractors = sample(others, count - 1);
  return shuffle([answer, ...distractors]);
}

/**
 * Tiles for Medium round.
 * For Latin scripts we use letters (uppercase, ignoring spaces).
 * For CJK we use individual characters from the answer plus distractor chars.
 */
export function buildMediumTiles(
  answer: string,
  language: 'en' | 'zh',
  distractorPool: string[],
  totalTiles: number,
): { tiles: string[]; targetChars: string[] } {
  if (language === 'en') {
    const targetChars = [...answer.toUpperCase()].filter((ch) => /[A-Z]/.test(ch));
    const needed = Math.max(totalTiles - targetChars.length, 0);
    const decoyAlphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('').filter(
      (l) => !targetChars.includes(l),
    );
    const decoys = sample(decoyAlphabet, Math.min(needed, decoyAlphabet.length));
    return { tiles: shuffle([...targetChars, ...decoys]), targetChars };
  }
  const targetChars = [...answer];
  const need = Math.max(totalTiles - targetChars.length, 0);
  const decoyPool = distractorPool.filter((ch) => !targetChars.includes(ch));
  const decoys = sample(decoyPool, Math.min(need, decoyPool.length));
  return { tiles: shuffle([...targetChars, ...decoys]), targetChars };
}

export function normalizeAnswer(s: string, lang: 'en' | 'zh'): string {
  if (lang === 'en') return s.toUpperCase().replace(/[^A-Z]/g, '');
  return s.replace(/\s/g, '');
}

export function isCorrect(
  guess: string,
  truth: string,
  lang: 'en' | 'zh',
): boolean {
  return normalizeAnswer(guess, lang) === normalizeAnswer(truth, lang);
}

export function answerSlotCount(answer: string, lang: 'en' | 'zh'): number {
  if (lang === 'en') return [...answer.toUpperCase()].filter((c) => /[A-Z]/.test(c)).length;
  return [...answer].length;
}

export function levelOrder(): LevelKey[] {
  return ['easy', 'medium', 'hard'];
}
