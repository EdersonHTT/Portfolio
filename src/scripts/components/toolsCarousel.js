export function initToolsCarousel() {
  const stage = document.querySelector('.tools-stage');
  const track = document.querySelector('#toolsTrack');
  const cards = track ? Array.from(track.querySelectorAll('.tool-card[data-tool]')) : [];

  if (!stage || !track || cards.length === 0) return;

  const baseRadius = 750;
  const spacingFactor = 3.4;
  const speed = 22;
  let offset = 0;
  let stageHeight;
  let step;
  let cycle;
  let radius;
  let isDragging = false;
  let wasPlayingBeforeDrag = true;
  let startY = 0;
  let startOffset = 0;
  let lastTime = null;
  let isPlaying = true;

  const mod = (value, divisor) => ((value % divisor) + divisor) % divisor;

  function measure() {
    stageHeight = stage.clientHeight;
    step = (stageHeight / cards.length) * spacingFactor;
    cycle = step * cards.length;
    const cardWidth = cards[0].offsetWidth;
    const availableWidth = stage.clientWidth / 2 - cardWidth / 2 - 8;

    radius = Math.min(baseRadius, Math.max(availableWidth * 2, 40));
    draw();
  }

  function draw() {
    if (!cycle) return;

    cards.forEach((card, index) => {
      const baseY = index * step;
      const y = mod(baseY + offset, cycle) - cycle / 2;
      const normalizedY = y / (cycle / 2);
      const maxAngle = 88;
      const angle = normalizedY * maxAngle * Math.PI / 180;
      const x = -radius * Math.cos(angle) + radius / 2;
      const opacity = Math.max((1 - Math.min(Math.abs(normalizedY), 1)) * 1.15, 0);

      card.style.transform = `translate(${x}px, ${y}px)`;
      card.style.opacity = opacity.toFixed(2);
      card.style.zIndex = 100 - Math.round(Math.abs(y));
    });
  }

  function animate(time) {
    if (lastTime === null) lastTime = time;
    const delta = (time - lastTime) / 1000;
    lastTime = time;

    if (isPlaying && !isDragging) {
      offset += speed * delta;
      draw();
    }

    requestAnimationFrame(animate);
  }

  function startDrag(event) {
    isDragging = true;
    wasPlayingBeforeDrag = isPlaying;
    isPlaying = false;
    startY = event.clientY;
    startOffset = offset;
    stage.classList.add('is-dragging');
    stage.setPointerCapture(event.pointerId);
  }

  function moveDrag(event) {
    if (!isDragging) return;
    offset = startOffset + event.clientY - startY;
    draw();
  }

  function endDrag(event) {
    if (!isDragging) return;
    isDragging = false;
    isPlaying = wasPlayingBeforeDrag;
    stage.classList.remove('is-dragging');
    stage.releasePointerCapture?.(event.pointerId);
  }

  stage.addEventListener('pointerdown', startDrag);
  stage.addEventListener('pointermove', moveDrag);
  stage.addEventListener('pointerup', endDrag);
  stage.addEventListener('pointercancel', endDrag);
  window.addEventListener('resize', measure);

  measure();
  requestAnimationFrame(animate);
}