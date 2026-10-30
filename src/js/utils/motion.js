import { animate, stagger } from 'animejs';

const MAX_STAGGERED_ITEMS = 12;

function prefersReducedMotion() {
  return window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
}

// Daftar muncul bertahap saat dimuat (hanya beberapa item pertama agar tetap cepat).
export function animateListIn(items) {
  if (prefersReducedMotion() || items.length === 0) return;

  animate(items.slice(0, MAX_STAGGERED_ITEMS), {
    opacity: [0, 1],
    translateY: [14, 0],
    duration: 450,
    delay: stagger(50),
    ease: 'outCubic',
  });
}

// Catatan baru "mendarat" di posisi teratas.
export function animateEnter(item) {
  if (prefersReducedMotion() || !item) return;

  animate(item, {
    opacity: [0, 1],
    scale: [0.9, 1],
    translateY: [-12, 0],
    duration: 480,
    ease: 'outBack',
  });
}
