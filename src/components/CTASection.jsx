import { useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight, Bell } from 'lucide-react';

const CTASection = () => {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubmit = (event) => {
    event.preventDefault();
    if (email) {
      setSubscribed(true);
      setEmail('');
    }
  };

  return (
    <section className="section-padding relative overflow-hidden bg-[#17110d] text-[#f8f3eb]">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(220,195,154,0.2),transparent_25%),linear-gradient(180deg,#17110d_0%,#0f0a07_100%)]" />

      <div className="relative z-10 mx-auto max-w-4xl text-center">
        <motion.div
          initial={{ opacity: 0, y: 28 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="overflow-hidden rounded-[2.3rem] border border-white/10 bg-white/6 p-10 shadow-[0_28px_72px_rgba(0,0,0,0.18)] md:p-16"
        >
          <div className="mb-8 inline-flex items-center gap-2 rounded-full border border-brand-300/20 bg-brand-300/10 px-4 py-2 text-sm font-semibold text-brand-300">
            <Bell className="h-4 w-4" />
            Private access to new drops
          </div>

          <h2 className="font-display text-4xl leading-none md:text-6xl">
            Stay ahead with a quieter kind of advantage.
          </h2>
          <p className="mx-auto mt-5 max-w-2xl text-base leading-relaxed text-white/64 md:text-lg">
            Join the Gadget69 list for early releases, tighter flash-deal alerts, and
            recommendations curated with the same premium restraint as the storefront itself.
          </p>

          {subscribed ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.94 }}
              animate={{ opacity: 1, scale: 1 }}
              className="mx-auto mt-10 max-w-md rounded-[1.5rem] border border-brand-300/20 bg-brand-300/10 px-8 py-5 text-lg font-semibold text-brand-300"
            >
              You are in. Welcome to private access.
            </motion.div>
          ) : (
            <form onSubmit={handleSubmit} className="mx-auto mt-10 flex max-w-xl flex-col gap-3 sm:flex-row">
              <input
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                placeholder="Enter your email address"
                className="flex-1 rounded-full border border-white/12 bg-white/10 px-5 py-3.5 text-sm text-white placeholder:text-white/32 focus:border-brand-300/40 focus:outline-none"
              />
              <button
                type="submit"
                className="inline-flex items-center justify-center gap-2 rounded-full bg-[#f8f3eb] px-6 py-3.5 text-sm font-semibold text-[#17110d] transition-all duration-300 hover:-translate-y-0.5"
              >
                Subscribe
                <ArrowRight className="h-4 w-4" />
              </button>
            </form>
          )}

          <div className="mt-8">
            <Link to="/products" className="inline-flex items-center gap-2 text-sm font-semibold text-brand-300">
              Browse the collection
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default CTASection;
