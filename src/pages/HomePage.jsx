import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, Headphones, Sparkles, Truck } from 'lucide-react';
import HeroSection from '../components/HeroSection';
import ProductGrid from '../components/ProductGrid';
import SectionHeader from '../components/SectionHeader';
import WhyChooseUs from '../components/WhyChooseUs';
import Reviews from '../components/Reviews';
import CTASection from '../components/CTASection';
import { EmptyState, PageError, PageLoader } from '../components/PageFeedback';
import { useCatalogData } from '../hooks/useCatalog';
import { formatPrice } from '../utils/priceHelpers';

const FALLBACK_PRODUCT_IMAGE = 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=1200&q=80';

const HomePage = ({ addToCart }) => {
  const { sections, products, loading, error } = useCatalogData();
  const latestProducts = products.slice(0, 8);
  const topSections = sections.slice(0, 6);
  const productsWithImages = products.filter((product) => product.imageUrl);
  const heroProduct = productsWithImages[0] || products[0] || null;
  const spotlightOffers = (productsWithImages.length > 0 ? productsWithImages : products).slice(0, 3);
  const leadOffer = spotlightOffers[0] || null;
  const secondaryOffers = spotlightOffers.slice(1, 3);

  if (loading) {
    return (
      <main className="page-shell">
        <div id="home" className="scroll-mt-32">
          <HeroSection />
        </div>
        <section className="px-4 pb-24 md:px-8 lg:px-16">
          <div className="mx-auto max-w-7xl">
            <PageLoader title="Loading storefront" subtitle="Fetching categories and products from the live backend." />
          </div>
        </section>
      </main>
    );
  }

  if (error) {
    return (
      <main className="page-shell">
        <div id="home" className="scroll-mt-32">
          <HeroSection />
        </div>
        <section className="px-4 pb-24 md:px-8 lg:px-16">
          <div className="mx-auto max-w-7xl">
            <PageError title="Storefront unavailable" message={error} />
          </div>
        </section>
      </main>
    );
  }

  return (
    <main className="bg-[radial-gradient(circle_at_84%_10%,rgba(86,166,255,0.1),transparent_20%),radial-gradient(circle_at_12%_16%,rgba(255,255,255,0.8),transparent_18%),linear-gradient(180deg,#f5f7fb_0%,#eef2f8_52%,#e6ecf4_100%)] text-[#17110d]">
      <div id="home" className="scroll-mt-32">
        <HeroSection featuredProduct={heroProduct} />
      </div>

      <section id="categories" className="section-padding scroll-mt-32 pb-0">
        <div className="mx-auto max-w-7xl">
          <SectionHeader
            badge="Live categories"
            title="Browse the"
            highlight="Store"
            subtitle="Sections are now loaded from the backend, so every admin update is reflected directly in the customer catalog."
          />

          {topSections.length === 0 ? (
            <EmptyState
              title="No sections published yet"
              message="Once the admin creates sections and assigns products, they will show up here automatically."
            />
          ) : (
            <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
              {topSections.map((section, index) => (
                <Link
                  key={section.id}
                  to={`/category/${section.slug}`}
                  className="group overflow-hidden rounded-[2rem] border border-slate-200/70 bg-white/82 shadow-[0_24px_58px_rgba(15,23,42,0.08)] transition-all duration-500 hover:-translate-y-1.5 hover:border-[#56a6ff]/20 hover:shadow-[0_28px_62px_rgba(15,23,42,0.12),0_0_28px_rgba(86,166,255,0.08)]"
                >
                  <div className="relative h-60 overflow-hidden">
                    <img
                      src={section.image}
                      alt={section.name}
                      loading={index < 2 ? 'eager' : 'lazy'}
                      decoding="async"
                      className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(23,17,13,0.05)_0%,rgba(23,17,13,0.45)_100%)]" />
                    <div className="absolute left-5 top-5 rounded-full bg-white/88 px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.24em] text-[#17110d]">
                      {section.count} products
                    </div>
                  </div>

                  <div className="p-6">
                    <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-brand-600">Store section</p>
                    <h3 className="mt-3 font-display text-4xl text-[#17110d]">{section.name}</h3>
                    <p className="mt-3 text-sm leading-relaxed text-[#5f554b]">{section.description}</p>
                    <div className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-brand-700">
                      Explore section
                      <ArrowRight className="h-4 w-4" />
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>

      <section id="products" className="section-padding scroll-mt-32">
        <div className="mx-auto max-w-7xl">
          <SectionHeader
            badge="New in catalog"
            title="Latest"
            highlight="Arrivals"
            subtitle="These products are read directly from the backend product table and stay in sync with the admin panel."
          />
          {latestProducts.length === 0 ? (
            <EmptyState
              title="No products live yet"
              message="The storefront will start populating as soon as products are created from the admin panel."
            />
          ) : (
            <ProductGrid products={latestProducts} initialCount={8} addToCart={addToCart} />
          )}
        </div>
      </section>

      <section id="offers" className="section-padding scroll-mt-32 pt-0">
        <div className="mx-auto max-w-7xl">
          <div className="mb-14 grid gap-6 lg:grid-cols-[minmax(0,1fr)_320px] lg:items-end">
            <SectionHeader
              badge="Private offers"
              title="Current"
              highlight="Highlights"
              subtitle="A premium, live-data preview that keeps pricing and product imagery tied to the same backend-backed catalog powering the rest of the storefront."
              center={false}
              tone="light"
            />

            <motion.div
              initial={{ opacity: 0, x: 24 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="anchor-panel p-6"
            >
              <div className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.32em] text-brand-300">
                <Sparkles className="h-4 w-4" />
                Members&apos; edit
              </div>
              <div className="mt-5 space-y-4">
                <div className="flex items-center justify-between rounded-[1.3rem] border border-white/12 bg-white/8 px-4 py-4 text-sm">
                  <span className="text-white/62">Live spotlight products</span>
                  <span className="font-semibold text-white">{spotlightOffers.length}</span>
                </div>
                <div className="flex items-start gap-3 rounded-[1.3rem] border border-brand-300/18 bg-brand-300/10 px-4 py-4 text-sm leading-relaxed text-white/70">
                  <Truck className="mt-0.5 h-4 w-4 text-brand-300" />
                  Priority dispatch, calmer packaging cues, and early access messaging keep the experience closer to concierge retail than flash-sale noise.
                </div>
              </div>
            </motion.div>
          </div>

          {leadOffer ? (
            <div className="grid gap-5 lg:grid-cols-[minmax(0,1.08fr)_minmax(320px,0.92fr)]">
              <motion.article
                initial={{ opacity: 0, y: 28 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="overflow-hidden rounded-[2.2rem] border border-white/10 bg-[#17110d] text-[#f8f3eb] shadow-anchor"
              >
                <div className="grid gap-0 md:grid-cols-[0.94fr,1.06fr]">
                  <div className="relative min-h-[20rem] overflow-hidden">
                        <img
                          src={leadOffer.imageUrl || FALLBACK_PRODUCT_IMAGE}
                          alt={leadOffer.name}
                          decoding="async"
                          fetchpriority="high"
                          className="h-full w-full object-cover"
                        />
                    <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(23,17,13,0.08)_0%,rgba(23,17,13,0.52)_100%)]" />
                  </div>

                  <div className="p-6 md:p-8">
                    <span className="inline-flex rounded-full border border-brand-300/18 bg-brand-300/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.24em] text-brand-300">
                      {leadOffer.sectionName}
                    </span>
                    <h3 className="mt-4 font-display text-4xl leading-none md:text-[2.8rem]">
                      {leadOffer.name}
                    </h3>
                    <p className="mt-4 text-sm leading-relaxed text-white/66 md:text-base">
                      {leadOffer.description}
                    </p>

                    <div className="mt-6 flex flex-wrap items-center gap-3">
                      <span className="text-2xl font-semibold text-white">
                        {formatPrice(leadOffer.price)}
                      </span>
                      <span className="rounded-full border border-white/12 bg-white/8 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-white/70">
                        Atelier spotlight
                      </span>
                    </div>

                    <Link
                      to="/offers"
                      className="mt-8 inline-flex items-center gap-2 rounded-full border border-white/14 bg-white/8 px-5 py-3 text-sm font-semibold text-white transition-all duration-300 hover:-translate-y-0.5 hover:scale-[1.02] hover:border-[#7dd3fc]/36 hover:bg-white/12 hover:shadow-[0_0_24px_rgba(86,166,255,0.18)]"
                    >
                      Open offers page
                      <ArrowRight className="h-4 w-4" />
                    </Link>
                  </div>
                </div>
              </motion.article>

              <div className="grid gap-4">
                <motion.div
                  initial={{ opacity: 0, y: 28 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.08 }}
                  className="page-panel p-6"
                >
                  <div className="flex items-center gap-3">
                    <div className="flex h-12 w-12 items-center justify-center rounded-[1rem] bg-brand-50 text-brand-600">
                      <Headphones className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-brand-600">Luxury assistance</p>
                      <p className="mt-1 text-lg font-semibold text-[#17110d]">Personal help, faster</p>
                    </div>
                  </div>
                  <p className="mt-4 text-sm leading-relaxed text-[#5f554b]">
                    Cleaner offer messaging, faster dispatch cues, and guided discovery make the promotional layer feel elevated instead of loud.
                  </p>
                </motion.div>

                {secondaryOffers.map((product, index) => (
                  <motion.div
                    key={product.id}
                    initial={{ opacity: 0, y: 28 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.12 + index * 0.08 }}
                  >
                    <Link
                      to={`/product/${product.id}`}
                      className="flex items-center gap-4 rounded-[1.6rem] border border-slate-200/70 bg-white/82 p-4 shadow-[0_20px_42px_rgba(15,23,42,0.08)] transition-all duration-300 hover:-translate-y-1 hover:border-[#56a6ff]/20 hover:shadow-[0_24px_54px_rgba(15,23,42,0.12),0_0_28px_rgba(86,166,255,0.08)]"
                    >
                      <div className="h-24 w-24 flex-none overflow-hidden rounded-[1.2rem] bg-[#ede2d4]">
                        <img
                          src={product.imageUrl || FALLBACK_PRODUCT_IMAGE}
                          alt={product.name}
                          loading="lazy"
                          decoding="async"
                          className="h-full w-full object-cover"
                        />
                      </div>

                      <div className="min-w-0">
                        <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-brand-600">
                          {product.sectionName}
                        </p>
                        <h4 className="mt-2 line-clamp-2 font-display text-[2rem] leading-[0.96] text-[#17110d]">
                          {product.name}
                        </h4>
                        <div className="mt-3 flex items-center gap-3 text-sm">
                          <span className="font-semibold text-[#17110d]">{formatPrice(product.price)}</span>
                          <span className="text-[#7d6f63]">Ready for quick dispatch</span>
                        </div>
                      </div>
                    </Link>
                  </motion.div>
                ))}
              </div>
            </div>
          ) : (
            <EmptyState
              title="No live highlights yet"
              message="Add a few products in the admin panel and this premium offer rail will populate automatically."
            />
          )}
        </div>
      </section>

      <div id="reviews" className="scroll-mt-32">
        <Reviews />
      </div>
      <div id="about" className="scroll-mt-32">
        <WhyChooseUs />
      </div>
      <div id="contact" className="scroll-mt-32">
        <CTASection />
      </div>
    </main>
  );
};

export default HomePage;
