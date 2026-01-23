// Product ID mapping for WatchGuard products
// Maps SKU codes to their internal numeric Product IDs required by the Add to Cart API.
//
// IMPORTANT: The PopUpContainer.Add() function requires internal Product IDs, not SKU codes.
// These IDs must be collected manually from the website.
//
// Structure: skuProductIds[SKU] = 'productId'

import { tabletopSkuProductIds } from './productIds/tabletop.js';
import { mSeriesSkuProductIds } from './productIds/mSeries.js';
import { wifiSkuProductIds } from './productIds/wifi.js';

const mergedSkuProductIds = {
  ...tabletopSkuProductIds,
  ...mSeriesSkuProductIds,
  ...wifiSkuProductIds,
};

export const skuProductIds = mergedSkuProductIds;

// ============================================
// HELPER FUNCTIONS
// ============================================

/**
 * Get internal Product ID by SKU code
 * @param {string} sku - SKU code (e.g., 'NWG-WGT116000')
 * @returns {string|null} Product ID or null if not found/empty
 */
export const getProductIdBySku = (sku) => {
  if (!sku) return null;
  const productId = skuProductIds[sku];
  return productId && productId.length > 0 ? productId : null;
};

/**
 * Check if a SKU has a Product ID configured
 * @param {string} sku - SKU code
 * @returns {boolean}
 */
export const hasProductId = (sku) => {
  return sku && skuProductIds[sku] && skuProductIds[sku].length > 0;
};

/**
 * Get count of configured Product IDs vs total SKUs
 * @returns {{configured: number, total: number}}
 */
export const getProductIdStats = () => {
  const total = Object.keys(skuProductIds).length;
  const configured = Object.values(skuProductIds).filter((id) => id && id.length > 0).length;
  return { configured, total };
};

/**
 * Export all SKUs that need Product IDs (for bulk collection)
 * @returns {string[]} Array of SKU codes without Product IDs
 */
export const getMissingProductIds = () => {
  return Object.entries(skuProductIds)
    .filter(([_, id]) => !id || id.length === 0)
    .map(([sku]) => sku);
};
