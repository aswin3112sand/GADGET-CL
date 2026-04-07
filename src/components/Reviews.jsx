import { useRef } from 'react';
import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import SectionHeader from './SectionHeader';
import ReviewCard from './ReviewCard';
import { reviews } from '../data/mockData';

const Reviews = () => {
  const ref = useRef(null);

  const scroll = (direction) => {
    ref.current?.scrollBy({ left: direction * 350, behavior: 'smooth' });
  };

  return (
    <section className="section-padding relative overflow-hidden bg-[rgba(255,250,243,0.42)]">
      <div className="mx-auto max-w-7xl">
        <div className="mb-12 flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <SectionHeader
            badge="Customer Notes"
            title="What Buyers"
            highlight="Notice First"
            subtitle="Verified shopper feedback presented with cleaner pacing, softer surfaces, and a more premium reading rhythm."
            center={false}
            tone="light"
          />

          <div className="hidden gap-2 md:flex">
            <button onClick={() => scroll(-1)} className="slider-arrow" aria-label="Scroll reviews left">
              <ChevronLeft className="h-5 w-5" />
            </button>
            <button onClick={() => scroll(1)} className="slider-arrow" aria-label="Scroll reviews right">
              <ChevronRight className="h-5 w-5" />
            </button>
          </div>
        </div>

        <div ref={ref} className="hide-scrollbar flex gap-5 overflow-x-auto pb-4">
          {[...reviews, ...reviews].map((review, index) => (
            <motion.div
              key={`${review.id}-${index}`}
              initial={{ opacity: 0, x: 24 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.04 }}
            >
              <ReviewCard review={review} />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Reviews;
