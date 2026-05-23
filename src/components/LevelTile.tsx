import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import clsx from 'clsx';
import type { LevelKey } from '../data/countries';
import { ProgressBar } from './ProgressBar';
import { Globie } from './Globie';
import { useT } from '../i18n';

interface Props {
  level: LevelKey;
  unlocked: boolean;
  done: number;
  total: number;
}

const palette = {
  easy: {
    border: 'border-sky-deep',
    body: 'bg-sky-soft',
    head: 'bg-sky-main text-white',
    color: 'sky' as const,
    icon: '☁️',
  },
  fill: {
    border: 'border-candy-deep',
    body: 'bg-candy-soft',
    head: 'bg-candy-main text-white',
    color: 'candy' as const,
    icon: '✏️',
  },
  medium: {
    border: 'border-mint-deep',
    body: 'bg-mint-soft',
    head: 'bg-mint-main text-white',
    color: 'mint' as const,
    icon: '🌱',
  },
  hard: {
    border: 'border-sun-deep',
    body: 'bg-sun-soft',
    head: 'bg-sun-main text-ink',
    color: 'sun' as const,
    icon: '⭐',
  },
};

export function LevelTile({ level, unlocked, done, total }: Props) {
  const t = useT();
  const p = palette[level];
  const lockedCaption =
    level === 'fill'
      ? t('lockedFill')
      : level === 'medium'
        ? t('lockedMedium')
        : level === 'hard'
          ? t('lockedHard')
          : '';
  const inner = (
    <motion.div
      whileTap={unlocked ? { y: 3, scale: 0.98 } : { rotate: [0, -1.5, 1.5, -1, 1, 0] }}
      transition={{ duration: 0.35 }}
      className={clsx(
        'relative rounded-xl2 border-2 border-ink/5 bg-white shadow-sticker overflow-hidden transition-all',
        !unlocked && 'opacity-90 grayscale-[20%]',
      )}
    >
      <div className={clsx('flex items-center justify-between gap-3 px-5 py-3.5 font-extrabold text-2xl tracking-wide', p.head)}>
        <span className="flex items-center gap-2">
          <span className="text-2xl animate-[floaty_4s_ease-in-out_infinite]" aria-hidden>
            {p.icon}
          </span>
          <span>{t(`levels.${level}` as const)}</span>
        </span>
        <span className="text-sm font-bold opacity-90 bg-white/20 px-2.5 py-0.5 rounded-full select-none">{t(`levels.${level}Desc` as const)}</span>
      </div>
      <div className={clsx('px-5 py-4.5 flex items-center gap-4 border-t border-ink/5', p.body)}>
        {unlocked ? (
          <>
            <div className="flex-1">
              <ProgressBar value={done} max={total} color={p.color} />
              <div className="mt-2.5 text-sm font-bold text-ink/70">
                {t('progress', { done, total })}
              </div>
            </div>
            <div className="rounded-pill bg-white text-ink font-extrabold text-lg px-6 py-2.5 shadow-button border border-ink/5 transition-transform active:translate-y-0.5">
              {t('play')}
            </div>
          </>
        ) : (
          <div className="flex items-center gap-3 w-full">
            <div className="shrink-0">
              <Globie mood="sleepy" size={64} bobbing={false} />
            </div>
            <div className="flex-1">
              <div className="text-xl font-extrabold text-ink">{t('lockedTitle')}</div>
              <div className="text-sm font-semibold text-ink/60">{lockedCaption}</div>
            </div>
            <div className="text-3xl bg-ink/5 w-11 h-11 rounded-full flex items-center justify-center border border-ink/10 select-none" aria-hidden>
              🔒
            </div>
          </div>
        )}
      </div>
    </motion.div>
  );

  if (!unlocked) return <div>{inner}</div>;
  return (
    <Link to={`/game/${level}`} className="block no-underline text-inherit">
      {inner}
    </Link>
  );
}
