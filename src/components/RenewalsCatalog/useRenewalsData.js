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
  const renewalsCatalog = useApplianceCatalog('renewals');
  const virtualCatalog = useApplianceCatalog('virtual');
  const cloudCatalog = useApplianceCatalog('cloud');

  const [activeTab, setActiveTab] = useState('tabletop');
  const [cardState, setCardState] = useState({});

  // Derive model lists from API data
  const { tModels, mModels, vModels, cModels } = useMemo(() => {
    const allRenewalKeys = renewalsCatalog.models.map(m => m.key);
    return {
      tModels: sortModels(allRenewalKeys.filter(k => k.startsWith('T'))),
      mModels: sortModels(allRenewalKeys.filter(k => k.startsWith('M'))),
      vModels: virtualCatalog.models.map(m => m.key).sort(),
      cModels: cloudCatalog.models.map(m => m.key).sort(),
    };
  }, [renewalsCatalog.models, virtualCatalog.models, cloudCatalog.models]);

  // Select the right catalog and model list for the active tab
  const { catalog, models } = useMemo(() => {
    switch (activeTab) {
      case 'tabletop': return { catalog: renewalsCatalog, models: tModels };
      case 'mseries': return { catalog: renewalsCatalog, models: mModels };
      case 'virtual': return { catalog: virtualCatalog, models: vModels };
      case 'cloud': return { catalog: cloudCatalog, models: cModels };
      default: return { catalog: renewalsCatalog, models: [] };
    }
  }, [activeTab, renewalsCatalog, virtualCatalog, cloudCatalog, tModels, mModels, vModels, cModels]);

  const modelPrefix = getModelPrefix(activeTab);

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
        const terms = catalog.getAvailableTerms(modelKey, svcKey);
        updated.term = terms[0] || '1 Year';
      }

      return { ...prev, [cardId]: updated };
    });
  }, [catalog]);

  const getAvailableOptions = useCallback((model, sectionId) => {
    return SECTIONS[sectionId].filter(
      (opt) => catalog.lookups[model]?.[opt.key],
    );
  }, [catalog.lookups]);

  const getModelsForSection = useCallback((sectionId) => {
    const serviceKeys = SECTIONS[sectionId].map((o) => o.key);
    return models.filter((model) =>
      serviceKeys.some((svc) => catalog.lookups[model]?.[svc]),
    );
  }, [models, catalog.lookups]);

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
      getAvailableTerms: catalog.getAvailableTerms,
      getSkuForSelection: catalog.getSkuForSelection,
      getPriceForSelection: catalog.getPriceForSelection,
      getUrlForSelection: catalog.getUrlForSelection,
      getAvailableOptions,
      loading: renewalsCatalog.loading || virtualCatalog.loading || cloudCatalog.loading,
      error: renewalsCatalog.error || virtualCatalog.error || cloudCatalog.error,
    }),
    [activeTab, setActiveTab, models, modelPrefix, getModelsForSection, getCardState, updateCardState,
     catalog, getAvailableOptions, renewalsCatalog.loading, virtualCatalog.loading, cloudCatalog.loading,
     renewalsCatalog.error, virtualCatalog.error, cloudCatalog.error],
  );
}
