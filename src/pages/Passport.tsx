import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import clsx from 'clsx';
import { useGameStore, STAMP_CATALOG } from '../store/gameStore';
import { getActivePool } from '../data/countries';
import { useLang, useT } from '../i18n';
import { FlagCard } from '../components/FlagCard';
import { WorldMap } from '../components/WorldMap';
import { Icons } from '../components/Icons';
import { audio } from '../lib/audio';

export function Passport() {
  const t = useT();
  const lang = useLang();
  const {
    mastered,
    settings,
    coins = 0,
    unlockedStamps = ['⭐'],
    countryStamps = {},
    buyStamp,
    setCountryStamp,
  } = useGameStore();

  const pool = getActivePool(settings.expandedPool);
  
  // Include easy, fill, medium, and hard mastered countries
  const masteredAny = new Set<string>([
    ...mastered.easy,
    ...mastered.fill,
    ...mastered.medium,
    ...mastered.hard,
  ]);

  const [selected, setSelected] = useState<string | null>(null);

  const total = pool.length;
  const done = pool.filter((c) => masteredAny.has(c.code)).length;
  const selectedCountry = selected ? pool.find((c) => c.code === selected) ?? null : null;

  const speakName = (nameToSpeak: string) => {
    if (!window.speechSynthesis) return;
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(nameToSpeak);
    utterance.lang = settings.lang === 'en' ? 'en-US' : 'zh-CN';
    utterance.rate = 0.85;
    window.speechSynthesis.speak(utterance);
  };

  const selectCountryCode = (code: string | null) => {
    setSelected(code);
    if (code) {
      const countryObj = pool.find((c) => c.code === code);
      if (countryObj) {
        const nameToSpeak = masteredAny.has(code) ? countryObj.name[settings.lang] : '???';
        if (nameToSpeak !== '???') {
          setTimeout(() => speakName(nameToSpeak), 100);
        }
      }
    } else {
      if (window.speechSynthesis) {
        window.speechSynthesis.cancel();
      }
    }
  };

  return (
    <div className="min-h-dvh safe-pt safe-pb px-4 pt-4 pb-6 max-w-3xl mx-auto flex flex-col gap-4">
      <header className="flex items-center justify-between">
        <Link
          to="/"
          className="rounded-pill bg-white border border-ink/5 px-4 py-2 font-extrabold text-sm shadow-button flex items-center gap-1.5 transition-transform active:scale-95"
        >
          <Icons.BackArrow size={14} className="text-ink shrink-0" />
          <span>{t('back')}</span>
        </Link>
        <h1 className="text-2xl font-extrabold flex items-center gap-2">
          <Icons.Passport size={26} className="shrink-0 animate-[wobble_5s_ease-in-out_infinite]" />
          <span className="hidden sm:inline">{t('passport')}</span>
        </h1>
        <div className="flex items-center gap-3">
          <div className="rounded-pill bg-white border border-ink/5 px-3.5 py-1.5 font-extrabold text-sm sm:text-base flex items-center gap-1 shadow-button select-none">
            <Icons.Coin size={18} className="shrink-0" />
            <span>{coins}</span>
          </div>
          <div className="text-sm font-bold text-ink/60 bg-ink/5 px-3.5 py-1.5 rounded-full select-none border border-ink/5 shadow-inner">
            {done} / {total}
          </div>
        </div>
      </header>

      <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-3 sm:gap-4">
        {pool.map((c) => {
          const isMastered = masteredAny.has(c.code);
          return (
            <button
              key={c.code}
              type="button"
              onClick={() => selectCountryCode(c.code)}
              className={clsx(
                'no-select relative rounded-2xl bg-white p-2.5 border border-ink/5 shadow-button flex flex-col items-center gap-1 transition-all',
                isMastered && 'active:translate-y-0.5',
                !isMastered && 'grayscale opacity-70 cursor-default',
              )}
            >
              <span
                className={clsx('block w-full rounded-lg overflow-hidden bg-ink/5', `fi-${c.code}`)}
                style={{
                  aspectRatio: '4 / 3',
                  backgroundSize: 'contain',
                  backgroundPosition: 'center',
                  backgroundRepeat: 'no-repeat',
                }}
                role="img"
                aria-label={`Flag ${c.code}`}
              />
              <span className="text-xs sm:text-sm font-bold truncate w-full text-center mt-1 text-ink/80">
                {isMastered ? c.name[lang] : '???'}
              </span>
              {isMastered && (
                <motion.span
                  initial={{ scale: 0, rotate: -20 }}
                  animate={{ scale: 1, rotate: 10 }}
                  transition={{ type: 'spring', stiffness: 240, damping: 14 }}
                  className="absolute -top-1.5 -right-1.5 text-2xl select-none filter drop-shadow-sm"
                  aria-hidden
                >
                  {countryStamps[c.code] || '⭐'}
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
            onClick={() => selectCountryCode(null)}
            className="fixed inset-0 z-50 bg-ink/35 backdrop-blur-md flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.85, y: 15 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.85, y: 15 }}
              transition={{ type: 'spring', stiffness: 220, damping: 18 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-xl2 border-2 border-ink/5 shadow-sticker p-6 max-w-sm w-full flex flex-col items-center gap-3"
            >
              <div className="relative">
                <FlagCard code={selectedCountry.code} size="md" wobble={false} />
                {masteredAny.has(selectedCountry.code) && (
                  <motion.span
                    key={countryStamps[selectedCountry.code] || '⭐'}
                    initial={{ scale: 0, rotate: -20 }}
                    animate={{ scale: 1, rotate: 10 }}
                    transition={{ type: 'spring', stiffness: 240, damping: 14 }}
                    className="absolute -top-2 -right-2 text-3xl select-none filter drop-shadow-sm"
                    aria-hidden
                  >
                    {countryStamps[selectedCountry.code] || '⭐'}
                  </motion.span>
                )}
              </div>
              
              <div className="flex items-center gap-2 mt-1">
                <div className="text-2xl font-extrabold text-ink text-center">
                  {masteredAny.has(selectedCountry.code) ? selectedCountry.name[lang] : '???'}
                </div>
                {masteredAny.has(selectedCountry.code) && (
                  <button
                    type="button"
                    onClick={() => speakName(selectedCountry.name[lang])}
                    className="no-select rounded-full p-2 bg-purple-50 hover:bg-purple-100 text-purple-500 border border-purple-100 transition-transform active:scale-90 shadow-sm"
                    aria-label="Read Country Name"
                  >
                    <Icons.Pronounce size={18} className="shrink-0" />
                  </button>
                )}
              </div>
              
              {masteredAny.has(selectedCountry.code) && (
                <div className="w-full flex flex-col gap-2">
                  <div className="text-sm font-bold text-ink/50 text-center uppercase tracking-wider">
                    {selectedCountry.name.en} · {selectedCountry.name.zh}
                  </div>
                  {/* Interactive SVG World Mini-Map */}
                  <WorldMap code={selectedCountry.code} className="my-1" />
                </div>
              )}

              {!masteredAny.has(selectedCountry.code) && (
                <div className="text-base font-semibold text-ink/50 text-center my-4">
                  {t('empty')}
                </div>
              )}

              {masteredAny.has(selectedCountry.code) && (
                <div className="w-full flex flex-col gap-2 border-t border-ink/5 pt-3">
                  <div className="flex items-center justify-between text-xs font-extrabold text-ink/50 uppercase tracking-wider px-1">
                    <span>{t('stampThisCountry')}</span>
                    <span className="text-sun-deep flex items-center gap-1 bg-sun-soft/40 px-2.5 py-0.5 rounded-full font-extrabold border border-sun-main/20 shadow-inner">
                      <Icons.Coin size={15} className="shrink-0" /> {coins}
                    </span>
                  </div>
                  
                  <div className="grid grid-cols-5 gap-2 max-h-36 overflow-y-auto p-1 bg-ink/5 rounded-2xl border border-ink/10">
                    {STAMP_CATALOG.map((stamp) => {
                      const isUnlocked = unlockedStamps.includes(stamp.emoji);
                      const isEquipped = (countryStamps[selectedCountry.code] || '⭐') === stamp.emoji;
                      
                      return (
                        <button
                          key={stamp.emoji}
                          type="button"
                          onClick={() => {
                            if (isUnlocked) {
                              audio.stamp();
                              setCountryStamp(selectedCountry.code, stamp.emoji);
                            } else {
                              if (coins >= stamp.cost) {
                                audio.unlock();
                                buyStamp(stamp.emoji, stamp.cost);
                                setCountryStamp(selectedCountry.code, stamp.emoji);
                              } else {
                                audio.wrong();
                              }
                            }
                          }}
                          className={clsx(
                            'no-select text-2xl w-11 h-11 rounded-full flex items-center justify-center relative transition-all border shadow-button',
                            isEquipped && 'bg-mint-soft border-mint-deep scale-110 shadow-sticker z-10',
                            !isEquipped && isUnlocked && 'bg-white border-ink/15 hover:border-ink/25 hover:scale-105 active:translate-y-0.5',
                            !isUnlocked && 'bg-ink/5 border-dashed border-ink/20 opacity-60 hover:opacity-100 hover:scale-105'
                          )}
                          title={lang === 'en' ? stamp.name.en : stamp.name.zh}
                          aria-label={lang === 'en' ? `Stamp ${stamp.name.en}` : `印章 ${stamp.name.zh}`}
                        >
                          <span className="select-none leading-none mt-[-1px]">{stamp.emoji}</span>
                          {!isUnlocked && (
                            <span className="absolute -bottom-1 -right-1.5 text-[9px] bg-sun-main text-ink border-2 border-ink rounded-full px-1.5 font-extrabold leading-none scale-75 select-none shadow-sm">
                              {stamp.cost}
                            </span>
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              <button
                type="button"
                onClick={() => selectCountryCode(null)}
                className="mt-2.5 rounded-pill bg-sky-main text-white font-extrabold px-6 py-2.5 shadow-button border border-sky-deep/20 transition-transform active:translate-y-0.5"
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
