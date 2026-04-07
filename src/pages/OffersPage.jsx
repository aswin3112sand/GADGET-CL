import { useMemo } from 'react';
import { motion } from 'framer-motion';
import { BadgePercent, Sparkles } from 'lucide-react';
import ProductGrid from '../components/ProductGrid';
import SectionHeader from '../components/SectionHeader';
import {
  EmptyState,
  PageError,
  PageLoader,
} from '../components/PageFeedback';
import { useCatalogData } from '../hooks/useCatalog';

const OffersPage = ({ addToCart }) => {
  const { products, sections, loading, error } = useCatalogData();

  const spotlightProducts = useMemo(() => (
    [...products]
      .sort((a, b) => {
        const left = a.createdAt ? new Date(a.createdAt).getTime() : Number(a.id);
        const right = b.createdAt ? new Date(b.createdAt).getTime() : Number(b.id);
        return right - left;
      })
      .slice(0, 8)
  ), [products]);

  if (loading) {
    return (
      <main className="page-shell px-4 py-28 md:px-8 lg:px-16">
        <div className="mx-auto max-w-7xl">
          <PageLoader
            title="Loading store highlights"
            subtitle="Fetching the latest live products from the backend."
          />
        </div>
      </main>
    );
  }

  if (error) {
    return (
      <main className="page-shell px-4 py-28 md:px-8 lg:px-16">
        <div className="mx-auto max-w-7xl">
          <PageError title="Highlights unavailable" message={error} />
        </div>
      </main>
    );
  }

  return (
    <main className="page-shell">
      <section className="section-padding pb-0">
        <div className="mx-auto grid max-w-7xl gap-6 lg:grid-cols-[minmax(0,1fr)_320px] lg:items-end">
          <SectionHeader
            badge="Store Highlights"
            title="Live"
            highlight="Drops"
            subtitle="This page now surfaces backend-backed product highlights instead of static offer mock data, so every admin update appears here automatically."
            center={false}
            tone="light"
          />

          <motion.div
            initial={{ opacity: 0, x: 24 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="page-panel p-6"
          >
            <div className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.32em] text-brand-600">
              <BadgePercent className="h-4 w-4" />
              Live data only
            </div>
            <div className="mt-5 space-y-4">
              <div className="flex items-center justify-between rounded-[1.3rem] border border-black/8 bg-white/68 px-4 py-4 text-sm">
                <span className="text-[#6d635a]">Products indexed</span>
                <span className="font-semibold text-[#17110d]">{products.length}</span>
              </div>
              <div className="flex items-center justify-between rounded-[1.3rem] border border-black/8 bg-white/68 px-4 py-4 text-sm">
                <span className="text-[#6d635a]">Sections covered</span>
                <span className="font-semibold text-[#17110d]">{sections.length}</span>
              </div>
              <div className="flex items-start gap-3 rounded-[1.3rem] border border-brand-500/16 bg-brand-50 px-4 py-4 text-sm leading-relaxed text-[#5f554b]">
                <Sparkles className="mt-0.5 h-4 w-4 text-brand-600" />
                Backend pricing still wins during checkout, even if a shopper sits on this page for a while.
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      <section className="section-padding">
        <div className="mx-auto max-w-7xl">
          {spotlightProducts.length === 0 ? (
            <EmptyState
              title="No live products yet"
              message="Add products from the admin panel and they will show up here automatically."
            />
          ) : (
            <ProductGrid
              products={spotlightProducts}
              initialCount={8}
              addToCart={addToCart}
            />
          )}
        </div>
      </section>
    </main>
  );
};

export default OffersPage;
