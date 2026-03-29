import { usePerUserCatalog } from '../../../hooks/usePerUserCatalog.js';

const WG_TIERS = ['1-50', '51-100', '101-250', '251-500', '501-1000', '1001-5000', '5001+'];

export const PRODUCTS = [
  // --- Core ---
  {
    key: 'EPP',
    label: 'WatchGuard EPP',
    group: 'watchguard',
    section: 'core',
    badge: 'Good',
    description: 'Endpoint Protection Platform — antivirus, anti-exploit, URL filtering, and device firewall for comprehensive baseline protection.',
    tiers: WG_TIERS,
  },
  {
    key: 'EDR',
    label: 'WatchGuard EDR',
    group: 'watchguard',
    section: 'core',
    badge: 'Better',
    description: 'Endpoint Detection & Response — zero-trust app service, threat hunting, and behavioral detection for advanced threat visibility.',
    tiers: WG_TIERS,
  },
  {
    key: 'EPDR',
    label: 'WatchGuard EPDR',
    group: 'watchguard',
    section: 'core',
    badge: 'Best',
    description: 'Full EPP + EDR in one agent — combines prevention, detection, and response with ThreatSync XDR integration.',
    tiers: WG_TIERS,
  },
  {
    key: 'Advanced EPDR',
    label: 'WatchGuard Advanced EPDR',
    group: 'watchguard',
    section: 'core',
    badge: 'Premium',
    description: 'EPDR plus advanced threat hunting, IOA policies, remote shell access, and priority threat intelligence.',
    tiers: WG_TIERS,
  },
  // --- Modules ---
  {
    key: 'Full Encryption',
    label: 'Full Encryption',
    group: 'watchguard',
    section: 'modules',
    description: 'Centrally manage BitLocker (Windows) and FileVault (macOS) encryption with recovery key escrow.',
    tiers: WG_TIERS,
  },
  {
    key: 'Patch Management',
    label: 'Patch Management',
    group: 'watchguard',
    section: 'modules',
    description: 'Discover, prioritise, and deploy OS and third-party application patches from a single console.',
    tiers: WG_TIERS,
  },
  {
    key: 'Advanced Reporting Tool',
    label: 'Advanced Reporting Tool',
    group: 'watchguard',
    section: 'modules',
    description: 'SIEM-ready advanced telemetry, custom dashboards, and automated compliance reporting.',
    tiers: WG_TIERS,
  },
  // --- DNS ---
  {
    key: 'DNSWatchGO',
    label: 'WatchGuard DNSWatchGO',
    group: 'watchguard',
    section: 'dns',
    description: 'DNS-level content filtering and phishing protection for users on and off the corporate network.',
    tiers: WG_TIERS,
  },
  // --- Bundle ---
  {
    key: 'Passport',
    label: 'WatchGuard Passport',
    group: 'watchguard',
    section: 'bundle',
    description: 'All-in-one user security bundle: EPDR + AuthPoint MFA + DNSWatchGO in a single per-user license.',
    tiers: WG_TIERS,
  },
  // --- Legacy Panda ---
  {
    key: 'Panda EPP+',
    label: 'Panda Endpoint Protection Plus',
    group: 'panda',
    section: 'panda',
    description: 'Legacy endpoint protection with centralised management, antivirus, anti-malware, and personal firewall.',
    tiers: ['1-10', '11-25', '26-50', '51-100', '101-250', '251-500', '501-1000', '1001-3000', '3000+'],
  },
  {
    key: 'Panda AD360',
    label: 'Panda Adaptive Defense 360',
    group: 'panda',
    section: 'panda',
    description: 'Legacy EPP + EDR with 100% classification of running processes and zero-trust application model.',
    tiers: ['1-50', '51-100'],
  },
  {
    key: 'Panda Patch Management',
    label: 'Panda Patch Management',
    group: 'panda',
    section: 'panda',
    description: 'Legacy patch management module for discovering vulnerabilities and deploying third-party patches.',
    tiers: ['1-10', '11-25', '26-50', '51-100', '101-250', '251-500', '501-1000', '1001-3000', '3000+'],
  },
];

export function useEndpointData() {
  return usePerUserCatalog('endpoint', PRODUCTS);
}
