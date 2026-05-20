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
        'no-select relative w-[88px] h-12 rounded-pill border-2 transition-colors',
        on ? 'bg-mint-main border-mint-deep' : 'bg-ink/15 border-ink/20',
      )}
    >
      <motion.span
        layout
        transition={{ type: 'spring', stiffness: 500, damping: 28 }}
        className={clsx(
          'absolute top-1 w-9 h-9 rounded-full bg-white shadow-button flex items-center justify-center text-base font-bold',
          on ? 'right-1' : 'left-1',
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
          className="rounded-pill bg-white border-2 border-ink/10 px-4 py-2 font-semibold shadow-button flex items-center gap-1.5 transition-transform active:scale-95"
        >
          <Icons.BackArrow size={16} className="text-ink shrink-0" />
          <span>{t('back')}</span>
        </Link>
        <h1 className="text-2xl font-bold">{t('settings')}</h1>
        <div className="w-12" aria-hidden />
      </header>

      <section className="bg-white rounded-xl2 border-4 border-ink/10 shadow-sticker p-4 sm:p-6 flex flex-col gap-5">
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
            labelOn={<Icons.Flask size={20} className="text-ink shrink-0" />}
            labelOff=""
          />
        </RowWithCaption>
      </section>

      <button
        type="button"
        onClick={() => setConfirmReset(true)}
        className="no-select self-center rounded-pill bg-white border-2 border-candy-deep text-candy-deep font-semibold px-6 py-3 shadow-button"
      >
        {t('resetProgress')}
      </button>

      <AnimatePresence>
        {confirmReset && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-ink/40 backdrop-blur-sm flex items-end sm:items-center justify-center p-4"
          >
            <motion.div
              initial={{ y: 60, scale: 0.96 }}
              animate={{ y: 0, scale: 1 }}
              exit={{ y: 60, scale: 0.96 }}
              className="bg-white rounded-xl2 border-4 border-ink/10 shadow-sticker p-6 max-w-md w-full flex flex-col items-center gap-4"
            >
              <Globie mood="oops" size={96} />
              <h2 className="text-2xl font-bold text-center">{t('resetConfirmTitle')}</h2>
              <p className="text-base text-ink/70 text-center">{t('resetConfirmDesc')}</p>
              <div className="flex gap-3 mt-2">
                <button
                  type="button"
                  onClick={() => setConfirmReset(false)}
                  className="no-select rounded-pill bg-white border-2 border-ink/10 px-6 py-3 font-bold shadow-button"
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
                  className="no-select rounded-pill bg-candy-main text-white border-2 border-candy-deep px-6 py-3 font-bold shadow-button"
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
      <div className="text-xl font-semibold">{label}</div>
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
        <div className="text-xl font-semibold">{label}</div>
        <div className="text-sm text-ink/60">{caption}</div>
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
        'no-select rounded-pill px-5 py-3 font-bold text-lg border-2 shadow-button',
        active ? 'bg-sky-main text-white border-sky-deep' : 'bg-white text-ink border-ink/10',
      )}
    >
      {children}
    </button>
  );
}
