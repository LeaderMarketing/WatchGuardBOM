import { usePerUserCatalog } from '../../../hooks/usePerUserCatalog.js';

const PANDA_TIERS = ['1-10', '11-25', '26-50', '51-100', '101-250', '251-500', '501-1000', '1001-3000', '3000+'];

export const PRODUCTS = [
  {
    key: 'Panda Email Protection',
    label: 'Panda Email Protection',
    group: 'email',
    section: 'core',
    description: 'Cloud-based email gateway with multi-layer anti-spam, anti-phishing, anti-malware, and content filtering for inbound and outbound email.',
    tiers: PANDA_TIERS,
  },
];

export function useEmailData() {
  return usePerUserCatalog('email', PRODUCTS);
}
