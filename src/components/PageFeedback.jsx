const basePanel = 'page-panel px-6 py-14 text-center';

export const PageLoader = ({ title = 'Loading...', subtitle = 'Fetching the latest data for this page.' }) => (
  <div className={basePanel}>
    <div className="mx-auto h-12 w-12 animate-spin rounded-full border-4 border-brand-200 border-t-brand-600" />
    <h2 className="mt-6 font-display text-4xl text-[#17110d]">{title}</h2>
    <p className="mt-3 text-sm text-[#6d635a]">{subtitle}</p>
  </div>
);

export const PageError = ({ title = 'Something went wrong', message, action }) => (
  <div className={basePanel}>
    <h2 className="font-display text-4xl text-[#17110d]">{title}</h2>
    <p className="mt-3 text-sm text-[#6d635a]">{message}</p>
    {action ? <div className="mt-6">{action}</div> : null}
  </div>
);

export const EmptyState = ({ title, message, action }) => (
  <div className={basePanel}>
    <h2 className="font-display text-4xl text-[#17110d]">{title}</h2>
    <p className="mt-3 text-sm text-[#6d635a]">{message}</p>
    {action ? <div className="mt-6">{action}</div> : null}
  </div>
);
