import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight, Bell } from 'lucide-react';
import { useState } from 'react';

const CTASection = () => {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (email) { setSubscribed(true); setEmail(''); }
  };

  return (
    <section className="section-padding relative overflow-hidden"
             style={{ background: 'linear-gradient(135deg, #0f0524 0%, #0d0d1a 40%, #060318 100%)' }}>
      {/* Glow orbs */}
      <div className="absolute top-0 left-1/4 w-96 h-96 rounded-full
                      bg-brand-600/15 blur-[130px] pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-80 h-80 rounded-full
                      bg-neon-purple/12 blur-[110px] pointer-events-none" />

      <div className="max-w-3xl mx-auto text-center relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="glass rounded-3xl p-10 md:p-16 neon-border shadow-glass"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full
                          bg-brand-500/10 border border-brand-500/30 text-brand-400
                          text-sm font-semibold mb-8">
            <Bell className="w-4 h-4" />
            Get Exclusive Deals First
          </div>

          <h2 className="font-display text-3xl md:text-5xl font-black text-white mb-4 leading-tight">
            Don't Miss the
            <span className="gradient-text"> Next Drop</span>
          </h2>
          <p className="text-white/50 text-base md:text-lg mb-10 max-w-lg mx-auto">
            Join 50,000+ subscribers and get early access to flash deals,
            new product drops, and exclusive NEXUS member discounts.
          </p>

          {subscribed ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              className="px-8 py-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30
                         text-emerald-400 font-semibold text-lg"
            >
              ✓ You're in! Welcome to the NEXUS family.
            </motion.div>
          ) : (
            <form onSubmit={handleSubmit}
                  className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email address"
                className="flex-1 px-5 py-3.5 rounded-xl glass border border-white/10
                           text-white placeholder-white/30 text-sm
                           focus:outline-none focus:border-brand-500/50
                           transition-all duration-300"
              />
              <button type="submit"
                      className="btn-primary flex items-center justify-center gap-2
                                 whitespace-nowrap py-3.5">
                Subscribe
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          )}
        </motion.div>
      </div>
    </section>
  );
};

export default CTASection;
