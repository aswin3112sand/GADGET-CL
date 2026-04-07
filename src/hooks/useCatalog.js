import { useEffect, useMemo, useState } from 'react';
import api, { apiErrorMessage } from '../lib/api';
import { enrichSections, slugifySectionName } from '../utils/catalog';

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
        const [sectionsResponse, productsResponse] = await Promise.all([
          api.get('/sections'),
          api.get('/products'),
        ]);

        if (!active) {
          return;
        }

        const nextProducts = productsResponse.data;
        setProducts(nextProducts);
        setSections(enrichSections(sectionsResponse.data, nextProducts));
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
