'use client';

import { useEffect, useRef, useState } from 'react';
import { RoastResult } from '@/lib/types';
import PunchCard from './PunchCard';
import ScoreBar from './ScoreBar';
import FeedbackSection from './FeedbackSection';

interface ResultsViewProps {
  result: RoastResult;
  onNewRoast: () => void;
}

export default function ResultsView({ result, onNewRoast }: ResultsViewProps) {
  const [copiedAll, setCopiedAll] = useState(false);
  const [showShareMenu, setShowShareMenu] = useState(false);
  const shareMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (shareMenuRef.current && !shareMenuRef.current.contains(e.target as Node)) {
        setShowShareMenu(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const copyAllSuggestions = async () => {
    const suggestions = result.roastCards
      .map((c, i) => `${i + 1}. BEFORE: "${c.before}"\n   AFTER: "${c.after}"`)
      .join('\n\n');
    await navigator.clipboard.writeText(suggestions);
    setCopiedAll(true);
    setTimeout(() => setCopiedAll(false), 2000);
  };

  const shareText = `My CV just got roasted 🔥\n\nVerdict: "${result.veredicto}"\nScore: ${result.score.emoji} ${result.score.label}\n\nGet yours roasted at roastmycv.app`;

  const shareOnTwitter = () => {
    const url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}`;
    window.open(url, '_blank', 'noopener,noreferrer');
    setShowShareMenu(false);
  };

  const shareOnLinkedIn = () => {
    const url = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent('https://roastmycv.app')}`;
    window.open(url, '_blank', 'noopener,noreferrer');
    setShowShareMenu(false);
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-8 space-y-8">

      {/* Header card */}
      <div className="rounded-2xl border border-white/10 bg-white/[0.03] overflow-hidden">
        <div className="grid grid-cols-1 sm:grid-cols-2 divide-y sm:divide-y-0 sm:divide-x divide-white/10">
          {/* Verdict */}
          <div className="p-6">
            <div className="text-[10px] font-black tracking-widest text-[#E24B4A] uppercase mb-3">
              Verdict
            </div>
            <p className="text-white text-lg font-bold leading-snug">{result.veredicto}</p>
          </div>

          {/* Score */}
          <div className="p-6 flex flex-col items-center justify-center gap-2">
            <div className="text-[10px] font-black tracking-widest text-white/40 uppercase mb-1">
              CV Score
            </div>
            <div className="text-6xl">{result.score.emoji}</div>
            <div className="text-white font-black text-xl tracking-wide">
              {result.score.label}
            </div>
          </div>
        </div>

        {/* Score bar */}
        <div className="px-6 pb-6">
          <ScoreBar active={result.score.level} />
        </div>
      </div>

      {/* What's working */}
      {result.strengths && result.strengths.length > 0 && (
        <section>
          <h2 className="text-white font-black text-lg uppercase tracking-widest mb-4 flex items-center gap-2">
            <span className="text-emerald-400" aria-hidden>{'// '}</span> What&apos;s Working 💪
          </h2>
          <div className="rounded-xl border border-emerald-500/20 bg-emerald-500/[0.04] divide-y divide-white/8 overflow-hidden">
            {result.strengths.map((s, i) => (
              <div key={i} className="px-4 py-4 flex items-start gap-3">
                <span className="text-emerald-400 mt-0.5 flex-shrink-0">✓</span>
                <p className="text-white/80 text-sm leading-relaxed">{s}</p>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* The Roast */}
      <section>
        <h2 className="text-white font-black text-lg uppercase tracking-widest mb-4 flex items-center gap-2">
          <span className="text-[#E24B4A]" aria-hidden>{'// '}</span> The Roast
        </h2>
        <div className="space-y-4">
          {result.roastCards.map((card, i) => (
            <PunchCard key={i} card={card} index={i} />
          ))}
        </div>
      </section>

      {/* Fix these first */}
      {result.priorities && result.priorities.length > 0 && (
        <section>
          <h2 className="text-white font-black text-lg uppercase tracking-widest mb-4 flex items-center gap-2">
            <span className="text-amber-400" aria-hidden>{'// '}</span> Fix These First ⚡
          </h2>
          <div className="rounded-xl border border-amber-500/20 bg-amber-500/[0.04] divide-y divide-white/8 overflow-hidden">
            {result.priorities.map((p, i) => (
              <div key={i} className="px-4 py-4 flex items-start gap-3">
                <span className="flex-shrink-0 w-5 h-5 rounded-full bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400 text-[10px] font-black mt-0.5">
                  {i + 1}
                </span>
                <p className="text-white/80 text-sm leading-relaxed">{p}</p>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Clichés */}
      {result.cliches && result.cliches.length > 0 && (
        <section>
          <h2 className="text-white font-black text-lg uppercase tracking-widest mb-4 flex items-center gap-2">
            <span className="text-[#E24B4A]" aria-hidden>{'// '}</span> Words Killing Your CV
          </h2>
          <div className="rounded-xl border border-white/10 bg-white/[0.03] divide-y divide-white/8 overflow-hidden">
            {result.cliches.map((c, i) => (
              <div key={i} className="px-4 py-3 flex items-start gap-3">
                <span className="text-[#E24B4A] text-sm mt-0.5">✕</span>
                <div>
                  <span className="text-white font-bold text-sm">&ldquo;{c.word}&rdquo;</span>
                  <p className="text-white/40 text-xs mt-0.5 leading-relaxed">
                    context: {c.context}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* AI Detected */}
      {result.aiDetected && result.aiCard && (
        <section>
          <h2 className="text-white font-black text-lg uppercase tracking-widest mb-4 flex items-center gap-2">
            <span className="text-[#E24B4A]" aria-hidden>{'// '}</span> AI Content Detected 🤖
          </h2>
          <PunchCard card={result.aiCard} index={0} />
        </section>
      )}

      {/* Feedback */}
      <FeedbackSection resolvedStyle={result.resolvedStyle ?? 'unknown'} />

      {/* Action row */}
      <div className="flex flex-wrap gap-3 pt-2">
        {/* Share dropdown */}
        <div className="relative" ref={shareMenuRef}>
          <button
            onClick={() => setShowShareMenu((v) => !v)}
            className="flex-1 sm:flex-none px-5 py-3 rounded-xl bg-[#E24B4A] hover:bg-[#c93b3a] text-white font-bold text-sm transition-colors"
          >
            ↗ Share Result
          </button>
          {showShareMenu && (
            <div className="absolute bottom-full mb-2 left-0 min-w-[180px] rounded-xl border border-white/10 bg-[#141414] shadow-xl overflow-hidden z-10">
              <button
                onClick={shareOnTwitter}
                className="w-full px-4 py-3 text-left text-white/80 hover:text-white hover:bg-white/5 text-sm font-medium transition-colors flex items-center gap-2"
              >
                <span>𝕏</span> Share on X (Twitter)
              </button>
              <button
                onClick={shareOnLinkedIn}
                className="w-full px-4 py-3 text-left text-white/80 hover:text-white hover:bg-white/5 text-sm font-medium transition-colors flex items-center gap-2 border-t border-white/8"
              >
                <span className="text-[#0077B5]">in</span> Share on LinkedIn
              </button>
            </div>
          )}
        </div>

        <button
          onClick={copyAllSuggestions}
          className="flex-1 sm:flex-none px-5 py-3 rounded-xl border border-white/20 hover:border-white/40 text-white/80 hover:text-white font-bold text-sm transition-colors"
        >
          {copiedAll ? '✓ Copied' : '⎘ Copy Suggestions'}
        </button>
        <button
          onClick={onNewRoast}
          className="flex-1 sm:flex-none px-5 py-3 rounded-xl border border-white/20 hover:border-white/40 text-white/80 hover:text-white font-bold text-sm transition-colors"
        >
          ↺ New Roast
        </button>
      </div>
    </div>
  );
}
