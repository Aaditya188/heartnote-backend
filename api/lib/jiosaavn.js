/**
 * Proxy a request to the JioSaavn API
 * @param {string} path - API path (e.g. "/api/search/songs")
 * @param {Record<string, string>} params - Query parameters
 * @returns {Promise<object>}
 */
export async function jiosaavnFetch(path, params = {}) {
  const base = process.env.JIOSAAVN_BASE_URL;
  if (!base) throw new Error('JIOSAAVN_BASE_URL env variable is not set');

  const url = new URL(path, base);
  for (const [key, value] of Object.entries(params)) {
    if (value !== undefined && value !== null && value !== '') {
      url.searchParams.set(key, value);
    }
  }

  const res = await fetch(url.toString(), {
    headers: {
      'Accept': 'application/json',
      'User-Agent': 'HeartNote/1.0',
    },
  });

  if (!res.ok) {
    throw new Error(`JioSaavn API error: ${res.status} ${res.statusText}`);
  }

  return res.json();
}
