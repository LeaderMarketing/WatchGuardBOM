# NDR Tab Content Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Replace the NDR placeholder with real content sections: comparison table, key capabilities cards, and metrics bar. Reorder NDR products (SaaS → NDR → Total NDR) and remove tab counts.

**Architecture:** All changes are in 3 files within `src/components/MdrNdrCatalog/`. No new files, no data changes. The NDR sections reuse existing CSS class patterns from the MDR sections (comparisonTable, capabilitiesGrid, metricsBar).

**Tech Stack:** React, CSS Modules, Phosphor Icons

---

### Task 1: Reorder NDR products in useMdrNdrData.js

**Files:**
- Modify: `src/components/MdrNdrCatalog/hooks/useMdrNdrData.js:25-46`

**Step 1: Reorder the NDR product entries**

Move `ThreatSync+ SaaS` first, then `ThreatSync+ NDR`, then `Total NDR` (good-better-best). Current order is NDR → Total NDR → SaaS.

Replace lines 25-46 with:

```javascript
  {
    key: 'ThreatSync+ SaaS',
    label: 'WatchGuard ThreatSync+ SaaS',
    group: 'ndr',
    description: 'Cloud application monitoring and threat detection for SaaS environments like Office 365',
    tiers: ['1-50', '51-100', '101-250', '251+'],
  },
  {
    key: 'ThreatSync+ NDR',
    label: 'WatchGuard ThreatSync+ NDR',
    group: 'ndr',
    description: 'AI-driven network detection and response with deep visibility across network, cloud, and on-prem traffic',
    tiers: ['1-50', '51-100', '101-250', '251-500'],
  },
  {
    key: 'Total NDR',
    label: 'WatchGuard Total NDR',
    group: 'ndr',
    description: 'Complete network detection and response with advanced analytics, automated remediation, and compliance reporting',
    tiers: ['1-50', '51-100', '101-250', '251+'],
  },
```

**Step 2: Verify** — Run `npm run dev:frontend`, check NDR tab shows cards in order: SaaS, NDR, Total NDR.

---

### Task 2: Remove tab counts from CategoryTabs

**Files:**
- Modify: `src/components/MdrNdrCatalog/MdrNdrCatalog.jsx:216-237`

**Step 1: Remove productCounts prop and count rendering**

In `CategoryTabs`, remove the `productCounts` prop and the `<span>` that renders it. Replace lines 216-236:

```jsx
function CategoryTabs({ activeTab, setActiveTab }) {
  return (
    <div className={styles.tabBar}>
      {TAB_ORDER.map((key) => {
        const Icon = TAB_ICONS[key];
        return (
          <button
            key={key}
            className={`${styles.tabBtn} ${activeTab === key ? styles.tabActive : ''}`}
            onClick={() => setActiveTab(key)}
          >
            <Icon size={16} weight={activeTab === key ? 'fill' : 'duotone'} />
            {TAB_LABELS[key]}
          </button>
        );
      })}
    </div>
  );
}
```

**Step 2: Clean up the caller**

In `MdrNdrCatalog()` (line 576-591), remove the `productCounts` variable and the prop from `<CategoryTabs>`:

Remove lines 576-579:
```javascript
  const productCounts = {
    mdr: mdrProducts.length,
    ndr: ndrProducts.length,
  };
```

Change the `<CategoryTabs>` call (lines 587-591) to:
```jsx
      <CategoryTabs
        activeTab={activeTab}
        setActiveTab={setActiveTab}
      />
```

**Step 3: Verify** — Tabs now show "Managed Detection & Response" and "Network Detection & Response" without "(3)".

---

### Task 3: Update banner content for NDR tab

**Files:**
- Modify: `src/components/MdrNdrCatalog/MdrNdrCatalog.jsx:55-59`

**Step 1: Replace NDR banner text**

Replace lines 55-59:
```javascript
  ndr: {
    headline: 'AI-Powered Network Detection and Response',
    description:
      'Gain complete visibility across your network — from Firebox appliances to third-party infrastructure and cloud workloads. WatchGuard NDR uses multi-layer neural networks and flow-based ML to detect threats like lateral movement, ransomware, and command-and-control traffic — no SOC required.',
  },
```

**Step 2: Verify** — Switch to NDR tab, banner shows updated headline and description.

---

### Task 4: Build NdrComparisonTable component

**Files:**
- Modify: `src/components/MdrNdrCatalog/MdrNdrCatalog.jsx:547-559`

**Step 1: Replace the NdrContent placeholder**

Replace the entire `NdrContent` function (lines 550-559) with three new components. Reuse the existing `Check` and `NoCheck` helper components (lines 242-247).

```jsx
/* ═══════════════════════════════════════════════════════════
   NDR Comparison Table
   ═══════════════════════════════════════════════════════════ */
function NdrComparisonTable() {
  return (
    <section className={styles.comparisonSection}>
      <h2 className={styles.comparisonHeadline}>Which NDR Solution Is Right for You?</h2>
      <p className={styles.comparisonDesc}>
        From SaaS application monitoring to full-spectrum network detection with compliance reporting.
      </p>
      <div className={styles.tableWrap}>
        <table className={styles.comparisonTable}>
          <thead>
            <tr>
              <th>Feature</th>
              <th>ThreatSync+ SaaS</th>
              <th>ThreatSync+ NDR</th>
              <th>Total NDR</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td><strong>Ideal for:</strong></td>
              <td>Office 365 & SaaS monitoring</td>
              <td>Full network & cloud visibility</td>
              <td>Network visibility + compliance</td>
            </tr>
            {/* Network Monitoring */}
            <tr>
              <td><strong>Firebox Network Activity</strong> (incl. VPN, DHCP)</td>
              <td><NoCheck /></td>
              <td><Check /></td>
              <td><Check /></td>
            </tr>
            <tr>
              <td><strong>NetFlow/Flow Logs</strong> (any switch, router, firewall)</td>
              <td><NoCheck /></td>
              <td><Check /></td>
              <td><Check /></td>
            </tr>
            <tr>
              <td><strong>DHCP Logs from Active Directory</strong></td>
              <td><NoCheck /></td>
              <td><Check /></td>
              <td><Check /></td>
            </tr>
            <tr>
              <td><strong>Cloud Workload Flow Logs</strong> (Azure, AWS, IONOS)</td>
              <td><NoCheck /></td>
              <td><Check /></td>
              <td><Check /></td>
            </tr>
            <tr>
              <td><strong>Office 365 Application Logs</strong></td>
              <td><Check /></td>
              <td><NoCheck /></td>
              <td><NoCheck /></td>
            </tr>
            {/* Response Actions */}
            <tr>
              <td><strong>Block IP on Firebox</strong></td>
              <td><NoCheck /></td>
              <td><Check /></td>
              <td><Check /></td>
            </tr>
            <tr>
              <td><strong>Block Device via WatchGuard EPDR</strong></td>
              <td><Check /></td>
              <td><Check /></td>
              <td><Check /></td>
            </tr>
            <tr>
              <td><strong>Disable Users via AD or AuthPoint</strong></td>
              <td><Check /></td>
              <td><Check /></td>
              <td><Check /></td>
            </tr>
            {/* Reporting */}
            <tr>
              <td><strong>Executive Summary Report</strong></td>
              <td><Check /></td>
              <td><Check /></td>
              <td><Check /></td>
            </tr>
            <tr>
              <td><strong>Ransomware Prevention Report</strong></td>
              <td><NoCheck /></td>
              <td><Check /></td>
              <td><Check /></td>
            </tr>
            <tr>
              <td><strong>Defense Goal Reports</strong></td>
              <td><NoCheck /></td>
              <td><Check /></td>
              <td><Check /></td>
            </tr>
            <tr>
              <td><strong>Compliance Reports</strong></td>
              <td><NoCheck /></td>
              <td><NoCheck /></td>
              <td><Check /></td>
            </tr>
          </tbody>
        </table>
      </div>
    </section>
  );
}
```

**Step 2: Verify** — NDR tab shows the comparison table with 3 columns in correct order.

---

### Task 5: Build NdrCapabilities and NdrMetricsBar components

**Files:**
- Modify: `src/components/MdrNdrCatalog/MdrNdrCatalog.jsx` (add after NdrComparisonTable)

**Step 1: Add new Phosphor icon imports**

At the top of the file (lines 2-24), add these icons if not already imported: `ShieldWarning`, `ArrowsOutCardinal`, `Cloud`, `Desktop`. `MagnifyingGlass` and `Lightning` are already imported.

Add to the import block:
```javascript
  ShieldWarning,
  ArrowsOutCardinal,
  Cloud,
  Desktop,
```

**Step 2: Add NdrCapabilities constant and component**

```jsx
/* ═══════════════════════════════════════════════════════════
   NDR Key Capabilities
   ═══════════════════════════════════════════════════════════ */
const NDR_CAPABILITIES = [
  { icon: MagnifyingGlass, title: 'AI-Driven Threat Detection', desc: 'Multi-layer neural networks analyze network flows to catch threats that signature-based tools miss.' },
  { icon: ShieldWarning, title: 'Ransomware Prevention', desc: 'Early-stage detection of ransomware behaviours with guided remediation before encryption begins.' },
  { icon: ArrowsOutCardinal, title: 'Lateral Movement Detection', desc: 'Spot attackers moving between systems — even across network segments and VPN tunnels.' },
  { icon: Cloud, title: 'Cloud Workload Monitoring', desc: 'Monitor flow logs from Azure, AWS, and IONOS alongside on-premises network traffic.' },
  { icon: Desktop, title: 'Rogue Device Discovery', desc: 'Identify unmanaged and unauthorised devices on your network with continuous visibility.' },
  { icon: Lightning, title: 'Automated Response', desc: 'Integrated with ThreatSync XDR to block IPs, isolate devices, and disable compromised users.' },
];

function NdrCapabilities() {
  return (
    <section className={styles.capabilitiesSection}>
      <h2 className={styles.sectionHeadline}>Key Capabilities</h2>
      <div className={styles.capabilitiesGrid}>
        {NDR_CAPABILITIES.map((cap, i) => (
          <div key={i} className={styles.capabilityCard}>
            <cap.icon size={28} weight="duotone" className={styles.capabilityIcon} />
            <h4 className={styles.capabilityTitle}>{cap.title}</h4>
            <p className={styles.capabilityDesc}>{cap.desc}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
```

**Step 3: Add NdrMetricsBar component**

```jsx
/* ═══════════════════════════════════════════════════════════
   NDR Metrics Bar
   ═══════════════════════════════════════════════════════════ */
function NdrMetricsBar() {
  return (
    <div className={styles.metricsBar}>
      <div className={styles.metric}>
        <span className={styles.metricValue}>100%</span>
        <span className={styles.metricLabel}>Cloud-Native</span>
      </div>
      <div className={styles.metric}>
        <span className={styles.metricValue}>Weeks → Hours</span>
        <span className={styles.metricLabel}>Threat response time</span>
      </div>
      <div className={styles.metric}>
        <span className={styles.metricValue}>Zero</span>
        <span className={styles.metricLabel}>On-prem hardware required</span>
      </div>
      <div className={styles.metric}>
        <span className={styles.metricValue}>Full Stack</span>
        <span className={styles.metricLabel}>Network + Cloud + SaaS visibility</span>
      </div>
    </div>
  );
}
```

**Step 4: Verify** — Components render without errors.

---

### Task 6: Wire up NDR sections in the main component

**Files:**
- Modify: `src/components/MdrNdrCatalog/MdrNdrCatalog.jsx:612`

**Step 1: Replace the NDR render block**

Change line 612 from:
```jsx
      {activeTab === 'ndr' && <NdrContent />}
```

To:
```jsx
      {activeTab === 'ndr' && (
        <>
          <NdrComparisonTable />
          <NdrMetricsBar />
          <NdrCapabilities />
        </>
      )}
```

**Step 2: Remove old NdrContent function and CSS**

Delete the old `NdrContent` function (it's been replaced).

In `MdrNdrCatalog.module.css`, remove the NDR placeholder styles (lines 842-852):
```css
.ndrPlaceholder { ... }
.ndrPlaceholderText { ... }
```

**Step 3: Final verification**

Run `npm run dev:frontend` and verify:
- [ ] NDR tab shows cards in order: SaaS → NDR → Total NDR
- [ ] Tab buttons show "Managed Detection & Response" and "Network Detection & Response" (no counts)
- [ ] Banner shows updated headline and description
- [ ] Comparison table renders with 3 columns in correct order (SaaS, NDR, Total NDR)
- [ ] Metrics bar renders with 4 stats
- [ ] Key capabilities renders 6 cards
- [ ] MDR tab is unchanged
- [ ] No console errors

**Step 4: Commit**

```bash
git add src/components/MdrNdrCatalog/
git commit -m "feat: add NDR tab content — comparison table, capabilities, metrics bar

Replaces the NDR placeholder with three content sections:
- Comparison table (SaaS vs NDR vs Total NDR)
- Metrics bar (cloud-native, response time, etc.)
- Key capabilities (6 cards)

Also reorders NDR products good-to-best and removes tab counts."
```
