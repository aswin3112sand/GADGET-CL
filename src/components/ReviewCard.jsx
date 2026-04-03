import { Star, CheckCircle2 } from 'lucide-react';

const ReviewCard = ({ review }) => (
  <div className="glass rounded-3xl p-6 border border-white/5
                  hover:border-brand-500/20 transition-all duration-300
                  hover:-translate-y-1 w-80 flex-none">
    {/* Stars */}
    <div className="flex gap-0.5 mb-4">
      {Array.from({ length: 5 }, (_, i) => (
        <Star key={i}
              className={`w-4 h-4 ${i < review.rating ? 'text-amber-400 fill-amber-400' : 'text-white/20'}`} />
      ))}
    </div>

    {/* Review text */}
    <p className="text-white/70 text-sm leading-relaxed mb-5">
      "{review.review}"
    </p>

    {/* User */}
    <div className="flex items-center gap-3">
      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-brand-500 to-neon-blue
                      flex items-center justify-center text-white text-sm font-bold flex-none">
        {review.avatar}
      </div>
      <div>
        <div className="flex items-center gap-1.5">
          <span className="text-white font-semibold text-sm">{review.name}</span>
          {review.verified && (
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 fill-emerald-400/20" />
          )}
        </div>
        <div className="text-white/40 text-xs">{review.product} · {review.date}</div>
      </div>
    </div>
  </div>
);

export default ReviewCard;
