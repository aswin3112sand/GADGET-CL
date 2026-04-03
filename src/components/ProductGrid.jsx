import { useState } from 'react';
import ProductCard from './ProductCard';
import { motion } from 'framer-motion';
import { ChevronDown } from 'lucide-react';

const ProductGrid = ({ products, initialCount = 8, addToCart }) => {
  const [visibleCount, setVisibleCount] = useState(initialCount);

  return (
    <div>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {products.slice(0, visibleCount).map((product, i) => (
          <ProductCard key={product.id} product={product} index={i} addToCart={addToCart} />
        ))}
      </div>

      {visibleCount < products.length && (
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-center mt-10"
        >
          <button
            onClick={() => setVisibleCount(v => Math.min(v + 8, products.length))}
            className="btn-ghost flex items-center gap-2 mx-auto"
          >
            Load More Products
            <ChevronDown className="w-4 h-4" />
          </button>
        </motion.div>
      )}
    </div>
  );
};

export default ProductGrid;
