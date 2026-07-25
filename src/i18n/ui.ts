/**
 * Preact アイランド（クライアント UI）の文言。ロケール別。
 * ページレベル content (`en.ts` / `ja.ts`) とは別に、インタラクティブな
 * アイランドが表示する文字列をここに集約する。
 *
 * 重要: アイランドは locale を PROP で受け取り（SSR 時に存在）、
 * `document` 等から読まない。SSR とクライアントで同一文字列を描画して
 * hydration mismatch を防ぐ。
 *
 * 補間文字列は `{digits}` のようなテンプレートを持ち、
 * アイランド側で `.replace('{digits}', x)` する。
 */
export const ui = {
  en: {
    // ConvertTimestampTool — timestamp input
    timestampLabel: 'Unix timestamp',
    timestampPlaceholder: 'e.g. 1700000000',
    timestampHelp:
      'Seconds (up to 10 digits) or milliseconds (11-13 digits) — detected automatically from the digit count.',
    nowButton: 'Now',
    detectedSeconds: 'Detected as seconds ({digits} digits)',
    detectedMillis: 'Detected as milliseconds ({digits} digits)',

    // ConvertTimestampTool — datetime input
    datetimeLabel: 'Date & time (local)',
    datetimeHelp: 'Enter a date and time in your local timezone.',

    clearAll: 'Clear',

    // ConvertTimestampTool — errors
    errNotInteger: 'Enter digits only (a whole number), e.g. 1700000000.',
    errTooManyDigits: 'Too many digits — a Unix timestamp is at most 13 digits (milliseconds).',
    errInvalidDatetime: 'Enter a valid date and time.',

    // ConvertTimestampTool — result
    resultHeading: 'Result',
    resultEmptyHint: 'Enter a Unix timestamp, or a date and time, to see the conversion here.',
    unixSecondsLabel: 'Unix timestamp (seconds)',
    unixMillisLabel: 'Unix timestamp (milliseconds)',
    localLabel: 'Local time',
    utcLabel: 'UTC',
    isoLabel: 'ISO 8601',
    relativeLabel: 'Relative',
    copy: 'Copy',
    copied: 'Copied!',
    errCopyFailed: 'Could not copy — select the text and copy it manually.',
    errConversionFailed: 'Something went wrong.',
    notificationsAria: 'Notifications',

    // InstallPrompt
    installHeading: 'Install app',
    installBody: 'Add to your home screen for quick access.',
    install: 'Install',
    later: 'Later',

    // ThemeToggle
    themeToLight: 'Switch to light mode',
    themeToDark: 'Switch to dark mode',
    themeLabel: 'Theme',

    // shared
    close: 'Close',
    required: 'Required',
  },
  ja: {
    // ConvertTimestampTool — timestamp input
    timestampLabel: 'Unix タイムスタンプ',
    timestampPlaceholder: '例: 1700000000',
    timestampHelp: '桁数から自動判定します(秒: 10桁以下、ミリ秒: 11〜13桁)。',
    nowButton: '現在時刻',
    detectedSeconds: '秒として認識({digits}桁)',
    detectedMillis: 'ミリ秒として認識({digits}桁)',

    // ConvertTimestampTool — datetime input
    datetimeLabel: '日時(ローカル)',
    datetimeHelp: 'お使いのタイムゾーンで日時を入力してください。',

    clearAll: 'クリア',

    // ConvertTimestampTool — errors
    errNotInteger: '数字のみの整数を入力してください(例: 1700000000)。',
    errTooManyDigits: '桁数が多すぎます。Unix タイムスタンプは最大13桁(ミリ秒)です。',
    errInvalidDatetime: '有効な日時を入力してください。',

    // ConvertTimestampTool — result
    resultHeading: '変換結果',
    resultEmptyHint: '上に Unix タイムスタンプ、または日時を入力すると、ここに変換結果が表示されます。',
    unixSecondsLabel: 'Unix タイムスタンプ(秒)',
    unixMillisLabel: 'Unix タイムスタンプ(ミリ秒)',
    localLabel: 'ローカル時刻',
    utcLabel: 'UTC',
    isoLabel: 'ISO 8601',
    relativeLabel: '相対時間',
    copy: 'コピー',
    copied: 'コピーしました!',
    errCopyFailed: 'コピーできませんでした。テキストを選択して手動でコピーしてください。',
    errConversionFailed: '問題が発生しました。',
    notificationsAria: '通知',

    // InstallPrompt
    installHeading: 'アプリを追加',
    installBody: 'ホーム画面に追加すると、すぐに開けます。',
    install: '追加',
    later: 'あとで',

    // ThemeToggle
    themeToLight: 'ライトモードに切り替え',
    themeToDark: 'ダークモードに切り替え',
    themeLabel: 'テーマ',

    // shared
    close: '閉じる',
    required: '必須',
  },
  zh: {
    // ConvertTimestampTool — timestamp input
    timestampLabel: 'Unix 时间戳',
    timestampPlaceholder: '例如 1700000000',
    timestampHelp: '根据位数自动判断：秒(10位以内)或毫秒(11-13位)。',
    nowButton: '当前时间',
    detectedSeconds: '识别为秒({digits} 位)',
    detectedMillis: '识别为毫秒({digits} 位)',

    // ConvertTimestampTool — datetime input
    datetimeLabel: '日期和时间(本地)',
    datetimeHelp: '请输入您所在时区的日期和时间。',

    clearAll: '清除',

    // ConvertTimestampTool — errors
    errNotInteger: '请输入纯数字整数，例如 1700000000。',
    errTooManyDigits: '位数过多——Unix 时间戳最多 13 位(毫秒)。',
    errInvalidDatetime: '请输入有效的日期和时间。',

    // ConvertTimestampTool — result
    resultHeading: '转换结果',
    resultEmptyHint: '在上方输入 Unix 时间戳，或输入日期和时间，结果会显示在这里。',
    unixSecondsLabel: 'Unix 时间戳(秒)',
    unixMillisLabel: 'Unix 时间戳(毫秒)',
    localLabel: '本地时间',
    utcLabel: 'UTC',
    isoLabel: 'ISO 8601',
    relativeLabel: '相对时间',
    copy: '复制',
    copied: '已复制!',
    errCopyFailed: '无法复制——请手动选择文本并复制。',
    errConversionFailed: '出了点问题。',
    notificationsAria: '通知',

    // InstallPrompt
    installHeading: '安装应用',
    installBody: '添加到主屏幕，方便随时打开。',
    install: '安装',
    later: '以后再说',

    // ThemeToggle
    themeToLight: '切换到浅色模式',
    themeToDark: '切换到深色模式',
    themeLabel: '主题',

    // shared
    close: '关闭',
    required: '必填',
  },
  de: {
    // ConvertTimestampTool — timestamp input
    timestampLabel: 'Unix-Zeitstempel',
    timestampPlaceholder: 'z. B. 1700000000',
    timestampHelp:
      'Sekunden (bis zu 10 Stellen) oder Millisekunden (11-13 Stellen) — anhand der Stellenzahl automatisch erkannt.',
    nowButton: 'Jetzt',
    detectedSeconds: 'Erkannt als Sekunden ({digits} Stellen)',
    detectedMillis: 'Erkannt als Millisekunden ({digits} Stellen)',

    // ConvertTimestampTool — datetime input
    datetimeLabel: 'Datum & Uhrzeit (lokal)',
    datetimeHelp: 'Gib Datum und Uhrzeit in deiner lokalen Zeitzone ein.',

    clearAll: 'Leeren',

    // ConvertTimestampTool — errors
    errNotInteger: 'Gib nur Ziffern ein (eine ganze Zahl), z. B. 1700000000.',
    errTooManyDigits: 'Zu viele Stellen — ein Unix-Zeitstempel hat höchstens 13 Stellen (Millisekunden).',
    errInvalidDatetime: 'Gib ein gültiges Datum mit Uhrzeit ein.',

    // ConvertTimestampTool — result
    resultHeading: 'Ergebnis',
    resultEmptyHint: 'Gib oben einen Unix-Zeitstempel oder ein Datum mit Uhrzeit ein, um die Umrechnung hier zu sehen.',
    unixSecondsLabel: 'Unix-Zeitstempel (Sekunden)',
    unixMillisLabel: 'Unix-Zeitstempel (Millisekunden)',
    localLabel: 'Lokale Zeit',
    utcLabel: 'UTC',
    isoLabel: 'ISO 8601',
    relativeLabel: 'Relativ',
    copy: 'Kopieren',
    copied: 'Kopiert!',
    errCopyFailed: 'Konnte nicht kopiert werden — markiere den Text und kopiere ihn manuell.',
    errConversionFailed: 'Etwas ist schiefgelaufen.',
    notificationsAria: 'Benachrichtigungen',

    // InstallPrompt
    installHeading: 'App installieren',
    installBody: 'Zum Startbildschirm hinzufügen, um es direkt zu öffnen.',
    install: 'Installieren',
    later: 'Später',

    // ThemeToggle
    themeToLight: 'Zum hellen Modus wechseln',
    themeToDark: 'Zum dunklen Modus wechseln',
    themeLabel: 'Design',

    // shared
    close: 'Schließen',
    required: 'Erforderlich',
  },
  es: {
    // ConvertTimestampTool — timestamp input
    timestampLabel: 'Marca de tiempo Unix',
    timestampPlaceholder: 'p. ej. 1700000000',
    timestampHelp:
      'Segundos (hasta 10 dígitos) o milisegundos (11-13 dígitos) — detectado automáticamente según la cantidad de dígitos.',
    nowButton: 'Ahora',
    detectedSeconds: 'Detectado como segundos ({digits} dígitos)',
    detectedMillis: 'Detectado como milisegundos ({digits} dígitos)',

    // ConvertTimestampTool — datetime input
    datetimeLabel: 'Fecha y hora (local)',
    datetimeHelp: 'Introduce la fecha y hora en tu zona horaria local.',

    clearAll: 'Borrar',

    // ConvertTimestampTool — errors
    errNotInteger: 'Introduce solo dígitos (un número entero), por ejemplo 1700000000.',
    errTooManyDigits: 'Demasiados dígitos — una marca de tiempo Unix tiene como máximo 13 dígitos (milisegundos).',
    errInvalidDatetime: 'Introduce una fecha y hora válidas.',

    // ConvertTimestampTool — result
    resultHeading: 'Resultado',
    resultEmptyHint: 'Introduce una marca de tiempo Unix, o una fecha y hora, para ver la conversión aquí.',
    unixSecondsLabel: 'Marca de tiempo Unix (segundos)',
    unixMillisLabel: 'Marca de tiempo Unix (milisegundos)',
    localLabel: 'Hora local',
    utcLabel: 'UTC',
    isoLabel: 'ISO 8601',
    relativeLabel: 'Relativo',
    copy: 'Copiar',
    copied: '¡Copiado!',
    errCopyFailed: 'No se pudo copiar — selecciona el texto y cópialo manualmente.',
    errConversionFailed: 'Algo salió mal.',
    notificationsAria: 'Notificaciones',

    // InstallPrompt
    installHeading: 'Instalar la app',
    installBody: 'Añádela a tu pantalla de inicio para tenerla siempre a mano.',
    install: 'Instalar',
    later: 'Más tarde',

    // ThemeToggle
    themeToLight: 'Cambiar al modo claro',
    themeToDark: 'Cambiar al modo oscuro',
    themeLabel: 'Tema',

    // shared
    close: 'Cerrar',
    required: 'Obligatorio',
  },
} as const;

export type UiStrings = (typeof ui)['en'];
