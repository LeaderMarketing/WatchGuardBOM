import { useState, useCallback, useMemo } from 'react';
import { fireboxCloudProductSkus } from '../../../data/productSkus/fireboxCloud.js';
import { getPriceBySku } from '../../../data/productPrices.js';

const MODELS = [
  { key: 'Firebox Cloud Small', label: 'Small', description: 'Up to 50 users' },
  { key: 'Firebox Cloud Medium', label: 'Medium', description: 'Up to 250 users' },
  { key: 'Firebox Cloud Large', label: 'Large', description: 'Up to 750 users' },
  { key: 'Firebox Cloud XLarge', label: 'XLarge', description: 'Up to 5,000 users' },
];

const SECTIONS = {
  purchase: [
    { label: 'Standard Support', key: 'Standard Support' },
    { label: 'Basic Security Suite', key: 'Basic Security Suite' },
    { label: 'Total Security Suite', key: 'Total Security Suite' },
  ],
  renewal: [
    { label: 'Basic Security Renewal', key: 'Basic Security Renewal' },
    { label: 'Total Security Renewal', key: 'Total Security Renewal' },
  ],
  support: [
    { label: 'Standard Support Renewal', key: 'Standard Support Renewal' },
    { label: 'Gold Support Renewal', key: 'Gold Support Renewal' },
  ],
  individual: [
    { label: 'WebBlocker', key: 'WebBlocker' },
    { label: 'Gateway AntiVirus', key: 'Gateway AntiVirus' },
    { label: 'Intrusion Prevention Service', key: 'Intrusion Prevention Service' },
    { label: 'Reputation Enabled Defense', key: 'Reputation Enabled Defense' },
    { label: 'Application Control', key: 'Application Control' },
    { label: 'APT Blocker', key: 'APT Blocker' },
  ],
  cloud: [
    { label: 'Cloud 1-Month Data Retention', key: 'Cloud 1-Month Data Retention' },
  ],
  tradeUp: [
    { label: 'Trade Up to Basic Security', key: 'Trade Up Basic Security' },
    { label: 'Trade Up to Total Security', key: 'Trade Up Total Security' },
  ],
};

function buildInitialSelections() {
  const selections = {};
  for (const model of MODELS) {
    selections[model.key] = {};
    for (const [sectionId, options] of Object.entries(SECTIONS)) {
      const firstOption = options[0]?.key;
      const availableTerms = Object.keys(fireboxCloudProductSkus[model.key]?.[firstOption] || {});
      selections[model.key][sectionId] = {
        serviceType: firstOption,
        term: availableTerms[0] || '1 Year',
      };
    }
  }
  return selections;
}

export function useFireboxCloudData() {
  const [selections, setSelections] = useState(buildInitialSelections);

  const setSelection = useCallback((modelKey, sectionId, field, value) => {
    setSelections((prev) => {
      const updated = { ...prev };
      updated[modelKey] = { ...updated[modelKey] };
      updated[modelKey][sectionId] = { ...updated[modelKey][sectionId], [field]: value };

      // Reset term when service type changes
      if (field === 'serviceType') {
        const availableTerms = Object.keys(fireboxCloudProductSkus[modelKey]?.[value] || {});
        updated[modelKey][sectionId].term = availableTerms[0] || '1 Year';
      }
      return updated;
    });
  }, []);

  const getAvailableTerms = useCallback((modelKey, serviceType) => {
    return Object.keys(fireboxCloudProductSkus[modelKey]?.[serviceType] || {});
  }, []);

  const getSkuForSelection = useCallback((modelKey, serviceType, term) => {
    return fireboxCloudProductSkus[modelKey]?.[serviceType]?.[term] || null;
  }, []);

  const getPriceForSelection = useCallback((modelKey, serviceType, term) => {
    const sku = fireboxCloudProductSkus[modelKey]?.[serviceType]?.[term];
    return sku ? getPriceBySku(sku) : null;
  }, []);

  return useMemo(() => ({
    MODELS,
    SECTIONS,
    selections,
    setSelection,
    getAvailableTerms,
    getSkuForSelection,
    getPriceForSelection,
  }), [selections, setSelection, getAvailableTerms, getSkuForSelection, getPriceForSelection]);
}
