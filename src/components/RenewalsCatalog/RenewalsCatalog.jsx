import React, { useState } from 'react';
import { ShoppingCartSimple } from '@phosphor-icons/react';
import styles from './RenewalsCatalog.module.css';
import { useRenewalsData, TABS, SECTIONS, getModelPrefix } from './useRenewalsData.js';
import { useQuote } from '../../context/QuoteContext.jsx';
import { formatPrice } from '../../data/productPrices.js';
import BannerCarousel from '../ApplianceRenewals/BannerCarousel.jsx';

/* ─── SKU link ─── */
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
   RenewalCard — config-left / image-right layout
   ═══════════════════════════════════════════════════════════ */
function RenewalCard({
  id,
  title,
  description,
  sectionId,
  models,
  data,
  onAdd,
  suiteLabel = 'Security Suite',
  termLabel = 'Select Term',
}) {
  const {
    getCardState,
    updateCardState,
    getAvailableTerms,
    getSkuForSelection,
    getPriceForSelection,
    getUrlForSelection,
    getAvailableOptions,
    modelPrefix,
  } = data;

  const state = getCardState(id);
  const selectedModel = state.model && models.includes(state.model) ? state.model : models[0];
  const availableOptions = getAvailableOptions(selectedModel, sectionId);
  const activeServiceType = state.serviceType && availableOptions.some((o) => o.key === state.serviceType)
    ? state.serviceType
    : availableOptions[0]?.key || '';
  const availableTerms = getAvailableTerms(selectedModel, activeServiceType);
  const activeTerm = state.term && availableTerms.includes(state.term) ? state.term : availableTerms[0] || '';
  const sku = getSkuForSelection(selectedModel, activeServiceType, activeTerm);
  const price = getPriceForSelection(selectedModel, activeServiceType, activeTerm);
  const url = getUrlForSelection(selectedModel, activeServiceType, activeTerm);
  const imageUrl = sku ? `https://www.leadersystems.com.au/Images/${sku}.jpg` : null;

  return (
    <section className={styles.renewalSection}>
      <div className={styles.renewalHeader}>
        <h2 className={styles.renewalTitle}>{title}</h2>
        <p className={styles.renewalDesc}>{description}</p>
      </div>
      <div className={styles.renewalBody}>
        <div className={styles.renewalConfigSide}>
          <div className={styles.fieldGroup}>
            <label className={styles.fieldLabel}>Select {modelPrefix || ''} Model</label>
            <select
              className={styles.renewalSelect}
              value={selectedModel}
              onChange={(e) => updateCardState(id, 'model', e.target.value)}
            >
              {models.map((m) => (
                <option key={m} value={m}>{modelPrefix ? `${modelPrefix} ${m}` : m}</option>
              ))}
            </select>
          </div>
          {availableOptions.length > 1 && (
            <div className={styles.fieldGroup}>
              <label className={styles.fieldLabel}>{suiteLabel}</label>
              <select
                className={styles.renewalSelect}
                value={activeServiceType}
                onChange={(e) => updateCardState(id, 'serviceType', e.target.value)}
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
                onChange={(e) => updateCardState(id, 'term', e.target.value)}
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
                name: modelPrefix ? `${modelPrefix} ${selectedModel}` : selectedModel,
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
              alt={`${activeServiceType} — ${modelPrefix ? `${modelPrefix} ${selectedModel}` : selectedModel}`}
              className={styles.renewalImage}
            />
          )}
        </div>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════════════════════
   IndividualSubCard — one card per service
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
  const { getAvailableTerms, getSkuForSelection, getPriceForSelection, getUrlForSelection, modelPrefix } = data;

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

  // Reset selected model when available models change (tab switch)
  React.useEffect(() => {
    if (availableModels.length > 0 && !availableModels.includes(selectedModel)) {
      setSelectedModel(availableModels[0]);
      const newTerms = getAvailableTerms(availableModels[0], sub.key);
      setSelectedTerm(newTerms[0] || '1 Year');
    }
  }, [availableModels, selectedModel, getAvailableTerms, sub.key]);

  const sku = getSkuForSelection(selectedModel, sub.key, selectedTerm);
  const price = getPriceForSelection(selectedModel, sub.key, selectedTerm);
  const skuUrl = getUrlForSelection(selectedModel, sub.key, selectedTerm);
  const imageUrl = sku ? `https://www.leadersystems.com.au/Images/${sku}.jpg` : null;

  if (availableModels.length === 0) return null;

  return (
    <div className={styles.indCard}>
      {imageUrl && (
        <div className={styles.indCardImageWrap}>
          <img src={imageUrl} alt={sub.label} className={styles.indCardImage} />
        </div>
      )}
      <div className={styles.indCardBody}>
        <h3 className={styles.indCardName}>{sub.label}</h3>
        <p className={styles.indCardDesc}>{SUB_DESCRIPTIONS[sub.key] || ''}</p>
        <div className={styles.fieldGroup}>
          <label className={styles.fieldLabel}>{modelPrefix || 'Firebox'} Model</label>
          <select
            className={styles.renewalSelect}
            value={selectedModel}
            onChange={handleModelChange}
          >
            {availableModels.map((m) => (
              <option key={m} value={m}>{modelPrefix ? `${modelPrefix} ${m}` : m}</option>
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
              name: modelPrefix ? `${modelPrefix} ${selectedModel}` : selectedModel,
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
   Main RenewalsCatalog Component
   ═══════════════════════════════════════════════════════════ */
export default function RenewalsCatalog() {
  const data = useRenewalsData();
  const {
    activeTab,
    setActiveTab,
    models,
    modelPrefix,
    getModelsForSection,
  } = data;
  const { addItem } = useQuote();
  const handleAdd = (item) => addItem(item);

  const renewalModels = getModelsForSection('renewal');
  const supportModels = getModelsForSection('support');
  const tradeUpModels = getModelsForSection('tradeUp');
  const cloudModels = getModelsForSection('cloud');

  const tabLabel = TABS.find((t) => t.key === activeTab)?.label || '';

  return (
    <div className={styles.wrapper}>
      {/* ═══ PAGE HEADER ═══ */}
      <div className={styles.pageHeader}>
        <h1 className={styles.pageTitle}>Renewals & Upgrades</h1>
        <p className={styles.pageDesc}>
          Renew security suites, support plans, and individual subscriptions across all WatchGuard product families
        </p>
      </div>

      {/* ═══ SUB-TABS ═══ */}
      <div className={styles.tabBar}>
        {TABS.map((tab) => (
          <button
            key={tab.key}
            className={`${styles.tabBtn} ${activeTab === tab.key ? styles.tabBtnActive : ''}`}
            onClick={() => setActiveTab(tab.key)}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* ═══ RENEWAL CARDS — 2-column grid ═══ */}
      <div className={styles.renewalRow}>
        {renewalModels.length > 0 && (
          <RenewalCard
            id={`${activeTab}-renewal`}
            title={`${tabLabel} Security Suite Renewals`}
            description="Renew Basic or Total Security Suite"
            sectionId="renewal"
            models={renewalModels}
            data={data}
            onAdd={handleAdd}
          />
        )}
        {supportModels.length > 0 && (
          <RenewalCard
            id={`${activeTab}-support`}
            title={`${tabLabel} Support Renewals`}
            description="Renew Standard or Gold Support"
            sectionId="support"
            models={supportModels}
            data={data}
            onAdd={handleAdd}
            suiteLabel="Support Level"
          />
        )}
        {tradeUpModels.length > 0 && (
          <RenewalCard
            id={`${activeTab}-tradeUp`}
            title={`${tabLabel} Trade-Up Options`}
            description="Trade up from Standard Support to a Security Suite"
            sectionId="tradeUp"
            models={tradeUpModels}
            data={data}
            onAdd={handleAdd}
            suiteLabel="Trade-Up Suite"
          />
        )}
        {cloudModels.length > 0 && (
          <RenewalCard
            id={`${activeTab}-cloud`}
            title={`${tabLabel} Cloud Data Retention`}
            description="Extend cloud log and report data retention"
            sectionId="cloud"
            models={cloudModels}
            data={data}
            onAdd={handleAdd}
            termLabel="Data Retention Term"
          />
        )}
      </div>

      {/* ═══ INDIVIDUAL SUBSCRIPTIONS ═══ */}
      <section className={styles.indSection}>
        <div className={styles.indSectionHeader}>
          <h2 className={styles.sectionTitle}>{tabLabel} Individual Subscriptions</h2>
          <p className={styles.sectionDesc}>Add individual security services a la carte</p>
        </div>
        <BannerCarousel
          onScrollTo={(key) => {
            const el = document.getElementById(`renewals-sub-card-${activeTab}-${key}`);
            if (el) el.scrollIntoView({ behavior: 'smooth', block: 'center' });
          }}
        />
        <div className={styles.indGrid}>
          {SECTIONS.individual.map((sub) => (
            <IndividualSubCard
              key={`${activeTab}-${sub.key}`}
              sub={sub}
              allModels={models}
              data={data}
              onAdd={handleAdd}
            />
          ))}
        </div>
      </section>
    </div>
  );
}
