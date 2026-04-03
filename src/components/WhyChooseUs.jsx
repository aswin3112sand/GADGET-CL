import { motion } from 'framer-motion';
import { Shield, Truck, RotateCcw, Headphones, Star, Zap } from 'lucide-react';
import SectionHeader from './SectionHeader';

const features = [
  { icon: Shield,      title: 'Genuine Products',   desc: '100% authentic gadgets sourced directly from authorized brand distributors.', color: 'from-blue-500 to-cyan-400',    glow: 'rgba(0,212,255,0.2)' },
  { icon: Truck,       title: 'Ultra-Fast Delivery', desc: 'Same-day shipping in major cities. Free delivery on all orders above ₹499.',  color: 'from-green-500 to-emerald-400', glow: 'rgba(16,185,129,0.2)' },
  { icon: RotateCcw,   title: '7-Day Returns',       desc: 'No questions asked returns within 7 days. Hassle-free refunds guaranteed.',    color: 'from-purple-500 to-violet-400', glow: 'rgba(139,92,246,0.2)' },
  { icon: Headphones,  title: '24/7 Expert Support', desc: 'Dedicated tech experts available round the clock via chat, call, or email.',   color: 'from-pink-500 to-rose-400',    glow: 'rgba(244,63,94,0.2)' },
  { icon: Star,        title: 'Curated Quality',     desc: 'Every product is handpicked, tested, and rated by our in-house tech team.',    color: 'from-amber-500 to-yellow-400', glow: 'rgba(245,158,11,0.2)' },
  { icon: Zap,         title: 'Smart Pricing',       desc: 'AI-powered price tracking ensures you always get the best possible deal.',     color: 'from-brand-500 to-indigo-400', glow: 'rgba(99,102,241,0.2)' },
];

const WhyChooseUs = () => (
  <section className="section-padding bg-dark-400 relative overflow-hidden">
    <div className="absolute inset-0 bg-mesh pointer-events-none opacity-50" />

    <div className="max-w-7xl mx-auto relative z-10">
      <SectionHeader
        badge="Why NEXUS"
        title="Premium Experience"
        highlight="Guaranteed"
        subtitle="We obsess over every detail so you can shop with absolute confidence."
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {features.map(({ icon: Icon, title, desc, color, glow }, i) => (
          <motion.div
            key={title}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.1 }}
          >
            <motion.div
              whileHover={{ y: -6 }}
              transition={{ type: 'spring', stiffness: 300, damping: 20 }}
              className="group glass rounded-3xl p-7 border border-white/5
                         hover:border-white/15 transition-all duration-500 h-full"
              onMouseEnter={(e) => { e.currentTarget.style.boxShadow = `0 20px 60px ${glow}`; }}
              onMouseLeave={(e) => { e.currentTarget.style.boxShadow = ''; }}
            >
              <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${color}
                               flex items-center justify-center mb-5
                               group-hover:scale-110 transition-transform duration-300`}
                   style={{ boxShadow: `0 8px 20px ${glow}` }}>
                <Icon className="w-7 h-7 text-white" />
              </div>
              <h3 className="font-display font-bold text-lg text-white mb-3">{title}</h3>
              <p className="text-white/50 text-sm leading-relaxed">{desc}</p>
            </motion.div>
          </motion.div>
        ))}
      </div>
    </div>
  </section>
);

export default WhyChooseUs;
