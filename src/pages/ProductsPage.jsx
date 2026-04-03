import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Search, X, ChevronDown } from 'lucide-react';
import ProductCard from '../components/ProductCard';
import SectionHeader from '../components/SectionHeader';
import { allProducts } from '../data/mockData';
import { categoryConfig } from '../utils/categoryConfig';

const SORT_OPTIONS = [
  { label: 'Featured',        value: 'featured' },
  { label: 'Price: Low–High', value: 'price-asc' },
  { label: 'Price: High–Low', value: 'price-desc' },
  { label: 'Top Rated',       value: 'rating' },
  { label: 'Discount',        value: 'discount' },
];

const ProductsPage = ({ addToCart }) => {
  const [search,   setSearch]   = useState('');
  const [category, setCategory] = useState('All');
  const [sort,     setSort]     = useState('featured');
  const [page,     setPage]     = useState(1);
  const PER_PAGE = 16;

  const filtered = useMemo(() => {
    let items = allProducts;
    if (category !== 'All') items = items.filter(p => p.category === category);
    if (search) items = items.filter(p =>
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.brand.toLowerCase().includes(search.toLowerCase())
    );
    switch (sort) {
      case 'price-asc':  return [...items].sort((a, b) => a.offerPrice - b.offerPrice);
      case 'price-desc': return [...items].sort((a, b) => b.offerPrice - a.offerPrice);
      case 'rating':     return [...items].sort((a, b) => b.rating - a.rating);
      case 'discount':   return [...items].sort((a, b) => b.discount - a.discount);
      default:           return items;
    }
  }, [search, category, sort]);

  const totalPages = Math.ceil(filtered.length / PER_PAGE);
  const paginated  = filtered.slice((page - 1) * PER_PAGE, page * PER_PAGE);

  return (
    <main className="min-h-screen bg-dark-400 pt-24">
      {/* Page Header */}
      <section className="section-padding pb-10 relative overflow-hidden">
        <div className="absolute top-0 left-1/3 w-96 h-96 rounded-full
                        bg-brand-600/10 blur-[120px] pointer-events-none" />
        <div className="max-w-7xl mx-auto relative z-10">
          <SectionHeader
            badge="400+ Products"
            title="All"
            highlight="Gadgets"
            subtitle="Browse our complete collection of premium tech across 8 categories."
          />

          {/* Search + Sort Bar */}
          <div className="flex flex-col md:flex-row gap-3 max-w-2xl mx-auto">
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
              <input
                type="text"
                value={search}
                onChange={(e) => { setSearch(e.target.value); setPage(1); }}
                placeholder="Search gadgets, brands..."
                className="w-full pl-11 pr-4 py-3.5 rounded-xl glass border border-white/10
                           text-white placeholder-white/30 text-sm
                           focus:outline-none focus:border-brand-500/50 transition-all duration-300"
              />
              {search && (
                <button onClick={() => setSearch('')}
                        className="absolute right-4 top-1/2 -translate-y-1/2">
                  <X className="w-4 h-4 text-white/40 hover:text-white" />
                </button>
              )}
            </div>

            <div className="relative">
              <select
                value={sort}
                onChange={(e) => { setSort(e.target.value); setPage(1); }}
                className="appearance-none pl-4 pr-10 py-3.5 rounded-xl glass border border-white/10
                           text-white text-sm bg-transparent cursor-pointer
                           focus:outline-none focus:border-brand-500/50 transition-all duration-300"
              >
                {SORT_OPTIONS.map(o => (
                  <option key={o.value} value={o.value} className="bg-dark-100 text-white">
                    {o.label}
                  </option>
                ))}
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40 pointer-events-none" />
            </div>
          </div>
        </div>
      </section>

      <section className="px-4 md:px-8 lg:px-16 xl:px-24 pb-20">
        <div className="max-w-7xl mx-auto flex gap-8">

          {/* Sidebar Filters */}
          <aside className="hidden lg:block w-56 flex-none">
            <div className="glass rounded-3xl border border-white/5 p-5 sticky top-24">
              <h3 className="text-white font-semibold text-sm uppercase tracking-wider mb-4">
                Categories
              </h3>
              <div className="flex flex-col gap-1">
                {['All', ...categoryConfig.map(c => c.name)].map(cat => (
                  <button
                    key={cat}
                    onClick={() => { setCategory(cat); setPage(1); }}
                    className={`px-3 py-2.5 rounded-xl text-sm text-left transition-all duration-300
                      ${category === cat
                        ? 'bg-brand-500/15 border border-brand-500/30 text-brand-400 font-semibold'
                        : 'text-white/50 hover:text-white hover:bg-white/5'}`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
              <div className="mt-6 pt-6 border-t border-white/5">
                <p className="text-white/30 text-xs">Showing {filtered.length} products</p>
              </div>
            </div>
          </aside>

          {/* Product Grid */}
          <div className="flex-1 min-w-0">
            {/* Mobile Category Pills */}
            <div className="lg:hidden flex gap-2 overflow-x-auto pb-4 mb-6"
                 style={{ scrollbarWidth: 'none' }}>
              {['All', ...categoryConfig.map(c => c.name)].map(cat => (
                <button
                  key={cat}
                  onClick={() => { setCategory(cat); setPage(1); }}
                  className={`flex-none px-4 py-2 rounded-xl text-sm font-medium transition-all duration-300
                    ${category === cat
                      ? 'bg-brand-500 text-white'
                      : 'glass border border-white/10 text-white/60 hover:text-white'}`}
                >
                  {cat}
                </button>
              ))}
            </div>

            {paginated.length === 0 ? (
              <div className="text-center py-24 text-white/30">
                <p className="text-xl font-semibold mb-2">No products found</p>
                <p className="text-sm">Try a different search or category</p>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
                  {paginated.map((product, i) => (
                    <ProductCard key={product.id} product={product} index={i} addToCart={addToCart} />
                  ))}
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="flex items-center justify-center gap-2 mt-12">
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (
                      <button
                        key={p}
                        onClick={() => setPage(p)}
                        className={`w-10 h-10 rounded-xl text-sm font-semibold transition-all duration-300
                          ${page === p
                            ? 'bg-brand-500 text-white shadow-neon-blue'
                            : 'glass border border-white/10 text-white/60 hover:text-white'}`}
                      >
                        {p}
                      </button>
                    ))}
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </section>
    </main>
  );
};

export default ProductsPage;
