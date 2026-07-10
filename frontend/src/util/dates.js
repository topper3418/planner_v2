/**
 * Single source of truth for datetime storage and calendar-day interpretation.
 *
 * Storage convention
 * ------------------
 * Timestamps from the API/DB are **naive UTC** (matches SQLite CURRENT_TIMESTAMP).
 *
 * Calendar / display convention
 * -----------------------------
 * User-facing calendar days and labels use the browser's local timezone.
 * Parse stored timestamps as UTC before converting to local for display.
 */

/**
 * Parse a stored/API timestamp into a Date.
 * Naive strings (no Z / offset) are treated as UTC.
 */
export function parseStoredDateTime(value) {
  if (value == null || value === '') {
    return null;
  }
  if (value instanceof Date) {
    return Number.isNaN(value.getTime()) ? null : value;
  }

  const text = String(value).trim();
  if (!text) {
    return null;
  }

  // Already timezone-aware
  if (/[zZ]$/.test(text) || /[+-]\d{2}:\d{2}$/.test(text)) {
    const parsed = new Date(text);
    return Number.isNaN(parsed.getTime()) ? null : parsed;
  }

  // Naive ISO-like datetime → treat as UTC
  if (/^\d{4}-\d{2}-\d{2}T/.test(text)) {
    const parsed = new Date(`${text}Z`);
    return Number.isNaN(parsed.getTime()) ? null : parsed;
  }

  // Date-only YYYY-MM-DD → local calendar date (not a stored UTC instant)
  if (/^\d{4}-\d{2}-\d{2}$/.test(text)) {
    const [year, month, day] = text.split('-').map(Number);
    return new Date(year, month - 1, day);
  }

  const parsed = new Date(text);
  return Number.isNaN(parsed.getTime()) ? null : parsed;
}

/** Local calendar YYYY-MM-DD for a Date (or now). */
export function toLocalDateString(date = new Date()) {
  const d = date instanceof Date ? date : parseStoredDateTime(date);
  if (!d) {
    return null;
  }
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

/** Local calendar date for a stored timestamp (UTC → local day). */
export function toLocalCalendarDate(value) {
  const d = parseStoredDateTime(value);
  if (!d) {
    return null;
  }
  return new Date(d.getFullYear(), d.getMonth(), d.getDate());
}

export function startOfLocalDay(date = new Date()) {
  const d = date instanceof Date ? new Date(date) : parseStoredDateTime(date);
  if (!d) {
    return null;
  }
  d.setHours(0, 0, 0, 0);
  return d;
}

export function endOfLocalDay(date = new Date()) {
  const d = date instanceof Date ? new Date(date) : parseStoredDateTime(date);
  if (!d) {
    return null;
  }
  d.setHours(23, 59, 59, 999);
  return d;
}

/**
 * Format a stored timestamp for display in the user's local timezone.
 */
export function formatDate(dateString, compact = false, dateOnly = false) {
  const date = parseStoredDateTime(dateString);
  if (!date) {
    return '';
  }

  const options = {
    month: 'numeric',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  };
  if (!compact) {
    options.year = 'numeric';
  }

  const dateStringFormatted = date.toLocaleString(undefined, options);
  if (dateOnly) {
    if (compact) {
      const dateParts = dateStringFormatted.split(',')[0].split('/');
      return `${dateParts[0]}/${dateParts[1]}`;
    }
    return dateStringFormatted.split(',')[0];
  }
  return dateStringFormatted;
}
