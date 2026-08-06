import type { ToolContent } from './types';

// Español. Transcreación basada en el vocabulario que usan los conversores de marca de
// tiempo Unix en español, no traducción literal. Sin palabras publicitarias (fácil /
// rápido / perfecto…); la privacidad se explica de forma estructural, no como promesa.
// Español pan-regional (España y Latinoamérica), registro «tú». htmlLang 'es'.

export const es: ToolContent = {
  htmlLang: 'es',

  meta: {
    title: 'Convertir marca de tiempo Unix — hora local y UTC juntas, sin subir nada | runlocally',
    description:
      'Convierte una marca de tiempo Unix a una fecha, o una fecha a una marca de tiempo Unix, directamente en tu navegador. Segundos o milisegundos se detectan automáticamente. La hora local y UTC se muestran siempre una junto a la otra. No se sube nada, funciona sin conexión.',
    ogTitle: 'Convertir marca de tiempo Unix — hora local y UTC juntas',
    ogDescription:
      'Convierte una marca de tiempo Unix a una fecha, o al revés, en tu navegador. Hora local y UTC una junto a la otra. No se sube nada.',
  },

  hero: {
    h1: 'Convertir marca de tiempo',
    tagline:
      'Convierte una marca de tiempo Unix a una fecha, o una fecha a una marca de tiempo Unix, en tu navegador. La hora local y UTC se muestran siempre juntas. No se sube nada.',
  },

  intro: {
    h2: 'Marca de tiempo Unix y fecha, sin salir de tu navegador',
    paras: [
      'Escribe una marca de tiempo Unix y la herramienta detecta solo por la cantidad de dígitos si son segundos o milisegundos (10 dígitos o menos son segundos, de 11 a 13 son milisegundos), sin que tengas que elegir la unidad tú mismo. O empieza por el otro lado: elige una fecha y hora, y se calcula la marca de tiempo correspondiente. Cualquiera de los dos campos puede ser el punto de partida, y ambos se mantienen sincronizados.',
      'En vez de un selector de zona horaria —una fuente habitual de errores, porque es fácil olvidar cuál quedó seleccionada—, el resultado muestra siempre la hora local y UTC una junto a la otra. Como añadido de solo lectura se incluyen también una cadena ISO 8601 y una descripción relativa («hace 3 días», «en 2 horas»), ambas calculadas con el Date y el Intl.RelativeTimeFormat propios del navegador.',
    ],
  },

  privacy: {
    h2: 'Por qué tu marca de tiempo no sale de tu dispositivo',
    lead: 'Aquí la privacidad es estructural, no una promesa. No hay un paso de subida porque no hay ningún servidor al que subir nada:',
    points: [
      'La conversión se ejecuta por completo en tu navegador, usando el objeto Date nativo.',
      'La página se sirve como archivos estáticos y no envía ninguna petición con lo que escribes.',
      'El código es abierto y cualquiera puede leerlo (MIT).',
      'Funciona sin conexión, algo que solo es posible porque nada sale del dispositivo.',
    ],
    note: 'Si quieres comprobarlo tú mismo, abre el panel de Red de tu navegador mientras conviertes: ninguna petición lleva lo que escribiste.',
    sourceLinkText: 'Leer el código fuente.',
  },

  howto: {
    h2: 'Cómo se usa',
    steps: [
      {
        h3: 'Escribe una marca de tiempo, o elige una fecha',
        p: 'Escribe una marca de tiempo Unix en su campo, o elige fecha y hora en el campo de fecha. Cualquiera de los dos sirve como punto de partida.',
      },
      {
        h3: 'O haz clic en Ahora',
        p: 'El botón Ahora rellena la hora actual como marca de tiempo Unix, para que siempre tengas un valor real con el que empezar.',
      },
      {
        h3: 'Lee el resultado',
        p: 'El resultado muestra la marca de tiempo Unix en segundos y en milisegundos, la hora local y UTC una junto a la otra, una cadena ISO 8601 y una descripción relativa.',
      },
      {
        h3: 'Copia lo que necesites',
        p: 'Los botones de copiar junto a los valores de marca de tiempo e ISO los ponen directamente en tu portapapeles.',
      },
    ],
  },

  faqHeading: 'Preguntas frecuentes',
  faq: [
    {
      q: '¿Se sube a algún sitio lo que escribo?',
      a: 'No. La conversión se ejecuta por completo en tu navegador con el objeto Date nativo. No hay ningún componente de servidor, así que lo que escribes no tiene forma de salir del dispositivo. El código es abierto y puedes confirmarlo en el panel de Red de tu navegador.',
    },
    {
      q: '¿Cómo sabe si mi marca de tiempo está en segundos o en milisegundos?',
      a: 'Por la cantidad de dígitos. Una marca de tiempo Unix en segundos tiene como máximo 10 dígitos para cualquier fecha hasta el año 2286; el mismo instante en milisegundos tiene 3 dígitos más, así que de 11 a 13 dígitos se interpreta como milisegundos. Es una regla simple y fiable para cualquier marca de tiempo real.',
    },
    {
      q: '¿Por qué no hay un selector de zona horaria?',
      a: 'Porque es fácil malinterpretar el resultado si olvidas qué zona horaria estaba seleccionada, aunque la conversión en sí sea correcta. En su lugar, cada conversión muestra siempre la hora local (la zona horaria de tu navegador) y UTC una junto a la otra, así que no hay nada que seleccionar ni que olvidar.',
    },
    {
      q: '¿Qué son la hora relativa y la cadena ISO 8601?',
      a: 'Son información adicional de solo lectura junto al resultado principal. La hora relativa es una frase corta como «hace 3 días» o «en 2 horas», calculada con el Intl.RelativeTimeFormat del navegador. La cadena ISO 8601 escribe ese mismo instante en el formato estándar YYYY-MM-DDTHH:mm:ss.sssZ, útil para pegar en código, registros o APIs.',
    },
    {
      q: '¿Puedo convertir una fecha de vuelta a una marca de tiempo Unix?',
      a: 'Sí. Introduce fecha y hora en el campo de fecha, y el campo de marca de tiempo Unix se actualiza con el valor correspondiente, en segundos y en milisegundos — la conversión funciona en ambos sentidos desde cualquiera de los dos campos.',
    },
    {
      q: '¿Funciona sin conexión?',
      a: 'Sí. Es una PWA. Tras la primera visita queda guardada en la caché, de modo que la conversión funciona sin conexión a la red. También puedes instalarla en tu pantalla de inicio.',
    },
  ],

  footer: {
    openSourceLabel: 'Código abierto (MIT)',
    partOf: 'parte de',
    brandTail: '— pequeñas herramientas que funcionan localmente en tu dispositivo.',
    colophon:
      'Creado y mantenido por Geppetto. Parte del código se escribe con ayuda de IA; la revisión y las decisiones son del responsable del proyecto.',
    securityText: 'Seguridad',
  },

  related: {
    h2: 'Herramientas relacionadas',
    blogLinkText: 'Leer las notas técnicas',
  },
};
