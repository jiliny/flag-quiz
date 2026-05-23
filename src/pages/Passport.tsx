import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import clsx from 'clsx';
import { useGameStore, STAMP_CATALOG } from '../store/gameStore';
import { getActivePool } from '../data/countries';
import { useLang, useT } from '../i18n';
import { WorldMap } from '../components/WorldMap';
import { Icons } from '../components/Icons';
import { audio } from '../lib/audio';

const SpeakerIcon = ({ size = 28, className }: { size?: number; className?: string }) => (
  <svg
    viewBox="0 0 32 32"
    width={size}
    height={size}
    className={clsx("shrink-0", className)}
  >
    {/* Shadow */}
    <path
      d="M6 11.5h4.2l5.3-5.3a1 1 0 011.5.7v18.2a1 1 0 01-1.5.7l-5.3-5.3H6a2 2 0 01-2-2v-5a2 2 0 012-2z"
      fill="#1F2540"
    />
    {/* Megaphone speaker */}
    <path
      d="M6 10.5h4.2l5.3-5.3a1 1 0 011.5.7v18.2a1 1 0 01-1.5.7l-5.3-5.3H6a2 2 0 01-2-2v-5a2 2 0 012-2z"
      fill="#6CAEFF"
      stroke="#1F2540"
      strokeWidth="2.5"
      strokeLinejoin="round"
    />
    {/* Sound Waves */}
    <path
      d="M20 12c1 1.3 1 4.7 0 6M23.5 8c2.5 3 2.5 9 0 12"
      stroke="#1F2540"
      strokeWidth="2.5"
      strokeLinecap="round"
      fill="none"
    />
  </svg>
);

const stampStyles: Record<string, { border: string; bg: string }> = {
  '⭐': { border: 'border-[#FFAEC9]', bg: 'bg-[#FFF0F5]' }, // Star -> Soft Pink
  '🎈': { border: 'border-[#A8E6CF]', bg: 'bg-[#F0FFF4]' }, // Balloon -> Soft Green
  '🍕': { border: 'border-[#FFE29A]', bg: 'bg-[#FFFDF0]' }, // Pizza -> Soft Yellow/Gold
};

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
              className="bg-white rounded-xl2 border-[3px] border-ink shadow-sticker overflow-hidden max-w-sm w-full flex flex-col items-center gap-0"
            >
              {/* Header Bar */}
              <div className="w-full bg-[#D5EEFF] border-b-[3px] border-ink px-4 py-3 flex items-center justify-between">
                <div className="flex-1" />
                <h2 className="text-xl font-extrabold text-ink select-none tracking-wide text-center">
                  {t('countryDetails')}
                </h2>
                <div className="flex-1 flex justify-end">
                  <button
                    type="button"
                    onClick={() => selectCountryCode(null)}
                    className="no-select w-8.5 h-8.5 rounded-full bg-white border-[3px] border-ink flex items-center justify-center text-ink hover:bg-sky-50 transition-all active:scale-90"
                    aria-label="Close"
                  >
                    <span className="font-black text-sm leading-none select-none">✕</span>
                  </button>
                </div>
              </div>

              {/* Wavy Pastel Pink/Peach Zone */}
              <div className="w-full relative py-6 flex flex-col items-center justify-center bg-gradient-to-b from-[#FFEBF5] to-[#FFF0F6] overflow-hidden">
                {/* Soft clouds and sparkles */}
                <div className="absolute top-6 left-6 opacity-30 text-2xl select-none">☁️</div>
                <div className="absolute top-8 right-6 opacity-30 text-2xl select-none">☁️</div>
                <div className="absolute top-2 left-1/4 opacity-40 text-xs select-none">✨</div>
                <div className="absolute top-10 right-1/4 opacity-40 text-sm select-none">✨</div>

                {/* Curved wave bottom */}
                <svg
                  className="absolute bottom-0 left-0 w-full h-8 text-white fill-current pointer-events-none"
                  viewBox="0 0 100 10"
                  preserveAspectRatio="none"
                >
                  <path d="M 0 5 C 30 11, 70 -1, 100 5 L 100 10 L 0 10 Z" />
                </svg>

                {/* Polaroid flag card */}
                <motion.div
                  initial={{ rotate: -3, scale: 0.9, opacity: 0 }}
                  animate={{ rotate: -3, scale: 1, opacity: 1 }}
                  transition={{ type: 'spring', stiffness: 220, damping: 18 }}
                  className="relative inline-block bg-white rounded-2xl shadow-sticker border-[3px] border-ink p-3.5 pb-9 rotate-[-3deg] z-10 w-[184px]"
                >
                  {/* Flag Inner */}
                  <div
                    className={clsx('rounded-lg overflow-hidden bg-ink/5 border border-ink/10', `fi-${selectedCountry.code}`)}
                    style={{
                      width: '152px',
                      height: '114px',
                      aspectRatio: '4 / 3',
                      backgroundSize: 'contain',
                      backgroundPosition: 'center',
                      backgroundRepeat: 'no-repeat',
                    }}
                    role="img"
                    aria-label={`Flag ${selectedCountry.code}`}
                  />
                  
                  {/* FAIT MAIN Badge */}
                  <div className="absolute bottom-2 left-1/2 -translate-x-1/2 rotate-[-5deg] border-[1.5px] border-dashed border-ink/30 px-3 py-0.5 rounded text-[10px] font-black uppercase text-ink/50 tracking-wider bg-white select-none whitespace-nowrap">
                    FAIT MAIN
                  </div>
                </motion.div>
              </div>

              {/* Country Name and Pronounce */}
              <div className="w-full pt-4 pb-2 px-6 flex flex-col items-center justify-center">
                <div className="text-3xl font-extrabold text-ink flex items-center justify-center gap-2">
                  <span>{masteredAny.has(selectedCountry.code) ? selectedCountry.name[lang] : '???'}</span>
                  {masteredAny.has(selectedCountry.code) && (
                    <button
                      type="button"
                      onClick={() => speakName(selectedCountry.name[lang])}
                      className="no-select inline-flex items-center transition-transform active:scale-95 ml-1"
                      aria-label="Read Country Name"
                    >
                      <SpeakerIcon size={28} />
                    </button>
                  )}
                </div>
              </div>

              {/* World Map Section */}
              {masteredAny.has(selectedCountry.code) && (
                <div className="w-full px-6 py-2">
                  <WorldMap code={selectedCountry.code} />
                </div>
              )}

              {!masteredAny.has(selectedCountry.code) && (
                <div className="text-base font-semibold text-ink/50 text-center my-6">
                  {t('empty')}
                </div>
              )}

              {/* Collect Stamps Section */}
              {masteredAny.has(selectedCountry.code) && (
                <div className="w-full px-6 pb-6 pt-1 flex flex-col gap-1.5">
                  <div className="text-xs font-black text-ink/50 uppercase tracking-widest text-center">
                    {t('stampThisCountry')}
                  </div>
                  
                  <div className="bg-[#EAF6FF] rounded-2xl border border-ink/10 p-3 flex flex-col gap-2.5">
                    <div className="grid grid-cols-3 gap-3 w-full">
                      {STAMP_CATALOG.map((stamp) => {
                        const isUnlocked = unlockedStamps.includes(stamp.emoji);
                        const isEquipped = (countryStamps[selectedCountry.code] || '⭐') === stamp.emoji;
                        const style = stampStyles[stamp.emoji] || { border: 'border-ink/10', bg: 'bg-white' };
                        
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
                            className="no-select relative w-full aspect-square bg-white border-[3px] border-ink rounded-2xl p-1.5 flex items-center justify-center transition-all active:translate-y-0.5 shadow-button hover:scale-102 hover:border-ink/90"
                            title={lang === 'en' ? stamp.name.en : stamp.name.zh}
                            aria-label={lang === 'en' ? `Stamp ${stamp.name.en}` : `印章 ${stamp.name.zh}`}
                          >
                            <div className={clsx('w-full h-full rounded-xl border-[3px] flex items-center justify-center', style.border, style.bg)}>
                              <span className="text-3.5xl sm:text-4xl select-none leading-none mt-[-2px]">{stamp.emoji}</span>
                            </div>
                            
                            {/* Equipped Indicator */}
                            {isEquipped && (
                              <div className="absolute -top-1.5 -right-1.5 bg-emerald-500 text-white border-[2.5px] border-ink rounded-full w-6.5 h-6.5 flex items-center justify-center text-xs font-black shadow-md z-20 animate-pop">
                                ✓
                              </div>
                            )}

                            {/* Locked Coin Badge */}
                            {!isUnlocked && (
                              <div className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 bg-sun-main border-[2px] border-ink text-[10px] font-black rounded-full px-2 py-0.25 flex items-center gap-0.5 shadow-md whitespace-nowrap z-20">
                                <Icons.Coin size={11} className="shrink-0" />
                                <span>{stamp.cost}</span>
                              </div>
                            )}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
