import React, { useState } from 'react';
import {
  ShoppingCartSimple,
  ShieldCheckered,
  Eye,
  CaretLeft,
  CaretRight,
  CheckCircle,
  XCircle,
  Lightning,
  Brain,
  Target,
  Pulse,
  ShieldStar,
  Handshake,
  ChartLineUp,
  Clock,
  Headset,
  WarningOctagon,
  Bug,
  Shuffle,
  CloudArrowUp,
  MagnifyingGlass,
  ShieldWarning,
  ArrowsOutCardinal,
  Cloud,
  Desktop,
} from '@phosphor-icons/react';
import styles from './MdrNdrCatalog.module.css';
import { useMdrNdrData } from './hooks/useMdrNdrData.js';
import { useQuote } from '../../context/QuoteContext.jsx';
import { formatPrice } from '../../data/productPrices.js';

const BASE_URL = import.meta.env.BASE_URL;

/* ─── Tab definitions ─── */
const TAB_ORDER = ['mdr', 'ndr'];
const TAB_LABELS = {
  mdr: 'Managed Detection & Response',
  ndr: 'Network Detection & Response',
};
const TAB_ICONS = {
  mdr: ShieldCheckered,
  ndr: Eye,
};

const BANNERS = {
  mdr: `${BASE_URL}banners/mdr_banner.jpg`,
  ndr: `${BASE_URL}banners/ndr_banner.jpg`,
};

/* ─── Tab content config ─── */
const TAB_CONTENT = {
  mdr: {
    headline: '24/7 Threat Detection and Response Across Your Security Stack',
    description:
      'WatchGuard MDR is a fully managed 24/7 service that doesn\'t just alert you to threats – we act on them. Cutting through the noise, our team helps you focus on what matters, and respond fast to threats across your laptops, servers, user identities, network, and cloud.',
  },
  ndr: {
    headline: 'AI-Powered Network Detection and Response',
    description:
      'Gain complete visibility across your network — from Firebox appliances to third-party infrastructure and cloud workloads. WatchGuard NDR uses multi-layer neural networks and flow-based ML to detect threats like lateral movement, ransomware, and command-and-control traffic — no SOC required.',
  },
};

/* ─── Reusable SKU display ─── */
function SkuLink({ sku, url }) {
  if (!sku) return null;
  if (url) {
    return (
      <a href={url} target="_blank" rel="noopener noreferrer" className={styles.skuLink}>
        {sku}
      </a>
    );
  }
  return <span className={styles.skuCode}>{sku}</span>;
}

/* ═══════════════════════════════════════════════════════════
   Product Card — one per product line
   ═══════════════════════════════════════════════════════════ */
function ProductCard({ product, data, onAdd }) {
  const { selections, setSelection, getAvailableTerms, getSkuForSelection, getPriceForSelection, getUrlForSelection } = data;
  const sel = selections[product.key] || {};
  const tier = sel.tier || product.tiers[0];
  const terms = getAvailableTerms(product.key, tier);
  const term = sel.term || terms[0];
  const sku = getSkuForSelection(product.key, tier, term);
  const price = getPriceForSelection(product.key, tier, term);
  const url = getUrlForSelection(product.key, tier, term);
  const imageUrl = sku ? `https://www.leadersystems.com.au/Images/${sku}.jpg` : null;

  const handleTierChange = (e) => {
    const newTier = e.target.value;
    setSelection(product.key, 'tier', newTier);
    const newTerms = getAvailableTerms(product.key, newTier);
    if (newTerms.length && !newTerms.includes(sel.term)) {
      setSelection(product.key, 'term', newTerms[0]);
    }
  };

  return (
    <div className={styles.productCard}>
      {imageUrl && (
        <div className={styles.cardImageWrap}>
          <img src={imageUrl} alt={product.label} className={styles.cardImage} />
        </div>
      )}
      <div className={styles.cardBody}>
        <h3 className={styles.cardName}>{product.label}</h3>
        <p className={styles.cardDesc}>{product.description}</p>

        <div className={styles.fieldGroup}>
          <label className={styles.fieldLabel}>License Tier</label>
          <select
            className={styles.selectField}
            value={tier}
            onChange={handleTierChange}
          >
            {product.tiers.map((t) => (
              <option key={t} value={t}>{t} licenses</option>
            ))}
          </select>
        </div>

        {terms.length > 0 && (
          <div className={styles.fieldGroup}>
            <label className={styles.fieldLabel}>Subscription Term</label>
            <select
              className={styles.selectField}
              value={term}
              onChange={(e) => setSelection(product.key, 'term', e.target.value)}
            >
              {terms.map((t) => (
                <option key={t} value={t}>{t}</option>
              ))}
            </select>
          </div>
        )}

        <div className={styles.priceBlock}>
          <div className={styles.priceRow}>
            <span className={styles.price}>{formatPrice(price)}</span>
            <span className={styles.priceNote}>MSRP <span className={styles.perSeat}>per seat</span></span>
          </div>
        </div>

        <button
          className={styles.addBtn}
          disabled={!sku}
          onClick={() =>
            onAdd({
              sku,
              name: product.label,
              description: `${tier} licenses (${term})`,
              unitPrice: price || 0,
            })
          }
          title="Add to quote cart"
        >
          <ShoppingCartSimple size={14} weight="bold" />
          Add to Cart
        </button>
        <SkuLink sku={sku} url={url} />
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════
   Banner with navigation arrows
   ═══════════════════════════════════════════════════════════ */
function MdrNdrBanner({ activeTab, setActiveTab }) {
  const [imgFailed, setImgFailed] = useState({});
  const content = TAB_CONTENT[activeTab];

  return (
    <div className={styles.bannerWrap}>
      {imgFailed[activeTab] ? (
        <div className={`${styles.bannerFallback} ${activeTab === 'mdr' ? styles.bannerFallbackMdr : styles.bannerFallbackNdr}`} />
      ) : (
        <img
          src={BANNERS[activeTab]}
          alt={TAB_LABELS[activeTab]}
          className={styles.banner}
          onError={() => setImgFailed((prev) => ({ ...prev, [activeTab]: true }))}
        />
      )}
      <div className={styles.bannerOverlay}>
        <h2 className={styles.bannerHeadline}>{content.headline}</h2>
        <p className={styles.bannerDescription}>{content.description}</p>
      </div>
      <button
        className={`${styles.bannerNav} ${styles.bannerNavLeft}`}
        onClick={() => {
          const idx = TAB_ORDER.indexOf(activeTab);
          setActiveTab(TAB_ORDER[(idx - 1 + TAB_ORDER.length) % TAB_ORDER.length]);
        }}
        aria-label="Previous category"
      >
        <CaretLeft size={18} weight="bold" />
      </button>
      <button
        className={`${styles.bannerNav} ${styles.bannerNavRight}`}
        onClick={() => {
          const idx = TAB_ORDER.indexOf(activeTab);
          setActiveTab(TAB_ORDER[(idx + 1) % TAB_ORDER.length]);
        }}
        aria-label="Next category"
      >
        <CaretRight size={18} weight="bold" />
      </button>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════
   Category Tabs (MDR / NDR)
   ═══════════════════════════════════════════════════════════ */
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

/* ═══════════════════════════════════════════════════════════
   "Which MDR Service Is Right for You?" Comparison Table
   ═══════════════════════════════════════════════════════════ */
function Check() {
  return <CheckCircle size={18} weight="fill" className={styles.checkIcon} />;
}
function NoCheck() {
  return <XCircle size={16} weight="regular" className={styles.noCheckIcon} />;
}

function MdrComparisonTable() {
  return (
    <section className={styles.comparisonSection}>
      <h2 className={styles.comparisonHeadline}>Which MDR Service Is Right for You?</h2>
      <p className={styles.comparisonDesc}>
        Not every environment is the same. Some customers already use Microsoft Defender. Others
        want full-stack WatchGuard protection. WatchGuard MDR lets you match the right level of
        protection to each customer.
      </p>
      <div className={styles.tableWrap}>
        <table className={styles.comparisonTable}>
          <thead>
            <tr>
              <th>Feature</th>
              <th>Core MDR</th>
              <th>Core MDR for Microsoft</th>
              <th>Total MDR</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td><strong>Ideal for:</strong></td>
              <td>Using WatchGuard Endpoint</td>
              <td>Using Microsoft Defender</td>
              <td>Using WatchGuard Endpoint, NDR, Identity, Firewall</td>
            </tr>
            <tr>
              <td><strong>24/7 SOC Monitoring</strong></td>
              <td><Check /></td>
              <td><Check /></td>
              <td><Check /></td>
            </tr>
            <tr>
              <td><strong>AI/ML-based Threat Detection</strong></td>
              <td><Check /></td>
              <td><Check /></td>
              <td><Check /></td>
            </tr>
            <tr>
              <td><strong>Incident Response (Human/Auto)</strong></td>
              <td><Check /></td>
              <td><Check /></td>
              <td><Check /></td>
            </tr>
            <tr>
              <td><strong>Advanced Incident Response</strong></td>
              <td><Check /></td>
              <td><Check /></td>
              <td><Check /></td>
            </tr>
            <tr>
              <td><strong>Threat Hunters</strong></td>
              <td><Check /></td>
              <td><Check /></td>
              <td><Check /></td>
            </tr>
            <tr>
              <td><strong>Defense Portal</strong></td>
              <td><Check /></td>
              <td><Check /></td>
              <td><Check /></td>
            </tr>
            <tr>
              <td><strong>Partner Access to TAM</strong></td>
              <td><Check /></td>
              <td><Check /></td>
              <td><Check /></td>
            </tr>
            <tr>
              <td><strong>Endpoint Integration</strong></td>
              <td>WatchGuard Endpoint</td>
              <td>Microsoft Defender</td>
              <td>WatchGuard Endpoint</td>
            </tr>
            <tr>
              <td><strong>Network Integration</strong></td>
              <td><NoCheck /></td>
              <td><NoCheck /></td>
              <td>WatchGuard Firebox, ThreatSync NDR</td>
            </tr>
            <tr>
              <td><strong>Identity Integration</strong></td>
              <td><NoCheck /></td>
              <td><NoCheck /></td>
              <td>WatchGuard AuthPoint</td>
            </tr>
            <tr>
              <td><strong>Microsoft 365</strong></td>
              <td><Check /></td>
              <td><Check /></td>
              <td><Check /></td>
            </tr>
            <tr>
              <td><strong>AWS CloudTrail Coverage</strong></td>
              <td><NoCheck /></td>
              <td><NoCheck /></td>
              <td><Check /></td>
            </tr>
            <tr>
              <td><strong>Google Workspace</strong></td>
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

/* ═══════════════════════════════════════════════════════════
   Protect More with WatchGuard MDR (visual section)
   ═══════════════════════════════════════════════════════════ */
const PROTECT_MORE_ROWS = [
  { attack: 'Stolen Credentials', responseLabel: 'Identity:', responseText: 'Blocks account takeover', protects: 'Identities' },
  { attack: 'Exploits and Malware', responseLabel: 'Endpoint:', responseText: 'Stops malware and isolates endpoints', protects: 'Data at Rest' },
  { attack: 'Lateral Movement', responseLabel: 'Network:', responseText: 'Detects & blocks lateral movement', protects: 'Data in Motion' },
  { attack: 'Cloud Access & Exfiltration', responseLabel: 'Cloud Integration:', responseText: 'Revokes access, resets credentials', protects: 'Applications' },
];

function ProtectMoreSection() {
  return (
    <section className={styles.protectMoreSection}>
      <div className={styles.protectMoreHeader}>
        <h2 className={styles.protectMoreTitle}>Protect More with WatchGuard MDR</h2>
      </div>
      <div className={styles.protectMoreGrid}>
        {/* Header row */}
        <div className={styles.protectColHeader}>
          <span>Attacker Moves</span>
          <WarningOctagon size={18} weight="duotone" className={styles.protectColIconPh} />
        </div>
        <div className={styles.protectColHeader}>
          <span>WatchGuard MDR Stops Them</span>
          <ShieldCheckered size={18} weight="duotone" className={styles.protectColIconPh} />
        </div>
        <div className={styles.protectedBoxHeader}>
          <span>What Is Protected</span>
          <MagnifyingGlass size={18} weight="duotone" className={styles.protectColIconPhRight} />
        </div>

        {/* Data rows */}
        {PROTECT_MORE_ROWS.map((row, i) => (
          <React.Fragment key={i}>
            <div className={styles.chevronLeft}>
              {row.attack}
            </div>
            <div className={styles.chevronRight}>
              <strong>{row.responseLabel}</strong>&nbsp;{row.responseText}
            </div>
            <div className={`${styles.protectedRowCell} ${i % 2 === 1 ? styles.protectedRowAlt : ''}`}>
              {row.protects}
            </div>
          </React.Fragment>
        ))}
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════════════════════
   Key Capabilities Section
   ═══════════════════════════════════════════════════════════ */
const KEY_CAPABILITIES = [
  { icon: Eye, title: 'Single View Across Your Security Stack', desc: 'Get a unified view of threat activity across endpoint, identity, network, and cloud activity from one place, saving time and reducing complexity.' },
  { icon: Clock, title: '24/7 Monitoring and Response', desc: 'Our global SOC is always on. Real people and powerful automation work together to detect and stop threats, with security operations across four locations for built-in redundancy.' },
  { icon: Brain, title: 'Smarter Detection with AI/ML', desc: 'AI and machine learning scan thousands of signals in real time, spotting patterns humans might miss and learning how to stop new threats faster.' },
  { icon: Target, title: 'Proactive Threat Hunting', desc: 'Our analysts look for hidden threats that automated tools can miss, so you\'re protected even when attackers try to get clever.' },
  { icon: Lightning, title: 'Fast-Acting Automation', desc: 'We automate the manual review and action, filtering noise, escalating only what matters, and acting quickly to contain threats before they spread.' },
  { icon: Pulse, title: 'Real-Time Visibility', desc: 'The MDR portal gives a live view across your environment into alerts, actions taken, and metrics that show how you\'re protected, all in one place.' },
];

function KeyCapabilitiesSection() {
  return (
    <section className={styles.capabilitiesSection}>
      <h2 className={styles.sectionHeadline}>Key Capabilities</h2>
      <div className={styles.capabilitiesGrid}>
        {KEY_CAPABILITIES.map((cap, i) => (
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

/* ═══════════════════════════════════════════════════════════
   Why WatchGuard? Competitive Advantage
   ═══════════════════════════════════════════════════════════ */
const ADVANTAGES = [
  { icon: ShieldStar, title: 'Proven Security Leader', desc: 'Over 25 years in cybersecurity, helping secure over 10 million endpoints across 250,000 organisations worldwide.' },
  { icon: Pulse, title: 'Truly Integrated Security', desc: 'Unlike MDR providers that only monitor endpoint or bolt on cloud support, we bring together endpoint, identity, firewall, and network detection.' },
  { icon: Handshake, title: 'Partner-First Design', desc: 'Built for MSPs and smaller organisations without retrofitting enterprise tools. You stay in control of customer relationships.' },
  { icon: ChartLineUp, title: 'Less Alert Fatigue, More Action', desc: 'Fewer than one false positive per month compared to the 15+/day some vendors generate. Fewer distractions, faster response.' },
  { icon: Lightning, title: 'Faster Time to Protection', desc: 'Quick-start onboarding, pre-built integrations, and strong partner support get you up and running fast.' },
  { icon: Headset, title: 'Proven Tech, Trusted Team', desc: 'Our SOC combines deep security expertise with powerful AI to detect and stop threats fast.' },
];

function WhyWatchGuardSection() {
  return (
    <section className={styles.advantagesSection}>
      <h2 className={styles.sectionHeadline}>Why WatchGuard? Competitive Advantage</h2>
      <div className={styles.advantagesLayout}>
        {/* Left column: Testimonial */}
        <div className={styles.testimonialColumn}>
          <blockquote className={styles.testimonialQuote}>
            &ldquo;We need solutions that are easy to deploy and maintain. We can't afford heavy,
            complicated tools. It frees up time so we can focus on strategic support. We no longer
            have to juggle multiple consoles, which would be unmanageable with a small team.&rdquo;
          </blockquote>
          <cite className={styles.testimonialCite}>— Julien Perret, Eiffie</cite>
        </div>
        {/* Right columns: 6 advantage cards in 2-col grid */}
        <div className={styles.advantagesGrid}>
          {ADVANTAGES.map((adv, i) => (
            <div key={i} className={styles.advantageCard}>
              <adv.icon size={24} weight="duotone" className={styles.advantageIcon} />
              <div>
                <h4 className={styles.advantageTitle}>{adv.title}</h4>
                <p className={styles.advantageDesc}>{adv.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════════════════════
   Secure the Full Attack Surface
   ═══════════════════════════════════════════════════════════ */
const SURFACE_ITEMS = [
  { title: 'Endpoint Protection', desc: 'Integrates with WatchGuard Endpoint or supported third-party products to detect behaviours like credential theft and privilege escalation, then isolates compromised devices.', icon: Bug },
  { title: 'Identity Protection', desc: 'Integrates with WatchGuard AuthPoint or Okta to detect and respond to suspicious activity, such as login anomalies or rogue account creation.', icon: ShieldCheckered },
  { title: 'Network Protection', desc: 'Attacks that bypass endpoints, such as lateral movement or C2 traffic, are identified through the Firebox and ThreatSync NDR. Responds by blocking malicious IPs or closing ports.', icon: Shuffle },
  { title: 'Cloud Protection', desc: 'Monitors Microsoft 365 and other cloud platforms for signs of compromise (suspicious sign-ins, permission changes). Responds through API integrations to revoke access or reset credentials.', icon: CloudArrowUp },
];

function AttackSurfaceSection() {
  return (
    <section className={styles.surfaceSection}>
      <h2 className={styles.sectionHeadline}>Secure the Full Attack Surface</h2>
      <div className={styles.surfaceGrid}>
        {SURFACE_ITEMS.map((item, i) => (
          <div key={i} className={styles.surfaceCard}>
            <div className={styles.surfaceImageWrap}>
              <item.icon size={48} weight="duotone" className={styles.surfaceIcon} />
            </div>
            <h4 className={styles.surfaceTitle}>{item.title}</h4>
            <p className={styles.surfaceDesc}>{item.desc}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════════════════════
   Performance Metrics
   ═══════════════════════════════════════════════════════════ */
function MetricsBar() {
  return (
    <div className={styles.metricsBar}>
      <div className={styles.metric}>
        <span className={styles.metricValue}>&lt;6 min</span>
        <span className={styles.metricLabel}>Mean time to respond</span>
      </div>
      <div className={styles.metric}>
        <span className={styles.metricValue}>&lt;1</span>
        <span className={styles.metricLabel}>False positive per month</span>
      </div>
      <div className={styles.metric}>
        <span className={styles.metricValue}>AI-driven</span>
        <span className={styles.metricLabel}>Threat hunting + automation</span>
      </div>
      <div className={styles.metric}>
        <span className={styles.metricValue}>24/7</span>
        <span className={styles.metricLabel}>Global SOC coverage</span>
      </div>
    </div>
  );
}

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
              <td>Office 365 &amp; SaaS monitoring</td>
              <td>Full network &amp; cloud visibility</td>
              <td>Network visibility + compliance</td>
            </tr>
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

/* ═══════════════════════════════════════════════════════════
   Main MdrNdrCatalog Component
   ═══════════════════════════════════════════════════════════ */
export default function MdrNdrCatalog() {
  const [activeTab, setActiveTab] = useState('mdr');
  const data = useMdrNdrData();
  const { products } = data;
  const { addItem } = useQuote();
  const handleAdd = (item) => addItem(item);

  const mdrProducts = products.filter((p) => p.group === 'mdr');
  const ndrProducts = products.filter((p) => p.group === 'ndr');
  const activeProducts = activeTab === 'mdr' ? mdrProducts : ndrProducts;

  return (
    <div className={styles.catalog}>
      {/* ─── Banner ─── */}
      <MdrNdrBanner activeTab={activeTab} setActiveTab={setActiveTab} />

      {/* ─── Category Tabs ─── */}
      <CategoryTabs
        activeTab={activeTab}
        setActiveTab={setActiveTab}
      />

      {/* ─── Product Cards (3-column) ─── */}
      <div className={styles.productGrid}>
        {activeProducts.map((product) => (
          <ProductCard key={product.key} product={product} data={data} onAdd={handleAdd} />
        ))}
      </div>

      {/* ─── Tab-specific content ─── */}
      {activeTab === 'mdr' && (
        <>
          <MdrComparisonTable />
          <ProtectMoreSection />
          <MetricsBar />
          <KeyCapabilitiesSection />
          <WhyWatchGuardSection />
          <AttackSurfaceSection />
        </>
      )}

      {activeTab === 'ndr' && (
        <>
          <NdrComparisonTable />
          <NdrMetricsBar />
          <NdrCapabilities />
        </>
      )}
    </div>
  );
}
