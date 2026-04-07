import { useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import SectionHeader from './SectionHeader';
import ProductGrid from './ProductGrid';
import ProductSlider from './ProductSlider';

const CategoryShowcase = ({ config, products, addToCart, tone = 'light' }) => {
  const [view, setView] = useState('grid');
  const featured = products.filter((product) => product.isFeatured).slice(0, 10);
  const rest = products.filter((product) => !product.isFeatured);
  const isContrast = tone === 'contrast';

  return (
    <section
      className={`section-padding relative overflow-hidden ${isContrast ? 'bg-[rgba(255,251,245,0.42)]' : 'bg-transparent'}`}
      id={config.slug}
    >
      {isContrast && (
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_12%_18%,rgba(225,198,155,0.2),transparent_26%)]" />
      )}

      <div className="relative z-10 mx-auto max-w-7xl">
        <div className="mb-12 flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <SectionHeader
            badge={`${config.count} Products`}
            title={config.name}
            highlight="Collection"
            subtitle={config.description}
            center={false}
            tone="light"
          />

          <div className="flex items-center gap-3">
            <div className="flex rounded-full border border-[rgba(34,24,17,0.08)] bg-[rgba(255,251,245,0.72)] p-1 shadow-[0_14px_28px_rgba(23,17,13,0.05)]">
              {['grid', 'slider'].map((value) => (
                <button
                  key={value}
                  onClick={() => setView(value)}
                  className={`rounded-full px-4 py-2 text-xs font-semibold uppercase tracking-[0.16em] transition-all duration-300 ${
                    view === value
                      ? 'bg-[#17110d] text-white shadow-[0_14px_28px_rgba(23,17,13,0.12)]'
                      : 'text-[#6a6057] hover:text-[#17110d]'
                  }`}
                >
                  {value === 'grid' ? 'Grid' : 'Slider'}
                </button>
              ))}
            </div>

            <Link to={`/category/${config.slug}`} className="btn-link">
              View All
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
        </div>

        {featured.length > 0 && (
          <div className="mb-10">
            <div className="mb-4 flex items-center gap-2">
              <div className="h-5 w-1 rounded-full bg-brand-500" />
              <span className="text-sm font-semibold text-[#5f554b]">Featured picks</span>
            </div>
            <ProductSlider products={featured} addToCart={addToCart} />
          </div>
        )}

        <div className="mt-8">
          <div className="mb-6 flex items-center gap-2">
            <div className="h-5 w-1 rounded-full bg-[#17110d]" />
            <span className="text-sm font-semibold text-[#5f554b]">All products</span>
          </div>

          <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}>
            {view === 'grid' ? (
              <ProductGrid products={rest} initialCount={10} addToCart={addToCart} />
            ) : (
              <ProductSlider products={rest} addToCart={addToCart} />
            )}
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default CategoryShowcase;
