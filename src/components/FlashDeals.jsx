import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight, Clock, Sparkles } from 'lucide-react';
import { formatPrice } from '../utils/priceHelpers';
import { featuredProducts } from '../data/mockData';
import SectionHeader from './SectionHeader';

const FlashDeals = () => {
  const [time, setTime] = useState({ h: 5, m: 42, s: 30 });

  useEffect(() => {
    const timer = setInterval(() => {
      setTime((prev) => {
        let { h, m, s } = prev;
        if (s > 0) return { h, m, s: s - 1 };
        if (m > 0) return { h, m: m - 1, s: 59 };
        if (h > 0) return { h: h - 1, m: 59, s: 59 };
        return { h: 5, m: 59, s: 59 };
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const pad = (value) => String(value).padStart(2, '0');
  const deals = featuredProducts.filter((product) => product.discount >= 25).slice(0, 10);

  return (
    <section className="section-padding relative overflow-hidden bg-[#120d09] text-[#f8f3eb]">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(220,195,154,0.2),transparent_26%),radial-gradient(circle_at_85%_18%,rgba(255,255,255,0.06),transparent_20%),linear-gradient(180deg,#120d09_0%,#17110d_100%)]" />

      <div className="relative z-10 mx-auto max-w-7xl">
        <div className="mb-12 flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <SectionHeader
            badge="Flash Deals"
            title="Limited"
            highlight="Time Offers"
            subtitle="A darker anchor moment that preserves urgency without losing the calm, editorial tone of the wider luxury system."
            center={false}
            tone="dark"
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.94 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="flex flex-wrap items-center gap-3"
          >
            <div className="mr-2 flex items-center gap-2 text-sm text-white/64">
              <Clock className="h-4 w-4 text-brand-300" />
              Ends in
            </div>
            {[
              { label: 'HRS', value: time.h },
              { label: 'MIN', value: time.m },
              { label: 'SEC', value: time.s },
            ].map(({ label, value }) => (
              <div key={label} className="text-center">
                <div className="min-w-[4rem] rounded-[1.25rem] border border-white/10 bg-white/8 px-4 py-3 font-display text-3xl text-brand-300 shadow-[0_18px_40px_rgba(0,0,0,0.16)]">
                  {pad(value)}
                </div>
                <div className="mt-1 text-[11px] font-semibold tracking-[0.24em] text-white/34">
                  {label}
                </div>
              </div>
            ))}
          </motion.div>
        </div>

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">
          {deals.map((product, index) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, y: 28 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.08 }}
            >
              <Link to={`/product/${product.id}`}>
                <div className="group flex h-full gap-4 rounded-[2rem] border border-white/10 bg-white/6 p-5 transition-all duration-500 hover:-translate-y-1.5 hover:border-brand-300/35 hover:bg-white/10">
                  <div className="h-24 w-24 flex-none overflow-hidden rounded-[1.4rem] bg-white/8">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  </div>

                  <div className="min-w-0 flex-1">
                    <span className="text-[11px] font-semibold uppercase tracking-[0.24em] text-brand-300">
                      {product.brand}
                    </span>
                    <h4 className="mt-1 truncate text-base font-semibold text-[#f8f3eb]">
                      {product.name}
                    </h4>
                    <div className="mt-3 flex items-center gap-2">
                      <span className="font-bold text-white">
                        {formatPrice(product.offerPrice)}
                      </span>
                      <span className="text-xs text-white/30 line-through">
                        {formatPrice(product.price)}
                      </span>
                    </div>
                    <span className="mt-3 inline-flex items-center gap-1 rounded-full border border-brand-300/20 bg-brand-300/10 px-3 py-1 text-[11px] font-semibold text-brand-300">
                      <Sparkles className="h-3 w-3" />
                      {product.discount}% off
                    </span>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>

        <div className="mt-10 text-center">
          <Link to="/offers" className="btn-ghost inline-flex items-center gap-2 border-white/18 bg-white/8 text-white hover:bg-white/12">
            View All Flash Deals
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </section>
  );
};

export default FlashDeals;
