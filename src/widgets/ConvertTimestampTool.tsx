/**
 * ConvertTimestampTool — the tool's only non-frozen widget.
 *
 * Two inputs that drive the same conversion (issue #74 — confirmed design):
 *   - a Unix timestamp text field, unit auto-detected from digit count
 *     (<=10 digits = seconds, 11-13 = milliseconds), plus a "Now" button
 *   - a `datetime-local` field (local time, no timezone selector)
 *
 * Whichever field the visitor last typed into becomes the source of truth
 * ("last edited wins"). Once it parses, an effect mirrors the *other* field
 * to match (timestamp -> datetime-local value; datetime -> Unix seconds) —
 * genuinely bidirectional, matching issue #74's "双方向変換" — with no
 * feedback loop, because a programmatic `setState` never re-fires the input's
 * own `input` event that flips `source`. The result panel additionally shows
 * every representation of that one instant regardless of which field drove
 * it: the Unix timestamp itself (seconds and milliseconds, so converting a
 * date back to a timestamp is always visible for round-tripping), Local time
 * and UTC side by side (the confirmed alternative to a timezone selector), an
 * ISO 8601 string, and a relative-time string — all recomputed from (tsInput,
 * dtInput, source) on every render, never cached separately, so the result
 * can never drift from what is on screen (the same pattern as the sibling
 * text tools: format-json's output, compare-text's diff).
 *
 * All conversion is native `Date` / `Intl.RelativeTimeFormat` — no library
 * (confirmed scope) — see `src/utils/timestampEngine.ts`.
 */
import { useState, useEffect, useRef, useCallback, useMemo } from 'preact/hooks';
import { AppCard } from './AppCard';
import { AppButton } from './AppButton';
import { ErrorToast } from './ErrorToast';
import { resolveErrorMessage } from '@/utils/appError';
import {
  parseTimestampInput,
  parseDatetimeLocalInput,
  nowTimestampSeconds,
  formatLocal,
  formatUtc,
  localZoneLabel,
  toIso8601,
  toDatetimeLocalValue,
  relativeTimeFrom,
  toEpochSeconds,
  type EngineErrorCode,
} from '@/utils/timestampEngine';
import { ui } from '@/i18n/ui';

type Source = 'timestamp' | 'datetime' | null;
type CopyKey = 'seconds' | 'millis' | 'iso';

interface ErrorToastItem {
  id: string;
  message: string;
}

interface ConvertTimestampToolProps {
  locale?: string;
}

export function ConvertTimestampTool({ locale = 'en' }: ConvertTimestampToolProps) {
  const t = (ui as any)[locale] ?? ui.en;

  const [tsInput, setTsInput] = useState('');
  const [dtInput, setDtInput] = useState('');
  const [source, setSource] = useState<Source>(null);
  const [copiedKey, setCopiedKey] = useState<CopyKey | null>(null);
  const [errorToasts, setErrorToasts] = useState<ErrorToastItem[]>([]);

  const copyTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const showErrorToast = useCallback((message: string) => {
    const id = `error-${Date.now()}-${Math.random().toString(36).slice(2, 11)}`;
    setErrorToasts((prev) => [...prev, { id, message }]);
  }, []);
  const removeErrorToast = useCallback((id: string) => {
    setErrorToasts((prev) => prev.filter((e) => e.id !== id));
  }, []);

  useEffect(() => {
    (globalThis as Record<string, unknown>).__toolReady = true;
    return () => {
      if (copyTimerRef.current) clearTimeout(copyTimerRef.current);
    };
  }, []);

  // ---- parse whichever field is the current source of truth ----

  type Parsed =
    | { ok: true; ms: number; digits?: number; unit?: 'seconds' | 'milliseconds' }
    | { ok: false; code: EngineErrorCode; field: 'timestamp' | 'datetime' }
    | null;

  const parsed: Parsed = useMemo(() => {
    if (source === 'timestamp') {
      if (tsInput.trim() === '') return null;
      const r = parseTimestampInput(tsInput);
      if (!r.ok) return { ok: false, code: r.error.code, field: 'timestamp' };
      const digits = tsInput.trim().replace(/^-/, '').length;
      return { ok: true, ms: r.value.ms, digits, unit: r.value.unit };
    }
    if (source === 'datetime') {
      if (dtInput.trim() === '') return null;
      const r = parseDatetimeLocalInput(dtInput);
      if (!r.ok) return { ok: false, code: r.error.code, field: 'datetime' };
      return { ok: true, ms: r.value.ms };
    }
    return null;
  }, [source, tsInput, dtInput]);

  const ms = parsed && parsed.ok ? parsed.ms : null;

  // Mirror the *other* field once the source field parses, so both inputs
  // stay in sync (the bidirectional part of "convert"). Programmatic
  // `setState` here never re-fires the target input's own `input` event, so
  // this cannot loop back and flip `source`.
  useEffect(() => {
    if (!parsed || !parsed.ok) return;
    if (source === 'timestamp') {
      const mirrored = toDatetimeLocalValue(parsed.ms);
      setDtInput((prev) => (prev === mirrored ? prev : mirrored));
    } else if (source === 'datetime') {
      const mirrored = String(toEpochSeconds(parsed.ms));
      setTsInput((prev) => (prev === mirrored ? prev : mirrored));
    }
  }, [parsed, source]);

  const result = useMemo(() => {
    if (ms === null) return null;
    return {
      unixSeconds: toEpochSeconds(ms),
      unixMillis: Math.round(ms),
      local: `${formatLocal(ms)} (${localZoneLabel(ms)})`,
      utc: `${formatUtc(ms)} UTC`,
      iso: toIso8601(ms),
      relative: relativeTimeFrom(ms, locale),
    };
  }, [ms, locale]);

  const timestampError =
    parsed && !parsed.ok && parsed.field === 'timestamp'
      ? parsed.code === 'not-integer'
        ? t.errNotInteger
        : t.errTooManyDigits
      : null;

  const datetimeError = parsed && !parsed.ok && parsed.field === 'datetime' ? t.errInvalidDatetime : null;

  const detectedUnitText =
    parsed && parsed.ok && source === 'timestamp' && parsed.unit && parsed.digits
      ? (parsed.unit === 'seconds' ? t.detectedSeconds : t.detectedMillis).replace('{digits}', String(parsed.digits))
      : null;

  // ---- handlers ----

  const handleTimestampInput = (e: Event) => {
    const value = (e.target as HTMLInputElement).value;
    setTsInput(value);
    setSource('timestamp');
    // Emptying the source field clears the mirrored one too (the parse-based
    // mirror effect only runs on a *successful* parse, not on "now empty").
    if (value.trim() === '') setDtInput('');
  };

  const handleDatetimeInput = (e: Event) => {
    const value = (e.target as HTMLInputElement).value;
    setDtInput(value);
    setSource('datetime');
    if (value.trim() === '') setTsInput('');
  };

  const handleNow = () => {
    setTsInput(String(nowTimestampSeconds()));
    setSource('timestamp');
  };

  const handleClear = () => {
    setTsInput('');
    setDtInput('');
    setSource(null);
  };

  const handleCopy = async (key: CopyKey, text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedKey(key);
    } catch (error) {
      showErrorToast(t.errCopyFailed ?? resolveErrorMessage(error, t));
    }
    if (copyTimerRef.current) clearTimeout(copyTimerRef.current);
    copyTimerRef.current = setTimeout(() => setCopiedKey(null), 2000);
  };

  const hasInput = tsInput.trim() !== '' || dtInput.trim() !== '';

  return (
    <div>
      <AppCard>
        <div class="cts-grid">
          <div class="cts-field">
            <label class="app-field__label" for="timestamp-input">
              {t.timestampLabel}
            </label>
            <div class="cts-row">
              <input
                id="timestamp-input"
                type="text"
                inputMode="numeric"
                autocomplete="off"
                spellcheck={false}
                class="app-field__input num"
                placeholder={t.timestampPlaceholder}
                value={tsInput}
                onInput={handleTimestampInput}
                aria-invalid={!!timestampError}
                aria-describedby={timestampError ? 'timestamp-error' : 'timestamp-help'}
              />
              <button type="button" id="now-button" class="app-button app-button--secondary" onClick={handleNow}>
                {t.nowButton}
              </button>
            </div>
            {timestampError ? (
              <div id="timestamp-error" class="app-field__error" role="alert" data-testid="timestamp-error">
                <span aria-hidden="true">⚠</span> {timestampError}
              </div>
            ) : (
              <div id="timestamp-help" class="cts-help">
                {detectedUnitText ?? t.timestampHelp}
              </div>
            )}
          </div>

          <div class="cts-field">
            <label class="app-field__label" for="datetime-input">
              {t.datetimeLabel}
            </label>
            <input
              id="datetime-input"
              type="datetime-local"
              step="0.001"
              class="app-field__input"
              value={dtInput}
              onInput={handleDatetimeInput}
              aria-invalid={!!datetimeError}
              aria-describedby={datetimeError ? 'datetime-error' : 'datetime-help'}
            />
            {datetimeError ? (
              <div id="datetime-error" class="app-field__error" role="alert" data-testid="datetime-error">
                <span aria-hidden="true">⚠</span> {datetimeError}
              </div>
            ) : (
              <div id="datetime-help" class="cts-help">
                {t.datetimeHelp}
              </div>
            )}
          </div>
        </div>

        {hasInput && (
          <div class="cts-toolbar">
            <AppButton variant="ghost" onClick={handleClear}>
              {t.clearAll}
            </AppButton>
          </div>
        )}
      </AppCard>

      <AppCard className="mt-6">
        <h2 class="cts-result-heading">{t.resultHeading}</h2>

        {!result ? (
          <p class="cts-empty" aria-live="polite">
            {t.resultEmptyHint}
          </p>
        ) : (
          <dl class="cts-result-list" aria-live="polite">
            <div class="cts-result-row">
              <dt>{t.unixSecondsLabel}</dt>
              <dd>
                <span class="num" data-testid="result-unix-seconds">
                  {result.unixSeconds}
                </span>
                <button
                  type="button"
                  class="cts-copy"
                  onClick={() => handleCopy('seconds', String(result.unixSeconds))}
                  aria-label={t.copy}
                >
                  {copiedKey === 'seconds' ? t.copied : t.copy}
                </button>
              </dd>
            </div>
            <div class="cts-result-row">
              <dt>{t.unixMillisLabel}</dt>
              <dd>
                <span class="num" data-testid="result-unix-millis">
                  {result.unixMillis}
                </span>
                <button
                  type="button"
                  class="cts-copy"
                  onClick={() => handleCopy('millis', String(result.unixMillis))}
                  aria-label={t.copy}
                >
                  {copiedKey === 'millis' ? t.copied : t.copy}
                </button>
              </dd>
            </div>
            <div class="cts-result-row cts-result-row--pair">
              <div>
                <dt>{t.localLabel}</dt>
                <dd data-testid="result-local">{result.local}</dd>
              </div>
              <div>
                <dt>{t.utcLabel}</dt>
                <dd data-testid="result-utc">{result.utc}</dd>
              </div>
            </div>
            <div class="cts-result-row">
              <dt>{t.isoLabel}</dt>
              <dd>
                <span class="num" data-testid="result-iso">
                  {result.iso}
                </span>
                <button type="button" class="cts-copy" onClick={() => handleCopy('iso', result.iso)} aria-label={t.copy}>
                  {copiedKey === 'iso' ? t.copied : t.copy}
                </button>
              </dd>
            </div>
            <div class="cts-result-row">
              <dt>{t.relativeLabel}</dt>
              <dd data-testid="result-relative">{result.relative}</dd>
            </div>
          </dl>
        )}
      </AppCard>

      {errorToasts.length > 0 && (
        <div className="error-toast-container" aria-label={t.notificationsAria}>
          {errorToasts.map((toast) => (
            <ErrorToast key={toast.id} id={toast.id} message={toast.message} onClose={removeErrorToast} locale={locale} />
          ))}
        </div>
      )}

      <style>{`
        .cts-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: var(--space-4);
        }
        @media (max-width: 720px) {
          .cts-grid {
            grid-template-columns: 1fr;
          }
        }
        .cts-field {
          display: flex;
          flex-direction: column;
          gap: var(--space-2);
        }
        .cts-row {
          display: flex;
          gap: var(--space-2);
        }
        .cts-row .app-field__input {
          flex: 1 1 auto;
          min-width: 0;
        }
        .cts-help {
          font-size: var(--fs-1);
          color: var(--color-subtle);
        }
        .cts-toolbar {
          display: flex;
          justify-content: flex-end;
          margin-top: var(--space-4);
        }
        .cts-result-heading {
          margin: 0 0 var(--space-3) 0;
          font-size: var(--fs-4);
          font-weight: 600;
        }
        .cts-empty {
          margin: 0;
          color: var(--color-subtle);
          font-size: var(--fs-2);
        }
        .cts-result-list {
          margin: 0;
          display: flex;
          flex-direction: column;
          gap: var(--space-3);
        }
        .cts-result-row {
          display: flex;
          flex-direction: column;
          gap: var(--space-1);
          padding-bottom: var(--space-3);
          border-bottom: 1px solid var(--color-border);
        }
        .cts-result-row:last-child {
          border-bottom: none;
          padding-bottom: 0;
        }
        .cts-result-row dt {
          font-size: var(--fs-1);
          color: var(--color-subtle);
        }
        .cts-result-row dd {
          margin: 0;
          display: flex;
          align-items: center;
          gap: var(--space-3);
          font-size: var(--fs-3);
          font-weight: 500;
          flex-wrap: wrap;
          word-break: break-all;
        }
        .cts-result-row--pair {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: var(--space-4);
        }
        @media (max-width: 720px) {
          .cts-result-row--pair {
            grid-template-columns: 1fr;
          }
        }
        .cts-copy {
          border: 1px solid var(--color-border);
          background: var(--color-surface);
          color: var(--color-text);
          border-radius: var(--radius-xs);
          font-size: var(--fs-1);
          padding: 2px var(--space-2);
          cursor: pointer;
        }
        .cts-copy:hover {
          border-color: var(--color-primary);
        }
      `}</style>
    </div>
  );
}
