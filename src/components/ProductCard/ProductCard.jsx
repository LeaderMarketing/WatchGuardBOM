import React, { useState, useEffect, useMemo } from 'react';
import { ShoppingCartSimple, CaretDown } from '@phosphor-icons/react';
import styles from './ProductCard.module.css';
import { useQuote } from '../../context/QuoteContext.jsx';

const BASE_URL = import.meta.env.BASE_URL;

export default function ProductCard({ product, onSelectHardware, onSelectSubscription }) {
  const { addItem } = useQuote();
  const [featuresOpen, setFeaturesOpen] = useState(false);
  const [details, setDetails] = useState(null);
  const [subType, setSubType] = useState('');
  const [termYears, setTermYears] = useState(1);

  // Fetch full product details (subscriptions + features) on mount
  useEffect(() => {
    fetch(`/api/products/${product.slug}`)
      .then(r => r.json())
      .then(data => {
        setDetails(data);
        // Set default subscription type
        if (data.subscriptions?.length > 0) {
          const types = [...new Set(data.subscriptions.map(s => s.subscription_type))];
          setSubType(types[0] || '');
        }
      })
      .catch(console.error);
  }, [product.slug]);

  // Compute the available subscription types and terms
  const subscriptionTypes = useMemo(() => {
    if (!details?.subscriptions) return [];
    return [...new Set(details.subscriptions.map(s => s.subscription_type))];
  }, [details]);

  const availableTerms = useMemo(() => {
    if (!details?.subscriptions) return [];
    return [...new Set(
      details.subscriptions
        .filter(s => s.subscription_type === subType)
        .map(s => s.term_years)
        .filter(t => t > 0)
    )].sort((a, b) => a - b);
  }, [details, subType]);

  // Reset term when subscription type changes
  useEffect(() => {
    if (availableTerms.length > 0 && !availableTerms.includes(termYears)) {
      setTermYears(availableTerms[0]);
    }
  }, [availableTerms, termYears]);

  // Current subscription SKU
  const currentSub = useMemo(() => {
    if (!details?.subscriptions) return null;
    return details.subscriptions.find(
      s => s.subscription_type === subType && s.term_years === termYears
    ) || null;
  }, [details, subType, termYears]);

  const imageSrc = product.image_file ? `${BASE_URL}products/${product.image_file}` : null;
  const applianceUrl = product.appliance?.url || '#';
  const applianceMsrp = product.appliance?.msrp || 0;

  const formatPrice = (p) => {
    if (!p || p === 0) return '$0.00';
    return '$' + p.toLocaleString('en-AU', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  };

  const termLabel = (y) => y === 1 ? '1 Year' : `${y} Years`;

  // ── Add hardware to quote cart ──
  const handleAddHardware = () => {
    if (!product.appliance) return;
    addItem({
      sku: product.appliance.sku_code,
      name: product.name,
      description: 'Appliance Only',
      unitPrice: product.appliance.msrp,
      image: imageSrc,
      productUrl: product.appliance.url,
    });
    if (onSelectHardware) onSelectHardware(product);
  };

  // ── Add subscription to quote cart ──
  const handleAddSubscription = () => {
    if (!currentSub) return;
    addItem({
      sku: currentSub.sku_code,
      name: product.name,
      description: `${currentSub.subscription_type} (${termLabel(currentSub.term_years)})`,
      unitPrice: currentSub.msrp,
      image: imageSrc,
      productUrl: currentSub.url,
    });
    if (onSelectSubscription) onSelectSubscription(product, currentSub);
  };

  return (
    <div className={styles.card}>
      {/* ─── Top: Image + Name + Price + Add Cart ─── */}
      <div className={styles.topSection}>
        {imageSrc && (
          <img src={imageSrc} alt={product.name} className={styles.productImage} />
        )}

        <div className={styles.info}>
          <a
            href={applianceUrl}
            target="_blank"
            rel="noopener noreferrer"
            className={styles.productName}
          >
            {product.name}
          </a>
          <div className={styles.productDesc}>{product.description}</div>
        </div>

        <div className={styles.priceBlock}>
          <div className={styles.priceLabel}>MSRP</div>
          <div className={styles.price}>{formatPrice(applianceMsrp)}</div>
        </div>

        <button
          className={`${styles.addBtn} ${styles.addBtnHw}`}
          onClick={handleAddHardware}
          title="Add hardware to quote cart"
        >
          <ShoppingCartSimple size={16} weight="bold" />
          Add to Cart
        </button>
      </div>

      {/* ─── Collapsible Features ─── */}
      <button
        className={styles.featuresToggle}
        onClick={() => setFeaturesOpen(!featuresOpen)}
      >
        <span className={`${styles.chevron} ${featuresOpen ? styles.chevronOpen : ''}`}>
          <CaretDown size={14} weight="bold" />
        </span>
        Specifications &amp; Features
      </button>

      {featuresOpen && details?.features && (
        <div className={styles.featuresPanel}>
          {Object.entries(details.features).map(([category, feats]) => (
            <div key={category} className={styles.featureCategory}>
              <div className={styles.featureCatTitle}>{category}</div>
              {feats.map((f, i) => (
                <div key={i} className={styles.featureRow}>
                  <span className={styles.featureLabel}>{f.name}</span>
                  <span className={styles.featureValue}>{f.value}</span>
                </div>
              ))}
            </div>
          ))}
        </div>
      )}

      {/* ─── Subscription selector ─── */}
      {subscriptionTypes.length > 0 && (
        <div className={styles.subscriptionSection}>
          <div className={styles.subSelectorGroup}>
            <span className={styles.subLabel}>Select Subscription</span>
            <select
              className={styles.subSelect}
              value={subType}
              onChange={e => setSubType(e.target.value)}
            >
              {subscriptionTypes.map(t => (
                <option key={t} value={t}>{t}</option>
              ))}
            </select>
          </div>

          <div className={styles.subSelectorGroup}>
            <span className={styles.subLabel}>Terms</span>
            <select
              className={styles.subSelect}
              value={termYears}
              onChange={e => setTermYears(Number(e.target.value))}
            >
              {availableTerms.map(y => (
                <option key={y} value={y}>{termLabel(y)}</option>
              ))}
            </select>
          </div>

          <div className={styles.subPriceBlock}>
            <div className={styles.priceLabel}>Subscription</div>
            <div className={styles.subPrice}>
              {currentSub ? formatPrice(currentSub.msrp) : '—'}
            </div>
            {currentSub && (
              <a
                href={currentSub.url}
                target="_blank"
                rel="noopener noreferrer"
                className={styles.skuLink}
              >
                {currentSub.sku_code}
              </a>
            )}
          </div>

          <button
            className={`${styles.addBtn} ${styles.addBtnSub}`}
            onClick={handleAddSubscription}
            disabled={!currentSub}
            title="Add subscription to quote cart"
          >
            <ShoppingCartSimple size={16} weight="bold" />
            Add to Cart
          </button>
        </div>
      )}
    </div>
  );
}
