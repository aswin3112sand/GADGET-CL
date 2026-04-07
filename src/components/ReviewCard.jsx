import { CheckCircle2, Star } from 'lucide-react';

const ReviewCard = ({ review, className = '' }) => (
  <div className={`${className || 'w-80 flex-none'} rounded-[2rem] border border-[rgba(34,24,17,0.08)] bg-[linear-gradient(180deg,rgba(255,252,247,0.92)_0%,rgba(252,246,239,0.84)_100%)] p-6 shadow-[0_20px_42px_rgba(23,17,13,0.06)] transition-all duration-300 hover:-translate-y-1.5`}>
    <div className="mb-4 flex gap-0.5">
      {Array.from({ length: 5 }, (_, index) => (
        <Star
          key={index}
          className={`h-4 w-4 ${
            index < review.rating ? 'fill-amber-400 text-amber-400' : 'text-black/15'
          }`}
        />
      ))}
    </div>

    <p className="mb-5 text-sm leading-relaxed text-[#4d453d]">"{review.review}"</p>

    <div className="flex items-center gap-3">
      <div className="flex h-11 w-11 items-center justify-center rounded-full bg-[#17110d] text-sm font-bold text-brand-300 shadow-[0_14px_26px_rgba(23,17,13,0.16)]">
        {review.avatar}
      </div>
      <div>
        <div className="flex items-center gap-1.5">
          <span className="text-sm font-semibold text-[#17110d]">{review.name}</span>
          {review.verified && (
            <CheckCircle2 className="h-3.5 w-3.5 fill-brand-300/20 text-brand-500" />
          )}
        </div>
        <div className="text-xs text-[#7a6f64]">
          {review.product} • {review.date}
        </div>
      </div>
    </div>
  </div>
);

export default ReviewCard;
