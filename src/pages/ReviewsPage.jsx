import { motion } from 'framer-motion';
import SectionHeader from '../components/SectionHeader';
import ReviewCard from '../components/ReviewCard';
import { reviews } from '../data/mockData';

const ReviewsPage = () => (
  <main className="min-h-screen bg-dark-400 pt-24">
    <section className="section-padding">
      <div className="max-w-7xl mx-auto">
        <SectionHeader
          badge="Customer Love"
          title="What Our"
          highlight="Customers Say"
          subtitle="Real verified reviews from our 50,000+ happy customers across India."
        />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {[...reviews, ...reviews].map((r, i) => (
            <motion.div
              key={`${r.id}-${i}`}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: (i % 6) * 0.1 }}
              className="w-full"
            >
              <div className="glass rounded-3xl p-6 border border-white/5
                              hover:border-brand-500/20 transition-all duration-300
                              hover:-translate-y-1">
                <div className="flex gap-0.5 mb-4">
                  {Array.from({ length: 5 }, (_, j) => (
                    <span key={j} className={`text-lg ${j < r.rating ? 'text-amber-400' : 'text-white/20'}`}>★</span>
                  ))}
                </div>
                <p className="text-white/70 text-sm leading-relaxed mb-5">"{r.review}"</p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-brand-500 to-neon-blue
                                  flex items-center justify-center text-white text-sm font-bold flex-none">
                    {r.avatar}
                  </div>
                  <div>
                    <div className="text-white font-semibold text-sm">{r.name}</div>
                    <div className="text-white/40 text-xs">{r.product} · {r.date}</div>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  </main>
);

export default ReviewsPage;
