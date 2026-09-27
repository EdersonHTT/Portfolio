function initScrollReveal() {
  const targets = document.querySelectorAll('.reveal');
  if (!targets.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target); // anima só uma vez
      }
    });
  }, { threshold: 0.2 });

  targets.forEach(el => observer.observe(el));
}

export { initScrollReveal };