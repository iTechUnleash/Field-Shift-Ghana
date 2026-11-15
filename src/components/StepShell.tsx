interface StepShellProps {
  step: 1 | 2 | 3;
  title: string;
  subtitle: string;
  children: React.ReactNode;
  canContinue: boolean;
  helperText: string;
  onBack: () => void;
  onContinue: () => void;
  continueLabel?: string;
}

export function StepShell({
  step,
  title,
  subtitle,
  children,
  canContinue,
  helperText,
  onBack,
  onContinue,
  continueLabel = 'Continue',
}: StepShellProps) {
  const progress = (step / 3) * 100;
  return (
    <div className="flex min-h-screen flex-col" style={{ background: 'var(--bg)' }}>
      <div className="mx-auto flex w-full max-w-2xl flex-1 flex-col px-4 py-6 sm:px-6">
        <div className="mb-6">
          <div className="mb-3 flex items-center justify-between">
            <span className="font-display text-sm font-semibold" style={{ color: 'var(--text-secondary)' }}>
              Step {step} of 3
            </span>
            <span className="text-sm font-semibold" style={{ color: 'var(--accent)' }}>
              {Math.round(progress)}%
            </span>
          </div>
          <div className="h-2 w-full overflow-hidden rounded-full" style={{ background: 'var(--bg-muted)' }}>
            <div
              className="h-full rounded-full transition-all duration-500 ease-out"
              style={{ width: `${progress}%`, background: 'linear-gradient(90deg, var(--accent), var(--accent-bright))' }}
            />
          </div>
        </div>

        <div key={step} className="animate-fade-up flex-1">
          <h1 className="font-display text-3xl font-bold tracking-tight sm:text-4xl" style={{ color: 'var(--text-primary)' }}>
            {title}
          </h1>
          <p className="mt-2 text-base" style={{ color: 'var(--text-secondary)' }}>
            {subtitle}
          </p>
          <div className="mt-8 flex flex-col gap-3">{children}</div>
        </div>
      </div>

      <div
        className="sticky bottom-0 z-30 border-t backdrop-blur-lg"
        style={{ borderColor: 'var(--border)', background: 'var(--glass-bg)' }}
      >
        <div className="mx-auto flex max-w-2xl flex-col gap-2 px-4 py-4 sm:px-6">
          {!canContinue && (
            <p className="text-center text-sm" style={{ color: 'var(--text-muted)' }} aria-live="polite">
              {helperText}
            </p>
          )}
          <div className="flex items-center gap-3">
            {step > 1 && (
              <button onClick={onBack} className="btn-secondary flex-1" style={{ flex: '0 0 auto' }}>
                Back
              </button>
            )}
            <button
              onClick={onContinue}
              disabled={!canContinue}
              className="btn-primary flex-1"
              aria-disabled={!canContinue}
            >
              {continueLabel}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
