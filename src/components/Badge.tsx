interface BadgeProps {
  variant: 'gold' | 'green' | 'coral' | 'neutral';
  children: React.ReactNode;
  icon?: React.ReactNode;
}

export function Badge({ variant, children, icon }: BadgeProps) {
  const styles: Record<string, { bg: string; text: string; border: string }> = {
    gold: { bg: 'rgba(244, 192, 78, 0.15)', text: '#F4C04E', border: 'rgba(244, 192, 78, 0.3)' },
    green: { bg: 'rgba(69, 209, 154, 0.15)', text: '#45D19A', border: 'rgba(69, 209, 154, 0.3)' },
    coral: { bg: 'rgba(229, 96, 77, 0.15)', text: '#E5604D', border: 'rgba(229, 96, 77, 0.3)' },
    neutral: { bg: 'var(--bg-muted)', text: 'var(--text-secondary)', border: 'var(--border)' },
  };
  const s = styles[variant];
  return (
    <span
      className="inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-semibold"
      style={{ background: s.bg, color: s.text, border: `1px solid ${s.border}` }}
    >
      {icon}
      {children}
    </span>
  );
}
