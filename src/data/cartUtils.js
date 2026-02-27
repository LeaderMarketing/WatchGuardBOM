// Cart utilities for WatchGuard Configurator
//
// This app will be hosted on partner.leadersystems.com.au, making it
// same-origin with the Leader Systems AddToCart API (WSLD.asmx/AddToCart).
// That means we can call the API directly via XHR — no bridge scripts,
// no browser extensions, no iframes. Just a POST request.
//
// The API requires:
//   - DealerCode  → encrypted user token from the global `C.UserCode`
//   - ProductID   → internal product ID (stored in our productIds data)
//   - Qty         → quantity
//
// The global `C` and `Path` objects are set by the partner site's own JS
// when a user is logged in. If they're not logged in, the site will prompt
// for login as it normally does.
//
// NOTE: During local development (localhost), the API calls will fail due
// to CORS. This is expected — the add-to-cart feature only works when
// hosted on the partner site.

import { getProductIdBySku } from './productIds.js';
import { getSkuCode } from './productSkus.js';
import { getUrlBySku } from './productUrls.js';

const CART_PAGE_URL = '/shoppingcart.html';

// ─── Helpers ───────────────────────────────────────────────

/**
 * Read the partner site's JS globals that are set when logged in.
 * Returns null if the user is not logged in / globals not available.
 */
const getSiteGlobals = () => {
  try {
    /* global C, Path */
    if (typeof C !== 'undefined' && C.UserCode && typeof Path !== 'undefined') {
      return { userCode: C.UserCode, apiPath: Path };
    }
  } catch {
    // not available
  }
  return null;
};

/**
 * Build the list of { productId, sku, qty } items for a given configuration.
 */
const resolveCartItems = ({ productName, serviceType, term, isHighAvailability = false }) => {
  const items = [];

  if (isHighAvailability || serviceType === 'Appliance Only') {
    const sku = getSkuCode(productName, serviceType, term);
    const pid = getProductIdBySku(sku);
    if (sku && pid) items.push({ sku, productId: pid, qty: 1 });
  } else {
    // Device + Subscription (two separate line items)
    const deviceSku = getSkuCode(productName, 'Appliance Only', null);
    const subSku    = getSkuCode(productName, serviceType, term);
    const devicePid = getProductIdBySku(deviceSku);
    const subPid    = getProductIdBySku(subSku);

    if (deviceSku && devicePid) items.push({ sku: deviceSku, productId: devicePid, qty: 1 });
    if (subSku && subPid)       items.push({ sku: subSku,    productId: subPid,    qty: 1 });
  }

  return items;
};

/**
 * Call WSLD.asmx/AddToCart for a single product.
 * Returns a promise that resolves to { ok, note?, error? }.
 */
const addOneItem = (userCode, apiPath, productId, qty) => {
  return new Promise((resolve) => {
    const data =
      'DealerCode=' + encodeURIComponent(userCode) +
      '&ProductID=' + encodeURIComponent(productId) +
      '&Qty='       + encodeURIComponent(qty);

    const xhr = new XMLHttpRequest();
    xhr.open('POST', apiPath + '/AddToCart', true);
    xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
    xhr.onreadystatechange = () => {
      if (xhr.readyState !== 4) return;

      if (xhr.status === 200) {
        const resp = xhr.responseText || '';
        if (resp.includes('Please Log off')) {
          resolve({ ok: false, error: 'Session expired — please log in again.' });
        } else if (resp.includes('Product exist in cart')) {
          resolve({ ok: true, note: 'Already in cart' });
        } else {
          resolve({ ok: true });
        }
      } else if (xhr.status === 0) {
        // CORS / network error — likely running on localhost
        resolve({ ok: false, error: 'Network error — this feature only works on the partner site.' });
      } else {
        resolve({ ok: false, error: 'Server error (HTTP ' + xhr.status + ')' });
      }
    };
    xhr.send(data);
  });
};

/**
 * Add an array of {productId, qty} items to the Leader cart sequentially.
 * @returns {Promise<{success: boolean, message: string, results: Array}>}
 */
const addItemsToLeaderCart = async (items) => {
  const globals = getSiteGlobals();

  if (!globals) {
    return {
      success: false,
      message: 'You are not logged in to Leader Systems. Please log in first.',
      results: [],
    };
  }

  const results = [];
  let failures = 0;

  for (const item of items) {
    const result = await addOneItem(globals.userCode, globals.apiPath, item.productId, item.qty);
    results.push({ ...item, ...result });
    if (!result.ok) failures++;
  }

  if (failures === items.length) {
    return {
      success: false,
      message: results[0]?.error || 'Failed to add items to cart.',
      results,
    };
  }

  const added = items.length - failures;
  return {
    success: true,
    message: failures === 0
      ? `${added} item${added > 1 ? 's' : ''} added to Leader Cart!`
      : `${added} of ${items.length} items added (${failures} failed).`,
    results,
  };
};

// ─── Public API ────────────────────────────────────────────

/**
 * Add a single product configuration to the Leader Systems shopping cart.
 *
 * @returns {Promise<{success: boolean, message: string, items: Array}>}
 */
export const addConfigurationToCart = async ({ productName, serviceType, term, isHighAvailability = false }) => {
  const items = resolveCartItems({ productName, serviceType, term, isHighAvailability });

  if (items.length === 0) {
    return {
      success: false,
      message: 'No product IDs mapped for this configuration yet.',
      items: [],
    };
  }

  return addItemsToLeaderCart(items);
};

/**
 * Add multiple configurations (from the quote cart) to the Leader cart.
 *
 * @param {Array<{productName, serviceType, term, isHighAvailability, quantity}>} configurations
 * @returns {Promise<{success: boolean, message: string, items: Array}>}
 */
export const addMultipleToCart = async (configurations) => {
  const allItems = [];

  for (const config of configurations) {
    const items = resolveCartItems({
      productName: config.productName,
      serviceType: config.serviceType,
      term: config.term,
      isHighAvailability: config.isHighAvailability || false,
    });

    items.forEach(item => {
      item.qty = config.quantity || 1;
      allItems.push(item);
    });
  }

  if (allItems.length === 0) {
    return {
      success: false,
      message: 'No product IDs mapped for any of the selected items.',
      items: [],
    };
  }

  // Merge duplicates (same productId → sum quantities)
  const merged = {};
  for (const item of allItems) {
    if (merged[item.productId]) {
      merged[item.productId].qty += item.qty;
    } else {
      merged[item.productId] = { ...item };
    }
  }

  return addItemsToLeaderCart(Object.values(merged));
};

/**
 * Check if we can add to cart (product IDs exist for the required SKUs).
 */
export const canAddConfigurationToCart = ({ productName, serviceType, term, isHighAvailability = false }) => {
  const items = resolveCartItems({ productName, serviceType, term, isHighAvailability });
  const missing = [];

  if (isHighAvailability || serviceType === 'Appliance Only') {
    const sku = getSkuCode(productName, serviceType, term);
    if (!getProductIdBySku(sku)) missing.push(sku || 'unknown');
  } else {
    const deviceSku = getSkuCode(productName, 'Appliance Only', null);
    const subSku    = getSkuCode(productName, serviceType, term);
    if (!getProductIdBySku(deviceSku)) missing.push(deviceSku || 'unknown-device');
    if (!getProductIdBySku(subSku))    missing.push(subSku || 'unknown-sub');
  }

  return { canAdd: missing.length === 0, missingItems: missing };
};

/**
 * Navigate to the Leader Systems shopping cart page.
 */
export const goToLeaderCart = () => {
  window.location.href = CART_PAGE_URL;
};

/**
 * Fallback: open product pages in new tabs.
 */
export const openProductPages = ({ productName, serviceType, term, isHighAvailability = false }) => {
  const urls = [];

  if (isHighAvailability || serviceType === 'Appliance Only') {
    const sku = getSkuCode(productName, serviceType, term);
    const url = getUrlBySku(sku);
    if (url) urls.push(url);
  } else {
    const deviceUrl = getUrlBySku(getSkuCode(productName, 'Appliance Only', null));
    const subUrl    = getUrlBySku(getSkuCode(productName, serviceType, term));
    if (deviceUrl) urls.push(deviceUrl);
    if (subUrl)    urls.push(subUrl);
  }

  urls.forEach((url, i) => setTimeout(() => window.open(url, '_blank'), i * 300));
  return { opened: urls.length, urls };
};
