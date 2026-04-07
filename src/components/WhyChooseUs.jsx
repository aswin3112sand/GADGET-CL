import { motion } from 'framer-motion';
import { Headphones, RotateCcw, Shield, Sparkles, Star, Truck } from 'lucide-react';
import SectionHeader from './SectionHeader';

const features = [
  {
    icon: Shield,
    title: 'Genuine Products',
    desc: 'Every device is sourced from trusted channels with authenticity and packaging standards intact.',
  },
  {
    icon: Truck,
    title: 'Fast Delivery',
    desc: 'Priority dispatch and careful handling keep the experience feeling elevated from purchase to arrival.',
  },
  {
    icon: RotateCcw,
    title: 'Easy Returns',
    desc: 'A cleaner service promise with simpler returns, clearer expectations, and less checkout friction.',
  },
  {
    icon: Headphones,
    title: 'Real Support',
    desc: 'Talk to people who know the products, not scripts that slow down the buying journey.',
  },
  {
    icon: Star,
    title: 'Curated Quality',
    desc: 'The catalog favors high-performing pieces with strong design, useful features, and lasting value.',
  },
  {
    icon: Sparkles,
    title: 'Premium Presentation',
    desc: 'From visuals to content hierarchy, every touchpoint is tuned to feel quieter, sharper, and more premium.',
  },
];

const WhyChooseUs = () => (
  <section className="section-padding relative overflow-hidden bg-transparent">
    <div className="mx-auto max-w-7xl">
      <SectionHeader
        badge="Why Gadget69"
        title="A Premium Experience,"
        highlight="Handled with Care"
        subtitle="Premium visuals mean more when the service, shipping, and support cues feel equally deliberate."
        tone="light"
      />

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {features.map(({ icon: Icon, title, desc }, index) => (
          <motion.div
            key={title}
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.06 }}
          >
            <motion.div
              whileHover={{ y: -6 }}
              transition={{ type: 'spring', stiffness: 300, damping: 24 }}
              className="h-full rounded-[2rem] border border-[rgba(34,24,17,0.08)] bg-[linear-gradient(180deg,rgba(255,252,247,0.88)_0%,rgba(252,246,239,0.76)_100%)] p-7 shadow-[0_22px_44px_rgba(23,17,13,0.06)]"
            >
              <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-[1.3rem] bg-brand-50 text-brand-600 shadow-[0_14px_28px_rgba(184,139,74,0.12)]">
                <Icon className="h-6 w-6" />
              </div>
              <h3 className="font-display text-3xl text-[#17110d]">{title}</h3>
              <p className="mt-3 text-sm leading-relaxed text-[#5f554b]">{desc}</p>
            </motion.div>
          </motion.div>
        ))}
      </div>
    </div>
  </section>
);

export default WhyChooseUs;
