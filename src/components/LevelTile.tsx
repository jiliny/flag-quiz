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
      whileTap={unlocked ? { y: 4, scale: 0.98 } : { rotate: [0, -2, 2, -1, 1, 0] }}
      transition={{ duration: 0.4 }}
      className={clsx(
        'relative rounded-xl2 border-4 bg-white shadow-sticker overflow-hidden',
        p.border,
        !unlocked && 'opacity-90',
      )}
    >
      <div className={clsx('flex items-center justify-between gap-3 px-5 py-3 font-semibold text-2xl', p.head)}>
        <span className="flex items-center gap-2">
          <span className="text-2xl" aria-hidden>
            {p.icon}
          </span>
          <span>{t(`levels.${level}` as const)}</span>
        </span>
        <span className="text-base font-medium opacity-90">{t(`levels.${level}Desc` as const)}</span>
      </div>
      <div className={clsx('px-5 py-4 flex items-center gap-4', p.body)}>
        {unlocked ? (
          <>
            <div className="flex-1">
              <ProgressBar value={done} max={total} color={p.color} />
              <div className="mt-2 text-base font-medium text-ink/80">
                {t('progress', { done, total })}
              </div>
            </div>
            <div className="rounded-pill bg-white text-ink font-bold text-xl px-5 py-3 shadow-button border-2 border-ink/10">
              {t('play')}
            </div>
          </>
        ) : (
          <div className="flex items-center gap-3 w-full">
            <div className="shrink-0">
              <Globie mood="sleepy" size={70} bobbing={false} />
            </div>
            <div className="flex-1">
              <div className="text-2xl font-bold">{t('lockedTitle')}</div>
              <div className="text-base text-ink/70">{lockedCaption}</div>
            </div>
            <div className="text-4xl" aria-hidden>
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
