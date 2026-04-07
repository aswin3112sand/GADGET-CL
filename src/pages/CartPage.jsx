import { Link } from 'react-router-dom';
import { Minus, Plus, Trash2, ArrowRight } from 'lucide-react';
import { EmptyState } from '../components/PageFeedback';
import { clampQuantityToStock, getNumericStock, getStockLabel, isOutOfStock } from '../utils/inventory';
import { formatPrice } from '../utils/priceHelpers';

const FALLBACK_IMAGE = 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=900&q=80';

const CartPage = ({ cart, updateQuantity, removeFromCart, totalPrice }) => {
  const inventoryIssue = cart.find((item) => {
    const stock = getNumericStock(item.stockQuantity);
    return stock !== null && stock < item.qty;
  }) || null;

  if (cart.length === 0) {
    return (
      <main className="page-shell px-4 py-28 md:px-8 lg:px-16">
        <div className="mx-auto max-w-4xl">
          <EmptyState
            title="Your cart is empty"
            message="Add a few premium picks from the catalog and they will show up here for checkout."
            action={<Link to="/products" className="btn-primary inline-flex">Browse products</Link>}
          />
        </div>
      </main>
    );
  }

  return (
    <main className="page-shell">
      <section className="section-padding">
        <div className="mx-auto grid max-w-7xl gap-6 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="page-panel p-6 md:p-8">
            <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-brand-600">Cart overview</p>
            <h1 className="mt-3 font-display text-5xl text-[#17110d]">Your cart</h1>
            <div className="mt-8 space-y-4">
              {cart.map((item) => (
                <div key={item.productId} className="rounded-[1.6rem] border border-black/8 bg-white/70 p-4">
                  <div className="flex flex-col gap-4 sm:flex-row">
                    <img
                      src={item.imageUrl || FALLBACK_IMAGE}
                      alt={item.name}
                      className="h-24 w-24 rounded-[1.2rem] object-cover"
                    />
                    <div className="flex min-w-0 flex-1 flex-col justify-between gap-4 sm:flex-row sm:items-center">
                      <div className="min-w-0">
                        <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-brand-600">{item.sectionName || 'Catalog item'}</p>
                        <h2 className="mt-2 truncate text-lg font-semibold text-[#17110d]">{item.name}</h2>
                        <p className="mt-2 text-sm text-[#6d635a]">{formatPrice(item.price)} each</p>
                        <p className={`mt-2 text-[11px] font-semibold uppercase tracking-[0.18em] ${
                          isOutOfStock(item.stockQuantity)
                            ? 'text-rose-600'
                            : (getNumericStock(item.stockQuantity) !== null && getNumericStock(item.stockQuantity) <= item.qty)
                              ? 'text-amber-700'
                              : 'text-emerald-700'
                        }`}>
                          {getStockLabel(item.stockQuantity)}
                        </p>
                      </div>

                      <div className="flex flex-wrap items-center gap-3">
                        <div className="page-panel-soft flex items-center gap-1 p-1">
                          <button
                            onClick={() => updateQuantity(item.productId, item.qty - 1)}
                            className="flex h-10 w-10 items-center justify-center rounded-full text-[#6d635a] hover:bg-white hover:text-[#17110d]"
                          >
                            <Minus className="h-4 w-4" />
                          </button>
                          <span className="w-10 text-center text-sm font-semibold text-[#17110d]">{item.qty}</span>
                          <button
                            onClick={() => updateQuantity(item.productId, item.qty + 1)}
                            disabled={getNumericStock(item.stockQuantity) !== null && item.qty >= getNumericStock(item.stockQuantity)}
                            className="flex h-10 w-10 items-center justify-center rounded-full text-[#6d635a] hover:bg-white hover:text-[#17110d] disabled:cursor-not-allowed disabled:opacity-35"
                          >
                            <Plus className="h-4 w-4" />
                          </button>
                        </div>

                        <span className="min-w-24 text-right text-base font-semibold text-[#17110d]">
                          {formatPrice(item.price * item.qty)}
                        </span>

                        <button
                          onClick={() => removeFromCart(item.productId)}
                          className="flex h-10 w-10 items-center justify-center rounded-full border border-rose-500/15 text-rose-500 transition-colors hover:bg-rose-50"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="page-panel h-fit p-6 md:p-8">
            <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-brand-600">Order summary</p>
            <h2 className="mt-3 font-display text-4xl text-[#17110d]">Checkout ready</h2>
            {inventoryIssue ? (
              <div className="mt-5 rounded-[1.2rem] border border-amber-400/25 bg-amber-50 px-4 py-3 text-sm text-amber-700">
                {inventoryIssue.name} needs a quantity update before checkout can continue.
              </div>
            ) : null}

            <div className="mt-8 space-y-3 text-sm">
              <div className="flex items-center justify-between">
                <span className="text-[#6d635a]">Items total</span>
                <span className="font-semibold text-[#17110d]">{formatPrice(totalPrice)}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-[#6d635a]">Pricing source</span>
                <span className="font-semibold text-[#17110d]">Backend verified</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-[#6d635a]">Delivery</span>
                <span className="font-semibold text-[#17110d]">{totalPrice >= 499 ? 'FREE' : formatPrice(99)}</span>
              </div>
            </div>

            <div className="mt-5 border-t border-black/8 pt-5">
              <div className="flex items-center justify-between">
                <span className="text-base font-semibold text-[#17110d]">Estimated total</span>
                <span className="font-display text-3xl text-[#17110d]">{formatPrice(totalPrice)}</span>
              </div>
            </div>

            <Link
              to={inventoryIssue ? '/cart' : '/checkout'}
              className={`mt-6 flex w-full items-center justify-center gap-2 rounded-full py-4 text-sm font-semibold ${
                inventoryIssue ? 'border border-amber-200 bg-amber-50 text-amber-700' : 'btn-primary'
              }`}
            >
              {inventoryIssue ? 'Review cart quantity' : 'Proceed to secure checkout'}
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
};

export default CartPage;
