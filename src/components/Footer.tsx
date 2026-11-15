import { Sprout } from 'lucide-react';

export function Footer() {
  return (
    <footer className="mt-24 border-t" style={{ borderColor: 'var(--border)', background: 'var(--bg-surface)' }}>
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6">
        <div className="flex flex-col gap-8 sm:flex-row sm:items-start sm:justify-between">
          <div className="max-w-sm">
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-field text-white">
                <Sprout className="h-4 w-4" />
              </div>
              <span className="font-display text-base font-bold" style={{ color: 'var(--text-primary)' }}>
                Field Shift Ghana
              </span>
            </div>
            <p className="mt-3 text-sm" style={{ color: 'var(--text-secondary)' }}>
              A decision-support tool for Ghanaian smallholder farmers, built for the NASA Space Apps Challenge 2026.
            </p>
          </div>
          <div className="max-w-sm">
            <h4 className="font-display text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>
              Important note
            </h4>
            <p className="mt-2 text-sm" style={{ color: 'var(--text-secondary)' }}>
              This tool is for decision support only. Always confirm plans with a local agricultural extension officer before planting.
            </p>
          </div>
        </div>
        <div className="mt-8 border-t pt-6 text-xs" style={{ borderColor: 'var(--border)', color: 'var(--text-muted)' }}>
          <p>Built for NASA Space Apps Challenge 2026 — "Field Shift: Adapting Farms with NASA Data"</p>
        </div>
      </div>
    </footer>
  );
}
