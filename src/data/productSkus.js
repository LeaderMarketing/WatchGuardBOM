// WatchGuard Product SKU Mapping
// Maps product configurations to their SKU codes
//
// Structure: productSkus[productName][serviceType][term] = SKU code
// For "Appliance Only", use: productSkus[productName]['Appliance Only']

import { tabletopProductSkus } from './productSkus/tabletop.js';
import { mSeriesProductSkus } from './productSkus/mSeries.js';
import { wifiProductSkus } from './productSkus/wifi.js';

const mergedProductSkus = {
  ...tabletopProductSkus,
  ...mSeriesProductSkus,
  ...wifiProductSkus,
};

export const productSkus = mergedProductSkus;

// ============================================
// HELPER FUNCTIONS
// ============================================

/**
 * Get SKU code for a product configuration
 * @param {string} productName - e.g., 'Firebox T115-W', 'AP130'
 * @param {string} serviceType - e.g., 'Standard Support', 'Basic Security', 'Appliance Only', 'Standard Wi-Fi'
 * @param {string} term - e.g., '1 Year', '3 Year', '5 Year' (ignored for Appliance Only)
 * @returns {string|null} SKU code or null if not found
 */
export const getSkuCode = (productName, serviceType, term) => {
  const product = productSkus[productName];
  if (!product) {
    console.warn(`Product not found: ${productName}`);
    return null;
  }

  // Handle "Appliance Only" case
  if (serviceType === 'Appliance Only') {
    return product['Appliance Only'] || null;
  }

  // Handle service + term combination
  if (product[serviceType] && product[serviceType][term]) {
    return product[serviceType][term];
  }

  console.warn(`Configuration not found: ${productName} / ${serviceType} / ${term}`);
  return null;
};

/**
 * Get all available SKU codes (for debugging/export)
 * @returns {Array} Array of {productName, serviceType, term, sku}
 */
export const getAllSkuCodes = () => {
  const allSkus = [];

  for (const [productName, configs] of Object.entries(productSkus)) {
    for (const [serviceType, value] of Object.entries(configs)) {
      if (typeof value === 'string') {
        // Appliance Only
        allSkus.push({
          productName,
          serviceType,
          term: null,
          sku: value,
        });
      } else {
        // Service with terms
        for (const [term, sku] of Object.entries(value)) {
          allSkus.push({
            productName,
            serviceType,
            term,
            sku,
          });
        }
      }
    }
  }

  return allSkus;
};

/**
 * Export all SKUs as CSV format (for verification)
 */
export const exportSkusAsCsv = () => {
  const allSkus = getAllSkuCodes();
  const header = 'Product,Service,Term,SKU\n';
  const rows = allSkus
    .map((s) => `"${s.productName}","${s.serviceType}","${s.term || ''}","${s.sku}"`)
    .join('\n');
  return header + rows;
};

/**
 * Get available service types for a product (excluding "Appliance Only")
 * @param {string} productName
 * @returns {string[]} Array of service type names
 */
export const getAvailableServiceTypes = (productName) => {
  const product = productSkus[productName];
  if (!product) return [];
  return Object.keys(product).filter((key) => key !== 'Appliance Only');
};

/**
 * Check whether a product supports "Appliance Only"
 * @param {string} productName
 * @returns {boolean}
 */
export const hasApplianceOnly = (productName) => {
  const product = productSkus[productName];
  const sku = product?.['Appliance Only'];
  return typeof sku === 'string' && sku.length > 0;
};
