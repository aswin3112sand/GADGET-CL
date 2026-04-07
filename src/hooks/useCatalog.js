import { useEffect, useMemo, useState } from 'react';
import api, { apiErrorMessage } from '../lib/api';
import { enrichSections, slugifySectionName } from '../utils/catalog';

const CATALOG_CACHE_TTL_MS = 30000;

let catalogCache = null;
let catalogRequest = null;

export const invalidateCatalogCache = () => {
  catalogCache = null;
};

const readCatalog = async () => {
  const now = Date.now();
  if (catalogCache && now - catalogCache.timestamp < CATALOG_CACHE_TTL_MS) {
    return catalogCache.data;
  }

  if (catalogRequest) {
    return catalogRequest;
  }

  catalogRequest = Promise.all([
    api.get('/sections'),
    api.get('/products'),
  ])
    .then(([sectionsResponse, productsResponse]) => {
      const nextProducts = productsResponse.data;
      const data = {
        products: nextProducts,
        sections: enrichSections(sectionsResponse.data, nextProducts),
      };

      catalogCache = {
        data,
        timestamp: Date.now(),
      };

      return data;
    })
    .finally(() => {
      catalogRequest = null;
    });

  return catalogRequest;
};

export const useCatalogData = () => {
  const [sections, setSections] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let active = true;

    const load = async () => {
      setLoading(true);
      setError('');

      try {
        const catalog = await readCatalog();

        if (!active) {
          return;
        }

        setProducts(catalog.products);
        setSections(catalog.sections);
      } catch (loadError) {
        if (active) {
          setError(apiErrorMessage(loadError, 'Unable to load catalog data.'));
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    };

    load();
    return () => {
      active = false;
    };
  }, []);

  return { sections, products, loading, error };
};

export const useProductDetails = (productId) => {
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let active = true;

    const load = async () => {
      setLoading(true);
      setError('');
      try {
        const { data } = await api.get(`/products/${productId}`);
        if (active) {
          setProduct(data);
        }
      } catch (loadError) {
        if (active) {
          setError(apiErrorMessage(loadError, 'Unable to load product details.'));
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    };

    if (productId) {
      load();
    }

    return () => {
      active = false;
    };
  }, [productId]);

  return { product, loading, error };
};

export const useSectionBySlug = (sections, slug) => useMemo(
  () => sections.find((section) => slugifySectionName(section.name) === slug) || null,
  [sections, slug],
);
