import React from 'react';
import {
  ShoppingCartSimple,
  CheckCircle,
  XCircle,
} from '@phosphor-icons/react';
import styles from './IdentityCatalog.module.css';
import { useIdentityData, PRODUCTS } from './hooks/useIdentityData.js';
import { useQuote } from '../../context/QuoteContext.jsx';
import { formatPrice } from '../../data/productPrices.js';

/* ═══════════════════════════════════════════════════════════
   Reusable SKU display
   ═══════════════════════════════════════════════════════════ */
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
   Product Card — subscription products
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

  const handleTierChange = (e) => {
    const newTier = e.target.value;
    setSelection(product.key, 'tier', newTier);
    const newTerms = getAvailableTerms(product.key, newTier);
    if (newTerms.length && !newTerms.includes(sel.term)) {
      setSelection(product.key, 'term', newTerms[0]);
    }
  };

  const imageUrl = sku ? `https://www.leadersystems.com.au/Images/${sku}.jpg` : null;

  return (
    <div className={styles.productCard}>
      {imageUrl && (
        <div className={styles.cardImageWrap}>
          <img src={imageUrl} alt={product.label} className={styles.cardImage} />
        </div>
      )}
      <div className={styles.cardBody}>
        <div className={styles.cardHeader}>
          <h3 className={styles.cardName}>{product.label}</h3>
        </div>
        <p className={styles.cardDesc}>{product.description}</p>

        <div className={styles.fieldGroup}>
          <label className={styles.fieldLabel}>License Tier</label>
          <select
            className={styles.selectField}
            value={tier}
            onChange={handleTierChange}
          >
            {product.tiers.map((t) => (
              <option key={t} value={t}>{t} users</option>
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
            <span className={styles.priceNote}>MSRP <span className={styles.perSeat}>per user</span></span>
          </div>
        </div>

        <button
          className={styles.addBtn}
          disabled={!sku}
          onClick={() =>
            onAdd({
              sku,
              name: product.label,
              description: `${tier} users (${term})`,
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
   Banner
   ═══════════════════════════════════════════════════════════ */
function IdentityBanner() {
  return (
    <div className={styles.bannerWrap}>
      <div className={`${styles.bannerFallback} ${styles.bannerFallbackIdentity}`} />
      <div className={styles.bannerOverlay}>
        <h2 className={styles.bannerHeadline}>Identity & Access Security</h2>
        <p className={styles.bannerDescription}>
          Secure every login with WatchGuard AuthPoint — cloud-based multi-factor authentication
          that protects your workforce from credential theft, phishing, and unauthorized access.
          Add dark web monitoring and password management with Total Identity Security.
        </p>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════
   Comparison Table — AuthPoint vs Total Identity Security
   ═══════════════════════════════════════════════════════════ */
function Check() {
  return <CheckCircle size={18} weight="fill" className={styles.checkIcon} />;
}
function NoCheck() {
  return <XCircle size={16} weight="regular" className={styles.noCheckIcon} />;
}

const COMPARISON_ROWS = [
  { feature: 'Multi-Factor Authentication (MFA)', authpoint: true, tis: true },
  { feature: 'Single Sign-On (SSO)', authpoint: true, tis: true },
  { feature: 'Risk-Based Authentication', authpoint: true, tis: true },
  { feature: 'Push-Based Authentication', authpoint: true, tis: true },
  { feature: 'TOTP / QR Code Authentication', authpoint: true, tis: true },
  { feature: 'Hardware Token Support', authpoint: true, tis: true },
  { feature: 'Dark Web Credential Monitoring', authpoint: false, tis: true },
  { feature: 'Corporate Password Manager', authpoint: false, tis: true },
  { feature: 'Shared Vault & Credential Management', authpoint: false, tis: true },
];

function IdentityComparisonTable() {
  return (
    <section className={styles.comparisonSection}>
      <h2 className={styles.comparisonHeadline}>AuthPoint vs Total Identity Security</h2>
      <p className={styles.comparisonDesc}>
        Both solutions provide robust multi-factor authentication. Total Identity Security
        adds dark web monitoring and a corporate password manager for complete credential protection.
      </p>
      <div className={styles.tableWrap}>
        <table className={styles.comparisonTable}>
          <thead>
            <tr>
              <th>Feature</th>
              <th>AuthPoint</th>
              <th>Total Identity Security</th>
            </tr>
          </thead>
          <tbody>
            {COMPARISON_ROWS.map((row) => (
              <tr key={row.feature}>
                <td><strong>{row.feature}</strong></td>
                <td>{row.authpoint ? <Check /> : <NoCheck />}</td>
                <td>{row.tis ? <Check /> : <NoCheck />}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════════════════════
   Section Header
   ═══════════════════════════════════════════════════════════ */
function SectionHeader({ title, subtitle }) {
  return (
    <div className={styles.sectionDivider}>
      <h2 className={styles.sectionTitle}>{title}</h2>
      {subtitle && <p className={styles.sectionSubtitle}>{subtitle}</p>}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════
   Main IdentityCatalog Component
   ═══════════════════════════════════════════════════════════ */
export default function IdentityCatalog() {
  const data = useIdentityData();
  const { addItem } = useQuote();
  const handleAdd = (item) => addItem(item);

  const coreProducts = PRODUCTS.filter((p) => p.section === 'core');

  return (
    <div className={styles.catalog}>
      <IdentityBanner />

      {/* Core MFA Products — 2-column */}
      <SectionHeader
        title="Multi-Factor Authentication"
        subtitle="Choose between standard MFA or the complete identity security bundle with dark web monitoring and password management."
      />
      <div className={styles.coreGrid}>
        {coreProducts.map((product) => (
          <ProductCard key={product.key} product={product} data={data} onAdd={handleAdd} />
        ))}
      </div>

      {/* Comparison Table */}
      <IdentityComparisonTable />
    </div>
  );
}
