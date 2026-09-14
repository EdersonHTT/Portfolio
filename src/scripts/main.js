
import { initFixedNav } from './components/initFixedNav.js';
import { initProjectsCarousel } from './components/projectsLoad.js';
import { initScrollReveal } from './components/scrollReveal.js';
import { initToolsCarousel } from './components/toolsCarousel.js';

document.addEventListener('DOMContentLoaded', () => {
  initFixedNav();
  initProjectsCarousel();
  initScrollReveal();
  initToolsCarousel();
});
