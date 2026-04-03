import { motion, AnimatePresence, useAnimation } from 'framer-motion';
import { ShoppingCart } from 'lucide-react';
import { useEffect } from 'react';

const CartIcon = ({ count = 0, onClick }) => {
  const controls = useAnimation();

  useEffect(() => {
    if (count > 0) {
      controls.start({
        rotate: [0, -15, 12, -8, 6, 0],
        scale:  [1, 1.2, 1.1, 1.15, 1.05, 1],
        transition: { duration: 0.55, ease: 'easeOut' },
      });
    }
  }, [count, controls]);

  return (
    <motion.button
      onClick={onClick}
      whileHover={{ scale: 1.08 }}
      whileTap={{ scale: 0.92 }}
      className="relative p-2.5 rounded-xl glass border border-white/10
                 hover:border-brand-500/40 hover:shadow-neon-blue
                 transition-all duration-300 group"
    >
      <motion.div animate={controls}>
        <ShoppingCart className="w-5 h-5 text-white/70 group-hover:text-white transition-colors" />
      </motion.div>

      <AnimatePresence>
        {count > 0 && (
          <motion.span
            key={count}
            initial={{ scale: 0, rotate: -20 }}
            animate={{ scale: 1, rotate: 0, transition: { type: 'spring', stiffness: 500, damping: 15 } }}
            exit={{ scale: 0, rotate: 20, transition: { duration: 0.2 } }}
            className="absolute -top-1.5 -right-1.5
                       min-w-[1.25rem] h-5 px-1
                       rounded-full bg-gradient-to-r from-brand-600 to-brand-500
                       text-white text-[10px] font-black
                       flex items-center justify-center
                       shadow-neon-blue border border-dark-400"
          >
            {count > 99 ? '99+' : count}
          </motion.span>
        )}
      </AnimatePresence>
    </motion.button>
  );
};

export default CartIcon;
