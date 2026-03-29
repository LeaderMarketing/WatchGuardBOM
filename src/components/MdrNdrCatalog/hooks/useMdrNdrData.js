import { usePerUserCatalog } from '../../../hooks/usePerUserCatalog.js';

const PRODUCTS = [
  {
    key: 'Core MDR',
    label: 'WatchGuard Core MDR',
    group: 'mdr',
    description: 'Managed detection and response with WatchGuard\'s SOC team monitoring your endpoints 24/7',
    tiers: ['1-50', '51-100', '101-250', '251-500', '501-1000', '1001-5000', '5001+'],
  },
  {
    key: 'Core MDR for Microsoft',
    label: 'WatchGuard Core MDR for Microsoft',
    group: 'mdr',
    description: 'MDR service optimised for Microsoft 365 environments with dedicated threat monitoring',
    tiers: ['1-50', '51-100', '101-250', '251-500', '501-1000', '1001-5000', '5001+'],
  },
  {
    key: 'Total MDR',
    label: 'WatchGuard Total MDR',
    group: 'mdr',
    description: 'Comprehensive MDR with advanced threat hunting, remediation, and full SOC coverage',
    tiers: ['1-50', '51-100', '101-250', '251-500', '501-1000', '1001-5000', '5001+'],
  },
  {
    key: 'ThreatSync+ NDR',
    label: 'WatchGuard ThreatSync+ NDR',
    group: 'ndr',
    description: 'AI-driven network detection and response for deep visibility across network traffic',
    tiers: ['1-50', '51-100', '101-250', '251-500'],
  },
  {
    key: 'Total NDR',
    label: 'WatchGuard Total NDR',
    group: 'ndr',
    description: 'Complete network detection and response with advanced analytics and automated remediation',
    tiers: ['1-50', '51-100', '101-250', '251+'],
  },
  {
    key: 'ThreatSync+ SaaS',
    label: 'WatchGuard ThreatSync+ SaaS',
    group: 'ndr',
    description: 'Cloud application monitoring and threat detection for SaaS environments',
    tiers: ['1-50', '51-100', '101-250', '251+'],
  },
];

export { PRODUCTS };

export function useMdrNdrData() {
  return usePerUserCatalog('mdr_ndr', PRODUCTS);
}
