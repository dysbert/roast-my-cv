'use client';

import { useEffect, useState } from 'react';
import { RoastStyle, LOADING_MESSAGES } from '@/lib/types';

interface LoadingStateProps {
  style: RoastStyle;
}

export default function LoadingState({ style }: LoadingStateProps) {
  const messages = LOADING_MESSAGES[style];
  const [index, setIndex] = useState(0);
  const [visible, setVisible] = useState(true);
  const [progress, setProgress] = useState(8);

  useEffect(() => {
    const interval = setInterval(() => {
      setVisible(false);
      setTimeout(() => {
        setIndex((i) => (i + 1) % messages.length);
        setVisible(true);
      }, 400);
    }, 2800);
    return () => clearInterval(interval);
  }, [messages.length]);

  // Slowly grow the progress bar to simulate work
  useEffect(() => {
    const timer = setInterval(() => {
      setProgress((p) => {
        if (p >= 90) return p;
        return p + Math.random() * 3;
      });
    }, 600);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="flex flex-col items-center justify-center py-20 gap-8 w-full max-w-sm">
      {/* Animated logo — ring + emoji */}
      <div className="relative">
        {/* outer glow ring */}
        <div className="w-24 h-24 rounded-full border-4 border-[#E24B4A]/20 border-t-[#E24B4A] animate-spin" />
        {/* inner pulsing ring */}
        <div className="absolute inset-2 rounded-full border border-[#E24B4A]/15 animate-ping" />
        <div className="absolute inset-0 flex items-center justify-center text-3xl select-none">
          🔪
        </div>
      </div>

      {/* Progress bar */}
      <div className="w-full bg-white/8 rounded-full h-1.5 overflow-hidden">
        <div
          className="h-full rounded-full progress-bar-shimmer transition-all duration-700 ease-out"
          style={{ width: `${progress}%` }}
        />
      </div>

      {/* Rotating message */}
      <div className="text-center min-h-[2rem] flex items-center justify-center">
        <p
          className="text-white/80 text-base font-medium transition-opacity duration-400"
          style={{ opacity: visible ? 1 : 0 }}
        >
          {messages[index]}
        </p>
      </div>

      {/* Dots */}
      <div className="flex gap-2">
        {messages.map((_, i) => (
          <div
            key={i}
            className={`w-1.5 h-1.5 rounded-full transition-all duration-300 ${
              i === index ? 'bg-[#E24B4A] scale-125' : 'bg-white/20'
            }`}
          />
        ))}
      </div>

      <p className="text-white/30 text-xs">
        Analyzing your CV with AI · This takes 10-20 seconds
      </p>
    </div>
  );
}
