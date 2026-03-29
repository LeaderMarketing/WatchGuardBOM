import { useState, useCallback, useMemo } from 'react';
import { useApplianceCatalog } from '../../hooks/useApplianceCatalog.js';

// ── Tab definitions ──
export const TABS = [
  { key: 'tabletop', label: 'Firebox T-Series' },
  { key: 'mseries', label: 'Firebox M-Series' },
  { key: 'virtual', label: 'FireboxV' },
  { key: 'cloud', label: 'Firebox Cloud' },
];

export function getModelPrefix(tab) {
  switch (tab) {
    case 'tabletop': return 'Firebox';
    case 'mseries': return 'Firebox';
    default: return '';
  }
}

// ── Section definitions (service type options per section) ──
export const SECTIONS = {
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

export function useRenewalsData() {
  // Fetch all 5 categories that contain renewal-relevant data:
  // - renewals: legacy T/M models (T15, T20, M270, M370, etc.)
  // - tabletop: current T-series (T25, T45, T85-PoE, etc.)
  // - mseries: current M-series (M290, M390, M495, etc.)
  // - virtual: FireboxV models
  // - cloud: Firebox Cloud models
  const renewalsCatalog = useApplianceCatalog('renewals');
  const tabletopCatalog = useApplianceCatalog('tabletop');
  const mseriesCatalog = useApplianceCatalog('mseries');
  const virtualCatalog = useApplianceCatalog('virtual');
  const cloudCatalog = useApplianceCatalog('cloud');

  const [activeTab, setActiveTab] = useState('tabletop');
  const [cardState, setCardState] = useState({});

  // Merge T/M lookups from renewals + tabletop + mseries
  const applianceLookups = useMemo(() => {
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

  // Derive model lists from merged data
  const { tModels, mModels, vModels, cModels } = useMemo(() => {
    const allApplianceKeys = Object.keys(applianceLookups);
    return {
      tModels: sortModels(allApplianceKeys.filter(k => k.startsWith('T'))),
      mModels: sortModels(allApplianceKeys.filter(k => k.startsWith('M'))),
      vModels: virtualCatalog.models.map(m => m.key).sort(),
      cModels: cloudCatalog.models.map(m => m.key).sort(),
    };
  }, [applianceLookups, virtualCatalog.models, cloudCatalog.models]);

  // Select the right lookups and model list for the active tab
  const { lookups, models } = useMemo(() => {
    switch (activeTab) {
      case 'tabletop': return { lookups: applianceLookups, models: tModels };
      case 'mseries': return { lookups: applianceLookups, models: mModels };
      case 'virtual': return { lookups: virtualCatalog.lookups, models: vModels };
      case 'cloud': return { lookups: cloudCatalog.lookups, models: cModels };
      default: return { lookups: applianceLookups, models: [] };
    }
  }, [activeTab, applianceLookups, virtualCatalog.lookups, cloudCatalog.lookups, tModels, mModels, vModels, cModels]);

  const modelPrefix = getModelPrefix(activeTab);

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

  const getCardState = useCallback(
    (cardId) => {
      const firstModel = models[0] || '';
      const defaults = { model: firstModel, serviceType: '', term: '1 Year' };
      return cardState[cardId] ? { ...defaults, ...cardState[cardId] } : defaults;
    },
    [cardState, models],
  );

  const updateCardState = useCallback((cardId, field, value) => {
    setCardState((prev) => {
      const current = prev[cardId] || {};
      const updated = { ...current, [field]: value };

      if (field === 'model' || field === 'serviceType') {
        const svcKey = field === 'serviceType' ? value : updated.serviceType;
        const modelKey = field === 'model' ? value : updated.model;
        const terms = getAvailableTerms(modelKey, svcKey);
        updated.term = terms[0] || '1 Year';
      }

      return { ...prev, [cardId]: updated };
    });
  }, [getAvailableTerms]);

  const getAvailableOptions = useCallback((model, sectionId) => {
    return SECTIONS[sectionId].filter(
      (opt) => lookups[model]?.[opt.key],
    );
  }, [lookups]);

  const getModelsForSection = useCallback((sectionId) => {
    const serviceKeys = SECTIONS[sectionId].map((o) => o.key);
    return models.filter((model) =>
      serviceKeys.some((svc) => lookups[model]?.[svc]),
    );
  }, [models, lookups]);

  return useMemo(
    () => ({
      activeTab,
      setActiveTab,
      models,
      modelPrefix,
      SECTIONS,
      getModelsForSection,
      getCardState,
      updateCardState,
      getAvailableTerms,
      getSkuForSelection,
      getPriceForSelection,
      getUrlForSelection,
      getAvailableOptions,
      loading: renewalsCatalog.loading || tabletopCatalog.loading || mseriesCatalog.loading || virtualCatalog.loading || cloudCatalog.loading,
      error: renewalsCatalog.error || tabletopCatalog.error || mseriesCatalog.error || virtualCatalog.error || cloudCatalog.error,
    }),
    [activeTab, setActiveTab, models, modelPrefix, getModelsForSection, getCardState, updateCardState,
     getAvailableTerms, getSkuForSelection, getPriceForSelection, getUrlForSelection,
     getAvailableOptions, renewalsCatalog.loading, tabletopCatalog.loading, mseriesCatalog.loading,
     virtualCatalog.loading, cloudCatalog.loading, renewalsCatalog.error, tabletopCatalog.error,
     mseriesCatalog.error, virtualCatalog.error, cloudCatalog.error],
  );
}
