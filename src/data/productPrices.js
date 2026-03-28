// Price lookups for Virtual / Cloud tabs
// Single source of truth: the latest WGdata_*.csv in this directory (RRP column)

import { getSkuCode } from './productSkus.js';

const wgDataFiles = import.meta.glob('./WGdata_*.csv', {
  eager: true,
  import: 'default',
  query: '?raw',
});

function parseCsvLine(line) {
  const fields = [];
  let current = '';
  let inQuotes = false;

  for (let index = 0; index < line.length; index += 1) {
    const char = line[index];

    if (char === '"') {
      inQuotes = !inQuotes;
    } else if (char === ',' && !inQuotes) {
      fields.push(current.trim());
      current = '';
    } else {
      current += char;
    }
  }

  fields.push(current.trim());
  return fields;
}

function parsePrice(rawValue) {
  if (!rawValue) return null;

  const normalized = rawValue.replace(/[$,\s]/g, '');
  const numeric = Number.parseFloat(normalized);
  return Number.isFinite(numeric) && numeric > 0 ? numeric : null;
}

function buildPriceLookup() {
  const pricesBySku = new Map();
  let sourceFile = null;

  // Parse WGdata CSV — format: STOCK CODE, SUBCATEGORY, DESC, IMAGE, MFR, MFR SKU, DBP, RRP
  // Uses RRP (column 7) as the price
  const entries = Object.entries(wgDataFiles).sort(([a], [b]) => a.localeCompare(b));
  for (const [filePath, csvRaw] of entries) {
    sourceFile = filePath;
    const lines = csvRaw.split(/\r?\n/).filter((l) => l.trim());
    for (const line of lines.slice(1)) {
      const fields = parseCsvLine(line);
      if (fields.length < 8) continue;
      const sku = fields[0].trim();
      const rrp = parsePrice(fields[7]);
      if (!sku || rrp === null) continue;
      pricesBySku.set(sku, rrp);
    }
  }

  return { sourceFile, pricesBySku };
}

const { sourceFile, pricesBySku } = buildPriceLookup();

export const pricingSourceFile = sourceFile;

export function getPriceBySku(sku) {
  if (!sku) return null;
  return pricesBySku.get(sku) ?? null;
}

export function getProductPrice(productName, serviceType, term = null) {
  const sku = getSkuCode(productName, serviceType, term);
  return getPriceBySku(sku);
}

export function getAppliancePrice(productName) {
  return getProductPrice(productName, 'Appliance Only', null);
}

export function getSubscriptionPrice(productName, serviceType, term) {
  return getProductPrice(productName, serviceType, term);
}

export function formatPrice(price) {
  if (price === null || price === undefined || price === 0) {
    return 'TBC';
  }

  return `$${price.toLocaleString('en-AU')}`;
}

export function getStartingPrice(productName, isWifi = false) {
  const primaryService = isWifi ? 'Standard Wi-Fi' : 'Standard Support';
  return getProductPrice(productName, primaryService, '1 Year') ?? getAppliancePrice(productName);
}

export default pricesBySku;
