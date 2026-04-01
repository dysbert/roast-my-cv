'use client';

import { RoastStyle, ROAST_STYLES } from '@/lib/types';

interface StyleSelectorProps {
  selected: RoastStyle | null;
  onSelect: (style: RoastStyle) => void;
}

export default function StyleSelector({ selected, onSelect }: StyleSelectorProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
      {ROAST_STYLES.map((style) => {
        const isSelected = selected === style.id;
        return (
          <button
            key={style.id}
            onClick={() => onSelect(style.id)}
            className={`
              relative p-4 rounded-xl border-2 text-left transition-all duration-200
              hover:border-[#E24B4A] hover:bg-[#E24B4A]/10 group
              ${isSelected
                ? 'border-[#E24B4A] bg-[#E24B4A]/15 shadow-[0_0_20px_rgba(226,75,74,0.3)]'
                : 'border-white/10 bg-white/5'
              }
            `}
          >
            {isSelected && (
              <div className="absolute top-2 right-2 w-2 h-2 rounded-full bg-[#E24B4A]" />
            )}
            <div className="text-2xl mb-2">{style.emoji}</div>
            <div className={`font-bold text-sm mb-1 ${isSelected ? 'text-[#E24B4A]' : 'text-white group-hover:text-[#E24B4A]'}`}>
              {style.name}
            </div>
            <div className="text-xs text-white/50">{style.description}</div>
          </button>
        );
      })}
    </div>
  );
}
