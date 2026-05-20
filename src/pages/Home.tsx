import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useGameStore, isLevelUnlocked, levelProgress } from '../store/gameStore';
import { LevelTile } from '../components/LevelTile';
import { Globie } from '../components/Globie';
import { Icons } from '../components/Icons';
import { useT } from '../i18n';
import { audio } from '../lib/audio';

export function Home() {
  const t = useT();
  const { mastered, settings, setLang, coins = 0 } = useGameStore();
  const expanded = settings.expandedPool;

  const testing = settings.testingMode;
  const easy = levelProgress('easy', mastered, expanded);
  const fill = levelProgress('fill', mastered, expanded);
  const medium = levelProgress('medium', mastered, expanded);
  const hard = levelProgress('hard', mastered, expanded);

  const onToggleLang = () => {
    audio.unlockUserGesture();
    audio.tap();
    setLang(settings.lang === 'en' ? 'zh' : 'en');
  };

  return (
    <div className="min-h-dvh safe-pt safe-pb px-4 pt-4 pb-6 max-w-2xl mx-auto flex flex-col">
      <header className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-3">
          <Globie mood="happy" size={84} />
          <div>
            <div className="text-3xl font-bold text-ink">{t('appTitle')}</div>
            <div className="text-base text-ink/70">{t('hi')}</div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={onToggleLang}
            className="no-select rounded-pill bg-white border-2 border-ink/10 px-3 py-2 text-base font-bold shadow-button flex items-center gap-1"
            aria-label={t('language')}
          >
            <span aria-hidden>{settings.lang === 'en' ? '🇺🇸' : '🇨🇳'}</span>
            <span>{settings.lang === 'en' ? 'EN' : '中'}</span>
          </button>
          <Link
            to="/settings"
            className="rounded-pill bg-white border-2 border-ink/10 w-11 h-11 flex items-center justify-center shadow-button transition-transform duration-300 hover:scale-105 active:scale-95"
            aria-label={t('settings')}
          >
            <Icons.Gear size={24} className="transition-transform duration-500 hover:rotate-90 text-ink" />
          </Link>
        </div>
      </header>

      <div className="flex flex-col gap-4 mt-3">
        <LevelTile
          level="easy"
          unlocked={isLevelUnlocked('easy', mastered, expanded, testing)}
          done={easy.done}
          total={easy.total}
        />
        <LevelTile
          level="fill"
          unlocked={isLevelUnlocked('fill', mastered, expanded, testing)}
          done={fill.done}
          total={fill.total}
        />
        <LevelTile
          level="medium"
          unlocked={isLevelUnlocked('medium', mastered, expanded, testing)}
          done={medium.done}
          total={medium.total}
        />
        <LevelTile
          level="hard"
          unlocked={isLevelUnlocked('hard', mastered, expanded, testing)}
          done={hard.done}
          total={hard.total}
        />
      </div>

      <motion.div
        className="mt-5 flex justify-center"
        whileTap={{ y: 4, scale: 0.97 }}
      >
        <Link
          to="/passport"
          className="no-select rounded-pill bg-candy-main text-white font-bold text-xl px-7 py-4 shadow-button border-2 border-candy-deep flex items-center gap-2.5 transition-transform duration-200 hover:scale-103"
        >
          <Icons.Passport size={26} className="shrink-0" />
          <span>{t('passport')}</span>
          <span className="text-white font-extrabold flex items-center gap-1 ml-1 bg-white/20 px-2.5 py-1 rounded-full text-base border border-white/10 select-none">
            <Icons.Coin size={18} className="shrink-0" /> {coins}
          </span>
        </Link>
      </motion.div>
    </div>
  );
}
