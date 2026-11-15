interface IconProps {
  className?: string;
}

export function CropIcon({ iconKey, className = 'w-8 h-8' }: { iconKey: string; className?: string }) {
  const icons: Record<string, React.FC<IconProps>> = {
    maize: MaizeIcon,
    sorghum: SorghumIcon,
    groundnut: GroundnutIcon,
    cowpea: CowpeaIcon,
    soybean: SoybeanIcon,
    cassava: CassavaIcon,
    tomato: TomatoIcon,
    millet: MilletIcon,
    yam: YamIcon,
    pepper: PepperIcon,
    rice: RiceIcon,
    okra: OkraIcon,
    'sweet-potato': SweetPotatoIcon,
  };
  const Icon = icons[iconKey] || MaizeIcon;
  return <Icon className={className} />;
}

export function MaizeIcon({ className = 'w-8 h-8' }: IconProps) {
  return (
    <svg viewBox="0 0 48 48" fill="none" className={className} aria-hidden="true">
      <ellipse cx="24" cy="24" rx="8" ry="18" fill="#F4C04E" stroke="#d4a032" strokeWidth="1.5" />
      <path d="M24 6 L24 42" stroke="#c8861a" strokeWidth="1" opacity="0.4" />
      {Array.from({ length: 7 }).map((_, i) => (
        <g key={i}>
          <circle cx="20" cy={10 + i * 4.5} r="1.8" fill="#e8b83a" stroke="#c8861a" strokeWidth="0.5" />
          <circle cx="28" cy={10 + i * 4.5} r="1.8" fill="#e8b83a" stroke="#c8861a" strokeWidth="0.5" />
        </g>
      ))}
      <path d="M24 6 Q18 3 16 8 M24 6 Q30 3 32 8" stroke="#45D19A" strokeWidth="2" strokeLinecap="round" fill="none" />
    </svg>
  );
}

export function SorghumIcon({ className = 'w-8 h-8' }: IconProps) {
  return (
    <svg viewBox="0 0 48 48" fill="none" className={className} aria-hidden="true">
      <path d="M24 42 L24 16" stroke="#7a6a4a" strokeWidth="2" strokeLinecap="round" />
      <ellipse cx="24" cy="12" rx="5" ry="8" fill="#c8861a" />
      {Array.from({ length: 5 }).map((_, i) => (
        <circle key={i} cx={22 + (i % 2) * 4} cy={9 + i * 1.5} r="1.3" fill="#e8b83a" />
      ))}
      <path d="M24 22 Q16 18 14 24 M24 22 Q32 18 34 24" stroke="#45D19A" strokeWidth="2" strokeLinecap="round" fill="none" />
    </svg>
  );
}

export function GroundnutIcon({ className = 'w-8 h-8' }: IconProps) {
  return (
    <svg viewBox="0 0 48 48" fill="none" className={className} aria-hidden="true">
      <path d="M20 28 Q20 18 24 14 Q28 18 28 28" stroke="#45D19A" strokeWidth="2" fill="none" strokeLinecap="round" />
      <ellipse cx="24" cy="34" rx="7" ry="5" fill="#d4a032" stroke="#c8861a" strokeWidth="1.5" />
      <path d="M19 33 Q24 35 29 33" stroke="#a87018" strokeWidth="0.8" fill="none" />
      <path d="M21 35 Q24 37 27 35" stroke="#a87018" strokeWidth="0.8" fill="none" />
    </svg>
  );
}

export function CowpeaIcon({ className = 'w-8 h-8' }: IconProps) {
  return (
    <svg viewBox="0 0 48 48" fill="none" className={className} aria-hidden="true">
      <path d="M12 24 Q24 10 36 24" stroke="#45D19A" strokeWidth="2.5" fill="none" strokeLinecap="round" />
      <ellipse cx="24" cy="30" rx="9" ry="5" fill="#6ee0b5" stroke="#45D19A" strokeWidth="1.5" />
      {Array.from({ length: 4 }).map((_, i) => (
        <circle key={i} cx={18 + i * 4} cy="30" r="1.8" fill="#127A55" />
      ))}
    </svg>
  );
}

export function SoybeanIcon({ className = 'w-8 h-8' }: IconProps) {
  return (
    <svg viewBox="0 0 48 48" fill="none" className={className} aria-hidden="true">
      <path d="M14 28 Q24 14 34 28" stroke="#45D19A" strokeWidth="2" fill="none" strokeLinecap="round" />
      <ellipse cx="24" cy="32" rx="7" ry="4" fill="#a8d88a" stroke="#45D19A" strokeWidth="1.5" />
      {Array.from({ length: 3 }).map((_, i) => (
        <circle key={i} cx={19 + i * 5} cy="32" r="1.5" fill="#127A55" />
      ))}
    </svg>
  );
}

export function CassavaIcon({ className = 'w-8 h-8' }: IconProps) {
  return (
    <svg viewBox="0 0 48 48" fill="none" className={className} aria-hidden="true">
      <path d="M24 10 L24 22" stroke="#7a6a4a" strokeWidth="2.5" strokeLinecap="round" />
      <path d="M24 14 Q16 12 18 6 M24 14 Q32 12 30 6 M24 14 Q20 10 22 4 M24 14 Q28 10 26 4" stroke="#45D19A" strokeWidth="2" strokeLinecap="round" fill="none" />
      <ellipse cx="24" cy="34" rx="6" ry="8" fill="#e8c89a" stroke="#c8a878" strokeWidth="1.5" />
      <path d="M24 26 L24 42" stroke="#c8a878" strokeWidth="0.8" />
    </svg>
  );
}

export function TomatoIcon({ className = 'w-8 h-8' }: IconProps) {
  return (
    <svg viewBox="0 0 48 48" fill="none" className={className} aria-hidden="true">
      <circle cx="24" cy="28" r="12" fill="#E5604D" stroke="#c8453a" strokeWidth="1.5" />
      <path d="M18 16 Q24 12 30 16" stroke="#45D19A" strokeWidth="2.5" fill="none" strokeLinecap="round" />
      <path d="M22 14 L22 18 M26 14 L26 18 M24 12 L24 18" stroke="#127A55" strokeWidth="1.5" strokeLinecap="round" />
      <ellipse cx="20" cy="24" rx="2" ry="3" fill="#f08a7a" opacity="0.5" />
    </svg>
  );
}

export function MilletIcon({ className = 'w-8 h-8' }: IconProps) {
  return (
    <svg viewBox="0 0 48 48" fill="none" className={className} aria-hidden="true">
      <path d="M24 42 L24 18" stroke="#7a6a4a" strokeWidth="2" strokeLinecap="round" />
      <ellipse cx="24" cy="14" rx="4" ry="7" fill="#e8c86a" stroke="#c8a84a" strokeWidth="1" />
      {Array.from({ length: 6 }).map((_, i) => (
        <circle key={i} cx={22 + (i % 2) * 4} cy={10 + Math.floor(i / 2) * 2.5} r="1.2" fill="#c8a84a" />
      ))}
      <path d="M24 24 Q18 20 16 26 M24 24 Q30 20 32 26" stroke="#45D19A" strokeWidth="1.5" strokeLinecap="round" fill="none" />
    </svg>
  );
}

export function YamIcon({ className = 'w-8 h-8' }: IconProps) {
  return (
    <svg viewBox="0 0 48 48" fill="none" className={className} aria-hidden="true">
      <path d="M18 8 Q16 24 20 40" stroke="#c8a878" strokeWidth="6" fill="none" strokeLinecap="round" />
      <path d="M28 10 Q30 26 26 42" stroke="#e8c89a" strokeWidth="5" fill="none" strokeLinecap="round" />
      <path d="M22 8 Q20 4 16 6 M26 10 Q28 6 32 8" stroke="#45D19A" strokeWidth="2" strokeLinecap="round" fill="none" />
    </svg>
  );
}

export function PepperIcon({ className = 'w-8 h-8' }: IconProps) {
  return (
    <svg viewBox="0 0 48 48" fill="none" className={className} aria-hidden="true">
      <path d="M24 8 L24 16" stroke="#45D19A" strokeWidth="2" strokeLinecap="round" />
      <path d="M20 12 Q24 10 28 12" stroke="#127A55" strokeWidth="2" fill="none" strokeLinecap="round" />
      <path d="M22 16 Q18 28 22 38 Q26 40 28 34 Q30 24 26 16 Z" fill="#E5604D" stroke="#c8453a" strokeWidth="1.5" />
      <path d="M24 18 Q22 28 24 34" stroke="#f08a7a" strokeWidth="1" fill="none" opacity="0.6" />
    </svg>
  );
}

export function RiceIcon({ className = 'w-8 h-8' }: IconProps) {
  return (
    <svg viewBox="0 0 48 48" fill="none" className={className} aria-hidden="true">
      <path d="M22 42 Q23 26 27 12" stroke="#7a6a4a" strokeWidth="2" strokeLinecap="round" />
      <path d="M27 12 Q34 16 33 24" stroke="#d4a032" strokeWidth="1.5" strokeLinecap="round" fill="none" />
      <path d="M20 42 Q19 28 15 20" stroke="#45D19A" strokeWidth="1.5" strokeLinecap="round" />
      {Array.from({ length: 5 }).map((_, i) => (
        <g key={i}>
          <ellipse
            cx={25 + (i % 2) * 5}
            cy={14 + i * 3.5}
            rx="2"
            ry="3.5"
            transform={`rotate(${15 + i * 5} ${25 + (i % 2) * 5} ${14 + i * 3.5})`}
            fill="#F4C04E"
            stroke="#d4a032"
            strokeWidth="0.8"
          />
        </g>
      ))}
      <path d="M16 28 Q24 24 28 32" stroke="#45D19A" strokeWidth="1.5" fill="none" strokeLinecap="round" />
    </svg>
  );
}

export function OkraIcon({ className = 'w-8 h-8' }: IconProps) {
  return (
    <svg viewBox="0 0 48 48" fill="none" className={className} aria-hidden="true">
      <path d="M24 6 L24 12" stroke="#127A55" strokeWidth="2.5" strokeLinecap="round" />
      <path d="M19 12 Q24 10 29 12 L27 15 L21 15 Z" fill="#127A55" />
      <path d="M21 15 Q26 24 24 40 Q22 24 27 15" fill="#45D19A" stroke="#127A55" strokeWidth="1.5" />
      <path d="M24 15 L24 39" stroke="#127A55" strokeWidth="1" strokeLinecap="round" opacity="0.6" />
      <path d="M22 17 Q23 27 24 37" stroke="#6ee0b5" strokeWidth="0.8" strokeLinecap="round" fill="none" />
    </svg>
  );
}

export function SweetPotatoIcon({ className = 'w-8 h-8' }: IconProps) {
  return (
    <svg viewBox="0 0 48 48" fill="none" className={className} aria-hidden="true">
      <path d="M24 8 Q23 16 24 20" stroke="#45D19A" strokeWidth="2" strokeLinecap="round" />
      <path d="M24 12 Q18 8 16 12 M24 14 Q30 10 32 14" stroke="#45D19A" strokeWidth="1.5" fill="none" strokeLinecap="round" />
      <path d="M14 28 Q18 18 30 22 Q36 26 34 32 Q30 38 20 36 Q12 34 14 28 Z" fill="#E5604D" stroke="#c8453a" strokeWidth="1.5" />
      <path d="M17 28 Q24 25 31 29" stroke="#f08a7a" strokeWidth="1" fill="none" opacity="0.5" />
      <circle cx="21" cy="31" r="0.8" fill="#c8453a" />
      <circle cx="27" cy="27" r="0.8" fill="#c8453a" />
    </svg>
  );
}
