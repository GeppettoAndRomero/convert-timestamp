import type { ToolContent } from './types';

// Deutsch. Keine Wort-für-Wort-Übersetzung, sondern Transkreation auf Basis der
// Begriffe und Wendungen, die deutsche Zeitstempel-/Timestamp-Konverter tatsächlich
// verwenden. Keine Werbefloskeln (einfach / schnell / kinderleicht / perfekt) —
// Datenschutz wird strukturell begründet, nicht versprochen (BRAND-OPERATING-MODEL /
// I18N-SEO-GUIDELINE). Register: informelles „du“, wie bei kostenlosen Browser-Tools üblich.

export const de: ToolContent = {
  htmlLang: 'de',

  meta: {
    title: 'Unix-Zeitstempel umrechnen — lokale Zeit & UTC nebeneinander, ohne Upload | runlocally',
    description:
      'Wandle einen Unix-Zeitstempel in ein Datum um, oder umgekehrt — direkt im Browser. Sekunden oder Millisekunden werden automatisch erkannt. Lokale Zeit und UTC werden immer nebeneinander angezeigt. Nichts wird hochgeladen, funktioniert offline.',
    ogTitle: 'Unix-Zeitstempel umrechnen — lokale Zeit & UTC nebeneinander',
    ogDescription:
      'Unix-Zeitstempel im Browser in ein Datum umrechnen, oder umgekehrt. Lokale Zeit und UTC nebeneinander. Nichts wird hochgeladen.',
  },

  hero: {
    h1: 'Zeitstempel umrechnen',
    tagline:
      'Wandle einen Unix-Zeitstempel in ein Datum um, oder ein Datum in einen Unix-Zeitstempel — im Browser. Lokale Zeit und UTC stehen immer nebeneinander. Nichts wird hochgeladen.',
  },

  intro: {
    h2: 'Unix-Zeitstempel und Datum umrechnen — direkt im Browser',
    paras: [
      'Gib einen Unix-Zeitstempel ein, und das Tool erkennt allein an der Anzahl der Stellen, ob es sich um Sekunden oder Millisekunden handelt (10 Stellen oder weniger sind Sekunden, 11 bis 13 Stellen sind Millisekunden) — keine Einheit zum Auswählen, die man falsch treffen könnte. Oder starte von der anderen Seite: Wähle Datum und Uhrzeit, und der passende Zeitstempel wird berechnet. Beide Felder können den Ausgangspunkt liefern und bleiben synchron.',
      'Statt einer Zeitzonen-Auswahl — eine häufige Fehlerquelle, weil man leicht vergisst, welche gerade ausgewählt ist — zeigt das Ergebnis immer die lokale Zeit und UTC nebeneinander. Ein ISO-8601-String und eine relative Beschreibung („vor 3 Tagen“, „in 2 Stunden“) werden zusätzlich angezeigt, beide berechnet mit dem Date-Objekt und Intl.RelativeTimeFormat des Browsers.',
    ],
  },

  privacy: {
    h2: 'Warum dein Zeitstempel auf dem Gerät bleibt',
    lead: 'Datenschutz ist hier strukturell, kein Versprechen. Es gibt keinen Upload-Schritt, weil es keinen Server gibt, zu dem etwas hochgeladen werden könnte:',
    points: [
      'Die Umrechnung läuft vollständig in deinem Browser, mit dem nativen Date-Objekt.',
      'Die Seite wird als statische Dateien ausgeliefert und sendet keine Anfrage mit dem, was du eingibst.',
      'Der Quellcode ist offen und kann von allen eingesehen werden (MIT).',
      'Die Seite funktioniert offline – was nur möglich ist, weil nichts das Gerät verlässt.',
    ],
    note: 'Wenn du es selbst prüfen willst, öffne beim Umrechnen das Netzwerk-Panel deines Browsers – keine Anfrage trägt deine Eingabe.',
    sourceLinkText: 'Quellcode ansehen.',
  },

  howto: {
    h2: 'So funktioniert es',
    steps: [
      {
        h3: 'Zeitstempel oder Datum eingeben',
        p: 'Gib einen Unix-Zeitstempel in das Zeitstempel-Feld ein, oder wähle Datum und Uhrzeit im Datumsfeld. Beides funktioniert als Startpunkt.',
      },
      {
        h3: 'Oder auf „Jetzt“ klicken',
        p: 'Der Jetzt-Button trägt die aktuelle Zeit als Unix-Zeitstempel ein, damit du immer einen echten Wert zum Ausprobieren hast.',
      },
      {
        h3: 'Ergebnis ablesen',
        p: 'Das Ergebnis zeigt den Unix-Zeitstempel in Sekunden und Millisekunden, lokale Zeit und UTC nebeneinander, einen ISO-8601-String und eine relative Zeitangabe.',
      },
      {
        h3: 'Kopieren, was du brauchst',
        p: 'Kopieren-Schaltflächen neben den Zeitstempel- und ISO-Werten legen sie direkt in die Zwischenablage.',
      },
    ],
  },

  faqHeading: 'Häufige Fragen',
  faq: [
    {
      q: 'Wird das, was ich eingebe, irgendwohin hochgeladen?',
      a: 'Nein. Die Umrechnung läuft vollständig in deinem Browser mit dem nativen Date-Objekt. Es gibt keine Serverkomponente, also gibt es für deine Eingabe keinen Weg vom Gerät. Der Quellcode ist offen und du kannst das im Netzwerk-Panel deines Browsers nachprüfen.',
    },
    {
      q: 'Woher weiß das Tool, ob mein Zeitstempel in Sekunden oder Millisekunden vorliegt?',
      a: 'Anhand der Anzahl der Stellen. Ein Unix-Zeitstempel in Sekunden hat bis zum Jahr 2286 höchstens 10 Stellen; derselbe Zeitpunkt in Millisekunden hat 3 Stellen mehr, deshalb werden 11 bis 13 Stellen als Millisekunden gelesen. Das ist eine einfache, verlässliche Regel für jeden realistischen Zeitstempel.',
    },
    {
      q: 'Warum gibt es keine Zeitzonen-Auswahl?',
      a: 'Weil man das Ergebnis leicht falsch liest, wenn man vergisst, welche Zeitzone gerade ausgewählt war – auch wenn die Umrechnung selbst korrekt ist. Stattdessen zeigt jede Umrechnung lokale Zeit (die Zeitzone deines Browsers) und UTC nebeneinander, sodass beides immer sichtbar ist und nichts vergessen werden kann.',
    },
    {
      q: 'Was sind die relative Zeitangabe und der ISO-8601-String?',
      a: 'Beides sind schreibgeschützte Zusatzinformationen neben der Hauptumrechnung. Die relative Zeitangabe ist eine kurze Formulierung wie „vor 3 Tagen“ oder „in 2 Stunden“, berechnet mit dem Intl.RelativeTimeFormat des Browsers. Der ISO-8601-String schreibt denselben Zeitpunkt im Standardformat YYYY-MM-DDTHH:mm:ss.sssZ, praktisch zum Einfügen in Code, Logs oder APIs.',
    },
    {
      q: 'Kann ich ein Datum zurück in einen Unix-Zeitstempel umrechnen?',
      a: 'Ja. Gib Datum und Uhrzeit im Datumsfeld ein, und das Unix-Zeitstempel-Feld aktualisiert sich passend dazu, in Sekunden und Millisekunden – die Umrechnung funktioniert von jedem Feld aus in beide Richtungen.',
    },
    {
      q: 'Funktioniert es offline?',
      a: 'Ja. Das Tool ist eine PWA. Nach dem ersten Besuch wird es zwischengespeichert, sodass die Umrechnung ohne Netzwerkverbindung funktioniert. Du kannst es auch zum Startbildschirm hinzufügen.',
    },
  ],

  footer: {
    openSourceLabel: 'Open Source (MIT)',
    partOf: 'Teil von',
    brandTail: '— kleine Tools, die lokal auf deinem Gerät laufen.',
    colophon:
      'Erstellt und gepflegt von Geppetto. Ein Teil des Codes entsteht mit KI-Unterstützung; Prüfung und Entscheidungen liegen beim Maintainer.',
    securityText: 'Sicherheit',
  },
};
