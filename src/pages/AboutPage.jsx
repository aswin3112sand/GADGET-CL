import { motion } from 'framer-motion';
import { Zap, Star, Users, Package, Award } from 'lucide-react';
import SectionHeader from '../components/SectionHeader';

const stats = [
  { icon: Users,   val: '50K+',  label: 'Happy Customers' },
  { icon: Package, val: '400+',  label: 'Products' },
  { icon: Star,    val: '4.9★',  label: 'Average Rating' },
  { icon: Award,   val: '8',     label: 'Categories' },
];

const AboutPage = () => (
  <main className="min-h-screen bg-dark-400 pt-24">
    <section className="section-padding">
      <div className="max-w-5xl mx-auto text-center">
        <SectionHeader
          badge="Our Story"
          title="Built for the"
          highlight="Tech Obsessed"
          subtitle="NEXUS was born from a simple belief — premium tech shouldn't be complicated to find."
        />

        <div className="grid grid-cols-2 md:grid-cols-4 gap-5 mb-16">
          {stats.map(({ icon: Icon, val, label }, i) => (
            <motion.div
              key={label}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="glass rounded-3xl p-6 text-center border border-white/5
                         hover:border-brand-500/20 transition-all duration-300"
            >
              <Icon className="w-6 h-6 text-brand-400 mx-auto mb-3" />
              <div className="font-display text-3xl font-black gradient-text-blue mb-1">{val}</div>
              <div className="text-white/50 text-sm">{label}</div>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="glass rounded-3xl p-10 border border-white/5 text-left"
        >
          <h2 className="font-display text-2xl font-bold text-white mb-4">Our Mission</h2>
          <p className="text-white/60 leading-relaxed mb-6">
            At NEXUS, we curate only the finest tech gadgets from around the world. 
            Every product in our catalog is hand-tested and verified by our team of 
            passionate tech enthusiasts. We believe technology should be accessible, 
            beautiful, and backed by exceptional service.
          </p>
          <p className="text-white/60 leading-relaxed">
            Founded in Chennai, Tamil Nadu, NEXUS has grown to serve over 50,000 customers 
            across India with a catalog spanning 8 premium categories and 400+ products. 
            We're not just a store — we're a community of people who love great technology.
          </p>
        </motion.div>
      </div>
    </section>
  </main>
);

export default AboutPage;
