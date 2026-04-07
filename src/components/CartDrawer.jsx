import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X, ShoppingBag, Trash2, Plus, Minus,
  ArrowRight, Package, Sparkles,
} from 'lucide-react';
import { clampQuantityToStock, getNumericStock, getStockLabel } from '../utils/inventory';
import { formatPrice } from '../utils/priceHelpers';

const FALLBACK_IMAGE = 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=900&q=80';

const overlayVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.25 } },
  exit: { opacity: 0, transition: { duration: 0.2 } },
};

const drawerVariants = {
  hidden: { x: '100%', opacity: 0.5 },
  visible: {
    x: 0,
    opacity: 1,
    transition: { type: 'spring', stiffness: 280, damping: 30, mass: 0.85 },
  },
  exit: {
    x: '100%',
    opacity: 0,
    transition: { type: 'spring', stiffness: 320, damping: 34 },
  },
};

const listVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.06, delayChildren: 0.08 } },
};

const itemVariants = {
  hidden: { opacity: 0, x: 32, scale: 0.96 },
  visible: {
    opacity: 1,
    x: 0,
    scale: 1,
    transition: { type: 'spring', stiffness: 280, damping: 24 },
  },
  exit: {
    opacity: 0,
    x: -40,
    scale: 0.92,
    transition: { duration: 0.22 },
  },
};

const CartItem = ({ item, onRemove, onIncrease, onDecrease }) => (
  <motion.div
    layout
    variants={itemVariants}
    initial="hidden"
    animate="visible"
    exit="exit"
    className="group rounded-[1.7rem] border border-[rgba(34,24,17,0.08)] bg-[rgba(255,252,247,0.88)] p-4 shadow-[0_18px_38px_rgba(23,17,13,0.06)]"
  >
    <div className="flex gap-4">
      <div className="h-20 w-20 flex-none overflow-hidden rounded-[1.2rem] bg-[#efe5d6]">
        <motion.img
          src={item.imageUrl || FALLBACK_IMAGE}
          alt={item.name}
          className="h-full w-full object-cover"
          whileHover={{ scale: 1.06 }}
          transition={{ duration: 0.35 }}
        />
      </div>

      <div className="min-w-0 flex-1">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-brand-600">
              {item.sectionName || 'Catalog item'}
            </p>
            <h4 className="mt-1 truncate text-sm font-semibold text-[#17110d]">
              {item.name}
            </h4>
          </div>

          <button
            onClick={() => onRemove(item.productId)}
            className="flex h-8 w-8 items-center justify-center rounded-full border border-[rgba(34,24,17,0.08)] text-[#8a7f74] opacity-0 transition-all duration-300 group-hover:opacity-100 hover:border-rose-500/25 hover:text-rose-500"
          >
            <Trash2 className="h-3.5 w-3.5" />
          </button>
        </div>

        <div className="mt-4 flex items-center justify-between gap-3">
          <span className="text-sm font-bold text-[#17110d]">
            {formatPrice(item.price * item.qty)}
          </span>

          <div className="flex items-center gap-1 rounded-full border border-[rgba(34,24,17,0.08)] bg-[#f7f1e8] p-1">
            <button
              onClick={() => onDecrease(item.productId)}
              className="flex h-7 w-7 items-center justify-center rounded-full text-[#6d635a] transition-colors hover:bg-white hover:text-[#17110d]"
            >
              <Minus className="h-3.5 w-3.5" />
            </button>
            <span className="w-7 text-center text-sm font-semibold text-[#17110d]">
              {item.qty}
            </span>
            <button
              onClick={() => onIncrease(item.productId)}
              disabled={getNumericStock(item.stockQuantity) !== null && item.qty >= getNumericStock(item.stockQuantity)}
              className="flex h-7 w-7 items-center justify-center rounded-full text-[#6d635a] transition-colors hover:bg-white hover:text-[#17110d] disabled:cursor-not-allowed disabled:opacity-35"
            >
              <Plus className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>

        <p className={`mt-3 text-[11px] font-semibold uppercase tracking-[0.18em] ${
          getNumericStock(item.stockQuantity) === 0
            ? 'text-rose-600'
            : (getNumericStock(item.stockQuantity) !== null && item.qty >= getNumericStock(item.stockQuantity))
              ? 'text-amber-700'
              : 'text-emerald-700'
        }`}>
          {getStockLabel(item.stockQuantity)}
        </p>
      </div>
    </div>
  </motion.div>
);

const EmptyCart = ({ onClose }) => (
  <div className="flex h-full flex-col items-center justify-center gap-6 px-8 py-20 text-center">
    <div className="flex h-24 w-24 items-center justify-center rounded-[2rem] border border-[rgba(34,24,17,0.08)] bg-[rgba(255,252,247,0.84)] shadow-[0_20px_44px_rgba(23,17,13,0.08)]">
      <ShoppingBag className="h-11 w-11 text-brand-500" />
    </div>

    <div>
      <h3 className="font-display text-3xl text-[#17110d]">Your cart is empty</h3>
      <p className="mt-3 text-sm leading-relaxed text-[#6d635a]">
        Start with a premium pick and it will appear here.
      </p>
    </div>

    <button
      onClick={onClose}
      className="btn-primary inline-flex items-center gap-2 px-8 py-3.5"
    >
      Explore Gadgets
      <ArrowRight className="h-4 w-4" />
    </button>
  </div>
);

const CartDrawer = ({ isOpen, onClose, cart, setCart }) => {
  const total = cart.reduce((sum, item) => sum + item.price * item.qty, 0);
  const itemCount = cart.reduce((sum, item) => sum + item.qty, 0);
  const inventoryIssue = cart.find((item) => {
    const stock = getNumericStock(item.stockQuantity);
    return stock !== null && stock < item.qty;
  }) || null;

  useEffect(() => {
    document.body.style.overflow = isOpen ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  const removeItem = (productId) => setCart((current) => current.filter((item) => item.productId !== productId));
  const increaseQty = (productId) => setCart((current) => current.map((item) => (
    item.productId === productId
      ? { ...item, qty: clampQuantityToStock(item.qty + 1, item.stockQuantity) }
      : item
  )));
  const decreaseQty = (productId) => setCart((current) => current
    .map((item) => (item.productId === productId && item.qty > 1 ? { ...item, qty: item.qty - 1 } : item))
    .filter((item) => !(item.productId === productId && item.qty === 1)));
  const clearCart = () => setCart([]);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            variants={overlayVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            onClick={onClose}
            className="fixed inset-0 z-50 bg-[rgba(23,17,13,0.48)] backdrop-blur-[3px]"
          />

          <motion.aside
            variants={drawerVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="fixed inset-y-0 right-0 z-50 flex w-full max-w-md flex-col border-l border-[rgba(34,24,17,0.08)] bg-[linear-gradient(180deg,#fbf5ec_0%,#f3e8dc_52%,#ede0cf_100%)] shadow-[0_28px_80px_rgba(20,14,9,0.2)]"
          >
            <div className="flex items-center justify-between border-b border-[rgba(34,24,17,0.08)] px-6 py-5">
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-[1rem] bg-[#17110d] text-brand-300 shadow-[0_16px_30px_rgba(23,17,13,0.18)]">
                  <ShoppingBag className="h-5 w-5" />
                </div>
                <div>
                  <h2 className="font-display text-2xl text-[#17110d]">Your Cart</h2>
                  <p className="text-xs text-[#7b7064]">
                    {itemCount === 0 ? 'No items yet' : `${itemCount} item${itemCount > 1 ? 's' : ''}`}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                {cart.length > 0 && (
                  <button
                    onClick={clearCart}
                    className="rounded-full border border-[rgba(34,24,17,0.08)] px-3 py-1.5 text-xs font-semibold text-[#6d635a] transition-colors hover:border-rose-500/25 hover:text-rose-500"
                  >
                    Clear All
                  </button>
                )}
                <button
                  onClick={onClose}
                  className="flex h-10 w-10 items-center justify-center rounded-full border border-[rgba(34,24,17,0.08)] text-[#6d635a] transition-colors hover:bg-white hover:text-[#17110d]"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto px-6 py-6">
              {cart.length === 0 ? (
                <EmptyCart onClose={onClose} />
              ) : (
                <motion.div variants={listVariants} initial="hidden" animate="visible" className="space-y-3">
                  <AnimatePresence>
                    {cart.map((item) => (
                      <CartItem
                        key={item.productId}
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

            <AnimatePresence>
              {cart.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 24 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 24 }}
                  className="border-t border-[rgba(34,24,17,0.08)] px-6 py-6"
                >
                  <div className="mb-5 flex items-center gap-2 rounded-[1.3rem] border border-brand-500/18 bg-brand-50 px-4 py-3 text-sm text-brand-700 shadow-[0_12px_26px_rgba(183,134,75,0.08)]">
                    <Sparkles className="h-4 w-4" />
                    Backend recalculates both total and live stock during checkout.
                  </div>

                  {inventoryIssue ? (
                    <div className="mb-5 rounded-[1.3rem] border border-amber-400/25 bg-amber-50 px-4 py-3 text-sm text-amber-700">
                      {inventoryIssue.name} needs a quantity update before checkout.
                    </div>
                  ) : null}

                  <div className="space-y-2">
                    {[
                      { label: 'Subtotal', value: formatPrice(total) },
                      { label: 'Price source', value: 'Backend verified' },
                      { label: 'Delivery', value: total >= 499 ? 'FREE' : formatPrice(99) },
                    ].map(({ label, value }) => (
                      <div key={label} className="flex items-center justify-between text-sm">
                        <span className="text-[#7b7064]">{label}</span>
                        <span className="font-medium text-[#17110d]">{value}</span>
                      </div>
                    ))}
                  </div>

                  <div className="mt-4 flex items-center justify-between border-t border-[rgba(34,24,17,0.08)] pt-4">
                    <span className="text-base font-semibold text-[#17110d]">Total</span>
                    <span className="font-display text-3xl text-[#17110d]">{formatPrice(total)}</span>
                  </div>

                  <div className="mt-5 grid gap-3">
                    <Link to="/cart" onClick={onClose} className="btn-ghost flex w-full items-center justify-center gap-2 py-4 text-sm">
                      View cart
                    </Link>
                    <Link
                      to={inventoryIssue ? '/cart' : '/checkout'}
                      onClick={onClose}
                      className={`flex w-full items-center justify-center gap-2 rounded-full py-4 text-sm font-semibold ${
                        inventoryIssue ? 'border border-amber-200 bg-amber-50 text-amber-700' : 'btn-primary'
                      }`}
                    >
                      <Package className="h-4 w-4" />
                      {inventoryIssue ? 'Review cart quantity' : 'Proceed to Checkout'}
                      <ArrowRight className="h-4 w-4" />
                    </Link>
                  </div>

                  <p className="mt-3 text-center text-xs text-[#8a7f74]">
                    Secure checkout | demo-safe local flow | GST included
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
};

export default CartDrawer;
