import { readFileSync, readdirSync, statSync } from 'node:fs';
import { join, relative } from 'node:path';
import { describe, expect, it } from 'vitest';

const SRC_ROOT = join(process.cwd(), 'src');

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

function usesApiBaseHelper(source) {
  return /withApiBase|buildApiUrl/.test(source);
}

function isUtilHookFile(relativePath) {
  return relativePath.startsWith('api/util/');
}

describe('subpath-safe API requests', () => {
  it('routes every direct fetch() through withApiBase or buildApiUrl', () => {
    const violations = [];

    for (const filePath of collectSourceFiles(SRC_ROOT)) {
      const relativePath = relative(SRC_ROOT, filePath);
      const source = readFileSync(filePath, 'utf8');

      if (!/\bfetch\s*\(/.test(source)) {
        continue;
      }

      if (isUtilHookFile(relativePath)) {
        continue;
      }

      if (!usesApiBaseHelper(source)) {
        violations.push(`${relativePath}: fetch() without withApiBase/buildApiUrl`);
      }
    }

    expect(violations).toEqual([]);
  });

  it('does not build /api URLs with new URL() unless using buildApiUrl', () => {
    const violations = [];

    for (const filePath of collectSourceFiles(SRC_ROOT)) {
      const relativePath = relative(SRC_ROOT, filePath);
      const source = readFileSync(filePath, 'utf8');

      if (!/new URL\([^)]*['"`]\/api/.test(source)) {
        continue;
      }

      if (!usesApiBaseHelper(source)) {
        violations.push(`${relativePath}: new URL(/api...) without buildApiUrl`);
      }
    }

    expect(violations).toEqual([]);
  });
});