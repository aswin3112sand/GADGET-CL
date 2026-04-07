import { useRef } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import ProductCard from './ProductCard';

const ProductSlider = ({ products, addToCart }) => {
  const ref = useRef(null);
  const visibleProducts = products.slice(0, 10);

  const scroll = (dir) => {
    ref.current?.scrollBy({ left: dir * 320, behavior: 'smooth' });
  };

  return (
    <div className="relative">
      <button
        onClick={() => scroll(-1)}
        className="slider-arrow absolute -left-3 top-1/2 z-10 -translate-y-1/2 hover:-translate-y-[52%]"
        aria-label="Scroll products left"
      >
        <ChevronLeft className="h-5 w-5" />
      </button>

      <div
        ref={ref}
        className="hide-scrollbar flex gap-5 overflow-x-auto pb-4 scroll-smooth"
      >
        {visibleProducts.map((product, i) => (
          <div key={product.id} className="w-64 flex-none">
            <ProductCard product={product} index={i} addToCart={addToCart} />
          </div>
        ))}
      </div>

      <button
        onClick={() => scroll(1)}
        className="slider-arrow absolute -right-3 top-1/2 z-10 -translate-y-1/2 hover:-translate-y-[52%]"
        aria-label="Scroll products right"
      >
        <ChevronRight className="h-5 w-5" />
      </button>
    </div>
  );
};

export default ProductSlider;
