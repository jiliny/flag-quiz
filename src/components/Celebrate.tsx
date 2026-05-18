import confetti from 'canvas-confetti';

export function celebrateAt(el?: HTMLElement | null) {
  const rect = el?.getBoundingClientRect();
  const origin = rect
    ? { x: (rect.left + rect.width / 2) / window.innerWidth, y: (rect.top + rect.height / 2) / window.innerHeight }
    : { x: 0.5, y: 0.5 };
  confetti({
    particleCount: 70,
    spread: 70,
    startVelocity: 38,
    origin,
    scalar: 0.9,
    colors: ['#3FB6FF', '#3DD58A', '#FFC23C', '#FF6FA3', '#FFFFFF'],
  });
}

export function bigCelebrate() {
  const duration = 1400;
  const end = Date.now() + duration;
  const palette = ['#3FB6FF', '#3DD58A', '#FFC23C', '#FF6FA3', '#FFFFFF'];
  (function frame() {
    confetti({
      particleCount: 6,
      angle: 60,
      spread: 60,
      origin: { x: 0, y: 0.6 },
      colors: palette,
    });
    confetti({
      particleCount: 6,
      angle: 120,
      spread: 60,
      origin: { x: 1, y: 0.6 },
      colors: palette,
    });
    if (Date.now() < end) requestAnimationFrame(frame);
  })();
}
