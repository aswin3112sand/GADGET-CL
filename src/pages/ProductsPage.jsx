import { useEffect, useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { ChevronDown, Search, SlidersHorizontal, X } from 'lucide-react';
import { useSearchParams } from 'react-router-dom';
import ProductCard from '../components/ProductCard';
import SectionHeader from '../components/SectionHeader';
import {
  EmptyState,
  PageError,
  PageLoader,
} from '../components/PageFeedback';
import { useCatalogData } from '../hooks/useCatalog';

const SORT_OPTIONS = [
  { label: 'Newest first', value: 'newest' },
  { label: 'Price: Low to High', value: 'price-asc' },
  { label: 'Price: High to Low', value: 'price-desc' },
  { label: 'Name: A to Z', value: 'name' },
];

const PER_PAGE = 12;

const sortProducts = (items, sort) => {
  switch (sort) {
    case 'price-asc':
      return [...items].sort((a, b) => Number(a.price) - Number(b.price));
    case 'price-desc':
      return [...items].sort((a, b) => Number(b.price) - Number(a.price));
    case 'name':
      return [...items].sort((a, b) => a.name.localeCompare(b.name));
    case 'newest':
    default:
      return [...items].sort((a, b) => {
        const left = a.createdAt ? new Date(a.createdAt).getTime() : Number(a.id);
        const right = b.createdAt ? new Date(b.createdAt).getTime() : Number(b.id);
        return right - left;
      });
  }
};

const ProductsPage = ({ addToCart }) => {
  const [searchParams, setSearchParams] = useSearchParams();
  const { sections, products, loading, error } = useCatalogData();
  const [search, setSearch] = useState(() => searchParams.get('q') || '');
  const [category, setCategory] = useState(() => searchParams.get('section') || 'All');
  const [sort, setSort] = useState(() => (
    SORT_OPTIONS.some((option) => option.value === searchParams.get('sort'))
      ? searchParams.get('sort')
      : 'newest'
  ));
  const [page, setPage] = useState(() => {
    const initialPage = Number.parseInt(searchParams.get('page') || '1', 10);
    return Number.isFinite(initialPage) && initialPage > 0 ? initialPage : 1;
  });

  const filtered = useMemo(() => {
    let items = products;

    if (category !== 'All') {
      items = items.filter((product) => product.sectionName === category);
    }

    if (search.trim()) {
      const query = search.trim().toLowerCase();
      items = items.filter((product) => (
        product.name.toLowerCase().includes(query)
        || product.description.toLowerCase().includes(query)
        || product.sectionName.toLowerCase().includes(query)
      ));
    }

    return sortProducts(items, sort);
  }, [category, products, search, sort]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PER_PAGE));
  const paginated = filtered.slice((page - 1) * PER_PAGE, page * PER_PAGE);
  const rangeStart = filtered.length === 0 ? 0 : (page - 1) * PER_PAGE + 1;
  const rangeEnd = Math.min(page * PER_PAGE, filtered.length);
  const activeFilters = [
    category !== 'All' ? `Section: ${category}` : null,
    search.trim() ? `Search: ${search.trim()}` : null,
    sort !== 'newest' ? `Sort: ${SORT_OPTIONS.find((option) => option.value === sort)?.label || sort}` : null,
  ].filter(Boolean);

  useEffect(() => {
    if (page > totalPages) {
      setPage(totalPages);
    }
  }, [page, totalPages]);

  useEffect(() => {
    if (category !== 'All' && sections.length > 0 && !sections.some((section) => section.name === category)) {
      setCategory('All');
      setPage(1);
    }
  }, [category, sections]);

  useEffect(() => {
    const nextParams = new URLSearchParams();
    if (search.trim()) {
      nextParams.set('q', search.trim());
    }
    if (category !== 'All') {
      nextParams.set('section', category);
    }
    if (sort !== 'newest') {
      nextParams.set('sort', sort);
    }
    if (page > 1) {
      nextParams.set('page', String(page));
    }

    if (nextParams.toString() !== searchParams.toString()) {
      setSearchParams(nextParams, { replace: true });
    }
  }, [category, page, search, searchParams, setSearchParams, sort]);

  if (loading) {
    return (
      <main className="page-shell px-4 py-28 md:px-8 lg:px-16">
        <div className="mx-auto max-w-7xl">
          <PageLoader
            title="Loading products"
            subtitle="Syncing the live storefront catalog from the backend."
          />
        </div>
      </main>
    );
  }

  if (error) {
    return (
      <main className="page-shell px-4 py-28 md:px-8 lg:px-16">
        <div className="mx-auto max-w-7xl">
          <PageError title="Products unavailable" message={error} />
        </div>
      </main>
    );
  }

  return (
    <main className="page-shell">
      <section className="section-padding pb-10">
        <div className="mx-auto grid max-w-7xl gap-6 lg:grid-cols-[minmax(0,1fr)_320px] lg:items-end">
          <SectionHeader
            badge={`${filtered.length} Results`}
            title="Live"
            highlight="Catalog"
            subtitle="Browse products served directly from the Spring Boot backend, with search, category filtering, and backend-backed pricing."
            center={false}
            tone="light"
            size="default"
          />

          <motion.div
            initial={{ opacity: 0, x: 24 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="anchor-panel p-6"
          >
            <div className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.32em] text-brand-300">
              <SlidersHorizontal className="h-4 w-4" />
              Store controls
            </div>
            <div className="mt-6 grid grid-cols-2 gap-5">
              <div>
                <div className="font-display text-4xl text-white">{products.length}</div>
                <p className="mt-1 text-sm text-white/58">Live products</p>
              </div>
              <div>
                <div className="font-display text-4xl text-brand-300">{sections.length}</div>
                <p className="mt-1 text-sm text-white/58">Active sections</p>
              </div>
            </div>
            <p className="mt-5 text-sm leading-relaxed text-white/58">
              Search, sort, and section filters stay in the URL, so the exact storefront view is easy to revisit or share.
            </p>
          </motion.div>
        </div>

        <div className="mx-auto mt-10 max-w-7xl page-panel p-4 md:p-5">
          <div className="grid gap-3 lg:grid-cols-[minmax(0,1fr)_220px]">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[#8a7f74]" />
              <input
                type="text"
                value={search}
                onChange={(event) => {
                  setSearch(event.target.value);
                  setPage(1);
                }}
                placeholder="Search products, descriptions, and sections"
                className="field-input pl-11 pr-10"
              />
              {search ? (
                <button
                  onClick={() => {
                    setSearch('');
                    setPage(1);
                  }}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-[#8a7f74] transition-colors hover:text-[#17110d]"
                >
                  <X className="h-4 w-4" />
                </button>
              ) : null}
            </div>

            <div className="relative">
              <select
                value={sort}
                onChange={(event) => {
                  setSort(event.target.value);
                  setPage(1);
                }}
                className="field-input appearance-none pr-10"
              >
                {SORT_OPTIONS.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
              <ChevronDown className="pointer-events-none absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[#8a7f74]" />
            </div>
          </div>
        </div>
      </section>

      <section className="px-4 pb-24 md:px-8 lg:px-16 xl:px-24">
        <div className="mx-auto flex max-w-7xl gap-8">
          <aside className="hidden w-64 flex-none lg:block">
            <div className="page-panel sticky top-28 p-6">
              <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-brand-600">
                Sections
              </p>
              <div className="mt-5 flex flex-col gap-2">
                {['All', ...sections.map((section) => section.name)].map((item) => (
                  <button
                    key={item}
                    onClick={() => {
                      setCategory(item);
                      setPage(1);
                    }}
                    className={`rounded-[1.1rem] border px-4 py-3 text-left text-sm font-medium transition-all duration-300 ${
                      category === item
                        ? 'border-[#17110d] bg-[#17110d] text-white shadow-[0_18px_34px_rgba(23,17,13,0.14)]'
                        : 'border-black/8 bg-white/68 text-[#5f554b] hover:border-brand-500/24 hover:bg-white/86 hover:text-[#17110d]'
                    }`}
                  >
                    {item}
                  </button>
                ))}
              </div>

              <div className="mt-6 rounded-[1.4rem] border border-brand-500/16 bg-brand-50 px-4 py-4 text-sm text-[#5f554b] shadow-[0_12px_24px_rgba(183,134,75,0.08)]">
                Showing {rangeStart}-{rangeEnd} of {filtered.length} live products
              </div>
            </div>
          </aside>

          <div className="min-w-0 flex-1">
            <div className="hide-scrollbar mb-6 flex gap-2 overflow-x-auto pb-1 lg:hidden">
              {['All', ...sections.map((section) => section.name)].map((item) => (
                <button
                  key={item}
                  onClick={() => {
                    setCategory(item);
                    setPage(1);
                  }}
                  className={`flex-none rounded-full px-4 py-2 text-sm font-medium transition-all duration-300 ${
                    category === item ? 'bg-[#17110d] text-white' : 'filter-pill'
                  }`}
                >
                  {item}
                </button>
              ))}
            </div>

            <div className="mb-6 flex items-center justify-between gap-3">
              <div>
                <p className="text-sm text-[#6d635a]">
                  Showing {rangeStart}-{rangeEnd} of {filtered.length} products
                </p>
                <p className="hidden text-sm text-[#8a7f74] md:block">
                  Product data, stock, and pricing are synced from the backend.
                </p>
              </div>

              {activeFilters.length > 0 ? (
                <button
                  onClick={() => {
                    setSearch('');
                    setCategory('All');
                    setSort('newest');
                    setPage(1);
                  }}
                  className="rounded-full border border-black/8 bg-white/76 px-4 py-2 text-sm font-semibold text-[#5f554b] transition-colors hover:border-brand-500/24 hover:text-[#17110d]"
                >
                  Clear filters
                </button>
              ) : null}
            </div>

            {activeFilters.length > 0 ? (
              <div className="mb-6 flex flex-wrap gap-2">
                {activeFilters.map((filter) => (
                  <span
                    key={filter}
                    className="rounded-full border border-brand-500/20 bg-brand-50 px-3 py-1.5 text-xs font-semibold text-brand-700"
                  >
                    {filter}
                  </span>
                ))}
              </div>
            ) : null}

            {paginated.length === 0 ? (
              <EmptyState
                title="No matching products"
                message="Try another section, search term, or sort combination to surface the product you want."
              />
            ) : (
              <>
                <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
                  {paginated.map((product, index) => (
                    <ProductCard
                      key={product.id}
                      product={product}
                      index={index}
                      addToCart={addToCart}
                    />
                  ))}
                </div>

                {totalPages > 1 ? (
                  <div className="mt-12 flex items-center justify-center gap-2">
                    {Array.from({ length: totalPages }, (_, index) => index + 1).map((value) => (
                      <button
                        key={value}
                        onClick={() => setPage(value)}
                        className={`flex h-11 w-11 items-center justify-center rounded-full text-sm font-semibold transition-all duration-300 ${
                          page === value
                            ? 'bg-[#17110d] text-white shadow-[0_18px_34px_rgba(23,17,13,0.14)]'
                            : 'border border-black/8 bg-white/76 text-[#6d635a] hover:border-brand-500/24 hover:text-[#17110d]'
                        }`}
                      >
                        {value}
                      </button>
                    ))}
                  </div>
                ) : null}
              </>
            )}
          </div>
        </div>
      </section>
    </main>
  );
};

export default ProductsPage;
