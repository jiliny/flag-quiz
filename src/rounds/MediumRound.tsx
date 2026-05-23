import { useMemo, useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import clsx from 'clsx';
import type { Country, Lang } from '../data/countries';
import { useGameStore, poolFor } from '../store/gameStore';
import { useLang, useT } from '../i18n';
import { pickNext, buildMediumTiles, isCorrect } from '../lib/quiz';
import { FlagCard } from '../components/FlagCard';
import { RoundShell } from '../components/RoundShell';
import { AnswerBoxes } from '../components/AnswerBoxes';
import { HintCard } from '../components/HintCard';
import { celebrateAt } from '../components/Celebrate';
import { audio } from '../lib/audio';

type Phase = 'asking' | 'correct' | 'wrong';

interface Slotting {
  answer: Country;
  targetChars: string[];
  fixed: (string | null)[];
  tiles: string[];
}

function buildSlotting(answer: Country, lang: Lang, pool: Country[]): Slotting {
  const name = answer.name[lang];
  if (lang === 'en') {
    const upper = name.toUpperCase();
    const fixed: (string | null)[] = [...upper].map((ch) =>
      /[A-Z]/.test(ch) ? null : ch === ' ' ? ' ' : ch,
    );
    const targetCount = fixed.filter((x) => x === null).length;
    const totalTiles = Math.max(12, targetCount + 4);
    const { tiles, targetChars } = buildMediumTiles(name, lang, [], totalTiles);
    return { answer, targetChars, fixed, tiles };
  }
  const chars = [...name];
  const fixed: (string | null)[] = chars.map(() => null);
  const decoyPool: string[] = [];
  for (const c of pool) {
    if (c.code === answer.code) continue;
    for (const ch of c.name.zh) decoyPool.push(ch);
  }
  const totalTiles = Math.max(12, chars.length + 8);
  const { tiles, targetChars } = buildMediumTiles(name, lang, decoyPool, totalTiles);
  return { answer, targetChars, fixed, tiles };
}

export function MediumRound() {
  const t = useT();
  const lang = useLang();
  const { mastered, settings, markCorrect, markSeen, recentlySeen } = useGameStore();
  const pool = useMemo(() => poolFor('medium', settings.expandedPool), [settings.expandedPool]);

  const [phase, setPhase] = useState<Phase>('asking');
  const [slotting, setSlotting] = useState<Slotting>(() => {
    const a = pickNext(pool, mastered.medium, recentlySeen);
    return buildSlotting(a, lang, pool);
  });
  const [slotFill, setSlotFill] = useState<(number | null)[]>(() =>
    slotting.targetChars.map(() => null),
  );
  const [usedTiles, setUsedTiles] = useState<Set<number>>(new Set());
  const [wrongCount, setWrongCount] = useState(0);
  const flagRef = useRef<HTMLDivElement>(null);

  const hints = slotting.answer.hints[lang];
  const currentHint = wrongCount > 0 ? hints[(wrongCount - 1) % hints.length] : null;

  useEffect(() => {
    markSeen(slotting.answer.code);
  }, [slotting.answer, markSeen]);

  const fullSlots = useMemo(() => {
    const out: (string | null)[] = [];
    let vi = 0;
    for (const fx of slotting.fixed) {
      if (fx === null) {
        const ti = slotFill[vi];
        out.push(ti === null ? null : slotting.tiles[ti]);
        vi++;
      } else {
        out.push(fx);
      }
    }
    return out;
  }, [slotting, slotFill]);

  const allFilled = slotFill.every((s) => s !== null);

  useEffect(() => {
    if (phase !== 'asking' || !allFilled) return;
    const guess = fullSlots.map((s) => s ?? '').join('');
    const truth = slotting.answer.name[lang];
    if (isCorrect(guess, truth, lang)) {
      audio.unlockUserGesture();
      celebrateAt(flagRef.current);
      audio.correct();
      markCorrect('medium', slotting.answer.code);
      setPhase('correct');
      setTimeout(advance, 1300);
    } else {
      audio.wrong();
      setPhase('wrong');
      setWrongCount((c) => c + 1);
      setTimeout(() => {
        setSlotFill(slotting.targetChars.map(() => null));
        setUsedTiles(new Set());
        setPhase('asking');
      }, 700);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [allFilled]);

  const advance = () => {
    const state = useGameStore.getState();
    const next = pickNext(pool, state.mastered.medium, [
      slotting.answer.code,
      ...state.recentlySeen,
    ]);
    const s = buildSlotting(next, lang, pool);
    setSlotting(s);
    setSlotFill(s.targetChars.map(() => null));
    setUsedTiles(new Set());
    setWrongCount(0);
    setPhase('asking');
  };

  const handleTile = (tileIdx: number) => {
    if (phase !== 'asking') return;
    if (usedTiles.has(tileIdx)) return;
    const next = [...slotFill];
    const i = next.findIndex((s) => s === null);
    if (i === -1) return;
    audio.tap();
    next[i] = tileIdx;
    setSlotFill(next);
    setUsedTiles(new Set([...usedTiles, tileIdx]));
  };

  const handleSlotClear = (visualIdx: number) => {
    if (phase !== 'asking') return;
    let vi = -1;
    for (let i = 0; i <= visualIdx; i++) {
      if (slotting.fixed[i] === null) vi++;
    }
    if (vi < 0 || slotFill[vi] === null) return;
    audio.tap();
    const removedTile = slotFill[vi]!;
    const next = [...slotFill];
    next[vi] = null;
    setSlotFill(next);
    const used = new Set(usedTiles);
    used.delete(removedTile);
    setUsedTiles(used);
  };

  const bannerText = phase === 'correct' ? `${t('yay')} 🎉` : undefined;
  const bannerMood = phase === 'correct' ? 'happy' : 'idle';

  return (
    <RoundShell
      level="medium"
      question={t('spellTheCountry')}
      flagBlock={
        <div ref={flagRef}>
          <FlagCard code={slotting.answer.code} size="lg" />
        </div>
      }
      bannerText={bannerText}
      bannerMood={bannerMood}
      inputBlock={
        <div className="flex flex-col items-center gap-4 w-full">
          <AnswerBoxes
            slots={fullSlots}
            fixed={slotting.fixed}
            highlight={phase === 'asking' ? 'idle' : phase}
            size="lg"
            onSlotClick={handleSlotClear}
          />
          <div className="grid grid-cols-6 sm:grid-cols-7 gap-2 sm:gap-3 max-w-2xl">
            {slotting.tiles.map((ch, i) => {
              const used = usedTiles.has(i);
              return (
                <motion.button
                  key={i}
                  whileTap={!used && phase === 'asking' ? { scale: 0.9, y: 4 } : undefined}
                  onClick={() => handleTile(i)}
                  className={clsx(
                    'no-select w-12 h-14 sm:w-14 sm:h-16 rounded-2xl text-2xl sm:text-3xl font-extrabold flex items-center justify-center border border-mint-deep/20 bg-white shadow-keycap transition-opacity',
                    used && 'opacity-0 pointer-events-none',
                    phase !== 'asking' && 'pointer-events-none',
                  )}
                >
                  {ch}
                </motion.button>
              );
            })}
          </div>
          <HintCard text={currentHint} attemptIndex={wrongCount} />
        </div>
      }
    />
  );
}
