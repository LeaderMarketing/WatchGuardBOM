import { useState, useCallback, useMemo } from 'react';
import { useCatalogApi } from './useCatalogApi.js';

/**
 * Build a lookup from a flat SKU array for appliance-style products:
 *   { serviceType: { "1 Year": { sku, price, url }, ... }, ... }
 *
 * serviceType is derived from:
 *   - trade_up SKUs: "Trade Up Basic Security" or "Trade Up Total Security"
 *   - subscription SKUs: subscription_type directly (e.g. "Standard Support", "Basic Security Renewal")
 */
function buildServiceLookup(skus) {
  const lookup = {};
  for (const sku of skus) {
    let serviceType;
    if (sku.sku_type === 'trade_up') {
      if (sku.subscription_type?.includes('Basic')) serviceType = 'Trade Up Basic Security';
      else if (sku.subscription_type?.includes('Total')) serviceType = 'Trade Up Total Security';
      else serviceType = 'Trade Up';
    } else {
      serviceType = sku.subscription_type || sku.sku_type;
    }

    const termLabel = sku.term_years != null ? (sku.term_years === 0 ? '1 Month' : `${sku.term_years} Year`) : null;
    if (!termLabel) continue;

    if (!lookup[serviceType]) lookup[serviceType] = {};
    lookup[serviceType][termLabel] = {
      sku: sku.full_sku,
      price: sku.msrp,
      url: sku.url,
    };
  }
  return lookup;
}

/**
 * useApplianceCatalog(category)
 *
 * Shared hook for appliance-style catalogs (Virtual, Cloud, Renewals) where
 * products are models with service types (suites, renewals, individual subscriptions)
 * rather than per-user tiers.
 *
 * Returns:
 *   - models: [{ key, slug, name, description, ... }]
 *   - lookups: { modelKey: { serviceType: { term: { sku, price, url } } } }
 *   - getAvailableTerms(modelKey, serviceType)
 *   - getSkuForSelection(modelKey, serviceType, term)
 *   - getPriceForSelection(modelKey, serviceType, term)
 *   - getUrlForSelection(modelKey, serviceType, term)
 *   - loading, error
 */
export function useApplianceCatalog(category) {
  const { data: apiData, loading, error } = useCatalogApi(category);

  const { models, lookups } = useMemo(() => {
    if (!apiData?.products) return { models: [], lookups: {} };
    const models = apiData.products.map(p => ({
      key: p.slug,
      slug: p.slug,
      name: p.name,
      description: p.description,
    }));
    const lookups = {};
    for (const product of apiData.products) {
      lookups[product.slug] = buildServiceLookup(product.skus);
    }
    return { models, lookups };
  }, [apiData]);

  const getAvailableTerms = useCallback((modelKey, serviceType) => {
    return Object.keys(lookups[modelKey]?.[serviceType] || {});
  }, [lookups]);

  const getSkuForSelection = useCallback((modelKey, serviceType, term) => {
    return lookups[modelKey]?.[serviceType]?.[term]?.sku || null;
  }, [lookups]);

  const getPriceForSelection = useCallback((modelKey, serviceType, term) => {
    return lookups[modelKey]?.[serviceType]?.[term]?.price || null;
  }, [lookups]);

  const getUrlForSelection = useCallback((modelKey, serviceType, term) => {
    return lookups[modelKey]?.[serviceType]?.[term]?.url || '';
  }, [lookups]);

  return useMemo(() => ({
    models,
    lookups,
    getAvailableTerms,
    getSkuForSelection,
    getPriceForSelection,
    getUrlForSelection,
    loading,
    error,
  }), [models, lookups, getAvailableTerms, getSkuForSelection,
       getPriceForSelection, getUrlForSelection, loading, error]);
}
