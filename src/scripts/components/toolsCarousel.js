
export function initToolsCarousel() {
  const stage = document.querySelector('.tools-stage');
  const track = document.getElementById('toolsTrack');
  const btnLeft = document.getElementById('toolsLeft');
  const btnRight = document.getElementById('toolsRight');

  if (!track || !stage) return;

  const originalCards = Array.from(track.children);
  const cardCount = originalCards.length;

  originalCards.forEach(card => {
    track.appendChild(card.cloneNode(true));
  });
  originalCards.slice().reverse().forEach(card => {
    track.insertBefore(card.cloneNode(true), track.firstChild);
  });

  requestAnimationFrame(() => {
    const cardWidth = originalCards[0].getBoundingClientRect().width;
    const gap = parseFloat(getComputedStyle(track).gap) || 0;
    const step = cardWidth + gap;

    track.scrollLeft = step * cardCount;

    function scrollByStep(direction) {
      track.scrollBy({ left: direction * step, behavior: 'smooth' });
    }

    btnRight?.addEventListener('click', () => scrollByStep(1));
    btnLeft?.addEventListener('click', () => scrollByStep(-1));

    track.addEventListener('scroll', () => {
      clearTimeout(track._scrollEndTimer);
      track._scrollEndTimer = setTimeout(() => {
        const min = step * 0.5;
        const max = step * (cardCount * 2 - 0.5);

        if (track.scrollLeft <= min) {
          track.scrollLeft += step * cardCount;
        } else if (track.scrollLeft >= max) {
          track.scrollLeft -= step * cardCount;
        }
      }, 80); 
    });
  });
}
