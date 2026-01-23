/**
 * WatchGuard Configurator Integration Script
 * 
 * Add this script to your partner website (e.g., index.html or a global JS file)
 * to enable automatic search from the WatchGuard Product Configurator.
 * 
 * How it works:
 * 1. User configures a product in the WatchGuard Configurator
 * 2. When they click "View Product Page", the SKU is stored in localStorage
 * 3. User is redirected to the partner website
 * 4. This script detects the stored SKU and auto-populates the search bar
 * 5. Optionally triggers the search automatically
 */

(function() {
  'use strict';

  // Check if there's a pending search from the configurator
  const pendingSku = localStorage.getItem('watchguard_configurator_sku');
  const shouldSearch = localStorage.getItem('watchguard_configurator_search');

  if (pendingSku && shouldSearch === 'true') {
    // Clear the flags immediately to prevent repeat searches
    localStorage.removeItem('watchguard_configurator_sku');
    localStorage.removeItem('watchguard_configurator_search');

    // Wait for the page to fully load
    const initSearch = () => {
      // Try to find the search input field
      // Update these selectors to match your actual search bar
      const searchInput = document.querySelector('input[type="search"]') 
        || document.querySelector('input[name="search"]')
        || document.querySelector('input[placeholder*="Search"]')
        || document.querySelector('#searchInput')
        || document.querySelector('.search-input');

      if (searchInput) {
        // Populate the search field with the SKU
        searchInput.value = pendingSku;
        searchInput.focus();

        // Trigger input event to notify any listeners
        searchInput.dispatchEvent(new Event('input', { bubbles: true }));
        searchInput.dispatchEvent(new Event('change', { bubbles: true }));

        // Try to find and click the search button, or submit the form
        const searchButton = document.querySelector('button[type="submit"]')
          || document.querySelector('.search-button')
          || document.querySelector('#searchButton');

        if (searchButton) {
          // Small delay to ensure UI is ready
          setTimeout(() => {
            searchButton.click();
          }, 100);
        } else {
          // Try submitting the form
          const form = searchInput.closest('form');
          if (form) {
            setTimeout(() => {
              form.submit();
            }, 100);
          }
        }

        console.log('WatchGuard Configurator: Auto-searching for SKU:', pendingSku);
      } else {
        // Search input not found - show notification to user
        console.warn('WatchGuard Configurator: Search input not found. SKU:', pendingSku);
        
        // Create a notification banner
        const banner = document.createElement('div');
        banner.style.cssText = `
          position: fixed;
          top: 20px;
          left: 50%;
          transform: translateX(-50%);
          background: #e81410;
          color: white;
          padding: 15px 25px;
          border-radius: 8px;
          font-family: sans-serif;
          font-size: 14px;
          z-index: 10000;
          box-shadow: 0 4px 12px rgba(0,0,0,0.2);
        `;
        banner.innerHTML = `
          <strong>Search for:</strong> ${pendingSku}
          <br><small>Paste this SKU in the search bar above</small>
        `;
        document.body.appendChild(banner);

        // Remove banner after 10 seconds
        setTimeout(() => banner.remove(), 10000);
      }
    };

    // Run when DOM is ready
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', initSearch);
    } else {
      initSearch();
    }
  }
})();
