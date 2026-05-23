import { useState } from 'react';
import { Link } from 'react-router-dom';
import clsx from 'clsx';
import { motion, AnimatePresence } from 'framer-motion';
import { useGameStore } from '../store/gameStore';
import { useT } from '../i18n';
import { Globie } from '../components/Globie';
import { Icons } from '../components/Icons';
import { audio } from '../lib/audio';

function Toggle({
  on,
  onChange,
  labelOn = '',
  labelOff = '',
}: {
  on: boolean;
  onChange: (v: boolean) => void;
  labelOn?: React.ReactNode;
  labelOff?: React.ReactNode;
}) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={on}
      onClick={() => {
        audio.tap();
        onChange(!on);
      }}
      className={clsx(
        'no-select relative w-[80px] h-11 rounded-pill border transition-colors shadow-button',
        on ? 'bg-mint-main border-mint-deep/20' : 'bg-ink/10 border-ink/5',
      )}
    >
      <motion.span
        layout
        transition={{ type: 'spring', stiffness: 500, damping: 28 }}
        className={clsx(
          'absolute top-0.5 w-9.5 h-9.5 rounded-full bg-white shadow-button flex items-center justify-center text-sm font-extrabold',
          on ? 'right-0.5' : 'left-0.5',
        )}
      >
        {on ? labelOn : labelOff}
      </motion.span>
    </button>
  );
}

export function Settings() {
  const t = useT();
  const { settings, setLang, setSound, setExpandedPool, setTestingMode, reset } =
    useGameStore();
  const [confirmReset, setConfirmReset] = useState(false);

  return (
    <div className="min-h-dvh safe-pt safe-pb px-4 pt-4 pb-6 max-w-2xl mx-auto flex flex-col gap-5">
      <header className="flex items-center justify-between">
        <Link
          to="/"
          className="rounded-pill bg-white border border-ink/5 px-4 py-2 font-extrabold text-sm shadow-button flex items-center gap-1.5 transition-transform active:scale-95"
        >
          <Icons.BackArrow size={14} className="text-ink shrink-0" />
          <span>{t('back')}</span>
        </Link>
        <h1 className="text-2xl font-extrabold text-ink">{t('settings')}</h1>
        <div className="w-12" aria-hidden />
      </header>

      <section className="bg-white rounded-xl2 border-2 border-ink/5 shadow-sticker p-5 sm:p-7 flex flex-col gap-6">
        <Row label={t('language')}>
          <div className="flex gap-2">
            <LangPill
              active={settings.lang === 'en'}
              onClick={() => {
                audio.tap();
                setLang('en');
              }}
            >
              🇺🇸 EN
            </LangPill>
            <LangPill
              active={settings.lang === 'zh'}
              onClick={() => {
                audio.tap();
                setLang('zh');
              }}
            >
              🇨🇳 中
            </LangPill>
          </div>
        </Row>

        <Row label={t('sound')}>
          <Toggle
            on={settings.sound}
            onChange={setSound}
            labelOn={<Icons.VolumeUp size={18} className="text-ink shrink-0" />}
            labelOff={<Icons.VolumeMute size={18} className="text-ink shrink-0" />}
          />
        </Row>

        <Row label={t('includeAll')}>
          <Toggle on={settings.expandedPool} onChange={setExpandedPool} labelOn="✓" labelOff="" />
        </Row>

        <RowWithCaption label={t('testingMode')} caption={t('testingModeDesc')}>
          <Toggle
            on={settings.testingMode}
            onChange={setTestingMode}
            labelOn={<Icons.Flask size={18} className="text-ink shrink-0" />}
            labelOff=""
          />
        </RowWithCaption>
      </section>

      <button
        type="button"
        onClick={() => setConfirmReset(true)}
        className="no-select self-center rounded-pill bg-white border border-candy-deep/20 text-candy-deep font-extrabold text-base px-6 py-3 shadow-button active:translate-y-0.5"
      >
        {t('resetProgress')}
      </button>

      <AnimatePresence>
        {confirmReset && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-ink/35 backdrop-blur-md flex items-end sm:items-center justify-center p-4"
          >
            <motion.div
              initial={{ y: 60, scale: 0.96 }}
              animate={{ y: 0, scale: 1 }}
              exit={{ y: 60, scale: 0.96 }}
              className="bg-white rounded-xl2 border-2 border-ink/5 shadow-sticker p-6 max-w-md w-full flex flex-col items-center gap-4"
            >
              <Globie mood="oops" size={88} className="animate-[floaty_3s_ease-in-out_infinite]" />
              <h2 className="text-2xl font-extrabold text-center text-ink">{t('resetConfirmTitle')}</h2>
              <p className="text-base font-semibold text-ink/65 text-center px-2">{t('resetConfirmDesc')}</p>
              <div className="flex gap-3 mt-2 w-full max-w-xs">
                <button
                  type="button"
                  onClick={() => setConfirmReset(false)}
                  className="no-select flex-1 rounded-pill bg-white border border-ink/5 py-3 font-extrabold shadow-button text-ink active:translate-y-0.5 text-center"
                >
                  {t('cancel')}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    audio.tap();
                    reset();
                    setConfirmReset(false);
                  }}
                  className="no-select flex-1 rounded-pill bg-candy-main text-white border border-candy-deep/20 py-3 font-extrabold shadow-button active:translate-y-0.5 text-center"
                >
                  {t('reset')}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function Row({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between gap-4">
      <div className="text-lg sm:text-xl font-extrabold text-ink">{label}</div>
      <div>{children}</div>
    </div>
  );
}

function RowWithCaption({
  label,
  caption,
  children,
}: {
  label: string;
  caption: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex items-center justify-between gap-4">
      <div className="flex flex-col">
        <div className="text-lg sm:text-xl font-extrabold text-ink">{label}</div>
        <div className="text-sm font-semibold text-ink/50 mt-0.5">{caption}</div>
      </div>
      <div className="shrink-0">{children}</div>
    </div>
  );
}

function LangPill({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={clsx(
        'no-select rounded-pill px-5 py-2.5 font-extrabold text-base border shadow-button transition-all',
        active ? 'bg-sky-main text-white border-sky-deep/20' : 'bg-white text-ink border-ink/5 active:translate-y-0.5',
      )}
    >
      {children}
    </button>
  );
}
