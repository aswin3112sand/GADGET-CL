import { Link } from 'react-router-dom';
import { Layers3 } from 'lucide-react';
import SectionHeader from '../components/SectionHeader';
import { EmptyState, PageError, PageLoader } from '../components/PageFeedback';
import { useCatalogData } from '../hooks/useCatalog';

const CategoriesPage = () => {
  const { sections, loading, error } = useCatalogData();

  if (loading) {
    return (
      <main className="page-shell px-4 py-28 md:px-8 lg:px-16">
        <div className="mx-auto max-w-7xl">
          <PageLoader title="Loading categories" subtitle="Syncing live storefront sections from the backend." />
        </div>
      </main>
    );
  }

  if (error) {
    return (
      <main className="page-shell px-4 py-28 md:px-8 lg:px-16">
        <div className="mx-auto max-w-7xl">
          <PageError title="Categories unavailable" message={error} />
        </div>
      </main>
    );
  }

  return (
    <main className="page-shell overflow-hidden">
      <section className="section-padding">
        <div className="mx-auto max-w-7xl">
          <div className="mb-14 grid gap-6 xl:grid-cols-[minmax(0,1fr)_320px] xl:items-end">
            <SectionHeader
              badge="All Categories"
              title="Browse Our"
              highlight="Categories"
              subtitle="Every section shown here is served from the live backend, so catalog grouping stays consistent for both customers and admins."
              center={false}
              tone="light"
            />

            <div className="anchor-panel p-6">
              <div className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.32em] text-brand-300">
                <Layers3 className="h-4 w-4" />
                Live backend sync
              </div>
              <div className="mt-5 grid grid-cols-2 gap-5">
                <div>
                  <div className="font-display text-3xl text-white">{sections.length}</div>
                  <p className="text-sm text-white/58">Store sections</p>
                </div>
                <div>
                  <div className="font-display text-3xl text-brand-300">
                    {sections.reduce((sum, section) => sum + section.count, 0)}
                  </div>
                  <p className="text-sm text-white/58">Products indexed</p>
                </div>
              </div>
            </div>
          </div>

          {sections.length === 0 ? (
            <EmptyState
              title="No categories yet"
              message="Create sections in the admin panel and they will appear here for customers."
            />
          ) : (
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {sections.map((section) => (
                <Link
                  key={section.id}
                  to={`/category/${section.slug}`}
                  className="group overflow-hidden rounded-[1.8rem] border border-black/8 bg-white/80 shadow-[0_20px_46px_rgba(23,17,13,0.08)] transition-all duration-500 hover:-translate-y-1.5"
                >
                  <div className="relative h-52 overflow-hidden">
                    <img
                      src={section.image}
                      alt={section.name}
                      className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(23,17,13,0.05)_0%,rgba(23,17,13,0.48)_100%)]" />
                  </div>
                  <div className="p-5">
                    <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-brand-600">{section.count} items</p>
                    <h2 className="mt-3 font-display text-3xl text-[#17110d]">{section.name}</h2>
                    <p className="mt-2 text-sm leading-relaxed text-[#5f554b]">{section.description}</p>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>
    </main>
  );
};

export default CategoriesPage;
