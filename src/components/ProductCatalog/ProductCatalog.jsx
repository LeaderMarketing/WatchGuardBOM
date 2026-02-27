import React, { useState, useEffect } from 'react';
import styles from './ProductCatalog.module.css';
import ProductCard from '../ProductCard/ProductCard.jsx';

const BASE_URL = import.meta.env.BASE_URL;

const BANNERS = {
  tabletop: `${BASE_URL}banners/Tabletop_banner.jpg`,
  mseries:  `${BASE_URL}banners/Rackmount_banner.jpg`,
  wifi:     `${BASE_URL}banners/Access-points_banner.jpg`,
};

const TAB_ORDER = ['tabletop', 'mseries', 'wifi'];

export default function ProductCatalog({ onSelectHardware, onSelectSubscription }) {
  const [categories, setCategories] = useState(null);
  const [activeTab, setActiveTab] = useState('tabletop');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/categories')
      .then(r => r.json())
      .then(data => {
        setCategories(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  if (loading) return <div style={{ padding: 40, textAlign: 'center', color: '#94a3b8' }}>Loading products...</div>;
  if (!categories) return <div style={{ padding: 40, textAlign: 'center', color: '#ef4444' }}>Failed to load products.</div>;

  const activeCat = categories[activeTab];

  return (
    <div className={styles.catalog}>
      {/* Category Tabs */}
      <div className={styles.categoryTabs}>
        {TAB_ORDER.map(key => (
          <button
            key={key}
            className={`${styles.categoryTab} ${activeTab === key ? styles.active : ''}`}
            onClick={() => setActiveTab(key)}
          >
            {categories[key]?.label || key}
          </button>
        ))}
      </div>

      {/* Banner */}
      <img
        src={BANNERS[activeTab]}
        alt={activeCat?.label}
        className={styles.banner}
      />

      {/* Product Cards */}
      <div className={styles.productList}>
        {activeCat?.products?.map(product => (
          <ProductCard
            key={product.id}
            product={product}
            onSelectHardware={onSelectHardware}
            onSelectSubscription={onSelectSubscription}
          />
        ))}
      </div>
    </div>
  );
}
