import { useMemo, useState, useEffect, useRef } from 'react';
import type { Country, Lang } from '../data/countries';
import { useGameStore, poolFor } from '../store/gameStore';
import { useLang, useT } from '../i18n';
import { pickNext, isCorrect } from '../lib/quiz';
import { sample, shuffle } from '../lib/shuffle';
import { FlagCard } from '../components/FlagCard';
import { RoundShell } from '../components/RoundShell';
import { AnswerBoxes } from '../components/AnswerBoxes';
import { Keyboard } from '../components/Keyboard';
import { HintCard } from '../components/HintCard';
import { celebrateAt } from '../components/Celebrate';
import { audio } from '../lib/audio';

type Phase = 'asking' | 'correct' | 'wrong';

interface Setup {
  answer: Country;
  fixed: (string | null)[];
  varCount: number;
  charGrid?: string[];
}

function buildHardSetup(answer: Country, lang: Lang, pool: Country[]): Setup {
  const name = answer.name[lang];
  if (lang === 'en') {
    const upper = name.toUpperCase();
    const fixed: (string | null)[] = [...upper].map((ch) =>
      /[A-Z]/.test(ch) ? null : ch === ' ' ? ' ' : ch,
    );
    const varCount = fixed.filter((x) => x === null).length;
    return { answer, fixed, varCount };
  }
  const chars = [...name];
  const fixed: (string | null)[] = chars.map(() => null);
  const decoyPool: string[] = [];
  for (const c of pool) {
    if (c.code === answer.code) continue;
    for (const ch of c.name.zh) decoyPool.push(ch);
  }
  const need = 36 - chars.length;
  const uniqueDecoys = Array.from(new Set(decoyPool)).filter((ch) => !chars.includes(ch));
  const decoys = sample(uniqueDecoys, Math.min(need, uniqueDecoys.length));
  const charGrid = shuffle([...chars, ...decoys]);
  return { answer, fixed, varCount: chars.length, charGrid };
}

export function HardRound() {
  const t = useT();
  const lang = useLang();
  const { mastered, settings, markCorrect, markSeen, recentlySeen } = useGameStore();
  const pool = useMemo(() => poolFor('hard', settings.expandedPool), [settings.expandedPool]);

  const [phase, setPhase] = useState<Phase>('asking');
  const [setup, setSetup] = useState<Setup>(() => {
    const a = pickNext(pool, mastered.hard, recentlySeen);
    return buildHardSetup(a, lang, pool);
  });
  const [varFill, setVarFill] = useState<(string | null)[]>(() =>
    Array(setup.varCount).fill(null),
  );
  const [wrongCount, setWrongCount] = useState(0);
  const flagRef = useRef<HTMLDivElement>(null);

  const hints = setup.answer.hints[lang];
  const currentHint = wrongCount > 0 ? hints[(wrongCount - 1) % hints.length] : null;

  useEffect(() => {
    markSeen(setup.answer.code);
  }, [setup.answer, markSeen]);

  const fullSlots: (string | null)[] = useMemo(() => {
    const out: (string | null)[] = [];
    let vi = 0;
    for (const fx of setup.fixed) {
      if (fx === null) {
        out.push(varFill[vi]);
        vi++;
      } else {
        out.push(fx);
      }
    }
    return out;
  }, [setup, varFill]);

  const allFilled = varFill.every((s) => s !== null && s !== '');
  const guess = fullSlots.map((s) => s ?? '').join('');

  const advance = () => {
    const state = useGameStore.getState();
    const next = pickNext(pool, state.mastered.hard, [
      setup.answer.code,
      ...state.recentlySeen,
    ]);
    const s = buildHardSetup(next, lang, pool);
    setSetup(s);
    setVarFill(Array(s.varCount).fill(null));
    setWrongCount(0);
    setPhase('asking');
  };

  const submit = () => {
    if (phase !== 'asking' || !allFilled) return;
    audio.unlockUserGesture();
    const truth = setup.answer.name[lang];
    if (isCorrect(guess, truth, lang)) {
      celebrateAt(flagRef.current);
      audio.correct();
      markCorrect('hard', setup.answer.code);
      setPhase('correct');
      setTimeout(advance, 1300);
    } else {
      audio.wrong();
      setPhase('wrong');
      setWrongCount((c) => c + 1);
      setTimeout(() => {
        setVarFill(Array(setup.varCount).fill(null));
        setPhase('asking');
      }, 800);
    }
  };

  const onKey = (ch: string) => {
    if (phase !== 'asking') return;
    const i = varFill.findIndex((s) => s === null || s === '');
    if (i === -1) return;
    const next = [...varFill];
    next[i] = ch;
    setVarFill(next);
  };

  const onBackspace = () => {
    if (phase !== 'asking') return;
    let last = -1;
    for (let i = varFill.length - 1; i >= 0; i--) {
      if (varFill[i] !== null && varFill[i] !== '') {
        last = i;
        break;
      }
    }
    if (last === -1) return;
    const next = [...varFill];
    next[last] = null;
    setVarFill(next);
  };

  const onSlotClear = (visualIdx: number) => {
    if (phase !== 'asking') return;
    let vi = -1;
    for (let i = 0; i <= visualIdx; i++) {
      if (setup.fixed[i] === null) vi++;
    }
    if (vi < 0 || varFill[vi] === null) return;
    audio.tap();
    const next = [...varFill];
    next[vi] = null;
    setVarFill(next);
  };

  const bannerText = phase === 'correct' ? `${t('yay')} 🎉` : undefined;
  const bannerMood = phase === 'correct' ? 'happy' : 'idle';

  return (
    <RoundShell
      level="hard"
      question={t('typeTheCountry')}
      flagBlock={
        <div ref={flagRef}>
          <FlagCard code={setup.answer.code} size="lg" />
        </div>
      }
      bannerText={bannerText}
      bannerMood={bannerMood}
      inputBlock={
        <div className="flex flex-col items-center gap-4 w-full">
          <AnswerBoxes
            slots={fullSlots}
            fixed={setup.fixed}
            highlight={phase === 'asking' ? 'idle' : phase}
            size="lg"
            onSlotClick={onSlotClear}
          />
          {lang === 'en' ? (
            <Keyboard
              variant="en"
              onKey={onKey}
              onBackspace={onBackspace}
              onSubmit={submit}
              canSubmit={allFilled && phase === 'asking'}
              disabled={phase !== 'asking'}
            />
          ) : (
            <Keyboard
              variant="zh"
              chars={setup.charGrid ?? []}
              onKey={onKey}
              onBackspace={onBackspace}
              onSubmit={submit}
              canSubmit={allFilled && phase === 'asking'}
              disabled={phase !== 'asking'}
            />
          )}
          <HintCard text={currentHint} attemptIndex={wrongCount} />
        </div>
      }
    />
  );
}
