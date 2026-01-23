// Product URL mapping for WatchGuard products
// Maps SKU codes to their respective product page URLs on partner.leadersystems.com.au
//
// IMPORTANT: URLs are encrypted by the backend and cannot be generated dynamically.
// You must collect these URLs manually by searching each SKU in the website's search bar.
//
// How to collect URLs:
// 1. Go to partner.leadersystems.com.au (logged in)
// 2. Enter SKU code in search bar
// 3. Click on the product result to go to product page
// 4. Copy the product page URL and add it to the relevant mapping module
//
// Structure: skuUrls[SKU] = 'product page URL'

import { tabletopSkuUrls } from './productUrls/tabletop.js';
import { mSeriesSkuUrls } from './productUrls/mSeries.js';
import { wifiSkuUrls } from './productUrls/wifi.js';

const mergedSkuUrls = {
  ...tabletopSkuUrls,
  ...mSeriesSkuUrls,
  ...wifiSkuUrls,
};

export const skuUrls = mergedSkuUrls;

// ============================================
// HELPER FUNCTIONS
// ============================================

/**
 * Get product page URL by SKU code
 * @param {string} sku - SKU code (e.g., 'WGT25000')
 * @returns {string|null} Product page URL or null if not found/empty
 */
export const getUrlBySku = (sku) => {
  if (!sku) return null;
  const url = skuUrls[sku];
  return url && url.length > 0 ? url : null;
};

/**
 * Check if a SKU has a URL configured
 * @param {string} sku - SKU code
 * @returns {boolean}
 */
export const hasUrl = (sku) => {
  return sku && skuUrls[sku] && skuUrls[sku].length > 0;
};

/**
 * Get count of configured URLs vs total SKUs
 * @returns {{configured: number, total: number}}
 */
export const getUrlStats = () => {
  const total = Object.keys(skuUrls).length;
  const configured = Object.values(skuUrls).filter((url) => url && url.length > 0).length;
  return { configured, total };
};

/**
 * Export all SKUs that need URLs (for bulk collection)
 * @returns {string[]} Array of SKU codes without URLs
 */
export const getMissingUrls = () => {
  return Object.entries(skuUrls)
    .filter(([_, url]) => !url || url.length === 0)
    .map(([sku]) => sku);
};
