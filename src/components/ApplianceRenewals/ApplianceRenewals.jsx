import React, { useState } from 'react';
import { ShoppingCartSimple } from '@phosphor-icons/react';
import styles from './ApplianceRenewals.module.css';
import { useApplianceRenewals } from './useApplianceRenewals.js';
import { useQuote } from '../../context/QuoteContext.jsx';
import { formatPrice } from '../../data/productPrices.js';
import BannerCarousel from './BannerCarousel.jsx';

/* ─── SKU link (mirrors VirtualCatalog pattern) ─── */
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
   Renewal Card — one card per series (T or M) per section
   Config-left / Image-right layout
   ═══════════════════════════════════════════════════════════ */
function RenewalCard({
  id,
  title,
  description,
  series,
  sectionId,
  models,
  data,
  onAdd,
  suiteLabel = 'Security Suite',
  termLabel = 'Select Term',
  modelPrefix = 'Firebox',
}) {
  const {
    getCardState,
    updateCardState,
    getAvailableTerms,
    getSkuForSelection,
    getPriceForSelection,
    getUrlForSelection,
    getAvailableOptions,
  } = data;

  const state = getCardState(series, sectionId);
  const selectedModel = state.model;
  const availableOptions = getAvailableOptions(selectedModel, sectionId);
  const activeServiceType = state.serviceType;
  const availableTerms = getAvailableTerms(selectedModel, activeServiceType);
  const activeTerm = state.term || availableTerms[0];
  const sku = getSkuForSelection(selectedModel, activeServiceType, activeTerm);
  const price = getPriceForSelection(selectedModel, activeServiceType, activeTerm);
  const url = getUrlForSelection(selectedModel, activeServiceType, activeTerm);
  const imageUrl = sku ? `https://www.leadersystems.com.au/Images/${sku}.jpg` : null;

  return (
    <section id={id} className={styles.renewalSection}>
      <div className={styles.renewalHeader}>
        <h2 className={styles.renewalTitle}>{title}</h2>
        <p className={styles.renewalDesc}>{description}</p>
      </div>
      <div className={styles.renewalBody}>
        <div className={styles.renewalConfigSide}>
          <div className={styles.fieldGroup}>
            <label className={styles.fieldLabel}>Select {modelPrefix} Model</label>
            <select
              className={styles.renewalSelect}
              value={selectedModel}
              onChange={(e) => updateCardState(series, sectionId, 'model', e.target.value)}
            >
              {models.map((m) => (
                <option key={m} value={m}>{modelPrefix} {m}</option>
              ))}
            </select>
          </div>
          {availableOptions.length > 1 && (
            <div className={styles.fieldGroup}>
              <label className={styles.fieldLabel}>{suiteLabel}</label>
              <select
                className={styles.renewalSelect}
                value={activeServiceType}
                onChange={(e) => updateCardState(series, sectionId, 'serviceType', e.target.value)}
              >
                {availableOptions.map((opt) => (
                  <option key={opt.key} value={opt.key}>{opt.label}</option>
                ))}
              </select>
            </div>
          )}
          {availableTerms.length > 0 && (
            <div className={styles.fieldGroup}>
              <label className={styles.fieldLabel}>{termLabel}</label>
              <select
                className={styles.renewalSelect}
                value={activeTerm}
                onChange={(e) => updateCardState(series, sectionId, 'term', e.target.value)}
              >
                {availableTerms.map((t) => (
                  <option key={t} value={t}>{t}</option>
                ))}
              </select>
            </div>
          )}
          <div className={styles.renewalPriceRow}>
            <span className={styles.renewalPrice}>{formatPrice(price)}</span>
            <span className={styles.priceNote}>MSRP ex.GST</span>
          </div>
          <button
            className={styles.addSubBtn}
            disabled={!sku}
            onClick={() =>
              onAdd({
                sku,
                name: `${modelPrefix} ${selectedModel}`,
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
          {imageUrl && (
            <img
              src={imageUrl}
              alt={`${activeServiceType} — ${modelPrefix} ${selectedModel}`}
              className={styles.renewalImage}
            />
          )}
        </div>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════════════════════
   Individual Subscription Card — one card per service
   (model dropdown includes ALL T + M series models)
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

function IndividualSubCard({ sub, allModels, data, onAdd }) {
  const { getAvailableTerms, getSkuForSelection, getPriceForSelection, getUrlForSelection } = data;

  // Filter to models that actually have this subscription
  const availableModels = allModels.filter(
    (m) => getSkuForSelection(m, sub.key, '1 Year') || getSkuForSelection(m, sub.key, '3 Year') || getSkuForSelection(m, sub.key, '5 Year'),
  );
  const [selectedModel, setSelectedModel] = useState(availableModels[0] || allModels[0]);

  const terms = getAvailableTerms(selectedModel, sub.key);
  const [selectedTerm, setSelectedTerm] = useState(terms[0] || '1 Year');

  const handleModelChange = (e) => {
    const model = e.target.value;
    setSelectedModel(model);
    const newTerms = getAvailableTerms(model, sub.key);
    setSelectedTerm(newTerms[0] || '1 Year');
  };

  const sku = getSkuForSelection(selectedModel, sub.key, selectedTerm);
  const price = getPriceForSelection(selectedModel, sub.key, selectedTerm);
  const skuUrl = getUrlForSelection(selectedModel, sub.key, selectedTerm);
  const imageUrl = sku ? `https://www.leadersystems.com.au/Images/${sku}.jpg` : null;

  if (availableModels.length === 0) return null;

  return (
    <div id={`appliance-sub-card-${sub.key}`} className={styles.indCard}>
      {imageUrl && (
        <div className={styles.indCardImageWrap}>
          <img src={imageUrl} alt={sub.label} className={styles.indCardImage} />
        </div>
      )}
      <div className={styles.indCardBody}>
        <h3 className={styles.indCardName}>{sub.label}</h3>
        <p className={styles.indCardDesc}>{SUB_DESCRIPTIONS[sub.key] || ''}</p>
        <div className={styles.fieldGroup}>
          <label className={styles.fieldLabel}>Firebox Model</label>
          <select
            className={styles.renewalSelect}
            value={selectedModel}
            onChange={handleModelChange}
          >
            {availableModels.map((m) => (
              <option key={m} value={m}>Firebox {m}</option>
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
          <span className={styles.priceNote}>MSRP ex.GST</span>
        </div>
        <button
          className={`${styles.addSubBtn} ${styles.indCardBtn}`}
          disabled={!sku}
          onClick={() =>
            onAdd({
              sku,
              name: `Firebox ${selectedModel}`,
              description: `${sub.label} (${selectedTerm})`,
              unitPrice: price || 0,
            })
          }
          title="Add to quote cart"
        >
          <ShoppingCartSimple size={14} weight="bold" />
          Add to Cart
        </button>
        <SkuLink sku={sku} url={skuUrl} />
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════
   Main ApplianceRenewals Component
   Renders below the Compare Specs table in ProductCatalog
   ═══════════════════════════════════════════════════════════ */
export default function ApplianceRenewals({ activeTab }) {
  const data = useApplianceRenewals();
  const {
    T_SERIES_MODELS,
    M_SERIES_MODELS,
    SECTIONS,
    modelsForSection,
  } = data;
  const { addItem } = useQuote();
  const handleAdd = (item) => addItem(item);

  // Only show for tabletop/mseries tabs (not wifi)
  if (activeTab === 'wifi') return null;

  const showT = activeTab === 'tabletop';
  const showM = activeTab === 'mseries';

  // Models filtered per section — only for the active tab's series
  const tRenewal = showT ? modelsForSection(T_SERIES_MODELS, 'renewal') : [];
  const mRenewal = showM ? modelsForSection(M_SERIES_MODELS, 'renewal') : [];
  const tSupport = showT ? modelsForSection(T_SERIES_MODELS, 'support') : [];
  const mSupport = showM ? modelsForSection(M_SERIES_MODELS, 'support') : [];
  const tTradeUp = showT ? modelsForSection(T_SERIES_MODELS, 'tradeUp') : [];
  const mTradeUp = showM ? modelsForSection(M_SERIES_MODELS, 'tradeUp') : [];
  const tCloud = showT ? modelsForSection(T_SERIES_MODELS, 'cloud') : [];
  const mCloud = showM ? modelsForSection(M_SERIES_MODELS, 'cloud') : [];

  const allModels = showT ? T_SERIES_MODELS : M_SERIES_MODELS;
  const seriesKey = showT ? 't' : 'm';
  const seriesLabel = showT ? 'T-Series' : 'M-Series';
  const seriesDesc = showT ? 'Firebox tabletop' : 'Firebox rackmount';
  const renewalModels = showT ? tRenewal : mRenewal;
  const supportModels = showT ? tSupport : mSupport;
  const tradeUpModels = showT ? tTradeUp : mTradeUp;
  const cloudModels = showT ? tCloud : mCloud;

  return (
    <div className={styles.wrapper}>

      {/* ═══ ALL RENEWAL CARDS — 2-column grid ═══ */}
      <div className={styles.renewalRow}>
        {renewalModels.length > 0 && (
          <RenewalCard
            id={`${seriesKey}-suite-renewals`}
            title={`${seriesLabel} Security Suite Renewals`}
            description={`Renew Basic or Total Security Suite for ${seriesDesc} appliances`}
            series={seriesKey}
            sectionId="renewal"
            models={renewalModels}
            data={data}
            onAdd={handleAdd}
          />
        )}
        {supportModels.length > 0 && (
          <RenewalCard
            id={`${seriesKey}-support-renewals`}
            title={`${seriesLabel} Support Renewals`}
            description={`Renew Standard or Gold Support for ${seriesDesc} appliances`}
            series={seriesKey}
            sectionId="support"
            models={supportModels}
            data={data}
            onAdd={handleAdd}
            suiteLabel="Support Level"
          />
        )}
        {tradeUpModels.length > 0 && (
          <RenewalCard
            id={`${seriesKey}-trade-up`}
            title={`${seriesLabel} Trade-Up Options`}
            description="Trade up from Standard Support to a Security Suite"
            series={seriesKey}
            sectionId="tradeUp"
            models={tradeUpModels}
            data={data}
            onAdd={handleAdd}
            suiteLabel="Trade-Up Suite"
          />
        )}
        {cloudModels.length > 0 && (
          <RenewalCard
            id={`${seriesKey}-cloud`}
            title={`${seriesLabel} Cloud Data Retention`}
            description="Extend cloud log and report data retention"
            series={seriesKey}
            sectionId="cloud"
            models={cloudModels}
            data={data}
            onAdd={handleAdd}
            termLabel="Data Retention Term"
          />
        )}
      </div>

      {/* ═══ 5. INDIVIDUAL SUBSCRIPTIONS — filtered by active tab ═══ */}
      <section className={styles.indSection}>
        <div className={styles.indSectionHeader}>
          <h2 className={styles.sectionTitle}>
            {showT ? 'T-Series' : 'M-Series'} Individual Subscriptions
          </h2>
          <p className={styles.sectionDesc}>
            Add individual security services for {showT ? 'Firebox Tabletop' : 'Firebox M-Series'} appliances
          </p>
        </div>
        <BannerCarousel
          onScrollTo={(key) => {
            const el = document.getElementById(`appliance-sub-card-${key}`);
            if (el) el.scrollIntoView({ behavior: 'smooth', block: 'center' });
          }}
        />
        <div className={styles.indGrid}>
          {SECTIONS.individual.map((sub) => (
            <IndividualSubCard
              key={sub.key}
              sub={sub}
              allModels={allModels}
              data={data}
              onAdd={handleAdd}
            />
          ))}
        </div>
      </section>

    </div>
  );
}
