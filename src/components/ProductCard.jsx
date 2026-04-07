import { useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Eye, Heart, ShoppingCart } from 'lucide-react';
import { getNumericStock, getStockLabel, isLowStock, isOutOfStock } from '../utils/inventory';
import { formatPrice } from '../utils/priceHelpers';

const FALLBACK_IMAGE = 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=900&q=80';

const ProductCard = ({ product, index = 0, addToCart }) => {
  const [wishlisted, setWishlisted] = useState(false);
  const [addedToCart, setAddedToCart] = useState(false);
  const stockQuantity = getNumericStock(product.stockQuantity);
  const soldOut = isOutOfStock(stockQuantity);
  const lowStock = isLowStock(stockQuantity);
  const productHref = `/product/${product.id}`;

  const handleAddCart = () => {
    const added = addToCart?.(product);
    if (added) {
      setAddedToCart(true);
      setTimeout(() => setAddedToCart(false), 1500);
    }
  };

  return (
    <motion.article
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: (index % 8) * 0.05, duration: 0.45 }}
      className="product-card group"
    >
      <div className="relative m-3 aspect-square overflow-hidden rounded-[1.6rem] bg-[linear-gradient(180deg,#f7faff_0%,#edf3fb_100%)]">
        <div className="pointer-events-none absolute inset-x-[14%] top-[10%] h-24 rounded-full bg-[#60a5fa]/18 blur-3xl transition-opacity duration-500 group-hover:opacity-100" />
        <Link
          to={productHref}
          aria-label={`Open product details for ${product.name}`}
          className="block h-full rounded-[1.6rem] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#315dff] focus-visible:ring-offset-2 focus-visible:ring-offset-[#eef3fb]"
        >
          <img
            src={product.imageUrl || FALLBACK_IMAGE}
            alt={product.name}
            loading="lazy"
            decoding="async"
            sizes="(min-width: 1536px) 18vw, (min-width: 1280px) 22vw, (min-width: 768px) 30vw, 92vw"
            className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.045]"
          />
          <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(15,23,42,0.03)_0%,rgba(15,23,42,0.38)_100%)] opacity-80" />
          <div className="absolute bottom-3 left-0 right-0 flex justify-center">
            <span className="inline-flex translate-y-4 items-center gap-1.5 rounded-full border border-[rgba(86,166,255,0.18)] bg-white/82 px-4 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-[#0f172a] opacity-0 shadow-[0_14px_26px_rgba(15,23,42,0.08),0_0_20px_rgba(86,166,255,0.08)] transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100">
              <Eye className="h-3.5 w-3.5" />
              Quick View
            </span>
          </div>
        </Link>

        <div className="absolute left-3 top-3">
          <div className="flex flex-wrap gap-2">
            <span className="rounded-full bg-[#17110d] px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.24em] text-brand-300 shadow-[0_10px_20px_rgba(23,17,13,0.18)]">
              {product.sectionName}
            </span>
            <span className={`rounded-full px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.2em] shadow-[0_10px_20px_rgba(23,17,13,0.12)] ${
              soldOut
                ? 'bg-rose-50 text-rose-600'
                : lowStock
                  ? 'bg-amber-50 text-amber-700'
                  : 'bg-emerald-50 text-emerald-700'
            }`}>
              {getStockLabel(stockQuantity)}
            </span>
          </div>
        </div>

        <button
          type="button"
          aria-label={wishlisted ? `Remove ${product.name} from wishlist` : `Add ${product.name} to wishlist`}
          onClick={() => setWishlisted((value) => !value)}
          className="absolute right-3 top-3 z-[1] flex h-9 w-9 items-center justify-center rounded-full border border-[rgba(86,166,255,0.12)] bg-white/82 text-[#0f172a] shadow-[0_12px_24px_rgba(15,23,42,0.1)] transition-all duration-300 hover:scale-105 hover:shadow-[0_14px_30px_rgba(86,166,255,0.16)]"
        >
          <Heart
            className={`h-4 w-4 transition-colors ${
              wishlisted ? 'fill-rose-500 text-rose-500' : 'text-[#17110d]'
            }`}
          />
        </button>
      </div>

      <div className="flex flex-col px-5 pb-5">
        <span className="text-[11px] font-semibold uppercase tracking-[0.28em] text-brand-600">
          Catalog item
        </span>

        <Link
          to={productHref}
          className="mt-2 block rounded-[1rem] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#315dff] focus-visible:ring-offset-2 focus-visible:ring-offset-[#f6fbff]"
        >
          <h3 className="line-clamp-2 font-display text-[1.65rem] leading-[1.02] text-[#17110d]">
            {product.name}
          </h3>

          <p className="mb-4 mt-1 line-clamp-2 text-sm leading-relaxed text-[#6a6057]">
            {product.description}
          </p>
        </Link>

        <div className="mb-5 flex items-center gap-2">
          <span className="text-lg font-bold text-[#17110d]">
            {formatPrice(product.price)}
          </span>
          <span className="ml-auto rounded-full border border-brand-500/20 bg-brand-50 px-2.5 py-1 text-[11px] font-semibold text-brand-600">
            {soldOut ? 'Sold out' : lowStock ? 'Low stock' : 'In stock'}
          </span>
        </div>

        <div className="mt-auto flex items-center gap-3">
          <button
            type="button"
            onClick={handleAddCart}
            disabled={soldOut}
            className={`flex flex-1 items-center justify-center gap-2 rounded-full px-4 py-3 text-sm font-semibold transition-all duration-300 disabled:cursor-not-allowed disabled:opacity-72 ${
              addedToCart
                ? 'border border-brand-500/20 bg-brand-50 text-brand-700'
                : soldOut
                  ? 'border border-rose-200 bg-rose-50 text-rose-600'
                  : 'border border-[rgba(86,166,255,0.16)] bg-[linear-gradient(180deg,#161d2b_0%,#090f1b_100%)] text-white shadow-[0_16px_30px_rgba(15,23,42,0.12)] hover:-translate-y-0.5 hover:scale-[1.02] hover:shadow-[0_20px_36px_rgba(15,23,42,0.16),0_0_24px_rgba(86,166,255,0.16)]'
            }`}
          >
            <ShoppingCart className="h-4 w-4" />
            {addedToCart ? 'Added to cart' : soldOut ? 'Currently unavailable' : 'Add to Cart'}
          </button>

          <Link
            to={productHref}
            className="inline-flex items-center justify-center gap-2 rounded-full border border-[rgba(86,166,255,0.12)] bg-white/76 px-4 py-3 text-sm font-semibold text-[#0f172a] transition-all duration-300 hover:scale-[1.02] hover:border-[rgba(86,166,255,0.24)] hover:bg-white hover:shadow-[0_16px_30px_rgba(86,166,255,0.1)]"
          >
            <Eye className="h-4 w-4" />
            View
          </Link>
        </div>
      </div>
    </motion.article>
  );
};

export default ProductCard;
