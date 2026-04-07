import { ArrowDownRight, ArrowUpRight, Minus, TrendingUp } from 'lucide-react';

const toneClasses = {
  neutral: 'bg-[rgba(201,169,110,0.14)] text-[#7c6338]',
  info: 'bg-sky-50 text-sky-700',
  success: 'bg-emerald-50 text-emerald-700',
  warning: 'bg-amber-50 text-amber-700',
  danger: 'bg-rose-50 text-rose-700',
};

const AdminStatCard = ({
  label,
  value,
  hint,
  trend,
  trendDirection = 'flat',
  accent = 'from-[#f2dfb0] via-[#c9a96e] to-[#a47d3f]',
  tone = 'neutral',
  icon: Icon = TrendingUp,
}) => {
  const TrendIcon = trendDirection === 'up' ? ArrowUpRight : trendDirection === 'down' ? ArrowDownRight : Minus;
  const trendClasses = trendDirection === 'up'
    ? 'text-emerald-700 bg-emerald-50'
    : trendDirection === 'down'
      ? 'text-rose-700 bg-rose-50'
      : 'text-[var(--ink-muted)] bg-[rgba(26,18,11,0.05)]';

  return (
    <div className="group h-full rounded-[1.25rem] border border-[rgba(26,18,11,0.07)] bg-white/86 p-5 shadow-[0_14px_28px_rgba(26,18,11,0.05)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_20px_34px_rgba(26,18,11,0.08)]">
      <div className="flex items-start justify-between gap-4">
        <div className={`flex h-12 w-12 items-center justify-center rounded-[1rem] ${toneClasses[tone]}`}>
          <Icon className="h-5 w-5" />
        </div>
        <div className={`h-2 w-14 rounded-full bg-gradient-to-r ${accent}`} />
      </div>

      <div className="mt-8 text-center">
        <div className="text-[2.2rem] font-semibold tracking-tight text-[var(--ink)] md:text-[2.5rem]">
          {value}
        </div>
        <p className="mt-3 text-sm font-semibold text-[var(--ink)]">{label}</p>
        {hint ? <p className="mt-1 text-xs uppercase tracking-[0.14em] text-[var(--ink-muted)]">{hint}</p> : null}
      </div>

      {trend ? (
        <div className="mt-5 flex items-center justify-center">
          <span className={`inline-flex items-center gap-1 rounded-full px-3 py-1 text-[11px] font-semibold ${trendClasses}`}>
            <TrendIcon className="h-3.5 w-3.5" />
            {trend}
          </span>
        </div>
      ) : null}
    </div>
  );
};

export default AdminStatCard;
