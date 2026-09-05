
import { initProjectsCarousel } from './components/projectsCarousel.js';
import { initScrollReveal } from './components/scrollReveal.js';
import { initToolsCarousel } from './components/toolsCarousel.js';

document.addEventListener('DOMContentLoaded', () => {
  initProjectsCarousel();
  initScrollReveal();
  initToolsCarousel();
});
