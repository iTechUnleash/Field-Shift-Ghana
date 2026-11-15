import { CropIcon } from '@/components/CropIcons';
import { familyLabels, familyColors } from '@/data/crops';
import type { SeasonPlan } from '@/lib/rotation';

interface SeasonCardProps {
  season: SeasonPlan;
  isLast: boolean;
}

export function SeasonCard({ season, isLast }: SeasonCardProps) {
  const familyColor = familyColors[season.crop.family];
  return (
    <div className="relative flex gap-4">
      <div className="flex flex-col items-center">
        <div
          className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl border-2"
          style={{ borderColor: familyColor, background: `${familyColor}15` }}
        >
          <CropIcon iconKey={season.crop.iconKey} className="h-8 w-8" />
        </div>
        {!isLast && (
          <div className="mt-2 w-0.5 flex-1" style={{ background: 'var(--border)' }} />
        )}
      </div>
      <div className={`flex-1 ${isLast ? '' : 'pb-6'}`}>
        <p className="text-xs font-semibold uppercase tracking-wide" style={{ color: 'var(--text-muted)' }}>
          {season.label}
        </p>
        <div className="mt-1 flex items-center gap-2">
          <h4 className="font-display text-xl font-bold" style={{ color: 'var(--text-primary)' }}>
            {season.crop.name}
          </h4>
          <span
            className="rounded-full px-2.5 py-0.5 text-xs font-semibold"
            style={{ background: `${familyColor}20`, color: familyColor }}
          >
            {familyLabels[season.crop.family]}
          </span>
        </div>
        <p className="mt-2 text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
          {season.reason}
        </p>
      </div>
    </div>
  );
}
