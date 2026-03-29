import { useState, useCallback, useMemo } from 'react';
import { useApplianceCatalog } from '../../hooks/useApplianceCatalog.js';

// ── Section definitions (service type options per section) ──
const SECTIONS = {
  renewal: [
    { label: 'Basic Security Renewal', key: 'Basic Security Renewal' },
    { label: 'Total Security Renewal', key: 'Total Security Renewal' },
  ],
  support: [
    { label: 'Standard Support Renewal', key: 'Standard Support Renewal' },
    { label: 'Gold Support Renewal', key: 'Gold Support Renewal' },
  ],
  tradeUp: [
    { label: 'Trade Up to Basic Security', key: 'Trade Up Basic Security' },
    { label: 'Trade Up to Total Security', key: 'Trade Up Total Security' },
  ],
  cloud: [
    { label: 'Cloud 1-Month Data Retention', key: 'Cloud Data Retention' },
  ],
  individual: [
    { label: 'WebBlocker', key: 'WebBlocker' },
    { label: 'spamBlocker', key: 'spamBlocker' },
    { label: 'Gateway AntiVirus', key: 'Gateway AntiVirus' },
    { label: 'Intrusion Prevention Service', key: 'Intrusion Prevention Service' },
    { label: 'Reputation Enabled Defense', key: 'Reputation Enabled Defense' },
    { label: 'Application Control', key: 'Application Control' },
    { label: 'APT Blocker', key: 'APT Blocker' },
    { label: 'Network Discovery', key: 'Network Discovery' },
  ],
};

function sortModels(models) {
  return [...models].sort((a, b) => {
    const numA = parseInt(a.replace(/\D/g, ''), 10);
    const numB = parseInt(b.replace(/\D/g, ''), 10);
    return numA - numB || a.localeCompare(b);
  });
}

export function useApplianceRenewals() {
  // Fetch all three categories that contain T/M series renewal data:
  // - renewals: legacy models (T15, T20, M270, M370, etc.)
  // - tabletop: current T-series (T25, T45, T85-PoE, etc.)
  // - mseries: current M-series (M290, M390, M495, etc.)
  const renewalsCatalog = useApplianceCatalog('renewals');
  const tabletopCatalog = useApplianceCatalog('tabletop');
  const mseriesCatalog = useApplianceCatalog('mseries');

  // Merge lookups from all three categories
  const mergedLookups = useMemo(() => {
    const merged = {};
    for (const lookups of [renewalsCatalog.lookups, tabletopCatalog.lookups, mseriesCatalog.lookups]) {
      for (const [model, services] of Object.entries(lookups)) {
        if (!merged[model]) merged[model] = {};
        for (const [svc, terms] of Object.entries(services)) {
          if (!merged[model][svc]) merged[model][svc] = {};
          Object.assign(merged[model][svc], terms);
        }
      }
    }
    return merged;
  }, [renewalsCatalog.lookups, tabletopCatalog.lookups, mseriesCatalog.lookups]);

  // Derive T-Series and M-Series model lists from merged data
  const { T_SERIES_MODELS, M_SERIES_MODELS } = useMemo(() => {
    const allKeys = Object.keys(mergedLookups);
    return {
      T_SERIES_MODELS: sortModels(allKeys.filter(k => k.startsWith('T'))),
      M_SERIES_MODELS: sortModels(allKeys.filter(k => k.startsWith('M'))),
    };
  }, [mergedLookups]);

  // Filter models that have at least one SKU in a given section
  const modelsForSection = useCallback((modelList, sectionId) => {
    const serviceKeys = SECTIONS[sectionId].map((o) => o.key);
    return modelList.filter((model) =>
      serviceKeys.some((svc) => mergedLookups[model]?.[svc]),
    );
  }, [mergedLookups]);

  // Per-card state: keyed by `${series}-${sectionId}` e.g. "t-renewal", "m-support"
  const [cardState, setCardState] = useState({});

  const getAvailableTerms = useCallback((modelKey, serviceType) => {
    return Object.keys(mergedLookups[modelKey]?.[serviceType] || {});
  }, [mergedLookups]);

  const getSkuForSelection = useCallback((modelKey, serviceType, term) => {
    return mergedLookups[modelKey]?.[serviceType]?.[term]?.sku || null;
  }, [mergedLookups]);

  const getPriceForSelection = useCallback((modelKey, serviceType, term) => {
    return mergedLookups[modelKey]?.[serviceType]?.[term]?.price || null;
  }, [mergedLookups]);

  const getUrlForSelection = useCallback((modelKey, serviceType, term) => {
    return mergedLookups[modelKey]?.[serviceType]?.[term]?.url || '';
  }, [mergedLookups]);

  const getCardState = useCallback(
    (series, sectionId) => {
      const key = `${series}-${sectionId}`;
      const models = series === 't' ? T_SERIES_MODELS : M_SERIES_MODELS;
      const sectionModels = modelsForSection(models, sectionId);
      const firstModel = sectionModels[0] || models[0];
      const firstService = SECTIONS[sectionId][0]?.key;
      const terms = getAvailableTerms(firstModel, firstService);
      const defaults = { model: firstModel, serviceType: firstService, term: terms[0] || '1 Year' };
      return cardState[key] ? { ...defaults, ...cardState[key] } : defaults;
    },
    [cardState, T_SERIES_MODELS, M_SERIES_MODELS, modelsForSection, getAvailableTerms],
  );

  const updateCardState = useCallback((series, sectionId, field, value) => {
    setCardState((prev) => {
      const key = `${series}-${sectionId}`;
      const current = prev[key] || {};
      const updated = { ...current, [field]: value };

      if (field === 'model' || field === 'serviceType') {
        const svcKey = field === 'serviceType' ? value : updated.serviceType || SECTIONS[sectionId][0]?.key;
        const modelKey = field === 'model' ? value : updated.model;
        const terms = getAvailableTerms(modelKey, svcKey);
        updated.term = terms[0] || '1 Year';
      }

      return { ...prev, [key]: updated };
    });
  }, [getAvailableTerms]);

  // Filter service options to only those available for the selected model
  const getAvailableOptions = useCallback((model, sectionId) => {
    return SECTIONS[sectionId].filter(
      (opt) => mergedLookups[model]?.[opt.key],
    );
  }, [mergedLookups]);

  const loading = renewalsCatalog.loading || tabletopCatalog.loading || mseriesCatalog.loading;
  const error = renewalsCatalog.error || tabletopCatalog.error || mseriesCatalog.error;

  return useMemo(
    () => ({
      T_SERIES_MODELS,
      M_SERIES_MODELS,
      SECTIONS,
      modelsForSection,
      getCardState,
      updateCardState,
      getAvailableTerms,
      getSkuForSelection,
      getPriceForSelection,
      getUrlForSelection,
      getAvailableOptions,
      loading,
      error,
    }),
    [T_SERIES_MODELS, M_SERIES_MODELS, modelsForSection, getCardState, updateCardState,
     getAvailableTerms, getSkuForSelection, getPriceForSelection, getUrlForSelection,
     getAvailableOptions, loading, error],
  );
}
