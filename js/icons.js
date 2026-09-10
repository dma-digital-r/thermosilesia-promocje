/* ============================================================
   ICONS — minimalistyczne ikony liniowe SVG (bez zewnętrznych
   zasobów graficznych). Używane w kaflach, hero i odznakach.
   Każda funkcja zwraca gotowy znacznik <svg>.
   ============================================================ */

const ICONS = {
  splitAC: `<svg viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect x="10" y="18" width="72" height="20" rx="8" stroke="currentColor" stroke-width="3"/>
    <circle cx="20" cy="28" r="2.6" fill="currentColor"/>
    <path d="M18 32c6 3 12 3 18 0M32 32c6 3 12 3 18 0M46 32c6 3 12 3 18 0" stroke="currentColor" stroke-width="2.4" stroke-linecap="round"/>
    <path d="M46 38v10c0 5 3 8 8 8h6" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-dasharray="3 4"/>
    <rect x="60" y="56" width="44" height="38" rx="6" stroke="currentColor" stroke-width="3"/>
    <circle cx="82" cy="75" r="12" stroke="currentColor" stroke-width="2.6"/>
    <path d="M82 65v20M72 75h20M75 68l14 14M89 68L75 82" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/>
    <path d="M60 88h-4a6 6 0 0 1-6-6" stroke="currentColor" stroke-width="2.4" stroke-linecap="round"/>
  </svg>`,

  monoblock: `<svg viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect x="24" y="32" width="72" height="56" rx="8" stroke="currentColor" stroke-width="3"/>
    <circle cx="60" cy="60" r="20" stroke="currentColor" stroke-width="2.6"/>
    <circle cx="60" cy="60" r="4" fill="currentColor"/>
    <path d="M60 44v-4M60 80v-4M44 60h-4M80 60h-4M48.8 48.8l-2.8-2.8M73.9 73.9l-2.8-2.8M48.8 71.2l-2.8 2.8M73.9 46.1l-2.8 2.8" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"/>
    <path d="M40 88v10M80 88v10" stroke="currentColor" stroke-width="3" stroke-linecap="round"/>
    <path d="M30 98h60" stroke="currentColor" stroke-width="3" stroke-linecap="round"/>
  </svg>`,

  hydroSplit: `<svg viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect x="14" y="18" width="34" height="72" rx="7" stroke="currentColor" stroke-width="3"/>
    <rect x="20" y="26" width="22" height="14" rx="3" stroke="currentColor" stroke-width="2.2"/>
    <path d="M20 48h22M20 56h22M20 64h14" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
    <circle cx="31" cy="78" r="4" stroke="currentColor" stroke-width="2"/>
    <path d="M48 70c8 0 10-4 16-4" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-dasharray="3 4"/>
    <rect x="66" y="52" width="42" height="36" rx="6" stroke="currentColor" stroke-width="3"/>
    <circle cx="87" cy="70" r="11" stroke="currentColor" stroke-width="2.4"/>
    <path d="M87 61v18M78 70h18" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/>
  </svg>`,

  aio: `<svg viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect x="16" y="14" width="36" height="78" rx="7" stroke="currentColor" stroke-width="3"/>
    <rect x="23" y="22" width="14" height="10" rx="2" stroke="currentColor" stroke-width="2"/>
    <path d="M23 40h22M23 48h22M23 56h22M23 64h14" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/>
    <path d="M52 74c8 1 10-3 16-3" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-dasharray="3 4"/>
    <rect x="68" y="56" width="40" height="34" rx="6" stroke="currentColor" stroke-width="3"/>
    <circle cx="88" cy="73" r="10" stroke="currentColor" stroke-width="2.2"/>
    <path d="M88 65v16M80 73h16" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
  </svg>`,

  multiSplit: `<svg viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M20 58 60 26l40 32" stroke="currentColor" stroke-width="3" stroke-linejoin="round" stroke-linecap="round"/>
    <path d="M30 56v34h60V56" stroke="currentColor" stroke-width="3" stroke-linejoin="round"/>
    <rect x="40" y="70" width="16" height="12" rx="2" stroke="currentColor" stroke-width="2"/>
    <rect x="64" y="70" width="16" height="12" rx="2" stroke="currentColor" stroke-width="2"/>
    <circle cx="102" cy="82" r="13" stroke="currentColor" stroke-width="2.4"/>
    <path d="M102 72v20M92 82h20" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
    <path d="M80 88c6 0 8-3 12-4" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-dasharray="2.5 4"/>
  </svg>`,

  bundle: `<svg viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect x="16" y="52" width="88" height="46" rx="4" stroke="currentColor" stroke-width="3"/>
    <path d="M16 68h88" stroke="currentColor" stroke-width="3"/>
    <path d="M60 52v46" stroke="currentColor" stroke-width="3"/>
    <path d="M12 40h96v12H12z" stroke="currentColor" stroke-width="3" stroke-linejoin="round"/>
    <path d="M60 40c-4-16-16-24-26-22-8 1.6-12 8-9 14 3 6 14 8 20 8h15z" stroke="currentColor" stroke-width="2.4" stroke-linejoin="round"/>
    <path d="M60 40c4-16 16-24 26-22 8 1.6 12 8 9 14-3 6-14 8-20 8H60z" stroke="currentColor" stroke-width="2.4" stroke-linejoin="round"/>
  </svg>`,

  accessory: `<svg viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="60" cy="60" r="16" stroke="currentColor" stroke-width="3"/>
    <circle cx="60" cy="60" r="5" fill="currentColor"/>
    <path d="M60 34v10M60 76v10M86 60H76M44 60H34M77.8 42.2l-7 7M49.2 70.8l-7 7M77.8 77.8l-7-7M49.2 49.2l-7-7" stroke="currentColor" stroke-width="3" stroke-linecap="round"/>
  </svg>`,

  filter: `<svg viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect x="24" y="24" width="72" height="72" rx="8" stroke="currentColor" stroke-width="3"/>
    <path d="M24 40h72M24 56h72M24 72h72M40 24v72M56 24v72M72 24v72" stroke="currentColor" stroke-width="1.4" opacity="0.55"/>
  </svg>`,

  warehouse: `<svg viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M14 52 60 24l46 28" stroke="currentColor" stroke-width="3" stroke-linejoin="round" stroke-linecap="round"/>
    <path d="M22 48v44h76V48" stroke="currentColor" stroke-width="3" stroke-linejoin="round"/>
    <rect x="50" y="70" width="20" height="22" stroke="currentColor" stroke-width="2.4"/>
    <path d="M34 62h14v14H34zM72 62h14v14H72z" stroke="currentColor" stroke-width="2"/>
    <path d="M18 92h84" stroke="currentColor" stroke-width="3" stroke-linecap="round"/>
  </svg>`,

  shield: `<svg viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M60 16l34 12v26c0 26-15 42-34 50-19-8-34-24-34-50V28l34-12z" stroke="currentColor" stroke-width="3" stroke-linejoin="round"/>
    <path d="M45 60l11 11 20-24" stroke="currentColor" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/>
  </svg>`,

  truck: `<svg viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect x="10" y="46" width="56" height="32" rx="4" stroke="currentColor" stroke-width="3"/>
    <path d="M66 56h20l14 14v8H66z" stroke="currentColor" stroke-width="3" stroke-linejoin="round"/>
    <circle cx="34" cy="86" r="8" stroke="currentColor" stroke-width="2.6"/>
    <circle cx="86" cy="86" r="8" stroke="currentColor" stroke-width="2.6"/>
    <path d="M10 60h10M84 66h8" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
  </svg>`,

  shuffle: `<svg viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M16 38h18c10 0 16 6 22 14l8 10c6 8 12 14 22 14h18" stroke="currentColor" stroke-width="3" stroke-linecap="round"/>
    <path d="M16 82h18c10 0 16-6 22-14l8-10c6-8 12-14 22-14h18" stroke="currentColor" stroke-width="3" stroke-linecap="round"/>
    <path d="M94 30l14 8-14 8M94 74l14 8-14 8" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>
  </svg>`,

  dualMode: `<svg viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M60 14v92M60 14l-8 10M60 14l8 10M60 106l-8-10M60 106l8-10M20 34l80 52M20 34l1 13M20 34l13-3M100 86l-1-13M100 86l-13 3M100 34L20 86M100 34l-13-3M100 34l1 13M20 86l13 3M20 86l-1-13" stroke="currentColor" stroke-width="2.4" stroke-linecap="round"/>
    <circle cx="60" cy="60" r="10" stroke="currentColor" stroke-width="2.6"/>
  </svg>`,

  tag: `<svg viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M18 22h38l46 46-38 38-46-46V22z" stroke="currentColor" stroke-width="3" stroke-linejoin="round"/>
    <circle cx="38" cy="42" r="6" stroke="currentColor" stroke-width="2.6"/>
  </svg>`,

  spark: `<svg viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M60 12l9 33 33 9-33 9-9 33-9-33-33-9 33-9z" stroke="currentColor" stroke-width="2.6" stroke-linejoin="round"/>
  </svg>`,

  house: `<svg viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M18 56 60 24l42 32" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>
    <path d="M28 50v42h64V50" stroke="currentColor" stroke-width="3" stroke-linejoin="round"/>
    <rect x="52" y="70" width="16" height="22" stroke="currentColor" stroke-width="2.4"/>
    <rect x="36" y="60" width="12" height="10" stroke="currentColor" stroke-width="2"/>
    <rect x="72" y="60" width="12" height="10" stroke="currentColor" stroke-width="2"/>
    <circle cx="94" cy="30" r="10" stroke="currentColor" stroke-width="2.2"/>
    <path d="M94 24v12M88 30h12" stroke="currentColor" stroke-width="1.4"/>
  </svg>`,

  /* ---- ikony pogodowe (pasek prognozy w nagłówku) ---- */

  wSun: `<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="12" cy="12" r="4.6" fill="#F5A623"/>
    <g stroke="#F5A623" stroke-width="1.7" stroke-linecap="round">
      <path d="M12 2.5v2.6M12 18.9v2.6M2.5 12h2.6M18.9 12h2.6M5.1 5.1l1.8 1.8M17.1 17.1l1.8 1.8M18.9 5.1l-1.8 1.8M6.9 17.1l-1.8 1.8"/>
    </g>
  </svg>`,

  wSunCloud: `<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="9" cy="8.5" r="3.6" fill="#F5A623"/>
    <g stroke="#F5A623" stroke-width="1.5" stroke-linecap="round">
      <path d="M9 2.2v1.9M3.2 8.5h1.9M4.9 3.9l1.4 1.4"/>
    </g>
    <path d="M8 20h9a4 4 0 0 0 .6-7.9 5.2 5.2 0 0 0-9.9-1.7A3.8 3.8 0 0 0 8 20z" fill="#B9C2CC"/>
  </svg>`,

  wCloud: `<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M6.5 19h11a4.3 4.3 0 0 0 .7-8.5 5.6 5.6 0 0 0-10.8-1.8A4.1 4.1 0 0 0 6.5 19z" fill="#9AA5B1"/>
  </svg>`,

  wFog: `<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M6.5 13.5h11a4.3 4.3 0 0 0 .5-8.5 5.6 5.6 0 0 0-10.6-1.6 4.1 4.1 0 0 0-.9 10.1z" fill="#B9C2CC"/>
    <g stroke="#9AA5B1" stroke-width="1.6" stroke-linecap="round">
      <path d="M3 17.5h18M5 21h14"/>
    </g>
  </svg>`,

  wRain: `<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M6.5 14h11a4.3 4.3 0 0 0 .6-8.5 5.6 5.6 0 0 0-10.7-1.7A4.1 4.1 0 0 0 6.5 14z" fill="#9AA5B1"/>
    <g stroke="#4FA3E0" stroke-width="1.8" stroke-linecap="round">
      <path d="M8 17.5l-1.3 3M13 17.5l-1.3 3M18 17.5l-1.3 3"/>
    </g>
  </svg>`,

  wSnow: `<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M6.5 13h11a4.3 4.3 0 0 0 .6-8.5A5.6 5.6 0 0 0 7.4 2.8 4.1 4.1 0 0 0 6.5 13z" fill="#B9C2CC"/>
    <g stroke="#7FC7EA" stroke-width="1.7" stroke-linecap="round">
      <path d="M8 17v5M5.7 18.3l4.6 2.4M10.3 18.3l-4.6 2.4"/>
      <path d="M16 17v5M13.7 18.3l4.6 2.4M18.3 18.3l-4.6 2.4"/>
    </g>
  </svg>`,

  wStorm: `<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M6.5 12.5h11a4.3 4.3 0 0 0 .5-8.5A5.6 5.6 0 0 0 7.4 2.4 4.1 4.1 0 0 0 6.5 12.5z" fill="#8891A0"/>
    <path d="M12.5 12l-3 5h2.6l-1.6 5 4.6-6.3h-2.7l2-3.7z" fill="#F5A623"/>
  </svg>`,

  chevronLeft: `<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M15 5l-7 7 7 7" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"/></svg>`,
  chevronRight: `<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M9 5l7 7-7 7" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"/></svg>`,
  close: `<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M6 6l12 12M18 6L6 18" stroke="currentColor" stroke-width="2.4" stroke-linecap="round"/></svg>`,
  arrowUp: `<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M12 19V5M12 5l-6 6M12 5l6 6" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"/></svg>`,
  search: `<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><circle cx="10.5" cy="10.5" r="6.5" stroke="currentColor" stroke-width="2.2"/><path d="M20 20l-4.6-4.6" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"/></svg>`,
  box: `<svg viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M60 14L104 34V86L60 106L16 86V34L60 14Z" stroke="currentColor" stroke-width="3" stroke-linejoin="round"/>
    <path d="M16 34L60 54L104 34" stroke="currentColor" stroke-width="3" stroke-linejoin="round"/>
    <path d="M60 54V106" stroke="currentColor" stroke-width="3"/>
  </svg>`,
};
