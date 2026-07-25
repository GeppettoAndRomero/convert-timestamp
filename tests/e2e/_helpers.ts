import { type Page, expect } from '@playwright/test';

/** Wait until the island has hydrated and is ready for input. */
export async function waitReady(page: Page) {
  await page.waitForFunction(() => (window as Record<string, unknown>).__toolReady === true);
}

// A fixed, deterministic reference timestamp used by covenant/i18n/a11y specs that
// just need *a* real conversion to run, not to assert the exact converted value —
// convert.spec.ts asserts the exact reference value in detail.
export const SAMPLE_TIMESTAMP = '1700000000';

/** Fill the timestamp field and wait for the result panel to render. */
export async function convert(page: Page) {
  await page.fill('#timestamp-input', SAMPLE_TIMESTAMP);
  await expect(page.getByTestId('result-iso')).toBeVisible();
}
