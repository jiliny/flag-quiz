import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import clsx from 'clsx';
import type { LevelKey } from '../data/countries';
import { useT } from '../i18n';
import { useGameStore, levelProgress } from '../store/gameStore';
import { Globie, type GlobieMood } from './Globie';

interface Props {
  level: LevelKey;
  question: string;
  flagBlock: React.ReactNode;
  inputBlock: React.ReactNode;
  bannerMood?: GlobieMood;
  bannerText?: string;
}

const palette = {
  easy: { head: 'bg-sky-main', stripe: 'text-sky-deep' },
  fill: { head: 'bg-candy-main', stripe: 'text-candy-deep' },
  medium: { head: 'bg-mint-main', stripe: 'text-mint-deep' },
  hard: { head: 'bg-sun-main', stripe: 'text-sun-deep' },
};

export function RoundShell({ level, question, flagBlock, inputBlock, bannerMood, bannerText }: Props) {
  const t = useT();
  const { mastered, settings, setSound } = useGameStore();
  const prog = levelProgress(level, mastered, settings.expandedPool);
  const p = palette[level];

  return (
    <div className="min-h-dvh flex flex-col">
      <div className={clsx('safe-pt px-4 py-3 text-white flex items-center justify-between', p.head)}>
        <Link
          to="/"
          className="rounded-pill bg-white/20 hover:bg-white/30 px-4 py-2 text-white font-semibold flex items-center gap-2"
          aria-label={t('back')}
        >
          <span aria-hidden>←</span>
          <span className="hidden sm:inline">{t('back')}</span>
        </Link>
        <div className="font-bold text-lg">
          {t(`levels.${level}` as const)} · {prog.done} / {prog.total}
        </div>
        <button
          type="button"
          onClick={() => setSound(!settings.sound)}
          className="rounded-pill bg-white/20 hover:bg-white/30 px-4 py-2 text-white text-xl"
          aria-label={t('sound')}
        >
          {settings.sound ? '🔊' : '🔇'}
        </button>
      </div>

      <main className="flex-1 px-4 pt-4 pb-6 mx-auto w-full max-w-3xl flex flex-col items-center gap-5">
        <h1 className={clsx('text-2xl sm:text-3xl font-bold text-center text-ink')}>
          {question}
        </h1>
        <div className="flex justify-center w-full">{flagBlock}</div>
        <div className="w-full flex justify-center">{inputBlock}</div>
      </main>

      <AnimatePresence>
        {bannerText && (
          <motion.div
            key={bannerText + (bannerMood ?? '')}
            initial={{ y: 60, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 60, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 220, damping: 20 }}
            className="fixed inset-x-0 bottom-6 flex justify-center pointer-events-none"
          >
            <div className="bg-white rounded-xl2 border-4 border-ink/10 shadow-sticker px-5 py-3 flex items-center gap-3 max-w-[90%]">
              <Globie mood={bannerMood ?? 'idle'} size={56} bobbing={false} />
              <div className="text-xl font-bold text-ink">{bannerText}</div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
