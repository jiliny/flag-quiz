import { useMemo, useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import clsx from 'clsx';
import type { Country } from '../data/countries';
import { useGameStore, poolFor } from '../store/gameStore';
import { useLang, useT } from '../i18n';
import { pickNext, buildEasyOptions } from '../lib/quiz';
import { FlagCard } from '../components/FlagCard';
import { RoundShell } from '../components/RoundShell';
import { HintCard } from '../components/HintCard';
import { celebrateAt } from '../components/Celebrate';
import { audio } from '../lib/audio';

type Phase = 'asking' | 'correct';

export function EasyRound() {
  const t = useT();
  const lang = useLang();
  const { mastered, settings, markCorrect, markSeen, recentlySeen } = useGameStore();
  const pool = useMemo(() => poolFor('easy', settings.expandedPool), [settings.expandedPool]);

  const [answer, setAnswer] = useState<Country>(() =>
    pickNext(pool, mastered.easy, recentlySeen),
  );
  const [options, setOptions] = useState<Country[]>(() => buildEasyOptions(pool, answer));
  const [phase, setPhase] = useState<Phase>('asking');
  const [wrongCodes, setWrongCodes] = useState<Set<string>>(new Set());
  const [shakingCode, setShakingCode] = useState<string | null>(null);
  const tileRefs = useRef<Record<string, HTMLButtonElement | null>>({});

  const hints = answer.hints[lang];
  const hintIndex = wrongCodes.size > 0 ? (wrongCodes.size - 1) % hints.length : -1;
  const currentHint = hintIndex >= 0 ? hints[hintIndex] : null;

  useEffect(() => {
    markSeen(answer.code);
  }, [answer, markSeen]);

  const nextRound = () => {
    const state = useGameStore.getState();
    const nextCountry = pickNext(pool, state.mastered.easy, [
      answer.code,
      ...state.recentlySeen,
    ]);
    setAnswer(nextCountry);
    setOptions(buildEasyOptions(pool, nextCountry));
    setWrongCodes(new Set());
    setShakingCode(null);
    setPhase('asking');
  };

  const onPick = (c: Country) => {
    if (phase !== 'asking') return;
    if (wrongCodes.has(c.code)) return;
    audio.unlockUserGesture();
    if (c.code === answer.code) {
      setPhase('correct');
      celebrateAt(tileRefs.current[c.code]);
      audio.correct();
      markCorrect('easy', answer.code);
      setTimeout(nextRound, 1200);
    } else {
      audio.wrong();
      setShakingCode(c.code);
      setWrongCodes(new Set([...wrongCodes, c.code]));
      setTimeout(() => setShakingCode(null), 280);
    }
  };

  const bannerText = phase === 'correct' ? `${t('yay')} 🎉` : undefined;
  const bannerMood = phase === 'correct' ? 'happy' : 'idle';

  return (
    <RoundShell
      level="easy"
      question={t('whatIsThisFlag')}
      flagBlock={<FlagCard code={answer.code} size="hero" />}
      bannerText={bannerText}
      bannerMood={bannerMood}
      inputBlock={
        <div className="flex flex-col items-center gap-4 sm:gap-5 w-full">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 w-full max-w-xl">
            {options.map((c) => {
              const isCorrect = c.code === answer.code;
              const isWrong = wrongCodes.has(c.code);
              const showCorrectHighlight = phase === 'correct' && isCorrect;
              const isShaking = shakingCode === c.code;
              return (
                <motion.button
                  key={c.code}
                  ref={(el) => {
                    tileRefs.current[c.code] = el;
                  }}
                  whileTap={phase === 'asking' && !isWrong ? { scale: 0.96, y: 4 } : undefined}
                  onClick={() => onPick(c)}
                  className={clsx(
                    'no-select rounded-xl2 bg-white border-4 border-sky-deep shadow-sticker px-5 py-5 text-2xl sm:text-3xl font-bold text-ink min-h-[5rem] transition-all',
                    showCorrectHighlight && 'bg-mint-soft border-mint-deep text-mint-deep',
                    isWrong && 'bg-candy-soft/60 border-candy-deep/40 text-candy-deep/70 opacity-60',
                    isShaking && 'animate-shake',
                  )}
                  disabled={phase !== 'asking' || isWrong}
                >
                  {c.name[lang]}
                  {showCorrectHighlight && <span className="ml-2" aria-hidden>✓</span>}
                  {isWrong && <span className="ml-2" aria-hidden>✗</span>}
                </motion.button>
              );
            })}
          </div>
          <HintCard text={currentHint} attemptIndex={wrongCodes.size} />
        </div>
      }
    />
  );
}
