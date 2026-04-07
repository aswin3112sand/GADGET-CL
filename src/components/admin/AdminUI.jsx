import { AlertCircle, LoaderCircle, PackageSearch } from 'lucide-react';

const cx = (...classes) => classes.filter(Boolean).join(' ');

const chipToneClasses = {
  neutral: 'border-[rgba(34,24,17,0.08)] bg-[rgba(255,251,245,0.92)] text-[var(--ink-soft)]',
  info: 'border-[var(--admin-accent-tint-strong)] bg-[var(--admin-accent-tint)] text-[var(--admin-accent-text)]',
  success: 'border-emerald-200 bg-emerald-50 text-emerald-900',
  warning: 'border-amber-200 bg-amber-50 text-amber-900',
  danger: 'border-rose-200 bg-rose-50 text-rose-900',
};

const noticeToneClasses = {
  info: 'border-[var(--admin-accent-tint-strong)] bg-[var(--admin-accent-tint)] text-[var(--admin-accent-text)]',
  success: 'border-emerald-200 bg-emerald-50 text-emerald-900',
  warning: 'border-amber-200 bg-amber-50 text-amber-900',
  danger: 'border-rose-200 bg-rose-50 text-rose-900',
};

export const AdminChip = ({ tone = 'neutral', className = '', children }) => (
  <span className={cx('inline-flex items-center gap-2 rounded-full border px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.16em]', chipToneClasses[tone], className)}>
    {children}
  </span>
);

export const AdminPageHeader = ({
  eyebrow,
  title,
  description,
  actions,
  meta,
}) => (
  <header className="admin-page-header">
    <div className="flex flex-col gap-6 xl:flex-row xl:items-start xl:justify-between">
      <div className="max-w-3xl">
        {eyebrow ? <p className="admin-eyebrow">{eyebrow}</p> : null}
        <h1 className="mt-3 text-3xl font-semibold tracking-tight text-[var(--ink)] md:text-[2.5rem]">{title}</h1>
        {description ? <p className="mt-4 max-w-2xl text-sm leading-relaxed text-[var(--ink-soft)] md:text-[15px]">{description}</p> : null}
        {meta ? <div className="mt-5 flex flex-wrap gap-2">{meta}</div> : null}
      </div>

      {actions ? (
        <div className="flex flex-wrap items-center gap-3 xl:justify-end">
          {actions}
        </div>
      ) : null}
    </div>
  </header>
);

export const AdminPanel = ({
  eyebrow,
  title,
  description,
  actions,
  className = '',
  children,
}) => (
  <section className={cx('admin-panel min-w-0', className)}>
    {(eyebrow || title || description || actions) ? (
      <div className="flex flex-col gap-4 border-b border-[rgba(34,24,17,0.08)] pb-5 md:flex-row md:items-start md:justify-between">
        <div className="max-w-2xl">
          {eyebrow ? <p className="admin-eyebrow admin-eyebrow-muted">{eyebrow}</p> : null}
          {title ? <h2 className="mt-2 text-[1.45rem] font-semibold text-[var(--ink)]">{title}</h2> : null}
          {description ? <p className="mt-2 text-sm leading-relaxed text-[var(--ink-soft)]">{description}</p> : null}
        </div>
        {actions ? <div className="flex flex-wrap items-center gap-3">{actions}</div> : null}
      </div>
    ) : null}

    <div className={cx('min-w-0', eyebrow || title || description || actions ? 'mt-6' : '')}>
      {children}
    </div>
  </section>
);

export const AdminActionBar = ({ className = '', children }) => (
  <div className={cx('admin-action-bar space-y-4', className)}>
    {children}
  </div>
);

export const AdminNotice = ({
  tone = 'info',
  icon: Icon = AlertCircle,
  className = '',
  children,
}) => (
  <div className={cx('flex items-start gap-3 rounded-[1.15rem] border px-4 py-3 text-sm leading-relaxed', noticeToneClasses[tone], className)}>
    <Icon className="mt-0.5 h-4 w-4 flex-none" />
    <div>{children}</div>
  </div>
);

export const AdminPageLoader = ({
  title = 'Loading admin page',
  subtitle = 'Pulling the latest workspace data.',
}) => (
  <div className="admin-feedback-panel">
    <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full border border-[rgba(183,134,75,0.18)] bg-[rgba(221,195,155,0.24)] text-[#8c5d2e]">
      <LoaderCircle className="h-6 w-6 animate-spin" />
    </div>
    <h2 className="mt-6 text-3xl font-semibold text-[var(--ink)]">{title}</h2>
    <p className="mx-auto mt-3 max-w-xl text-sm leading-relaxed text-[var(--ink-soft)]">{subtitle}</p>
  </div>
);

export const AdminPageError = ({ title = 'Admin page unavailable', message, action }) => (
  <div className="admin-feedback-panel">
    <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full border border-rose-200 bg-rose-50 text-rose-700">
      <AlertCircle className="h-6 w-6" />
    </div>
    <h2 className="mt-6 text-3xl font-semibold text-[var(--ink)]">{title}</h2>
    <p className="mx-auto mt-3 max-w-xl text-sm leading-relaxed text-[var(--ink-soft)]">{message}</p>
    {action ? <div className="mt-6">{action}</div> : null}
  </div>
);

export const AdminEmptyState = ({
  title,
  message,
  action,
  icon: Icon = PackageSearch,
}) => (
  <div className="admin-feedback-panel border-dashed border-[rgba(34,24,17,0.08)] bg-[rgba(255,252,247,0.84)] shadow-none">
    <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full border border-[rgba(183,134,75,0.18)] bg-[rgba(221,195,155,0.22)] text-[#8c5d2e]">
      <Icon className="h-6 w-6" />
    </div>
    <h2 className="mt-6 text-3xl font-semibold text-[var(--ink)]">{title}</h2>
    <p className="mx-auto mt-3 max-w-xl text-sm leading-relaxed text-[var(--ink-soft)]">{message}</p>
    {action ? <div className="mt-6">{action}</div> : null}
  </div>
);
