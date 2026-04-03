import { useRef } from 'react';
import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import SectionHeader from './SectionHeader';
import ReviewCard from './ReviewCard';
import { reviews } from '../data/mockData';

const Reviews = () => {
  const ref = useRef(null);
  const scroll = (dir) => ref.current?.scrollBy({ left: dir * 350, behavior: 'smooth' });

  return (
    <section className="section-padding bg-dark-300 relative overflow-hidden">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2
                      w-[800px] h-[400px] rounded-full
                      bg-brand-600/8 blur-[150px] pointer-events-none" />

      <div className="max-w-7xl mx-auto relative z-10">
        <div className="flex items-end justify-between mb-12">
          <SectionHeader
            badge="Customer Love"
            title="What Our"
            highlight="Customers Say"
            subtitle="Real reviews from verified buyers who trust NEXUS."
            center={false}
          />
          <div className="hidden md:flex gap-2">
            <button onClick={() => scroll(-1)}
                    className="w-10 h-10 rounded-full glass border border-white/10
                               hover:border-brand-500/40 flex items-center justify-center
                               transition-all duration-300">
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button onClick={() => scroll(1)}
                    className="w-10 h-10 rounded-full glass border border-white/10
                               hover:border-brand-500/40 flex items-center justify-center
                               transition-all duration-300">
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div ref={ref}
             className="flex gap-4 overflow-x-auto pb-4"
             style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
          {[...reviews, ...reviews].map((r, i) => (
            <motion.div
              key={`${r.id}-${i}`}
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.05 }}
            >
              <ReviewCard review={r} />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Reviews;
