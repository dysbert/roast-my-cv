'use client';

import { useRef } from 'react';
import { motion } from 'framer-motion';
import { RoastStyle, ROAST_STYLES } from '@/lib/types';

interface StyleSelectorProps {
  selected: RoastStyle | null;
  onSelect: (style: RoastStyle) => void;
}

export default function StyleSelector({ selected, onSelect }: StyleSelectorProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  const handleKeyDown = (e: React.KeyboardEvent, currentId: RoastStyle) => {
    const ids = ROAST_STYLES.map((s) => s.id);
    const currentIndex = ids.indexOf(currentId);

    let nextIndex: number | null = null;
    if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
      nextIndex = (currentIndex + 1) % ids.length;
    } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
      nextIndex = (currentIndex - 1 + ids.length) % ids.length;
    } else if (e.key === 'Home') {
      nextIndex = 0;
    } else if (e.key === 'End') {
      nextIndex = ids.length - 1;
    }

    if (nextIndex !== null) {
      e.preventDefault();
      onSelect(ids[nextIndex]);
      // Move focus to the newly selected button
      const buttons = containerRef.current?.querySelectorAll<HTMLButtonElement>('[role="radio"]');
      buttons?.[nextIndex]?.focus();
    }
  };

  return (
    <div
      ref={containerRef}
      role="radiogroup"
      aria-label="Roast style"
      className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3"
    >
      {ROAST_STYLES.map((style) => {
        const isSelected = selected === style.id;
        return (
          <motion.button
            key={style.id}
            role="radio"
            aria-checked={isSelected}
            aria-label={`${style.name} — ${style.description}`}
            tabIndex={isSelected || (!selected && style.id === ROAST_STYLES[0].id) ? 0 : -1}
            onClick={() => onSelect(style.id)}
            onKeyDown={(e) => handleKeyDown(e, style.id)}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            transition={{ duration: 0.15, ease: 'easeOut' }}
            className={`
              relative p-4 rounded-xl border-2 text-left
              group transition-all duration-200
              hover:border-[#E24B4A]
              focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#E24B4A] focus-visible:ring-offset-2 focus-visible:ring-offset-[#0a0a0a]
              ${isSelected
                ? 'border-[#E24B4A] bg-[#E24B4A]/8 shadow-[0_0_20px_rgba(226,75,74,0.3)]'
                : 'border-white/10 bg-white/5 hover:bg-[#E24B4A]/5'
              }
            `}
          >
            {isSelected && (
              <div className="absolute top-2 right-2 w-2 h-2 rounded-full bg-[#E24B4A]" aria-hidden="true" />
            )}
            <div className="text-[28px] mb-2 leading-none" aria-hidden="true">{style.emoji}</div>
            <div className={`font-bold text-sm mb-1 transition-colors duration-200 ${isSelected ? 'text-[#E24B4A]' : 'text-white group-hover:text-[#E24B4A]'}`}>
              {style.name}
            </div>
            <div className="text-xs text-white/50">{style.description}</div>
          </motion.button>
        );
      })}
    </div>
  );
}
