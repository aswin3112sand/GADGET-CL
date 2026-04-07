import { useState } from 'react';
import { motion } from 'framer-motion';
import { CheckCircle, Mail, MapPin, Phone, Send } from 'lucide-react';
import SectionHeader from '../components/SectionHeader';

const ContactPage = () => {
  const [form, setForm] = useState({ name: '', email: '', message: '' });
  const [sent, setSent] = useState(false);

  const handleSubmit = (event) => {
    event.preventDefault();
    if (form.name && form.email && form.message) {
      setSent(true);
    }
  };

  return (
    <main className="page-shell">
      <section className="section-padding">
        <div className="mx-auto max-w-6xl">
          <SectionHeader
            badge="Get in Touch"
            title="Contact"
            highlight="Us"
            subtitle="Questions, order help, or premium product support. The Gadget69 team is here to help with the same care reflected in the storefront."
            tone="light"
          />

          <div className="grid grid-cols-1 gap-8 lg:grid-cols-[0.9fr_1.1fr]">
            <div className="space-y-5">
              <motion.div
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="anchor-panel p-6"
              >
                <p className="text-[11px] font-semibold uppercase tracking-[0.32em] text-brand-300">
                  Premium support
                </p>
                <p className="mt-4 text-sm leading-relaxed text-white/68">
                  Reach out for product advice, order updates, corporate gifting, or
                  post-purchase care.
                </p>
              </motion.div>

              {[
                { icon: Mail, label: 'Email', val: 'concierge@gadget69.in' },
                { icon: Phone, label: 'Phone', val: '+91 9876 543 210' },
                { icon: MapPin, label: 'Address', val: 'Chennai, Tamil Nadu, India' },
              ].map(({ icon: Icon, label, val }, index) => (
                <motion.div
                  key={label}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.06 }}
                  className="page-panel flex items-center gap-4 p-5"
                >
                  <div className="flex h-12 w-12 items-center justify-center rounded-[1rem] bg-brand-50 text-brand-600">
                    <Icon className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[#8a7f74]">
                      {label}
                    </p>
                    <p className="mt-1 font-medium text-[#17110d]">{val}</p>
                  </div>
                </motion.div>
              ))}
            </div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="page-panel p-8"
            >
              {sent ? (
                <div className="flex h-full flex-col items-center justify-center gap-4 py-16 text-center">
                  <div className="flex h-16 w-16 items-center justify-center rounded-full bg-brand-50 text-brand-600">
                    <CheckCircle className="h-8 w-8" />
                  </div>
                  <h3 className="font-display text-4xl text-[#17110d]">Message Sent</h3>
                  <p className="max-w-sm text-[#6d635a]">
                    We received your note and will get back to you within 24 hours.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  {[
                    {
                      key: 'name',
                      label: 'Your Name',
                      type: 'text',
                      placeholder: 'Arjun Mehta',
                    },
                    {
                      key: 'email',
                      label: 'Email Address',
                      type: 'email',
                      placeholder: 'arjun@example.com',
                    },
                  ].map(({ key, label, type, placeholder }) => (
                    <div key={key}>
                      <label className="mb-2 block text-sm font-medium text-[#5f554b]">
                        {label}
                      </label>
                      <input
                        type={type}
                        value={form[key]}
                        onChange={(event) =>
                          setForm((current) => ({ ...current, [key]: event.target.value }))
                        }
                        placeholder={placeholder}
                        className="field-input"
                      />
                    </div>
                  ))}

                  <div>
                    <label className="mb-2 block text-sm font-medium text-[#5f554b]">
                      Message
                    </label>
                    <textarea
                      rows={6}
                      value={form.message}
                      onChange={(event) =>
                        setForm((current) => ({ ...current, message: event.target.value }))
                      }
                      placeholder="Tell us how we can help..."
                      className="field-input resize-none"
                    />
                  </div>

                  <button
                    type="submit"
                    className="btn-primary flex w-full items-center justify-center gap-2 py-3.5"
                  >
                    <Send className="h-4 w-4" />
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
