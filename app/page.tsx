'use client';

import { useState } from 'react';
import StyleSelector from '@/components/StyleSelector';
import FileUpload from '@/components/FileUpload';
import LoadingState from '@/components/LoadingState';
import ResultsView from '@/components/ResultsView';
import { RoastStyle, RoastResult } from '@/lib/types';

type AppState = 'landing' | 'loading' | 'results' | 'error' | 'rate-limited';

export default function Home() {
  const [style, setStyle] = useState<RoastStyle | null>(null);
  const [file, setFile] = useState<File | null>(null);
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

  if (appState === 'loading') {
    return (
      <main className="min-h-screen bg-[#0a0a0a] flex items-center justify-center px-4">
        <LoadingState style={style!} />
      </main>
    );
  }

  if (appState === 'results' && result) {
    return (
      <main className="min-h-screen bg-[#0a0a0a] pb-16">
        {/* Top nav */}
        <div className="border-b border-white/8 px-4 py-4">
          <div className="max-w-3xl mx-auto flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-[#E24B4A] font-black text-lg">🔪</span>
              <span className="text-white font-black text-sm tracking-wider">ROAST MY CV</span>
            </div>
            <button
              onClick={handleReset}
              className="text-white/40 hover:text-white/70 text-xs transition-colors"
            >
              ← Back
            </button>
          </div>
        </div>
        <ResultsView result={result} onNewRoast={handleReset} />
      </main>
    );
  }

  if (appState === 'rate-limited') {
    return (
      <main className="min-h-screen bg-[#0a0a0a] flex items-center justify-center px-4">
        <div className="max-w-md text-center space-y-6">
          <div className="text-6xl">🔥</div>
          <h2 className="text-white font-black text-2xl">Daily limit reached</h2>
          <p className="text-white/60 text-sm leading-relaxed">{errorMsg}</p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <button
              onClick={handleUpgradeClick}
              className="px-6 py-3 rounded-xl bg-[#E24B4A] hover:bg-[#c93b3a] text-white font-bold text-sm transition-colors"
            >
              Upgrade for unlimited
            </button>
            <button
              onClick={handleReset}
              className="px-6 py-3 rounded-xl border border-white/20 hover:border-white/40 text-white/70 hover:text-white font-bold text-sm transition-colors"
            >
              ← Back
            </button>
          </div>
        </div>

        {/* Coming soon toast */}
        {showUpgradeToast && (
          <div className="fixed bottom-6 left-1/2 -translate-x-1/2 px-5 py-3 rounded-xl bg-[#1a1a1a] border border-white/10 shadow-xl text-white text-sm font-medium z-50 animate-in">
            Coming soon — stay tuned! 🚀
          </div>
        )}
      </main>
    );
  }

  if (appState === 'error') {
    return (
      <main className="min-h-screen bg-[#0a0a0a] flex items-center justify-center px-4">
        <div className="max-w-md text-center space-y-6">
          <div className="text-6xl">😅</div>
          <h2 className="text-white font-black text-2xl">Houston, we have a problem</h2>
          <p className="text-white/60 text-sm leading-relaxed">{errorMsg}</p>
          <button
            onClick={handleReset}
            className="px-6 py-3 rounded-xl bg-[#E24B4A] hover:bg-[#c93b3a] text-white font-bold text-sm transition-colors"
          >
            Try again
          </button>
        </div>
      </main>
    );
  }

  // Landing page
  return (
    <main className="min-h-screen bg-[#0a0a0a]">
      {/* Hero */}
      <section className="px-4 pt-16 pb-12 text-center max-w-2xl mx-auto">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#E24B4A]/15 border border-[#E24B4A]/30 text-[#E24B4A] text-xs font-bold tracking-wider uppercase mb-6">
          <span>🔪</span> AI-Powered CV Destruction
        </div>
        <h1 className="text-5xl sm:text-6xl font-black text-white leading-[1.05] tracking-tight mb-4">
          Roast{' '}
          <span className="text-[#E24B4A]">My CV</span>
        </h1>
        <p className="text-white/50 text-lg leading-relaxed">
          Upload your resume. Get brutally honest AI feedback.
          <br />
          No more polite lies from friends.
        </p>
      </section>

      {/* How it works */}
      <section className="px-4 pb-16 max-w-2xl mx-auto">
        <div className="grid grid-cols-3 gap-4">
          {[
            { step: '01', icon: '📎', label: 'Upload', desc: 'Drop your CV PDF' },
            { step: '02', icon: '🎭', label: 'Choose style', desc: 'Pick your poison' },
            { step: '03', icon: '💀', label: 'Get destroyed', desc: 'Read the truth' },
          ].map((item) => (
            <div key={item.step} className="flex flex-col items-center text-center gap-2">
              <div className="text-[10px] font-black text-[#E24B4A]/60 tracking-widest">{item.step}</div>
              <div className="w-12 h-12 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-2xl">
                {item.icon}
              </div>
              <div className="text-white font-bold text-sm">{item.label}</div>
              <div className="text-white/40 text-xs">{item.desc}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Upload form */}
      <section className="px-4 pb-20 max-w-2xl mx-auto">
        <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-6 sm:p-8 space-y-8">
          {/* Step 1: Style */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-6 h-6 rounded-full bg-[#E24B4A] flex items-center justify-center text-white text-xs font-black flex-shrink-0">1</div>
              <h2 className="text-white font-black text-base">Choose your roast style</h2>
            </div>
            <StyleSelector selected={style} onSelect={setStyle} />
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
          <button
            onClick={handleRoast}
            disabled={!style || !file}
            className={`
              w-full py-4 rounded-xl font-black text-base tracking-wider transition-all duration-200
              ${style && file
                ? 'bg-[#E24B4A] hover:bg-[#c93b3a] text-white shadow-[0_0_30px_rgba(226,75,74,0.4)] hover:shadow-[0_0_40px_rgba(226,75,74,0.6)]'
                : 'bg-white/5 text-white/20 cursor-not-allowed'
              }
            `}
          >
            {style && file ? '🔪 Roast my CV' : 'Select a style and upload your CV'}
          </button>

          <p className="text-center text-white/20 text-xs">
            Your CV is never stored. Processed in memory only.
          </p>
        </div>
      </section>
    </main>
  );
}
