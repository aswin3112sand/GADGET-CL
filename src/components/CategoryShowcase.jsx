import { useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import SectionHeader from './SectionHeader';
import ProductGrid from './ProductGrid';
import ProductSlider from './ProductSlider';

const CategoryShowcase = ({ config, products, addToCart }) => {
  const [view, setView] = useState('grid');
  const featured = products.filter(p => p.isFeatured);
  const rest = products.filter(p => !p.isFeatured);

  return (
    <section className="section-padding relative" id={config.slug}>
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
          <SectionHeader
            badge={`${config.count} Products`}
            title={config.name}
            highlight="Collection"
            subtitle={config.description}
            center={false}
          />
          <div className="flex items-center gap-3">
            <div className="flex glass rounded-xl border border-white/10 p-1">
              {['grid', 'slider'].map(v => (
                <button
                  key={v}
                  onClick={() => setView(v)}
                  className={`px-4 py-2 rounded-lg text-xs font-semibold transition-all duration-300
                    ${view === v
                      ? 'bg-brand-500 text-white shadow-neon-blue'
                      : 'text-white/50 hover:text-white'}`}
                >
                  {v === 'grid' ? 'Grid' : 'Slider'}
                </button>
              ))}
            </div>
            <Link to={`/category/${config.slug}`}
                  className="flex items-center gap-1.5 text-brand-400 text-sm font-semibold
                             hover:text-white transition-colors">
              View All <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>

        {/* Featured Row */}
        {featured.length > 0 && (
          <div className="mb-8">
            <div className="flex items-center gap-2 mb-4">
              <div className={`w-1 h-5 rounded-full bg-gradient-to-b ${config.gradient}`} />
              <span className="text-white/60 text-sm font-semibold">Featured Picks</span>
            </div>
            <ProductSlider products={featured} addToCart={addToCart} />
          </div>
        )}

        {/* Main Product View */}
        <div className="mt-8">
          <div className="flex items-center gap-2 mb-6">
            <div className={`w-1 h-5 rounded-full bg-gradient-to-b ${config.gradient}`} />
            <span className="text-white/60 text-sm font-semibold">All Products</span>
          </div>
          {view === 'grid'
            ? <ProductGrid products={rest} initialCount={8} addToCart={addToCart} />
            : <ProductSlider products={rest} addToCart={addToCart} />}
        </div>
      </div>
    </section>
  );
};

export default CategoryShowcase;
