interface RiskMeterProps {
  risk: 'low' | 'moderate' | 'high';
}

export function RiskMeter({ risk }: RiskMeterProps) {
  const levels = [
    { key: 'low', label: 'Low', color: '#45D19A' },
    { key: 'moderate', label: 'Moderate', color: '#F4C04E' },
    { key: 'high', label: 'High', color: '#E5604D' },
  ];

  const activeIndex = levels.findIndex(l => l.key === risk);

  const advice = {
    low: 'Dry spells are unlikely this season. You can plant normally.',
    moderate: 'Some dry spells are possible. Choose crops that tolerate short dry periods.',
    high: 'Dry spells are likely. Pick drought-tolerant crops and stagger planting dates.',
  };

  return (
    <div>
      <div className="flex gap-2">
        {levels.map((level, i) => (
          <div
            key={level.key}
            className="flex-1 rounded-xl border-2 p-3 text-center transition-all"
            style={{
              borderColor: i <= activeIndex ? level.color : 'var(--border)',
              background: i <= activeIndex ? `${level.color}15` : 'var(--bg-surface)',
              opacity: i <= activeIndex ? 1 : 0.5,
            }}
          >
            <div
              className="mx-auto mb-1 h-2 w-2 rounded-full"
              style={{ background: i <= activeIndex ? level.color : 'var(--border-strong)' }}
            />
            <span
              className="text-xs font-semibold"
              style={{ color: i <= activeIndex ? level.color : 'var(--text-muted)' }}
            >
              {level.label}
            </span>
          </div>
        ))}
      </div>
      <p className="mt-3 text-sm" style={{ color: 'var(--text-secondary)' }}>
        {advice[risk]}
      </p>
    </div>
  );
}
