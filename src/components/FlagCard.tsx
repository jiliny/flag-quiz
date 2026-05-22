import { motion } from 'framer-motion';
import clsx from 'clsx';

interface Props {
  code: string;
  size?: 'sm' | 'md' | 'lg' | 'hero';
  wobble?: boolean;
  className?: string;
}

/**
 * Fixed pixel sizes for the flag display. The aspect ratio is locked to 4:3
 * (the source viewBox of every flag-icons SVG), so the flag is never stretched
 * or cropped by the layout — it looks the same on phone, tablet, and desktop.
 */
const sizeMap = {
  sm: { width: 96, height: 72, pad: 'p-2', rotate: -2 },
  md: { width: 160, height: 120, pad: 'p-3', rotate: -3 },
  lg: { width: 240, height: 180, pad: 'p-4', rotate: -3 },
  hero: { width: 320, height: 240, pad: 'p-4 sm:p-5', rotate: -3 },
} as const;

export function FlagCard({ code, size = 'hero', wobble = true, className }: Props) {
  const s = sizeMap[size];
  // outer polaroid width includes the padding around the flag
  const padPx = size === 'sm' ? 8 : size === 'md' ? 12 : size === 'lg' ? 16 : 20;
  const outerW = s.width + padPx * 2;
  return (
    <motion.div
      initial={{ rotate: s.rotate, scale: 0.9, opacity: 0 }}
      animate={{ rotate: s.rotate, scale: 1, opacity: 1 }}
      transition={{ type: 'spring', stiffness: 220, damping: 18 }}
      style={{ maxWidth: '100%', width: outerW }}
      className={clsx(
        'inline-block bg-white rounded-xl2 shadow-sticker border-[3px] border-ink/10 relative flag-card-responsive',
        s.pad,
        wobble && 'animate-wobble',
        className,
      )}
    >
      <span
        className="absolute -top-3 left-1/2 -translate-x-1/2 w-16 h-5 rounded bg-sun-main/70 rotate-[-4deg] shadow-sm pointer-events-none"
        aria-hidden
      />
      <span
        className={clsx('block rounded-md overflow-hidden bg-ink/5 flag-inner', `fi-${code}`)}
        style={{
          width: s.width,
          height: s.height,
          maxWidth: '100%',
          aspectRatio: '4 / 3',
          backgroundSize: 'contain',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
        }}
        role="img"
        aria-label={`Flag ${code}`}
      />
    </motion.div>
  );
}
