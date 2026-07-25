# Third-party notices

The source code in this repository is licensed under the [MIT License](./LICENSE).

This application has **no third-party runtime dependency** beyond its framework:
Astro, Preact, and `@astrojs/preact` are all distributed under the MIT License.
Timestamp/date conversion, formatting, and relative-time strings are done with the
browser's native `Date` and `Intl.RelativeTimeFormat` (`src/utils/timestampEngine.ts`)
— no external date library is used.
