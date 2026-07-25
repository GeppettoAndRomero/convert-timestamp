import { describe, it, expect } from 'vitest';
import { AppError, resolveErrorMessage } from '@/utils/appError';
import { ui } from '@/i18n/ui';

describe('resolveErrorMessage', () => {
  it('maps codes to localized strings', () => {
    expect(resolveErrorMessage('errCopyFailed', ui.en)).toBe(
      'Could not copy — select the text and copy it manually.'
    );
    expect(resolveErrorMessage(new AppError('errCopyFailed'), ui.ja)).toBe(
      'コピーできませんでした。テキストを選択して手動でコピーしてください。'
    );
  });

  it('maps a plain Error whose message is a known code (e.g. thrown as `new Error(code)`)', () => {
    expect(resolveErrorMessage(new Error('errCopyFailed'), ui.en)).toBe(
      'Could not copy — select the text and copy it manually.'
    );
  });

  it('interpolates params when present on an AppError', () => {
    expect(resolveErrorMessage(new AppError('errCopyFailed', { unused: 'x' }), ui.en)).toBe(
      'Could not copy — select the text and copy it manually.'
    );
  });

  it('falls back to the localized generic message for unmapped English/undefined errors', () => {
    expect(resolveErrorMessage('DOMException: Document is not focused.', ui.zh)).toBe(ui.zh.errConversionFailed);
    expect(resolveErrorMessage(undefined, ui.es)).toBe(ui.es.errConversionFailed);
  });

  it('every locale defines the mapped codes', () => {
    for (const loc of ['en', 'ja', 'zh', 'de', 'es'] as const)
      for (const c of ['errCopyFailed', 'errConversionFailed'])
        expect((ui as any)[loc][c], `${loc}.${c}`).toBeTruthy();
  });
});
