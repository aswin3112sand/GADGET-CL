import { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, Phone, MapPin, Send, CheckCircle } from 'lucide-react';
import SectionHeader from '../components/SectionHeader';

const ContactPage = () => {
  const [form, setForm] = useState({ name: '', email: '', message: '' });
  const [sent, setSent] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (form.name && form.email && form.message) setSent(true);
  };

  return (
    <main className="min-h-screen bg-dark-400 pt-24">
      <section className="section-padding">
        <div className="max-w-5xl mx-auto">
          <SectionHeader
            badge="Get in Touch"
            title="Contact"
            highlight="Us"
            subtitle="Have a question or feedback? We'd love to hear from you."
          />

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
            {/* Contact Info */}
            <div className="space-y-5">
              {[
                { icon: Mail,    label: 'Email',    val: 'support@nexusgadgets.com' },
                { icon: Phone,   label: 'Phone',    val: '+91 9876 543 210' },
                { icon: MapPin,  label: 'Address',  val: 'Chennai, Tamil Nadu, India' },
              ].map(({ icon: Icon, label, val }) => (
                <motion.div
                  key={label}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  className="flex items-center gap-4 glass rounded-2xl p-5 border border-white/5"
                >
                  <div className="w-12 h-12 rounded-xl bg-brand-500/10 border border-brand-500/20
                                  flex items-center justify-center flex-none">
                    <Icon className="w-5 h-5 text-brand-400" />
                  </div>
                  <div>
                    <p className="text-white/40 text-xs font-semibold uppercase tracking-wider">{label}</p>
                    <p className="text-white font-medium">{val}</p>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Form */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="glass rounded-3xl p-8 border border-white/5"
            >
              {sent ? (
                <div className="flex flex-col items-center justify-center h-full gap-4 py-12 text-center">
                  <CheckCircle className="w-16 h-16 text-emerald-400" />
                  <h3 className="font-display text-2xl font-bold text-white">Message Sent!</h3>
                  <p className="text-white/50">We'll get back to you within 24 hours.</p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  {[
                    { key: 'name',    label: 'Your Name',    type: 'text',  placeholder: 'Arjun Mehta' },
                    { key: 'email',   label: 'Email Address', type: 'email', placeholder: 'arjun@example.com' },
                  ].map(({ key, label, type, placeholder }) => (
                    <div key={key}>
                      <label className="text-white/60 text-sm font-medium mb-2 block">{label}</label>
                      <input
                        type={type}
                        value={form[key]}
                        onChange={(e) => setForm(f => ({ ...f, [key]: e.target.value }))}
                        placeholder={placeholder}
                        className="w-full px-4 py-3 rounded-xl glass border border-white/10
                                   text-white placeholder-white/30 text-sm
                                   focus:outline-none focus:border-brand-500/50 transition-all"
                      />
                    </div>
                  ))}
                  <div>
                    <label className="text-white/60 text-sm font-medium mb-2 block">Message</label>
                    <textarea
                      rows={5}
                      value={form.message}
                      onChange={(e) => setForm(f => ({ ...f, message: e.target.value }))}
                      placeholder="Tell us how we can help..."
                      className="w-full px-4 py-3 rounded-xl glass border border-white/10
                                 text-white placeholder-white/30 text-sm resize-none
                                 focus:outline-none focus:border-brand-500/50 transition-all"
                    />
                  </div>
                  <button type="submit"
                          className="w-full btn-primary flex items-center justify-center gap-2 py-3.5">
                    <Send className="w-4 h-4" />
                    Send Message
                  </button>
                </form>
              )}
            </motion.div>
          </div>
        </div>
      </section>
    </main>
  );
};

export default ContactPage;
