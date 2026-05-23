import { motion } from 'framer-motion';
import clsx from 'clsx';

export type GlobieMood = 'idle' | 'happy' | 'oops' | 'sleepy';

interface Props {
  mood?: GlobieMood;
  size?: number;
  bobbing?: boolean;
  className?: string;
}

/**
 * Globie — a cheerful cartoon globe mascot.
 * Pure inline SVG, no asset deps. 4 expressions via the `mood` prop.
 */
export function Globie({ mood = 'idle', size = 120, bobbing = true, className }: Props) {
  return (
    <motion.div
      animate={bobbing ? { y: [0, -6, 0] } : undefined}
      transition={
        bobbing ? { duration: 2.4, repeat: Infinity, ease: 'easeInOut' } : undefined
      }
      style={{ width: size, height: size }}
      className={clsx("select-none", className)}
    >
      <svg viewBox="0 0 200 200" width={size} height={size} aria-hidden>
        <defs>
          <radialGradient id="globieBody" cx="40%" cy="35%" r="70%">
            <stop offset="0%" stopColor="#7DD3FC" />
            <stop offset="60%" stopColor="#3FB6FF" />
            <stop offset="100%" stopColor="#1F7FD6" />
          </radialGradient>
          <radialGradient id="globieShine" cx="35%" cy="30%" r="40%">
            <stop offset="0%" stopColor="rgba(255,255,255,0.85)" />
            <stop offset="100%" stopColor="rgba(255,255,255,0)" />
          </radialGradient>
        </defs>

        <ellipse cx="100" cy="178" rx="58" ry="9" fill="rgba(31,37,64,0.18)" />

        <circle cx="100" cy="98" r="78" fill="url(#globieBody)" />

        <g fill="#3DD58A" opacity="0.85">
          <path d="M48 70 q14 -6 28 0 q-2 16 10 22 q-22 8 -32 -4 q-2 -10 -6 -18z" />
          <path d="M120 56 q14 -2 22 6 q-4 12 4 22 q-18 4 -28 -6 q2 -12 2 -22z" />
          <path d="M70 130 q22 -10 44 -2 q-4 18 14 28 q-30 8 -50 -6 q-4 -10 -8 -20z" />
          <path d="M150 116 q10 0 16 8 q-4 8 0 16 q-14 -2 -18 -10 q0 -8 2 -14z" />
        </g>

        <circle cx="100" cy="98" r="78" fill="url(#globieShine)" />
        <circle cx="100" cy="98" r="78" fill="none" stroke="#1F2540" strokeWidth="4" />

        <g>
          <ellipse cx="76" cy="92" rx="14" ry="16" fill="#FFFFFF" />
          <ellipse cx="124" cy="92" rx="14" ry="16" fill="#FFFFFF" />

          {mood === 'sleepy' ? (
            <>
              <path
                d="M64 92 Q76 80 88 92"
                stroke="#1F2540"
                strokeWidth="5"
                fill="none"
                strokeLinecap="round"
              />
              <path
                d="M112 92 Q124 80 136 92"
                stroke="#1F2540"
                strokeWidth="5"
                fill="none"
                strokeLinecap="round"
              />
            </>
          ) : (
            <>
              <circle
                cx={mood === 'oops' ? 74 : 78}
                cy={mood === 'happy' ? 88 : 94}
                r="6"
                fill="#1F2540"
              />
              <circle
                cx={mood === 'oops' ? 122 : 126}
                cy={mood === 'happy' ? 88 : 94}
                r="6"
                fill="#1F2540"
              />
              <circle cx={mood === 'oops' ? 71 : 75} cy={mood === 'happy' ? 86 : 92} r="2" fill="#FFFFFF" />
              <circle cx={mood === 'oops' ? 119 : 123} cy={mood === 'happy' ? 86 : 92} r="2" fill="#FFFFFF" />
            </>
          )}
        </g>

        <ellipse cx="68" cy="120" rx="9" ry="5" fill="#FF6FA3" opacity="0.7" />
        <ellipse cx="132" cy="120" rx="9" ry="5" fill="#FF6FA3" opacity="0.7" />

        {mood === 'happy' && (
          <path
            d="M80 128 Q100 152 120 128"
            stroke="#1F2540"
            strokeWidth="5"
            fill="#C2356D"
            strokeLinecap="round"
          />
        )}
        {mood === 'idle' && (
          <path
            d="M82 132 Q100 144 118 132"
            stroke="#1F2540"
            strokeWidth="5"
            fill="none"
            strokeLinecap="round"
          />
        )}
        {mood === 'oops' && (
          <ellipse
            cx="100"
            cy="138"
            rx="10"
            ry="6"
            fill="#C2356D"
            stroke="#1F2540"
            strokeWidth="4"
          />
        )}
        {mood === 'sleepy' && (
          <path
            d="M86 134 Q100 130 114 134"
            stroke="#1F2540"
            strokeWidth="5"
            fill="none"
            strokeLinecap="round"
          />
        )}

        {mood === 'sleepy' && (
          <g fill="#1F2540" fontFamily="Fredoka, sans-serif" fontWeight="700">
            <text x="148" y="50" fontSize="22">
              Z
            </text>
            <text x="166" y="34" fontSize="16">
              z
            </text>
          </g>
        )}
      </svg>
    </motion.div>
  );
}
