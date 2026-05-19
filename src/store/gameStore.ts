import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Country, Lang, LevelKey } from '../data/countries';
import { getActivePool } from '../data/countries';

export interface Mastered {
  easy: string[];
  fill: string[];
  medium: string[];
  hard: string[];
}

export interface AppSettings {
  lang: Lang;
  sound: boolean;
  expandedPool: boolean;
  /** When true, only `TESTING_UNLOCK_COUNT` countries are needed to unlock the next level. */
  testingMode: boolean;
}

interface State {
  mastered: Mastered;
  settings: AppSettings;
  recentlySeen: string[];
  markCorrect: (level: LevelKey, code: string) => void;
  markSeen: (code: string) => void;
  setLang: (lang: Lang) => void;
  setSound: (v: boolean) => void;
  setExpandedPool: (v: boolean) => void;
  setTestingMode: (v: boolean) => void;
  reset: () => void;
}

/** How many countries you need in testing mode to unlock the next level. */
export const TESTING_UNLOCK_COUNT = 5;

const initial: { mastered: Mastered; settings: AppSettings; recentlySeen: string[] } = {
  mastered: { easy: [], fill: [], medium: [], hard: [] },
  settings: { lang: 'en', sound: true, expandedPool: false, testingMode: false },
  recentlySeen: [],
};

export const useGameStore = create<State>()(
  persist(
    (set) => ({
      ...initial,
      markCorrect: (level, code) =>
        set((s) => {
          if (s.mastered[level].includes(code)) return s;
          return {
            mastered: { ...s.mastered, [level]: [...s.mastered[level], code] },
          };
        }),
      markSeen: (code) =>
        set((s) => {
          const recent = [code, ...s.recentlySeen.filter((c) => c !== code)].slice(0, 40);
          return { recentlySeen: recent };
        }),
      setLang: (lang) => set((s) => ({ settings: { ...s.settings, lang } })),
      setSound: (sound) => set((s) => ({ settings: { ...s.settings, sound } })),
      setExpandedPool: (expandedPool) =>
        set((s) => ({ settings: { ...s.settings, expandedPool } })),
      setTestingMode: (testingMode) =>
        set((s) => ({ settings: { ...s.settings, testingMode } })),
      reset: () => set(() => ({ ...initial })),
    }),
    {
      name: 'flag-quiz-state-v1',
      version: 2,
      // v1 -> v2: introduced the Fill level + testingMode setting. Existing
      // mastered easy/medium/hard arrays are preserved; fill starts empty.
      migrate: (persisted: unknown, version) => {
        if (!persisted || typeof persisted !== 'object') return persisted as never;
        const p = persisted as {
          mastered?: Partial<Mastered>;
          settings?: Partial<AppSettings>;
          recentlySeen?: string[];
        };
        if (version < 2) {
          return {
            mastered: {
              easy: p.mastered?.easy ?? [],
              fill: [],
              medium: p.mastered?.medium ?? [],
              hard: p.mastered?.hard ?? [],
            },
            settings: {
              lang: p.settings?.lang ?? 'en',
              sound: p.settings?.sound ?? true,
              expandedPool: p.settings?.expandedPool ?? false,
              testingMode: false,
            },
            recentlySeen: p.recentlySeen ?? [],
          };
        }
        return persisted as never;
      },
    },
  ),
);

export function poolFor(level: LevelKey, expanded: boolean): Country[] {
  return getActivePool(expanded).filter((c) => c.pools[level]);
}

/** Previous level in the unlock chain. Returns null for the first level. */
export function previousLevel(level: LevelKey): LevelKey | null {
  switch (level) {
    case 'easy':
      return null;
    case 'fill':
      return 'easy';
    case 'medium':
      return 'fill';
    case 'hard':
      return 'medium';
  }
}

export function isLevelUnlocked(
  level: LevelKey,
  mastered: Mastered,
  expanded: boolean,
  testingMode = false,
): boolean {
  const prev = previousLevel(level);
  if (prev === null) return true;
  const prevPool = poolFor(prev, expanded);
  const prevCodes = new Set(prevPool.map((c) => c.code));
  const masteredInPool = mastered[prev].filter((c) => prevCodes.has(c)).length;
  if (testingMode) {
    return masteredInPool >= Math.min(TESTING_UNLOCK_COUNT, prevPool.length);
  }
  return prevPool.every((c) => mastered[prev].includes(c.code));
}

export function levelProgress(
  level: LevelKey,
  mastered: Mastered,
  expanded: boolean,
): { done: number; total: number } {
  const pool = poolFor(level, expanded);
  const codes = new Set(pool.map((c) => c.code));
  const done = mastered[level].filter((c) => codes.has(c)).length;
  return { done, total: pool.length };
}
