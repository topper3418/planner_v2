import { readFileSync, readdirSync, statSync } from 'node:fs';
import { join, relative } from 'node:path';
import { describe, expect, it } from 'vitest';

const SRC_ROOT = join(process.cwd(), 'src');
const API_FETCH_FILE = 'api/util/apiFetch.js';

function collectSourceFiles(dir) {
  const files = [];
  for (const entry of readdirSync(dir)) {
    const fullPath = join(dir, entry);
    const stats = statSync(fullPath);
    if (stats.isDirectory()) {
      if (entry === 'test') {
        continue;
      }
      files.push(...collectSourceFiles(fullPath));
      continue;
    }
    if (/\.(jsx?|tsx?)$/.test(entry) && !/\.test\.(jsx?|tsx?)$/.test(entry)) {
      files.push(fullPath);
    }
  }
  return files;
}

function isAllowedFetchFile(relativePath) {
  return relativePath === API_FETCH_FILE;
}

function usesApiClient(source) {
  return /apiFetch|useMutation|useFetch|useFetchOne|useFetchCount|useCreate|useUpdate|useDelete|apiUtils/.test(source);
}

describe('subpath-safe API requests', () => {
  it('keeps raw fetch() inside apiFetch only', () => {
    const violations = [];

    for (const filePath of collectSourceFiles(SRC_ROOT)) {
      const relativePath = relative(SRC_ROOT, filePath);
      const source = readFileSync(filePath, 'utf8');

      if (!/\bfetch\s*\(/.test(source)) {
        continue;
      }

      if (!isAllowedFetchFile(relativePath)) {
        violations.push(`${relativePath}: raw fetch() must go through apiFetch`);
      }
    }

    expect(violations).toEqual([]);
  });

  it('routes API modules through the shared client helpers', () => {
    const violations = [];

    for (const filePath of collectSourceFiles(join(SRC_ROOT, 'api'))) {
      const relativePath = relative(SRC_ROOT, filePath);
      if (relativePath === API_FETCH_FILE || relativePath.startsWith('api/util/')) {
        continue;
      }
      if (relativePath === 'api/config.js' || relativePath === 'api/index.js') {
        continue;
      }

      const source = readFileSync(filePath, 'utf8');
      if (!usesApiClient(source)) {
        violations.push(`${relativePath}: API module not using shared client`);
      }
    }

    expect(violations).toEqual([]);
  });
});