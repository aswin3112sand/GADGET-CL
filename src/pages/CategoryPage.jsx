import { useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import SectionHeader from '../components/SectionHeader';
import ProductGrid from '../components/ProductGrid';
import { categoryConfig } from '../utils/categoryConfig';
import { getProductsByCategory } from '../data/mockData';

const CategoryPage = ({ addToCart }) => {
  const { slug } = useParams();
  const config = categoryConfig.find(c => c.slug === slug);
  const products = config ? getProductsByCategory(config.name) : [];

  if (!config) {
    return (
      <main className="min-h-screen bg-dark-400 pt-24 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-white mb-4">Category not found</h1>
          <p className="text-white/50">The category you're looking for doesn't exist.</p>
        </div>
      </main>
    );
  }

  const Icon = config.icon;

  return (
    <main className="min-h-screen bg-dark-400 pt-24">
      {/* Hero Banner */}
      <section className="section-padding pb-12 relative overflow-hidden">
        <div className="absolute inset-0 opacity-[0.03]"
             style={{
               backgroundImage: `linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px),
                                  linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)`,
               backgroundSize: '50px 50px',
             }} />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[400px] rounded-full"
             style={{ background: `radial-gradient(circle, ${config.glow} 0%, transparent 70%)`, filter: 'blur(60px)' }} />

        <div className="max-w-7xl mx-auto relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center"
          >
            <div className={`w-20 h-20 rounded-3xl bg-gradient-to-br ${config.gradient}
                             flex items-center justify-center mb-6 mx-auto`}
                 style={{ boxShadow: `0 0 40px ${config.glow}` }}>
              <Icon className="w-10 h-10 text-white" />
            </div>
            <h1 className="font-display text-4xl md:text-6xl font-black text-white mb-4">
              {config.name}
            </h1>
            <p className="text-white/50 text-lg max-w-lg mx-auto">{config.description}</p>
            <div className="flex items-center justify-center gap-2 mt-4">
              <span className="px-4 py-1.5 rounded-full glass border border-white/10 text-white/60 text-sm">
                {config.count} products
              </span>
            </div>
          </motion.div>
        </div>
      </section>

      <section className="px-4 md:px-8 lg:px-16 xl:px-24 pb-20">
        <div className="max-w-7xl mx-auto">
          <ProductGrid products={products} initialCount={16} addToCart={addToCart} />
        </div>
      </section>
    </main>
  );
};

export default CategoryPage;
