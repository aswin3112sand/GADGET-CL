import { useEffect } from 'react';
import { AnimatePresence, motion, useAnimation } from 'framer-motion';
import { ShoppingCart } from 'lucide-react';

const CartIcon = ({ count = 0, onClick }) => {
  const controls = useAnimation();

  useEffect(() => {
    if (count > 0) {
      controls.start({
        rotate: [0, -10, 8, -4, 0],
        scale: [1, 1.1, 1.06, 1],
        transition: { duration: 0.45, ease: 'easeOut' },
      });
    }
  }, [count, controls]);

  return (
    <motion.button
      onClick={onClick}
      whileHover={{ scale: 1.04 }}
      whileTap={{ scale: 0.96 }}
      className="group relative rounded-full border border-[rgba(34,24,17,0.08)] bg-[rgba(255,251,245,0.8)] p-3 text-[#17110d] shadow-[0_14px_28px_rgba(23,17,13,0.06)] transition-all duration-300 hover:-translate-y-0.5 hover:border-brand-500/30"
      aria-label={`Open cart with ${count} item${count === 1 ? '' : 's'}`}
    >
      <motion.div animate={controls}>
        <ShoppingCart className="h-5 w-5 text-[#17110d]" />
      </motion.div>

      <AnimatePresence>
        {count > 0 && (
          <motion.span
            key={count}
            initial={{ scale: 0, rotate: -14 }}
            animate={{
              scale: 1,
              rotate: 0,
              transition: { type: 'spring', stiffness: 480, damping: 18 },
            }}
            exit={{ scale: 0, rotate: 12, transition: { duration: 0.2 } }}
            className="absolute -right-1.5 -top-1.5 flex h-5 min-w-[1.25rem] items-center justify-center rounded-full border border-white/80 bg-brand-500 px-1 text-[10px] font-black text-white shadow-[0_8px_16px_rgba(183,134,75,0.28)]"
          >
            {count > 99 ? '99+' : count}
          </motion.span>
        )}
      </AnimatePresence>
    </motion.button>
  );
};

export default CartIcon;
