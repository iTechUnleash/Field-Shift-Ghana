import { Check } from 'lucide-react';

interface OptionCardProps {
  selected: boolean;
  onClick: () => void;
  title: string;
  hint?: string;
  icon?: React.ReactNode;
  ariaLabel: string;
}

export function OptionCard({ selected, onClick, title, hint, icon, ariaLabel }: OptionCardProps) {
  return (
    <button
      onClick={onClick}
      aria-pressed={selected}
      aria-label={ariaLabel}
      className="group relative flex w-full items-center gap-4 rounded-2xl border-2 p-4 text-left transition-all duration-200"
      style={{
        minHeight: 64,
        borderColor: selected ? 'var(--accent)' : 'var(--border)',
        background: selected ? 'rgba(69, 209, 154, 0.08)' : 'var(--bg-surface)',
        boxShadow: selected ? '0 0 0 3px rgba(69, 209, 154, 0.15)' : 'var(--shadow-sm)',
      }}
    >
      {icon && (
        <div
          className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl"
          style={{ background: selected ? 'rgba(18, 122, 85, 0.12)' : 'var(--bg-muted)' }}
        >
          {icon}
        </div>
      )}
      <div className="min-w-0 flex-1">
        <p className="font-display text-base font-semibold" style={{ color: 'var(--text-primary)' }}>
          {title}
        </p>
        {hint && (
          <p className="mt-0.5 text-sm" style={{ color: 'var(--text-muted)' }}>
            {hint}
          </p>
        )}
      </div>
      <div
        className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full border-2 transition-all"
        style={{
          borderColor: selected ? 'var(--accent)' : 'var(--border-strong)',
          background: selected ? 'var(--accent)' : 'transparent',
        }}
      >
        {selected && <Check className="h-4 w-4 text-white" strokeWidth={3} />}
      </div>
    </button>
  );
}
