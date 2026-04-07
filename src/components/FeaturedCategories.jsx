import { motion } from 'framer-motion';
import { Layers3, Sparkles } from 'lucide-react';
import SectionHeader from './SectionHeader';
import CategoryCard from './CategoryCard';
import { categoryConfig } from '../utils/categoryConfig';

const FeaturedCategories = () => (
  <section className="section-padding relative overflow-hidden bg-transparent">
    <div className="pointer-events-none absolute inset-0 bg-mesh opacity-75" />

    <div className="relative z-10 mx-auto max-w-7xl">
      <div className="mb-14 flex flex-col gap-8 xl:flex-row xl:items-end xl:justify-between">
        <SectionHeader
          badge="Curated Categories"
          title="Browse by"
          highlight="Mood and Use"
          subtitle="A calmer luxury-tech taxonomy with richer imagery, stronger spacing, and category cards that feel more like editorial covers than utility tiles."
          center={false}
          tone="light"
        />

        <motion.div
          initial={{ opacity: 0, x: 24 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          className="anchor-panel self-start p-6"
        >
          <div className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.32em] text-brand-300">
            <Sparkles className="h-3.5 w-3.5" />
            Category edit
          </div>
          <div className="mt-5 grid grid-cols-2 gap-6">
            <div>
              <div className="mb-1 flex items-center gap-2 text-[#f8f3eb]">
                <Layers3 className="h-4 w-4 text-brand-300" />
                <span className="font-display text-3xl">8</span>
              </div>
              <p className="text-sm text-white/58">Signature lanes</p>
            </div>
            <div>
              <div className="font-display text-3xl text-brand-300">400+</div>
              <p className="text-sm text-white/58">Curated products</p>
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
