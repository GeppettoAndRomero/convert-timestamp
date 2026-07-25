/**
 * Unix timestamp <-> date/time conversion engine. Pure functions, no I/O,
 * native `Date` / `Intl` only — no external library (confirmed scope, issue #74).
 *
 * Digit-count auto-detection (confirmed scope): a timestamp text field is
 * interpreted as **seconds** when it has 10 or fewer digits, and as
 * **milliseconds** when it has 11-13 digits. Digit count is taken from the
 * absolute value (a leading `-` for a pre-1970 timestamp does not count).
 * 14+ digits is out of the confirmed range and rejected with a clear error
 * rather than silently guessing a unit.
 *
 * Timezone handling (confirmed scope): there is no timezone selector. Every
 * converted result exposes both a local-time rendering and a UTC rendering,
 * computed independently from the same epoch millisecond value, so the caller
 * can always show both side by side.
 */

export type TimestampUnit = 'seconds' | 'milliseconds';

export type EngineErrorCode = 'empty' | 'not-integer' | 'too-many-digits' | 'invalid-datetime';

export interface EngineError {
  code: EngineErrorCode;
}

export type EngineResult<T> = { ok: true; value: T } | { ok: false; error: EngineError };

/** Digit count of the integer's magnitude (sign excluded). */
function digitCount(absValueText: string): number {
  return absValueText.length;
}

/**
 * Parse a Unix-timestamp text field into an epoch millisecond value, using
 * digit-count to auto-detect seconds vs milliseconds:
 *   - 1-10 digits  -> seconds
 *   - 11-13 digits -> milliseconds
 *   - 14+ digits   -> rejected (outside the confirmed scope)
 *
 * Only an optional leading `-` and digits are accepted (no decimals, no
 * whitespace, no thousands separators) — the field is a plain integer.
 */
export function parseTimestampInput(raw: string): EngineResult<{ ms: number; unit: TimestampUnit }> {
  const trimmed = raw.trim();
  if (trimmed === '') return { ok: false, error: { code: 'empty' } };
  if (!/^-?\d+$/.test(trimmed)) return { ok: false, error: { code: 'not-integer' } };

  const negative = trimmed.startsWith('-');
  const digits = negative ? trimmed.slice(1) : trimmed;
  const count = digitCount(digits);
  if (count > 13) return { ok: false, error: { code: 'too-many-digits' } };

  const unit: TimestampUnit = count <= 10 ? 'seconds' : 'milliseconds';
  const value = Number(trimmed);
  const ms = unit === 'seconds' ? value * 1000 : value;
  // No further range check: 13 digits is at most ~9.999999999999e12 ms, and
  // milliseconds*1000 for a 10-digit second count is at most ~9.999999999e12
  // ms too — both are far inside the +/-8.64e15 range `Date` can represent, so
  // the digit-count cap already guarantees a representable date.
  return { ok: true, value: { ms, unit } };
}

/**
 * Parse an `<input type="datetime-local">` value (`YYYY-MM-DDTHH:mm[:ss[.sss]]`,
 * no timezone) into an epoch millisecond value. Per the ECMA-262 Date Time
 * String Format, a date-time string with a `T` separator and no offset is
 * interpreted in **local** time (unlike a date-only string, which is UTC) —
 * this is exactly the native-`Date` behaviour the confirmed scope relies on.
 */
export function parseDatetimeLocalInput(raw: string): EngineResult<{ ms: number }> {
  if (raw.trim() === '') return { ok: false, error: { code: 'empty' } };
  const date = new Date(raw);
  const ms = date.getTime();
  if (Number.isNaN(ms)) return { ok: false, error: { code: 'invalid-datetime' } };
  return { ok: true, value: { ms } };
}

/** Current time as a Unix timestamp in whole seconds, for the "Now" button. */
export function nowTimestampSeconds(): number {
  return Math.floor(Date.now() / 1000);
}

function pad(n: number, width = 2): string {
  return String(n).padStart(width, '0');
}

/** `YYYY-MM-DD HH:mm:ss` using the given per-field accessors (local or UTC). */
function formatParts(
  ms: number,
  get: 'local' | 'utc'
): string {
  const d = new Date(ms);
  const year = get === 'local' ? d.getFullYear() : d.getUTCFullYear();
  const month = get === 'local' ? d.getMonth() + 1 : d.getUTCMonth() + 1;
  const day = get === 'local' ? d.getDate() : d.getUTCDate();
  const hours = get === 'local' ? d.getHours() : d.getUTCHours();
  const minutes = get === 'local' ? d.getMinutes() : d.getUTCMinutes();
  const seconds = get === 'local' ? d.getSeconds() : d.getUTCSeconds();
  return `${year}-${pad(month)}-${pad(day)} ${pad(hours)}:${pad(minutes)}:${pad(seconds)}`;
}

/** `YYYY-MM-DD HH:mm:ss` in the browser's local timezone. */
export function formatLocal(ms: number): string {
  return formatParts(ms, 'local');
}

/** `YYYY-MM-DD HH:mm:ss` in UTC. */
export function formatUtc(ms: number): string {
  return formatParts(ms, 'utc');
}

/**
 * A short local-timezone label, e.g. `UTC+9` or `UTC-5:30`, plus the IANA zone
 * name when the runtime exposes one (e.g. `Asia/Tokyo`). Native `Date` +
 * `Intl.DateTimeFormat` only (`resolvedOptions().timeZone` is the only Intl
 * surface used here; the offset itself comes from `getTimezoneOffset`).
 */
export function localZoneLabel(ms: number): string {
  const offsetMinutes = -new Date(ms).getTimezoneOffset();
  const sign = offsetMinutes >= 0 ? '+' : '-';
  const abs = Math.abs(offsetMinutes);
  const hh = Math.floor(abs / 60);
  const mm = abs % 60;
  const offsetLabel = mm === 0 ? `UTC${sign}${hh}` : `UTC${sign}${hh}:${pad(mm)}`;
  try {
    const zone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    return zone ? `${offsetLabel} (${zone})` : offsetLabel;
  } catch {
    return offsetLabel;
  }
}

/** ISO 8601 string (`toISOString`), always UTC with a trailing `Z`. */
export function toIso8601(ms: number): string {
  return new Date(ms).toISOString();
}

/** `<input type="datetime-local" step="0.001">` value string, in local time. */
export function toDatetimeLocalValue(ms: number): string {
  const d = new Date(ms);
  const millis = d.getMilliseconds();
  const base = `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`;
  return millis === 0 ? base : `${base}.${String(millis).padStart(3, '0')}`;
}

const RELATIVE_UNITS: Array<[Intl.RelativeTimeFormatUnit, number]> = [
  ['year', 365 * 24 * 60 * 60 * 1000],
  ['month', 30 * 24 * 60 * 60 * 1000],
  ['week', 7 * 24 * 60 * 60 * 1000],
  ['day', 24 * 60 * 60 * 1000],
  ['hour', 60 * 60 * 1000],
  ['minute', 60 * 1000],
  ['second', 1000],
];

/**
 * "3 days ago" / "in 2 hours" via native `Intl.RelativeTimeFormat` — no
 * library. Picks the largest unit that divides the (rounded) difference to at
 * least 1, falling back to seconds for anything under a minute.
 */
export function relativeTimeFrom(ms: number, locale: string, now: number = Date.now()): string {
  const diff = ms - now;
  const abs = Math.abs(diff);
  const rtf = new Intl.RelativeTimeFormat(locale, { numeric: 'auto' });
  for (const [unit, unitMs] of RELATIVE_UNITS) {
    if (abs >= unitMs) {
      return rtf.format(Math.round(diff / unitMs), unit);
    }
  }
  return rtf.format(Math.round(diff / 1000), 'second');
}

/** Epoch seconds, rounded (an epoch-ms value may carry sub-second precision). */
export function toEpochSeconds(ms: number): number {
  return Math.round(ms / 1000);
}
