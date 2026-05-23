import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import clsx from 'clsx';
import type { LevelKey } from '../data/countries';
import { useT } from '../i18n';
import { useGameStore, levelProgress } from '../store/gameStore';
import { Globie, type GlobieMood } from './Globie';
import { Icons } from './Icons';

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
  const { mastered, settings, setSound, coins = 0 } = useGameStore();
  const prog = levelProgress(level, mastered, settings.expandedPool);
  const p = palette[level];

  return (
    <div className="h-dvh flex flex-col overflow-hidden">
      <div className={clsx('safe-pt px-4 py-3.5 text-white flex items-center justify-between shadow-sm backdrop-blur-md', p.head)}>
        <Link
          to="/"
          className="rounded-pill bg-white/15 hover:bg-white/25 border border-white/10 px-4 py-2 text-white font-bold text-sm flex items-center gap-1.5 transition-transform active:scale-95 shadow-sm"
          aria-label={t('back')}
        >
          <Icons.BackArrow size={14} className="shrink-0 text-white" />
          <span>{t('back')}</span>
        </Link>
        <div className="font-extrabold text-lg sm:text-xl tracking-wide select-none drop-shadow-sm">
          {t(`levels.${level}` as const)} · {prog.done} / {prog.total}
        </div>
        <div className="flex items-center gap-2">
          <div className="rounded-pill bg-white/15 border border-white/10 px-3.5 py-1.5 font-extrabold text-sm sm:text-base flex items-center gap-1 shadow-sm select-none">
            <Icons.Coin size={18} className="shrink-0 animate-[wobble_5s_ease-in-out_infinite]" />
            <span>{coins}</span>
          </div>
          <button
            type="button"
            onClick={() => setSound(!settings.sound)}
            className="rounded-full bg-white/15 border border-white/10 hover:bg-white/25 w-10 h-10 flex items-center justify-center text-white transition-transform active:scale-90 shadow-sm"
            aria-label={t('sound')}
          >
            {settings.sound ? (
              <Icons.VolumeUp size={22} className="shrink-0 text-white" />
            ) : (
              <Icons.VolumeMute size={22} className="shrink-0 text-white" />
            )}
          </button>
        </div>
      </div>

      <main className="flex-1 min-h-0 overflow-y-auto px-4 pt-3 sm:pt-4 pb-4 sm:pb-6 mx-auto w-full max-w-3xl flex flex-col items-center gap-3 sm:gap-5">
        <h1 className={clsx('text-xl sm:text-3xl font-bold text-center text-ink')}>
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
            className="fixed inset-x-0 bottom-6 safe-pb flex justify-center pointer-events-none z-50"
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
