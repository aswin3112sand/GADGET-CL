import { useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, CheckCircle2, LoaderCircle, ShieldCheck, Sparkles } from 'lucide-react';
import api, { apiErrorMessage } from '../lib/api';
import { EmptyState } from '../components/PageFeedback';
import { saveCheckoutSuccess } from '../utils/checkoutSuccess';
import { loadRazorpayScript } from '../utils/loadRazorpay';
import { getNumericStock } from '../utils/inventory';
import { formatPrice } from '../utils/priceHelpers';

const FALLBACK_IMAGE = 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=900&q=80';
const DEMO_SIGNATURE = 'demo-signature';

const initialForm = {
  customerName: '',
  phone: '',
  address: '',
  pincode: '',
};

const buildDemoVerificationPayload = (orderData) => ({
  razorpayOrderId: orderData.razorpayOrderId,
  razorpayPaymentId: `demo_pay_${orderData.razorpayOrderId.slice(-10)}`,
  razorpaySignature: DEMO_SIGNATURE,
  checkoutToken: orderData.checkoutToken,
});

const CheckoutPage = ({ cart, totalPrice, clearCart }) => {
  const navigate = useNavigate();
  const [form, setForm] = useState(initialForm);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [pendingDemoOrder, setPendingDemoOrder] = useState(null);

  const itemsPayload = useMemo(
    () => cart.map((item) => ({ productId: item.productId, quantity: item.qty })),
    [cart],
  );

  const inventoryIssue = useMemo(() => cart.find((item) => {
    const stock = getNumericStock(item.stockQuantity);
    return stock !== null && stock < item.qty;
  }) || null, [cart]);

  const verifyOrder = async (orderData, payload) => {
    setSubmitting(true);
    setError('');

    try {
      const { data: verification } = await api.post('/verify-payment', payload);
      saveCheckoutSuccess(verification);
      clearCart();
      setForm(initialForm);
      setPendingDemoOrder(null);
      navigate('/checkout/success', {
        replace: true,
        state: { success: verification },
      });
    } catch (verifyError) {
      setError(apiErrorMessage(verifyError, 'Payment completed, but verification failed.'));
    } finally {
      setSubmitting(false);
    }
  };

  if (cart.length === 0) {
    return (
      <main className="page-shell px-4 py-28 md:px-8 lg:px-16">
        <div className="mx-auto max-w-4xl">
          <EmptyState
            title="Nothing to checkout"
            message="Your cart is empty right now. Add products first, then come back for payment."
            action={<Link to="/products" className="btn-primary inline-flex">Browse products</Link>}
          />
        </div>
      </main>
    );
  }

  const handlePayment = async (event) => {
    event.preventDefault();
    setSubmitting(true);
    setError('');

    try {
      const { data: orderData } = await api.post('/create-order', {
        ...form,
        items: itemsPayload,
      });

      if (orderData.demoMode) {
        setPendingDemoOrder(orderData);
        setSubmitting(false);
        return;
      }

      const razorpayReady = await loadRazorpayScript();
      if (!razorpayReady) {
        throw new Error('Razorpay checkout script could not be loaded.');
      }

      const key = orderData.keyId || import.meta.env.VITE_RAZORPAY_KEY_ID;
      if (!key) {
        throw new Error('Razorpay test key is not configured.');
      }

      const razorpay = new window.Razorpay({
        key,
        amount: orderData.amount,
        currency: orderData.currency,
        order_id: orderData.razorpayOrderId,
        name: 'Gadget69',
        description: 'Secure storefront checkout',
        prefill: {
          name: form.customerName,
          contact: form.phone,
        },
        theme: {
          color: '#6d5cff',
        },
        modal: {
          ondismiss: () => {
            setSubmitting(false);
            setError('Payment was cancelled before verification.');
          },
        },
        handler: async (response) => {
          await verifyOrder(orderData, {
            razorpayOrderId: response.razorpay_order_id,
            razorpayPaymentId: response.razorpay_payment_id,
            razorpaySignature: response.razorpay_signature,
            checkoutToken: orderData.checkoutToken,
          });
        },
      });

      razorpay.on('payment.failed', (failedEvent) => {
        setSubmitting(false);
        setError(failedEvent.error?.description || 'Payment failed. Please try again.');
      });

      razorpay.open();
    } catch (paymentError) {
      setSubmitting(false);
      setError(apiErrorMessage(paymentError, 'Unable to initiate secure checkout.'));
    }
  };

  return (
    <main className="page-shell">
      <section className="section-padding">
        <div className="mx-auto max-w-7xl">
          <Link
            to="/cart"
            className="mb-8 inline-flex items-center gap-2 text-sm text-[#6d635a] transition-colors hover:text-[#17110d]"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to cart
          </Link>

          <div className="grid gap-6 xl:grid-cols-[1.05fr_0.95fr]">
            <form onSubmit={handlePayment} className="page-panel relative overflow-hidden p-6 md:p-8">
              <div className="absolute inset-0 rounded-[2rem] border border-transparent bg-[linear-gradient(135deg,rgba(109,92,255,0.16),rgba(47,183,255,0.12))] opacity-70" />
              <div className="relative">
                <div className="inline-flex items-center gap-2 rounded-full border border-brand-500/18 bg-brand-50 px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.26em] text-brand-700">
                  <ShieldCheck className="h-4 w-4" />
                  Verified checkout
                </div>
                <h1 className="mt-5 font-display text-5xl text-[#17110d]">Complete your order</h1>
                <p className="mt-3 max-w-2xl text-sm leading-relaxed text-[#6d635a]">
                  Pricing and stock are revalidated on the backend right before the order is finalized. If local payment keys are missing, this flow switches to a guided premium demo instead of breaking.
                </p>

                <div className="mt-8 grid gap-4">
                  <label className="block">
                    <span className="mb-2 block text-sm font-medium text-[#17110d]">Name</span>
                    <input
                      required
                      value={form.customerName}
                      onChange={(event) => setForm((current) => ({ ...current, customerName: event.target.value }))}
                      className="field-input"
                      placeholder="Your full name"
                    />
                  </label>

                  <label className="block">
                    <span className="mb-2 block text-sm font-medium text-[#17110d]">Phone</span>
                    <input
                      required
                      pattern="^[6-9][0-9]{9}$"
                      value={form.phone}
                      onChange={(event) => setForm((current) => ({
                        ...current,
                        phone: event.target.value.replace(/\D/g, '').slice(0, 10),
                      }))}
                      className="field-input"
                      placeholder="9876543210"
                    />
                  </label>

                  <label className="block">
                    <span className="mb-2 block text-sm font-medium text-[#17110d]">Address</span>
                    <textarea
                      required
                      rows={4}
                      value={form.address}
                      onChange={(event) => setForm((current) => ({ ...current, address: event.target.value }))}
                      className="field-input"
                      placeholder="House, street, area, city"
                    />
                  </label>

                  <label className="block">
                    <span className="mb-2 block text-sm font-medium text-[#17110d]">Pincode</span>
                    <input
                      required
                      pattern="^[0-9]{6}$"
                      value={form.pincode}
                      onChange={(event) => setForm((current) => ({
                        ...current,
                        pincode: event.target.value.replace(/\D/g, '').slice(0, 6),
                      }))}
                      className="field-input"
                      placeholder="600001"
                    />
                  </label>
                </div>

                {inventoryIssue ? (
                  <div className="mt-5 rounded-[1.2rem] border border-amber-400/25 bg-amber-50 px-4 py-3 text-sm text-amber-700">
                    {inventoryIssue.name} no longer has enough stock for quantity {inventoryIssue.qty}. Please update your cart before continuing.
                  </div>
                ) : null}

                {error ? (
                  <div className="mt-5 rounded-[1.2rem] border border-rose-500/15 bg-rose-50 px-4 py-3 text-sm text-rose-600">
                    {error}
                  </div>
                ) : null}

                <button
                  type="submit"
                  disabled={submitting || Boolean(inventoryIssue)}
                  className="mt-6 flex w-full items-center justify-center gap-3 rounded-full bg-[linear-gradient(135deg,#6d5cff_0%,#2fb7ff_100%)] px-6 py-4 text-sm font-semibold text-white shadow-[0_24px_48px_rgba(47,183,255,0.2)] transition-all duration-300 hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-70"
                >
                  {submitting ? <LoaderCircle className="h-4 w-4 animate-spin" /> : null}
                  {submitting ? 'Preparing checkout...' : 'Continue to payment'}
                </button>
              </div>
            </form>

            <aside className="page-panel h-fit p-6 md:p-8">
              <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-brand-600">Order summary</p>
              <h2 className="mt-3 font-display text-4xl text-[#17110d]">Ready to review</h2>

              <div className="mt-6 space-y-3">
                {cart.map((item) => {
                  const stock = getNumericStock(item.stockQuantity);
                  const limited = stock !== null && stock <= item.qty;
                  return (
                    <div key={item.productId} className="rounded-[1.3rem] border border-black/8 bg-white/70 px-4 py-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={item.imageUrl || FALLBACK_IMAGE}
                          alt={item.name}
                          className="h-16 w-16 rounded-[1rem] object-cover"
                        />
                        <div className="min-w-0 flex-1">
                          <p className="truncate text-sm font-semibold text-[#17110d]">{item.name}</p>
                          <p className="mt-1 text-xs text-[#6d635a]">Qty {item.qty}</p>
                          <p className={`mt-2 text-[11px] font-semibold uppercase tracking-[0.18em] ${limited ? 'text-amber-700' : 'text-emerald-700'}`}>
                            {stock === null ? 'Verified at checkout' : stock === 0 ? 'Unavailable in cart' : limited ? `Exactly ${stock} left` : `${stock} in stock`}
                          </p>
                        </div>
                        <span className="text-sm font-semibold text-[#17110d]">
                          {formatPrice(item.price * item.qty)}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="mt-6 space-y-2 text-sm">
                <div className="flex items-center justify-between">
                  <span className="text-[#6d635a]">Subtotal</span>
                  <span className="font-semibold text-[#17110d]">{formatPrice(totalPrice)}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-[#6d635a]">Validation</span>
                  <span className="font-semibold text-[#17110d]">Backend price + stock</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-[#6d635a]">Local fallback</span>
                  <span className="font-semibold text-[#17110d]">Premium demo checkout</span>
                </div>
              </div>

              <div className="mt-5 border-t border-black/8 pt-5">
                <div className="flex items-center justify-between">
                  <span className="text-base font-semibold text-[#17110d]">Total payable</span>
                  <span className="font-display text-3xl text-[#17110d]">{formatPrice(totalPrice)}</span>
                </div>
              </div>
            </aside>
          </div>
        </div>
      </section>

      {pendingDemoOrder ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[rgba(17,12,9,0.58)] px-4 backdrop-blur-sm">
          <div className="w-full max-w-xl rounded-[2rem] border border-white/10 bg-[linear-gradient(180deg,#1b1220_0%,#110d18_100%)] p-8 text-white shadow-[0_30px_90px_rgba(6,4,15,0.45)]">
            <div className="inline-flex items-center gap-2 rounded-full border border-cyan-300/20 bg-cyan-400/10 px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.24em] text-cyan-100">
              <Sparkles className="h-4 w-4" />
              Demo mode
            </div>
            <h2 className="mt-5 font-display text-4xl">Guided payment preview</h2>
            <p className="mt-3 text-sm leading-relaxed text-white/68">
              Razorpay keys are not available locally, so this build is switching to a polished demo confirmation. Your order will still be verified, saved, and reflected across the admin workflow.
            </p>

            <div className="mt-6 rounded-[1.4rem] border border-white/10 bg-white/5 px-5 py-5 text-sm">
              <div className="flex items-center justify-between">
                <span className="text-white/58">Order total</span>
                <span className="font-semibold text-white">{formatPrice(totalPrice)}</span>
              </div>
              <div className="mt-3 flex items-center justify-between">
                <span className="text-white/58">Flow</span>
                <span className="font-semibold text-cyan-100">Demo checkout confirmation</span>
              </div>
            </div>

            <div className="mt-8 flex flex-wrap gap-3">
              <button
                type="button"
                onClick={() => verifyOrder(pendingDemoOrder, buildDemoVerificationPayload(pendingDemoOrder))}
                disabled={submitting}
                className="inline-flex flex-1 items-center justify-center gap-2 rounded-full bg-[linear-gradient(135deg,#6d5cff_0%,#2fb7ff_100%)] px-6 py-3.5 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:opacity-70"
              >
                {submitting ? <LoaderCircle className="h-4 w-4 animate-spin" /> : <CheckCircle2 className="h-4 w-4" />}
                {submitting ? 'Saving demo order...' : 'Confirm demo payment'}
              </button>
              <button
                type="button"
                onClick={() => setPendingDemoOrder(null)}
                disabled={submitting}
                className="inline-flex items-center justify-center rounded-full border border-white/12 bg-white/6 px-6 py-3.5 text-sm font-semibold text-white/84 disabled:cursor-not-allowed disabled:opacity-50"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </main>
  );
};

export default CheckoutPage;
