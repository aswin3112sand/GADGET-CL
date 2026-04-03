import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Zap, Clock, ArrowRight } from 'lucide-react';
import { formatPrice } from '../utils/priceHelpers';
import { featuredProducts } from '../data/mockData';
import SectionHeader from './SectionHeader';

const FlashDeals = () => {
  const [time, setTime] = useState({ h: 5, m: 42, s: 30 });

  useEffect(() => {
    const t = setInterval(() => {
      setTime(prev => {
        let { h, m, s } = prev;
        if (s > 0) return { h, m, s: s - 1 };
        if (m > 0) return { h, m: m - 1, s: 59 };
        if (h > 0) return { h: h - 1, m: 59, s: 59 };
        return { h: 5, m: 59, s: 59 };
      });
    }, 1000);
    return () => clearInterval(t);
  }, []);

  const pad = (n) => String(n).padStart(2, '0');

  const deals = featuredProducts.filter(p => p.discount >= 25).slice(0, 6);

  return (
    <section className="section-padding relative overflow-hidden"
             style={{ background: 'linear-gradient(135deg, #0d0d1a 0%, #1a0a2e 50%, #0d0d1a 100%)' }}>
      {/* Neon glow blobs */}
      <div className="absolute top-0 right-0 w-96 h-96 rounded-full
                      bg-neon-purple/10 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-96 h-96 rounded-full
                      bg-neon-pink/8 blur-[100px] pointer-events-none" />

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Header row */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
          <SectionHeader
            badge="⚡ Flash Deals"
            title="Limited"
            highlight="Time Offers"
            subtitle="Massive discounts. Ends when stock runs out."
            center={false}
          />

          {/* Countdown */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="flex items-center gap-3"
          >
            <div className="flex items-center gap-1 text-white/60 text-sm mr-2">
              <Clock className="w-4 h-4" />
              Ends in
            </div>
            {[{ label: 'HRS', val: time.h }, { label: 'MIN', val: time.m }, { label: 'SEC', val: time.s }]
              .map(({ label, val }) => (
                <div key={label} className="text-center">
                  <div className="glass rounded-xl px-4 py-3 neon-border min-w-[3.5rem]
                                  text-center font-display font-black text-2xl text-white
                                  shadow-neon-purple">
                    {pad(val)}
                  </div>
                  <div className="text-white/30 text-xs mt-1 font-semibold">{label}</div>
                </div>
              ))}
          </motion.div>
        </div>

        {/* Deal Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {deals.map((product, i) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
            >
              <Link to={`/product/${product.id}`}>
                <div className="group glass rounded-3xl p-5 border border-white/5
                                hover:border-neon-purple/30 transition-all duration-500
                                hover:-translate-y-2 hover:shadow-neon-purple cursor-pointer
                                flex gap-4 items-center">
                  <div className="w-24 h-24 rounded-2xl overflow-hidden flex-none bg-white/5">
                    <img src={product.image} alt={product.name}
                         className="w-full h-full object-cover
                                    group-hover:scale-110 transition-transform duration-500" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <span className="text-brand-400 text-xs font-semibold">{product.brand}</span>
                    <h4 className="text-white font-bold text-sm leading-snug truncate mt-0.5">
                      {product.name}
                    </h4>
                    <div className="flex items-center gap-2 mt-2">
                      <span className="text-white font-bold">{formatPrice(product.offerPrice)}</span>
                      <span className="text-white/30 text-xs line-through">{formatPrice(product.price)}</span>
                    </div>
                    <div className="flex items-center gap-1.5 mt-2">
                      <span className="flex items-center gap-1 px-2 py-0.5 rounded-md
                                       bg-rose-500/10 text-rose-400 border border-rose-500/20
                                       text-xs font-bold">
                        <Zap className="w-2.5 h-2.5" />
                        -{product.discount}% OFF
                      </span>
                    </div>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>

        <div className="text-center mt-10">
          <Link to="/offers" className="btn-primary inline-flex items-center gap-2">
            View All Flash Deals
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </section>
  );
};

export default FlashDeals;
