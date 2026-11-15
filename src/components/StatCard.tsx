interface StatCardProps {
  value: string;
  label: string;
  trend?: 'down' | 'up' | 'neutral';
  accent?: 'green' | 'gold' | 'coral';
}

export function StatCard({ value, label, trend, accent = 'green' }: StatCardProps) {
  const accentColors = {
    green: '#45D19A',
    gold: '#F4C04E',
    coral: '#E5604D',
  };
  const color = accentColors[accent];

  return (
    <div className="min-w-0 rounded-2xl border p-4 sm:p-5" style={{ borderColor: 'var(--border)', background: 'var(--bg-surface)' }}>
      <div className="flex items-baseline gap-1.5 sm:gap-2">
        <span className="font-display text-2xl sm:text-3xl font-bold tracking-tight" style={{ color }}>
          {value}
        </span>
        {trend && (
          <span
            className="text-xs font-semibold"
            style={{ color: trend === 'neutral' ? 'var(--text-muted)' : color }}
          >
            {trend === 'down' ? '▼' : trend === 'up' ? '▲' : '—'}
          </span>
        )}
      </div>
      <p className="mt-1 text-xs sm:text-sm leading-snug" style={{ color: 'var(--text-secondary)' }}>
        {label}
      </p>
    </div>
  );
}
