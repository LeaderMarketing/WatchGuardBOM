import React, { useState, useEffect, useMemo } from 'react';
import { ShoppingCartSimple } from '@phosphor-icons/react';
import styles from './ConfigPanel.module.css';
import { useQuote } from '../../context/QuoteContext.jsx';

const BASE_URL = import.meta.env.BASE_URL;

const formatPrice = (p) => {
  if (!p || p === 0) return '$0.00';
  return '$' + p.toLocaleString('en-AU', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
};

const termLabel = (y) => y === 1 ? '1 Year' : `${y} Years`;

export default function ConfigPanel({ selectedHardware, selectedSubscription: initialSub }) {
  const { addItem } = useQuote();

  // Subscription dropdowns state
  const [details, setDetails] = useState(null);
  const [subType, setSubType] = useState('');
  const [termYears, setTermYears] = useState(1);

  // Fetch product details when hardware is selected
  useEffect(() => {
    if (!selectedHardware) {
      setDetails(null);
      return;
    }
    fetch(`/api/products/${selectedHardware.slug}`)
      .then(r => r.json())
      .then(data => {
        setDetails(data);
        if (data.subscriptions?.length > 0) {
          const types = [...new Set(data.subscriptions.map(s => s.subscription_type))];
          setSubType(types[0] || '');
        }
      })
      .catch(console.error);
  }, [selectedHardware]);

  // Sync if a subscription is pre-selected via the product card
  useEffect(() => {
    if (initialSub) {
      setSubType(initialSub.subscription_type || '');
      setTermYears(initialSub.term_years || 1);
    }
  }, [initialSub]);

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

  useEffect(() => {
    if (availableTerms.length > 0 && !availableTerms.includes(termYears)) {
      setTermYears(availableTerms[0]);
    }
  }, [availableTerms, termYears]);

  const currentSub = useMemo(() => {
    if (!details?.subscriptions) return null;
    return details.subscriptions.find(
      s => s.subscription_type === subType && s.term_years === termYears
    ) || null;
  }, [details, subType, termYears]);

  const imageSrc = selectedHardware?.image_file
    ? `${BASE_URL}products/${selectedHardware.image_file}`
    : null;

  // Don't show until something is selected
  const isVisible = !!selectedHardware;

  const handleAddHardware = () => {
    if (!selectedHardware?.appliance) return;
    addItem({
      sku: selectedHardware.appliance.sku_code,
      name: selectedHardware.name,
      description: 'Appliance Only',
      unitPrice: selectedHardware.appliance.msrp,
      image: imageSrc,
      productUrl: selectedHardware.appliance.url,
    });
  };

  const handleAddSubscription = () => {
    if (!currentSub || !selectedHardware) return;
    addItem({
      sku: currentSub.sku_code,
      name: selectedHardware.name,
      description: `${currentSub.subscription_type} (${termLabel(currentSub.term_years)})`,
      unitPrice: currentSub.msrp,
      image: imageSrc,
      productUrl: currentSub.url,
    });
  };

  return (
    <div className={`${styles.panel} ${!isVisible ? styles.panelHidden : ''}`}>
      {/* ── LEFT: Hardware ── */}
      <div className={styles.side}>
        {imageSrc ? (
          <img src={imageSrc} alt={selectedHardware?.name} className={styles.sideImage} />
        ) : (
          <div className={styles.sideImagePlaceholder} />
        )}

        <div className={styles.sideInfo}>
          <div className={styles.sideName}>{selectedHardware?.name || '—'}</div>
          <div className={styles.sideDesc}>{selectedHardware?.description || ''}</div>
          {selectedHardware?.appliance && (
            <a
              href={selectedHardware.appliance.url}
              target="_blank"
              rel="noopener noreferrer"
              className={styles.sideSku}
            >
              {selectedHardware.appliance.sku_code}
            </a>
          )}
        </div>

        <div className={styles.sideActions}>
          <span className={styles.sidePriceLabel}>MSRP</span>
          <span className={styles.sidePrice}>
            {formatPrice(selectedHardware?.appliance?.msrp)}
          </span>
          <button
            className={`${styles.sideAddBtn} ${styles.hwBtn}`}
            onClick={handleAddHardware}
          >
            <ShoppingCartSimple size={14} weight="bold" />
            Add to Cart
          </button>
        </div>
      </div>

      {/* ── DIVIDER ── */}
      <div className={styles.divider} />

      {/* ── RIGHT: Subscription ── */}
      {subscriptionTypes.length > 0 ? (
        <div className={styles.subSide}>
          {imageSrc ? (
            <img src={imageSrc} alt="Subscription" className={styles.sideImage} />
          ) : (
            <div className={styles.sideImagePlaceholder} />
          )}

          {/* Subscription Type Dropdown */}
          <div className={styles.subDropdownGroup}>
            <span className={styles.subDropdownLabel}>Select Subscription</span>
            <select
              className={styles.subDropdown}
              value={subType}
              onChange={e => setSubType(e.target.value)}
            >
              {subscriptionTypes.map(t => (
                <option key={t} value={t}>{t}</option>
              ))}
            </select>
            {currentSub && (
              <a
                href={currentSub.url}
                target="_blank"
                rel="noopener noreferrer"
                className={styles.sideSku}
              >
                {currentSub.sku_code}
              </a>
            )}
          </div>

          {/* Term Dropdown */}
          <div className={styles.subDropdownGroup}>
            <span className={styles.subDropdownLabel}>Select Terms</span>
            <select
              className={styles.subDropdown}
              value={termYears}
              onChange={e => setTermYears(Number(e.target.value))}
            >
              {availableTerms.map(y => (
                <option key={y} value={y}>{termLabel(y)}</option>
              ))}
            </select>
          </div>

          {/* Price + Add to Cart */}
          <div className={styles.sideActions}>
            <span className={styles.sidePriceLabel}>Subscription Price</span>
            <span className={styles.sidePrice}>
              {currentSub ? formatPrice(currentSub.msrp) : '—'}
            </span>
            <button
              className={`${styles.sideAddBtn} ${styles.subBtn}`}
              onClick={handleAddSubscription}
              disabled={!currentSub}
            >
              <ShoppingCartSimple size={14} weight="bold" />
              Add to Cart
            </button>
          </div>
        </div>
      ) : (
        <div className={styles.emptyState}>
          You have not selected a matching subscription licence.
        </div>
      )}
    </div>
  );
}
