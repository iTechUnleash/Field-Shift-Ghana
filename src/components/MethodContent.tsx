import { Satellite, Calendar, Repeat, Droplets, Layers, AlertTriangle, Database } from 'lucide-react';

export function MethodContent() {
  const sections = [
    {
      icon: Satellite,
      title: 'Data source',
      body: 'Precipitation (PRECTOTCORR) and 2-meter air temperature (T2M) come from the NASA POWER (Prediction Of Worldwide Energy Resources) Agroclimatology (AG) monthly API, covering all 16 administrative regions of Ghana across the Northern, Middle, and Southern belts. POWER integrates satellite observations and NASA MERRA-2 meteorological assimilation models on a global 0.5° × 0.625° grid.',
    },
    {
      icon: Calendar,
      title: 'Years and annual averages used',
      body: 'We analyse 24 years of NASA records (2001–2024) using annual values (month 13 in the POWER monthly series). Daily precipitation rates (mm/day) are converted to annual precipitation totals (mm), and mean 2-meter temperatures (°C) are analyzed via linear regression to derive 10-year decadal trends.',
    },
    {
      icon: Repeat,
      title: 'Rotation rules',
      body: 'The rotation follows four simple rules that work for smallholder farms. In northern Ghana there is usually one main rainy season a year, so three seasons can span three years. In the south there are usually two.',
      list: [
        'Alternate cereals with legumes so the soil gets natural nitrogen.',
        'Never repeat the same crop family back to back — this breaks pest and disease cycles.',
        'Favour drought-tolerant crops when rainfall is falling in your area.',
        'Adjust the choice based on your soil type and your personal priority.',
      ],
    },
    {
      icon: Droplets,
      title: 'Drought tolerance',
      body: 'Each crop is rated 1–3 for drought tolerance, water need, income potential and soil benefit. The planner weighs these against your climate trend and field conditions.',
    },
    {
      icon: Layers,
      title: 'Dry-spell risk',
      body: 'We compare recent rainfall (last 5 years) against the 24-year average. If recent rainfall is well below average, the risk meter moves to moderate or high.',
    },
    {
      icon: AlertTriangle,
      title: 'Honest limitations',
      body: 'NASA POWER satellite trends reflect 24-year climatic shifts rather than day-to-day weather forecasts. If NASA servers are momentarily unreachable or time out, the system automatically falls back to local sample baselines. Always confirm rotation plans with your local agricultural extension officer.',
    },
  ];

  return (
    <div className="flex flex-col gap-6">
      <div
        className="flex items-center gap-3 rounded-2xl border p-4"
        style={{ borderColor: 'rgba(69, 209, 154, 0.3)', background: 'rgba(69, 209, 154, 0.08)' }}
      >
        <Database className="h-5 w-5 shrink-0" style={{ color: 'var(--accent-bright)' }} />
        <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
          Connected to <strong style={{ color: 'var(--accent)' }}>live NASA POWER monthly data</strong> (2001–2024) with 7-day local caching and seamless fallback.
        </p>
      </div>

      {sections.map((section, i) => {
        const Icon = section.icon;
        return (
          <div key={i}>
            <div className="flex items-center gap-2">
              <Icon className="h-5 w-5" style={{ color: 'var(--accent)' }} />
              <h4 className="font-display text-base font-semibold" style={{ color: 'var(--text-primary)' }}>
                {section.title}
              </h4>
            </div>
            <p className="mt-2 text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
              {section.body}
            </p>
            {section.list && (
              <ul className="mt-3 flex flex-col gap-2">
                {section.list.map((item, j) => (
                  <li key={j} className="flex gap-2 text-sm" style={{ color: 'var(--text-secondary)' }}>
                    <span
                      className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full"
                      style={{ background: 'var(--accent)' }}
                    />
                    {item}
                  </li>
                ))}
              </ul>
            )}
          </div>
        );
      })}
    </div>
  );
}
