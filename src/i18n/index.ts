import { useGameStore } from '../store/gameStore';
import type { Lang } from '../data/countries';
import en, { type Dict } from './en';
import zh from './zh';

const DICTS: Record<Lang, Dict> = { en, zh };

type Path<T, P extends string = ''> = T extends object
  ? {
      [K in keyof T & string]: T[K] extends object
        ? Path<T[K], `${P}${K}.`> | `${P}${K}`
        : `${P}${K}`;
    }[keyof T & string]
  : never;

export type DictKey = Path<Dict>;

function get(dict: Dict, key: string): string {
  const parts = key.split('.');
  let value: unknown = dict;
  for (const p of parts) {
    if (value && typeof value === 'object' && p in (value as Record<string, unknown>)) {
      value = (value as Record<string, unknown>)[p];
    } else {
      return key;
    }
  }
  return typeof value === 'string' ? value : key;
}

function interpolate(s: string, params?: Record<string, string | number>): string {
  if (!params) return s;
  return s.replace(/\{(\w+)\}/g, (_, k) => (k in params ? String(params[k]) : `{${k}}`));
}

export function useT() {
  const lang = useGameStore((s) => s.settings.lang);
  const dict = DICTS[lang];
  return (key: DictKey, params?: Record<string, string | number>) =>
    interpolate(get(dict, key), params);
}

export function useLang(): Lang {
  return useGameStore((s) => s.settings.lang);
}
