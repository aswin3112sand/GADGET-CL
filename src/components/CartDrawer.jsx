import { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X, ShoppingBag, Trash2, Plus, Minus,
  ArrowRight, Package, Zap,
} from 'lucide-react';
import { formatPrice } from '../utils/priceHelpers';

// ─── Animation Variants ──────────────────────────────────────

const overlayVariants = {
  hidden:  { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.3 } },
  exit:    { opacity: 0, transition: { duration: 0.25, delay: 0.1 } },
};

const drawerVariants = {
  hidden:  { x: '100%', opacity: 0.5 },
  visible: {
    x: 0, opacity: 1,
    transition: { type: 'spring', stiffness: 280, damping: 30, mass: 0.8 },
  },
  exit: {
    x: '100%', opacity: 0,
    transition: { type: 'spring', stiffness: 300, damping: 35 },
  },
};

const listVariants = {
  hidden:  {},
  visible: { transition: { staggerChildren: 0.07, delayChildren: 0.15 } },
};

const itemVariants = {
  hidden:  { opacity: 0, x: 40, scale: 0.95 },
  visible: {
    opacity: 1, x: 0, scale: 1,
    transition: { type: 'spring', stiffness: 300, damping: 25 },
  },
  exit: {
    opacity: 0, x: -60, scale: 0.9,
    transition: { duration: 0.3, ease: [0.4, 0, 0.2, 1] },
  },
};

const emptyVariants = {
  hidden:  { opacity: 0, scale: 0.85, y: 20 },
  visible: {
    opacity: 1, scale: 1, y: 0,
    transition: { type: 'spring', stiffness: 200, damping: 20, delay: 0.2 },
  },
};

// ─── CartItem Sub-Component ───────────────────────────────────

const CartItem = ({ item, onRemove, onIncrease, onDecrease }) => (
  <motion.div
    layout
    variants={itemVariants}
    initial="hidden"
    animate="visible"
    exit="exit"
    className="group flex gap-4 p-4 rounded-2xl
               glass border border-white/5
               hover:border-brand-500/20
               transition-colors duration-300"
  >
    <div className="w-20 h-20 rounded-xl overflow-hidden flex-none bg-white/5">
      <motion.img
        src={item.image}
        alt={item.name}
        className="w-full h-full object-cover"
        whileHover={{ scale: 1.1 }}
        transition={{ duration: 0.4 }}
      />
    </div>

    <div className="flex-1 min-w-0">
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0">
          <p className="text-white/40 text-xs font-semibold tracking-wider uppercase">
            {item.brand}
          </p>
          <h4 className="text-white font-semibold text-sm leading-snug truncate mt-0.5">
            {item.name}
          </h4>
        </div>

        <motion.button
          onClick={() => onRemove(item.id)}
          whileHover={{ scale: 1.15, rotate: 8 }}
          whileTap={{ scale: 0.9 }}
          className="w-7 h-7 rounded-lg glass border border-white/10
                     flex items-center justify-center flex-none
                     opacity-0 group-hover:opacity-100
                     hover:border-rose-500/40 hover:text-rose-400
                     text-white/40 transition-all duration-300"
        >
          <Trash2 className="w-3.5 h-3.5" />
        </motion.button>
      </div>

      <div className="flex items-center justify-between mt-3">
        <motion.span
          key={item.offerPrice}
          initial={{ opacity: 0, y: -5 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-white font-bold text-sm"
        >
          {formatPrice(item.offerPrice * item.qty)}
        </motion.span>

        <div className="flex items-center gap-1 glass rounded-xl border border-white/10 p-1">
          <motion.button
            onClick={() => onDecrease(item.id)}
            whileHover={{ scale: 1.15 }}
            whileTap={{ scale: 0.85 }}
            className="w-6 h-6 rounded-lg flex items-center justify-center
                       text-white/60 hover:text-white hover:bg-white/10
                       transition-all duration-200"
          >
            <Minus className="w-3 h-3" />
          </motion.button>

          <AnimatePresence mode="wait">
            <motion.span
              key={item.qty}
              initial={{ opacity: 0, scale: 0.5, y: -8 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.5, y: 8 }}
              transition={{ duration: 0.2, type: 'spring', stiffness: 400 }}
              className="w-6 text-center text-white font-bold text-sm"
            >
              {item.qty}
            </motion.span>
          </AnimatePresence>

          <motion.button
            onClick={() => onIncrease(item.id)}
            whileHover={{ scale: 1.15 }}
            whileTap={{ scale: 0.85 }}
            className="w-6 h-6 rounded-lg flex items-center justify-center
                       text-white/60 hover:text-white hover:bg-brand-500/20
                       transition-all duration-200"
          >
            <Plus className="w-3 h-3" />
          </motion.button>
        </div>
      </div>
    </div>
  </motion.div>
);

// ─── Empty State ──────────────────────────────────────────────

const EmptyCart = ({ onClose }) => (
  <motion.div
    variants={emptyVariants}
    initial="hidden"
    animate="visible"
    className="flex flex-col items-center justify-center h-full gap-6 px-8 text-center py-20"
  >
    <motion.div
      animate={{ y: [0, -12, 0], rotate: [0, -5, 5, 0] }}
      transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
      className="w-24 h-24 rounded-3xl glass neon-border
                 flex items-center justify-center shadow-neon-blue"
    >
      <ShoppingBag className="w-12 h-12 text-brand-400" />
    </motion.div>

    <div>
      <h3 className="font-display font-bold text-xl text-white mb-2">Your cart is empty</h3>
      <p className="text-white/40 text-sm leading-relaxed">
        Looks like you haven't added any gadgets yet. Start exploring our collection!
      </p>
    </div>

    <motion.button
      onClick={onClose}
      whileHover={{ scale: 1.04, y: -2 }}
      whileTap={{ scale: 0.97 }}
      className="btn-primary flex items-center gap-2 px-8 py-3.5"
    >
      Explore Gadgets
      <ArrowRight className="w-4 h-4" />
    </motion.button>
  </motion.div>
);

// ─── Main CartDrawer ──────────────────────────────────────────

const CartDrawer = ({ isOpen, onClose, cart, setCart }) => {
  const total   = cart.reduce((s, i) => s + i.offerPrice * i.qty, 0);
  const savings = cart.reduce((s, i) => s + (i.price - i.offerPrice) * i.qty, 0);
  const itemCount = cart.reduce((s, i) => s + i.qty, 0);

  useEffect(() => {
    document.body.style.overflow = isOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [isOpen]);

  const removeItem  = (id) => setCart(c => c.filter(i => i.id !== id));
  const increaseQty = (id) => setCart(c => c.map(i => i.id === id ? { ...i, qty: i.qty + 1 } : i));
  const decreaseQty = (id) => setCart(c =>
    c.map(i => i.id === id && i.qty > 1 ? { ...i, qty: i.qty - 1 } : i)
     .filter(i => !(i.id === id && i.qty === 1))
  );
  const clearCart = () => setCart([]);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            variants={overlayVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            onClick={onClose}
            className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm"
          />

          {/* Drawer */}
          <motion.div
            variants={drawerVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="fixed top-0 right-0 bottom-0 z-50
                       w-full max-w-md flex flex-col
                       bg-dark-50 border-l border-white/5 shadow-premium"
            style={{ backgroundColor: '#1a1a2e' }}
          >
            {/* Top accent line */}
            <div className="absolute top-0 left-0 right-0 h-px
                            bg-gradient-to-r from-transparent via-brand-500/60 to-transparent" />

            {/* ── Header ── */}
            <div className="flex items-center justify-between p-6 border-b border-white/5">
              <div className="flex items-center gap-3">
                <motion.div
                  initial={{ rotate: -15, scale: 0 }}
                  animate={{ rotate: 0, scale: 1 }}
                  transition={{ type: 'spring', stiffness: 300, delay: 0.2 }}
                  className="w-10 h-10 rounded-xl bg-gradient-to-br from-brand-600 to-neon-blue
                             flex items-center justify-center shadow-neon-blue"
                >
                  <ShoppingBag className="w-5 h-5 text-white" />
                </motion.div>
                <div>
                  <h2 className="font-display font-bold text-lg text-white">Your Cart</h2>
                  <AnimatePresence mode="wait">
                    <motion.p
                      key={itemCount}
                      initial={{ opacity: 0, y: -6 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 6 }}
                      className="text-white/40 text-xs"
                    >
                      {itemCount === 0 ? 'No items' : `${itemCount} item${itemCount > 1 ? 's' : ''}`}
                    </motion.p>
                  </AnimatePresence>
                </div>
              </div>

              <div className="flex items-center gap-2">
                {cart.length > 0 && (
                  <motion.button
                    onClick={clearCart}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="px-3 py-1.5 rounded-lg glass border border-white/10
                               text-white/40 hover:text-rose-400 hover:border-rose-500/30
                               text-xs font-semibold transition-all duration-300"
                  >
                    Clear All
                  </motion.button>
                )}
                <motion.button
                  onClick={onClose}
                  whileHover={{ scale: 1.1, rotate: 90 }}
                  whileTap={{ scale: 0.9 }}
                  transition={{ type: 'spring', stiffness: 300 }}
                  className="w-9 h-9 rounded-xl glass border border-white/10
                             flex items-center justify-center
                             hover:border-white/30 hover:bg-white/10
                             transition-all duration-300"
                >
                  <X className="w-4 h-4 text-white/60" />
                </motion.button>
              </div>
            </div>

            {/* ── Cart Items ── */}
            <div className="flex-1 overflow-y-auto p-6 space-y-3">
              {cart.length === 0 ? (
                <EmptyCart onClose={onClose} />
              ) : (
                <motion.div
                  variants={listVariants}
                  initial="hidden"
                  animate="visible"
                  className="space-y-3"
                >
                  <AnimatePresence mode="popLayout">
                    {cart.map(item => (
                      <CartItem
                        key={item.id}
                        item={item}
                        onRemove={removeItem}
                        onIncrease={increaseQty}
                        onDecrease={decreaseQty}
                      />
                    ))}
                  </AnimatePresence>
                </motion.div>
              )}
            </div>

            {/* ── Footer Summary ── */}
            <AnimatePresence>
              {cart.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 30 }}
                  transition={{ type: 'spring', stiffness: 260, damping: 25 }}
                  className="p-6 border-t border-white/5"
                >
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.1 }}
                    className="flex items-center gap-2 px-4 py-2.5 rounded-xl
                               bg-emerald-500/10 border border-emerald-500/20 mb-5"
                  >
                    <Zap className="w-4 h-4 text-emerald-400 flex-none" />
                    <span className="text-emerald-400 text-sm font-semibold">
                      You save {formatPrice(savings)} on this order!
                    </span>
                  </motion.div>

                  <div className="space-y-2 mb-5">
                    {[
                      { label: 'Subtotal', val: formatPrice(total + savings) },
                      { label: 'Discount', val: `- ${formatPrice(savings)}`, accent: true },
                      { label: 'Delivery', val: total >= 499 ? 'FREE' : formatPrice(99) },
                    ].map(({ label, val, accent }) => (
                      <div key={label} className="flex justify-between text-sm">
                        <span className="text-white/40">{label}</span>
                        <span className={accent ? 'text-emerald-400 font-semibold' : 'text-white/70'}>
                          {val}
                        </span>
                      </div>
                    ))}

                    <div className="flex justify-between items-center pt-3 border-t border-white/10">
                      <span className="text-white font-bold">Total</span>
                      <AnimatePresence mode="wait">
                        <motion.span
                          key={total}
                          initial={{ opacity: 0, scale: 0.7, y: -10 }}
                          animate={{ opacity: 1, scale: 1, y: 0 }}
                          exit={{ opacity: 0, scale: 0.7, y: 10 }}
                          transition={{ type: 'spring', stiffness: 350, damping: 20 }}
                          className="font-display font-black text-xl gradient-text-blue"
                        >
                          {formatPrice(total)}
                        </motion.span>
                      </AnimatePresence>
                    </div>
                  </div>

                  <motion.button
                    whileHover={{ scale: 1.02, y: -2 }}
                    whileTap={{ scale: 0.98 }}
                    className="w-full btn-primary flex items-center justify-center gap-2
                               py-4 text-base font-bold rounded-2xl"
                  >
                    <Package className="w-5 h-5" />
                    Proceed to Checkout
                    <ArrowRight className="w-4 h-4" />
                  </motion.button>

                  <p className="text-center text-white/25 text-xs mt-3">
                    🔒 Secure checkout · Free returns · GST included
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default CartDrawer;
