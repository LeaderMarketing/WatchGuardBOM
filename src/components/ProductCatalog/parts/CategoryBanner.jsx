import React from 'react';
import { CaretLeft, CaretRight } from '@phosphor-icons/react';
import styles from '../ProductCatalog.module.css';

const BASE_URL = import.meta.env.BASE_URL;

const BANNERS = {
  tabletop: `${BASE_URL}banners/Tabletop_banner.jpg`,
  mseries:  `${BASE_URL}banners/Rackmount_banner.jpg`,
  wifi:     `${BASE_URL}banners/Access-points_banner.jpg`,
};

const TAB_ORDER = ['tabletop', 'mseries', 'wifi'];
const TAB_LABELS = {
  tabletop: 'Firebox Tabletop',
  mseries:  'Firebox M Series',
  wifi:     'Wi-Fi 6 Access Points',
};

export default function CategoryBanner({ activeTab, setActiveTab }) {
  return (
    <div className={styles.bannerWrap}>
      <img
        src={BANNERS[activeTab]}
        alt={TAB_LABELS[activeTab]}
        className={styles.banner}
      />
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

export { TAB_ORDER, TAB_LABELS };
