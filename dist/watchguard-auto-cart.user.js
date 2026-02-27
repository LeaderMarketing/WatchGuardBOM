// ==UserScript==
// @name         WatchGuard Configurator - Add to Cart Bridge (DEV/TEST ONLY)
// @namespace    https://leadermarketing.github.io/WatchGuard/
// @version      2.1
// @description  DEV FALLBACK — Use configurator-integration.js on the partner site instead. This Tampermonkey userscript provides the same add-to-cart bridge for local testing when you cannot modify the partner site yet.
// @author       Leader Systems
// @match        https://partner.leadersystems.com.au/*
// @grant        none
// @run-at       document-end
// ==/UserScript==

(function () {
  'use strict';

  // ── Hash format: #wg-add=productId:qty,productId:qty ──
  var hash = window.location.hash;
  if (!hash.includes('wg-add=')) return;

  var payload = hash.split('wg-add=')[1];
  if (!payload) return;

  var items = payload.split(',').map(function (entry) {
    var parts = entry.split(':');
    return { productId: parts[0], qty: parseInt(parts[1], 10) || 1 };
  }).filter(function (item) {
    return item.productId && !isNaN(parseInt(item.productId, 10));
  });

  if (items.length === 0) return;

  console.log('[WG Configurator] Add-to-cart triggered for', items.length, 'item(s):', items);

  // ── UI: overlay with progress ──
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
    title.textContent = 'Adding items to cart...';

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
    var icon = type === 'ok' ? '✓' : type === 'err' ? '✗' : '⏳';
    var color = type === 'ok' ? '#2e7d32' : type === 'err' ? '#c62828' : '#555';
    line.style.cssText = 'color:' + color + ';';
    line.textContent = icon + '  ' + text;
    container.appendChild(line);
  }

  // ── Wait for page JS to initialise (C, PopUpContainer, Ajax, Path) ──
  function waitForGlobals(callback) {
    var attempts = 0;
    var maxAttempts = 40; // 10 seconds

    function check() {
      attempts++;
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

  // ── Add one product via the site API ──
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
              resolve({ ok: false, error: 'Session expired — please log in again.' });
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

  // ── Main sequence ──
  function run() {
    // Clean the hash immediately so a refresh doesn't re-trigger
    history.replaceState(null, '', window.location.pathname + window.location.search);

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
      var completed = 0;
      var failed = 0;

      // Process items sequentially
      function next(index) {
        if (index >= items.length) {
          // All done
          ui.title.textContent = failed === 0 ? 'All items added!' : 'Completed with errors';
          ui.title.style.color = failed === 0 ? '#2e7d32' : '#e65100';

          var summary = document.createElement('div');
          summary.style.cssText = 'margin-top:16px;font-size:13px;color:#888;';
          summary.textContent = 'Refreshing cart in 2 seconds...';
          ui.status.appendChild(summary);

          setTimeout(function () {
            window.location.href = 'https://partner.leadersystems.com.au/shoppingcart.html';
          }, 2000);
          return;
        }

        var item = items[index];
        addStatusLine(ui.status, 'Adding product #' + item.productId + ' (qty: ' + item.qty + ')...', 'pending');

        addOneItem(userCode, item.productId, item.qty).then(function (result) {
          // Replace the pending line
          var lines = ui.status.children;
          var lastLine = lines[lines.length - 1];

          if (result.ok) {
            completed++;
            lastLine.style.color = '#2e7d32';
            lastLine.textContent = '✓  Product #' + item.productId + (result.note ? ' (' + result.note + ')' : ' added');
          } else {
            failed++;
            lastLine.style.color = '#c62828';
            lastLine.textContent = '✗  Product #' + item.productId + ' — ' + result.error;
          }

          next(index + 1);
        });
      }

      next(0);
    });
  }

  // Start when DOM is ready
  if (document.readyState === 'complete') {
    run();
  } else {
    window.addEventListener('load', run);
  }
})();
