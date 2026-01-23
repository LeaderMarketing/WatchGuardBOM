// Cart utilities for WatchGuard Configurator
// 
// Opens product pages with #autoAddToCart=1 hash parameter
// A userscript (Tampermonkey) on the product page detects this and auto-clicks "Add to Cart"

import { getProductIdBySku } from './productIds.js';
import { getSkuCode } from './productSkus.js';
import { getUrlBySku } from './productUrls.js';

/**
 * Helper function for delays between opening tabs
 */
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

/**
 * Open a product page with auto-add-to-cart hash parameter
 * @param {string} url - The product page URL
 * @returns {boolean} Whether the window opened successfully
 */
const openWithAutoAdd = (url) => {
  if (!url) return false;
  const autoAddUrl = `${url}#autoAddToCart=1`;
  const win = window.open(autoAddUrl, '_blank');
  return !!win;
};

/**
 * Add configuration to cart by opening product pages with auto-add parameter
 * The userscript on the product page will auto-click "Add to Cart"
 * 
 * @param {Object} options
 * @param {string} options.productName - e.g., 'Firebox T115-W'
 * @param {string} options.serviceType - e.g., 'Basic Security', 'Total Security', 'Appliance Only'
 * @param {string} options.term - e.g., '1 Year', '3 Year' (null for Appliance Only)
 * @param {boolean} options.isHighAvailability - HA products bundle device+subscription
 * @returns {Promise<{success: boolean, message: string, opened: number}>}
 */
export const addConfigurationToCart = async ({
  productName,
  serviceType,
  term,
  isHighAvailability = false,
}) => {
  const urlsToOpen = [];

  if (isHighAvailability || serviceType === 'Appliance Only') {
    // Single item
    const sku = getSkuCode(productName, serviceType, term);
    const url = getUrlBySku(sku);
    if (url) urlsToOpen.push({ url, type: serviceType, sku });
  } else {
    // Device + Subscription (two items)
    const deviceSku = getSkuCode(productName, 'Appliance Only', null);
    const subSku = getSkuCode(productName, serviceType, term);
    
    const deviceUrl = getUrlBySku(deviceSku);
    const subUrl = getUrlBySku(subSku);
    
    if (deviceUrl) urlsToOpen.push({ url: deviceUrl, type: 'Device', sku: deviceSku });
    if (subUrl) urlsToOpen.push({ url: subUrl, type: 'Subscription', sku: subSku });
  }

  if (urlsToOpen.length === 0) {
    return { success: false, message: 'No product URLs configured for this configuration.', opened: 0 };
  }

  // Open each URL with a small delay between them
  let opened = 0;
  for (let i = 0; i < urlsToOpen.length; i++) {
    if (i > 0) await delay(400); // Delay between tabs to avoid popup blocker
    
    const success = openWithAutoAdd(urlsToOpen[i].url);
    if (success) opened++;
  }

  if (opened === urlsToOpen.length) {
    return {
      success: true,
      message: `Opened ${opened} product page${opened > 1 ? 's' : ''} - items will be added to cart automatically!`,
      opened
    };
  } else if (opened > 0) {
    return {
      success: true,
      message: `Opened ${opened} of ${urlsToOpen.length} pages. Some may need manual add.`,
      opened
    };
  } else {
    return {
      success: false,
      message: 'Could not open product pages. Please check popup blocker settings.',
      opened: 0
    };
  }
};

/**
 * Check if we can add to cart (URLs exist for the required SKUs)
 */
export const canAddConfigurationToCart = ({
  productName,
  serviceType,
  term,
  isHighAvailability = false,
}) => {
  const missingItems = [];

  if (isHighAvailability || serviceType === 'Appliance Only') {
    const sku = getSkuCode(productName, serviceType, term);
    if (!getUrlBySku(sku)) missingItems.push(sku);
  } else {
    const deviceSku = getSkuCode(productName, 'Appliance Only', null);
    const subSku = getSkuCode(productName, serviceType, term);
    
    if (!getUrlBySku(deviceSku)) missingItems.push(deviceSku);
    if (!getUrlBySku(subSku)) missingItems.push(subSku);
  }

  return { canAdd: missingItems.length === 0, missingItems };
};

/**
 * Fallback: open product pages in new tabs (without auto-add)
 */
export const openProductPages = ({
  productName,
  serviceType,
  term,
  isHighAvailability = false,
}) => {
  const urls = [];

  if (isHighAvailability || serviceType === 'Appliance Only') {
    const sku = getSkuCode(productName, serviceType, term);
    const url = getUrlBySku(sku);
    if (url) urls.push(url);
  } else {
    const deviceUrl = getUrlBySku(getSkuCode(productName, 'Appliance Only', null));
    const subUrl = getUrlBySku(getSkuCode(productName, serviceType, term));
    if (deviceUrl) urls.push(deviceUrl);
    if (subUrl) urls.push(subUrl);
  }

  urls.forEach((url, i) => setTimeout(() => window.open(url, '_blank'), i * 300));
  return { opened: urls.length, urls };
};
