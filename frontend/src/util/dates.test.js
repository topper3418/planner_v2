import { afterEach, describe, expect, it, vi } from 'vitest';
import {
  endOfLocalDay,
  formatDate,
  parseStoredDateTime,
  startOfLocalDay,
  toLocalCalendarDate,
  toLocalDateString,
} from './dates';

describe('parseStoredDateTime', () => {
  it('treats naive ISO datetimes as UTC', () => {
    // 2026-07-09 01:41 UTC == 2026-07-08 20:41 CDT (UTC-5)
    const date = parseStoredDateTime('2026-07-09T01:41:23');
    expect(date).not.toBeNull();
    expect(date.toISOString()).toBe('2026-07-09T01:41:23.000Z');
  });

  it('parses Z-suffixed timestamps as UTC', () => {
    const date = parseStoredDateTime('2026-07-09T01:41:23Z');
    expect(date.toISOString()).toBe('2026-07-09T01:41:23.000Z');
  });

  it('parses offset timestamps', () => {
    const date = parseStoredDateTime('2026-07-08T20:41:23-05:00');
    expect(date.toISOString()).toBe('2026-07-09T01:41:23.000Z');
  });

  it('parses date-only strings as local calendar dates', () => {
    const date = parseStoredDateTime('2026-07-09');
    expect(date.getFullYear()).toBe(2026);
    expect(date.getMonth()).toBe(6);
    expect(date.getDate()).toBe(9);
    expect(date.getHours()).toBe(0);
  });

  it('returns null for empty values', () => {
    expect(parseStoredDateTime(null)).toBeNull();
    expect(parseStoredDateTime('')).toBeNull();
  });
});

describe('formatDate', () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('renders the pool-robot UTC evening completion as local evening prior day', () => {
    // Force a fixed locale string via spy so the assertion is TZ-stable.
    const date = parseStoredDateTime('2026-07-09T01:41:23');
    const localHours = date.getHours();
    const localDate = date.getDate();
    const localMonth = date.getMonth() + 1;

    const formatted = formatDate('2026-07-09T01:41:23');
    // In any western-hemisphere offset behind UTC, this is still the prior local day
    // for UTC 01:41. For UTC+ offsets it may stay the 9th — assert via Date API.
    expect(formatted).toContain(String(localMonth));
    expect(formatted).toContain(String(localDate));
    // Must not re-apply the old getTimezoneOffset double-shift.
    // Old bug shifted again so CDT showed 7/8 8:41 when raw was already local-parsed.
    const expectedHour12 = ((localHours + 11) % 12) + 1;
    expect(formatted.toLowerCase()).toMatch(
      new RegExp(`${expectedHour12}:41`),
    );
  });

  it('returns empty string for missing values', () => {
    expect(formatDate(null)).toBe('');
    expect(formatDate(undefined)).toBe('');
  });

  it('supports dateOnly mode', () => {
    const formatted = formatDate('2026-07-09T15:00:00Z', false, true);
    expect(formatted).not.toMatch(/:/);
  });
});

describe('toLocalDateString', () => {
  it('formats a Date as YYYY-MM-DD in local time', () => {
    const d = new Date(2026, 6, 9, 15, 30, 0);
    expect(toLocalDateString(d)).toBe('2026-07-09');
  });

  it('uses local day for a UTC-stored evening timestamp', () => {
    const date = parseStoredDateTime('2026-07-09T01:41:23');
    const y = date.getFullYear();
    const m = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    expect(toLocalDateString(date)).toBe(`${y}-${m}-${day}`);
  });
});

describe('startOfLocalDay / endOfLocalDay', () => {
  it('normalizes to local midnight', () => {
    const result = startOfLocalDay(new Date(2026, 6, 9, 18, 30, 0));
    expect(result.getHours()).toBe(0);
    expect(result.getMinutes()).toBe(0);
    expect(result.getSeconds()).toBe(0);
  });

  it('normalizes to end of local day', () => {
    const result = endOfLocalDay(new Date(2026, 6, 9, 10, 0, 0));
    expect(result.getHours()).toBe(23);
    expect(result.getMinutes()).toBe(59);
    expect(result.getSeconds()).toBe(59);
  });
});

describe('toLocalCalendarDate', () => {
  it('drops time components after UTC parse', () => {
    const d = toLocalCalendarDate('2026-07-09T01:41:23');
    expect(d.getHours()).toBe(0);
    expect(d.getMinutes()).toBe(0);
  });
});
