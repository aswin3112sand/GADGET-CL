import { useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Star, ShoppingCart, Eye, Heart, Zap } from 'lucide-react';
import { formatPrice } from '../utils/priceHelpers';

const ProductCard = ({ product, index = 0, addToCart }) => {
  const [wishlisted, setWishlisted] = useState(false);
  const [addedToCart, setAddedToCart] = useState(false);

  const handleAddCart = (e) => {
    e.preventDefault();
    addToCart?.(product);
    setAddedToCart(true);
    setTimeout(() => setAddedToCart(false), 1500);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: (index % 8) * 0.06, duration: 0.5 }}
      className="product-card group"
    >
      <Link to={`/product/${product.id}`} className="block">

        {/* Image container */}
        <div className="relative overflow-hidden bg-white/3 aspect-square rounded-2xl m-3">
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-full object-cover
                       group-hover:scale-110 transition-transform duration-700"
          />

          {/* Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent
                          opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

          {/* Badges */}
          <div className="absolute top-2 left-2 flex flex-col gap-1">
            {product.badge && (
              <span className="px-2.5 py-1 rounded-lg text-xs font-bold
                               bg-gradient-to-r from-brand-600 to-brand-500 text-white
                               shadow-neon-blue">
                {product.badge}
              </span>
            )}
            {product.isTrending && (
              <span className="px-2.5 py-1 rounded-lg text-xs font-bold
                               bg-gradient-to-r from-neon-pink to-rose-600 text-white
                               flex items-center gap-1">
                <Zap className="w-2.5 h-2.5" /> TRENDING
              </span>
            )}
          </div>

          {/* Wishlist */}
          <button
            onClick={(e) => { e.preventDefault(); setWishlisted(!wishlisted); }}
            className="absolute top-2 right-2 w-8 h-8 rounded-full glass
                       flex items-center justify-center
                       opacity-0 group-hover:opacity-100
                       transition-all duration-300 hover:scale-110"
          >
            <Heart className={`w-4 h-4 transition-colors ${wishlisted ? 'text-rose-500 fill-rose-500' : 'text-white'}`} />
          </button>

          {/* Quick View */}
          <div className="absolute bottom-3 left-0 right-0 flex justify-center
                          translate-y-4 group-hover:translate-y-0 opacity-0 group-hover:opacity-100
                          transition-all duration-300">
            <span className="flex items-center gap-1.5 px-4 py-2 rounded-full glass-strong
                             text-white text-xs font-semibold border border-white/20">
              <Eye className="w-3 h-3" /> Quick View
            </span>
          </div>
        </div>

        {/* Info */}
        <div className="px-4 pb-4">
          {/* Brand */}
          <span className="text-brand-400 text-xs font-semibold tracking-wider uppercase">
            {product.brand}
          </span>

          {/* Name */}
          <h3 className="text-white font-semibold text-sm leading-snug mt-0.5 mb-1 line-clamp-1">
            {product.name}
          </h3>

          {/* Feature */}
          <p className="text-white/40 text-xs line-clamp-1 mb-3">
            {product.shortDescription}
          </p>

          {/* Rating */}
          <div className="flex items-center gap-1.5 mb-3">
            <div className="flex">
              {Array.from({ length: 5 }, (_, i) => (
                <Star key={i}
                      className={`w-3 h-3 ${i < Math.floor(product.rating) ? 'text-amber-400 fill-amber-400' : 'text-white/20'}`} />
              ))}
            </div>
            <span className="text-white/50 text-xs">{product.rating} ({product.ratingCount.toLocaleString()})</span>
          </div>

          {/* Price */}
          <div className="flex items-center gap-2 mb-4">
            <span className="text-white font-bold text-base">
              {formatPrice(product.offerPrice)}
            </span>
            <span className="text-white/30 text-xs line-through">
              {formatPrice(product.price)}
            </span>
            <span className="ml-auto px-2 py-0.5 rounded-md text-xs font-bold
                             bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              -{product.discount}%
            </span>
          </div>

          {/* CTA Button */}
          <button
            onClick={handleAddCart}
            className={`w-full py-2.5 rounded-xl font-semibold text-sm
                        flex items-center justify-center gap-2
                        transition-all duration-300
                        ${addedToCart
                          ? 'bg-emerald-500/20 border border-emerald-500/40 text-emerald-400'
                          : 'glass border border-white/10 hover:border-brand-500/40 text-white hover:bg-brand-500/10'
                        }`}
          >
            <ShoppingCart className="w-4 h-4" />
            {addedToCart ? 'Added!' : 'Add to Cart'}
          </button>
        </div>
      </Link>
    </motion.div>
  );
};

export default ProductCard;
