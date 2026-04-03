import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Star, ShoppingCart, Heart, ArrowLeft, Shield, Truck, RotateCcw, Zap } from 'lucide-react';
import { getProductById } from '../data/mockData';
import { formatPrice } from '../utils/priceHelpers';
import { useState } from 'react';

const ProductDetailsPage = ({ addToCart }) => {
  const { id } = useParams();
  const product = getProductById(id);
  const [qty, setQty] = useState(1);
  const [wishlisted, setWishlisted] = useState(false);
  const [added, setAdded] = useState(false);

  if (!product) {
    return (
      <main className="min-h-screen bg-dark-400 pt-24 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-white mb-4">Product not found</h1>
          <Link to="/products" className="btn-primary inline-flex">Back to Products</Link>
        </div>
      </main>
    );
  }

  const handleAdd = () => {
    for (let i = 0; i < qty; i++) addToCart?.(product);
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  };

  return (
    <main className="min-h-screen bg-dark-400 pt-24">
      <section className="section-padding">
        <div className="max-w-7xl mx-auto">
          {/* Breadcrumb */}
          <Link to="/products"
                className="inline-flex items-center gap-2 text-white/40 hover:text-white
                           text-sm mb-8 transition-colors group">
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            Back to Products
          </Link>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Image */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              className="glass rounded-3xl overflow-hidden aspect-square relative"
            >
              <img src={product.image} alt={product.name}
                   className="w-full h-full object-cover" />
              <div className="absolute top-4 left-4 flex flex-col gap-2">
                {product.badge && (
                  <span className="px-3 py-1 rounded-lg text-xs font-bold
                                   bg-gradient-to-r from-brand-600 to-brand-500 text-white">
                    {product.badge}
                  </span>
                )}
              </div>
            </motion.div>

            {/* Info */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="flex flex-col justify-center"
            >
              <span className="text-brand-400 text-sm font-bold tracking-wider uppercase mb-2">
                {product.brand}
              </span>
              <h1 className="font-display text-3xl md:text-4xl font-black text-white mb-4">
                {product.name}
              </h1>
              <p className="text-white/60 text-base leading-relaxed mb-6">
                {product.shortDescription}
              </p>

              {/* Rating */}
              <div className="flex items-center gap-3 mb-6">
                <div className="flex">
                  {Array.from({ length: 5 }, (_, i) => (
                    <Star key={i}
                          className={`w-5 h-5 ${i < Math.floor(product.rating) ? 'text-amber-400 fill-amber-400' : 'text-white/20'}`} />
                  ))}
                </div>
                <span className="text-white font-semibold">{product.rating}</span>
                <span className="text-white/40 text-sm">({product.ratingCount.toLocaleString()} reviews)</span>
              </div>

              {/* Price */}
              <div className="flex items-end gap-4 mb-8">
                <span className="font-display text-4xl font-black text-white">
                  {formatPrice(product.offerPrice)}
                </span>
                <span className="text-white/30 text-xl line-through mb-1">
                  {formatPrice(product.price)}
                </span>
                <span className="px-3 py-1 rounded-lg bg-emerald-500/10 text-emerald-400
                                 border border-emerald-500/20 font-bold text-sm mb-1">
                  -{product.discount}% OFF
                </span>
              </div>

              {/* Qty + Add to Cart */}
              <div className="flex items-center gap-4 mb-8">
                <div className="flex items-center gap-2 glass rounded-xl border border-white/10 p-1">
                  <button onClick={() => setQty(q => Math.max(1, q - 1))}
                          className="w-10 h-10 rounded-lg flex items-center justify-center
                                     text-white/60 hover:text-white hover:bg-white/10 transition-all">
                    −
                  </button>
                  <span className="w-10 text-center text-white font-bold text-lg">{qty}</span>
                  <button onClick={() => setQty(q => q + 1)}
                          className="w-10 h-10 rounded-lg flex items-center justify-center
                                     text-white/60 hover:text-white hover:bg-brand-500/20 transition-all">
                    +
                  </button>
                </div>

                <button
                  onClick={handleAdd}
                  className={`flex-1 py-3.5 rounded-xl font-bold flex items-center justify-center gap-2
                              transition-all duration-300
                              ${added ? 'bg-emerald-500/20 border border-emerald-500/40 text-emerald-400'
                                      : 'btn-primary'}`}
                >
                  <ShoppingCart className="w-5 h-5" />
                  {added ? 'Added to Cart!' : 'Add to Cart'}
                </button>

                <button
                  onClick={() => setWishlisted(!wishlisted)}
                  className="w-12 h-12 rounded-xl glass border border-white/10
                             flex items-center justify-center
                             hover:border-rose-500/40 transition-all duration-300"
                >
                  <Heart className={`w-5 h-5 ${wishlisted ? 'text-rose-500 fill-rose-500' : 'text-white/60'}`} />
                </button>
              </div>

              {/* Trust badges */}
              <div className="grid grid-cols-2 gap-3">
                {[
                  { icon: Shield, label: '1 Year Warranty' },
                  { icon: Truck,  label: 'Free Delivery' },
                  { icon: RotateCcw, label: '7-Day Returns' },
                  { icon: Zap,    label: 'Genuine Product' },
                ].map(({ icon: Icon, label }) => (
                  <div key={label}
                       className="flex items-center gap-2 px-3 py-2 rounded-xl glass
                                  border border-white/5 text-white/60 text-xs">
                    <Icon className="w-4 h-4 text-brand-400 flex-none" />
                    {label}
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
