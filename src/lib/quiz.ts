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
  return ['easy', 'fill', 'medium', 'hard'];
}

/**
 * How many positions to blank out for the Fill round, given the count of
 * blank-able characters (letters for `en`, characters for `zh`) in the
 * country name. See AGENTS.md §11 for the rationale.
 */
export function blanksForLength(n: number, lang: 'en' | 'zh'): number {
  if (n <= 0) return 0;
  if (lang === 'en') {
    if (n <= 4) return 1;
    if (n <= 7) return 2;
    if (n <= 11) return 3;
    return 4;
  }
  if (n <= 4) return 1;
  return 2;
}

/**
 * Choose which positions in `letters` to turn into blanks.
 *
 * Rules:
 *  - Only blank-able positions are considered (`predicate(ch) === true`).
 *  - For `en`, the first blank-able position is reserved (never blanked) when
 *    we have more candidates than required — gives the kid a starting anchor.
 *  - We greedy-pick to avoid two adjacent blanks (better phonetic context);
 *    fall back to closer picks only if necessary.
 *  - Random within the constraints — each call returns a fresh layout.
 */
export function pickBlankIndices(
  letters: string[],
  count: number,
  lang: 'en' | 'zh',
  predicate: (ch: string) => boolean,
): Set<number> {
  if (count <= 0) return new Set();
  const candidates: number[] = [];
  for (let i = 0; i < letters.length; i++) {
    if (predicate(letters[i])) candidates.push(i);
  }
  if (candidates.length === 0) return new Set();
  if (candidates.length <= count) return new Set(candidates);

  // For Latin scripts, reserve the first letter so the kid sees an anchor.
  let pool = candidates;
  if (lang === 'en' && candidates.length > count) {
    pool = candidates.slice(1);
  }

  // Greedy spaced selection: shuffle then accept if not adjacent to any pick.
  const shuffled = shuffle([...pool]);
  const picked: number[] = [];
  for (const idx of shuffled) {
    if (picked.length >= count) break;
    const adjacent = picked.some((p) => Math.abs(p - idx) <= 1);
    if (!adjacent) picked.push(idx);
  }
  // If we didn't fill the quota (string was too dense to keep gaps), relax.
  if (picked.length < count) {
    for (const idx of shuffled) {
      if (picked.length >= count) break;
      if (!picked.includes(idx)) picked.push(idx);
    }
  }
  return new Set(picked);
}
