import { motion } from 'framer-motion';
import { Flame } from 'lucide-react';
import SectionHeader from './SectionHeader';
import ProductSlider from './ProductSlider';
import { trendingProducts } from '../data/mockData';

const BestSellers = ({ addToCart }) => (
  <section className="section-padding relative overflow-hidden bg-[rgba(255,250,243,0.32)]">
    <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(220,195,154,0.24),transparent_32%)]" />

    <div className="relative z-10 mx-auto max-w-7xl">
      <div className="mb-12 flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
        <SectionHeader
          badge="Best Sellers"
          title="Our Most"
          highlight="Desired Picks"
          subtitle="Handpicked devices now sit inside a cleaner editorial frame with sharper price hierarchy and quieter luxury product cards."
          center={false}
          tone="light"
        />

        <motion.div
          initial={{ opacity: 0, x: 18 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          className="luxury-pill text-sm normal-case tracking-[0.08em]"
        >
          <Flame className="h-4 w-4" />
          56 sold today
        </motion.div>
      </div>

      <ProductSlider products={trendingProducts.slice(0, 10)} addToCart={addToCart} />
    </div>
  </section>
);

export default BestSellers;
