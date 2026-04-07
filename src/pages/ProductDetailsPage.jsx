import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  ArrowLeft,
  Heart,
  Minus,
  Package,
  Plus,
  Shield,
  ShoppingCart,
  Truck,
  Video,
} from 'lucide-react';
import { PageError, PageLoader } from '../components/PageFeedback';
import ProductMediaGallery from '../components/ProductMediaGallery';
import { useProductDetails } from '../hooks/useCatalog';
import { clampQuantityToStock, getNumericStock, getStockLabel, isLowStock, isOutOfStock } from '../utils/inventory';
import { slugifySectionName } from '../utils/catalog';
import { formatPrice } from '../utils/priceHelpers';
import { getMediaCounts, normalizeProductMediaList } from '../utils/productMedia';

const FALLBACK_IMAGE = 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=1400&q=80';

const ProductDetailsPage = ({ addToCart }) => {
  const { id } = useParams();
  const { product, loading, error } = useProductDetails(id);
  const [qty, setQty] = useState(1);
  const [wishlisted, setWishlisted] = useState(false);
  const [added, setAdded] = useState(false);
  const stockQuantity = getNumericStock(product?.stockQuantity);
  const soldOut = isOutOfStock(stockQuantity);
  const lowStock = isLowStock(stockQuantity);
  const mediaList = normalizeProductMediaList(product);
  const mediaCounts = getMediaCounts(mediaList);

  useEffect(() => {
    setQty(1);
    setAdded(false);
  }, [id]);

  if (loading) {
    return (
      <main className="page-shell px-4 py-28 md:px-8 lg:px-16">
        <div className="mx-auto max-w-6xl">
          <PageLoader
            title="Loading product"
            subtitle="Fetching the latest product record from the backend."
          />
        </div>
      </main>
    );
  }

  if (error) {
    return (
      <main className="page-shell px-4 py-28 md:px-8 lg:px-16">
        <div className="mx-auto max-w-6xl">
          <PageError title="Product unavailable" message={error} />
        </div>
      </main>
    );
  }

  if (!product) {
    return (
      <main className="page-shell flex items-center justify-center px-4 py-28 md:px-8">
        <div className="max-w-xl">
          <PageError
            title="Product not found"
            message="This product no longer exists in the live catalog."
            action={(
              <Link to="/products" className="btn-primary inline-flex">
                Back to products
              </Link>
            )}
          />
        </div>
      </main>
    );
  }

  const handleAdd = () => {
    const addedToCart = addToCart?.(product, qty);
    if (addedToCart) {
      setAdded(true);
      setTimeout(() => setAdded(false), 1500);
    }
  };

  const categoryLink = product.sectionName
    ? `/category/${slugifySectionName(product.sectionName)}`
    : '/products';

  return (
    <main className="page-shell">
      <section className="section-padding">
        <div className="mx-auto max-w-7xl">
          <div className="mb-8 flex flex-wrap items-center gap-3 text-sm text-[#6d635a]">
            <Link
              to="/products"
              className="inline-flex items-center gap-2 transition-colors hover:text-[#17110d]"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to products
            </Link>
            <span>/</span>
            <Link to={categoryLink} className="transition-colors hover:text-[#17110d]">
              {product.sectionName}
            </Link>
          </div>

          <div className="grid grid-cols-1 gap-8 lg:grid-cols-[1.05fr_0.95fr]">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              className="space-y-4"
            >
              <ProductMediaGallery
                mediaList={mediaList}
                productName={product.name}
                fallbackImage={product.imageUrl || FALLBACK_IMAGE}
              />

              <div className="grid gap-3 sm:grid-cols-3">
                {[
                  { label: 'Images', value: mediaCounts.images },
                  { label: 'Videos', value: mediaCounts.videos },
                  { label: 'Gallery items', value: mediaList.length || 1 },
                ].map((item) => (
                  <div key={item.label} className="anchor-panel px-4 py-4">
                    <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-[#8ef0be]">{item.label}</p>
                    <p className="mt-2 font-display text-3xl text-white">{item.value}</p>
                  </div>
                ))}
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.08 }}
              className="page-panel p-8 md:p-10"
            >
              <span className="text-[11px] font-semibold uppercase tracking-[0.28em] text-brand-600">
                Live catalog item
              </span>
              <h1 className="mt-3 font-display text-4xl leading-tight text-[#17110d] md:text-5xl">
                {product.name}
              </h1>
              <p className="mt-4 text-base leading-relaxed text-[#5f554b]">
                {product.description}
              </p>

              <div className="mt-8 flex flex-wrap items-end gap-3">
                <span className="font-display text-5xl text-[#17110d]">
                  {formatPrice(Number(product.price))}
                </span>
                <span className={`rounded-full px-3 py-1.5 text-sm font-semibold ${
                  soldOut
                    ? 'border border-rose-200 bg-rose-50 text-rose-600'
                    : lowStock
                      ? 'border border-amber-200 bg-amber-50 text-amber-700'
                      : 'border border-brand-500/20 bg-brand-50 text-brand-700'
                }`}>
                  {getStockLabel(stockQuantity)}
                </span>
              </div>

              <div className="mt-6 rounded-[1.5rem] border border-[rgba(34,24,17,0.08)] bg-[rgba(255,250,243,0.72)] px-5 py-4 text-sm leading-relaxed text-[#5f554b]">
                Checkout re-validates product pricing and stock on the backend before an order is finalized, so the stored order always reflects live catalog truth.
              </div>

              <div className="mt-8 flex flex-col gap-4 md:flex-row">
                <div className="page-panel-soft flex items-center gap-1 p-1">
                  <button
                    onClick={() => setQty((value) => Math.max(1, value - 1))}
                    className="flex h-11 w-11 items-center justify-center rounded-full text-[#6d635a] transition-colors hover:bg-white hover:text-[#17110d]"
                  >
                    <Minus className="h-4 w-4" />
                  </button>
                  <span className="w-12 text-center text-lg font-semibold text-[#17110d]">
                    {qty}
                  </span>
                  <button
                    onClick={() => setQty((value) => clampQuantityToStock(value + 1, stockQuantity))}
                    disabled={soldOut || (stockQuantity !== null && qty >= stockQuantity)}
                    className="flex h-11 w-11 items-center justify-center rounded-full text-[#6d635a] transition-colors hover:bg-white hover:text-[#17110d] disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    <Plus className="h-4 w-4" />
                  </button>
                </div>

                <button
                  onClick={handleAdd}
                  disabled={soldOut}
                  className={`flex-1 rounded-full px-6 py-3.5 text-sm font-semibold transition-all duration-300 disabled:cursor-not-allowed disabled:opacity-72 ${
                    added
                      ? 'border border-brand-500/20 bg-brand-50 text-brand-700'
                      : soldOut
                        ? 'border border-rose-200 bg-rose-50 text-rose-600'
                        : 'btn-primary'
                  }`}
                >
                  <span className="inline-flex items-center gap-2">
                    <ShoppingCart className="h-4 w-4" />
                    {added ? 'Added to cart' : soldOut ? 'Currently unavailable' : `Add ${qty} to cart`}
                  </span>
                </button>

                <button
                  onClick={() => setWishlisted((value) => !value)}
                  className="page-panel-soft flex h-14 w-14 items-center justify-center transition-colors hover:border-rose-500/25"
                >
                  <Heart
                    className={`h-5 w-5 ${
                      wishlisted ? 'fill-rose-500 text-rose-500' : 'text-[#6d635a]'
                    }`}
                  />
                </button>
              </div>

              <div className="mt-8 grid grid-cols-1 gap-3 sm:grid-cols-2">
                {[
                  { icon: Shield, label: 'Backend verified checkout' },
                  { icon: Truck, label: soldOut ? 'Restock needed before dispatch' : 'Ready for delivery scheduling' },
                  { icon: Package, label: soldOut ? 'Currently sold out' : `Inventory available: ${getStockLabel(stockQuantity)}` },
                  { icon: Video, label: mediaCounts.videos > 0 ? 'Video preview available' : 'Image-first product listing' },
                ].map(({ icon: Icon, label }) => (
                  <div
                    key={label}
                    className="page-panel-soft flex items-center gap-3 px-4 py-4 text-sm text-[#5f554b]"
                  >
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-brand-50 text-brand-600">
                      <Icon className="h-4 w-4" />
                    </div>
                    <span className="font-medium">{label}</span>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </section>
    </main>
  );
};

export default ProductDetailsPage;
