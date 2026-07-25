# convert-timestamp

Convert a Unix timestamp to a date, or a date to a Unix timestamp, entirely in your
browser. Nothing is uploaded. Open source, works offline (PWA).

Part of [runlocally](https://runlocally.app) — small tools that run locally on your device.

## How it works

A Unix timestamp text field and a `datetime-local` field drive the same conversion —
whichever one you last typed into becomes the source, and the other field updates to
match. Unit (seconds vs. milliseconds) is auto-detected from digit count: 10 digits or
fewer is read as seconds, 11-13 digits as milliseconds. There is no timezone selector;
instead, the result always shows Local time and UTC side by side, so the common
"which timezone is this?" confusion never comes up. An ISO 8601 string and a
relative-time string ("3 days ago" / "in 2 hours") are shown as read-only extras.

All conversion is native `Date` and `Intl.RelativeTimeFormat` (`src/utils/timestampEngine.ts`)
— no date library, no server, no upload.

## Features

- Unix timestamp <-> date/time, bidirectional
- Auto-detects seconds vs. milliseconds from digit count
- Local time and UTC shown side by side (no timezone selector)
- ISO 8601 string and relative-time string ("3 days ago" / "in 2 hours")
- "Now" button fills the current timestamp
- Works offline (PWA), installable

## Out of scope

Calendar/timezone-database browsing and cron-expression parsing are intentionally not
part of this tool.

## Develop

```bash
npm install
npm run dev      # dev server
npm run build    # type-check + production build to dist/
```

Stack: Astro + Preact + TypeScript. Conversion is a set of pure functions in
`src/utils/timestampEngine.ts`.

## Browser support

Works in current Chrome, Edge, Firefox and Safari. No WebAssembly, no Web Worker — the
only browser APIs used are native `Date`, `Intl.RelativeTimeFormat`, and the Clipboard
API (only for the optional "Copy" buttons; conversion itself needs neither).

## License

[MIT](./LICENSE). Built and maintained by Geppetto. Some code is written with AI
assistance; all review and decisions are the maintainer's.
