import { Check } from 'lucide-react';

interface OptionCardProps {
  selected: boolean;
  onClick: () => void;
  title: string;
  hint?: string;
  icon?: React.ReactNode;
  ariaLabel: string;
  compact?: boolean;
}

export function OptionCard({ selected, onClick, title, hint, icon, ariaLabel, compact }: OptionCardProps) {
  return (
    <button
      onClick={onClick}
      aria-pressed={selected}
      aria-label={ariaLabel}
      className={`group relative flex w-full items-center ${
        compact ? 'gap-2 p-2.5 sm:gap-2.5 sm:p-3 min-h-[52px]' : 'gap-4 p-4 min-h-[64px]'
      } rounded-2xl border-2 text-left transition-all duration-200`}
      style={{
        borderColor: selected ? 'var(--accent)' : 'var(--border)',
        background: selected ? 'rgba(69, 209, 154, 0.08)' : 'var(--bg-surface)',
        boxShadow: selected ? '0 0 0 3px rgba(69, 209, 154, 0.15)' : 'var(--shadow-sm)',
      }}
    >
      {icon && (
        <div
          className={`flex shrink-0 items-center justify-center rounded-xl ${
            compact ? 'h-8 w-8 sm:h-9 sm:w-9' : 'h-12 w-12'
          }`}
          style={{ background: selected ? 'rgba(18, 122, 85, 0.12)' : 'var(--bg-muted)' }}
        >
          {icon}
        </div>
      )}
      <div className="min-w-0 flex-1">
        <p
          className={`font-display font-semibold ${
            compact ? 'text-xs sm:text-sm leading-tight' : 'text-base'
          }`}
          style={{ color: 'var(--text-primary)' }}
        >
          {title}
        </p>
        {hint && (
          <p
            className={`${compact ? 'mt-0.5 text-[11px] sm:text-xs' : 'mt-0.5 text-sm'}`}
            style={{ color: 'var(--text-muted)' }}
          >
            {hint}
          </p>
        )}
      </div>
      <div
        className={`flex shrink-0 items-center justify-center rounded-full border-2 transition-all ${
          compact ? 'h-4 w-4 sm:h-5 sm:w-5' : 'h-6 w-6'
        }`}
        style={{
          borderColor: selected ? 'var(--accent)' : 'var(--border-strong)',
          background: selected ? 'var(--accent)' : 'transparent',
        }}
      >
        {selected && (
          <Check className={`${compact ? 'h-2.5 w-2.5 sm:h-3 sm:w-3' : 'h-4 w-4'} text-white`} strokeWidth={3} />
        )}
      </div>
    </button>
  );
}
