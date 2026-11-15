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
    <div className="rounded-2xl border p-5" style={{ borderColor: 'var(--border)', background: 'var(--bg-surface)' }}>
      <div className="flex items-baseline gap-2">
        <span className="font-display text-3xl font-bold tracking-tight" style={{ color }}>
          {value}
        </span>
        {trend && (
          <span
            className="text-xs font-semibold"
            style={{ color: trend === 'down' ? '#E5604D' : trend === 'up' ? '#F4C04E' : 'var(--text-muted)' }}
          >
            {trend === 'down' ? '▼' : trend === 'up' ? '▲' : '—'}
          </span>
        )}
      </div>
      <p className="mt-1 text-sm" style={{ color: 'var(--text-secondary)' }}>
        {label}
      </p>
    </div>
  );
}
