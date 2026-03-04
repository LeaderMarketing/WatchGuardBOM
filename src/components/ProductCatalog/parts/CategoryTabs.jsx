import React from 'react';
import styles from '../ProductCatalog.module.css';
import { TAB_ORDER, TAB_LABELS } from './CategoryBanner.jsx';

export default function CategoryTabs({ activeTab, setActiveTab }) {
  return (
    <div className={styles.tabBar}>
      {TAB_ORDER.map((key) => (
        <button
          key={key}
          className={`${styles.tabBtn} ${activeTab === key ? styles.tabActive : ''}`}
          onClick={() => setActiveTab(key)}
        >
          {TAB_LABELS[key]}
        </button>
      ))}
    </div>
  );
}
