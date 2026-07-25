import { test, expect, type Page } from '@playwright/test';
import { waitReady } from './_helpers';

// 1700000000 (seconds) / 1700000000000 (milliseconds) is a known reference
// instant: 2023-11-14T22:13:20.000Z UTC (independently verified with
// `date -u -r 1700000000` and Python's `datetime.utcfromtimestamp` — see
// tests/unit/timestampEngine.test.ts for the same reference used unit-side).
const REF_SECONDS = '1700000000';
const REF_MILLIS = '1700000000000';
const REF_MS = 1_700_000_000_000;
const REF_ISO = '2023-11-14T22:13:20.000Z';
const REF_UTC = '2023-11-14 22:13:20 UTC';

/**
 * The local-time equivalent of `ms`, computed independently in the test
 * process (Node), not imported from the engine under test. Playwright's
 * browsers inherit the host's timezone by default (no `timezoneId` override
 * in playwright.config.ts), so this agrees with what the page itself renders
 * — giving a genuine independent check rather than a tautology.
 */
function datetimeLocalValueOf(ms: number): string {
  const d = new Date(ms);
  const pad = (n: number, w = 2) => String(n).padStart(w, '0');
  const base = `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`;
  const millis = d.getMilliseconds();
  return millis === 0 ? base : `${base}.${String(millis).padStart(3, '0')}`;
}

/**
 * Set the `datetime-local` input's value directly and dispatch a real `input`
 * event, rather than relying on Playwright's own date-locale fill heuristics
 * for this input type — this guarantees the exact string built above (down to
 * the second) reaches the page unmodified.
 */
async function setDatetimeLocal(page: Page, value: string) {
  await page.locator('#datetime-input').evaluate((el, v) => {
    (el as HTMLInputElement).value = v;
    el.dispatchEvent(new Event('input', { bubbles: true }));
  }, value);
}

/** Tracks every request that leaves the local origin (the no-upload covenant, #1). */
function trackExternal(page: Page): string[] {
  const external: string[] = [];
  page.on('request', (req) => {
    const url = req.url();
    if (!url.startsWith('http://localhost:4321') && !url.startsWith('data:') && !url.startsWith('blob:')) {
      external.push(url);
    }
  });
  return external;
}

test.describe('convert', () => {
  test('converts a known Unix timestamp (seconds) to the correct UTC/local date, with no upload', async ({ page }) => {
    const external = trackExternal(page);
    await page.goto('/convert-timestamp/');
    await waitReady(page);

    await page.fill('#timestamp-input', REF_SECONDS);

    await expect(page.getByTestId('result-utc')).toHaveText(REF_UTC);
    await expect(page.getByTestId('result-iso')).toHaveText(REF_ISO);
    await expect(page.getByTestId('result-unix-seconds')).toHaveText(REF_SECONDS);
    await expect(page.getByTestId('result-unix-millis')).toHaveText(REF_MILLIS);

    expect(external, `unexpected cross-origin requests: ${external.join(', ')}`).toHaveLength(0);
  });

  test('auto-detects seconds for a 10-digit timestamp and milliseconds for its 13-digit equivalent', async ({
    page,
  }) => {
    await page.goto('/convert-timestamp/');
    await waitReady(page);

    await page.fill('#timestamp-input', REF_SECONDS); // 10 digits
    await expect(page.locator('#timestamp-help')).toContainText(/seconds/i);
    await expect(page.locator('#timestamp-help')).toContainText('10');
    const isoFromSeconds = await page.getByTestId('result-iso').textContent();

    await page.fill('#timestamp-input', REF_MILLIS); // 13 digits
    await expect(page.locator('#timestamp-help')).toContainText(/milliseconds/i);
    await expect(page.locator('#timestamp-help')).toContainText('13');
    const isoFromMillis = await page.getByTestId('result-iso').textContent();

    expect(isoFromSeconds).toBe(REF_ISO);
    expect(isoFromMillis).toBe(REF_ISO);
  });

  test('round trip: converts a specific date back to a Unix timestamp', async ({ page }) => {
    await page.goto('/convert-timestamp/');
    await waitReady(page);

    // Enter the reference instant from the *date* side (not the timestamp
    // side) and confirm the tool derives the exact same timestamp back.
    await setDatetimeLocal(page, datetimeLocalValueOf(REF_MS));

    await expect(page.getByTestId('result-unix-seconds')).toHaveText(REF_SECONDS);
    await expect(page.getByTestId('result-unix-millis')).toHaveText(REF_MILLIS);
    await expect(page.getByTestId('result-iso')).toHaveText(REF_ISO);

    // The timestamp field mirrors the derived value too (bidirectional).
    await expect(page.locator('#timestamp-input')).toHaveValue(REF_SECONDS);
  });

  test('the timestamp field also mirrors a date entered on the datetime side, and vice versa', async ({ page }) => {
    await page.goto('/convert-timestamp/');
    await waitReady(page);

    await page.fill('#timestamp-input', REF_SECONDS);
    await expect(page.locator('#datetime-input')).toHaveValue(datetimeLocalValueOf(REF_MS));
  });

  test('the "Now" button fills the current Unix timestamp in seconds', async ({ page }) => {
    await page.goto('/convert-timestamp/');
    await waitReady(page);

    const before = Math.floor(Date.now() / 1000);
    await page.click('#now-button');
    const value = await page.locator('#timestamp-input').inputValue();
    const after = Math.floor(Date.now() / 1000);

    expect(value).toMatch(/^\d{10}$/);
    const n = Number(value);
    expect(n).toBeGreaterThanOrEqual(before);
    expect(n).toBeLessThanOrEqual(after + 1);
  });

  test('shows Local time and UTC side by side, with no timezone selector anywhere on the page', async ({ page }) => {
    await page.goto('/convert-timestamp/');
    await waitReady(page);
    await page.fill('#timestamp-input', REF_SECONDS);

    await expect(page.getByTestId('result-local')).toBeVisible();
    await expect(page.getByTestId('result-utc')).toBeVisible();
    // Confirmed design: a timezone selector/dropdown is explicitly out of scope.
    await expect(page.locator('select')).toHaveCount(0);
  });

  test('shows a relative-time string for a past timestamp', async ({ page }) => {
    await page.goto('/convert-timestamp/');
    await waitReady(page);
    await page.fill('#timestamp-input', REF_SECONDS); // firmly in the past
    await expect(page.getByTestId('result-relative')).toContainText(/ago/i);
  });

  test('Clear empties both fields and returns the result panel to its empty hint', async ({ page }) => {
    await page.goto('/convert-timestamp/');
    await waitReady(page);
    await page.fill('#timestamp-input', REF_SECONDS);
    await expect(page.getByTestId('result-iso')).toBeVisible();

    await page.getByRole('button', { name: /clear/i }).click();
    await expect(page.locator('#timestamp-input')).toHaveValue('');
    await expect(page.locator('#datetime-input')).toHaveValue('');
    await expect(page.getByTestId('result-iso')).toHaveCount(0);
  });

  test('rejects non-integer and over-long timestamp input with a visible error', async ({ page }) => {
    await page.goto('/convert-timestamp/');
    await waitReady(page);

    await page.fill('#timestamp-input', 'abc');
    await expect(page.getByTestId('timestamp-error')).toBeVisible();

    await page.fill('#timestamp-input', '12345678901234'); // 14 digits — outside the confirmed range
    await expect(page.getByTestId('timestamp-error')).toBeVisible();
  });

  test('copies the ISO 8601 value to the clipboard', async ({ page, context, browserName }) => {
    test.skip(browserName !== 'chromium', 'clipboard-read permission is Chromium-only');
    await context.grantPermissions(['clipboard-read', 'clipboard-write']);
    await page.goto('/convert-timestamp/');
    await waitReady(page);
    await page.fill('#timestamp-input', REF_SECONDS);

    await page.getByRole('button', { name: /copy/i }).nth(2).click(); // seconds, millis, iso — the ISO row's copy button
    const clipboard = await page.evaluate(() => navigator.clipboard.readText());
    expect(clipboard).toBe(REF_ISO);
  });
});
