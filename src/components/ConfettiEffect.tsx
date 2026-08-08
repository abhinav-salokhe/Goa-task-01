import confetti from 'canvas-confetti';

export function triggerConfetti(): void {
  const colors = ['#FF2B78', '#FFD21F', '#FF7A18', '#52B788', '#00D9FF'];

  confetti({
    particleCount: 80,
    spread: 60,
    origin: { y: 0.7 },
    colors,
    disableForReducedMotion: true,
  });

  setTimeout(() => {
    confetti({
      particleCount: 40,
      angle: 60,
      spread: 45,
      origin: { x: 0, y: 0.7 },
      colors,
      disableForReducedMotion: true,
    });
  }, 200);

  setTimeout(() => {
    confetti({
      particleCount: 40,
      angle: 120,
      spread: 45,
      origin: { x: 1, y: 0.7 },
      colors,
      disableForReducedMotion: true,
    });
  }, 400);
}

export function ConfettiEffect() {
  return null;
}
