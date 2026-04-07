import { useParams } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import ProductGrid from '../components/ProductGrid';
import { EmptyState, PageError, PageLoader } from '../components/PageFeedback';
import { useCatalogData, useSectionBySlug } from '../hooks/useCatalog';

const CategoryPage = ({ addToCart }) => {
  const { slug } = useParams();
  const { sections, products, loading, error } = useCatalogData();
  const section = useSectionBySlug(sections, slug);

  if (loading) {
    return (
      <main className="page-shell px-4 py-28 md:px-8 lg:px-16">
        <div className="mx-auto max-w-7xl">
          <PageLoader title="Loading category" subtitle="Fetching the latest catalog section and its products." />
        </div>
      </main>
    );
  }

  if (error) {
    return (
      <main className="page-shell px-4 py-28 md:px-8 lg:px-16">
        <div className="mx-auto max-w-7xl">
          <PageError title="Category unavailable" message={error} />
        </div>
      </main>
    );
  }

  if (!section) {
    return (
      <main className="page-shell px-4 py-28 md:px-8 lg:px-16">
        <div className="mx-auto max-w-7xl">
          <PageError title="Category not found" message="The section you are looking for does not exist in the live catalog." />
        </div>
      </main>
    );
  }

  const sectionProducts = products.filter((product) => product.sectionId === section.id);
  const Icon = section.icon;

  return (
    <main className="page-shell">
      <section className="section-padding pb-12">
        <div className="mx-auto grid max-w-7xl gap-6 lg:grid-cols-[minmax(0,1fr)_320px] lg:items-end">
          <div className="page-panel p-8 md:p-10">
            <span className="inline-flex rounded-full border border-brand-500/20 bg-brand-50 px-4 py-1.5 text-[11px] font-semibold uppercase tracking-[0.3em] text-brand-600">
              Live store section
            </span>
            <h1 className="mt-5 font-display text-5xl text-[#17110d] md:text-6xl">
              {section.name}
            </h1>
            <p className="mt-4 max-w-2xl text-base leading-relaxed text-[#5f554b] md:text-lg">
              {section.description}
            </p>

            <div className="mt-8 flex flex-wrap items-center gap-3">
              <span className="rounded-full border border-black/8 bg-white/72 px-4 py-2 text-sm font-medium text-[#17110d]">
                {sectionProducts.length} products
              </span>
              <span className="rounded-full border border-black/8 bg-white/72 px-4 py-2 text-sm font-medium text-[#6d635a]">
                Synced from backend
              </span>
            </div>
          </div>

          <div className="anchor-panel p-6">
            <div className="flex h-16 w-16 items-center justify-center rounded-[1.5rem] border border-white/10 bg-white/8">
              <Icon className="h-7 w-7 text-brand-300" />
            </div>
            <p className="mt-6 text-[11px] font-semibold uppercase tracking-[0.3em] text-brand-300">
              Category focus
            </p>
            <p className="mt-3 text-sm leading-relaxed text-white/62">
              Products below are filtered live from the PostgreSQL-backed catalog instead of static mock data.
            </p>
            <div className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-white">
              Curated by Gadget69
              <ArrowRight className="h-4 w-4 text-brand-300" />
            </div>
          </div>
        </div>
      </section>

      <section className="px-4 pb-24 md:px-8 lg:px-16 xl:px-24">
        <div className="mx-auto max-w-7xl">
          {sectionProducts.length === 0 ? (
            <EmptyState
              title="No products in this category yet"
              message="The section exists, but no products have been published into it yet."
            />
          ) : (
            <ProductGrid products={sectionProducts} initialCount={10} addToCart={addToCart} />
          )}
        </div>
      </section>
    </main>
  );
};

export default CategoryPage;
