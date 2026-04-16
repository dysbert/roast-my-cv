'use client';

import { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { Share2, Copy, Check, RotateCcw, CheckCircle, Star, Flame, Zap, MessageCircle, Heart, Bot } from 'lucide-react';
import { RoastResult } from '@/lib/types';
import PunchCard from './PunchCard';
import ScoreBar from './ScoreBar';
import FeedbackSection from './FeedbackSection';

interface ResultsViewProps {
  result: RoastResult;
  onNewRoast: () => void;
}

interface NavItem {
  id: string;
  label: string;
  Icon: React.ElementType;
}

export default function ResultsView({ result, onNewRoast }: ResultsViewProps) {
  const [copiedAll, setCopiedAll] = useState(false);
  const [showShareMenu, setShowShareMenu] = useState(false);
  const [activeSection, setActiveSection] = useState('verdict');
  const shareMenuRef = useRef<HTMLDivElement>(null);
  const navRef = useRef<HTMLDivElement>(null);

  // Build nav items based on which sections actually exist in the result
  const navItems: NavItem[] = [
    { id: 'verdict', label: 'Verdict', Icon: CheckCircle },
    ...(result.strengths && result.strengths.length > 0
      ? [{ id: 'strengths', label: 'Strengths', Icon: Star }]
      : []),
    { id: 'roast', label: 'The Roast', Icon: Flame },
    ...(result.priorities && result.priorities.length > 0
      ? [{ id: 'fix-first', label: 'Fix First', Icon: Zap }]
      : []),
    ...(result.cliches && result.cliches.length > 0
      ? [{ id: 'words', label: 'Words', Icon: MessageCircle }]
      : []),
    ...(result.aiDetected && result.aiCard
      ? [{ id: 'ai', label: 'AI Content', Icon: Bot }]
      : []),
    { id: 'rate', label: 'Rate it', Icon: Heart },
  ];

  // IntersectionObserver — mark the topmost visible section as active
  useEffect(() => {
    const sectionIds = navItems.map((n) => n.id);
    const observers: IntersectionObserver[] = [];

    sectionIds.forEach((id) => {
      const el = document.getElementById(id);
      if (!el) return;
      const obs = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            setActiveSection(id);
          }
        },
        { rootMargin: '-15% 0px -70% 0px', threshold: 0 }
      );
      obs.observe(el);
      observers.push(obs);
    });

    return () => observers.forEach((o) => o.disconnect());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Scroll active pill into view within the nav bar
  useEffect(() => {
    const nav = navRef.current;
    if (!nav) return;
    const pill = nav.querySelector<HTMLElement>(`[data-id="${activeSection}"]`);
    if (pill) {
      pill.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
    }
  }, [activeSection]);

  const scrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (!el) return;
    el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

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

  const shareText = `My CV just got roasted 🔥\n\nVerdict: "${result.veredicto}"\nScore: ${result.score.emoji} ${result.score.label}\n\nGet yours roasted at roastmycv.live`;

  const shareOnTwitter = () => {
    const url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}`;
    window.open(url, '_blank', 'noopener,noreferrer');
    setShowShareMenu(false);
  };

  const shareOnLinkedIn = () => {
    const url = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent('https://roastmycv.live')}`;
    window.open(url, '_blank', 'noopener,noreferrer');
    setShowShareMenu(false);
  };

  const fadeUp = (delay = 0) => ({
    initial: { opacity: 0, y: 16 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.4, delay, ease: 'easeOut' as const },
  });

  return (
    <>
      {/* ─── Sticky section nav ─────────────────────────────────── */}
      <div
        className="sticky top-0 z-10"
        style={{ background: '#0a0a0a', borderBottom: '0.5px solid #1e1e1e' }}
      >
        <div
          ref={navRef}
          className="max-w-3xl mx-auto px-4 flex overflow-x-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]"
        >
          {navItems.map(({ id, label, Icon }) => {
            const isActive = activeSection === id;
            return (
              <button
                key={id}
                data-id={id}
                onClick={() => scrollTo(id)}
                className="flex items-center gap-1.5 px-3 py-3 text-[12px] font-medium whitespace-nowrap transition-colors duration-150 border-b-2 flex-shrink-0"
                style={{
                  color: isActive ? '#E24B4A' : '#555',
                  borderBottomColor: isActive ? '#E24B4A' : 'transparent',
                }}
              >
                <Icon size={13} strokeWidth={isActive ? 2.5 : 2} />
                {label}
              </button>
            );
          })}
        </div>
      </div>

      {/* ─── Content ────────────────────────────────────────────── */}
      <div className="max-w-3xl mx-auto px-4 py-8 space-y-8">

        {/* Verdict + Score — scroll-mt accounts for sticky nav height */}
        <motion.div id="verdict" {...fadeUp(0)} className="rounded-2xl border border-white/10 bg-white/[0.03] overflow-hidden scroll-mt-16">
          <div className="grid grid-cols-1 sm:grid-cols-2 divide-y sm:divide-y-0 sm:divide-x divide-white/10">
            <div className="p-6">
              <div className="text-[10px] font-black tracking-widest text-[#E24B4A] uppercase mb-3">
                Verdict
              </div>
              <p className="text-white text-lg font-bold leading-snug">{result.veredicto}</p>
            </div>
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
          <div className="px-6 pb-6">
            <ScoreBar active={result.score.level} />
          </div>
        </motion.div>

        {/* What's working */}
        {result.strengths && result.strengths.length > 0 && (
          <motion.section id="strengths" {...fadeUp(0.1)} className="scroll-mt-16">
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
          </motion.section>
        )}

        {/* The Roast */}
        <motion.section id="roast" {...fadeUp(0.15)} className="scroll-mt-16">
          <h2 className="text-white font-black text-lg uppercase tracking-widest mb-4 flex items-center gap-2">
            <span className="text-[#E24B4A]" aria-hidden>{'// '}</span> The Roast
          </h2>
          <div className="space-y-4">
            {result.roastCards.map((card, i) => (
              <PunchCard key={i} card={card} index={i} />
            ))}
          </div>
        </motion.section>

        {/* Fix these first */}
        {result.priorities && result.priorities.length > 0 && (
          <motion.section id="fix-first" {...fadeUp(0.2)} className="scroll-mt-16">
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
          </motion.section>
        )}

        {/* Words killing your CV */}
        {result.cliches && result.cliches.length > 0 && (
          <motion.section id="words" {...fadeUp(0.25)} className="scroll-mt-16">
            <h2 className="text-white font-black text-lg uppercase tracking-widest mb-4 flex items-center gap-2">
              <span className="text-[#E24B4A]" aria-hidden>{'// '}</span> Words Killing Your CV 🪦
            </h2>
            <div className="flex flex-wrap gap-2">
              {result.cliches.map((c, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, scale: 0.85 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.25, delay: 0.25 + Math.min(i * 0.06, 0.3) }}
                  className="group relative"
                >
                  <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-[#E24B4A]/30 bg-[#E24B4A]/8 hover:bg-[#E24B4A]/15 hover:border-[#E24B4A]/50 transition-colors cursor-default">
                    <span className="text-[#E24B4A] text-[10px] font-black">✕</span>
                    <span className="text-white font-bold text-sm">&ldquo;{c.word}&rdquo;</span>
                  </div>
                  {/* Tooltip on hover */}
                  <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-2 rounded-lg bg-[#1a1a1a] border border-white/10 text-white/60 text-xs leading-relaxed whitespace-nowrap max-w-[220px] whitespace-normal opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-20 shadow-xl">
                    {c.context}
                    <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-[#1a1a1a]" />
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.section>
        )}

        {/* AI Detected */}
        {result.aiDetected && result.aiCard && (
          <motion.section id="ai" {...fadeUp(0.3)} className="scroll-mt-16">
            <h2 className="text-white font-black text-lg uppercase tracking-widest mb-4 flex items-center gap-2">
              <span className="text-[#E24B4A]" aria-hidden>{'// '}</span> AI Content Detected 🤖
            </h2>
            <PunchCard card={result.aiCard} index={0} />
          </motion.section>
        )}

        {/* Feedback */}
        <motion.div id="rate" {...fadeUp(0.35)} className="scroll-mt-16">
          <FeedbackSection resolvedStyle={result.resolvedStyle ?? 'unknown'} />
        </motion.div>

        {/* Action row */}
        <motion.div {...fadeUp(0.4)} className="flex flex-wrap gap-3 pt-2">
          <div className="relative" ref={shareMenuRef}>
            <button
              onClick={() => setShowShareMenu((v) => !v)}
              className="shimmer-btn flex items-center gap-2 flex-1 sm:flex-none px-5 py-3 rounded-xl bg-[#E24B4A] hover:bg-[#c93b3a] text-white font-bold text-sm transition-colors"
            >
              <Share2 size={15} />
              Share Result
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
            className="flex items-center gap-2 flex-1 sm:flex-none px-5 py-3 rounded-xl border border-white/20 hover:border-white/40 text-white/80 hover:text-white font-bold text-sm transition-colors"
          >
            {copiedAll ? <Check size={15} className="text-emerald-400" /> : <Copy size={15} />}
            {copiedAll ? 'Copied' : 'Copy Suggestions'}
          </button>

          <button
            onClick={onNewRoast}
            className="flex items-center gap-2 flex-1 sm:flex-none px-5 py-3 rounded-xl border border-white/20 hover:border-white/40 text-white/80 hover:text-white font-bold text-sm transition-colors"
          >
            <RotateCcw size={15} />
            New Roast
          </button>
        </motion.div>
      </div>
    </>
  );
}
