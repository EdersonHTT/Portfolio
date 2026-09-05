import { createDepthCarousel } from './depthCarousel.js';
import { fetchRepos } from '../services/githubApi.js';
import { GITHUB_USERNAME, GITHUB_REPOS_LIMIT } from '../config/constants.js';
import { qs } from '../utils/dom.js';

const GITHUB_ICON = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"
  stroke-linecap="round" stroke-linejoin="round">
  <path d="M9 19c-4.3 1.4-4.3-2.5-6-3m12 5v-3.5c0-1 .1-1.4-.5-2 2.8-.3 5.5-1.4 5.5-6a4.6 4.6 0 0 0-1.3-3.2
    4.2 4.2 0 0 0-.1-3.2s-1.1-.3-3.5 1.3a12.3 12.3 0 0 0-6.2 0C6.5 3.3 5.4 3.6 5.4 3.6a4.2 4.2 0 0 0-.1 3.2
    A4.6 4.6 0 0 0 4 10c0 4.6 2.7 5.7 5.5 6-.6.6-.6 1.2-.5 2V21"/>
</svg>`;

function createSkeletonCard() {
  const card = document.createElement('div');
  card.className = 'project-card';
  card.setAttribute('data-card', '');
  card.innerHTML = `
    <div class="pc-top">
      <div class="pc-icon">${GITHUB_ICON}</div>
    </div>
    <div class="skeleton pc-title-sk"></div>
    <div class="skeleton pc-desc-sk"></div>
    <div class="skeleton pc-desc-sk"></div>
    <div class="pc-footer">
      <div class="pc-tags-sk">
        <div class="skeleton tag-sk"></div>
        <div class="skeleton tag-sk"></div>
      </div>
      <div class="skeleton badge-sk"></div>
    </div>
  `;
  return card;
}

function createRepoCard(repo) {
  const card = document.createElement('div');
  card.className = 'project-card';
  card.setAttribute('data-card', '');
  card.innerHTML = `
    <div class="pc-top">
      <div class="pc-icon">${GITHUB_ICON}</div>
    </div>
    <div class="pc-title">${repo.name}</div>
    <div class="pc-desc">${repo.description || 'Sem descrição.'}</div>
    <div class="pc-footer">
      <div class="pc-tags">
        <span class="tag">&lt;/&gt; ${repo.language || '—'}</span>
      </div>
      <span class="badge">★ ${repo.stargazers_count}</span>
    </div>
  `;
  return card;
}

export function initProjectsCarousel() {
  const track = qs('#carTrack');
  const upBtn = qs('#carUp');
  const downBtn = qs('#carDown');
  if (!track) return;

  for (let i = 0; i < GITHUB_REPOS_LIMIT; i++) {
    track.appendChild(createSkeletonCard());
  }

  fetchRepos(GITHUB_USERNAME, GITHUB_REPOS_LIMIT)
    .then(repos => {
      track.innerHTML = '';
      repos.forEach(repo => {
        track.appendChild(createRepoCard(repo));
      });

      const { step } = createDepthCarousel(track, { axis: 'y', loop: true });
      upBtn?.addEventListener('click', () => step(-1));
      downBtn?.addEventListener('click', () => step(1));
    })
    .catch(err => {
      console.warn('Não foi possível carregar os repositórios do GitHub:', err);
      createDepthCarousel(track, { axis: 'y', loop: false });
    });
}