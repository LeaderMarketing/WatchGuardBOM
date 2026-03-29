import { usePerUserCatalog } from '../../../hooks/usePerUserCatalog.js';

const TIERS = ['1-50', '51-100', '101-250', '251-500', '501-1000', '1001-5000', '5001+'];

export const PRODUCTS = [
  {
    key: 'AuthPoint',
    label: 'WatchGuard AuthPoint',
    group: 'identity',
    section: 'core',
    description: 'Cloud-based multi-factor authentication with push notifications, SSO, and risk-based access policies.',
    tiers: TIERS,
  },
  {
    key: 'Total Identity Security',
    label: 'AuthPoint Total Identity Security',
    group: 'identity',
    section: 'core',
    description: 'AuthPoint MFA plus dark web credential monitoring and a corporate password manager for complete identity protection.',
    tiers: TIERS,
  },
];

export function useIdentityData() {
  return usePerUserCatalog('identity', PRODUCTS);
}
