/* ============================================================================
   PRODUCTS.JS — wyszukiwarka "Parametry produktowe".
   Dane pochodzą z js/products.json, generowanego z feeda B2B Thermosilesii
   przez tools/build_products.py (patrz INSTRUKCJA_AKTUALIZACJI.md).
   ============================================================================ */

(function () {
  'use strict';

  const $ = (sel) => document.querySelector(sel);

  const el = {
    btnProducts: $('#btnProducts'),
    overlay: $('#productsOverlay'),
    sheet: $('#productsSheet'),
    back: $('#productsBack'),
    close: $('#productsClose'),
    search: $('#productsSearch'),
    count: $('#productsCount'),
    body: $('#productsBody'),
    grid: $('#productsGrid'),
    detail: $('#productDetail'),
  };

  const MAX_RESULTS = 90;

  let allProducts = null;
  let loadPromise = null;
  let activeProduct = null;

  function formatPrice(value, currency) {
    if (value === null || value === undefined) return null;
    const num = value.toLocaleString('pl-PL', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    return `${num} ${currency === 'PLN' || !currency ? 'zł' : currency}`;
  }

  function loadProducts() {
    if (loadPromise) return loadPromise;
    loadPromise = fetch('js/products.json')
      .then((res) => {
        if (!res.ok) throw new Error('products.json ' + res.status);
        return res.json();
      })
      .then((data) => { allProducts = data; return data; })
      .catch((err) => {
        loadPromise = null;
        throw err;
      });
    return loadPromise;
  }

  function matches(p, q) {
    if (!q) return true;
    return (p.name && p.name.toLowerCase().includes(q))
      || (p.symbol && p.symbol.toLowerCase().includes(q))
      || (p.producer && p.producer.toLowerCase().includes(q))
      || (p.category && p.category.toLowerCase().includes(q));
  }

  function search(q) {
    const query = (q || '').trim().toLowerCase();
    if (!query) {
      return { results: allProducts.slice(0, MAX_RESULTS), total: allProducts.length, empty: true };
    }
    const results = [];
    let total = 0;
    for (const p of allProducts) {
      if (matches(p, query)) {
        total++;
        if (results.length < MAX_RESULTS) results.push(p);
      }
    }
    return { results, total, empty: false };
  }

  function photoMarkup(product, size) {
    const img = product.image;
    if (img) {
      return `<img src="${img}" alt="" draggable="false" onerror="this.replaceWith(Object.assign(document.createElement('span'),{className:'pc-icon',innerHTML:ICONS.box}))">`;
    }
    return `<span class="pc-icon">${ICONS.box}</span>`;
  }

  function renderGrid(state) {
    el.detail.hidden = true;
    el.detail.innerHTML = '';
    el.grid.hidden = false;
    el.back.hidden = true;

    if (state.empty) {
      el.count.textContent = `${state.total} produktów w bazie`;
    } else if (state.total === 0) {
      el.count.textContent = 'Brak wyników';
    } else {
      el.count.textContent = state.total > MAX_RESULTS
        ? `Pokazuję pierwsze ${MAX_RESULTS} z ${state.total} wyników`
        : `${state.total} ${state.total === 1 ? 'wynik' : 'wyników'}`;
    }

    if (state.results.length === 0) {
      el.grid.innerHTML = `<div class="products-empty">Nic nie znaleziono. Spróbuj innej nazwy, symbolu lub producenta.</div>`;
      return;
    }

    el.grid.innerHTML = state.results.map((p) => {
      const price = formatPrice(p.price, p.currency);
      return `<button class="product-card" data-id="${p.id}">
        <span class="pc-photo">${photoMarkup(p)}</span>
        <span class="pc-name">${p.name}</span>
        <span class="pc-meta">${[p.symbol, p.producer].filter(Boolean).join(' · ')}</span>
        <span class="pc-price ${price ? '' : 'no-price'}">${price || 'brak ceny'}</span>
      </button>`;
    }).join('');

    el.grid.querySelectorAll('.product-card').forEach((card) => {
      card.addEventListener('click', () => {
        const p = allProducts.find((pr) => pr.id === card.dataset.id);
        if (p) openDetail(p);
        if (window.KioskIdle) window.KioskIdle.bump();
      });
    });
  }

  function specGroups(specs) {
    const order = [];
    const map = new Map();
    (specs || []).forEach((s) => {
      const key = s.group || '';
      if (!map.has(key)) { map.set(key, []); order.push(key); }
      map.get(key).push(s);
    });
    return order.map((key) => ({ label: key || 'Parametry ogólne', items: map.get(key) }));
  }

  function stockInfo(stock) {
    if (!stock || stock <= 0) return { text: 'Brak w magazynie', cls: 'out' };
    if (stock < 5) return { text: `Ostatnie sztuki (${Math.round(stock)} szt.)`, cls: 'low' };
    return { text: `Dostępne (${Math.round(stock)} szt.)`, cls: '' };
  }

  function escapeHtml(str) {
    return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  }

  function descriptionHtml(desc) {
    return desc.split('\n').filter(Boolean).map((line) => `<p>${escapeHtml(line)}</p>`).join('');
  }

  function renderDetail(p) {
    const price = formatPrice(p.price, p.currency);
    const netPrice = formatPrice(p.netPrice, p.currency);
    const gallery = (p.gallery && p.gallery.length) ? p.gallery : (p.image ? [p.image] : []);
    const stock = stockInfo(p.stock);
    const groups = specGroups(p.specs);

    const galleryHtml = gallery.length > 1 ? `<div class="pd-gallery">${gallery.map((g, i) =>
      `<img src="${g}" data-src="${g}" class="${i === 0 ? 'active' : ''}" alt="">`
    ).join('')}</div>` : '';

    const mainPhoto = gallery.length
      ? `<img id="pdMainPhoto" src="${gallery[0]}" alt="" onerror="this.replaceWith(Object.assign(document.createElement('span'),{className:'pc-icon',innerHTML:ICONS.box}))">`
      : `<span class="pc-icon">${ICONS.box}</span>`;

    const hasSpecs = groups.length > 0;
    const specsTitle = hasSpecs || !p.description ? 'Parametry techniczne' : 'Opis';
    const specsHtml = hasSpecs
      ? groups.map((g) => `
        <div class="pd-spec-group">
          <div class="pd-spec-group-name">${g.label}</div>
          <table class="pd-spec-table">${g.items.map((it) => `<tr><td>${it.name}</td><td>${it.value}</td></tr>`).join('')}</table>
        </div>
      `).join('')
      : (p.description
        ? `<div class="pd-description">${descriptionHtml(p.description)}</div>`
        : `<div class="pd-no-specs">Brak szczegółowych parametrów dla tego produktu.</div>`);

    el.detail.innerHTML = `
      <div class="product-detail-inner">
        <div>
          <div class="pd-photo">${mainPhoto}</div>
          ${galleryHtml}
        </div>
        <div class="pd-info">
          <h2 class="pd-name">${p.name}</h2>
          <div class="pd-meta">${[p.symbol, p.producer, p.category].filter(Boolean).join(' · ')}</div>
          <div class="pd-price-row">
            <span class="pd-price">${price || 'brak ceny'}</span>
            ${netPrice ? `<span class="pd-net">netto: ${netPrice}</span>` : ''}
          </div>
          <div class="pd-stock ${stock.cls}">${stock.text}</div>
        </div>
      </div>
      <div class="pd-specs-title">${specsTitle}</div>
      ${specsHtml}
    `;

    const mainImg = el.detail.querySelector('#pdMainPhoto');
    el.detail.querySelectorAll('.pd-gallery img').forEach((thumb) => {
      thumb.addEventListener('click', () => {
        el.detail.querySelectorAll('.pd-gallery img').forEach((t) => t.classList.remove('active'));
        thumb.classList.add('active');
        if (mainImg) mainImg.src = thumb.dataset.src;
      });
    });
  }

  function openDetail(p) {
    activeProduct = p;
    el.grid.hidden = true;
    el.detail.hidden = false;
    el.back.hidden = false;
    el.body.scrollTop = 0;
    renderDetail(p);
  }

  function backToGrid() {
    activeProduct = null;
    renderGrid(search(el.search.value));
    el.body.scrollTop = 0;
  }

  function runSearch() {
    if (!allProducts) return;
    renderGrid(search(el.search.value));
  }

  function openOverlay() {
    el.overlay.classList.add('open');
    if (window.KioskIdle) window.KioskIdle.pause(true);
    el.grid.innerHTML = `<div class="products-empty">Wczytuję katalog produktów…</div>`;
    el.detail.hidden = true;
    el.back.hidden = true;
    loadProducts().then(() => {
      runSearch();
      el.search.focus();
    }).catch(() => {
      el.grid.innerHTML = `<div class="products-empty">Nie udało się wczytać katalogu produktów. Sprawdź połączenie z siecią i spróbuj ponownie.</div>`;
    });
  }

  function closeOverlay() {
    el.overlay.classList.remove('open');
    if (window.KioskIdle) window.KioskIdle.pause(false);
  }

  function init() {
    el.btnProducts.querySelector('.btn-products-icon').innerHTML = ICONS.search;
    el.back.innerHTML = ICONS.chevronLeft;
    el.close.innerHTML = ICONS.close;
    el.detail.hidden = true;

    el.btnProducts.addEventListener('click', openOverlay);
    el.close.addEventListener('click', closeOverlay);
    el.back.addEventListener('click', backToGrid);
    el.overlay.addEventListener('click', (e) => {
      if (e.target === el.overlay) closeOverlay();
    });
    el.search.addEventListener('input', () => {
      if (!activeProduct) runSearch();
    });
  }

  document.addEventListener('DOMContentLoaded', init);
})();
