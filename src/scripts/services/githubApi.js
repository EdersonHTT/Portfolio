const BASE_URL = 'https://api.github.com';

export async function fetchRepos(username, limit = 5) {
  const res = await fetch(`${BASE_URL}/users/${username}/repos?sort=updated&per_page=${limit}`);
  if (!res.ok) {
    throw new Error('Falha ao buscar repositórios do GitHub');
  }
  return res.json();
}
