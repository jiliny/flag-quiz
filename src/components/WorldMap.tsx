import { motion } from 'framer-motion';
import clsx from 'clsx';

interface Props {
  code: string;
  className?: string;
}

export type RegionKey = 'na' | 'sa' | 'eu' | 'af' | 'as' | 'oc';

interface LocationInfo {
  x: number;
  y: number;
  region: RegionKey;
}

// Complete coordinate and region mapping for all 109+ Curated + Extra countries
const countryLocationMap: Record<string, LocationInfo> = {
  // North America
  us: { x: 21, y: 25, region: 'na' },
  ca: { x: 19, y: 15, region: 'na' },
  mx: { x: 18, y: 29, region: 'na' },
  cu: { x: 24, y: 29, region: 'na' },
  jm: { x: 23, y: 31, region: 'na' },
  do: { x: 25, y: 30, region: 'na' },
  ht: { x: 24.5, y: 30, region: 'na' },
  cr: { x: 21, y: 33, region: 'na' },
  pa: { x: 22.5, y: 34, region: 'na' },
  gt: { x: 19, y: 31, region: 'na' },
  hn: { x: 20, y: 31.5, region: 'na' },
  sv: { x: 19.5, y: 32, region: 'na' },

  // South America
  br: { x: 36, y: 42, region: 'sa' },
  ar: { x: 31, y: 51, region: 'sa' },
  cl: { x: 29, y: 49, region: 'sa' },
  pe: { x: 29, y: 39, region: 'sa' },
  co: { x: 29, y: 34, region: 'sa' },
  ec: { x: 27, y: 36, region: 'sa' },
  bo: { x: 31, y: 42, region: 'sa' },
  py: { x: 33, y: 46, region: 'sa' },
  uy: { x: 34, y: 50, region: 'sa' },
  ve: { x: 31, y: 33, region: 'sa' },

  // Europe
  gb: { x: 45, y: 16, region: 'eu' },
  fr: { x: 46, y: 20, region: 'eu' },
  de: { x: 48, y: 18, region: 'eu' },
  it: { x: 50, y: 22, region: 'eu' },
  es: { x: 44, y: 22, region: 'eu' },
  nl: { x: 47, y: 17, region: 'eu' },
  ch: { x: 48, y: 20, region: 'eu' },
  se: { x: 50, y: 12, region: 'eu' },
  no: { x: 48, y: 12, region: 'eu' },
  gr: { x: 52, y: 23, region: 'eu' },
  ie: { x: 43, y: 16, region: 'eu' },
  pt: { x: 42, y: 22, region: 'eu' },
  pl: { x: 51, y: 18, region: 'eu' },
  dk: { x: 48.5, y: 16, region: 'eu' },
  fi: { x: 52.5, y: 12, region: 'eu' },
  be: { x: 46, y: 18, region: 'eu' },
  at: { x: 49.5, y: 19.5, region: 'eu' },
  hu: { x: 51, y: 20, region: 'eu' },
  is: { x: 39, y: 12, region: 'eu' },
  cz: { x: 49.5, y: 19, region: 'eu' },
  ua: { x: 54, y: 19.5, region: 'eu' },
  ro: { x: 52.5, y: 21, region: 'eu' },
  bg: { x: 52.5, y: 22.5, region: 'eu' },
  sk: { x: 50.5, y: 19, region: 'eu' },
  si: { x: 49, y: 20.5, region: 'eu' },
  hr: { x: 50, y: 21, region: 'eu' },
  rs: { x: 51.5, y: 21.5, region: 'eu' },
  al: { x: 51, y: 23.5, region: 'eu' },
  ee: { x: 52.5, y: 14.5, region: 'eu' },
  lv: { x: 52.5, y: 15.5, region: 'eu' },
  lt: { x: 52.5, y: 16.5, region: 'eu' },
  lu: { x: 46.5, y: 19, region: 'eu' },
  mt: { x: 49.5, y: 25.5, region: 'eu' },
  by: { x: 53.5, y: 17.5, region: 'eu' },

  // Africa
  eg: { x: 55, y: 28, region: 'af' },
  za: { x: 55, y: 47, region: 'af' },
  ng: { x: 48, y: 35, region: 'af' },
  ke: { x: 56, y: 36, region: 'af' },
  ma: { x: 43, y: 26, region: 'af' },
  dz: { x: 46, y: 28, region: 'af' },
  tn: { x: 48, y: 26, region: 'af' },
  ly: { x: 50.5, y: 28, region: 'af' },
  sd: { x: 54.5, y: 32, region: 'af' },
  et: { x: 56.5, y: 34, region: 'af' },
  gh: { x: 46.5, y: 36, region: 'af' },
  tz: { x: 56, y: 38, region: 'af' },
  ug: { x: 54.5, y: 36.5, region: 'af' },
  sn: { x: 42.5, y: 34, region: 'af' },
  ci: { x: 45.5, y: 36, region: 'af' },
  cm: { x: 49, y: 36, region: 'af' },
  ao: { x: 50.5, y: 41, region: 'af' },
  zw: { x: 54, y: 44, region: 'af' },
  bw: { x: 53, y: 45, region: 'af' },

  // Asia
  cn: { x: 74, y: 23, region: 'as' },
  jp: { x: 83, y: 22, region: 'as' },
  kr: { x: 80, y: 23, region: 'as' },
  in: { x: 69, y: 28, region: 'as' },
  th: { x: 74, y: 31, region: 'as' },
  vn: { x: 76, y: 31, region: 'as' },
  sg: { x: 75, y: 36, region: 'as' },
  ph: { x: 80, y: 31, region: 'as' },
  id: { x: 76, y: 38, region: 'as' },
  my: { x: 74, y: 35, region: 'as' },
  tr: { x: 56, y: 23, region: 'as' },
  il: { x: 56, y: 26, region: 'as' },
  ae: { x: 61, y: 27, region: 'as' },
  sa: { x: 59, y: 28, region: 'as' },
  ir: { x: 61, y: 24, region: 'as' },
  iq: { x: 58.5, y: 24.5, region: 'as' },
  jo: { x: 57, y: 26, region: 'as' },
  lb: { x: 56.5, y: 25.5, region: 'as' },
  qa: { x: 61.5, y: 27, region: 'as' },
  kw: { x: 60, y: 25.5, region: 'as' },
  om: { x: 62.5, y: 28, region: 'as' },
  pk: { x: 67, y: 25.5, region: 'as' },
  bd: { x: 71, y: 27, region: 'as' },
  lk: { x: 70, y: 32, region: 'as' },
  np: { x: 70, y: 25.5, region: 'as' },
  mm: { x: 73, y: 28.5, region: 'as' },
  kh: { x: 75, y: 31.5, region: 'as' },
  la: { x: 74.5, y: 29.5, region: 'as' },
  mn: { x: 74, y: 17.5, region: 'as' },
  kz: { x: 66, y: 17.5, region: 'as' },
  uz: { x: 62.5, y: 20, region: 'as' },
  ru: { x: 65, y: 15, region: 'as' },

  // Oceania
  au: { x: 84, y: 48, region: 'oc' },
  nz: { x: 91, y: 53, region: 'oc' },
};

export function WorldMap({ code, className }: Props) {
  const loc = countryLocationMap[code.toLowerCase()] || { x: 50, y: 30, region: 'as' };

  return (
    <div className={clsx('relative w-full aspect-[100/52] bg-sky-soft/20 rounded-2xl border-2 border-ink/5 overflow-hidden p-2', className)}>
      <svg
        viewBox="0 0 100 52"
        className="w-full h-full text-ink/20"
        fill="currentColor"
      >
        {/* Stylized Low-Poly Continents */}
        
        {/* North America */}
        <path
          d="M 5 8 L 26 8 L 33 16 L 27 28 L 22 28 L 22 34 L 17 34 L 14 26 L 8 20 L 5 13 Z"
          className={clsx(
            'transition-colors duration-500',
            loc.region === 'na' ? 'text-mint-main/40 stroke-mint-deep/30 stroke-[0.8px]' : 'text-ink/5 stroke-ink/10 stroke-[0.5px]'
          )}
        />
        
        {/* South America */}
        <path
          d="M 22 34 L 28 34 L 35 40 L 33 46 L 29 50 L 26 42 L 21 37 Z"
          className={clsx(
            'transition-colors duration-500',
            loc.region === 'sa' ? 'text-mint-main/40 stroke-mint-deep/30 stroke-[0.8px]' : 'text-ink/5 stroke-ink/10 stroke-[0.5px]'
          )}
        />
        
        {/* Europe */}
        <path
          d="M 38 12 L 53 10 L 54 18 L 52 23 L 42 23 L 38 17 Z"
          className={clsx(
            'transition-colors duration-500',
            loc.region === 'eu' ? 'text-mint-main/40 stroke-mint-deep/30 stroke-[0.8px]' : 'text-ink/5 stroke-ink/10 stroke-[0.5px]'
          )}
        />

        {/* Africa */}
        <path
          d="M 42 24 L 56 24 L 58 32 L 56 38 L 54 44 L 50 46 L 47 38 L 40 30 Z"
          className={clsx(
            'transition-colors duration-500',
            loc.region === 'af' ? 'text-mint-main/40 stroke-mint-deep/30 stroke-[0.8px]' : 'text-ink/5 stroke-ink/10 stroke-[0.5px]'
          )}
        />
        
        {/* Asia */}
        <path
          d="M 53 10 L 85 8 L 86 16 L 84 22 L 81 28 L 74 34 L 68 34 L 62 30 L 54 22 Z"
          className={clsx(
            'transition-colors duration-500',
            loc.region === 'as' ? 'text-mint-main/40 stroke-mint-deep/30 stroke-[0.8px]' : 'text-ink/5 stroke-ink/10 stroke-[0.5px]'
          )}
        />

        {/* Oceania */}
        <path
          d="M 78 40 L 86 38 L 90 44 L 88 50 L 78 46 Z"
          className={clsx(
            'transition-colors duration-500',
            loc.region === 'oc' ? 'text-mint-main/40 stroke-mint-deep/30 stroke-[0.8px]' : 'text-ink/5 stroke-ink/10 stroke-[0.5px]'
          )}
        />
      </svg>

      {/* Bouncing 3D Map Pin */}
      <motion.div
        className="absolute z-10 w-6 h-6 text-candy-main pointer-events-none drop-shadow-md"
        style={{
          left: `${loc.x}%`,
          top: `${loc.y}%`,
          x: '-50%',
          y: '-100%',
        }}
        animate={{
          y: ['-100%', '-120%', '-100%'],
        }}
        transition={{
          repeat: Infinity,
          duration: 1.4,
          ease: 'easeInOut',
        }}
      >
        <svg viewBox="0 0 24 24" fill="currentColor" className="w-full h-full">
          <path
            d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"
            stroke="#1F2540"
            strokeWidth="2"
            strokeLinejoin="round"
          />
        </svg>
      </motion.div>
    </div>
  );
}
