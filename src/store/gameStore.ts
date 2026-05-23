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

export interface Stamp {
  emoji: string;
  cost: number;
  name: { en: string; zh: string };
}

export const STAMP_CATALOG: Stamp[] = [
  { emoji: '⭐', cost: 0, name: { en: 'Star', zh: '星星' } },
  { emoji: '🎈', cost: 5, name: { en: 'Balloon', zh: '气球' } },
  { emoji: '🍕', cost: 10, name: { en: 'Pizza', zh: '披萨' } },
];

interface State {
  mastered: Mastered;
  settings: AppSettings;
  recentlySeen: string[];
  coins: number;
  unlockedStamps: string[];
  countryStamps: Record<string, string>;
  markCorrect: (level: LevelKey, code: string) => void;
  markSeen: (code: string) => void;
  setLang: (lang: Lang) => void;
  setSound: (v: boolean) => void;
  setExpandedPool: (v: boolean) => void;
  setTestingMode: (v: boolean) => void;
  buyStamp: (stamp: string, cost: number) => void;
  setCountryStamp: (code: string, stamp: string) => void;
  reset: () => void;
}

/** How many countries you need in testing mode to unlock the next level. */
export const TESTING_UNLOCK_COUNT = 5;

const initial: {
  mastered: Mastered;
  settings: AppSettings;
  recentlySeen: string[];
  coins: number;
  unlockedStamps: string[];
  countryStamps: Record<string, string>;
} = {
  mastered: { easy: [], fill: [], medium: [], hard: [] },
  settings: { lang: 'en', sound: true, expandedPool: false, testingMode: false },
  recentlySeen: [],
  coins: 0,
  unlockedStamps: ['⭐'],
  countryStamps: {},
};

export const useGameStore = create<State>()(
  persist(
    (set) => ({
      ...initial,
      markCorrect: (level, code) =>
        set((s) => {
          const alreadyMastered = s.mastered[level].includes(code);
          const newMastered = alreadyMastered
            ? s.mastered[level]
            : [...s.mastered[level], code];

          // +1/+2/+3/+5 for new masteries, +1 practice coin for repeats
          const reward = alreadyMastered
            ? 1
            : level === 'easy'
            ? 1
            : level === 'fill'
            ? 2
            : level === 'medium'
            ? 3
            : 5;

          return {
            mastered: { ...s.mastered, [level]: newMastered },
            coins: s.coins + reward,
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
      buyStamp: (stamp, cost) =>
        set((s) => {
          if (s.coins < cost) return s;
          if (s.unlockedStamps.includes(stamp)) return s;
          return {
            coins: s.coins - cost,
            unlockedStamps: [...s.unlockedStamps, stamp],
          };
        }),
      setCountryStamp: (code, stamp) =>
        set((s) => {
          if (!s.unlockedStamps.includes(stamp)) return s;
          return {
            countryStamps: { ...s.countryStamps, [code]: stamp },
          };
        }),
      reset: () => set(() => ({ ...initial })),
    }),
    {
      name: 'flag-quiz-state-v1',
      version: 3,
      // Migration:
      // v1 -> v2: introduced Fill level + testingMode.
      // v2 -> v3: introduced coins, unlockedStamps, countryStamps.
      migrate: (persisted: unknown, version) => {
        if (!persisted || typeof persisted !== 'object') return persisted as never;
        
        let data = { ...persisted } as Record<string, any>;
        
        if (version < 2) {
          data = {
            mastered: {
              easy: data.mastered?.easy ?? [],
              fill: [],
              medium: data.mastered?.medium ?? [],
              hard: data.mastered?.hard ?? [],
            },
            settings: {
              lang: data.settings?.lang ?? 'en',
              sound: data.settings?.sound ?? true,
              expandedPool: data.settings?.expandedPool ?? false,
              testingMode: false,
            },
            recentlySeen: data.recentlySeen ?? [],
          };
        }
        
        if (version < 3) {
          data = {
            ...data,
            coins: data.coins ?? 0,
            unlockedStamps: data.unlockedStamps ?? ['⭐'],
            countryStamps: data.countryStamps ?? {},
          };
        }
        
        return data as never;
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
