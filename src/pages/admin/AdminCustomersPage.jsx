import { useEffect, useMemo, useState } from 'react';
import {
  BadgeIndianRupee,
  Phone,
  ReceiptText,
  Repeat2,
  Users,
} from 'lucide-react';
import api, { apiErrorMessage } from '../../lib/api';
import AdminStatCard from '../../components/admin/AdminStatCard';
import {
  AdminEmptyState,
  AdminPageError,
  AdminPageHeader,
  AdminPageLoader,
  AdminPanel,
} from '../../components/admin/AdminUI';
import { formatPrice } from '../../utils/priceHelpers';

const formatDateTime = (value) => new Intl.DateTimeFormat('en-IN', {
  dateStyle: 'medium',
  timeStyle: 'short',
}).format(new Date(value));

const AdminCustomersPage = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const loadCustomers = async () => {
      setLoading(true);
      setError('');

      try {
        const { data } = await api.get('/admin/orders');
        setOrders(data);
      } catch (loadError) {
        setError(apiErrorMessage(loadError, 'Unable to load customer activity.'));
      } finally {
        setLoading(false);
      }
    };

    loadCustomers();
  }, []);

  const customers = useMemo(() => Object.values(
    orders.reduce((acc, order) => {
      const key = `${order.customerName}-${order.phone}`;
      const existing = acc[key];

      if (existing) {
        existing.orders += 1;
        existing.spend += Number(order.totalAmount || 0);
        if (new Date(order.createdAt) > new Date(existing.lastOrderAt)) {
          existing.lastOrderAt = order.createdAt;
        }
        return acc;
      }

      acc[key] = {
        id: key,
        name: order.customerName,
        phone: order.phone,
        spend: Number(order.totalAmount || 0),
        orders: 1,
        lastOrderAt: order.createdAt,
        pincode: order.pincode,
      };

      return acc;
    }, {}),
  ).sort((left, right) => right.spend - left.spend || right.orders - left.orders), [orders]);

  const metrics = useMemo(() => {
    const repeatCustomers = customers.filter((customer) => customer.orders > 1).length;
    const averageSpend = customers.length
      ? customers.reduce((sum, customer) => sum + customer.spend, 0) / customers.length
      : 0;

    return {
      customers: customers.length,
      repeatCustomers,
      averageSpend,
      totalOrders: orders.length,
    };
  }, [customers, orders.length]);

  if (loading) {
    return <AdminPageLoader title="Loading customers" subtitle="Preparing repeat buyer and contact activity." />;
  }

  if (error) {
    return <AdminPageError title="Customers unavailable" message={error} />;
  }

  return (
    <section className="space-y-6">
      <AdminPageHeader
        eyebrow="Customers"
        title="Customer activity"
        description="A compact view of who is buying, spending, and coming back."
      />

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <AdminStatCard
          label="Customers"
          value={metrics.customers}
          hint="Unique buyers"
          accent="from-[#f2dfb0] via-[#c9a96e] to-[#a47d3f]"
          icon={Users}
        />
        <AdminStatCard
          label="Repeat Customers"
          value={metrics.repeatCustomers}
          hint="2+ verified orders"
          accent="from-[#d8f1df] via-[#89c79a] to-[#2f7d58]"
          tone="success"
          icon={Repeat2}
        />
        <AdminStatCard
          label="Average Spend"
          value={formatPrice(metrics.averageSpend)}
          hint="Per customer"
          accent="from-[#f6e6c2] via-[#d2b07a] to-[#b58c4c]"
          icon={BadgeIndianRupee}
        />
        <AdminStatCard
          label="Orders Logged"
          value={metrics.totalOrders}
          hint="Verified orders"
          accent="from-[#f3d2d8] via-[#d18d9f] to-[#a64f66]"
          icon={ReceiptText}
        />
      </div>

      <AdminPanel
        eyebrow="Customer list"
        title={customers.length === 0 ? 'No customers yet' : `${customers.length} customer${customers.length === 1 ? '' : 's'} on record`}
        description="Use this list to scan repeat buyers and recent order history."
      >
        {customers.length === 0 ? (
          <AdminEmptyState
            title="No customer records yet"
            message="Customers will appear here once verified orders are saved."
            icon={Users}
          />
        ) : (
          <div className="overflow-hidden rounded-[1.2rem] border border-[rgba(26,18,11,0.07)] bg-white/84 shadow-[0_12px_26px_rgba(26,18,11,0.04)]">
            <div className="overflow-x-auto">
              <table className="min-w-full text-left">
                <thead className="bg-[#fcfbf8] text-[11px] uppercase tracking-[0.18em] text-[var(--ink-muted)]">
                  <tr>
                    <th className="px-5 py-4 font-semibold">Customer</th>
                    <th className="px-5 py-4 font-semibold">Phone</th>
                    <th className="px-5 py-4 font-semibold">Orders</th>
                    <th className="px-5 py-4 font-semibold">Spend</th>
                    <th className="px-5 py-4 font-semibold">Last Order</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[rgba(26,18,11,0.06)]">
                  {customers.map((customer) => (
                    <tr key={customer.id} className="transition-colors duration-300 hover:bg-[#fbf8f3]">
                      <td className="px-5 py-4">
                        <div>
                          <p className="text-sm font-semibold text-[var(--ink)]">{customer.name}</p>
                          <p className="mt-1 text-xs uppercase tracking-[0.14em] text-[var(--ink-muted)]">
                            {customer.pincode || 'No pincode'}
                          </p>
                        </div>
                      </td>
                      <td className="px-5 py-4 text-sm text-[var(--ink)]">
                        <span className="inline-flex items-center gap-2">
                          <Phone className="h-4 w-4 text-[var(--ink-muted)]" />
                          {customer.phone}
                        </span>
                      </td>
                      <td className="px-5 py-4 text-sm font-semibold text-[var(--ink)]">{customer.orders}</td>
                      <td className="px-5 py-4 text-sm font-semibold text-[var(--ink)]">{formatPrice(customer.spend)}</td>
                      <td className="px-5 py-4 text-sm text-[var(--ink-soft)]">{formatDateTime(customer.lastOrderAt)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </AdminPanel>
    </section>
  );
};

export default AdminCustomersPage;
