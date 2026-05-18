import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Country, Lang, LevelKey } from '../data/countries';
import { getActivePool } from '../data/countries';

export interface Mastered {
  easy: string[];
  medium: string[];
  hard: string[];
}

export interface AppSettings {
  lang: Lang;
  sound: boolean;
  expandedPool: boolean;
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
  reset: () => void;
}

const initial: { mastered: Mastered; settings: AppSettings; recentlySeen: string[] } = {
  mastered: { easy: [], medium: [], hard: [] },
  settings: { lang: 'en', sound: true, expandedPool: false },
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
      reset: () => set(() => ({ ...initial })),
    }),
    {
      name: 'flag-quiz-state-v1',
      version: 1,
    },
  ),
);

export function poolFor(level: LevelKey, expanded: boolean): Country[] {
  return getActivePool(expanded).filter((c) => c.pools[level]);
}

export function isLevelUnlocked(
  level: LevelKey,
  mastered: Mastered,
  expanded: boolean,
): boolean {
  if (level === 'easy') return true;
  const prev: LevelKey = level === 'medium' ? 'easy' : 'medium';
  const prevPool = poolFor(prev, expanded);
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
