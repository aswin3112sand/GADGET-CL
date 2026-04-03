import { motion } from 'framer-motion';

const SectionHeader = ({ badge, title, highlight, subtitle, center = true }) => (
  <motion.div
    initial={{ opacity: 0, y: 30 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ duration: 0.6 }}
    className={`mb-12 ${center ? 'text-center' : ''}`}
  >
    {badge && (
      <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full
                       text-xs font-semibold tracking-widest uppercase
                       bg-brand-500/10 border border-brand-500/30 text-brand-400 mb-4">
        <span className="w-1.5 h-1.5 rounded-full bg-brand-400 animate-pulse" />
        {badge}
      </span>
    )}
    <h2 className="font-display text-3xl md:text-4xl lg:text-5xl font-bold text-white leading-tight mb-4">
      {title}{' '}
      {highlight && <span className="gradient-text">{highlight}</span>}
    </h2>
    {subtitle && (
      <p className={`text-white/50 text-base md:text-lg max-w-2xl leading-relaxed ${center ? 'mx-auto' : ''}`}>
        {subtitle}
      </p>
    )}
  </motion.div>
);

export default SectionHeader;
