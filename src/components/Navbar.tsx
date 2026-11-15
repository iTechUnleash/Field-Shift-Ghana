import { useNavigate } from 'react-router-dom';
import { Sprout } from 'lucide-react';

export function Navbar() {
  const navigate = useNavigate();
  return (
    <nav className="glass sticky top-0 z-40 border-b" style={{ borderColor: 'var(--glass-border)' }}>
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6">
        <button
          onClick={() => navigate('/')}
          className="flex min-h-[48px] items-center gap-2 transition-transform hover:scale-[1.02]"
          aria-label="Field Shift Ghana — home"
        >
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-field text-white">
            <Sprout className="h-5 w-5" />
          </div>
          <span className="font-display text-base sm:text-lg font-bold tracking-tight" style={{ color: 'var(--text-primary)' }}>
            Field Shift Ghana
          </span>
        </button>
        <button
          onClick={() => navigate('/plan')}
          className="btn-primary shrink-0 text-xs sm:text-sm"
          style={{ minHeight: 48, padding: '0 16px' }}
        >
          Plan my season
        </button>
      </div>
    </nav>
  );
}
