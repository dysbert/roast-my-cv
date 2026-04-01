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

  return (
    <div className="flex flex-col items-center justify-center py-20 gap-8">
      {/* Animated logo */}
      <div className="relative">
        <div className="w-20 h-20 rounded-full border-4 border-[#E24B4A]/30 border-t-[#E24B4A] animate-spin" />
        <div className="absolute inset-0 flex items-center justify-center text-3xl">🔪</div>
      </div>

      {/* Message */}
      <div className="text-center max-w-sm">
        <p
          className={`text-white/80 text-lg font-medium transition-opacity duration-400 ${
            visible ? 'opacity-100' : 'opacity-0'
          }`}
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
