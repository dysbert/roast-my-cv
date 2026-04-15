'use client';

import { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';

function useCountUp(target: number, duration = 1800) {
  const [count, setCount] = useState(0);
  const rafRef = useRef<number | null>(null);
  const startRef = useRef<number | null>(null);
  const startCountRef = useRef(0);

  useEffect(() => {
    if (target === 0) return;

    startRef.current = null;
    startCountRef.current = 0;

    const step = (timestamp: number) => {
      if (!startRef.current) startRef.current = timestamp;
      const elapsed = timestamp - startRef.current;
      const progress = Math.min(elapsed / duration, 1);
      // Ease out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      setCount(Math.round(eased * target));
      if (progress < 1) {
        rafRef.current = requestAnimationFrame(step);
      }
    };

    rafRef.current = requestAnimationFrame(step);
    return () => {
      if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);
    };
  }, [target, duration]);

  return count;
}

export default function StatsCounter() {
  const [total, setTotal] = useState(0);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    fetch('/api/stats')
      .then((r) => r.json())
      .then((data) => {
        setTotal(data.totalRoasts ?? 0);
        setLoaded(true);
      })
      .catch(() => setLoaded(true));
  }, []);

  const count = useCountUp(loaded ? total : 0);

  if (!loaded) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: -8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.15 }}
      className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 text-white/60 text-sm font-medium"
    >
      <span className="text-[#E24B4A] font-black text-base tabular-nums">
        {count.toLocaleString('en')}
      </span>
      <span>CVs roasted</span>
      <span className="text-white/20">🔥</span>
    </motion.div>
  );
}
