export function createDepthCarousel(track, {
  axis = 'y',
  maxScale = 0.22,
  maxOpacity = 0.75,
  maxBlur = 3,
  maxRotate = 8,
  maxZ = 220,
  loop = false,
} = {}) {
  let items = Array.from(track.children);
  let cardCount = items.length;
  let stepSize = 0;

  if (loop) {
    const originals = items.slice();
    originals.forEach(card => track.appendChild(card.cloneNode(true)));
    originals.slice().reverse().forEach(card => track.insertBefore(card.cloneNode(true), track.firstChild));
    items = Array.from(track.children); 
  }

  function measureStep() {
    const first = (loop ? items[cardCount] : items[0]); 
    if (!first) return 0;
    const rect = first.getBoundingClientRect();
    const gap = parseFloat(getComputedStyle(track).gap) || 0;
    return (axis === 'y' ? rect.height : rect.width) + gap;
  }

  function apply() {
    const stageRect = track.getBoundingClientRect();
    const center = axis === 'y'
      ? stageRect.top + stageRect.height / 2
      : stageRect.left + stageRect.width / 2;
    const maxDist = axis === 'y' ? stageRect.height / 2 : stageRect.width / 2;

    items.forEach(item => {
      const r = item.getBoundingClientRect();
      const itemCenter = axis === 'y' ? r.top + r.height / 2 : r.left + r.width / 2;
      const dist = Math.min(Math.abs(itemCenter - center), maxDist);
      const t = dist / maxDist;

      const scale = 1 - t * maxScale;
      const opacity = 1 - t * maxOpacity;
      const blur = t * maxBlur;
      const z = -t * maxZ;
      const sign = itemCenter < center ? 1 : -1;

      const transform = axis === 'y'
        ? `perspective(1200px) translateZ(${z}px) rotateX(${sign * t * maxRotate}deg) scale(${scale})`
        : `perspective(1200px) translateZ(${z}px) rotateY(${-sign * t * maxRotate}deg) scale(${scale})`;

      item.style.transform = transform;
      item.style.opacity = opacity;
      item.style.filter = `blur(${blur}px)`;
      item.style.zIndex = Math.round((1 - t) * 100);
      item.style.pointerEvents = t > 0.85 ? 'none' : 'auto';
    });
  }

  function step(dir) {
    if (!stepSize) return;
    track.scrollBy(
      axis === 'y' ? { top: stepSize * dir, behavior: 'smooth' } : { left: stepSize * dir, behavior: 'smooth' }
    );
  }

  function correctLoop() {
    if (!loop || !stepSize) return;
    const scrollPos = axis === 'y' ? track.scrollTop : track.scrollLeft;
    const min = stepSize * 0.5;
    const max = stepSize * (cardCount * 2 - 0.5);

    if (scrollPos <= min) {
      const next = scrollPos + stepSize * cardCount;
      axis === 'y' ? (track.scrollTop = next) : (track.scrollLeft = next);
      apply();
    } else if (scrollPos >= max) {
      const next = scrollPos - stepSize * cardCount;
      axis === 'y' ? (track.scrollTop = next) : (track.scrollLeft = next);
      apply();
    }
  }

  let ticking = false;
  track.addEventListener('scroll', () => {
    if (!ticking) {
      requestAnimationFrame(() => { apply(); ticking = false; });
      ticking = true;
    }
    if (loop) {
      clearTimeout(track._loopTimer);
      track._loopTimer = setTimeout(correctLoop, 80);
    }
  });

  function init() {
    stepSize = measureStep();
    if (loop && stepSize) {
      const startPos = stepSize * cardCount;
      axis === 'y' ? (track.scrollTop = startPos) : (track.scrollLeft = startPos);
    }
    apply();
  }

  requestAnimationFrame(init);
  window.addEventListener('resize', () => {
    stepSize = measureStep();
    apply();
  });

  return { apply, step };
}