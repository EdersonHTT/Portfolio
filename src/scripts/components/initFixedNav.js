export function initFixedNav() {
  const nav = document.querySelector('#mainNav');

  if (!nav) return;

  const navPosition = nav.getBoundingClientRect().top + window.scrollY;

  const updateNav = () => {
    nav.classList.toggle('is-fixed', window.scrollY >= navPosition);
  };

  window.addEventListener('scroll', updateNav, { passive: true });
  updateNav();
}