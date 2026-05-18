import { AnimatePresence, motion } from 'framer-motion';
import { Globie } from './Globie';
import { useT } from '../i18n';

interface Props {
  /** Current hint text. When null/empty the card is hidden. */
  text: string | null;
  /** Index of the hint, used to retrigger the slide-in animation on a new hint. */
  attemptIndex?: number;
}

/**
 * A friendly "did you know?" card that slides up after a wrong answer.
 * Stays visible while the kid retries; replaces itself when a new hint arrives.
 */
export function HintCard({ text, attemptIndex = 0 }: Props) {
  const t = useT();
  return (
    <AnimatePresence mode="wait">
      {text && (
        <motion.div
          key={`${attemptIndex}-${text}`}
          initial={{ y: 40, opacity: 0, scale: 0.95 }}
          animate={{ y: 0, opacity: 1, scale: 1 }}
          exit={{ y: 30, opacity: 0, scale: 0.95 }}
          transition={{ type: 'spring', stiffness: 240, damping: 22 }}
          className="w-full max-w-xl"
          role="status"
          aria-live="polite"
        >
          <div className="rounded-xl2 bg-candy-soft border-4 border-candy-deep/40 shadow-sticker px-4 py-3 sm:px-5 sm:py-4 flex items-start gap-3">
            <div className="shrink-0 -mt-1">
              <Globie mood="oops" size={56} bobbing={false} />
            </div>
            <div className="flex-1">
              <div className="text-sm sm:text-base font-bold text-candy-deep uppercase tracking-wide">
                <span aria-hidden>💡 </span>
                {t('hint')}
              </div>
              <div className="text-xl sm:text-2xl font-bold text-ink leading-snug mt-1">
                {text}
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
