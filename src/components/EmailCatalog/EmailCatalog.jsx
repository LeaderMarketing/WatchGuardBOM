import React from 'react';
import {
  ShoppingCartSimple,
  CheckCircle,
} from '@phosphor-icons/react';
import styles from './EmailCatalog.module.css';
import { useEmailData, PRODUCTS } from './hooks/useEmailData.js';
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
   Product Card
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
function EmailBanner() {
  return (
    <div className={styles.bannerWrap}>
      <div className={`${styles.bannerFallback} ${styles.bannerFallbackEmail}`} />
      <div className={styles.bannerOverlay}>
        <h2 className={styles.bannerHeadline}>Email Security</h2>
        <p className={styles.bannerDescription}>
          Protect your inbox from spam, phishing, malware, and data leaks with cloud-based
          email security. Multi-layer filtering for inbound and outbound email with
          quarantine management and content policies.
        </p>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════
   Feature Highlights
   ═══════════════════════════════════════════════════════════ */
const FEATURES = [
  'Multi-layer anti-spam engine',
  'Anti-phishing with URL rewriting',
  'Anti-malware attachment scanning',
  'Content filtering policies',
  'Outbound email protection',
  'Quarantine management',
  'Supports Exchange, Microsoft 365, Google Workspace',
  'Centralised cloud management',
  'Compliance & audit reporting',
];

function FeatureHighlights() {
  return (
    <section className={styles.featuresSection}>
      <h2 className={styles.featuresHeadline}>Key Capabilities</h2>
      <p className={styles.featuresDesc}>
        Panda Email Protection delivers comprehensive cloud-based email security
        for businesses of all sizes.
      </p>
      <div className={styles.featuresGrid}>
        {FEATURES.map((feature) => (
          <div key={feature} className={styles.featureCard}>
            <CheckCircle size={18} weight="fill" className={styles.featureIcon} />
            <span className={styles.featureText}>{feature}</span>
          </div>
        ))}
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
   Main EmailCatalog Component
   ═══════════════════════════════════════════════════════════ */
export default function EmailCatalog() {
  const data = useEmailData();
  const { addItem } = useQuote();
  const handleAdd = (item) => addItem(item);

  return (
    <div className={styles.catalog}>
      <EmailBanner />

      <SectionHeader
        title="Cloud Email Protection"
        subtitle="Cloud-based email gateway filtering for inbound and outbound email across Exchange, Microsoft 365, and Google Workspace."
      />
      <div className={styles.singleCardWrap}>
        {PRODUCTS.map((product) => (
          <ProductCard key={product.key} product={product} data={data} onAdd={handleAdd} />
        ))}
      </div>

      <FeatureHighlights />
    </div>
  );
}
