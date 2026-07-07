import { afterEach, describe, expect, it, vi } from 'vitest';

describe('withApiBase', () => {
  afterEach(() => {
    vi.resetModules();
  });

  it('prepends the deployed API prefix for /api paths', async () => {
    vi.stubEnv('VITE_API_BASE_URL', '/apps/planner-v2/api');
    const { withApiBase } = await import('./config.js');
    expect(withApiBase('/api/tickets')).toBe('/apps/planner-v2/api/tickets');
  });

  it('keeps dev-style /api fallback when no deploy prefix is set', async () => {
    vi.stubEnv('VITE_API_BASE_URL', '');
    const { withApiBase } = await import('./config.js');
    expect(withApiBase('/api/tickets/count')).toBe('/api/tickets/count');
  });

  it('buildApiUrl returns an absolute URL with the deployed API prefix', async () => {
    vi.stubEnv('VITE_API_BASE_URL', '/apps/planner-v2/api');
    const { buildApiUrl } = await import('./config.js');
    const url = buildApiUrl('/api/things/tree');
    expect(url.pathname).toBe('/apps/planner-v2/api/things/tree');
  });
});

describe('apiFetch', () => {
  afterEach(() => {
    vi.resetModules();
    vi.unstubAllGlobals();
  });

  it('resolves /api paths through the deploy prefix before fetching', async () => {
    vi.stubEnv('VITE_API_BASE_URL', '/apps/planner-v2/api');
    const fetchMock = vi.fn(async () => ({
      ok: true,
      status: 200,
      json: async () => ({ data: [] }),
    }));
    vi.stubGlobal('fetch', fetchMock);

    const { apiFetch } = await import('./util/apiFetch.js');
    await apiFetch('/api/things/tree');

    expect(fetchMock).toHaveBeenCalledOnce();
    expect(String(fetchMock.mock.calls[0][0])).toContain('/apps/planner-v2/api/things/tree');
  });
});