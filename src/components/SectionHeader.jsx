import { motion } from 'framer-motion';

const SectionHeader = ({
  badge,
  title,
  highlight,
  subtitle,
  center = true,
  tone = 'light',
  size = 'default',
  className = '',
}) => {
  const isDark = tone === 'dark';
  const titleSizes = {
    compact: 'text-3xl md:text-4xl lg:text-5xl',
    default: 'text-4xl md:text-5xl lg:text-[3.85rem]',
    display: 'text-5xl md:text-6xl lg:text-[4.75rem]',
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 0.55 }}
      className={`mb-12 ${center ? 'text-center' : ''} ${className}`}
    >
      {badge && (
        <span
          className={`mb-5 ${isDark ? 'luxury-pill-dark' : 'luxury-pill'}`}
        >
          <span className={`h-1.5 w-1.5 rounded-full ${isDark ? 'bg-brand-300' : 'bg-brand-500'}`} />
          {badge}
        </span>
      )}

      <h2
        className={`font-display font-semibold leading-[0.9] tracking-[0.02em] ${
          titleSizes[size] || titleSizes.default
        } ${
          isDark ? 'text-[#f8f3eb]' : 'text-[#17110d]'
        }`}
      >
        {title}{' '}
        {highlight && (
          <span className={isDark ? 'text-brand-300' : 'gradient-text'}>
            {highlight}
          </span>
        )}
      </h2>

      {subtitle && (
        <p
          className={`mt-5 max-w-2xl text-base leading-relaxed md:text-lg ${
            center ? 'mx-auto' : ''
          } ${isDark ? 'text-white/62' : 'text-[#5f5246]'}`}
        >
          {subtitle}
        </p>
      )}
    </motion.div>
  );
};

export default SectionHeader;
