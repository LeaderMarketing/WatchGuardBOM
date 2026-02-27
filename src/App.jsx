import React, { useState } from 'react';
import { ShoppingCartSimple } from '@phosphor-icons/react';
import styles from './App.module.css';
import ProductCatalog from './components/ProductCatalog/ProductCatalog.jsx';
import ConfigPanel from './components/ConfigPanel/ConfigPanel.jsx';
import QuoteCartPanel from './components/QuoteCartPanel/QuoteCartPanel.jsx';
import { useQuote } from './context/QuoteContext.jsx';

function App() {
  const { state: quoteState } = useQuote();

  // Quote Cart modal
  const [isCartOpen, setIsCartOpen] = useState(false);

  // Selected hardware product (from ProductCard click)
  const [selectedHardware, setSelectedHardware] = useState(null);

  // Optional pre-selected subscription (from ProductCard subscription add)
  const [selectedSubscription, setSelectedSubscription] = useState(null);

  const handleSelectHardware = (product) => {
    setSelectedHardware(product);
    setSelectedSubscription(null); // reset sub when hardware changes
  };

  return (
    <div className={styles.page}>
      <div className={styles.container}>
        <header className={styles.header}>
          <h1>WatchGuard Product Configurator</h1>
        </header>

        <ProductCatalog
          onSelectHardware={handleSelectHardware}
          onSelectSubscription={setSelectedSubscription}
        />
      </div>

      {/* Sticky bottom config panel */}
      <ConfigPanel
        selectedHardware={selectedHardware}
        selectedSubscription={selectedSubscription}
      />

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
