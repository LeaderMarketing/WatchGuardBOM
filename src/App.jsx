import React, { useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import { ShoppingCartSimple } from '@phosphor-icons/react';
import styles from './App.module.css';
import TopLevelNav from './components/TopLevelNav/TopLevelNav.jsx';
import ProductCatalog from './components/ProductCatalog/ProductCatalog.jsx';
import VirtualCatalog from './components/VirtualCatalog/VirtualCatalog.jsx';
import CloudCatalog from './components/CloudCatalog/CloudCatalog.jsx';
import MdrNdrCatalog from './components/MdrNdrCatalog/MdrNdrCatalog.jsx';
import QuoteCartPanel from './components/QuoteCartPanel/QuoteCartPanel.jsx';
import { useQuote } from './context/QuoteContext.jsx';

function ComingSoon({ title }) {
  return (
    <div style={{ padding: 80, textAlign: 'center', color: '#888' }}>
      <h2 style={{ marginBottom: 12, color: '#333' }}>{title}</h2>
      <p>Coming soon.</p>
    </div>
  );
}

function App() {
  const { state: quoteState } = useQuote();

  // Quote Cart modal
  const [isCartOpen, setIsCartOpen] = useState(false);

  return (
    <div className={styles.page}>
      <TopLevelNav />

      <div className={styles.container}>
        <Routes>
          <Route path="/" element={<ProductCatalog />} />
          <Route path="/virtual" element={<VirtualCatalog />} />
          <Route path="/renewals" element={<ComingSoon title="Renewals/Upgrades" />} />
          <Route path="/mdr-ndr" element={<MdrNdrCatalog />} />
          <Route path="/endpoint" element={<ComingSoon title="Endpoint & Mobile" />} />
          <Route path="/cloud" element={<CloudCatalog />} />
          <Route path="/identity" element={<ComingSoon title="Identity & Access" />} />
          <Route path="/email" element={<ComingSoon title="Email Security" />} />
        </Routes>
      </div>

      {/* Quote Cart modal overlay */}
      <QuoteCartPanel isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />

      {/* Floating Cart Button */}
      <button
        type="button"
        className={`${styles.floatingCartBtn} ${quoteState.itemCount > 0 ? styles.hasItems : ''}`}
        onClick={() => setIsCartOpen(true)}
        aria-label="Open quote cart"
      >
        <span className={styles.cartIcon}>
          <ShoppingCartSimple size={20} weight="fill" />
        </span>
        {quoteState.itemCount > 0 && <span className={styles.cartBadge}>{quoteState.itemCount}</span>}
      </button>
    </div>
  );
}

export default App;
