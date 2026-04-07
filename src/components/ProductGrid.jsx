import { useState } from 'react';
import ProductCard from './ProductCard';
import { motion } from 'framer-motion';
import { ChevronDown } from 'lucide-react';

const ProductGrid = ({ products, initialCount = 10, addToCart }) => {
  const [visibleCount, setVisibleCount] = useState(initialCount);

  return (
    <div>
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {products.slice(0, visibleCount).map((product, i) => (
          <ProductCard key={product.id} product={product} index={i} addToCart={addToCart} />
        ))}
      </div>

      {visibleCount < products.length && (
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="mt-10 text-center"
        >
          <button
            onClick={() => setVisibleCount((value) => Math.min(value + 10, products.length))}
            className="btn-ghost mx-auto flex items-center gap-2"
          >
            Load More Products
            <ChevronDown className="h-4 w-4" />
          </button>
        </motion.div>
      )}
    </div>
  );
};

export default ProductGrid;
