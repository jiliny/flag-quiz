import clsx from 'clsx';
import { motion } from 'framer-motion';

interface Props {
  slots: (string | null)[];
  /** Map slot index -> original position in answer string. Used to render
   *  non-letter characters (spaces) in fixed positions for English. */
  fixed?: (string | null)[];
  highlight?: 'idle' | 'correct' | 'wrong';
  size?: 'md' | 'lg';
  onSlotClick?: (idx: number) => void;
}

export function AnswerBoxes({ slots, fixed, highlight = 'idle', size = 'md', onSlotClick }: Props) {
  const cellBase =
    size === 'lg'
      ? 'w-12 h-14 sm:w-14 sm:h-16 text-3xl sm:text-4xl'
      : 'w-10 h-12 sm:w-11 sm:h-14 text-2xl sm:text-3xl';
  return (
    <motion.div
      animate={highlight === 'wrong' ? { x: [0, -8, 8, -6, 6, 0] } : undefined}
      transition={{ duration: 0.32 }}
      className="flex flex-wrap items-end justify-center gap-2 sm:gap-3"
    >
      {slots.map((ch, idx) => {
        const fx = fixed?.[idx] ?? null;
        if (fx === ' ') {
          return <div key={`gap-${idx}`} className="w-3 sm:w-4" />;
        }
        const isFilled = ch !== null && ch !== '';
        const display = fx ?? ch ?? '';
        const interactive = !fx && onSlotClick && isFilled;
        return (
          <button
            key={idx}
            type="button"
            disabled={!interactive}
            onClick={() => interactive && onSlotClick?.(idx)}
            className={clsx(
              'no-select rounded-2xl flex items-end justify-center pb-1 font-bold border-[3px]',
              'bg-white shadow-button transition-colors',
              cellBase,
              isFilled ? 'border-ink/30' : 'border-dashed border-ink/25',
              highlight === 'correct' && 'bg-mint-soft border-mint-deep text-mint-deep',
              highlight === 'wrong' && 'bg-candy-soft border-candy-deep text-candy-deep',
              interactive ? 'cursor-pointer' : 'cursor-default',
            )}
          >
            {display}
          </button>
        );
      })}
    </motion.div>
  );
}
