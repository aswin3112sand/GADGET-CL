import { CircleDashed, Search, Sparkles, Trash2 } from 'lucide-react';
import { PRODUCT_FILTERS } from '../../utils/productWorkflow';
import { formatPrice } from '../../utils/priceHelpers';

const statusToneClasses = {
  success: 'bg-emerald-50 text-emerald-900',
  warning: 'bg-amber-50 text-amber-900',
  danger: 'bg-rose-50 text-rose-900',
  info: 'bg-[var(--admin-accent-tint)] text-[var(--admin-accent-text)]',
};

const ProductWorkflowQueue = ({
  queueRef,
  search,
  setSearch,
  searchParams,
  setSearchParams,
  queueFilter,
  setQueueFilter,
  filteredProducts,
  getProductStatus,
  onFixProduct,
  confirmDeleteId,
  setConfirmDeleteId,
  onDeleteProduct,
}) => (
  <div ref={queueRef} className="space-y-6">
    <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
      <div className="flex flex-wrap gap-2">
        {PRODUCT_FILTERS.map((filter) => (
          <button
            key={filter.value}
            type="button"
            onClick={() => {
              setQueueFilter(filter.value);
              const next = new URLSearchParams(searchParams);
              if (filter.value === 'ALL') {
                next.delete('workflow');
              } else {
                next.set('workflow', filter.value === 'STOCK' ? 'stock' : 'media');
              }
              setSearchParams(next, { replace: true });
            }}
            className={queueFilter === filter.value ? 'admin-primary-button' : 'admin-ghost-button'}
          >
            {filter.label}
          </button>
        ))}
      </div>

      <div className="relative w-full max-w-md">
        <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--ink-muted)]" />
        <input
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          className="admin-dark-field pl-11"
          placeholder="Search by product, brand, SKU, or category"
        />
      </div>
    </div>

    <div className="overflow-hidden rounded-[1.2rem] border border-[rgba(26,18,11,0.07)] bg-white/88 shadow-[0_12px_26px_rgba(26,18,11,0.04)]">
      <div className="overflow-x-auto">
        <table className="min-w-full text-left">
          <thead className="bg-[#fcfbf8] text-[11px] uppercase tracking-[0.18em] text-[var(--ink-muted)]">
            <tr>
              <th className="px-5 py-4 font-semibold">Product</th>
              <th className="px-5 py-4 font-semibold">Status</th>
              <th className="px-5 py-4 font-semibold">Price</th>
              <th className="px-5 py-4 font-semibold">SKU</th>
              <th className="px-5 py-4 font-semibold text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[rgba(26,18,11,0.06)]">
            {filteredProducts.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-5 py-8">
                  <div className="flex flex-col items-center gap-3 text-center">
                    <CircleDashed className="h-6 w-6 text-[var(--admin-accent-text)]" />
                    <p className="text-sm font-semibold text-[var(--ink)]">No products in this queue</p>
                  </div>
                </td>
              </tr>
            ) : (
              filteredProducts.map((product) => {
                const status = getProductStatus(product);
                const isConfirmingDelete = confirmDeleteId === product.id;

                return (
                  <tr key={product.id} className="transition-colors duration-300 hover:bg-[#fbf8f3]">
                    <td className="px-5 py-4">
                      <div>
                        <p className="text-sm font-semibold text-[var(--ink)]">{product.name}</p>
                        <p className="mt-1 text-xs uppercase tracking-[0.14em] text-[var(--ink-muted)]">
                          {(product.brand || 'Brand')} | {product.sectionName || 'Unassigned'}
                        </p>
                      </div>
                    </td>
                    <td className="px-5 py-4">
                      <span className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${statusToneClasses[status.tone]}`}>
                        {status.label}
                      </span>
                    </td>
                    <td className="px-5 py-4 text-sm font-semibold text-[var(--ink)]">{formatPrice(Number(product.price || 0))}</td>
                    <td className="px-5 py-4 text-sm text-[var(--ink-soft)]">{product.sku || 'Pending SKU'}</td>
                    <td className="px-5 py-4">
                      <div className="flex justify-end gap-2">
                        <button
                          type="button"
                          onClick={() => onFixProduct(product, status.focus)}
                          className="admin-ghost-button"
                        >
                          <Sparkles className="h-4 w-4" />
                          Fix Now
                        </button>
                        <button
                          type="button"
                          onClick={() => setConfirmDeleteId((current) => (current === product.id ? null : product.id))}
                          className="admin-danger-button"
                        >
                          <Trash2 className="h-4 w-4" />
                          Delete
                        </button>
                      </div>
                      {isConfirmingDelete ? (
                        <div className="mt-3 rounded-[1rem] border border-rose-200 bg-rose-50 px-4 py-3 text-left text-sm text-rose-800">
                          <p className="font-semibold">Delete this product?</p>
                          <div className="mt-3 flex gap-2">
                            <button type="button" onClick={() => onDeleteProduct(product.id)} className="admin-danger-button">
                              Confirm
                            </button>
                            <button type="button" onClick={() => setConfirmDeleteId(null)} className="admin-ghost-button">
                              Cancel
                            </button>
                          </div>
                        </div>
                      ) : null}
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  </div>
);

export default ProductWorkflowQueue;
