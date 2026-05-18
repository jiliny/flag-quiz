import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import clsx from 'clsx';
import { useGameStore } from '../store/gameStore';
import { getActivePool } from '../data/countries';
import { useLang, useT } from '../i18n';
import { FlagCard } from '../components/FlagCard';

export function Passport() {
  const t = useT();
  const lang = useLang();
  const { mastered, settings } = useGameStore();
  const pool = getActivePool(settings.expandedPool);
  const masteredAny = new Set<string>([
    ...mastered.easy,
    ...mastered.medium,
    ...mastered.hard,
  ]);
  const [selected, setSelected] = useState<string | null>(null);

  const total = pool.length;
  const done = pool.filter((c) => masteredAny.has(c.code)).length;
  const selectedCountry = selected ? pool.find((c) => c.code === selected) ?? null : null;

  return (
    <div className="min-h-dvh safe-pt safe-pb px-4 pt-4 pb-6 max-w-3xl mx-auto flex flex-col gap-4">
      <header className="flex items-center justify-between">
        <Link
          to="/"
          className="rounded-pill bg-white border-2 border-ink/10 px-4 py-2 font-semibold shadow-button"
        >
          ← {t('back')}
        </Link>
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <span aria-hidden>🛂</span>
          {t('passport')}
        </h1>
        <div className="text-base font-semibold text-ink/70">
          {done} / {total}
        </div>
      </header>

      <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-3 sm:gap-4">
        {pool.map((c) => {
          const isMastered = masteredAny.has(c.code);
          return (
            <button
              key={c.code}
              type="button"
              onClick={() => setSelected(c.code)}
              className={clsx(
                'no-select relative rounded-2xl bg-white p-2 border-2 border-ink/10 shadow-button flex flex-col items-center gap-1 transition-transform',
                !isMastered && 'grayscale opacity-70',
              )}
            >
              <span
                className={clsx('block w-full rounded-md overflow-hidden bg-ink/5', `fi-${c.code}`)}
                style={{
                  aspectRatio: '4 / 3',
                  backgroundSize: 'contain',
                  backgroundPosition: 'center',
                  backgroundRepeat: 'no-repeat',
                }}
                role="img"
                aria-label={`Flag ${c.code}`}
              />
              <span className="text-xs sm:text-sm font-semibold truncate w-full text-center">
                {isMastered ? c.name[lang] : '???'}
              </span>
              {isMastered && (
                <motion.span
                  initial={{ scale: 0, rotate: -20 }}
                  animate={{ scale: 1, rotate: 10 }}
                  transition={{ type: 'spring', stiffness: 240, damping: 14 }}
                  className="absolute -top-2 -right-2 text-2xl"
                  aria-hidden
                >
                  ⭐
                </motion.span>
              )}
            </button>
          );
        })}
      </div>

      <AnimatePresence>
        {selectedCountry && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelected(null)}
            className="fixed inset-0 z-50 bg-ink/40 backdrop-blur-sm flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.85, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.85, y: 20 }}
              transition={{ type: 'spring', stiffness: 220, damping: 18 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-xl2 border-4 border-ink/10 shadow-sticker p-6 max-w-sm w-full flex flex-col items-center gap-3"
            >
              <FlagCard code={selectedCountry.code} size="md" wobble={false} />
              <div className="text-2xl font-bold text-center">
                {masteredAny.has(selectedCountry.code) ? selectedCountry.name[lang] : '???'}
              </div>
              <div className="text-base text-ink/60 text-center">
                {masteredAny.has(selectedCountry.code) ? (
                  <>
                    <span className="block">{selectedCountry.name.en}</span>
                    <span className="block">{selectedCountry.name.zh}</span>
                  </>
                ) : (
                  t('empty')
                )}
              </div>
              <button
                type="button"
                onClick={() => setSelected(null)}
                className="mt-2 rounded-pill bg-sky-main text-white font-bold px-5 py-2 shadow-button border-2 border-sky-deep"
              >
                {t('done')}
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
