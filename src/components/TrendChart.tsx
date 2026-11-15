import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
  ReferenceLine,
  Tooltip,
} from 'recharts';
import type { ClimateSeries } from '@/lib/climate';

interface TrendChartProps {
  climate: ClimateSeries;
  dataKey: 'rainfall' | 'temperature';
  unit: string;
  color: string;
  label: string;
  altSummary: string;
}

export function TrendChart({ climate, dataKey, unit, color, label, altSummary }: TrendChartProps) {
  const data = climate.years.map((year, i) => ({
    year: year.toString().slice(2),
    fullYear: year,
    value: climate[dataKey][i],
  }));

  const values = data.map(d => d.value);
  const min = Math.floor(Math.min(...values));
  const max = Math.ceil(Math.max(...values));
  const padding = (max - min) * 0.15 || 1;
  const yDomain: [number, number] = [Math.floor(min - padding), Math.ceil(max + padding)];

  const n = data.length;
  const first = data[0].value;
  const last = data[n - 1].value;
  const trendData = data.map((d, i) => ({
    ...d,
    trend: first + ((last - first) * i) / (n - 1),
  }));

  const prefersReducedMotion =
    typeof window !== 'undefined' &&
    window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
  const isAnimationActive = !prefersReducedMotion;

  return (
    <div className="w-full">
      <p className="mb-2 text-sm font-semibold" style={{ color: 'var(--text-secondary)' }}>
        {label}
      </p>
      <div className="h-48 w-full" role="img" aria-label={altSummary}>
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={trendData} margin={{ top: 8, right: 8, bottom: 0, left: -28 }}>
            <defs>
              <linearGradient id={`grad-${dataKey}`} x1="0" y1="0" x2="1" y2="0">
                <stop offset="0%" stopColor={color} stopOpacity={0.8} />
                <stop offset="100%" stopColor={color} stopOpacity={1} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} opacity={0.5} />
            <XAxis
              dataKey="year"
              tick={{ fontSize: 11, fill: 'var(--text-muted)', fontFamily: 'DM Sans' }}
              axisLine={false}
              tickLine={false}
              interval={4}
            />
            <YAxis
              domain={yDomain}
              tick={{ fontSize: 11, fill: 'var(--text-muted)', fontFamily: 'DM Sans' }}
              axisLine={false}
              tickLine={false}
              tickFormatter={v => Math.round(v).toString()}
            />
            <Tooltip
              contentStyle={{
                background: 'var(--bg-surface)',
                border: '1px solid var(--border)',
                borderRadius: '12px',
                fontSize: '13px',
                fontFamily: 'DM Sans',
              }}
              labelFormatter={(label) => `20${label}`}
              formatter={(value) => [`${Number(value).toFixed(1)} ${unit}`, dataKey === 'rainfall' ? 'Rainfall' : 'Temperature']}
            />
            <ReferenceLine y={trendData[0].trend} stroke="transparent" />
            <Line
              type="monotone"
              dataKey="trend"
              stroke={color}
              strokeWidth={1.5}
              strokeDasharray="5 4"
              dot={false}
              isAnimationActive={isAnimationActive}
              animationDuration={1200}
            />
            <Line
              type="monotone"
              dataKey="value"
              stroke={`url(#grad-${dataKey})`}
              strokeWidth={2.5}
              dot={false}
              isAnimationActive={isAnimationActive}
              animationDuration={1500}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
