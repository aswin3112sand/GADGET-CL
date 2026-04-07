import { useMemo } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ArrowRight, ShieldCheck, ShoppingBag, Sparkles } from 'lucide-react';
import { readCheckoutSuccess } from '../utils/checkoutSuccess';
import { formatPrice } from '../utils/priceHelpers';

const formatDateTime = (value) => {
  if (!value) {
    return 'Saved just now';
  }

  return new Intl.DateTimeFormat('en-IN', {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(new Date(value));
};

const CheckoutSuccessPage = () => {
  const location = useLocation();

  const success = useMemo(
    () => location.state?.success || readCheckoutSuccess(),
    [location.state],
  );

  if (!success) {
    return (
      <main className="page-shell px-4 py-24 md:px-8 lg:px-16">
        <div className="mx-auto max-w-3xl page-panel p-8 md:p-10">
          <div className="inline-flex items-center gap-2 rounded-full border border-black/8 bg-[#f7f2ee] px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.24em] text-[#6d635a]">
            <ShieldCheck className="h-4 w-4" />
            Checkout status
          </div>

          <h1 className="mt-6 font-display text-5xl text-[#17110d]">No recent checkout found</h1>
          <p className="mt-4 max-w-2xl text-sm leading-relaxed text-[#6d635a]">
            This success page only keeps the latest verified checkout from the current tab session. Start a new checkout or review the catalog again.
          </p>

          <div className="mt-8 flex flex-wrap gap-3">
            <Link to="/products" className="btn-primary inline-flex">
              Browse products
            </Link>
            <Link to="/checkout" className="btn-ghost inline-flex">
              Back to checkout
            </Link>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="page-shell px-4 py-24 md:px-8 lg:px-16">
      <div className="mx-auto max-w-4xl space-y-6">
        <div className="page-panel overflow-hidden p-8 md:p-10">
          <div className="inline-flex items-center gap-2 rounded-full border border-emerald-500/15 bg-emerald-50 px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.24em] text-emerald-700">
            {success.demoMode ? <Sparkles className="h-4 w-4" /> : <ShieldCheck className="h-4 w-4" />}
            {success.demoMode ? 'Demo checkout saved' : 'Payment verified'}
          </div>

          <div className="mt-6 grid gap-6 xl:grid-cols-[1.15fr_0.85fr]">
            <div>
              <h1 className="font-display text-5xl text-[#17110d]">
                {success.demoMode ? 'Demo payment confirmed' : 'Order confirmed'}
              </h1>
              <p className="mt-4 max-w-2xl text-sm leading-relaxed text-[#6d635a]">
                Order #{success.orderId} has been saved successfully. This screen is now the dedicated post-payment handoff so checkout stays clean and focused.
              </p>

              <div className="mt-8 grid gap-4 md:grid-cols-2">
                <div className="rounded-[1.4rem] border border-black/8 bg-white/72 px-5 py-5">
                  <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[#8a7a70]">Payment status</p>
                  <p className="mt-3 text-2xl font-semibold text-[#17110d]">{success.paymentStatus}</p>
                  <p className="mt-2 text-sm text-[#6d635a]">{formatDateTime(success.createdAt)}</p>
                </div>

                <div className="rounded-[1.4rem] border border-black/8 bg-white/72 px-5 py-5">
                  <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[#8a7a70]">Checkout mode</p>
                  <p className="mt-3 text-2xl font-semibold text-[#17110d]">
                    {success.demoMode ? 'Demo mode' : 'Secure gateway'}
                  </p>
                  <p className="mt-2 text-sm text-[#6d635a]">
                    {success.demoMode ? 'Guided local confirmation' : 'Verified through Razorpay'}
                  </p>
                </div>
              </div>
            </div>

            <div className="rounded-[1.8rem] border border-black/8 bg-[linear-gradient(180deg,rgba(109,92,255,0.08),rgba(47,183,255,0.06))] px-6 py-6">
              <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-brand-700">Saved order summary</p>
              <div className="mt-5 rounded-[1.35rem] border border-black/8 bg-white/78 px-5 py-5">
                <div className="flex items-center justify-between gap-3 text-sm">
                  <span className="text-[#6d635a]">Order reference</span>
                  <span className="font-semibold text-[#17110d]">#{success.orderId}</span>
                </div>
                <div className="mt-3 flex items-center justify-between gap-3 text-sm">
                  <span className="text-[#6d635a]">Mode</span>
                  <span className="font-semibold text-[#17110d]">{success.demoMode ? 'Demo' : 'Secure checkout'}</span>
                </div>
                <div className="mt-3 flex items-center justify-between gap-3 text-sm">
                  <span className="text-[#6d635a]">Total saved</span>
                  <span className="font-semibold text-[#17110d]">{formatPrice(Number(success.totalAmount || 0))}</span>
                </div>
              </div>

              <div className="mt-6 space-y-3">
                <Link to="/products" className="btn-primary inline-flex w-full justify-center">
                  <ShoppingBag className="h-4 w-4" />
                  Continue shopping
                </Link>
                <Link to="/" className="btn-ghost inline-flex w-full justify-center">
                  <ArrowRight className="h-4 w-4" />
                  Back to home
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};

export default CheckoutSuccessPage;
