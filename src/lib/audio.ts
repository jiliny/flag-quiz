let ctx: AudioContext | null = null;

function getCtx(): AudioContext | null {
  if (typeof window === 'undefined') return null;
  if (!ctx) {
    const W = window as typeof window & { webkitAudioContext?: typeof AudioContext };
    const AC = window.AudioContext || W.webkitAudioContext;
    if (!AC) return null;
    ctx = new AC();
  }
  if (ctx.state === 'suspended') {
    void ctx.resume();
  }
  return ctx;
}

function tone(
  freq: number,
  duration: number,
  options: { type?: OscillatorType; gain?: number; delay?: number } = {},
) {
  const c = getCtx();
  if (!c) return;
  const { type = 'triangle', gain = 0.08, delay = 0 } = options;
  const start = c.currentTime + delay;
  const osc = c.createOscillator();
  const g = c.createGain();
  osc.type = type;
  osc.frequency.setValueAtTime(freq, start);
  g.gain.setValueAtTime(0, start);
  g.gain.linearRampToValueAtTime(gain, start + 0.01);
  g.gain.exponentialRampToValueAtTime(0.0001, start + duration);
  osc.connect(g).connect(c.destination);
  osc.start(start);
  osc.stop(start + duration + 0.05);
}

let soundEnabled = true;
export function setSoundEnabled(v: boolean) {
  soundEnabled = v;
}

export const audio = {
  unlockUserGesture() {
    getCtx();
  },
  tap() {
    if (!soundEnabled) return;
    tone(700, 0.06, { type: 'sine', gain: 0.06 });
  },
  correct() {
    if (!soundEnabled) return;
    tone(523.25, 0.12, { type: 'triangle', gain: 0.1 });
    tone(659.25, 0.12, { type: 'triangle', gain: 0.1, delay: 0.08 });
    tone(783.99, 0.18, { type: 'triangle', gain: 0.12, delay: 0.16 });
  },
  wrong() {
    if (!soundEnabled) return;
    tone(220, 0.12, { type: 'square', gain: 0.08 });
    tone(165, 0.14, { type: 'square', gain: 0.06, delay: 0.05 });
  },
  unlock() {
    if (!soundEnabled) return;
    const notes = [523.25, 587.33, 659.25, 783.99, 1046.5];
    notes.forEach((f, i) => tone(f, 0.18, { type: 'triangle', gain: 0.1, delay: i * 0.08 }));
  },
  stamp() {
    if (!soundEnabled) return;
    tone(120, 0.08, { type: 'square', gain: 0.1 });
    tone(880, 0.05, { type: 'triangle', gain: 0.06, delay: 0.05 });
  },
};
