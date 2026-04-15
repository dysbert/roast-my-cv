'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Copy, Check } from 'lucide-react';
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
    <motion.div
      initial={{ opacity: 0, x: 24 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.4, delay: Math.min(index * 0.15, 0.4), ease: "easeOut" }}
      className="rounded-xl border border-white/10 bg-white/[0.03] overflow-hidden"
    >
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
                <Check size={14} className="text-emerald-400" />
              ) : (
                <Copy size={14} />
              )}
            </button>
          </div>
          <p className="text-white/80 text-xs leading-relaxed font-mono bg-emerald-500/5 rounded-lg p-3 border border-emerald-500/10">
            &ldquo;{card.after}&rdquo;
          </p>
        </div>
      </div>
    </motion.div>
  );
}
