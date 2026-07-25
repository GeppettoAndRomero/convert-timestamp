import { describe, it, expect } from 'vitest';
import {
  parseTimestampInput,
  parseDatetimeLocalInput,
  formatUtc,
  toIso8601,
  toEpochSeconds,
  toDatetimeLocalValue,
  localZoneLabel,
  relativeTimeFrom,
  nowTimestampSeconds,
} from '@/utils/timestampEngine';

// 1700000000 (seconds) is a known reference instant: 2023-11-14T22:13:20.000Z
// (verified independently with `date -u -r 1700000000` / Python's
// `datetime.utcfromtimestamp`). Every seconds/milliseconds pair below is
// that same instant, just spelled with a different digit count.
const REF_SECONDS = '1700000000'; // 10 digits
const REF_MILLIS = '1700000000000'; // 13 digits
const REF_ISO = '2023-11-14T22:13:20.000Z';

describe('parseTimestampInput', () => {
  it('detects seconds for a 10-digit (or fewer) input', () => {
    const r = parseTimestampInput(REF_SECONDS);
    expect(r).toEqual({ ok: true, value: { ms: 1_700_000_000_000, unit: 'seconds' } });
  });

  it('detects milliseconds for an 11-13 digit input', () => {
    const r = parseTimestampInput(REF_MILLIS);
    expect(r).toEqual({ ok: true, value: { ms: 1_700_000_000_000, unit: 'milliseconds' } });
  });

  it('the seconds and milliseconds forms of the same instant resolve to the same epoch ms', () => {
    const seconds = parseTimestampInput(REF_SECONDS);
    const millis = parseTimestampInput(REF_MILLIS);
    expect(seconds.ok && millis.ok && seconds.value.ms).toBe(millis.ok && millis.value.ms);
    expect(seconds.ok && toIso8601(seconds.value.ms)).toBe(REF_ISO);
    expect(millis.ok && toIso8601(millis.value.ms)).toBe(REF_ISO);
  });

  it('treats the 10/11-digit boundary correctly', () => {
    const ten = parseTimestampInput('1234567890'); // 10 digits -> seconds
    const eleven = parseTimestampInput('12345678901'); // 11 digits -> milliseconds
    expect(ten.ok && ten.value.unit).toBe('seconds');
    expect(eleven.ok && eleven.value.unit).toBe('milliseconds');
  });

  it('handles a negative (pre-1970) timestamp, ignoring the sign for digit count', () => {
    const r = parseTimestampInput('-86400'); // 5 digits -> seconds
    expect(r).toEqual({ ok: true, value: { ms: -86_400_000, unit: 'seconds' } });
    expect(r.ok && toIso8601(r.value.ms)).toBe('1969-12-31T00:00:00.000Z');
  });

  it('rejects an empty input', () => {
    expect(parseTimestampInput('')).toEqual({ ok: false, error: { code: 'empty' } });
    expect(parseTimestampInput('   ')).toEqual({ ok: false, error: { code: 'empty' } });
  });

  it('rejects non-integer input (letters, decimals, thousands separators)', () => {
    expect(parseTimestampInput('abc')).toEqual({ ok: false, error: { code: 'not-integer' } });
    expect(parseTimestampInput('1700000000.5')).toEqual({ ok: false, error: { code: 'not-integer' } });
    expect(parseTimestampInput('1,700,000,000')).toEqual({ ok: false, error: { code: 'not-integer' } });
  });

  it('rejects 14+ digits (outside the confirmed seconds/milliseconds range)', () => {
    expect(parseTimestampInput('12345678901234')).toEqual({ ok: false, error: { code: 'too-many-digits' } });
  });
});

describe('parseDatetimeLocalInput', () => {
  it('interprets a datetime-local value as local time, not UTC', () => {
    const r = parseDatetimeLocalInput('2024-01-15T10:30:00');
    const expected = new Date(2024, 0, 15, 10, 30, 0).getTime();
    expect(r).toEqual({ ok: true, value: { ms: expected } });
  });

  it('accepts millisecond precision', () => {
    const r = parseDatetimeLocalInput('2024-01-15T10:30:00.123');
    const expected = new Date(2024, 0, 15, 10, 30, 0, 123).getTime();
    expect(r).toEqual({ ok: true, value: { ms: expected } });
  });

  it('rejects an empty input', () => {
    expect(parseDatetimeLocalInput('')).toEqual({ ok: false, error: { code: 'empty' } });
  });

  it('rejects a string that Date cannot parse', () => {
    expect(parseDatetimeLocalInput('not-a-date')).toEqual({ ok: false, error: { code: 'invalid-datetime' } });
  });
});

describe('round-trip: date -> timestamp -> date', () => {
  it('converting a specific date to a timestamp and back reproduces the same instant', () => {
    const original = parseDatetimeLocalInput('2024-01-15T10:30:00');
    expect(original.ok).toBe(true);
    if (!original.ok) return;

    const seconds = toEpochSeconds(original.value.ms);
    const reparsed = parseTimestampInput(String(seconds));
    expect(reparsed.ok).toBe(true);
    if (!reparsed.ok) return;

    // Seconds resolution loses no precision here since the source had none.
    expect(reparsed.value.ms).toBe(original.value.ms);
  });

  it('toDatetimeLocalValue -> parseDatetimeLocalInput round-trips exactly, including milliseconds', () => {
    const ms = 1_700_000_000_123;
    const asDatetimeLocal = toDatetimeLocalValue(ms);
    const back = parseDatetimeLocalInput(asDatetimeLocal);
    expect(back).toEqual({ ok: true, value: { ms } });
  });
});

describe('formatUtc / toIso8601', () => {
  it('formats the reference instant in UTC (timezone-independent)', () => {
    expect(formatUtc(1_700_000_000_000)).toBe('2023-11-14 22:13:20');
    expect(toIso8601(1_700_000_000_000)).toBe(REF_ISO);
  });

  it('zero-pads single-digit month/day/hour/minute/second', () => {
    const ms = Date.UTC(2024, 0, 5, 3, 4, 5); // 2024-01-05 03:04:05
    expect(formatUtc(ms)).toBe('2024-01-05 03:04:05');
  });
});

describe('toEpochSeconds', () => {
  it('rounds to the nearest whole second', () => {
    expect(toEpochSeconds(1_700_000_000_000)).toBe(1_700_000_000);
    expect(toEpochSeconds(1_700_000_000_499)).toBe(1_700_000_000);
    expect(toEpochSeconds(1_700_000_000_500)).toBe(1_700_000_001);
  });
});

describe('localZoneLabel', () => {
  it('renders a UTC+/-N offset label (with an optional IANA zone name)', () => {
    expect(localZoneLabel(1_700_000_000_000)).toMatch(/^UTC[+-]\d+(:\d{2})?( \(.+\))?$/);
  });
});

describe('relativeTimeFrom', () => {
  const NOW = Date.UTC(2024, 0, 1, 0, 0, 0);

  it('formats a past instant as "N days ago"', () => {
    const threeDaysAgo = NOW - 3 * 24 * 60 * 60 * 1000;
    expect(relativeTimeFrom(threeDaysAgo, 'en', NOW)).toBe('3 days ago');
  });

  it('formats a future instant as "in N hours"', () => {
    const inTwoHours = NOW + 2 * 60 * 60 * 1000;
    expect(relativeTimeFrom(inTwoHours, 'en', NOW)).toBe('in 2 hours');
  });

  it('localizes to ja', () => {
    const threeDaysAgo = NOW - 3 * 24 * 60 * 60 * 1000;
    expect(relativeTimeFrom(threeDaysAgo, 'ja', NOW)).toContain('3');
  });

  it('falls back to seconds for a sub-second difference ("now")', () => {
    expect(relativeTimeFrom(NOW, 'en', NOW)).toBe('now');
  });
});

describe('nowTimestampSeconds', () => {
  it('matches Date.now() to the second', () => {
    expect(nowTimestampSeconds()).toBe(Math.floor(Date.now() / 1000));
  });
});
