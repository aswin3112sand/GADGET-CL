import { motion } from 'framer-motion';
import { Award, Package, Star, Users } from 'lucide-react';
import SectionHeader from '../components/SectionHeader';

const stats = [
  { icon: Users, val: '50K+', label: 'Happy Customers' },
  { icon: Package, val: '400+', label: 'Products' },
  { icon: Star, val: '4.9', label: 'Average Rating' },
  { icon: Award, val: '8', label: 'Categories' },
];

const AboutPage = () => (
  <main className="page-shell">
    <section className="section-padding">
      <div className="mx-auto max-w-6xl">
        <SectionHeader
          badge="Our Story"
          title="Built for the"
          highlight="Tech Obsessed"
          subtitle="Gadget69 was shaped around a simple idea: premium technology should feel thoughtful before it even reaches checkout."
          tone="light"
        />

        <div className="mb-16 grid grid-cols-2 gap-5 md:grid-cols-4">
          {stats.map(({ icon: Icon, val, label }, index) => (
            <motion.div
              key={label}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.08 }}
              className="page-panel p-6 text-center"
            >
              <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-brand-50 text-brand-600">
                <Icon className="h-5 w-5" />
              </div>
              <div className="mb-1 font-display text-3xl text-[#17110d]">{val}</div>
              <div className="text-sm text-[#6d635a]">{label}</div>
            </motion.div>
          ))}
        </div>

        <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_320px]">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="page-panel p-8 md:p-10"
          >
            <h2 className="font-display text-4xl text-[#17110d]">Our Mission</h2>
            <p className="mt-4 leading-relaxed text-[#5f554b]">
              At Gadget69, we curate only the finest tech gadgets from around the world.
              Every product in our catalog is hand-tested and reviewed by a team that cares
              about quality, presentation, and everyday usefulness.
            </p>
            <p className="mt-5 leading-relaxed text-[#5f554b]">
              Founded in Chennai, Tamil Nadu, Gadget69 now serves customers across India with
              a catalog spanning eight premium categories and more than four hundred products.
              The goal is simple: make modern electronics feel more considered, trustworthy,
              and exciting to bring home.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 24 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="anchor-panel p-6"
          >
            <p className="text-[11px] font-semibold uppercase tracking-[0.32em] text-brand-300">
              What matters
            </p>
            <ul className="mt-5 space-y-4 text-sm leading-relaxed text-white/68">
              <li>Premium curation over noisy catalogs.</li>
              <li>Clear product context instead of flashy distraction.</li>
              <li>Packaging, support, and browsing that feel equally polished.</li>
            </ul>
          </motion.div>
        </div>
      </div>
    </section>
  </main>
);

export default AboutPage;
