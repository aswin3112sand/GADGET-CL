import { useRef } from 'react';
import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import ProductCard from './ProductCard';

const ProductSlider = ({ products, addToCart }) => {
  const ref = useRef(null);

  const scroll = (dir) => {
    ref.current?.scrollBy({ left: dir * 320, behavior: 'smooth' });
  };

  return (
    <div className="relative">
      <button
        onClick={() => scroll(-1)}
        className="absolute -left-4 top-1/2 -translate-y-1/2 z-10
                   w-10 h-10 rounded-full glass-strong border border-white/10
                   flex items-center justify-center
                   hover:border-brand-500/40 hover:shadow-neon-blue
                   transition-all duration-300 shadow-glass"
      >
        <ChevronLeft className="w-5 h-5 text-white" />
      </button>

      <div
        ref={ref}
        className="flex gap-4 overflow-x-auto pb-4
                   scroll-smooth"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        {products.map((product, i) => (
          <div key={product.id} className="flex-none w-64">
            <ProductCard product={product} index={i} addToCart={addToCart} />
          </div>
        ))}
      </div>

      <button
        onClick={() => scroll(1)}
        className="absolute -right-4 top-1/2 -translate-y-1/2 z-10
                   w-10 h-10 rounded-full glass-strong border border-white/10
                   flex items-center justify-center
                   hover:border-brand-500/40 hover:shadow-neon-blue
                   transition-all duration-300 shadow-glass"
      >
        <ChevronRight className="w-5 h-5 text-white" />
      </button>
    </div>
  );
};

export default ProductSlider;
