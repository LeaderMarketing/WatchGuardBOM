import { useState, useCallback, useMemo } from 'react';
import { useCatalogApi } from './useCatalogApi.js';

/**
 * Extract the license tier from a SKU name.
 *
 * Patterns:
 *   "... - 1 to 50 licenses"  → "1-50"
 *   "... - 5001+ licenses"    → "5001+"
 *   "... - 1 to 10 mailboxes" → "1-10"
 *   "... 51 to 100 users"     → "51-100"
 */
function extractTier(skuName) {
  // "X to Y <unit>"
  const rangeMatch = skuName.match(/(\d[\d,]*)\s+to\s+(\d[\d,]*)\s+(?:licenses|users|mailboxes|seats)/i);
  if (rangeMatch) {
    return `${rangeMatch[1].replace(/,/g, '')}-${rangeMatch[2].replace(/,/g, '')}`;
  }
  // "X+ <unit>"
  const plusMatch = skuName.match(/(\d[\d,]*)\+\s*(?:licenses|users|mailboxes|seats)/i);
  if (plusMatch) {
    return `${plusMatch[1].replace(/,/g, '')}+`;
  }
  return null;
}

/**
 * Build a lookup table from a flat SKU array:
 *   { tier: { "1 Year": { sku: "NWG-...", price: 45, url: "https://..." }, ... } }
 */
function buildSkuLookup(skus) {
  const lookup = {};
  for (const sku of skus) {
    const tier = extractTier(sku.name);
    if (!tier) continue;
    const termLabel = sku.term_years ? `${sku.term_years} Year` : null;
    if (!termLabel) continue;
    if (!lookup[tier]) lookup[tier] = {};
    lookup[tier][termLabel] = {
      sku: sku.full_sku,
      price: sku.msrp,
      url: sku.url,
    };
  }
  return lookup;
}

/**
 * usePerUserCatalog(category, productConfig)
 *
 * Shared hook for per-user subscription catalogs (Endpoint, Identity, Email, MDR/NDR).
 * Fetches data from the API via useCatalogApi and transforms it into the standard
 * catalog interface: selections, getAvailableTerms, getSkuForSelection, etc.
 *
 * @param {string} category - API category name (e.g. 'email', 'identity', 'endpoint', 'mdr_ndr')
 * @param {Object[]} productConfig - Static product definitions with keys matching API product group slugs.
 *   Each entry: { key: 'Panda Email Protection', label: '...', description: '...', section: '...', tiers?: [...] }
 *   If tiers is omitted, tiers are derived from API data.
 */
export function usePerUserCatalog(category, productConfig) {
  const { data: apiData, loading, error } = useCatalogApi(category);

  // Build lookup: { productKey: { tier: { termLabel: { sku, price, url } } } }
  const lookups = useMemo(() => {
    if (!apiData?.products) return {};
    const result = {};
    for (const product of apiData.products) {
      // Match product to config by slug (which is the product group name)
      result[product.slug] = buildSkuLookup(product.skus);
    }
    return result;
  }, [apiData]);

  // Derive products with tiers from API data, merged with static config
  const products = useMemo(() => {
    if (!productConfig) return [];
    return productConfig.map((cfg) => {
      const lookup = lookups[cfg.key] || {};
      const derivedTiers = Object.keys(lookup);
      return {
        ...cfg,
        tiers: cfg.tiers || derivedTiers,
      };
    });
  }, [productConfig, lookups]);

  // Selection state
  const [selections, setSelections] = useState(() => {
    const initial = {};
    for (const p of productConfig) {
      initial[p.key] = { tier: p.tiers?.[0] || '', term: '1 Year' };
    }
    return initial;
  });

  const setSelection = useCallback((productKey, field, value) => {
    setSelections((prev) => ({
      ...prev,
      [productKey]: { ...prev[productKey], [field]: value },
    }));
  }, []);

  const getAvailableTerms = useCallback((productKey, tier) => {
    return Object.keys(lookups[productKey]?.[tier] || {});
  }, [lookups]);

  const getSkuForSelection = useCallback((productKey, tier, term) => {
    return lookups[productKey]?.[tier]?.[term]?.sku || null;
  }, [lookups]);

  const getPriceForSelection = useCallback((productKey, tier, term) => {
    return lookups[productKey]?.[tier]?.[term]?.price || null;
  }, [lookups]);

  const getUrlForSelection = useCallback((productKey, tier, term) => {
    return lookups[productKey]?.[tier]?.[term]?.url || '';
  }, [lookups]);

  return useMemo(() => ({
    products,
    selections,
    setSelection,
    getAvailableTerms,
    getSkuForSelection,
    getPriceForSelection,
    getUrlForSelection,
    loading,
    error,
  }), [products, selections, setSelection, getAvailableTerms, getSkuForSelection,
       getPriceForSelection, getUrlForSelection, loading, error]);
}
