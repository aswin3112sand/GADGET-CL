import { motion } from 'framer-motion';
import { Flame } from 'lucide-react';
import SectionHeader from './SectionHeader';
import ProductSlider from './ProductSlider';
import { trendingProducts } from '../data/mockData';

const BestSellers = ({ addToCart }) => (
  <section className="section-padding bg-dark-300 relative overflow-hidden">
    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[400px]
                    bg-brand-600/10 blur-[120px] pointer-events-none rounded-full" />

    <div className="max-w-7xl mx-auto relative z-10">
      <div className="flex items-end justify-between mb-12">
        <SectionHeader
          badge="🔥 Trending Now"
          title="Best"
          highlight="Sellers"
          subtitle="Handpicked by our community of 50,000+ tech enthusiasts."
          center={false}
        />
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          className="hidden md:flex items-center gap-2 px-4 py-2 rounded-full
                     glass neon-border text-brand-400 text-sm font-semibold"
        >
          <Flame className="w-4 h-4" />
          56 sold today
        </motion.div>
      </div>

      <ProductSlider products={trendingProducts.slice(0, 12)} addToCart={addToCart} />
    </div>
  </section>
);

export default BestSellers;
