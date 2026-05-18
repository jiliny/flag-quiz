import clsx from 'clsx';
import { motion } from 'framer-motion';

interface Props {
  value: number;
  max: number;
  color?: 'sky' | 'mint' | 'sun' | 'candy';
  label?: string;
}

const colorMap = {
  sky: { fill: 'bg-sky-main', deep: 'text-sky-deep', track: 'bg-sky-soft/70' },
  mint: { fill: 'bg-mint-main', deep: 'text-mint-deep', track: 'bg-mint-soft/70' },
  sun: { fill: 'bg-sun-main', deep: 'text-sun-deep', track: 'bg-sun-soft/70' },
  candy: { fill: 'bg-candy-main', deep: 'text-candy-deep', track: 'bg-candy-soft/70' },
} as const;

export function ProgressBar({ value, max, color = 'sky', label }: Props) {
  const pct = max === 0 ? 0 : Math.min(100, Math.round((value / max) * 100));
  const c = colorMap[color];
  return (
    <div className="w-full">
      {label !== undefined && (
        <div className={clsx('text-sm font-semibold mb-1', c.deep)}>{label}</div>
      )}
      <div className={clsx('relative h-5 rounded-pill overflow-hidden border-2 border-ink/10', c.track)}>
        <motion.div
          className={clsx('absolute inset-y-0 left-0', c.fill)}
          style={{
            backgroundImage:
              'repeating-linear-gradient(45deg, rgba(255,255,255,0.25) 0 10px, transparent 10px 20px)',
          }}
          initial={{ width: 0 }}
          animate={{ width: `${pct}%` }}
          transition={{ type: 'spring', stiffness: 110, damping: 20 }}
        />
        {pct > 4 && (
          <motion.div
            className="absolute -top-1.5 text-base"
            style={{ left: `calc(${pct}% - 14px)` }}
            initial={{ y: -4 }}
            animate={{ y: [0, -4, 0] }}
            transition={{ duration: 1.6, repeat: Infinity, ease: 'easeInOut' }}
          >
            <span aria-hidden>⭐</span>
          </motion.div>
        )}
      </div>
    </div>
  );
}
