import { useMemo, useState, useEffect, useRef } from 'react';
import type { Country, Lang } from '../data/countries';
import { useGameStore, poolFor } from '../store/gameStore';
import { useLang, useT } from '../i18n';
import {
  pickNext,
  isCorrect,
  blanksForLength,
  pickBlankIndices,
} from '../lib/quiz';
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
  /** One slot per character of the answer. Letters/spaces/punct -> shown. null -> blank. */
  fixed: (string | null)[];
  /** Visual indices (into `fixed`) that are blanks, in left-to-right order. */
  blankSlots: number[];
  /** Character grid for zh keyboard variant; undefined for en. */
  charGrid?: string[];
}

const isLatinLetter = (ch: string) => /^[A-Z]$/.test(ch);
const isCjk = (ch: string) => /[\u4e00-\u9fff]/.test(ch);

function buildFillSetup(answer: Country, lang: Lang, pool: Country[]): Setup {
  const name = answer.name[lang];
  if (lang === 'en') {
    const upper = name.toUpperCase();
    const letters = [...upper];
    const blankableCount = letters.filter(isLatinLetter).length;
    const blankCount = blanksForLength(blankableCount, 'en');
    const blanks = pickBlankIndices(letters, blankCount, 'en', isLatinLetter);
    const fixed: (string | null)[] = letters.map((ch, i) => {
      if (blanks.has(i)) return null;
      return ch;
    });
    const blankSlots: number[] = [];
    fixed.forEach((v, i) => {
      if (v === null) blankSlots.push(i);
    });
    return { answer, fixed, blankSlots };
  }
  // zh
  const chars = [...name];
  const blankableCount = chars.filter(isCjk).length;
  const blankCount = blanksForLength(blankableCount, 'zh');
  const blanks = pickBlankIndices(chars, blankCount, 'zh', isCjk);
  const fixed: (string | null)[] = chars.map((ch, i) => (blanks.has(i) ? null : ch));
  const blankSlots: number[] = [];
  fixed.forEach((v, i) => {
    if (v === null) blankSlots.push(i);
  });
  // Build a Chinese keyboard grid containing the blanked chars + decoys.
  const targetChars = blankSlots.map((i) => chars[i]);
  const decoyPool: string[] = [];
  for (const c of pool) {
    if (c.code === answer.code) continue;
    for (const ch of c.name.zh) if (isCjk(ch)) decoyPool.push(ch);
  }
  const decoyUnique = Array.from(new Set(decoyPool)).filter((ch) => !targetChars.includes(ch));
  const gridSize = 18;
  const decoys = sample(decoyUnique, Math.max(0, gridSize - targetChars.length));
  const charGrid = shuffle([...targetChars, ...decoys]);
  return { answer, fixed, blankSlots, charGrid };
}

export function FillRound() {
  const t = useT();
  const lang = useLang();
  const { mastered, settings, markCorrect, markSeen, recentlySeen } = useGameStore();
  const pool = useMemo(() => poolFor('fill', settings.expandedPool), [settings.expandedPool]);

  const [phase, setPhase] = useState<Phase>('asking');
  const [setup, setSetup] = useState<Setup>(() => {
    const a = pickNext(pool, mastered.fill, recentlySeen);
    return buildFillSetup(a, lang, pool);
  });
  const [fill, setFill] = useState<(string | null)[]>(() =>
    setup.blankSlots.map(() => null),
  );
  const [wrongCount, setWrongCount] = useState(0);
  const flagRef = useRef<HTMLDivElement>(null);

  const hints = setup.answer.hints[lang];
  const currentHint = wrongCount > 0 ? hints[(wrongCount - 1) % hints.length] : null;

  useEffect(() => {
    markSeen(setup.answer.code);
  }, [setup.answer, markSeen]);

  // Merge fixed letters with current fill values for display.
  const fullSlots: (string | null)[] = useMemo(() => {
    const out: (string | null)[] = [];
    let bi = 0;
    for (const fx of setup.fixed) {
      if (fx === null) {
        out.push(fill[bi]);
        bi++;
      } else {
        out.push(fx);
      }
    }
    return out;
  }, [setup, fill]);

  const allFilled = fill.every((s) => s !== null && s !== '');
  const guess = fullSlots.map((s) => s ?? '').join('');

  const advance = () => {
    const state = useGameStore.getState();
    const next = pickNext(pool, state.mastered.fill, [
      setup.answer.code,
      ...state.recentlySeen,
    ]);
    const s = buildFillSetup(next, lang, pool);
    setSetup(s);
    setFill(s.blankSlots.map(() => null));
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
      markCorrect('fill', setup.answer.code);
      setPhase('correct');
      setTimeout(advance, 1300);
    } else {
      audio.wrong();
      setPhase('wrong');
      setWrongCount((c) => c + 1);
      setTimeout(() => {
        setFill(setup.blankSlots.map(() => null));
        setPhase('asking');
      }, 700);
    }
  };

  const onKey = (ch: string) => {
    if (phase !== 'asking') return;
    const i = fill.findIndex((s) => s === null || s === '');
    if (i === -1) return;
    const next = [...fill];
    next[i] = ch;
    setFill(next);
  };

  const onBackspace = () => {
    if (phase !== 'asking') return;
    let last = -1;
    for (let i = fill.length - 1; i >= 0; i--) {
      if (fill[i] !== null && fill[i] !== '') {
        last = i;
        break;
      }
    }
    if (last === -1) return;
    const next = [...fill];
    next[last] = null;
    setFill(next);
  };

  // Clearing a slot: only blank slots are interactive (fixed letters stay locked).
  const onSlotClear = (visualIdx: number) => {
    if (phase !== 'asking') return;
    if (setup.fixed[visualIdx] !== null) return;
    const blankIdx = setup.blankSlots.indexOf(visualIdx);
    if (blankIdx < 0 || fill[blankIdx] === null) return;
    audio.tap();
    const next = [...fill];
    next[blankIdx] = null;
    setFill(next);
  };

  const bannerText = phase === 'correct' ? `${t('yay')} 🎉` : undefined;
  const bannerMood = phase === 'correct' ? 'happy' : 'idle';

  return (
    <RoundShell
      level="fill"
      question={t('fillTheBlanks')}
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
