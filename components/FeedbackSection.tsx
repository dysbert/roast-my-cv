'use client';

import { useState } from 'react';

interface FeedbackSectionProps {
  resolvedStyle: string;
}

export default function FeedbackSection({ resolvedStyle }: FeedbackSectionProps) {
  const [rating, setRating] = useState(0);
  const [hovered, setHovered] = useState(0);
  const [comment, setComment] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [validationError, setValidationError] = useState('');

  const activeLevel = hovered || rating;

  const handleSubmit = async () => {
    if (rating === 0) {
      setValidationError('Please select a rating first');
      return;
    }
    setValidationError('');
    setSubmitting(true);

    try {
      await fetch('/api/feedback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          rating,
          comment: comment.trim(),
          style: resolvedStyle,
          anonymousId: crypto.randomUUID(),
        }),
      });
      setSubmitted(true);
    } catch {
      // Non-critical — silently ignore network failures on feedback
    } finally {
      setSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <div className="rounded-xl border border-white/10 bg-white/[0.03] p-6 text-center space-y-2">
        <div className="text-3xl">🔪</div>
        <p className="text-white font-bold text-sm">
          Thanks for the feedback! It helps us get sharper. 🔪
        </p>
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-white/10 bg-white/[0.03] p-6 space-y-5">
      <h2 className="text-white font-black text-base uppercase tracking-widest flex items-center gap-2">
        <span className="text-[#E24B4A]" aria-hidden>{'// '}</span> Rate this roast
      </h2>

      {/* Knife rating */}
      <div className="flex gap-3" onMouseLeave={() => setHovered(0)}>
        {[1, 2, 3, 4, 5].map((n) => (
          <button
            key={n}
            onClick={() => { setRating(n); setValidationError(''); }}
            onMouseEnter={() => setHovered(n)}
            title={`${n} knife${n > 1 ? 's' : ''}`}
            className={`
              text-2xl transition-all duration-150 select-none
              ${n <= activeLevel
                ? 'opacity-100 scale-110 drop-shadow-[0_0_6px_rgba(226,75,74,0.7)]'
                : 'opacity-20 hover:opacity-50'
              }
            `}
          >
            🔪
          </button>
        ))}
      </div>

      {validationError && (
        <p className="text-[#E24B4A] text-xs font-medium">{validationError}</p>
      )}

      {/* Comment */}
      <textarea
        value={comment}
        onChange={(e) => setComment(e.target.value)}
        placeholder="Tell us what you think..."
        rows={3}
        className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white/80 text-sm placeholder:text-white/20 focus:outline-none focus:border-white/30 resize-none"
      />

      <button
        onClick={handleSubmit}
        disabled={submitting}
        className="px-5 py-2.5 rounded-xl bg-white/10 hover:bg-white/15 text-white font-bold text-sm transition-colors disabled:opacity-50"
      >
        {submitting ? 'Sending...' : 'Send feedback'}
      </button>
    </div>
  );
}
