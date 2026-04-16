'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Upload, Zap, Trophy, RotateCcw, FileText, Brain, Flame, CheckCircle } from 'lucide-react';
import StyleSelector from '@/components/StyleSelector';
import FileUpload from '@/components/FileUpload';
import LoadingState from '@/components/LoadingState';
import ResultsView from '@/components/ResultsView';
import StatsCounter from '@/components/StatsCounter';
import { RoastStyle, RoastResult } from '@/lib/types';

type AppState = 'landing' | 'loading' | 'results' | 'error' | 'rate-limited';

export default function Home() {
  const [style, setStyle] = useState<RoastStyle | null>(null);
  const [file, setFile] = useState<File | null>(null);

  // Restore last used style from localStorage
  useEffect(() => {
    try {
      const saved = localStorage.getItem('roast:style') as RoastStyle | null;
      if (saved) setStyle(saved);
    } catch {}
  }, []);

  const handleStyleSelect = (s: RoastStyle) => {
    setStyle(s);
    try { localStorage.setItem('roast:style', s); } catch {}
  };
  const [appState, setAppState] = useState<AppState>('landing');
  const [result, setResult] = useState<RoastResult | null>(null);
  const [errorMsg, setErrorMsg] = useState('');
  const [showUpgradeToast, setShowUpgradeToast] = useState(false);

  const handleRoast = async () => {
    if (!style || !file) return;

    setAppState('loading');

    const formData = new FormData();
    formData.append('file', file);
    formData.append('style', style);

    try {
      const res = await fetch('/api/roast', { method: 'POST', body: formData });
      const data = await res.json();

      if (res.status === 429) {
        setErrorMsg(data.message || "You've used your free roast for today. Come back tomorrow.");
        setAppState('rate-limited');
        return;
      }

      if (!res.ok || data.error) {
        setErrorMsg(
          data.message ||
            'Something went wrong. Please try again with a different PDF.'
        );
        setAppState('error');
        return;
      }

      setResult(data as RoastResult);
      setAppState('results');
    } catch {
      setErrorMsg('Network error. Please check your connection and try again.');
      setAppState('error');
    }
  };

  const handleReset = () => {
    setStyle(null);
    setFile(null);
    setResult(null);
    setErrorMsg('');
    setAppState('landing');
  };

  const handleUpgradeClick = () => {
    setShowUpgradeToast(true);
    setTimeout(() => setShowUpgradeToast(false), 3000);
  };

  return (
    <AnimatePresence mode="wait">
      {appState === 'loading' && (
        <motion.main
          key="loading"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="min-h-screen bg-[#0a0a0a] flex items-center justify-center px-4"
        >
          <LoadingState style={style!} />
        </motion.main>
      )}

      {appState === 'results' && result && (
        <motion.main
          key="results"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.35 }}
          className="min-h-screen bg-[#0a0a0a] pb-16"
        >
          {/* Top nav */}
          <div className="px-4 py-4">
            <div className="max-w-3xl mx-auto flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-[#E24B4A] font-black text-lg">🔪</span>
                <span className="text-white font-black text-sm tracking-wider">ROAST MY CV</span>
              </div>
              <button
                onClick={handleReset}
                className="flex items-center gap-1.5 text-white/40 hover:text-white/70 text-xs transition-colors"
              >
                <RotateCcw size={12} />
                Back
              </button>
            </div>
          </div>
          <ResultsView result={result} onNewRoast={handleReset} />
        </motion.main>
      )}

      {appState === 'rate-limited' && (
        <motion.main
          key="rate-limited"
          initial={{ opacity: 0, scale: 0.97 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="min-h-screen bg-[#0a0a0a] flex items-center justify-center px-4"
        >
          <div className="max-w-md text-center space-y-6">
            <div className="text-6xl">🔥</div>
            <h2 className="text-white font-black text-2xl">Daily limit reached</h2>
            <p className="text-white/60 text-sm leading-relaxed">{errorMsg}</p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <button
                onClick={handleUpgradeClick}
                className="shimmer-btn px-6 py-3 rounded-xl bg-[#E24B4A] hover:bg-[#c93b3a] text-white font-bold text-sm transition-colors"
              >
                Upgrade for unlimited
              </button>
              <button
                onClick={handleReset}
                className="flex items-center justify-center gap-2 px-6 py-3 rounded-xl border border-white/20 hover:border-white/40 text-white/70 hover:text-white font-bold text-sm transition-colors"
              >
                <RotateCcw size={14} />
                Back
              </button>
            </div>
          </div>

          {showUpgradeToast && (
            <div className="fixed bottom-6 left-1/2 -translate-x-1/2 px-5 py-3 rounded-xl bg-[#1a1a1a] border border-white/10 shadow-xl text-white text-sm font-medium z-50 animate-in">
              Coming soon — stay tuned! 🚀
            </div>
          )}
        </motion.main>
      )}

      {appState === 'error' && (
        <motion.main
          key="error"
          initial={{ opacity: 0, scale: 0.97 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="min-h-screen bg-[#0a0a0a] flex items-center justify-center px-4"
        >
          <div className="max-w-md text-center space-y-6">
            <div className="text-6xl">😅</div>
            <h2 className="text-white font-black text-2xl">Houston, we have a problem</h2>
            <p className="text-white/60 text-sm leading-relaxed">{errorMsg}</p>
            <button
              onClick={handleReset}
              className="shimmer-btn px-6 py-3 rounded-xl bg-[#E24B4A] hover:bg-[#c93b3a] text-white font-bold text-sm transition-colors"
            >
              Try again
            </button>
          </div>
        </motion.main>
      )}

      {appState === 'landing' && (
        <motion.main
          key="landing"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="min-h-screen bg-[#0a0a0a]"
        >
          {/* Hero */}
          <section className="px-4 pt-16 pb-12 text-center max-w-2xl mx-auto">
            {/* Animated badge */}
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#E24B4A]/15 border border-[#E24B4A]/30 text-[#E24B4A] text-xs font-bold tracking-wider uppercase mb-4"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-[#E24B4A] badge-dot-pulse flex-shrink-0" />
              AI-Powered · Free · No signup
            </motion.div>

            <div className="mb-6">
              <StatsCounter />
            </div>

            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, ease: "easeOut" }}
              className="text-5xl sm:text-6xl font-black text-white leading-[1.05] tracking-tight mb-4"
              style={{ fontWeight: 700 }}
            >
              Roast{' '}
              <span className="text-[#E24B4A]">My CV</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1, ease: "easeOut" }}
              className="text-white/50 text-lg leading-relaxed"
            >
              Upload your resume. Get brutally honest AI feedback.
              <br />
              No more polite lies from friends.
            </motion.p>
          </section>

          {/* Mini steps */}
          <section className="px-4 pb-16 max-w-2xl mx-auto">
            <div className="grid grid-cols-3 gap-4">
              {[
                { step: '01', Icon: Upload, label: 'Upload', desc: 'Drop your CV PDF' },
                { step: '02', Icon: Zap, label: 'Choose style', desc: 'Pick your poison' },
                { step: '03', Icon: Trophy, label: 'Get destroyed', desc: 'Read the truth' },
              ].map((item, i) => (
                <motion.div
                  key={item.step}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: 0.2 + i * 0.1, ease: "easeOut" }}
                  className="flex flex-col items-center text-center gap-2"
                >
                  <div className="text-[10px] font-black text-[#E24B4A]/60 tracking-widest">{item.step}</div>
                  <div className="w-12 h-12 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center">
                    <item.Icon size={22} className="text-white/70" />
                  </div>
                  <div className="text-white font-bold text-sm">{item.label}</div>
                  <div className="text-white/40 text-xs">{item.desc}</div>
                </motion.div>
              ))}
            </div>
          </section>

          {/* Upload form */}
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2, ease: "easeOut" }}
            className="px-4 pb-20 max-w-2xl mx-auto"
          >
            <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-6 sm:p-8 space-y-8">
              {/* Step 1: Style */}
              <div>
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-6 h-6 rounded-full bg-[#E24B4A] flex items-center justify-center text-white text-xs font-black flex-shrink-0">1</div>
                  <h2 className="text-white font-black text-base">Choose your roast style</h2>
                </div>
                <StyleSelector selected={style} onSelect={handleStyleSelect} />
              </div>

              {/* Step 2: Upload */}
              <div>
                <div className="flex items-center gap-2 mb-4">
                  <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-black flex-shrink-0 transition-colors ${style ? 'bg-[#E24B4A] text-white' : 'bg-white/10 text-white/30'}`}>2</div>
                  <h2 className={`font-black text-base transition-colors ${style ? 'text-white' : 'text-white/30'}`}>
                    Upload your CV
                  </h2>
                </div>
                <div className={style ? '' : 'opacity-40 pointer-events-none'}>
                  <FileUpload file={file} onFile={setFile} />
                </div>
              </div>

              {/* CTA */}
              <motion.button
                onClick={handleRoast}
                disabled={!style || !file}
                whileHover={style && file ? { scale: 1.01 } : {}}
                whileTap={style && file ? { scale: 0.99 } : {}}
                transition={{ duration: 0.2 }}
                className={`
                  shimmer-btn w-full py-4 rounded-xl font-black text-base tracking-wider transition-all duration-200
                  ${style && file
                    ? 'bg-[#E24B4A] hover:bg-[#c93b3a] text-white shadow-[0_0_30px_rgba(226,75,74,0.4)] hover:shadow-[0_0_40px_rgba(226,75,74,0.6)]'
                    : 'bg-white/5 text-white/20 cursor-not-allowed'
                  }
                `}
              >
                {style && file ? '🔪 Roast my CV' : 'Select a style and upload your CV'}
              </motion.button>

              <p className="text-center text-white/20 text-xs">
                Your CV is never stored. Processed in memory only.
              </p>
            </div>
          </motion.section>

          {/* How it works — detailed */}
          <motion.section
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.35, ease: 'easeOut' }}
            className="px-4 pb-24 max-w-2xl mx-auto"
          >
            <div className="text-center mb-10">
              <h2 className="text-white font-black text-2xl tracking-tight mb-2">How it works</h2>
              <p className="text-white/40 text-sm">From PDF to brutal honesty in seconds</p>
            </div>

            <div className="relative">
              {/* Vertical connector line */}
              <div className="absolute left-[27px] top-8 bottom-8 w-px bg-white/[0.06] hidden sm:block" />

              <div className="space-y-4">
                {[
                  {
                    Icon: FileText,
                    title: 'Upload your CV',
                    desc: 'Drop your resume as a PDF. We extract the text directly in memory — nothing is saved to disk or any database.',
                    badge: 'PDF only · Max 1.5MB',
                  },
                  {
                    Icon: Zap,
                    title: 'Pick a roast style',
                    desc: 'Choose how harsh you want the feedback. From gentle nudges to full corporate takedowns. The style shapes the entire tone of the analysis.',
                    badge: '5 styles available',
                  },
                  {
                    Icon: Brain,
                    title: 'Claude reads every line',
                    desc: "Anthropic's Claude AI analyses your CV structure, wording, achievements, and red flags. It scores you across multiple dimensions and writes personalised feedback.",
                    badge: 'Powered by Claude AI',
                  },
                  {
                    Icon: Flame,
                    title: 'Get your roast',
                    desc: 'Receive a full breakdown: scores, a punch-card chart, section-by-section commentary, and a list of concrete fixes. Honest. Fast. Free.',
                    badge: 'Scores · Insights · Action plan',
                  },
                  {
                    Icon: CheckCircle,
                    title: 'Actually improve',
                    desc: 'Use the specific suggestions to rewrite your CV. Come back and roast it again until the score goes up. No account needed.',
                    badge: 'Free · No signup',
                  },
                ].map((item, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: -12 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.4, delay: 0.4 + i * 0.08, ease: 'easeOut' }}
                    className="flex gap-4 items-start group"
                  >
                    <div className="flex-shrink-0 w-14 h-14 rounded-2xl bg-white/[0.04] border border-white/[0.08] flex items-center justify-center group-hover:border-[#E24B4A]/30 group-hover:bg-[#E24B4A]/5 transition-colors duration-300 z-10">
                      <item.Icon size={22} className="text-white/50 group-hover:text-[#E24B4A]/70 transition-colors duration-300" />
                    </div>
                    <div className="flex-1 pt-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="text-white font-bold text-sm">{item.title}</h3>
                        <span className="text-[10px] text-white/30 font-medium hidden sm:inline">{item.badge}</span>
                      </div>
                      <p className="text-white/40 text-xs leading-relaxed">{item.desc}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.section>

          {/* FAQ */}
          <motion.section
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.6, ease: 'easeOut' }}
            className="w-full max-w-xl mx-auto px-4 pb-16"
          >
            <h2 className="text-white/50 text-xs font-semibold uppercase tracking-widest mb-6 text-center">FAQ</h2>
            <div className="space-y-4">
              {[
                {
                  q: 'Is it free?',
                  a: '3 free roasts per day. No account needed.',
                },
                {
                  q: 'Is my CV data safe?',
                  a: 'Your CV is processed in memory and immediately discarded. We never store or share any personal data.',
                },
                {
                  q: 'What does the AI check?',
                  a: 'Weak action verbs, missing metrics, generic skills, clichés, employment gaps, and AI-generated language. You get a score, specific issues, and concrete rewrites.',
                },
                {
                  q: 'What file formats are supported?',
                  a: 'PDF only, up to 2MB. Covers exports from Word, Google Docs, Canva, and LinkedIn.',
                },
                {
                  q: 'Does it work in any language?',
                  a: 'Yes — it detects your CV language and responds in the same one. English, Spanish, French, German, Portuguese and more.',
                },
                {
                  q: 'How is this different from other CV checkers?',
                  a: 'Most checkers give generic checklists. This reads your actual content and rewrites your weakest bullet points. It also detects AI-generated language, which most tools miss.',
                },
              ].map(({ q, a }) => (
                <div key={q} className="border border-white/[0.07] rounded-xl px-5 py-4 bg-white/[0.02]">
                  <p className="text-white/80 text-sm font-medium mb-1">{q}</p>
                  <p className="text-white/40 text-xs leading-relaxed">{a}</p>
                </div>
              ))}
            </div>
          </motion.section>
        </motion.main>
      )}
    </AnimatePresence>
  );
}
