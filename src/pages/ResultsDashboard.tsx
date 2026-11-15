import { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, MapPin, Layers, Droplets, Sprout, Target, MessageCircle, BookOpen } from 'lucide-react';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { Badge } from '@/components/Badge';
import { StatCard } from '@/components/StatCard';
import { TrendChart } from '@/components/TrendChart';
import { RiskMeter } from '@/components/RiskMeter';
import { SeasonCard } from '@/components/SeasonCard';
import { Sheet } from '@/components/Sheet';
import { Drawer } from '@/components/Drawer';
import { MethodContent } from '@/components/MethodContent';
import { getRegionById } from '@/data/regions';
import { getCropById, familyLabels } from '@/data/crops';
import { getClimate, type ClimateSeries } from '@/lib/climate';
import { buildRotation, type RotationResult } from '@/lib/rotation';
import type { FarmerAnswers } from '@/lib/types';
import { soilLabels, waterLabels, priorityLabels } from '@/lib/types';

export function ResultsDashboard() {
  const navigate = useNavigate();
  const [answers, setAnswers] = useState<FarmerAnswers | null>(null);
  const [climate, setClimate] = useState<ClimateSeries | null>(null);
  const [rotation, setRotation] = useState<RotationResult | null>(null);
  const [loading, setLoading] = useState(true);
  const [methodOpen, setMethodOpen] = useState(false);

  useEffect(() => {
    const stored = sessionStorage.getItem('fieldshift-answers');
    if (!stored) {
      navigate('/plan');
      return;
    }
    const parsed: FarmerAnswers = JSON.parse(stored);
    const region = getRegionById(parsed.regionId || '');
    if (!region) {
      navigate('/plan');
      return;
    }
    setAnswers(parsed);

    (async () => {
      const climateData = await getClimate(region);
      setClimate(climateData);
      const result = buildRotation(
        {
          region,
          soil: parsed.soil!,
          water: parsed.water!,
          lastCrop: parsed.lastCrop!,
          priority: parsed.priority!,
        },
        climateData,
      );
      setRotation(result);
      setLoading(false);
    })();
  }, [navigate]);

  const region = useMemo(() => getRegionById(answers?.regionId || ''), [answers]);

  const rainfallSlope = rotation?.climate.rainfallTrendPct ?? 0;
  const rainfallTrend: 'up' | 'down' | 'neutral' =
    rainfallSlope > 0 ? 'up' : rainfallSlope < 0 ? 'down' : 'neutral';
  const rainfallAccent: 'green' | 'coral' | 'gold' =
    rainfallSlope > 0 ? 'green' : rainfallSlope < 0 ? 'coral' : 'gold';
  const rainfallFormatted =
    rainfallSlope > 0
      ? `+${rainfallSlope}%`
      : rainfallSlope < 0
        ? `−${Math.abs(rainfallSlope)}%`
        : `0.0%`;

  const tempSlope = rotation?.climate.tempTrendC ?? 0;
  const tempTrend: 'up' | 'down' | 'neutral' =
    tempSlope > 0 ? 'up' : tempSlope < 0 ? 'down' : 'neutral';
  const tempAccent: 'gold' | 'green' | 'coral' =
    tempSlope > 0 ? 'gold' : tempSlope < 0 ? 'green' : 'gold';
  const tempFormatted =
    tempSlope > 0
      ? `+${tempSlope}°C`
      : tempSlope < 0
        ? `−${Math.abs(tempSlope)}°C`
        : `0.00°C`;

  const whatsappLink = useMemo(() => {
    if (!rotation || !region || !answers || !climate) return '#';
    const lines = [
      `*Field Shift Ghana — Crop Plan for ${region.town}*`,
      ``,
      `Region: ${region.name} (${region.town})`,
      `Soil: ${soilLabels[answers.soil!]}`,
      `Water: ${waterLabels[answers.water!]}`,
      `Last crop: ${getCropById(answers.lastCrop!)?.name}`,
      `Priority: ${priorityLabels[answers.priority!]}`,
      ``,
      `Climate trend:`,
      `  Rainfall: ${rainfallFormatted} per decade`,
      `  Temperature: ${tempFormatted} per decade`,
      `  Dry-spell risk: ${rotation.climate.drySpellRisk}`,
      ``,
      `Recommended rotation:`,
      ...rotation.seasons.map(
        s => `  ${s.label}: ${s.crop.name} (${familyLabels[s.crop.family]}) — ${s.reason}`,
      ),
      ``,
      climate.source === 'nasa-power'
        ? `Data: NASA POWER (2001 to 2024)`
        : `Data: Sample data (demo)`,
      `Note: Confirm with your local agricultural extension officer.`,
    ];
    const text = encodeURIComponent(lines.join('\n'));
    return `https://wa.me/?text=${text}`;
  }, [rotation, region, answers, climate, rainfallFormatted, tempFormatted]);

  if (loading || !answers || !region || !climate || !rotation) {
    return (
      <div className="min-h-screen" style={{ background: 'var(--bg)' }}>
        <Navbar />
        <div className="mx-auto flex max-w-2xl flex-col items-center justify-center px-4 py-24" aria-live="polite">
          <div className="flex flex-col items-center gap-4">
            <div className="relative h-16 w-16">
              <div
                className="absolute inset-0 animate-pulse-dot rounded-full border-4"
                style={{ borderColor: 'var(--accent)', borderTopColor: 'transparent' }}
              />
              <div className="absolute inset-2 flex items-center justify-center">
                <Sprout className="h-6 w-6" style={{ color: 'var(--accent)' }} />
              </div>
            </div>
            <p className="font-display text-lg font-semibold" style={{ color: 'var(--text-primary)' }}>
              Reading NASA data for {region?.town || 'your region'}…
            </p>
            <p className="text-sm" style={{ color: 'var(--text-muted)' }}>
              Building your three-season rotation plan
            </p>
          </div>

          {/* Skeleton cards */}
          <div className="mt-8 w-full max-w-md space-y-4">
            <div className="h-32 animate-pulse rounded-2xl" style={{ background: 'var(--bg-muted)' }} />
            <div className="h-48 animate-pulse rounded-2xl" style={{ background: 'var(--bg-muted)' }} />
            <div className="h-64 animate-pulse rounded-2xl" style={{ background: 'var(--bg-muted)' }} />
          </div>
        </div>
      </div>
    );
  }

  const lastCropObj = getCropById(answers.lastCrop!);
  const chips = [
    { icon: MapPin, label: region.town, step: 1 },
    { icon: Layers, label: soilLabels[answers.soil!], step: 2 },
    { icon: Droplets, label: waterLabels[answers.water!], step: 2 },
    { icon: Sprout, label: lastCropObj?.name || '—', step: 2 },
    { icon: Target, label: priorityLabels[answers.priority!], step: 3 },
  ];

  function editStep(step: number) {
    const stored = sessionStorage.getItem('fieldshift-answers');
    if (stored) {
      const parsed = JSON.parse(stored);
      parsed._editStep = step;
      sessionStorage.setItem('fieldshift-answers', JSON.stringify(parsed));
    }
    navigate('/plan');
  }

  return (
    <div className="min-h-screen overflow-x-clip" style={{ background: 'var(--bg)' }}>
      <Navbar />

      <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6">
        {/* Back link */}
        <button
          onClick={() => navigate('/')}
          className="mb-4 inline-flex min-h-[48px] items-center gap-2 pr-4 text-sm font-semibold transition-colors"
          style={{ color: 'var(--text-secondary)' }}
        >
          <ArrowLeft className="h-4 w-4" />
          Home
        </button>

        {/* Header */}
        <div className="animate-fade-up">
          <h1 className="font-display text-3xl font-bold tracking-tight sm:text-4xl" style={{ color: 'var(--text-primary)' }}>
            Your plan for {region.town}
          </h1>
          <p className="mt-2 text-base" style={{ color: 'var(--text-secondary)' }}>
            Based on 24 years of climate data and your field conditions.
          </p>

          {/* Summary chips */}
          <div className="mt-4 flex flex-wrap gap-2">
            {chips.map((chip, i) => {
              const Icon = chip.icon;
              return (
                <button
                  key={i}
                  onClick={() => editStep(chip.step)}
                  className="inline-flex min-h-[48px] items-center gap-2 rounded-full border px-4 py-2.5 text-xs sm:text-sm font-semibold transition-all hover:scale-105"
                  style={{
                    borderColor: 'var(--border)',
                    background: 'var(--bg-surface)',
                    color: 'var(--text-secondary)',
                  }}
                  aria-label={`Edit ${chip.label}, goes to step ${chip.step}`}
                >
                  <Icon className="h-4 w-4" style={{ color: 'var(--accent)' }} />
                  <span>{chip.label}</span>
                </button>
              );
            })}
          </div>

          {/* Data badge */}
          <div className="mt-4">
            {climate.source === 'nasa-power' ? (
              <Badge variant="green" icon={<span className="text-xs">●</span>}>
                Live NASA POWER data
              </Badge>
            ) : (
              <>
                <Badge variant="gold" icon={<span className="text-xs">●</span>}>
                  Sample data
                </Badge>
                {climate.fallbackError && (
                  <p className="mt-1.5 text-xs" style={{ color: 'var(--text-muted)' }}>
                    Could not reach NASA right now, showing sample data.
                  </p>
                )}
              </>
            )}
          </div>
        </div>

        {/* Climate card */}
        <div className="card mt-6 animate-fade-up p-4 sm:p-6" style={{ animationDelay: '0.1s' }}>
          <div className="mb-4 flex items-center justify-between">
            <h2 className="font-display text-xl font-bold" style={{ color: 'var(--text-primary)' }}>
              Your shifting climate
            </h2>
            <span className="text-xs" style={{ color: 'var(--text-muted)' }}>
              2001–2024
            </span>
          </div>

          {/* Stats */}
          <div className="mb-6 grid grid-cols-2 gap-3">
            <StatCard
              value={rainfallFormatted}
              label="Rainfall change per decade"
              trend={rainfallTrend}
              accent={rainfallAccent}
            />
            <StatCard
              value={tempFormatted}
              label="Temperature change per decade"
              trend={tempTrend}
              accent={tempAccent}
            />
          </div>

          {/* Charts */}
          <TrendChart
            climate={climate}
            dataKey="rainfall"
            unit="mm"
            color="#45D19A"
            label="Annual rainfall (mm)"
            altSummary={`Annual rainfall from ${climate.rainfall[0]}mm in 2001 to ${climate.rainfall[climate.rainfall.length - 1]}mm in 2024, with a ${rainfallFormatted} per decade ${rainfallSlope < 0 ? 'downward' : 'upward'} trend.`}
          />
          <div className="mt-4">
            <TrendChart
              climate={climate}
              dataKey="temperature"
              unit="°C"
              color="#F4C04E"
              label="Average temperature (°C)"
              altSummary={`Average temperature from ${climate.temperature[0]}°C in 2001 to ${climate.temperature[climate.temperature.length - 1]}°C in 2024, ${tempSlope >= 0 ? 'rising' : 'falling'} ${Math.abs(tempSlope)}°C per decade.`}
            />
          </div>

          {/* Dry spell risk meter */}
          <div className="mt-6 border-t pt-5" style={{ borderColor: 'var(--border)' }}>
            <h3 className="mb-3 font-display text-base font-semibold" style={{ color: 'var(--text-primary)' }}>
              Dry-spell risk
            </h3>
            <RiskMeter risk={rotation.climate.drySpellRisk} />
          </div>
        </div>

        {/* Rotation card */}
        <div className="card mt-6 animate-fade-up p-4 sm:p-6" style={{ animationDelay: '0.2s' }}>
          <div className="mb-5">
            <h2 className="font-display text-xl font-bold" style={{ color: 'var(--text-primary)' }}>
              Your three-season rotation
            </h2>
            <p className="mt-1 text-sm" style={{ color: 'var(--text-secondary)' }}>
              {rotation.summary}
            </p>
          </div>

          {/* Timeline */}
          <div className="flex flex-col">
            {rotation.seasons.map((season, i) => (
              <SeasonCard
                key={season.seasonNumber}
                season={season}
                isLast={i === rotation.seasons.length - 1}
              />
            ))}
          </div>

          {/* Why this plan drawer */}
          <div className="mt-6">
            <Drawer title="Why this plan?">
              <div className="flex flex-col gap-3 text-sm" style={{ color: 'var(--text-secondary)' }}>
                <p>
                  <strong style={{ color: 'var(--text-primary)' }}>1. Alternate families.</strong> Each season
                  comes from a different crop family. This breaks pest cycles and keeps soil balanced.
                </p>
                <p>
                  <strong style={{ color: 'var(--text-primary)' }}>2. Drought awareness.</strong> Because rainfall
                  in {region.town} is {rotation.climate.rainfallTrendPct < 0 ? 'falling' : 'stable'}, we
                  {rotation.climate.rainfallTrendPct < 0 ? ' prioritised drought-tolerant crops.' : ' balanced drought tolerance with income.'}
                </p>
                <p>
                  <strong style={{ color: 'var(--text-primary)' }}>3. Your priority.</strong> We weighted crops
                  toward {priorityLabels[answers.priority!].toLowerCase()} because that is what you chose.
                </p>
                <p>
                  <strong style={{ color: 'var(--text-primary)' }}>4. Your field.</strong> We adjusted for
                  {' '}{soilLabels[answers.soil!].toLowerCase()} soil and {waterLabels[answers.water!].toLowerCase()} water access.
                </p>
              </div>
            </Drawer>
          </div>
        </div>

        {/* Actions */}
        <div className="mt-6 flex flex-col gap-3 animate-fade-up" style={{ animationDelay: '0.3s' }}>
          <a
            href={whatsappLink}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-primary w-full text-base"
            style={{ minHeight: 56 }}
          >
            <MessageCircle className="h-5 w-5" />
            Send plan on WhatsApp
          </a>
          <div className="flex flex-col sm:flex-row gap-3">
            <button
              onClick={() => navigate('/plan')}
              className="btn-secondary flex-1 w-full sm:w-auto"
            >
              Change my answers
            </button>
            <button
              onClick={() => setMethodOpen(true)}
              className="btn-secondary flex-1 w-full sm:w-auto"
            >
              <BookOpen className="h-5 w-5" />
              How we calculate this
            </button>
          </div>
        </div>
      </div>

      <Footer />

      {/* Method sheet */}
      <Sheet open={methodOpen} onClose={() => setMethodOpen(false)} title="How we calculate this">
        <MethodContent />
      </Sheet>
    </div>
  );
}
