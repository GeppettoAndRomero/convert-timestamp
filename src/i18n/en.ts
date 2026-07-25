import type { ToolContent } from './types';

export const en: ToolContent = {
  htmlLang: 'en',

  meta: {
    title: 'Unix Timestamp Converter — Local Time & UTC, No Upload | runlocally',
    description:
      'Convert a Unix timestamp to a date, or a date to a Unix timestamp, directly in your browser. Seconds vs. milliseconds is detected automatically. Local time and UTC are always shown side by side. Nothing is uploaded, works offline.',
    ogTitle: 'Unix Timestamp Converter — Local Time & UTC, No Upload',
    ogDescription:
      'Convert a Unix timestamp to a date, or back, in your browser. Local time and UTC shown side by side. Nothing is uploaded.',
  },

  hero: {
    h1: 'Convert Timestamp',
    tagline:
      'Convert a Unix timestamp to a date, or a date to a Unix timestamp — in your browser. Local time and UTC are always shown side by side. Nothing is uploaded.',
  },

  intro: {
    h2: 'Unix timestamp to date, and back, without leaving your browser',
    paras: [
      'Type a Unix timestamp and this tool figures out whether it is seconds or milliseconds from the number of digits alone (10 digits or fewer is seconds, 11 to 13 is milliseconds) — no unit picker to get wrong. Or start from the other side: pick a date and time and it converts to the matching timestamp instead. Either field can drive the conversion, and both stay in sync.',
      "Rather than a timezone selector — a frequent source of mistakes, since it is easy to forget which one is selected — the result always shows Local time and UTC next to each other. An ISO 8601 string and a relative description (\"3 days ago\", \"in 2 hours\") are included as read-only extras, both computed with the browser's own Date and Intl.RelativeTimeFormat.",
    ],
  },

  privacy: {
    h2: 'Why your timestamps stay on your device',
    lead: 'Privacy here is structural, not a promise. There is no upload step because there is no server to upload to:',
    points: [
      'The conversion runs entirely in your browser, using the native Date object.',
      'The page is served as static files and makes no request with anything you type.',
      'The source is open and anyone can read it (MIT).',
      'It works offline, which is only possible because nothing leaves the device.',
    ],
    note: "If you want to check for yourself, open your browser's Network panel while converting — no request carries what you entered.",
    sourceLinkText: 'Read the source.',
  },

  howto: {
    h2: 'How to use it',
    steps: [
      {
        h3: 'Enter a timestamp, or a date',
        p: 'Type a Unix timestamp into the timestamp field, or pick a date and time in the date field. Either one works as the starting point.',
      },
      {
        h3: 'Or click Now',
        p: 'The Now button fills in the current time as a Unix timestamp, so you always have a real value to start from.',
      },
      {
        h3: 'Read the result',
        p: 'The result shows the Unix timestamp in both seconds and milliseconds, Local time and UTC side by side, an ISO 8601 string, and a relative-time description.',
      },
      {
        h3: 'Copy what you need',
        p: 'Copy buttons next to the timestamp and ISO values put them straight on your clipboard.',
      },
    ],
  },

  faqHeading: 'FAQ',
  faq: [
    {
      q: 'Is what I type uploaded anywhere?',
      a: "No. The conversion runs entirely in your browser using the native Date object. There is no server component, so what you type has no path off your device. The source is open and you can confirm this in your browser's Network panel.",
    },
    {
      q: 'How does it know if my timestamp is in seconds or milliseconds?',
      a: 'From the number of digits. A Unix timestamp in seconds has 10 digits or fewer for any date up to the year 2286; the same instant in milliseconds has 3 more digits, so 11 to 13 digits is read as milliseconds. This is a simple, reliable rule for any realistic timestamp.',
    },
    {
      q: "Why isn't there a timezone selector?",
      a: "Because it is easy to convert correctly and still misread the result if you forget which timezone was selected. Instead, every conversion shows Local time (your browser's timezone) and UTC side by side, so both are always visible and there is nothing to select or forget.",
    },
    {
      q: 'What is the relative time and the ISO 8601 string?',
      a: 'They are read-only extras alongside the main conversion. The relative time is a short phrase like "3 days ago" or "in 2 hours", computed with the browser\'s Intl.RelativeTimeFormat. The ISO 8601 string is the same instant written in the standard YYYY-MM-DDTHH:mm:ss.sssZ format, useful for pasting into code, logs, or APIs.',
    },
    {
      q: 'Can I convert a date back to a Unix timestamp?',
      a: 'Yes. Enter a date and time in the date field and the Unix timestamp field updates to match, in both seconds and milliseconds — the conversion works in either direction from either field.',
    },
    {
      q: 'Does it work offline?',
      a: 'Yes. It is a PWA. After the first visit it is cached, so conversion works without a network connection. You can also install it to your home screen.',
    },
  ],

  footer: {
    openSourceLabel: 'Open source (MIT)',
    partOf: 'part of',
    brandTail: '— small tools that run locally on your device.',
    colophon:
      "Built and maintained by Geppetto. Some code is written with AI assistance; all review and decisions are the maintainer's.",
    securityText: 'Security',
  },
};
