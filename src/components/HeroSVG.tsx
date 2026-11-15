function HeroSatelliteSVG() {
  return (
    <svg
      viewBox="0 0 800 500"
      fill="none"
      className="h-full w-full"
      preserveAspectRatio="xMidYMid slice"
      aria-hidden="true"
    >
      <defs>
        <linearGradient id="sky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#0C1B2E" />
          <stop offset="60%" stopColor="#16263d" />
          <stop offset="100%" stopColor="#1a2d44" />
        </linearGradient>
        <linearGradient id="field1" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#127A55" stopOpacity="0.9" />
          <stop offset="100%" stopColor="#0e5f42" stopOpacity="0.7" />
        </linearGradient>
        <linearGradient id="field2" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#1a9c6f" stopOpacity="0.7" />
          <stop offset="100%" stopColor="#127A55" stopOpacity="0.8" />
        </linearGradient>
        <linearGradient id="field3" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#45D19A" stopOpacity="0.5" />
          <stop offset="100%" stopColor="#1a9c6f" stopOpacity="0.6" />
        </linearGradient>
        <linearGradient id="goldfield" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#F4C04E" stopOpacity="0.4" />
          <stop offset="100%" stopColor="#d4a032" stopOpacity="0.3" />
        </linearGradient>
        <radialGradient id="pivotCircle" cx="0.5" cy="0.5" r="0.5">
          <stop offset="0%" stopColor="#45D19A" stopOpacity="0.6" />
          <stop offset="70%" stopColor="#127A55" stopOpacity="0.4" />
          <stop offset="100%" stopColor="#127A55" stopOpacity="0" />
        </radialGradient>
        <linearGradient id="rainTrend" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#6ee0b5" stopOpacity="0.9" />
          <stop offset="100%" stopColor="#45D19A" stopOpacity="0.3" />
        </linearGradient>
        <filter id="glow">
          <feGaussianBlur stdDeviation="3" result="coloredBlur" />
          <feMerge>
            <feMergeNode in="coloredBlur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      <rect width="800" height="500" fill="url(#sky)" />

      {/* faint grid lines suggesting satellite imagery */}
      {Array.from({ length: 12 }).map((_, i) => (
        <line
          key={`v-${i}`}
          x1={i * 70}
          y1="0"
          x2={i * 70}
          y2="500"
          stroke="#2a4060"
          strokeWidth="0.5"
          opacity="0.3"
        />
      ))}
      {Array.from({ length: 8 }).map((_, i) => (
        <line
          key={`h-${i}`}
          x1="0"
          y1={i * 65}
          x2="800"
          y2={i * 65}
          stroke="#2a4060"
          strokeWidth="0.5"
          opacity="0.3"
        />
      ))}

      {/* satellite farmland strips */}
      <path d="M0 180 Q200 170 400 185 T800 180 L800 230 Q600 215 400 225 T0 230 Z" fill="url(#field1)" />
      <path d="M0 230 Q200 220 400 235 T800 230 L800 280 Q600 265 400 275 T0 280 Z" fill="url(#field2)" />
      <path d="M0 280 Q200 270 400 285 T800 280 L800 330 Q600 315 400 325 T0 330 Z" fill="url(#field3)" />
      <path d="M0 330 Q200 320 400 335 T800 330 L800 380 Q600 365 400 375 T0 380 Z" fill="url(#goldfield)" />
      <path d="M0 380 Q200 370 400 385 T800 380 L800 500 L0 500 Z" fill="url(#field1)" opacity="0.5" />

      {/* centre-pivot irrigation circles */}
      <circle cx="180" cy="260" r="55" fill="url(#pivotCircle)" stroke="#45D19A" strokeWidth="0.5" opacity="0.5" />
      <circle cx="180" cy="260" r="55" fill="none" stroke="#6ee0b5" strokeWidth="0.5" strokeDasharray="2 3" opacity="0.4" />
      <line x1="180" y1="260" x2="180" y2="205" stroke="#45D19A" strokeWidth="0.5" opacity="0.3" />

      <circle cx="580" cy="310" r="45" fill="url(#pivotCircle)" stroke="#45D19A" strokeWidth="0.5" opacity="0.4" />
      <circle cx="580" cy="310" r="45" fill="none" stroke="#6ee0b5" strokeWidth="0.5" strokeDasharray="2 3" opacity="0.3" />
      <line x1="580" y1="310" x2="625" y2="310" stroke="#45D19A" strokeWidth="0.5" opacity="0.3" />

      {/* small field divisions */}
      <line x1="300" y1="200" x2="300" y2="270" stroke="#0e5f42" strokeWidth="0.8" opacity="0.4" />
      <line x1="450" y1="210" x2="450" y2="280" stroke="#0e5f42" strokeWidth="0.8" opacity="0.4" />
      <line x1="100" y1="290" x2="100" y2="360" stroke="#0e5f42" strokeWidth="0.8" opacity="0.3" />
      <line x1="650" y1="200" x2="650" y2="270" stroke="#0e5f42" strokeWidth="0.8" opacity="0.4" />

      {/* dashed rainfall trend line descending */}
      <path
        d="M40 120 Q150 110 250 130 T450 145 T650 155 T780 175"
        stroke="url(#rainTrend)"
        strokeWidth="2"
        strokeDasharray="6 4"
        fill="none"
        filter="url(#glow)"
      >
        <animate
          attributeName="stroke-dashoffset"
          from="200"
          to="0"
          dur="2s"
          fill="freeze"
        />
      </path>

      {/* rain dots along trend */}
      {[
        [40, 120], [180, 118], [320, 135], [460, 148], [600, 155], [760, 175],
      ].map(([x, y], i) => (
        <circle
          key={`rain-${i}`}
          cx={x}
          cy={y}
          r="3"
          fill="#6ee0b5"
          opacity={0.6 - i * 0.07}
        >
          <animate
            attributeName="opacity"
            values="0.6;0.2;0.6"
            dur="3s"
            begin={`${i * 0.3}s`}
            repeatCount="indefinite"
          />
        </circle>
      ))}

      {/* temperature trend line ascending */}
      <path
        d="M40 60 Q200 55 400 50 T780 35"
        stroke="#F4C04E"
        strokeWidth="1.5"
        fill="none"
        opacity="0.5"
      >
        <animate
          attributeName="stroke-dashoffset"
          from="300"
          to="0"
          dur="2.5s"
          fill="freeze"
        />
      </path>

      {/* stars / satellite dots */}
      {[[60, 40], [120, 25], [250, 35], [380, 20], [520, 30], [680, 25], [730, 50]].map(([x, y], i) => (
        <circle key={`star-${i}`} cx={x} cy={y} r="1" fill="#E6F1EC" opacity="0.6">
          <animate
            attributeName="opacity"
            values="0.6;0.2;0.6"
            dur={`${2 + i * 0.3}s`}
            repeatCount="indefinite"
          />
        </circle>
      ))}
    </svg>
  );
}

export { HeroSatelliteSVG };
