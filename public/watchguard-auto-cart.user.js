// ==UserScript==
// @name         WatchGuard Configurator - Auto Add to Cart
// @namespace    https://leadermarketing.github.io/WatchGuard/
// @version      1.0
// @description  Automatically adds products to cart when opened from WatchGuard Configurator
// @author       Leader Systems
// @match        https://partner.leadersystems.com.au/products.html*
// @grant        none
// @run-at       document-end
// ==/UserScript==

(function() {
  'use strict';

  // Check if we should auto-add (triggered by hash parameter from configurator)
  const hash = window.location.hash;
  if (!hash.includes('autoAddToCart=1')) {
    return; // Not triggered by configurator, do nothing
  }

  console.log('[WatchGuard Configurator] Auto-add to cart triggered');

  /**
   * Find the Add to Cart button on the page
   */
  function findAddToCartButton() {
    // Try multiple selectors - the dealershop might use different elements
    const selectors = [
      'a[onclick*="PopUpContainer.Add"]',
      'button[onclick*="PopUpContainer.Add"]',
      'a[productid]',
      'button[productid]',
      '.add-to-cart',
      '#addToCart',
      '.btn-add-to-cart'
    ];

    for (const selector of selectors) {
      const btn = document.querySelector(selector);
      if (btn) {
        console.log('[WatchGuard Configurator] Found button with selector:', selector);
        return btn;
      }
    }

    // Fallback: search by text content
    const allElements = document.querySelectorAll('a, button, span, div');
    for (const el of allElements) {
      const text = el.textContent.toLowerCase().trim();
      if (text === 'add to cart' || text === 'add to basket') {
        console.log('[WatchGuard Configurator] Found button by text content');
        return el;
      }
    }

    return null;
  }

  /**
   * Show a notification on the page
   */
  function showNotification(message, type) {
    const notification = document.createElement('div');
    notification.id = 'wg-configurator-notification';
    notification.style.cssText = `
      position: fixed;
      top: 20px;
      right: 20px;
      padding: 16px 24px;
      background: ${type === 'success' ? '#4CAF50' : '#f44336'};
      color: white;
      border-radius: 8px;
      font-size: 16px;
      font-weight: bold;
      z-index: 999999;
      box-shadow: 0 4px 12px rgba(0,0,0,0.3);
      font-family: Arial, sans-serif;
    `;
    notification.textContent = message;
    document.body.appendChild(notification);

    // Auto-remove after 4 seconds
    setTimeout(() => {
      notification.style.transition = 'opacity 0.3s';
      notification.style.opacity = '0';
      setTimeout(() => notification.remove(), 300);
    }, 4000);
  }

  /**
   * Click the Add to Cart button
   */
  function clickAddToCart() {
    const btn = findAddToCartButton();

    if (btn) {
      console.log('[WatchGuard Configurator] Clicking Add to Cart button...');
      
      // Click the button
      btn.click();

      // Show success notification
      showNotification('✓ Added to cart!', 'success');

      // Clean up the hash so refreshing doesn't re-add
      history.replaceState(null, '', window.location.pathname + window.location.search);

      return true;
    }

    return false;
  }

  /**
   * Main function - wait for page to load then try to click
   */
  function init() {
    let attempts = 0;
    const maxAttempts = 20; // Try for 10 seconds (500ms * 20)

    function tryClick() {
      attempts++;

      if (clickAddToCart()) {
        console.log('[WatchGuard Configurator] Successfully added to cart!');
        return;
      }

      if (attempts < maxAttempts) {
        console.log(`[WatchGuard Configurator] Button not found, retrying... (${attempts}/${maxAttempts})`);
        setTimeout(tryClick, 500);
      } else {
        console.warn('[WatchGuard Configurator] Could not find Add to Cart button after max attempts');
        showNotification('Could not auto-add. Please click "Add to Cart" manually.', 'error');
      }
    }

    // Start trying after page load
    if (document.readyState === 'complete') {
      setTimeout(tryClick, 800); // Give page a moment to initialize JS
    } else {
      window.addEventListener('load', () => setTimeout(tryClick, 800));
    }
  }

  // Run
  init();

})();
