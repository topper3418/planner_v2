import { buildApiUrl } from '../config';

export async function apiFetch(pathOrUrl, options = {}) {
  const { json = true, errorPrefix = 'HTTP error', ...fetchOptions } = options;
  const url = pathOrUrl instanceof URL ? pathOrUrl : buildApiUrl(pathOrUrl);
  const headers = { ...fetchOptions.headers };

  if (fetchOptions.body !== undefined && !headers['Content-Type']) {
    headers['Content-Type'] = 'application/json';
  }

  const response = await fetch(url, {
    ...fetchOptions,
    headers,
  });

  if (!response.ok) {
    throw new Error(`${errorPrefix}! status: ${response.status}`);
  }

  if (!json || response.status === 204) {
    return null;
  }

  return response.json();
}