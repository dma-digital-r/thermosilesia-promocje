/* ============================================================================
   APP.JS — logika panelu promocji dla instalatorów
   ============================================================================ */

(function () {
  'use strict';

  const $ = (sel) => document.querySelector(sel);

  const el = {
    brandLogo: $('#brandLogo'),
    monthBadge: $('#monthBadge'),
    weatherStrip: $('#weatherStrip'),
    clock: $('#clock'),
    clockDate: $('#clockDate'),
    brandSwitch: $('#brandSwitch'),
    bgLayerA: $('#bgLayerA'),
    bgLayerB: $('#bgLayerB'),
    particles: $('#particles'),
    heroCard: $('#heroCard'),
    heroKicker: $('#heroKicker'),
    heroTitle: $('#heroTitle'),
    heroTagline: $('#heroTagline'),
    heroBadges: $('#heroBadges'),
    priceLabel: $('#priceLabel'),
    pricePrefix: $('#pricePrefix'),
    priceNumber: $('#priceNumber'),
    priceSuffix: $('#priceSuffix'),
    priceCaption1: $('#priceCaption1'),
    priceLabel2: $('#priceLabel2'),
    priceValue2: $('#priceValue2'),
    priceCaption2: $('#priceCaption2'),
    heroBrandChip: $('#heroBrandChip'),
    heroVisual: $('#heroVisual'),
    visualGlow: $('#visualGlow'),
    visualFrame: $('#visualFrame'),
    heroIcon: $('#heroIcon'),
    heroPhoto: $('#heroPhoto'),
    btnDetails: $('#btnDetails'),
    filterRow: $('#filterRow'),
    promoPrev: $('#promoPrev'),
    promoNext: $('#promoNext'),
    promoTrackWrap: $('#promoTrackWrap'),
    promoTrack: $('#promoTrack'),
    modalOverlay: $('#modalOverlay'),
    modalSheet: $('#modalSheet'),
    modalClose: $('#modalClose'),
    modalHeader: $('#modalHeader'),
    modalBody: $('#modalBody'),
    idleBadge: $('#idleBadge'),
  };

  const state = {
    brandId: null,
    categoryId: null,
    filterGroup: 'wszystko',
    activeLayer: 'A',
    idle: false,
  };

  let idleTimer = { last: Date.now(), cycleHandle: null };
  const IDLE_TIMEOUT = 28000;
  const CYCLE_INTERVAL = 7500;

  /* -------------------------------------------------- helpers -------------------------------------------------- */

  function hexToRgba(hex, alpha) {
    const h = hex.replace('#', '');
    const r = parseInt(h.substring(0, 2), 16);
    const g = parseInt(h.substring(2, 4), 16);
    const b = parseInt(h.substring(4, 6), 16);
    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
  }

  function formatNum(n) {
    return n.toLocaleString('pl-PL');
  }

  // Wyciąga z pełnego opisu ważności promocji (np. "01.08.2026 – 31.08.2026
  // lub do wyczerpania stanów magazynowych") samą końcową datę w skróconej
  // formie "do DD.MM.RRRR", żeby zmieścić ją w wąskiej kolumnie ceny.
  function shortValidity(v) {
    if (!v) return '—';
    let m = v.match(/[–-]\s*(\d{2}\.\d{2}\.\d{4})/);
    if (m) return 'do ' + m[1];
    m = v.match(/do\s+(\d{2}\.\d{2}\.\d{4})/);
    if (m) return 'do ' + m[1];
    return v;
  }

  function priceColTitle(cat) {
    const suffix = (cat.priceSuffix || '').toLowerCase();
    if (suffix.includes('produkt')) return 'Wyprzedaż';
    if (suffix.includes('taniej')) return 'Rabat';
    return 'Cena';
  }

  function getBrand(id) {
    return BRANDS[id];
  }

  function findCategory(id) {
    for (const bId of BRAND_ORDER) {
      const cat = BRANDS[bId].categories.find((c) => c.id === id);
      if (cat) return cat;
    }
    return null;
  }

  function currentCategoryList() {
    return getBrand(state.brandId).categories;
  }

  function filteredCategoryList() {
    const list = currentCategoryList();
    if (state.filterGroup === 'wszystko') return list;
    return list.filter((c) => c.group === state.filterGroup);
  }

  function iconMarkup(name) {
    return ICONS[name] || ICONS.accessory;
  }

  function addRipple(target, x, y) {
    const rect = target.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height) * 1.4;
    const span = document.createElement('span');
    span.className = 'ripple';
    span.style.width = span.style.height = size + 'px';
    span.style.left = (x - rect.left - size / 2) + 'px';
    span.style.top = (y - rect.top - size / 2) + 'px';
    const prevPosition = getComputedStyle(target).position;
    if (prevPosition === 'static') target.style.position = 'relative';
    target.style.overflow = target.style.overflow || 'hidden';
    target.appendChild(span);
    span.addEventListener('animationend', () => span.remove());
  }

  function wireRipple(selector) {
    document.addEventListener('pointerdown', (e) => {
      const t = e.target.closest(selector);
      if (t) addRipple(t, e.clientX, e.clientY);
    });
  }

  /* -------------------------------------------------- clock -------------------------------------------------- */

  function tickClock() {
    const now = new Date();
    const hh = String(now.getHours()).padStart(2, '0');
    const mm = String(now.getMinutes()).padStart(2, '0');
    el.clock.textContent = `${hh}:${mm}`;
    const days = ['Niedziela', 'Poniedziałek', 'Wtorek', 'Środa', 'Czwartek', 'Piątek', 'Sobota'];
    const months = ['stycznia', 'lutego', 'marca', 'kwietnia', 'maja', 'czerwca', 'lipca', 'sierpnia', 'września', 'października', 'listopada', 'grudnia'];
    el.clockDate.innerHTML = `${days[now.getDay()]},<br>${now.getDate()}&nbsp;${months[now.getMonth()]}`;
  }

  /* -------------------------------------------------- particles -------------------------------------------------- */

  function spawnParticles() {
    el.particles.innerHTML = '';
    const palette = ['#ffffff', '#bcd9ff', '#ffd9a8', '#c9ffe6'];
    const count = 6;
    for (let i = 0; i < count; i++) {
      const b = document.createElement('div');
      b.className = 'blob';
      const size = 140 + Math.random() * 180;
      b.style.width = size + 'px';
      b.style.height = size + 'px';
      b.style.left = Math.random() * 90 + '%';
      b.style.top = Math.random() * 80 + '%';
      const color = palette[i % palette.length];
      b.style.background = `radial-gradient(circle, ${color} 0%, transparent 70%)`;
      const dur = 22 + Math.random() * 20;
      b.style.animationDuration = dur + 's';
      b.style.animationDelay = (-Math.random() * dur) + 's';
      el.particles.appendChild(b);
    }
  }

  /* -------------------------------------------------- pogoda (7 dni) --------------------------------------------------
     Dane z Open-Meteo (bez klucza API, CORS otwarty). Wynik buforujemy w
     localStorage na WEATHER_TTL, żeby kiosk działający tygodniami nie
     odpytywał API bez potrzeby i żeby ostatnia znana prognoza przetrwała
     chwilowy brak sieci. Każdy błąd jest wyciszany do czytelnego stanu
     zastępczego — pogoda nigdy nie blokuje reszty panelu. */

  const WEATHER_CACHE_KEY = 'ts_weather_cache_v1';
  const WEATHER_TTL = 60 * 60 * 1000;
  const WEATHER_CODE_MAP = {
    0: { icon: 'wSun', label: 'Bezchmurnie' },
    1: { icon: 'wSunCloud', label: 'Prawie bezchmurnie' },
    2: { icon: 'wSunCloud', label: 'Częściowe zachmurzenie' },
    3: { icon: 'wCloud', label: 'Pochmurno' },
    45: { icon: 'wFog', label: 'Mgła' },
    48: { icon: 'wFog', label: 'Mgła osadzająca szadź' },
    51: { icon: 'wRain', label: 'Mżawka słaba' },
    53: { icon: 'wRain', label: 'Mżawka' },
    55: { icon: 'wRain', label: 'Mżawka intensywna' },
    56: { icon: 'wRain', label: 'Marznąca mżawka' },
    57: { icon: 'wRain', label: 'Marznąca mżawka' },
    61: { icon: 'wRain', label: 'Deszcz słaby' },
    63: { icon: 'wRain', label: 'Deszcz' },
    65: { icon: 'wRain', label: 'Deszcz intensywny' },
    66: { icon: 'wRain', label: 'Marznący deszcz' },
    67: { icon: 'wRain', label: 'Marznący deszcz' },
    71: { icon: 'wSnow', label: 'Śnieg słaby' },
    73: { icon: 'wSnow', label: 'Śnieg' },
    75: { icon: 'wSnow', label: 'Śnieg intensywny' },
    77: { icon: 'wSnow', label: 'Śnieg ziarnisty' },
    80: { icon: 'wRain', label: 'Przelotny deszcz' },
    81: { icon: 'wRain', label: 'Przelotny deszcz' },
    82: { icon: 'wRain', label: 'Ulewa' },
    85: { icon: 'wSnow', label: 'Przelotny śnieg' },
    86: { icon: 'wSnow', label: 'Przelotny śnieg' },
    95: { icon: 'wStorm', label: 'Burza' },
    96: { icon: 'wStorm', label: 'Burza z gradem' },
    99: { icon: 'wStorm', label: 'Burza z gradem' },
  };

  function weatherInfo(code) {
    return WEATHER_CODE_MAP[code] || { icon: 'wCloud', label: 'Brak danych' };
  }

  function renderWeather(days) {
    const dayNames = ['Nd', 'Pon', 'Wt', 'Śr', 'Czw', 'Pt', 'Sob'];
    const todayStr = new Date().toISOString().slice(0, 10);
    const daysHtml = days.map((d) => {
      const info = weatherInfo(d.code);
      const isToday = d.date === todayStr;
      const label = isToday ? 'Dziś' : dayNames[new Date(d.date + 'T12:00:00').getDay()];
      return `<div class="weather-day ${isToday ? 'is-today' : ''}" title="${info.label}">
        <span class="wd-label">${label}</span>
        <span class="wd-icon">${ICONS[info.icon]}</span>
        <span class="wd-temp">${d.max}°</span>
      </div>`;
    }).join('');
    el.weatherStrip.innerHTML = `<span class="weather-loc">${WEATHER_LOCATION.name}</span>${daysHtml}`;
  }

  function readWeatherCache() {
    try {
      return JSON.parse(localStorage.getItem(WEATHER_CACHE_KEY) || 'null');
    } catch (e) {
      return null;
    }
  }

  function writeWeatherCache(days) {
    try {
      localStorage.setItem(WEATHER_CACHE_KEY, JSON.stringify({ ts: Date.now(), days }));
    } catch (e) { /* np. tryb prywatny / brak dostępu do storage — pomijamy bez błędu */ }
  }

  async function loadWeather() {
    const cached = readWeatherCache();
    if (cached && Date.now() - cached.ts < WEATHER_TTL) {
      renderWeather(cached.days);
      return;
    }
    try {
      const url = `https://api.open-meteo.com/v1/forecast?latitude=${WEATHER_LOCATION.lat}&longitude=${WEATHER_LOCATION.lon}&daily=weathercode,temperature_2m_max,temperature_2m_min&timezone=Europe%2FWarsaw&forecast_days=7`;
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 8000);
      const res = await fetch(url, { signal: controller.signal });
      clearTimeout(timeoutId);
      if (!res.ok) throw new Error('Weather API error ' + res.status);
      const data = await res.json();
      const days = data.daily.time.map((date, i) => ({
        date,
        code: data.daily.weathercode[i],
        max: Math.round(data.daily.temperature_2m_max[i]),
        min: Math.round(data.daily.temperature_2m_min[i]),
      }));
      writeWeatherCache(days);
      renderWeather(days);
    } catch (err) {
      if (cached && cached.days) {
        renderWeather(cached.days);
      } else {
        el.weatherStrip.innerHTML = '<span class="weather-error">Prognoza pogody niedostępna</span>';
      }
    }
  }

  /* -------------------------------------------------- header / brand switch -------------------------------------------------- */

  function renderBrandSwitch() {
    el.brandSwitch.innerHTML = BRAND_ORDER.map((id) => {
      const b = getBrand(id);
      const icon = renderLogo(b.pillLogo || b.logo, { height: 20, chip: false });
      return `<button class="brand-pill" data-brand="${id}" style="--pill-color:${b.theme.accent}">
        <span class="pill-icon">${icon}</span><span>${b.name}</span>
      </button>`;
    }).join('');

    el.brandSwitch.querySelectorAll('.brand-pill').forEach((btn) => {
      btn.addEventListener('click', () => {
        const id = btn.dataset.brand;
        if (id !== state.brandId) setBrand(id);
        bumpIdle();
      });
    });
    updateBrandSwitchActive();
  }

  function updateBrandSwitchActive() {
    el.brandSwitch.querySelectorAll('.brand-pill').forEach((btn) => {
      btn.classList.toggle('active', btn.dataset.brand === state.brandId);
    });
  }

  function updateBrandHeader() {
    const b = getBrand(state.brandId);
    el.brandLogo.innerHTML = renderLogo(b.headerLogo || b.logo, { height: '100%', chip: false });
  }

  /* -------------------------------------------------- filter row -------------------------------------------------- */

  function renderFilterRow() {
    const list = currentCategoryList();
    const groups = [];
    const seen = new Set();
    list.forEach((c) => {
      if (!seen.has(c.group)) {
        seen.add(c.group);
        groups.push({ id: c.group, label: c.groupLabel });
      }
    });

    if (groups.length <= 1) {
      el.filterRow.style.display = 'none';
      el.filterRow.innerHTML = '';
      return;
    }
    el.filterRow.style.display = 'flex';
    const chips = [{ id: 'wszystko', label: 'Wszystkie' }, ...groups];
    el.filterRow.innerHTML = chips.map((g) =>
      `<button class="filter-chip ${g.id === state.filterGroup ? 'active' : ''}" data-group="${g.id}">${g.label}</button>`
    ).join('');

    el.filterRow.querySelectorAll('.filter-chip').forEach((btn) => {
      btn.addEventListener('click', () => {
        state.filterGroup = btn.dataset.group;
        renderFilterRow();
        renderPromoTiles();
        const visible = filteredCategoryList();
        if (visible.length && !visible.find((c) => c.id === state.categoryId)) {
          setCategory(visible[0].id, { animate: true });
        }
        bumpIdle();
      });
    });
  }

  /* -------------------------------------------------- promo rail -------------------------------------------------- */

  function renderPromoTiles() {
    const list = filteredCategoryList();
    el.promoTrack.innerHTML = list.map((c) => {
      const glowA = hexToRgba(c.glow, 0.22);
      const glowA2 = hexToRgba(c.glow, 0.45);
      const hasImage = !!c.image;
      return `<button class="promo-tile ${c.id === state.categoryId ? 'active' : ''}" data-id="${c.id}"
          style="--glow:${c.glow}; --glow-a:${glowA}; --glow-a2:${glowA2}">
        <span class="tile-image ${hasImage ? 'has-photo' : ''}">
          ${hasImage ? `<img class="tile-photo" src="${c.image}" alt="" draggable="false">` : ''}
          <span class="tile-icon">${iconMarkup(c.icon)}</span>
        </span>
        <span class="tile-label">
          <span class="tile-name">${c.name}</span>
        </span>
      </button>`;
    }).join('');

    el.promoTrack.querySelectorAll('.promo-tile').forEach((tile) => {
      tile.addEventListener('click', () => {
        setCategory(tile.dataset.id, { animate: true });
        bumpIdle();
      });
      // Zepsuty/niedostępny URL zdjęcia — kafel wraca do ikony zamiast
      // pokazywać pustą białą miniaturę.
      const photo = tile.querySelector('.tile-photo');
      if (photo) {
        photo.addEventListener('error', () => {
          tile.querySelector('.tile-image').classList.remove('has-photo');
          photo.remove();
        });
      }
    });
  }

  function updatePromoTileActive() {
    el.promoTrack.querySelectorAll('.promo-tile').forEach((tile) => {
      const active = tile.dataset.id === state.categoryId;
      tile.classList.toggle('active', active);
      if (active) tile.scrollIntoView({ inline: 'center', block: 'nearest', behavior: 'smooth' });
    });
  }

  /* -------------------------------------------------- hero -------------------------------------------------- */

  function setBrand(brandId) {
    state.brandId = brandId;
    state.filterGroup = 'wszystko';
    updateBrandHeader();
    updateBrandSwitchActive();
    renderFilterRow();
    renderPromoTiles();
    const list = currentCategoryList();
    if (list.length) setCategory(list[0].id, { animate: true, instant: true });
  }

  function setCategory(id, opts) {
    opts = opts || {};
    const cat = findCategory(id);
    if (!cat) return;
    state.categoryId = id;
    updatePromoTileActive();
    renderHero(cat, opts);
  }

  function animateNumber(target, endStr) {
    // Znacznik generacji: jeśli w trakcie animacji przyjdzie kolejne
    // wywołanie (np. bardzo szybkie, wielokrotne dotknięcie kafelka),
    // starsza pętla requestAnimationFrame przestaje pisać do DOM zamiast
    // ścigać się z nowszą o tę samą wartość.
    const myId = (target._animId = (target._animId || 0) + 1);
    const clean = endStr.replace(/\s/g, '');
    if (!/^\d+$/.test(clean)) {
      // Wartości z groszami (np. "15899,50") nie animujemy licznikiem,
      // ale i tak formatujemy część całkowitą spacją tysięczną.
      const parts = clean.split(',');
      if (parts.length === 2 && /^\d+$/.test(parts[0])) {
        target.textContent = formatNum(parseInt(parts[0], 10)) + ',' + parts[1];
      } else {
        target.textContent = endStr;
      }
      return;
    }
    const end = parseInt(clean, 10);
    const duration = 750;
    const start = performance.now();
    function step(now) {
      if (target._animId !== myId) return;
      const p = Math.min(1, (now - start) / duration);
      const eased = 1 - Math.pow(1 - p, 3);
      target.textContent = formatNum(Math.round(end * eased));
      if (p < 1) requestAnimationFrame(step);
      else target.textContent = formatNum(end);
    }
    requestAnimationFrame(step);
  }

  function renderHero(cat, opts) {
    // crossfade background
    const glowA = hexToRgba(cat.glow, 0.35);
    const gradient = `radial-gradient(circle at 78% 22%, ${glowA} 0%, transparent 55%), linear-gradient(150deg, ${cat.gradient[0]} 0%, ${cat.gradient[1]} 100%)`;
    const nextLayer = state.activeLayer === 'A' ? el.bgLayerB : el.bgLayerA;
    const prevLayer = state.activeLayer === 'A' ? el.bgLayerA : el.bgLayerB;
    nextLayer.style.backgroundImage = gradient;
    requestAnimationFrame(() => {
      nextLayer.classList.add('active');
      prevLayer.classList.remove('active');
    });
    state.activeLayer = state.activeLayer === 'A' ? 'B' : 'A';

    // card + frame swap animation
    if (!opts.instant) {
      el.heroCard.classList.remove('swap');
      void el.heroCard.offsetWidth;
      el.heroCard.classList.add('swap');
      el.visualFrame.classList.remove('swap');
      void el.visualFrame.offsetWidth;
      el.visualFrame.classList.add('swap');
    }

    el.heroKicker.textContent = cat.kicker || '';
    el.heroTitle.textContent = cat.name;
    el.heroTitle.classList.remove('title-md', 'title-sm');
    if (cat.name.length > 30) el.heroTitle.classList.add('title-sm');
    else if (cat.name.length > 19) el.heroTitle.classList.add('title-md');
    el.heroTagline.textContent = cat.description || cat.tagline || '';

    el.heroBadges.innerHTML = (cat.badges || []).map((b) =>
      `<span class="badge">${iconMarkup(b.icon)}<span>${b.text}</span></span>`
    ).join('');

    // Kolumna 1: właściwa cena/wskaźnik promocji (zawsze z danych kategorii).
    el.priceLabel.textContent = priceColTitle(cat);
    el.pricePrefix.textContent = cat.priceLabel || '';
    animateNumber(el.priceNumber, cat.priceValue || '');
    el.priceSuffix.textContent = cat.priceSuffix ? ' ' + cat.priceSuffix : '';
    el.priceCaption1.textContent = 'Ceny netto dla firm HVAC';

    // Kolumna 2: dla pakietów pokazujemy kwotę oszczędności, dla
    // pozostałych promocji — skróconą datę ważności oferty.
    const isBundle = cat.detail && cat.detail.type === 'bundle';
    if (isBundle) {
      const variants = cat.detail.variants;
      el.priceLabel2.textContent = 'Oszczędzasz';
      el.priceValue2.textContent = variants[0].savings;
      el.priceCaption2.textContent = variants.length > 1 ? 'w zależności od wariantu' : 'w tym pakiecie';
    } else {
      el.priceLabel2.textContent = 'Ważność oferty';
      el.priceValue2.textContent = shortValidity(cat.validity);
      el.priceCaption2.textContent = (cat.validity || '').includes('wyczerpania') ? 'lub do wyczerpania zapasów' : '';
    }

    // bez białej plakietki: logo marki (Rotenso/LG) jest już samo w sobie
    // kolorowym, samodzielnym znakiem — nie potrzebuje jasnego tła pod spodem
    el.heroBrandChip.innerHTML = cat.brand ? renderLogo(cat.brand, { height: 50, chip: false }) : '';

    el.visualGlow.style.setProperty('--glow', cat.glow);

    // Docelowo zdjęcie produktu (URL podany przez handlowca w danych
    // promocji, pole `cat.image`, zwykle na białym tle); dopóki go nie ma,
    // w ramce widać wyszarzoną ikonę jako placeholder. Ramka dopasowuje
    // swój kształt do naturalnych proporcji wczytanego zdjęcia
    // (.has-photo), więc różne ratio zdjęć nie są kadrowane ani rozciągane.
    function showPlaceholderIcon() {
      el.visualFrame.classList.remove('has-photo');
      el.heroPhoto.style.display = 'none';
      el.heroIcon.style.display = '';
      el.heroIcon.innerHTML = iconMarkup(cat.icon);
    }
    if (cat.image) {
      el.heroPhoto.onerror = showPlaceholderIcon;
      el.heroPhoto.onload = () => el.visualFrame.classList.add('has-photo');
      el.heroPhoto.src = cat.image;
      el.heroPhoto.style.display = 'block';
      el.heroIcon.style.display = 'none';
    } else {
      el.heroPhoto.onerror = null;
      el.heroPhoto.onload = null;
      el.heroPhoto.removeAttribute('src');
      showPlaceholderIcon();
    }

    el.btnDetails.onclick = () => openModal(cat);
  }

  /* -------------------------------------------------- modal -------------------------------------------------- */

  function renderTable(columns, rows) {
    const lastIdx = columns.length - 1;
    const oldIdx = columns.findIndex((c) => /stara cena/i.test(c));
    const thead = `<tr>${columns.map((c) => `<th>${c}</th>`).join('')}</tr>`;
    const tbody = rows.map((r) => `<tr>${r.map((val, i) => {
      let cls = '';
      let content = val;
      if (i === oldIdx) { cls = ''; content = `<span class="old-price">${val}</span>`; }
      if (i === lastIdx) cls = 'price-cell';
      return `<td class="${cls}">${content}</td>`;
    }).join('')}</tr>`).join('');
    return `<div class="table-scroll"><table class="promo-table"><thead>${thead}</thead><tbody>${tbody}</tbody></table></div>`;
  }

  function renderModalBody(cat) {
    const d = cat.detail;
    if (!d) return '';

    if (d.type === 'simple-list') {
      return `
        ${d.note ? `<div class="m-note">${d.note}</div>` : ''}
        <ul class="m-list">${(d.items || []).map((i) => `<li>${i}</li>`).join('')}</ul>
        ${d.footnote ? `<div class="m-footnote">${d.footnote}</div>` : ''}
      `;
    }

    if (d.type === 'pricetable') {
      return `
        ${d.note ? `<div class="m-note">${d.note}</div>` : ''}
        ${renderTable(d.columns, d.rows)}
        ${d.footnote ? `<div class="m-footnote">${d.footnote}</div>` : ''}
      `;
    }

    if (d.type === 'pricetable-filtered') {
      const wrapperId = 'flt_' + cat.id;
      setTimeout(() => wireFilteredTable(cat), 0);
      return `
        <div class="search-row">
          <div class="filter-row" id="${wrapperId}_chips" style="overflow:visible;padding:0;">
            ${d.filters.map((f, i) => `<button class="filter-chip ${i === 0 ? 'active' : ''}" data-fg="${f.id}">${f.label}</button>`).join('')}
          </div>
          <input class="search-box" id="${wrapperId}_search" placeholder="Szukaj po kodzie lub nazwie…">
          <span class="result-count" id="${wrapperId}_count"></span>
        </div>
        <div id="${wrapperId}_table"></div>
        ${d.footnote ? `<div class="m-footnote">${d.footnote}</div>` : ''}
      `;
    }

    if (d.type === 'bundle') {
      const variantsHtml = d.variants.map((v) => `
        <div class="variant-card">
          <span class="v-label">${v.label}</span>
          <span class="v-old">${v.oldPrice}</span>
          <span class="v-new">${v.newPrice}</span>
          <span class="v-save">oszczędzasz ${v.savings}</span>
        </div>
      `).join('');

      const accHtml = d.accessories.map((a) => `
        <div class="acc-item">
          ${a.brand ? renderLogo(a.brand, { height: 18 }) : `<span class="brand-chip"><span class="text-logo" style="font-size:.7rem;">HVAC</span></span>`}
          <div>
            <div class="a-name">${a.name}</div>
            <div class="a-code">${a.code}</div>
          </div>
        </div>
      `).join('');

      return `
        <div class="bundle-grid">
          <div class="bundle-main">
            <span class="b-icon">${iconMarkup(cat.icon)}</span>
            <div>
              <div class="b-name">${d.mainItem.name}</div>
              <div class="b-code">${d.mainItem.code}</div>
            </div>
            ${d.mainItem.brand ? renderLogo(d.mainItem.brand, { height: 24 }) : ''}
          </div>
        </div>
        <div class="variant-row">${variantsHtml}</div>
        <div class="acc-title">W zestawie</div>
        <div class="acc-grid">${accHtml}</div>
      `;
    }

    return '';
  }

  function wireFilteredTable(cat) {
    const d = cat.detail;
    const wrapperId = 'flt_' + cat.id;
    const chipsWrap = document.getElementById(`${wrapperId}_chips`);
    const search = document.getElementById(`${wrapperId}_search`);
    const tableWrap = document.getElementById(`${wrapperId}_table`);
    const countEl = document.getElementById(`${wrapperId}_count`);
    if (!chipsWrap || !search || !tableWrap) return;

    let group = d.filters[0].id;

    function draw() {
      const q = search.value.trim().toLowerCase();
      const rows = d.rows.filter((r) => {
        const groupOk = group === 'wszystko' ? true : r.type === group;
        const qOk = !q || r.name.toLowerCase().includes(q) || r.code.toLowerCase().includes(q);
        return groupOk && qOk;
      });
      countEl.textContent = `${rows.length} / ${d.rows.length} pozycji`;
      tableWrap.innerHTML = renderTable(d.columns, rows.map((r) => [r.code, r.name, r.price]));
    }

    chipsWrap.querySelectorAll('.filter-chip').forEach((btn) => {
      btn.addEventListener('click', () => {
        chipsWrap.querySelectorAll('.filter-chip').forEach((b) => b.classList.remove('active'));
        btn.classList.add('active');
        group = btn.dataset.fg;
        draw();
      });
    });
    search.addEventListener('input', draw);
    draw();
  }

  function openModal(cat) {
    el.modalHeader.innerHTML = `
      <span class="m-icon">${iconMarkup(cat.icon)}</span>
      <div class="m-titles">
        <h2>${cat.name}</h2>
        <div class="m-sub">${cat.kicker || ''}</div>
      </div>
    `;
    el.modalBody.innerHTML = renderModalBody(cat);
    el.modalBody.scrollTop = 0;
    el.modalOverlay.classList.add('open');
    pauseIdleForModal(true);
  }

  function closeModal() {
    el.modalOverlay.classList.remove('open');
    pauseIdleForModal(false);
  }

  /* -------------------------------------------------- idle / attract mode -------------------------------------------------- */

  let modalOpenLock = false;

  function pauseIdleForModal(isOpen) {
    modalOpenLock = isOpen;
    bumpIdle();
  }

  function bumpIdle() {
    idleTimer.last = Date.now();
    if (state.idle) exitIdle();
  }

  function enterIdle() {
    state.idle = true;
    el.idleBadge.classList.add('show');
    idleTimer.cycleHandle = setInterval(() => {
      const list = filteredCategoryList().length ? filteredCategoryList() : currentCategoryList();
      const idx = list.findIndex((c) => c.id === state.categoryId);
      const next = list[(idx + 1) % list.length];
      setCategory(next.id, { animate: true });
    }, CYCLE_INTERVAL);
  }

  function exitIdle() {
    state.idle = false;
    el.idleBadge.classList.remove('show');
    if (idleTimer.cycleHandle) {
      clearInterval(idleTimer.cycleHandle);
      idleTimer.cycleHandle = null;
    }
  }

  function idleWatcher() {
    setInterval(() => {
      if (modalOpenLock) return;
      if (!state.idle && Date.now() - idleTimer.last > IDLE_TIMEOUT) enterIdle();
    }, 1000);
  }

  // Udostępnione na zewnątrz (js/products.js), żeby okno wyszukiwarki
  // parametrów produktowych mogło korzystać z tego samego mechanizmu
  // wstrzymywania trybu prezentacji co modal promocji.
  window.KioskIdle = { pause: pauseIdleForModal, bump: bumpIdle };

  /* -------------------------------------------------- events -------------------------------------------------- */

  function wireGlobalInteractionReset() {
    ['pointerdown', 'wheel'].forEach((evt) => {
      document.addEventListener(evt, () => bumpIdle(), { passive: true });
    });
  }

  function wirePromoNav() {
    el.promoPrev.addEventListener('click', () => { el.promoTrackWrap.scrollBy({ left: -380, behavior: 'smooth' }); bumpIdle(); });
    el.promoNext.addEventListener('click', () => { el.promoTrackWrap.scrollBy({ left: 380, behavior: 'smooth' }); bumpIdle(); });
  }

  function wireModal() {
    el.modalClose.addEventListener('click', closeModal);
    el.modalOverlay.addEventListener('click', (e) => {
      if (e.target === el.modalOverlay) closeModal();
    });
  }

  /* -------------------------------------------------- init -------------------------------------------------- */

  // Skrót testowy/demonstracyjny: otwarcie panelu pod adresem
  // index.html#brand=lg&cat=lg-clearance&modal=1 ustawi od razu wskazaną
  // markę / kategorię (i opcjonalnie otworzy jej okno szczegółów), bez
  // przechodzenia najpierw przez domyślną kategorię. Przydatne do
  // szybkiego pokazania konkretnej promocji handlowcowi.
  function readStartHash() {
    const raw = location.hash.replace(/^#/, '');
    const params = new URLSearchParams(raw);
    return { brand: params.get('brand'), cat: params.get('cat'), modal: params.get('modal') };
  }

  function init() {
    el.promoPrev.innerHTML = ICONS.chevronLeft;
    el.promoNext.innerHTML = ICONS.chevronRight;
    el.modalClose.innerHTML = ICONS.close;
    el.monthBadge.innerHTML = `Promocje<br>${MONTH_LABEL}`;

    renderBrandSwitch();
    spawnParticles();

    const hash = readStartHash();
    state.brandId = (hash.brand && BRANDS[hash.brand]) ? hash.brand : BRAND_ORDER[0];
    updateBrandHeader();
    updateBrandSwitchActive();
    renderFilterRow();
    renderPromoTiles();

    const startCat = (hash.cat && findCategory(hash.cat)) ? hash.cat : currentCategoryList()[0].id;
    setCategory(startCat, { instant: true });
    if (hash.modal) {
      const c = findCategory(startCat);
      if (c) openModal(c);
    }

    tickClock();
    setInterval(tickClock, 15000);

    loadWeather();
    setInterval(loadWeather, WEATHER_TTL);

    wirePromoNav();
    wireModal();
    wireRipple('.btn-hero, .promo-tile, .promo-nav, .filter-chip, .brand-pill, .modal-close, .btn-products, .product-card, .products-back, .products-close');
    wireGlobalInteractionReset();
    idleWatcher();
  }

  document.addEventListener('DOMContentLoaded', init);
})();
