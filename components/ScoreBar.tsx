import { ScoreLevel, SCORE_LEVELS } from '@/lib/types';

interface ScoreBarProps {
  active: ScoreLevel;
}

export default function ScoreBar({ active }: ScoreBarProps) {
  const activeIndex = SCORE_LEVELS.findIndex((s) => s.level === active);

  return (
    <div className="flex gap-1 items-center">
      {SCORE_LEVELS.map((s, i) => {
        const isActive = s.level === active;
        const isPast = i < activeIndex;
        return (
          <div key={s.level} className="flex-1 flex flex-col items-center gap-1.5">
            <div
              className={`
                w-full h-2 rounded-full transition-all
                ${isActive ? 'bg-[#E24B4A] shadow-[0_0_8px_rgba(226,75,74,0.6)]' : isPast ? 'bg-[#E24B4A]/30' : 'bg-white/10'}
              `}
            />
            <div className="flex flex-col items-center gap-0.5">
              <span className="text-sm">{s.emoji}</span>
              <span
                className={`text-[9px] font-bold tracking-wide uppercase ${
                  isActive ? 'text-[#E24B4A]' : 'text-white/30'
                }`}
              >
                {s.label}
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
}
