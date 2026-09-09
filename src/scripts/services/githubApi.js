const BASE_URL = 'https://api.github.com';

export async function fetchRepos(username) {
  const repos = [];
  let page = 1;

  while (true) {
    const res = await fetch(`${BASE_URL}/users/${username}/repos?sort=updated&per_page=100&page=${page}`);

    if (!res.ok) {
      throw new Error('Falha ao buscar repositórios do GitHub');
    }

    const currentPage = await res.json();
    repos.push(...currentPage);

    if (currentPage.length < 100) {
      return repos;
    }

    page += 1;
  }
}
