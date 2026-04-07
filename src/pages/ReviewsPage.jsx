import { motion } from 'framer-motion';
import { MessageSquareQuote, Star } from 'lucide-react';
import SectionHeader from '../components/SectionHeader';
import ReviewCard from '../components/ReviewCard';
import { reviews } from '../data/mockData';

const featuredReviews = [...reviews, ...reviews.slice(0, 2)];

const ReviewsPage = () => (
  <main className="page-shell">
    <section className="section-padding">
      <div className="mx-auto max-w-7xl">
        <div className="mb-14 grid gap-6 lg:grid-cols-[minmax(0,1fr)_360px] lg:items-end">
          <SectionHeader
            badge="Customer Love"
            title="What Our"
            highlight="Customers Say"
            subtitle="Verified feedback presented with cleaner surfaces, calmer cards, and a more premium reading rhythm."
            center={false}
            tone="light"
          />

          <motion.div
            initial={{ opacity: 0, x: 24 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="anchor-panel p-6"
          >
            <div className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.32em] text-brand-300">
              <MessageSquareQuote className="h-4 w-4" />
              Trust signal
            </div>
            <div className="mt-6 grid grid-cols-2 gap-5">
              <div>
                <div className="font-display text-4xl text-white">4.9</div>
                <p className="mt-1 text-sm text-white/58">Average rating</p>
              </div>
              <div>
                <div className="mb-1 flex items-center gap-1 text-brand-300">
                  <Star className="h-4 w-4 fill-brand-300 text-brand-300" />
                  <span className="font-display text-4xl">50K+</span>
                </div>
                <p className="text-sm text-white/58">Trusted shoppers</p>
              </div>
            </div>
          </motion.div>
        </div>

        <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
          {featuredReviews.map((review, index) => (
            <motion.div
              key={`${review.id}-${index}`}
              initial={{ opacity: 0, y: 28 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: (index % 6) * 0.06 }}
            >
              <ReviewCard review={review} className="h-full w-full" />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  </main>
);

export default ReviewsPage;
