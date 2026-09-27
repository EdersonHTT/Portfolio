import { qs } from '../utils/dom.js';
import { fetchRepos } from '../services/githubApi.js';
import { GITHUB_USERNAME } from '../config/constants.js';

const EXTERNAL_LINK_ICON = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"
  stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
  <path d="M14 3h7v7"/>
  <path d="M10 14 21 3"/>
  <path d="M21 14v5a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5"/>
</svg>`;

const STAR_ICON = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"
  stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
  <path d="m12 3 2.8 5.7 6.2.9-4.5 4.4 1.1 6.2-5.6-2.9-5.6 2.9 1.1-6.2L3 9.6l6.2-.9L12 3Z"/>
</svg>`;

const GITHUB_ICON = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"
  stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
  <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"/>
</svg>`;

const FORK_ICON = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"
  stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
  <circle cx="6" cy="5" r="2"/><circle cx="18" cy="5" r="2"/><circle cx="12" cy="19" r="2"/>
  <path d="M6 7v2a4 4 0 0 0 4 4h4a4 4 0 0 0 4-4V7M12 13v4"/>
</svg>`;

const projectsContainer = qs('#projects');
const projectsFrame = projectsContainer.parentElement;

function updateProjectsScrollState() {
  const hasScrollUp = projectsContainer.scrollTop > 0;
  const hasScrollDown = projectsContainer.scrollTop + projectsContainer.clientHeight < projectsContainer.scrollHeight - 1;

  projectsFrame.classList.toggle('has-scroll-up', hasScrollUp);
  projectsFrame.classList.toggle('has-scroll-down', hasScrollDown);
}

export function initProjectsCarousel() {

  projectsContainer.addEventListener('scroll', updateProjectsScrollState, { passive: true });

  fetchRepos(GITHUB_USERNAME)
    .then(repos => {
      projectsContainer.innerHTML = repos.map(repo => `
        <div class="project-card">
          <div class="pc-top">
            <div class="pc-icon">
              ${GITHUB_ICON}
            </div>
            <div class="pc-stats">
              <span class="pc-stat" title="Estrelas">${STAR_ICON}${repo.stargazers_count}</span>
              <span class="pc-stat" title="Forks">${FORK_ICON}${repo.forks_count}</span>
            </div>
          </div>
          <div class="pc-title">${repo.name}</div>
          <p class="pc-desc">${repo.description || 'Sem descrição disponível.'}</p>
          <div class="pc-footer">
            <div class="pc-tags">
              <span class="tag">&lt;/&gt; ${repo.language || 'Não informado'}</span>
            </div>
            <a class="git-link" href="${repo.html_url}" target="_blank" rel="noopener noreferrer" aria-label="Abrir ${repo.name} no GitHub">
              ${EXTERNAL_LINK_ICON}
            </a>
          </div>
        </div>
      `).join('');
      updateProjectsScrollState();
    })
    .catch(err => {
      console.warn('Não foi possível carregar os repositórios do GitHub:', err);
    });
}