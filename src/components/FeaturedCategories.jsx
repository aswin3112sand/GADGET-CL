import { motion } from 'framer-motion';
import { Layers3, Sparkles } from 'lucide-react';
import SectionHeader from './SectionHeader';
import CategoryCard from './CategoryCard';
import { categoryConfig } from '../utils/categoryConfig';

const FeaturedCategories = () => (
  <section className="section-padding relative overflow-hidden bg-dark-400">
    <div className="absolute inset-0 bg-mesh opacity-60 pointer-events-none" />
    <div className="absolute -top-16 right-8 h-56 w-56 rounded-full bg-cyan-400/10 blur-[120px] pointer-events-none" />
    <div className="absolute bottom-0 left-0 h-64 w-64 rounded-full bg-fuchsia-500/10 blur-[140px] pointer-events-none" />

    <div className="relative z-10 mx-auto max-w-7xl">
      <div className="mb-14 flex flex-col gap-8 xl:flex-row xl:items-end xl:justify-between">
        <SectionHeader
          badge="Browse by Category"
          title="Find Your"
          highlight="Next Gadget"
          subtitle="8 premium categories, 400+ curated tech products - now with a sharper showroom theme and cleaner visual hierarchy."
          center={false}
        />

        <motion.div
          initial={{ opacity: 0, x: 24 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          className="self-start rounded-[2rem] border border-white/10 bg-white/[0.04] p-5 backdrop-blur-2xl"
        >
          <div className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.32em] text-cyan-300">
            <Sparkles className="h-3.5 w-3.5" />
            Category Moodboard
          </div>
          <div className="mt-5 grid grid-cols-2 gap-5">
            <div>
              <div className="mb-1 flex items-center gap-2 text-white">
                <Layers3 className="h-4 w-4 text-brand-400" />
                <span className="font-display text-3xl font-black">8</span>
              </div>
              <p className="text-sm text-white/45">Distinct themes</p>
            </div>
            <div>
              <div className="font-display text-3xl font-black text-white">400+</div>
              <p className="text-sm text-white/45">Products live</p>
            </div>
          </div>
        </motion.div>
      </div>

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {categoryConfig.map((cat, i) => (
          <CategoryCard key={cat.id} category={cat} index={i} />
        ))}
      </div>
    </div>
  </section>
);

export default FeaturedCategories;
