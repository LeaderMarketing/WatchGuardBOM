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
  const catalog = useApplianceCatalog('renewals');

  // Derive T-Series and M-Series model lists from API data
  const { T_SERIES_MODELS, M_SERIES_MODELS } = useMemo(() => {
    const allKeys = catalog.models.map(m => m.key);
    return {
      T_SERIES_MODELS: sortModels(allKeys.filter(k => k.startsWith('T'))),
      M_SERIES_MODELS: sortModels(allKeys.filter(k => k.startsWith('M'))),
    };
  }, [catalog.models]);

  // Filter models that have at least one SKU in a given section
  const modelsForSection = useCallback((modelList, sectionId) => {
    const serviceKeys = SECTIONS[sectionId].map((o) => o.key);
    return modelList.filter((model) =>
      serviceKeys.some((svc) => catalog.lookups[model]?.[svc]),
    );
  }, [catalog.lookups]);

  // Per-card state: keyed by `${series}-${sectionId}` e.g. "t-renewal", "m-support"
  const [cardState, setCardState] = useState({});

  const getCardState = useCallback(
    (series, sectionId) => {
      const key = `${series}-${sectionId}`;
      const models = series === 't' ? T_SERIES_MODELS : M_SERIES_MODELS;
      const sectionModels = modelsForSection(models, sectionId);
      const firstModel = sectionModels[0] || models[0];
      const firstService = SECTIONS[sectionId][0]?.key;
      const terms = catalog.getAvailableTerms(firstModel, firstService);
      const defaults = { model: firstModel, serviceType: firstService, term: terms[0] || '1 Year' };
      return cardState[key] ? { ...defaults, ...cardState[key] } : defaults;
    },
    [cardState, T_SERIES_MODELS, M_SERIES_MODELS, modelsForSection, catalog],
  );

  const updateCardState = useCallback((series, sectionId, field, value) => {
    setCardState((prev) => {
      const key = `${series}-${sectionId}`;
      const current = prev[key] || {};
      const updated = { ...current, [field]: value };

      if (field === 'model' || field === 'serviceType') {
        const svcKey = field === 'serviceType' ? value : updated.serviceType || SECTIONS[sectionId][0]?.key;
        const modelKey = field === 'model' ? value : updated.model;
        const terms = catalog.getAvailableTerms(modelKey, svcKey);
        updated.term = terms[0] || '1 Year';
      }

      return { ...prev, [key]: updated };
    });
  }, [catalog]);

  // Filter service options to only those available for the selected model
  const getAvailableOptions = useCallback((model, sectionId) => {
    return SECTIONS[sectionId].filter(
      (opt) => catalog.lookups[model]?.[opt.key],
    );
  }, [catalog.lookups]);

  return useMemo(
    () => ({
      T_SERIES_MODELS,
      M_SERIES_MODELS,
      SECTIONS,
      modelsForSection,
      getCardState,
      updateCardState,
      getAvailableTerms: catalog.getAvailableTerms,
      getSkuForSelection: catalog.getSkuForSelection,
      getPriceForSelection: catalog.getPriceForSelection,
      getUrlForSelection: catalog.getUrlForSelection,
      getAvailableOptions,
      loading: catalog.loading,
      error: catalog.error,
    }),
    [T_SERIES_MODELS, M_SERIES_MODELS, modelsForSection, getCardState, updateCardState,
     catalog, getAvailableOptions],
  );
}
