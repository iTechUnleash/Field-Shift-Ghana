import { useState, useRef, useEffect } from 'react';
import { ChevronDown } from 'lucide-react';

interface DrawerProps {
  title: string;
  children: React.ReactNode;
}

export function Drawer({ title, children }: DrawerProps) {
  const [open, setOpen] = useState(false);
  const contentRef = useRef<HTMLDivElement>(null);
  const [height, setHeight] = useState(0);

  useEffect(() => {
    if (contentRef.current) {
      setHeight(contentRef.current.scrollHeight);
    }
  }, [open, children]);

  return (
    <div
      className="overflow-hidden rounded-2xl border"
      style={{ borderColor: 'var(--border)', background: 'var(--bg-surface)' }}
    >
      <button
        onClick={() => setOpen(!open)}
        className="flex w-full items-center justify-between p-5 text-left transition-colors hover:bg-[var(--bg-muted)]"
        aria-expanded={open}
      >
        <span className="font-display text-base font-semibold" style={{ color: 'var(--text-primary)' }}>
          {title}
        </span>
        <ChevronDown
          className="h-5 w-5 shrink-0 transition-transform duration-300"
          style={{ color: 'var(--text-secondary)', transform: open ? 'rotate(180deg)' : 'none' }}
        />
      </button>
      <div
        className="transition-all duration-300 ease-out"
        style={{ maxHeight: open ? `${height}px` : '0px', opacity: open ? 1 : 0 }}
      >
        <div ref={contentRef} className="px-5 pb-5">
          <div className="border-t pt-4" style={{ borderColor: 'var(--border)' }}>
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}
