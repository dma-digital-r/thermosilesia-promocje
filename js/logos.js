/* ============================================================
   LOGOS — rejestr znaków marek używanych w panelu.
   type "img"  -> plik graficzny (assets/logos/*.png)
   type "svg"  -> znacznik wektorowy wbudowany (marki bez pliku
                  graficznego w paczce / wymagające jasnego tła)
   chip: true  -> logo powinno być prezentowane na jasnej,
                  zaokrąglonej plakietce (gdy tło jest ciemne)
   ============================================================ */

const LOGOS = {
  rotenso: {
    name: 'Rotenso',
    type: 'img',
    src: 'assets/logos/rotenso.png',
    chip: true,
    ratio: 3.60,
  },
  // Sam znak "R" (bez nazwy) — używany tam, gdzie miejsce jest zbyt
  // wąskie na pełne logo, np. w plakietce przełącznika marek.
  rotensoR: {
    name: 'Rotenso',
    type: 'img',
    src: 'assets/logos/rotenso-r.png',
    chip: false,
    ratio: 1,
  },
  lg: {
    name: 'LG',
    type: 'svg',
    chip: false,
    markup: `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
      <circle cx="50" cy="50" r="47" fill="#C8102E"/>
      <circle cx="50" cy="50" r="47" fill="none" stroke="#ffffff" stroke-width="3" opacity="0.15"/>
      <path d="M50 22a28 28 0 1 0 27.5 33h-16" fill="none" stroke="#ffffff" stroke-width="9" stroke-linecap="round"/>
      <path d="M50 50V33" fill="none" stroke="#ffffff" stroke-width="9" stroke-linecap="round"/>
      <path d="M62 50a12 12 0 1 1 -6.8 -10.8" fill="none" stroke="#ffffff" stroke-width="7" stroke-linecap="round" opacity="0"/>
      <circle cx="83" cy="42" r="6.5" fill="#ffffff"/>
    </svg>`,
  },
  // Logo dystrybutora (Thermosilesia) — pokazywane w nagłówku po lewej,
  // gdy przełącznik marek po prawej wskazuje LG (LG nie jest "naszą"
  // marką jak Rotenso, więc po lewej stronie widnieje dystrybutor,
  // a nie logo LG).
  thermosilesia: {
    name: 'Thermosilesia',
    type: 'img',
    src: 'https://thermosilesia.pl/lib/intradus-theme-instance-thermosilesia/img/global/logo-horizontal.svg',
    chip: false,
    ratio: 4.78,
  },
  ivensis: { name: 'Ivensis', type: 'img', src: 'assets/logos/ivensis.png', chip: true, ratio: 5.23 },
  cleanairix: { name: 'Cleanairix', type: 'img', src: 'assets/logos/cleanairix.png', chip: true, ratio: 4.6 },
  tivento: { name: 'Tivento', type: 'img', src: 'assets/logos/tivento.png', chip: true, ratio: 3.33 },
  ferono: { name: 'Ferono', type: 'img', src: 'assets/logos/ferono.png', chip: true, ratio: 2.68 },
  swedo: { name: 'Swedo', type: 'img', src: 'assets/logos/swedo.png', chip: true, ratio: 3.83 },
  thermos: { name: 'Thermos', type: 'text', chip: true },
};

function renderLogo(key, opts) {
  opts = opts || {};
  const def = LOGOS[key];
  if (!def) return '';
  // height może być liczbą (px) albo gotową wartością CSS, np. '100%'
  // — to drugie pozwala logo wypełnić wysokość rodzica (np. topbar)
  // zamiast być przycięte do sztywnych pikseli inline stylem.
  const rawHeight = opts.height !== undefined ? opts.height : 28;
  const heightCss = typeof rawHeight === 'number' ? `${rawHeight}px` : rawHeight;
  const heightNum = typeof rawHeight === 'number' ? rawHeight : 28;
  const forceChip = opts.chip !== undefined ? opts.chip : def.chip;
  let inner = '';
  if (def.type === 'img') {
    inner = `<img src="${def.src}" alt="${def.name}" class="logo-${key}" style="height:${heightCss};width:auto;display:block;" draggable="false">`;
  } else if (def.type === 'svg') {
    inner = `<span style="height:${heightCss};width:${heightCss};display:inline-block;" class="svg-logo">${def.markup}</span>`;
  } else {
    inner = `<span class="text-logo" style="font-size:${Math.round(heightNum * 0.6)}px;">${def.name}</span>`;
  }
  if (forceChip) {
    return `<span class="brand-chip" title="${def.name}">${inner}</span>`;
  }
  return inner;
}
