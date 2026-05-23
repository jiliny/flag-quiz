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

// Highly accurate precise coordinates on the smoothed geographic map
const countryLocationMap: Record<string, LocationInfo> = {
  // North America
  us: { x: 20, y: 20, region: 'na' },
  ca: { x: 19, y: 13, region: 'na' },
  mx: { x: 15, y: 26, region: 'na' },
  cu: { x: 23, y: 25, region: 'na' },
  jm: { x: 22.5, y: 26.5, region: 'na' },
  do: { x: 25, y: 26, region: 'na' },
  ht: { x: 24.2, y: 26, region: 'na' },
  cr: { x: 18, y: 30, region: 'na' },
  pa: { x: 19.5, y: 31, region: 'na' },
  gt: { x: 16.5, y: 28, region: 'na' },
  hn: { x: 18, y: 28.5, region: 'na' },
  sv: { x: 17.5, y: 29.2, region: 'na' },

  // South America
  br: { x: 32, y: 39, region: 'sa' },
  ar: { x: 28, y: 49, region: 'sa' },
  cl: { x: 26.5, y: 47, region: 'sa' },
  pe: { x: 26, y: 38, region: 'sa' },
  co: { x: 26.5, y: 34, region: 'sa' },
  ec: { x: 24.5, y: 35.5, region: 'sa' },
  bo: { x: 28.5, y: 41, region: 'sa' },
  py: { x: 30, y: 44, region: 'sa' },
  uy: { x: 31, y: 48, region: 'sa' },
  ve: { x: 28.5, y: 32.5, region: 'sa' },

  // Europe
  gb: { x: 44, y: 15.5, region: 'eu' },
  fr: { x: 45, y: 19.5, region: 'eu' },
  de: { x: 47.5, y: 17.5, region: 'eu' },
  it: { x: 49, y: 21.5, region: 'eu' },
  es: { x: 43.5, y: 21.5, region: 'eu' },
  nl: { x: 46.5, y: 17, region: 'eu' },
  ch: { x: 47, y: 19, region: 'eu' },
  se: { x: 49.5, y: 12.5, region: 'eu' },
  no: { x: 47.5, y: 12.5, region: 'eu' },
  gr: { x: 51, y: 22.5, region: 'eu' },
  ie: { x: 42, y: 15.5, region: 'eu' },
  pt: { x: 42.5, y: 21.5, region: 'eu' },
  pl: { x: 50.5, y: 17.5, region: 'eu' },
  dk: { x: 48, y: 15.5, region: 'eu' },
  fi: { x: 51.5, y: 12.5, region: 'eu' },
  be: { x: 46, y: 18, region: 'eu' },
  at: { x: 48.5, y: 19.5, region: 'eu' },
  hu: { x: 50, y: 20, region: 'eu' },
  is: { x: 38.5, y: 12.5, region: 'eu' },
  cz: { x: 48.5, y: 19, region: 'eu' },
  ua: { x: 53.5, y: 19, region: 'eu' },
  ro: { x: 51.5, y: 20.5, region: 'eu' },
  bg: { x: 51.5, y: 22, region: 'eu' },
  sk: { x: 49.5, y: 19, region: 'eu' },
  si: { x: 48, y: 20.5, region: 'eu' },
  hr: { x: 49, y: 21, region: 'eu' },
  rs: { x: 50.5, y: 21.5, region: 'eu' },
  al: { x: 50, y: 23, region: 'eu' },
  ee: { x: 51.5, y: 14.5, region: 'eu' },
  lv: { x: 51.5, y: 15.5, region: 'eu' },
  lt: { x: 51.5, y: 16.5, region: 'eu' },
  lu: { x: 45.8, y: 19, region: 'eu' },
  mt: { x: 48.5, y: 25, region: 'eu' },
  by: { x: 52.5, y: 17, region: 'eu' },

  // Africa
  eg: { x: 53, y: 27.5, region: 'af' },
  za: { x: 53, y: 44.5, region: 'af' },
  ng: { x: 46.5, y: 34.5, region: 'af' },
  ke: { x: 54, y: 35.5, region: 'af' },
  ma: { x: 42.5, y: 26, region: 'af' },
  dz: { x: 45, y: 27.5, region: 'af' },
  tn: { x: 47, y: 25.5, region: 'af' },
  ly: { x: 49, y: 27.5, region: 'af' },
  sd: { x: 52.5, y: 31, region: 'af' },
  et: { x: 54.5, y: 33, region: 'af' },
  gh: { x: 45, y: 35.5, region: 'af' },
  tz: { x: 54, y: 37, region: 'af' },
  ug: { x: 52.5, y: 35.5, region: 'af' },
  sn: { x: 41, y: 33.5, region: 'af' },
  ci: { x: 44, y: 35.5, region: 'af' },
  cm: { x: 47.5, y: 35.5, region: 'af' },
  ao: { x: 49, y: 39, region: 'af' },
  zw: { x: 52, y: 42, region: 'af' },
  bw: { x: 51, y: 43, region: 'af' },

  // Asia
  cn: { x: 71, y: 21.5, region: 'as' },
  jp: { x: 82.5, y: 21, region: 'as' },
  kr: { x: 80, y: 22.5, region: 'as' },
  in: { x: 64, y: 27, region: 'as' },
  th: { x: 72, y: 29.5, region: 'as' },
  vn: { x: 74, y: 29.5, region: 'as' },
  sg: { x: 73.5, y: 34.5, region: 'as' },
  ph: { x: 79.5, y: 30, region: 'as' },
  id: { x: 75.5, y: 35.5, region: 'as' },
  my: { x: 73.5, y: 33.5, region: 'as' },
  tr: { x: 55, y: 22, region: 'as' },
  il: { x: 55.5, y: 25.5, region: 'as' },
  ae: { x: 59.5, y: 26.5, region: 'as' },
  sa: { x: 58, y: 27.5, region: 'as' },
  ir: { x: 60, y: 23, region: 'as' },
  iq: { x: 57.5, y: 23.5, region: 'as' },
  jo: { x: 56, y: 25, region: 'as' },
  lb: { x: 55.5, y: 24.2, region: 'as' },
  qa: { x: 60, y: 26.5, region: 'as' },
  kw: { x: 59, y: 24.8, region: 'as' },
  om: { x: 61, y: 27.5, region: 'as' },
  pk: { x: 62.5, y: 24.5, region: 'as' },
  bd: { x: 68.5, y: 26.5, region: 'as' },
  lk: { x: 65, y: 31.5, region: 'as' },
  np: { x: 66.5, y: 24.5, region: 'as' },
  mm: { x: 70, y: 27, region: 'as' },
  kh: { x: 72.5, y: 30, region: 'as' },
  la: { x: 71.5, y: 28, region: 'as' },
  mn: { x: 71, y: 16, region: 'as' },
  kz: { x: 63, y: 16.5, region: 'as' },
  uz: { x: 59.5, y: 19, region: 'as' },
  ru: { x: 65, y: 14, region: 'as' },

  // Oceania
  au: { x: 82.5, y: 44.5, region: 'oc' },
  nz: { x: 91, y: 52.5, region: 'oc' },
};

export function WorldMap({ code, className }: Props) {
  const loc = countryLocationMap[code.toLowerCase()] || { x: 50, y: 25, region: 'as' };

  return (
    <div className={clsx('relative w-full aspect-[100/52] bg-sky-soft/20 rounded-2xl border-2 border-ink/5 overflow-hidden p-2 shadow-inner', className)}>
      <svg
        viewBox="0 0 100 52"
        className="w-full h-full text-ink/20"
        fill="currentColor"
      >
        {/* Geographically Accurate Smooth Continent Outlines */}
        
        {/* North America */}
        <path
          d="M 2 15 C 3 13, 5 11, 8 9 C 10 9, 13 8, 17 8 C 17.5 9, 18 10, 19 10 C 20.5 8, 23 8, 26 8.5 C 26.5 10, 27 11, 28.5 11.5 C 30 11.5, 32 11, 33 12.5 C 32 13.5, 31 14, 29.5 13.5 C 27.5 14, 27 15.5, 26 17.5 C 25 19, 23.5 20, 23 21 C 22.5 22.5, 22 24.5, 22.5 25 C 22 25.5, 21.5 26, 21 27.5 C 21 31, 20.5 32.5, 19.5 32 C 18.5 31, 18.5 29.5, 19 28.5 C 18 28, 16.5 27.5, 15.5 27 C 14.5 26, 13 25.5, 12 24 C 12.5 23, 13 22.5, 12.5 21.5 C 11.5 20.5, 10.5 20.5, 10 19 C 8 19, 6 18, 4 16 L 2 15 Z"
          className={clsx(
            'transition-colors duration-500',
            loc.region === 'na' ? 'text-mint-main/45 stroke-mint-deep/45 stroke-[0.8px]' : 'text-ink/5 stroke-ink/10 stroke-[0.5px]'
          )}
        />
        
        {/* Greenland */}
        <path
          d="M 27 8 C 29 7, 32 6, 33 8 C 34 10, 32 13, 30 14 C 28 15, 25 14, 24 12 C 24 10, 25 9, 27 8 Z"
          className={clsx(
            'transition-colors duration-500',
            loc.region === 'na' ? 'text-mint-main/45 stroke-mint-deep/45 stroke-[0.8px]' : 'text-ink/5 stroke-ink/10 stroke-[0.5px]'
          )}
        />
        
        {/* South America */}
        <path
          d="M 20.5 32 C 22.5 32.5, 24.5 33.5, 26.5 34 C 28.5 35, 30.5 36.5, 32.5 38.5 C 34.5 40.5, 35.5 42.5, 33.5 45.5 C 31.5 48.5, 29.5 51.5, 27.5 53.5 C 27 54, 26 54, 25.5 51 C 25 48, 24.5 45, 24 42 C 23 40, 22 38, 20.5 34.5 Z"
          className={clsx(
            'transition-colors duration-500',
            loc.region === 'sa' ? 'text-mint-main/45 stroke-mint-deep/45 stroke-[0.8px]' : 'text-ink/5 stroke-ink/10 stroke-[0.5px]'
          )}
        />
        
        {/* Eurasia (Europe & Asia conjoined) */}
        <path
          d="M 42 22 C 43 20, 44 19, 45 19 C 46 19, 47 20, 48 20 C 49 20, 50 19.5, 51 18 C 51.5 17, 52.5 16, 53 14 C 53.5 12, 52.5 11, 51.5 11 C 50.5 11, 50 12, 49.5 13 C 48.5 13.5, 48 13, 48.5 12 C 49 11, 49.5 10, 50 9 C 51 8, 52.5 7.5, 53.5 9 C 54.5 10, 55.5 11.5, 55.5 13 C 56 14.5, 57 14, 59 13 C 61 12, 64 11, 68 11 C 72 11, 78 10, 83 11 C 86 11.5, 87 13, 85 15 C 83 17, 81 19, 81 21 C 81 23, 82 24, 80 25 C 78 26, 76 27, 75 29 C 74 31, 74 33, 73 34 C 71 34.5, 70 33, 69 31 C 67 29, 65 28, 63 28 C 61 28, 59 29, 58 29 C 56 29, 55 27, 56 25 C 57 23, 55 22, 53.5 22.5 C 52.5 22, 51.5 21.5, 50.5 22.5 C 49.5 23.5, 49.5 24.5, 48.5 24.5 C 47.5 24.5, 47 24, 46.5 23 C 45.5 23.5, 44 24, 43 23.5 C 42 23, 41 22.5, 42 22 Z"
          className={clsx(
            'transition-colors duration-500',
            (loc.region === 'eu' || loc.region === 'as') ? 'text-mint-main/45 stroke-mint-deep/45 stroke-[0.8px]' : 'text-ink/5 stroke-ink/10 stroke-[0.5px]'
          )}
        />

        {/* British Isles */}
        <path
          d="M 43 15 C 44 14, 45 14, 45 16 C 44 17, 43 17, 43 15 Z"
          className={clsx(
            'transition-colors duration-500',
            loc.region === 'eu' ? 'text-mint-main/45 stroke-mint-deep/45 stroke-[0.8px]' : 'text-ink/5 stroke-ink/10 stroke-[0.5px]'
          )}
        />

        {/* Iceland */}
        <path
          d="M 38 12 C 39.5 11, 40 11, 40 13 C 39 14, 38 14, 38 12 Z"
          className={clsx(
            'transition-colors duration-500',
            loc.region === 'eu' ? 'text-mint-main/45 stroke-mint-deep/45 stroke-[0.8px]' : 'text-ink/5 stroke-ink/10 stroke-[0.5px]'
          )}
        />

        {/* Japan */}
        <path
          d="M 82.5 20 C 83.5 19, 84.5 19, 84.5 21 C 83.5 23, 82.5 24, 81.5 23 Z"
          className={clsx(
            'transition-colors duration-500',
            loc.region === 'as' ? 'text-mint-main/45 stroke-mint-deep/45 stroke-[0.8px]' : 'text-ink/5 stroke-ink/10 stroke-[0.5px]'
          )}
        />

        {/* Philippines */}
        <path
          d="M 80 30 C 81 29, 81.5 29, 81 31 C 80.5 32, 80 32, 80 30 Z"
          className={clsx(
            'transition-colors duration-500',
            loc.region === 'as' ? 'text-mint-main/45 stroke-mint-deep/45 stroke-[0.8px]' : 'text-ink/5 stroke-ink/10 stroke-[0.5px]'
          )}
        />

        {/* Indonesia Sumatra */}
        <path
          d="M 73 35 C 74 34.5, 75 35, 74 36 Z"
          className={clsx(
            'transition-colors duration-500',
            loc.region === 'as' ? 'text-mint-main/45 stroke-mint-deep/45 stroke-[0.8px]' : 'text-ink/5 stroke-ink/10 stroke-[0.5px]'
          )}
        />

        {/* Indonesia Borneo */}
        <path
          d="M 76 34 C 77.5 33, 78 34, 77 36 Z"
          className={clsx(
            'transition-colors duration-500',
            loc.region === 'as' ? 'text-mint-main/45 stroke-mint-deep/45 stroke-[0.8px]' : 'text-ink/5 stroke-ink/10 stroke-[0.5px]'
          )}
        />

        {/* Indonesia New Guinea */}
        <path
          d="M 83 37 C 85 36.5, 86 37, 84 39 Z"
          className={clsx(
            'transition-colors duration-500',
            loc.region === 'as' ? 'text-mint-main/45 stroke-mint-deep/45 stroke-[0.8px]' : 'text-ink/5 stroke-ink/10 stroke-[0.5px]'
          )}
        />

        {/* Africa */}
        <path
          d="M 42 24 C 44 24, 47 24, 50 25 C 52 26, 54 26, 56 25 C 58 27, 59 29, 58 31 C 57 33, 56 35, 57 37 C 58 39, 56 41, 54 44 C 52 46, 49 47, 47 43 C 46 40, 45 37, 44 34 C 42 32, 40 30, 42 24 Z"
          className={clsx(
            'transition-colors duration-500',
            loc.region === 'af' ? 'text-mint-main/45 stroke-mint-deep/45 stroke-[0.8px]' : 'text-ink/5 stroke-ink/10 stroke-[0.5px]'
          )}
        />

        {/* Madagascar */}
        <path
          d="M 58 41 C 59 39.5, 59.5 40, 59 42 C 58.5 43.5, 58 43, 58 41 Z"
          className={clsx(
            'transition-colors duration-500',
            loc.region === 'af' ? 'text-mint-main/45 stroke-mint-deep/45 stroke-[0.8px]' : 'text-ink/5 stroke-ink/10 stroke-[0.5px]'
          )}
        />
        
        {/* Australia */}
        <path
          d="M 78 43 C 80 42, 83 41, 86 42 C 88 43, 90 44, 89 46 C 88 48, 86 50, 84 49 C 81 48, 79 48, 78 45 Z"
          className={clsx(
            'transition-colors duration-500',
            loc.region === 'oc' ? 'text-mint-main/45 stroke-mint-deep/45 stroke-[0.8px]' : 'text-ink/5 stroke-ink/10 stroke-[0.5px]'
          )}
        />

        {/* New Zealand North Island */}
        <path
          d="M 91 51 C 92 50.5, 92 51, 91.5 52 Z"
          className={clsx(
            'transition-colors duration-500',
            loc.region === 'oc' ? 'text-mint-main/45 stroke-mint-deep/45 stroke-[0.8px]' : 'text-ink/5 stroke-ink/10 stroke-[0.5px]'
          )}
        />

        {/* New Zealand South Island */}
        <path
          d="M 90 53 C 91 52.5, 91 53, 90.5 54 Z"
          className={clsx(
            'transition-colors duration-500',
            loc.region === 'oc' ? 'text-mint-main/45 stroke-mint-deep/45 stroke-[0.8px]' : 'text-ink/5 stroke-ink/10 stroke-[0.5px]'
          )}
        />
      </svg>

      {/* Premium 3D Glossy Bouncing Map Pin */}
      <motion.div
        className="absolute z-10 w-7 h-7 pointer-events-none filter drop-shadow-md"
        style={{
          left: `${loc.x}%`,
          top: `${loc.y}%`,
          x: '-50%',
          y: '-100%',
        }}
        animate={{
          y: ['-100%', '-122%', '-100%'],
        }}
        transition={{
          repeat: Infinity,
          duration: 1.4,
          ease: 'easeInOut',
        }}
      >
        <svg viewBox="0 0 32 32" className="w-full h-full">
          <defs>
            <radialGradient id="pin3d" cx="35%" cy="30%" r="70%">
              <stop offset="0%" stopColor="#FF85B3" />
              <stop offset="60%" stopColor="#FF4B87" />
              <stop offset="100%" stopColor="#C91B55" />
            </radialGradient>
            <radialGradient id="pinInner" cx="30%" cy="30%" r="70%">
              <stop offset="0%" stopColor="#FFFFFF" />
              <stop offset="100%" stopColor="#FFE0EB" />
            </radialGradient>
          </defs>
          <path
            d="M16 2 C9.5 2, 4 7.5, 4 14 C4 21, 16 30, 16 30 C16 30, 28 21, 28 14 C28 7.5, 22.5 2, 16 2 Z"
            fill="url(#pin3d)"
            stroke="#1F2540"
            strokeWidth="2.5"
            strokeLinejoin="round"
          />
          <circle
            cx="16"
            cy="13"
            r="4.5"
            fill="url(#pinInner)"
            stroke="#1F2540"
            strokeWidth="2"
          />
        </svg>
      </motion.div>
    </div>
  );
}
