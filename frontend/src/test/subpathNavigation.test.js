import { readFileSync, readdirSync, statSync } from 'node:fs';
import { join, relative } from 'node:path';
import { describe, expect, it } from 'vitest';

const SRC_ROOT = join(process.cwd(), 'src');

const FORBIDDEN_PATTERNS = [
  {
    name: 'window.location.href assignment',
    pattern: /window\.location\.href\s*=/,
  },
  {
    name: 'window.location.assign',
    pattern: /window\.location\.assign\s*\(/,
  },
  {
    name: 'window.location.replace',
    pattern: /window\.location\.replace\s*\(/,
  },
];

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

describe('subpath-safe navigation', () => {
  it('does not bypass React Router basename in frontend source', () => {
    const violations = [];

    for (const filePath of collectSourceFiles(SRC_ROOT)) {
      const source = readFileSync(filePath, 'utf8');
      for (const { name, pattern } of FORBIDDEN_PATTERNS) {
        if (pattern.test(source)) {
          violations.push(`${relative(SRC_ROOT, filePath)}: ${name}`);
        }
      }
    }

    expect(violations).toEqual([]);
  });
});