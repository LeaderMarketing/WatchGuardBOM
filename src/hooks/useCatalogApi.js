import { useState, useEffect } from 'react';

const API_BASE = 'http://localhost:3001/api';
const STATIC_BASE = `${import.meta.env.BASE_URL || '/'}static-data`;

/**
 * Fetch JSON from the Express API first; fall back to pre-exported
 * static JSON in public/static-data/ (GitHub Pages).
 */
async function fetchWithFallback(apiPath, staticPath) {
  try {
    const res = await fetch(`${API_BASE}${apiPath}`);
    if (!res.ok) throw new Error(res.status);
    return await res.json();
  } catch {
    const res = await fetch(staticPath);
    if (!res.ok) throw new Error(`Static fallback failed: ${res.status}`);
    return res.json();
  }
}

/**
 * useCatalogApi(category)
 *
 * Fetches all product groups + their SKUs for a given category.
 * Returns { data, loading, error } where data is:
 *   { label: string, products: [{ slug, name, ..., skus: [...] }] }
 *
 * Works with both the Express API (/api/categories/:category) and
 * the static JSON fallback (category-{name}.json).
 */
export function useCatalogApi(category) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!category) return;

    setLoading(true);
    setError(null);

    fetchWithFallback(
      `/categories/${category}`,
      `${STATIC_BASE}/category-${category}.json`,
    )
      .then(setData)
      .catch(setError)
      .finally(() => setLoading(false));
  }, [category]);

  return { data, loading, error };
}
