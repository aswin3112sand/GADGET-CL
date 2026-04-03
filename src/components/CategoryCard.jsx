import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight, Sparkles } from 'lucide-react';

const CategoryCard = ({ category, index }) => {
  const Icon = category.icon;

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.08, duration: 0.5 }}
    >
      <Link to={`/category/${category.slug}`} className="block h-full">
        <motion.div
          whileHover={{ y: -10, scale: 1.01 }}
          transition={{ type: 'spring', stiffness: 300, damping: 20 }}
          className="group relative h-72 cursor-pointer overflow-hidden rounded-[2rem]
                     border border-white/10 bg-[#090d16] transition-all duration-500"
          style={{
            backgroundImage: `radial-gradient(circle at top right, ${category.accent}24, transparent 34%), linear-gradient(180deg, rgba(8,11,18,0.98) 0%, rgba(10,15,24,0.92) 58%, rgba(7,10,16,0.98) 100%)`,
            boxShadow: `0 0 0 0px ${category.glow}`,
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.boxShadow = `0 20px 60px ${category.glow}, 0 0 40px ${category.glow}40`;
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.boxShadow = `0 0 0 0px ${category.glow}`;
          }}
        >
          <div
            className="absolute -right-10 -top-10 h-32 w-32 rounded-full blur-3xl transition-transform duration-700 group-hover:scale-125"
            style={{ backgroundColor: category.accent }}
          />
          <div
            className="absolute inset-0 opacity-[0.14]"
            style={{
              backgroundImage: 'linear-gradient(rgba(255,255,255,0.08) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.08) 1px, transparent 1px)',
              backgroundSize: '28px 28px',
            }}
          />
          <div className={`absolute inset-0 bg-gradient-to-br ${category.gradient} opacity-10 transition-opacity duration-500 group-hover:opacity-20`} />
          <div className="absolute right-0 top-0 h-24 w-24 rounded-bl-[2rem] border-b border-l border-white/10 bg-white/[0.03]" />

          <img
            src={category.bg}
            alt={category.name}
            className="absolute inset-0 h-full w-full object-cover opacity-10 mix-blend-screen transition-all duration-700 group-hover:scale-110 group-hover:opacity-25"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-slate-950/35 to-slate-950/95" />

          <div className="relative z-10 flex h-full flex-col justify-between p-6">
            <div className="flex items-start justify-between gap-4">
              <div
                className={`flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br ${category.gradient} shadow-lg transition-transform duration-300 group-hover:scale-110`}
                style={{ boxShadow: `0 8px 20px ${category.glow}` }}
              >
                <Icon className="h-6 w-6 text-white" />
              </div>
              <div className="flex flex-col items-end gap-2">
                <span
                  className="rounded-full border px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.28em]"
                  style={{
                    color: category.accent,
                    borderColor: `${category.accent}55`,
                    backgroundColor: `${category.accent}14`,
                  }}
                >
                  {category.theme}
                </span>
                <span className="rounded-full border border-white/10 bg-white/[0.03] px-3 py-1 text-[11px] font-medium text-white/70">
                  {category.count} products
                </span>
              </div>
            </div>

            <div>
              <p
                className="mb-3 text-[11px] font-semibold uppercase tracking-[0.34em]"
                style={{ color: category.accent }}
              >
                Nexus Edit
              </p>
              <h3 className="mb-2 font-display text-2xl font-bold text-white">
                {category.name}
              </h3>
              <p className="max-w-[15rem] text-sm leading-relaxed text-white/60">
                {category.description}
              </p>
            </div>

            <div className="flex items-center justify-between border-t border-white/10 pt-4">
              <div className="flex items-center gap-2 text-xs font-medium text-white/55">
                <Sparkles className="h-3.5 w-3.5" style={{ color: category.accent }} />
                Curated collection
              </div>
              <div className="flex items-center gap-1 text-sm font-semibold text-white/75 transition-colors duration-300 group-hover:text-white">
                Explore
                <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
              </div>
            </div>
          </div>
        </motion.div>
      </Link>
    </motion.div>
  );
};

export default CategoryCard;
