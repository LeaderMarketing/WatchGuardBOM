import { useState, useCallback, useMemo } from 'react';
import { useApplianceCatalog } from '../../../hooks/useApplianceCatalog.js';

const MODELS = [
  { key: 'FireboxV Small', label: 'Small', description: 'Up to 50 users' },
  { key: 'FireboxV Medium', label: 'Medium', description: 'Up to 250 users' },
  { key: 'FireboxV Large', label: 'Large', description: 'Up to 750 users' },
  { key: 'FireboxV XLarge', label: 'XLarge', description: 'Up to 1,500 users' },
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
    { label: 'spamBlocker', key: 'spamBlocker' },
    { label: 'Gateway AntiVirus', key: 'Gateway AntiVirus' },
    { label: 'Intrusion Prevention Service', key: 'Intrusion Prevention Service' },
    { label: 'Reputation Enabled Defense', key: 'Reputation Enabled Defense' },
    { label: 'Application Control', key: 'Application Control' },
    { label: 'APT Blocker', key: 'APT Blocker' },
    { label: 'Network Discovery', key: 'Network Discovery' },
  ],
  cloud: [
    { label: 'Cloud 1-Month Data Retention', key: 'Cloud Data Retention' },
  ],
  tradeUp: [
    { label: 'Trade Up to Basic Security', key: 'Trade Up Basic Security' },
    { label: 'Trade Up to Total Security', key: 'Trade Up Total Security' },
  ],
};

export function useFireboxVData() {
  const catalog = useApplianceCatalog('virtual');

  const [selections, setSelections] = useState(() => {
    const initial = {};
    for (const model of MODELS) {
      initial[model.key] = {};
      for (const sectionId of Object.keys(SECTIONS)) {
        const firstOption = SECTIONS[sectionId][0]?.key;
        initial[model.key][sectionId] = {
          serviceType: firstOption,
          term: '1 Year',
        };
      }
    }
    return initial;
  });

  const setSelection = useCallback((modelKey, sectionId, field, value) => {
    setSelections((prev) => {
      const updated = { ...prev };
      updated[modelKey] = { ...updated[modelKey] };
      updated[modelKey][sectionId] = { ...updated[modelKey][sectionId], [field]: value };

      if (field === 'serviceType') {
        const availableTerms = catalog.getAvailableTerms(modelKey, value);
        updated[modelKey][sectionId].term = availableTerms[0] || '1 Year';
      }
      return updated;
    });
  }, [catalog]);

  return useMemo(() => ({
    MODELS,
    SECTIONS,
    selections,
    setSelection,
    getAvailableTerms: catalog.getAvailableTerms,
    getSkuForSelection: catalog.getSkuForSelection,
    getPriceForSelection: catalog.getPriceForSelection,
    getUrlForSelection: catalog.getUrlForSelection,
    loading: catalog.loading,
    error: catalog.error,
  }), [selections, setSelection, catalog]);
}
