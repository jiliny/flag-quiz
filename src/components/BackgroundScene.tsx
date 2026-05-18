import { motion } from 'framer-motion';

function Cloud({ delay = 0, y = 10, scale = 1, duration = 28 }: { delay?: number; y?: number; scale?: number; duration?: number }) {
  return (
    <motion.svg
      viewBox="0 0 200 110"
      width={140 * scale}
      height={80 * scale}
      className="absolute pointer-events-none"
      style={{ top: `${y}%` }}
      initial={{ x: '-30vw' }}
      animate={{ x: '130vw' }}
      transition={{ duration, delay, repeat: Infinity, ease: 'linear' }}
      aria-hidden
    >
      <g fill="rgba(255,255,255,0.85)" stroke="rgba(31,37,64,0.08)" strokeWidth="2">
        <ellipse cx="60" cy="70" rx="50" ry="32" />
        <ellipse cx="110" cy="56" rx="44" ry="38" />
        <ellipse cx="150" cy="74" rx="34" ry="26" />
      </g>
    </motion.svg>
  );
}

function PaperPlane({ delay = 0, y = 40, duration = 36 }: { delay?: number; y?: number; duration?: number }) {
  return (
    <motion.svg
      viewBox="0 0 100 80"
      width={56}
      height={44}
      className="absolute pointer-events-none"
      style={{ top: `${y}%` }}
      initial={{ x: '-15vw', rotate: -8 }}
      animate={{ x: '120vw', rotate: 8 }}
      transition={{ duration, delay, repeat: Infinity, ease: 'linear' }}
      aria-hidden
    >
      <polygon points="2,40 96,8 50,42 96,8 60,72" fill="#FFFFFF" stroke="#1F2540" strokeWidth="3" strokeLinejoin="round" />
      <polygon points="50,42 60,72 96,8" fill="#FFD3E2" stroke="#1F2540" strokeWidth="3" strokeLinejoin="round" />
    </motion.svg>
  );
}

export function BackgroundScene() {
  return (
    <div aria-hidden className="fixed inset-0 -z-10 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-sky-soft via-candy-soft to-sun-soft" />
      <Cloud delay={0} y={8} scale={1} duration={40} />
      <Cloud delay={6} y={22} scale={0.7} duration={34} />
      <Cloud delay={14} y={60} scale={0.9} duration={46} />
      <Cloud delay={20} y={78} scale={0.6} duration={30} />
      <PaperPlane delay={2} y={42} duration={38} />
      <PaperPlane delay={18} y={70} duration={44} />
    </div>
  );
}
