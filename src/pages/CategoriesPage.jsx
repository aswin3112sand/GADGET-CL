import { motion } from 'framer-motion';
import { Sparkles, SwatchBook } from 'lucide-react';
import SectionHeader from '../components/SectionHeader';
import CategoryCard from '../components/CategoryCard';
import { categoryConfig } from '../utils/categoryConfig';

const CategoriesPage = () => (
  <main className="min-h-screen overflow-hidden bg-dark-400 pt-24">
    <section className="section-padding relative">
      <div className="absolute inset-0 bg-mesh opacity-50 pointer-events-none" />
      <div className="absolute top-0 right-12 h-72 w-72 rounded-full bg-violet-500/10 blur-[140px] pointer-events-none" />
      <div className="absolute bottom-0 left-12 h-72 w-72 rounded-full bg-cyan-400/10 blur-[140px] pointer-events-none" />

      <div className="relative z-10 mx-auto max-w-7xl">
        <div className="mb-14 flex flex-col gap-8 xl:flex-row xl:items-end xl:justify-between">
          <SectionHeader
            badge="All Categories"
            title="Browse Our"
            highlight="Categories"
            subtitle="Explore 8 premium tech categories with 50 curated products each, now tuned with bolder corner accents and a more premium color story."
            center={false}
          />

          <motion.div
            initial={{ opacity: 0, x: 24 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="self-start rounded-[2rem] border border-white/10 bg-white/[0.04] p-5 backdrop-blur-2xl"
          >
            <div className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.32em] text-fuchsia-300">
              <Sparkles className="h-3.5 w-3.5" />
              New Category Theme
            </div>
            <div className="mt-5 flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/[0.05]">
                <SwatchBook className="h-5 w-5 text-brand-400" />
              </div>
              <div>
                <p className="font-display text-xl font-bold text-white">Sharper cards</p>
                <p className="text-sm text-white/45">Corner detail, richer gradients, clearer hierarchy</p>
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
  </main>
);

export default CategoriesPage;
