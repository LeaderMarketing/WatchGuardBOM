import { useState, useEffect, useMemo } from 'react';

const BASE = import.meta.env.BASE_URL || '/';

/**
 * Fetch JSON from the API first; if the backend is unreachable (e.g. on
 * GitHub Pages) fall back to the pre-exported static JSON in public/static-data/.
 */
async function fetchWithFallback(apiPath, staticFile) {
  try {
    const res = await fetch(apiPath);
    if (!res.ok) throw new Error(res.status);
    return await res.json();
  } catch {
    // Backend unavailable — use static JSON
    const res = await fetch(`${BASE}static-data/${staticFile}`);
    if (!res.ok) throw new Error(`Static fallback failed: ${res.status}`);
    return res.json();
  }
}

/**
 * useProductData
 * ──────────────
 * Handles all API data fetching for the comparison grid.
 * - Fetches the category tree on mount
 * - When the active tab changes, fetches full details for each product
 * - Returns { categories, products, productDetails, loading, activeTab, setActiveTab }
 */
export default function useProductData() {
  const [categories, setCategories] = useState(null);
  const [activeTab, setActiveTab] = useState('tabletop');
  const [loading, setLoading] = useState(true);
  const [productDetails, setProductDetails] = useState({});

  // Fetch category tree once on mount
  useEffect(() => {
    fetchWithFallback('/api/categories', 'categories.json')
      .then((data) => {
        setCategories(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  // Products for the active tab
  const products = useMemo(
    () => categories?.[activeTab]?.products || [],
    [categories, activeTab],
  );

  // Fetch full details for each product in the active category
  useEffect(() => {
    if (products.length === 0) return;
    products.forEach((p) => {
      if (productDetails[p.slug]) return;
      fetchWithFallback(`/api/products/${p.slug}`, `product-${p.slug}.json`)
        .then((data) => {
          setProductDetails((prev) => ({ ...prev, [p.slug]: data }));
        })
        .catch(console.error);
    });
  }, [products]); // eslint-disable-line react-hooks/exhaustive-deps

  // Reset details cache when tab changes
  useEffect(() => {
    setProductDetails({});
  }, [activeTab]);

  return { categories, products, productDetails, loading, activeTab, setActiveTab };
}
