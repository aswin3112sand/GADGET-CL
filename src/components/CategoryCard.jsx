import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

const CategoryCard = ({ category, index }) => {
  const Icon = category.icon;

  return (
    <motion.div
      initial={{ opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.06, duration: 0.5 }}
    >
      <Link to={`/category/${category.slug}`} className="block h-full">
        <motion.div
          whileHover={{ y: -8 }}
          transition={{ type: 'spring', stiffness: 300, damping: 24 }}
          className="group flex h-full flex-col overflow-hidden rounded-[2rem] border border-[rgba(34,24,17,0.08)] bg-[linear-gradient(180deg,rgba(255,252,247,0.94)_0%,rgba(252,246,239,0.88)_100%)] shadow-[0_22px_48px_rgba(23,17,13,0.07)]"
        >
          <div className="relative h-44 overflow-hidden">
            <img
              src={category.bg}
              alt={category.name}
              className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(23,17,13,0.08)_0%,rgba(23,17,13,0.54)_100%)]" />
            <div className="absolute left-5 top-5 rounded-full border border-white/18 bg-white/14 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.3em] text-white backdrop-blur-sm">
              Curated Category
            </div>
            <div className="absolute bottom-5 left-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-white/88 text-brand-600 shadow-[0_16px_34px_rgba(23,17,13,0.16)]">
              <Icon className="h-6 w-6" />
            </div>
          </div>

          <div className="flex flex-1 flex-col justify-between p-6">
            <div>
              <div className="mb-3 flex items-center justify-between gap-3">
                <span className="inline-flex items-center rounded-full border border-brand-500/18 bg-brand-50 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.24em] text-brand-600">
                  Gadget69
                </span>
                <span className="text-xs font-medium text-[#6d635a]">
                  {category.count} products
                </span>
              </div>

              <h3 className="font-display text-3xl leading-tight text-[#17110d]">
                {category.name}
              </h3>
              <p className="mt-3 text-sm leading-relaxed text-[#5f554b]">
                {category.description}
              </p>
            </div>

            <div className="mt-6 flex items-center justify-between border-t border-[rgba(34,24,17,0.08)] pt-4 text-sm font-semibold text-[#17110d]">
              <span className="text-[#6d635a]">Editorial collection</span>
              <span className="inline-flex items-center gap-1 text-brand-600">
                Explore
                <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
              </span>
            </div>
          </div>
        </motion.div>
      </Link>
    </motion.div>
  );
};

export default CategoryCard;
