import clsx from 'clsx';
import { motion } from 'framer-motion';
import { useT } from '../i18n';
import { audio } from '../lib/audio';

interface BaseProps {
  onKey: (ch: string) => void;
  onBackspace: () => void;
  onSubmit?: () => void;
  canSubmit?: boolean;
  disabled?: boolean;
}

interface LatinProps extends BaseProps {
  variant: 'en';
}

interface CharGridProps extends BaseProps {
  variant: 'zh';
  chars: string[];
}

type Props = LatinProps | CharGridProps;

const LATIN_ROWS = ['QWERTYUIOP', 'ASDFGHJKL', 'ZXCVBNM'];

export function Keyboard(props: Props) {
  const t = useT();
  const handle = (ch: string) => {
    audio.tap();
    props.onKey(ch);
  };
  const backspace = () => {
    audio.tap();
    props.onBackspace();
  };
  const submit = () => {
    audio.tap();
    props.onSubmit?.();
  };

  const Key = ({
    label,
    onClick,
    wide = false,
    accent,
    disabled,
  }: {
    label: React.ReactNode;
    onClick: () => void;
    wide?: boolean;
    accent?: 'red' | 'green';
    disabled?: boolean;
  }) => (
    <motion.button
      type="button"
      whileTap={{ y: 3, scale: 0.96 }}
      disabled={disabled}
      onClick={onClick}
      className={clsx(
        'no-select rounded-2xl font-bold text-xl sm:text-2xl flex items-center justify-center bg-white border-2 border-ink/10 shadow-keycap select-none',
        'min-h-12 sm:min-h-14',
        wide ? 'px-4' : 'w-10 sm:w-11',
        'h-12 sm:h-14',
        accent === 'green' && 'bg-mint-main text-white border-mint-deep',
        accent === 'red' && 'bg-candy-soft text-candy-deep border-candy-deep',
        disabled && 'opacity-40 pointer-events-none',
      )}
    >
      {label}
    </motion.button>
  );

  if (props.variant === 'en') {
    return (
      <div className={clsx('flex flex-col items-center gap-2', props.disabled && 'opacity-60 pointer-events-none')}>
        {LATIN_ROWS.map((row, idx) => (
          <div key={idx} className="flex gap-1.5 sm:gap-2 justify-center">
            {idx === 2 && (
              <Key label="⌫" wide onClick={backspace} accent="red" />
            )}
            {row.split('').map((ch) => (
              <Key key={ch} label={ch} onClick={() => handle(ch)} />
            ))}
            {idx === 2 && (
              <Key
                label={t('submit')}
                wide
                onClick={submit}
                accent="green"
                disabled={!props.canSubmit}
              />
            )}
          </div>
        ))}
      </div>
    );
  }

  // Chinese: grid of plausible characters
  return (
    <div className={clsx('flex flex-col items-center gap-3', props.disabled && 'opacity-60 pointer-events-none')}>
      <div className="grid grid-cols-6 gap-2 sm:gap-3">
        {props.chars.map((ch, i) => (
          <Key key={`${ch}-${i}`} label={ch} onClick={() => handle(ch)} />
        ))}
      </div>
      <div className="flex gap-2">
        <Key label="⌫" wide onClick={backspace} accent="red" />
        <Key
          label={t('submit')}
          wide
          onClick={submit}
          accent="green"
          disabled={!props.canSubmit}
        />
      </div>
    </div>
  );
}
