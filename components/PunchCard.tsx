'use client';

import { useState } from 'react';
import { PunchCard as PunchCardType } from '@/lib/types';

interface PunchCardProps {
  card: PunchCardType;
  index: number;
}

export default function PunchCard({ card, index }: PunchCardProps) {
  const [copied, setCopied] = useState(false);

  const copyAfter = async () => {
    await navigator.clipboard.writeText(card.after);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="rounded-xl border border-white/10 bg-white/[0.03] overflow-hidden">
      {/* Header */}
      <div className="flex items-start gap-3 p-4 border-b border-white/8">
        <div className="flex-shrink-0 w-7 h-7 rounded-full bg-[#E24B4A] flex items-center justify-center text-white text-xs font-black">
          {index + 1}
        </div>
        <p className="text-white/90 text-sm leading-relaxed font-medium">{card.critique}</p>
      </div>

      {/* Before / After */}
      <div className="grid grid-cols-1 sm:grid-cols-2 divide-y sm:divide-y-0 sm:divide-x divide-white/8">
        {/* Before */}
        <div className="p-4">
          <div className="text-[10px] font-black tracking-widest text-red-400/80 uppercase mb-2">
            BEFORE
          </div>
          <p className="text-white/50 text-xs leading-relaxed font-mono bg-red-500/5 rounded-lg p-3 border border-red-500/10">
            &ldquo;{card.before}&rdquo;
          </p>
        </div>

        {/* After */}
        <div className="p-4">
          <div className="flex items-center justify-between mb-2">
            <div className="text-[10px] font-black tracking-widest text-emerald-400/80 uppercase">
              AFTER
            </div>
            <button
              onClick={copyAfter}
              title="Copy suggestion"
              className="text-white/30 hover:text-white/70 transition-colors flex items-center"
            >
              {copied ? (
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="text-emerald-400">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
                  <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
                </svg>
              )}
            </button>
          </div>
          <p className="text-white/80 text-xs leading-relaxed font-mono bg-emerald-500/5 rounded-lg p-3 border border-emerald-500/10">
            &ldquo;{card.after}&rdquo;
          </p>
        </div>
      </div>
    </div>
  );
}
