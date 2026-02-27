/**
 * WatchGuard Configurator – Partner Site Integration
 * ===================================================
 *
 * WHAT THIS FILE DOES
 * -------------------
 * This single script, loaded on the Leader Systems partner site, provides
 * TWO integration points for the WatchGuard Product Configurator:
 *
 *   1. AUTO-SEARCH  – When the configurator redirects a user to the partner
 *      site to "View Product Page", this script reads a localStorage flag
 *      and auto-populates the search bar with the SKU.
 *
 *   2. ADD-TO-CART BRIDGE  – When the configurator opens the shopping-cart
 *      page with a special #wg-add hash (e.g. shoppingcart.html#wg-add=102373:1,102554:1),
 *      this script reads the hash, calls the site's own AddToCart API for
 *      each product, and refreshes the cart page to show the results.
 *
 *      It also listens for window.postMessage from the configurator (when
 *      it is embedded as an iframe on the partner site) so the add-to-cart
 *      flow works in both standalone and embedded modes.
 *
 * HOW TO INSTALL (one-time admin setup)
 * --------------------------------------
 * Add this script tag to the partner site's global template / footer,
 * or at minimum to the shopping-cart page:
 *
 *   <script src="https://leadermarketing.github.io/WatchGuardBOM/configurator-integration.js"></script>
 *
 * No browser extensions or per-user setup required.
 */

(function () {
  'use strict';

  // ─── CONFIGURATOR ORIGIN (allowed postMessage sources) ───
  var CONFIGURATOR_ORIGINS = [
    'https://leadermarketing.github.io',
    'http://localhost:5173',   // Vite dev server
    'http://localhost:4173',   // Vite preview
  ];

  // ===========================================================
  //  PART 1 – AUTO-SEARCH (localStorage-based SKU lookup)
  // ===========================================================
  function handleAutoSearch() {
    var pendingSku = localStorage.getItem('watchguard_configurator_sku');
    var shouldSearch = localStorage.getItem('watchguard_configurator_search');

    if (!pendingSku || shouldSearch !== 'true') return;

    // Clear immediately so a refresh doesn't re-trigger
    localStorage.removeItem('watchguard_configurator_sku');
    localStorage.removeItem('watchguard_configurator_search');

    var initSearch = function () {
      var searchInput =
        document.querySelector('input[type="search"]') ||
        document.querySelector('input[name="search"]') ||
        document.querySelector('input[placeholder*="Search"]') ||
        document.querySelector('#searchInput') ||
        document.querySelector('.search-input');

      if (searchInput) {
        searchInput.value = pendingSku;
        searchInput.focus();
        searchInput.dispatchEvent(new Event('input', { bubbles: true }));
        searchInput.dispatchEvent(new Event('change', { bubbles: true }));

        var searchButton =
          document.querySelector('button[type="submit"]') ||
          document.querySelector('.search-button') ||
          document.querySelector('#searchButton');

        if (searchButton) {
          setTimeout(function () { searchButton.click(); }, 100);
        } else {
          var form = searchInput.closest('form');
          if (form) setTimeout(function () { form.submit(); }, 100);
        }
        console.log('[WG Configurator] Auto-searching for SKU:', pendingSku);
      } else {
        showBanner('Search for: <strong>' + pendingSku + '</strong><br><small>Paste this SKU in the search bar</small>');
      }
    };

    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', initSearch);
    } else {
      initSearch();
    }
  }

  // ===========================================================
  //  PART 2 – ADD-TO-CART BRIDGE
  // ===========================================================

  // ── Parse items from a "pid:qty,pid:qty" string ──
  function parseItemPayload(payload) {
    if (!payload) return [];
    return payload.split(',').map(function (entry) {
      var parts = entry.split(':');
      return { productId: parts[0].trim(), qty: parseInt(parts[1], 10) || 1 };
    }).filter(function (item) {
      return item.productId && !isNaN(parseInt(item.productId, 10));
    });
  }

  // ── UI helpers ──
  function showBanner(html, duration) {
    var banner = document.createElement('div');
    banner.style.cssText =
      'position:fixed;top:20px;left:50%;transform:translateX(-50%);' +
      'background:#e81410;color:white;padding:15px 25px;border-radius:8px;' +
      'font-family:sans-serif;font-size:14px;z-index:10000;' +
      'box-shadow:0 4px 12px rgba(0,0,0,0.2);text-align:center;';
    banner.innerHTML = html;
    document.body.appendChild(banner);
    setTimeout(function () { banner.remove(); }, duration || 8000);
  }

  function createOverlay() {
    var overlay = document.createElement('div');
    overlay.id = 'wg-cart-overlay';
    overlay.style.cssText =
      'position:fixed;top:0;left:0;width:100%;height:100%;' +
      'background:rgba(0,0,0,0.6);z-index:999999;display:flex;' +
      'align-items:center;justify-content:center;font-family:Arial,sans-serif;';

    var box = document.createElement('div');
    box.style.cssText =
      'background:#fff;border-radius:12px;padding:32px 40px;max-width:420px;' +
      'width:90%;box-shadow:0 8px 32px rgba(0,0,0,0.3);text-align:center;';

    var logo = document.createElement('div');
    logo.style.cssText = 'font-size:14px;color:#888;margin-bottom:12px;letter-spacing:1px;';
    logo.textContent = 'WATCHGUARD CONFIGURATOR';

    var title = document.createElement('h2');
    title.id = 'wg-cart-title';
    title.style.cssText = 'margin:0 0 16px;font-size:20px;color:#222;';
    title.textContent = 'Adding items to cart\u2026';

    var status = document.createElement('div');
    status.id = 'wg-cart-status';
    status.style.cssText = 'font-size:14px;color:#555;line-height:1.8;';

    box.appendChild(logo);
    box.appendChild(title);
    box.appendChild(status);
    overlay.appendChild(box);
    document.body.appendChild(overlay);
    return { overlay: overlay, title: title, status: status };
  }

  function addStatusLine(container, text, type) {
    var line = document.createElement('div');
    var icon = type === 'ok' ? '\u2713' : type === 'err' ? '\u2717' : '\u23F3';
    var color = type === 'ok' ? '#2e7d32' : type === 'err' ? '#c62828' : '#555';
    line.style.cssText = 'color:' + color + ';';
    line.textContent = icon + '  ' + text;
    container.appendChild(line);
  }

  // ── Wait for the partner site's JS globals ──
  function waitForGlobals(callback) {
    var attempts = 0;
    var maxAttempts = 40; // 10 seconds

    function check() {
      attempts++;
      /* global C, PopUpContainer, Ajax, Path */
      if (typeof C !== 'undefined' && C.UserCode &&
          typeof PopUpContainer !== 'undefined' &&
          typeof Ajax !== 'undefined' &&
          typeof Path !== 'undefined') {
        callback(null);
        return;
      }
      if (attempts >= maxAttempts) {
        callback(new Error('Site JS did not load in time. Are you logged in?'));
        return;
      }
      setTimeout(check, 250);
    }
    check();
  }

  // ── Add a single product via the partner site API ──
  function addOneItem(userCode, productId, qty) {
    return new Promise(function (resolve) {
      var data =
        'DealerCode=' + encodeURIComponent(userCode) +
        '&ProductID=' + encodeURIComponent(productId) +
        '&Qty=' + encodeURIComponent(qty);

      var xhr = new XMLHttpRequest();
      xhr.open('POST', Path + '/AddToCart', true);
      xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
      xhr.onreadystatechange = function () {
        if (xhr.readyState === 4) {
          if (xhr.status === 200) {
            var resp = xhr.responseText || '';
            if (resp.indexOf('Please Log off') !== -1) {
              resolve({ ok: false, error: 'Session expired \u2014 please log in again.' });
            } else if (resp.indexOf('Product exist in cart') !== -1) {
              resolve({ ok: true, note: 'Already in cart' });
            } else {
              resolve({ ok: true });
            }
          } else {
            resolve({ ok: false, error: 'HTTP ' + xhr.status });
          }
        }
      };
      xhr.send(data);
    });
  }

  // ── Process an array of {productId, qty} items ──
  function processCartItems(items) {
    console.log('[WG Configurator] Add-to-cart triggered for', items.length, 'item(s):', items);

    var ui = createOverlay();

    waitForGlobals(function (err) {
      if (err) {
        ui.title.textContent = 'Not logged in';
        ui.title.style.color = '#c62828';
        addStatusLine(ui.status, err.message, 'err');
        addStatusLine(ui.status, 'Please log in and try again.', 'err');
        setTimeout(function () { ui.overlay.remove(); }, 5000);
        return;
      }

      var userCode = C.UserCode;
      var failed = 0;

      function next(index) {
        if (index >= items.length) {
          ui.title.textContent = failed === 0 ? 'All items added!' : 'Completed with errors';
          ui.title.style.color = failed === 0 ? '#2e7d32' : '#e65100';

          var summary = document.createElement('div');
          summary.style.cssText = 'margin-top:16px;font-size:13px;color:#888;';
          summary.textContent = 'Refreshing cart in 2 seconds\u2026';
          ui.status.appendChild(summary);

          setTimeout(function () {
            window.location.href = 'https://partner.leadersystems.com.au/shoppingcart.html';
          }, 2000);
          return;
        }

        var item = items[index];
        addStatusLine(ui.status, 'Adding product #' + item.productId + ' (qty: ' + item.qty + ')\u2026', 'pending');

        addOneItem(userCode, item.productId, item.qty).then(function (result) {
          var lines = ui.status.children;
          var lastLine = lines[lines.length - 1];

          if (result.ok) {
            lastLine.style.color = '#2e7d32';
            lastLine.textContent = '\u2713  Product #' + item.productId + (result.note ? ' (' + result.note + ')' : ' added');
          } else {
            failed++;
            lastLine.style.color = '#c62828';
            lastLine.textContent = '\u2717  Product #' + item.productId + ' \u2014 ' + result.error;
          }

          next(index + 1);
        });
      }

      next(0);
    });
  }

  // ── Trigger: URL hash  #wg-add=pid:qty,pid:qty ──
  function handleHashTrigger() {
    var hash = window.location.hash;
    if (!hash.includes('wg-add=')) return false;

    var payload = hash.split('wg-add=')[1];
    var items = parseItemPayload(payload);
    if (items.length === 0) return false;

    // Clean hash so a refresh doesn't re-trigger
    history.replaceState(null, '', window.location.pathname + window.location.search);

    processCartItems(items);
    return true;
  }

  // ── Trigger: postMessage from the configurator (for iframe mode) ──
  function handlePostMessage() {
    window.addEventListener('message', function (event) {
      // Verify the sender origin
      if (CONFIGURATOR_ORIGINS.indexOf(event.origin) === -1) return;

      var data = event.data;
      if (!data || data.type !== 'wg-add-to-cart' || !Array.isArray(data.items)) return;

      var items = data.items.filter(function (item) {
        return item.productId && !isNaN(parseInt(item.productId, 10));
      });

      if (items.length > 0) {
        processCartItems(items);
      }
    });
  }

  // ===========================================================
  //  INIT
  // ===========================================================
  function init() {
    // Always listen for postMessage (iframe mode)
    handlePostMessage();

    // Try hash-based add-to-cart first; if not triggered, try auto-search
    if (!handleHashTrigger()) {
      handleAutoSearch();
    }
  }

  if (document.readyState === 'complete') {
    init();
  } else {
    window.addEventListener('load', init);
  }
})();
