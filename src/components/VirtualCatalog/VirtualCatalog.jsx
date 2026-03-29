import React, { useState, useRef, useEffect } from 'react';
import {
  ShoppingCartSimple,
  ShieldCheck,
  CaretDown,
  ShoppingBagOpen,
  ArrowsClockwise,
  Headset,
  ListChecks,
  TrendUp,
  Cloud,
} from '@phosphor-icons/react';
import styles from './VirtualCatalog.module.css';
import { useFireboxVData } from './hooks/useFireboxVData.js';
import { useQuote } from '../../context/QuoteContext.jsx';
import { formatPrice } from '../../data/productPrices.js';
import SecuritySuiteTable from '../SecuritySuiteTable/SecuritySuiteTable.jsx';
import { SECTION_DEFS, getSpecValue } from '../../data/featureSpecs.shared.js';
import BannerCarousel from './BannerCarousel.jsx';

// Model → product image mapping (local public assets)
const MODEL_IMAGES = {
  'FireboxV Small': '/WatchGuardBOM/fireboxv images/s.jpg',
  'FireboxV Medium': '/WatchGuardBOM/fireboxv images/m.jpg',
  'FireboxV Large': '/WatchGuardBOM/fireboxv images/l.jpg',
  'FireboxV XLarge': '/WatchGuardBOM/fireboxv images/xl.jpg',
};

// Spec slug mapping (model key → featureSpecs key)
const SPEC_SLUGS = {
  'FireboxV Small': 'FireboxV-Small',
  'FireboxV Medium': 'FireboxV-Medium',
  'FireboxV Large': 'FireboxV-Large',
  'FireboxV XLarge': 'FireboxV-XLarge',
};

/* ─── Reusable SKU link ─── */
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

/* ─── Hero quick-nav items ─── */
const SECTION_NAV = [
  { id: 'purchase', label: 'New Purchase', Icon: ShoppingBagOpen },
  { id: 'renewals', label: 'Suite Renewals', Icon: ArrowsClockwise },
  { id: 'support', label: 'Support Renewals', Icon: Headset },
  { id: 'cloud', label: 'Cloud Retention', Icon: Cloud },
  { id: 'tradeup', label: 'Trade-Up', Icon: TrendUp },
  { id: 'individual', label: 'Individual Subs', Icon: ListChecks },
];

/* ─── Drag-scroll for horizontal scroll container ─── */
function useDragScroll(ref) {
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    let isDown = false, startX = 0, scrollLeft = 0;
    const down = (e) => {
      if (e.target.closest('button, select, a, input')) return;
      isDown = true;
      startX = e.pageX - el.offsetLeft;
      scrollLeft = el.scrollLeft;
      el.style.cursor = 'grabbing';
    };
    const end = () => { isDown = false; el.style.cursor = 'grab'; };
    const move = (e) => {
      if (!isDown) return;
      e.preventDefault();
      el.scrollLeft = scrollLeft - (e.pageX - el.offsetLeft - startX) * 1.5;
    };
    el.addEventListener('mousedown', down);
    el.addEventListener('mouseleave', end);
    el.addEventListener('mouseup', end);
    el.addEventListener('mousemove', move);
    return () => {
      el.removeEventListener('mousedown', down);
      el.removeEventListener('mouseleave', end);
      el.removeEventListener('mouseup', end);
      el.removeEventListener('mousemove', move);
    };
  }, [ref]);
}

/* ═══════════════════════════════════════════════════════════
   Card-based accordion section (cloud, trade-up, individual)
   ═══════════════════════════════════════════════════════════ */
function ServiceSection({ id, title, description, sectionId, options, data, onAdd, defaultOpen = false }) {
  const [expanded, setExpanded] = useState(defaultOpen);
  const { MODELS, selections, setSelection, getAvailableTerms, getSkuForSelection, getUrlForSelection, getPriceForSelection } = data;

  return (
    <section id={id} className={styles.serviceSection}>
      <button
        className={styles.sectionToggle}
        aria-expanded={expanded}
        onClick={() => setExpanded((v) => !v)}
      >
        <div className={styles.sectionToggleText}>
          <span className={styles.sectionToggleTitle}>{title}</span>
          {description && <span className={styles.sectionToggleDesc}>{description}</span>}
        </div>
        <span className={`${styles.chevron} ${expanded ? styles.chevronOpen : ''}`}>
          <CaretDown size={16} weight="bold" />
        </span>
      </button>

      {expanded && (
        <div className={styles.cardGrid}>
          {MODELS.map((model) => {
            const sel = selections[model.key]?.[sectionId] || {};
            const serviceType = sel.serviceType || options[0]?.key;
            const availableTerms = getAvailableTerms(model.key, serviceType);
            const term = sel.term || availableTerms[0];
            const sku = getSkuForSelection(model.key, serviceType, term);
            const url = getUrlForSelection(model.key, serviceType, term);
            const price = getPriceForSelection(model.key, serviceType, term);

            return (
              <div key={`${sectionId}-${model.key}`} className={styles.serviceCard}>
                <div className={styles.cardHeader}>
                  <span className={styles.cardModelLabel}>FireboxV {model.label}</span>
                  <span className={styles.cardModelDesc}>{model.description}</span>
                </div>
                <div className={styles.cardBody}>
                  <div className={styles.cardSelects}>
                    <select
                      className={styles.cardSelect}
                      value={serviceType}
                      onChange={(e) => setSelection(model.key, sectionId, 'serviceType', e.target.value)}
                    >
                      {options.map((opt) => (
                        <option key={opt.key} value={opt.key}>{opt.label}</option>
                      ))}
                    </select>
                    {availableTerms.length > 0 && (
                      <select
                        className={styles.cardSelect}
                        value={term}
                        onChange={(e) => setSelection(model.key, sectionId, 'term', e.target.value)}
                      >
                        {availableTerms.map((t) => (
                          <option key={t} value={t}>{t}</option>
                        ))}
                      </select>
                    )}
                  </div>
                  <div className={styles.subPrice}>
                    {formatPrice(price)}
                    <span className={styles.priceNote}>MSRP</span>
                  </div>
                  <button
                    className={styles.addSubBtn}
                    disabled={!sku}
                    onClick={() =>
                      onAdd({
                        sku,
                        name: `FireboxV ${model.label}`,
                        description: `${serviceType} (${term})`,
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
          })}
        </div>
      )}
    </section>
  );
}

/* ═══════════════════════════════════════════════════════════
   Renewal Configurator — image-left / config-right (50/50 column)
   Used for Suite Renewals and Support Renewals (no accordion)
   ═══════════════════════════════════════════════════════════ */
function RenewalConfigurator({ id, title, description, sectionId, options, data, onAdd, suiteLabel = 'Security Suite', termLabel = 'Select Term' }) {
  const { MODELS, selections, setSelection, getAvailableTerms, getSkuForSelection, getUrlForSelection, getPriceForSelection } = data;
  const sel = selections[MODELS[0]?.key]?.[sectionId] || {};
  const [selectedModel, setSelectedModel] = useState(MODELS[0]?.key);

  const serviceType = sel.serviceType || options[0]?.key;
  const modelSel = selections[selectedModel]?.[sectionId] || {};
  const activeServiceType = modelSel.serviceType || options[0]?.key;
  const availableTerms = getAvailableTerms(selectedModel, activeServiceType);
  const activeTerm = modelSel.term || availableTerms[0];
  const sku = getSkuForSelection(selectedModel, activeServiceType, activeTerm);
  const url = getUrlForSelection(selectedModel, activeServiceType, activeTerm);
  const price = getPriceForSelection(selectedModel, activeServiceType, activeTerm);
  const imageUrl = sku ? `https://www.leadersystems.com.au/Images/${sku}.jpg` : MODEL_IMAGES[selectedModel];

  return (
    <section id={id} className={styles.renewalSection}>
      <div className={styles.renewalHeader}>
        <h2 className={styles.renewalTitle}>{title}</h2>
        <p className={styles.renewalDesc}>{description}</p>
      </div>
      <div className={styles.renewalBody}>
        <div className={styles.renewalConfigSide}>
          <div className={styles.fieldGroup}>
            <label className={styles.fieldLabel}>Select FireboxV Model</label>
            <select
              className={styles.renewalSelect}
              value={selectedModel}
              onChange={(e) => setSelectedModel(e.target.value)}
            >
              {MODELS.map((m) => (
                <option key={m.key} value={m.key}>FireboxV {m.label}</option>
              ))}
            </select>
          </div>
          <div className={styles.fieldGroup}>
            <label className={styles.fieldLabel}>{suiteLabel}</label>
            <select
              className={styles.renewalSelect}
              value={activeServiceType}
              onChange={(e) => setSelection(selectedModel, sectionId, 'serviceType', e.target.value)}
            >
              {options.map((opt) => (
                <option key={opt.key} value={opt.key}>{opt.label}</option>
              ))}
            </select>
          </div>
          {availableTerms.length > 0 && (
            <div className={styles.fieldGroup}>
              <label className={styles.fieldLabel}>{termLabel}</label>
              <select
                className={styles.renewalSelect}
                value={activeTerm}
                onChange={(e) => setSelection(selectedModel, sectionId, 'term', e.target.value)}
              >
                {availableTerms.map((t) => (
                  <option key={t} value={t}>{t}</option>
                ))}
              </select>
            </div>
          )}
          <div className={styles.renewalPriceRow}>
            <span className={styles.renewalPrice}>{formatPrice(price)}</span>
            <span className={styles.priceNote}>MSRP</span>
          </div>
          <button
            className={styles.addSubBtn}
            disabled={!sku}
            onClick={() =>
              onAdd({
                sku,
                name: `FireboxV ${MODELS.find((m) => m.key === selectedModel)?.label}`,
                description: `${activeServiceType} (${activeTerm})`,
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
        <div className={styles.renewalImageSide}>
          <img
            src={imageUrl}
            alt={`${activeServiceType} — FireboxV ${MODELS.find((m) => m.key === selectedModel)?.label}`}
            className={styles.renewalImage}
          />
        </div>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════════════════════
   Individual subscriptions — 4×2 card grid per subscription
   ═══════════════════════════════════════════════════════════ */
const SUB_DESCRIPTIONS = {
  'WebBlocker': 'URL/content filtering to block access to malicious and inappropriate websites',
  'spamBlocker': 'Real-time spam detection and filtering for inbound email traffic',
  'Gateway AntiVirus': 'Signature-based antivirus scanning at the gateway to catch known threats',
  'Intrusion Prevention Service': 'Network-based IPS to detect and block exploit attempts in real time',
  'Reputation Enabled Defense': 'Cloud-based reputation lookup to block traffic from known bad sources',
  'Application Control': 'Granular control over 1,800+ applications to enforce usage policies',
  'APT Blocker': 'Full-system sandbox analysis to identify advanced zero-day malware',
  'Network Discovery': 'Visibility into all devices and services on your network topology',
};

function IndividualSubCard({ sub, data, onAdd }) {
  const { MODELS, getAvailableTerms, getSkuForSelection, getUrlForSelection, getPriceForSelection } = data;
  const [selectedModel, setSelectedModel] = useState(MODELS[0]?.key);

  const terms = getAvailableTerms(selectedModel, sub.key);
  const [selectedTerm, setSelectedTerm] = useState(terms[0] || '1 Year');

  // Reset term when model changes
  const handleModelChange = (e) => {
    const model = e.target.value;
    setSelectedModel(model);
    const newTerms = getAvailableTerms(model, sub.key);
    setSelectedTerm(newTerms[0] || '1 Year');
  };

  const sku = getSkuForSelection(selectedModel, sub.key, selectedTerm);
  const url = getUrlForSelection(selectedModel, sub.key, selectedTerm);
  const price = getPriceForSelection(selectedModel, sub.key, selectedTerm);
  const imageUrl = sku
    ? `https://www.leadersystems.com.au/Images/${sku}.jpg`
    : null;

  return (
    <div id={`sub-card-${sub.key}`} className={styles.indCard}>
      {imageUrl && (
        <div className={styles.indCardImageWrap}>
          <img src={imageUrl} alt={sub.label} className={styles.indCardImage} />
        </div>
      )}
      <div className={styles.indCardBody}>
        <h3 className={styles.indCardName}>{sub.label}</h3>
        <p className={styles.indCardDesc}>{SUB_DESCRIPTIONS[sub.key] || ''}</p>
        <div className={styles.fieldGroup}>
          <label className={styles.fieldLabel}>FireboxV Model</label>
          <select
            className={styles.renewalSelect}
            value={selectedModel}
            onChange={handleModelChange}
          >
            {MODELS.map((m) => (
              <option key={m.key} value={m.key}>FireboxV {m.label}</option>
            ))}
          </select>
        </div>
        {terms.length > 0 && (
          <div className={styles.fieldGroup}>
            <label className={styles.fieldLabel}>Subscription Term</label>
            <select
              className={styles.renewalSelect}
              value={selectedTerm}
              onChange={(e) => setSelectedTerm(e.target.value)}
            >
              {terms.map((t) => (
                <option key={t} value={t}>{t}</option>
              ))}
            </select>
          </div>
        )}
        <div className={styles.renewalPriceRow}>
          <span className={styles.renewalPrice}>{formatPrice(price)}</span>
          <span className={styles.priceNote}>MSRP</span>
        </div>
        <button
          className={`${styles.addSubBtn} ${styles.indCardBtn}`}
          disabled={!sku}
          onClick={() =>
            onAdd({
              sku,
              name: `FireboxV ${MODELS.find((m) => m.key === selectedModel)?.label}`,
              description: `${sub.label} (${selectedTerm})`,
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

function IndividualSubsSection({ id, data, onAdd }) {
  const { SECTIONS } = data;
  const subs = SECTIONS.individual;

  const handleScrollToSub = (key) => {
    const el = document.getElementById(`sub-card-${key}`);
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'center' });
  };

  return (
    <section id={id} className={styles.indSection}>
      <div className={styles.indSectionHeader}>
        <h2 className={styles.renewalTitle}>Individual Subscriptions</h2>
        <p className={styles.renewalDesc}>Add individual security services à la carte</p>
      </div>
      <BannerCarousel onScrollTo={handleScrollToSub} />
      <div className={styles.indGrid}>
        {subs.map((sub) => (
          <IndividualSubCard key={sub.key} sub={sub} data={data} onAdd={onAdd} />
        ))}
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════════════════════
   Main VirtualCatalog Component
   ═══════════════════════════════════════════════════════════ */
export default function VirtualCatalog() {
  const data = useFireboxVData();
  const { MODELS, SECTIONS, selections, setSelection, getAvailableTerms, getSkuForSelection, getUrlForSelection, getPriceForSelection } = data;
  const { addItem } = useQuote();
  const scrollRef = useRef(null);
  const [specsOpen, setSpecsOpen] = useState(true);

  useDragScroll(scrollRef);

  const specSections = SECTION_DEFS.fireboxV || [];
  const gridCols = `200px repeat(${MODELS.length}, 220px)`;

  const handleAdd = (item) => addItem(item);

  return (
    <div className={styles.catalog}>
      {/* ─── Hero Section Navigation ─── */}
      <nav className={styles.sectionNav}>
        {SECTION_NAV.map(({ id, label, Icon }) => (
          <button
            key={id}
            className={styles.navItem}
            onClick={() => document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })}
          >
            <Icon size={18} weight="duotone" />
            <span>{label}</span>
          </button>
        ))}
      </nav>

      <div className={styles.header}>
        <h1>FireboxV Virtual Appliances</h1>
        <p className={styles.intro}>
          WatchGuard FireboxV brings best-in-class network security to virtualised environments.
          Choose a size based on your user count and performance needs.
        </p>
      </div>

      {/* ═══ COMPARISON GRID ═══ */}
      <div className={styles.tableWrapper} ref={scrollRef}>
        <div className={styles.grid} style={{ gridTemplateColumns: gridCols }}>
          {/* ── Product Header Row ── */}
          <div className={styles.headerLabel} />
          {MODELS.map((model) => (
            <div key={model.key} className={styles.productCard}>
              <img
                src={MODEL_IMAGES[model.key]}
                alt={`FireboxV ${model.label}`}
                className={styles.productImage}
              />
              <div className={styles.productName}>FireboxV {model.label}</div>
              <div className={styles.productDesc}>{model.description}</div>
            </div>
          ))}

          {/* ── New Purchase Options (matches Security Appliances licence row) ── */}
          <div className={styles.subLabelCell} id="purchase">
            <div>
              New Purchase Options
              <a
                href="#security-suites"
                className={styles.bundlesLink}
                onClick={(e) => {
                  e.preventDefault();
                  document.getElementById('security-suites')?.scrollIntoView({ behavior: 'smooth' });
                }}
              >
                What are the WatchGuard security service bundles?
              </a>
            </div>
          </div>
          {MODELS.map((model) => {
            const sel = selections[model.key]?.purchase || {};
            const options = SECTIONS.purchase;
            const serviceType = sel.serviceType || options[0]?.key;
            const availableTerms = getAvailableTerms(model.key, serviceType);
            const term = sel.term || availableTerms[0];
            const sku = getSkuForSelection(model.key, serviceType, term);
            const url = getUrlForSelection(model.key, serviceType, term);
            const price = getPriceForSelection(model.key, serviceType, term);

            return (
              <div key={`purchase-${model.key}`} className={styles.subCell}>
                <select
                  className={styles.subSelect}
                  value={serviceType}
                  onChange={(e) => setSelection(model.key, 'purchase', 'serviceType', e.target.value)}
                >
                  {options.map((opt) => (
                    <option key={opt.key} value={opt.key}>{opt.label}</option>
                  ))}
                </select>
                {availableTerms.length > 0 && (
                  <select
                    className={styles.subSelect}
                    value={term}
                    onChange={(e) => setSelection(model.key, 'purchase', 'term', e.target.value)}
                  >
                    {availableTerms.map((t) => (
                      <option key={t} value={t}>{t}</option>
                    ))}
                  </select>
                )}
                <div className={styles.subPrice}>
                  {formatPrice(price)}
                  <span className={styles.priceNote}>MSRP</span>
                </div>
                <button
                  className={styles.addSubBtn}
                  disabled={!sku}
                  onClick={() =>
                    handleAdd({
                      sku,
                      name: `FireboxV ${model.label}`,
                      description: `${serviceType} (${term})`,
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
            );
          })}
        </div>

        {/* ─── Collapsible Specs ─── */}
        <button className={styles.specsToggle} onClick={() => setSpecsOpen(!specsOpen)}>
          Compare Specs
          <span className={`${styles.chevron} ${specsOpen ? styles.chevronOpen : ''}`}>
            <CaretDown size={14} weight="bold" />
          </span>
        </button>

        <div className={`${styles.collapseWrapper} ${specsOpen ? styles.collapseOpen : ''}`}>
          <div className={styles.collapseInner}>
            <div className={styles.specsGrid} style={{ gridTemplateColumns: gridCols }}>
              {specSections.map((section, sIdx) => (
                <React.Fragment key={`sec-${sIdx}`}>
                  <div className={styles.sectionHeader}>{section.title}</div>
                  {MODELS.map((model) => (
                    <div
                      key={`sechdr-${sIdx}-${model.key}`}
                      className={styles.sectionHeaderSpacer}
                    />
                  ))}
                  {section.rows.map((row, rIdx) => (
                    <React.Fragment key={`row-${sIdx}-${rIdx}`}>
                      <div className={styles.featureLabel}>{row.label}</div>
                      {MODELS.map((model) => (
                        <div key={`${row.key}-${model.key}`} className={styles.cell}>
                          {getSpecValue(SPEC_SLUGS[model.key], row.key)}
                        </div>
                      ))}
                    </React.Fragment>
                  ))}
                </React.Fragment>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ═══ RENEWAL CONFIGURATORS (50/50 two-column) ═══ */}
      <div className={styles.renewalRow}>
        <RenewalConfigurator
          id="renewals"
          title="Security Suite Renewals"
          description="Renew Basic Security or Total Security Suite"
          sectionId="renewal"
          options={SECTIONS.renewal}
          data={data}
          onAdd={handleAdd}
        />
        <RenewalConfigurator
          id="support"
          title="Support Renewals"
          description="Renew Standard or Gold Support plans"
          sectionId="support"
          options={SECTIONS.support}
          data={data}
          onAdd={handleAdd}
          suiteLabel="Support Level"
        />
      </div>

      <div className={styles.renewalRow}>
        <RenewalConfigurator
          id="cloud"
          title="Cloud Data Retention"
          description="Extend cloud log and report data retention"
          sectionId="cloud"
          options={SECTIONS.cloud}
          data={data}
          onAdd={handleAdd}
          termLabel="Cloud Data Retention"
        />
        <RenewalConfigurator
          id="tradeup"
          title="Trade-Up Options"
          description="Trade up from Standard Support to a Security Suite"
          sectionId="tradeUp"
          options={SECTIONS.tradeUp}
          data={data}
          onAdd={handleAdd}
          suiteLabel="Trade-up Suite"
        />
      </div>

      {/* ═══ INDIVIDUAL SUBSCRIPTIONS (card grid — 4×2) ═══ */}
      <IndividualSubsSection id="individual" data={data} onAdd={handleAdd} />

      {/* ═══ INFO SECTIONS ═══ */}
      <div className={styles.infoSection} id="security-suites">
        <SecuritySuiteTable />

        <div className={styles.infoBlock}>
          <h3>About WatchGuard FireboxV</h3>
          <p>
            FireboxV delivers enterprise-grade security in a virtualised form factor, making it
            ideal for cloud deployments, virtual data centres, and multi-tenant environments.
            All FireboxV models include the same comprehensive security services available on
            physical Firebox appliances.
          </p>
          <h3>Supported Hypervisors</h3>
          <ul className={styles.hypervisorList}>
            <li>VMware ESXi</li>
            <li>Microsoft Hyper-V</li>
            <li>KVM (Linux)</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
