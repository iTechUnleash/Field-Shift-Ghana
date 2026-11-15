import type { Region } from '@/data/regions';

export interface ClimateSeries {
  years: number[];
  rainfall: number[];
  temperature: number[];
  source: 'nasa-power' | 'sample';
  fallbackError?: boolean;
}

export interface ClimateSummary {
  rainfallTrendPct: number;
  tempTrendC: number;
  drySpellRisk: 'low' | 'moderate' | 'high';
}

const CACHE_TTL_MS = 7 * 24 * 60 * 60 * 1000; // 7 days

interface CachedClimatePayload {
  timestamp: number;
  data: ClimateSeries;
}

function seededRandom(seed: number): () => number {
  let s = seed;
  return () => {
    s = (s * 9301 + 49297) % 233280;
    return s / 233280;
  };
}

export function linearRegression(x: number[], y: number[]): { slope: number; intercept: number } {
  const n = x.length;
  const sumX = x.reduce((a, b) => a + b, 0);
  const sumY = y.reduce((a, b) => a + b, 0);
  const sumXY = x.reduce((acc, xi, i) => acc + xi * y[i], 0);
  const sumX2 = x.reduce((acc, xi) => acc + xi * xi, 0);
  const slope = (n * sumXY - sumX * sumY) / (n * sumX2 - sumX * sumX);
  const intercept = (sumY - slope * sumX) / n;
  return { slope, intercept };
}

export function summarizeClimate(climate: ClimateSeries): ClimateSummary {
  const rainfallRegression = linearRegression(
    climate.years.map((_, i) => i),
    climate.rainfall,
  );
  const tempRegression = linearRegression(
    climate.years.map((_, i) => i),
    climate.temperature,
  );
  const meanRainfall = climate.rainfall.reduce((a, b) => a + b, 0) / climate.rainfall.length;
  const rainfallTrendPct = (rainfallRegression.slope / meanRainfall) * 100 * 10;
  const tempTrendC = tempRegression.slope * 10;

  const recentRainfall = climate.rainfall.slice(-5);
  const recentMean = recentRainfall.reduce((a, b) => a + b, 0) / recentRainfall.length;
  const overallMean = meanRainfall;
  const ratio = recentMean / overallMean;

  let drySpellRisk: ClimateSummary['drySpellRisk'] = 'low';
  if (ratio < 0.92) drySpellRisk = 'high';
  else if (ratio < 0.97) drySpellRisk = 'moderate';

  return {
    rainfallTrendPct: parseFloat(rainfallTrendPct.toFixed(1)),
    tempTrendC: parseFloat(tempTrendC.toFixed(2)),
    drySpellRisk,
  };
}

function generateSampleClimate(region: Region, hasFallbackError = false): ClimateSeries {
  const startYear = 2001;
  const endYear = 2024;
  const years: number[] = [];
  for (let y = startYear; y <= endYear; y++) years.push(y);

  const seed = Math.round(Math.abs(region.lat * 1000 + region.lon * 1000));
  const rand = seededRandom(seed);

  const rainfall: number[] = [];
  const temperature: number[] = [];

  const n = years.length;
  for (let i = 0; i < n; i++) {
    const progress = i / (n - 1);
    const rainDecline = region.avgRainfall * 0.15 * progress;
    const noise = (rand() - 0.5) * region.avgRainfall * 0.18;
    const rain = region.avgRainfall - rainDecline + noise;
    rainfall.push(Math.round(rain));

    const tempRise = 0.6 * progress;
    const tempNoise = (rand() - 0.5) * 0.4;
    const temp = region.avgTemp + tempRise + tempNoise;
    temperature.push(parseFloat(temp.toFixed(1)));
  }

  return {
    years,
    rainfall,
    temperature,
    source: 'sample',
    fallbackError: hasFallbackError,
  };
}

export async function getClimate(region: Region): Promise<ClimateSeries> {
  const cacheKey = `fieldshift_nasa_${region.id}`;

  // 1. Try reading from cache
  try {
    const cachedItem = localStorage.getItem(cacheKey);
    if (cachedItem) {
      const parsed: CachedClimatePayload = JSON.parse(cachedItem);
      if (parsed && parsed.timestamp && Date.now() - parsed.timestamp < CACHE_TTL_MS && parsed.data) {
        return parsed.data;
      }
    }
  } catch {
    // Ignore localStorage read errors
  }

  // 2. Fetch live data from NASA POWER Monthly Point API
  const url = `https://power.larc.nasa.gov/api/temporal/monthly/point?parameters=PRECTOTCORR,T2M&community=AG&longitude=${region.lon}&latitude=${region.lat}&start=2001&end=2024&format=JSON`;

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 10000);

  try {
    const response = await fetch(url, { signal: controller.signal });
    clearTimeout(timeoutId);

    if (!response.ok) {
      throw new Error(`NASA POWER API HTTP ${response.status}`);
    }

    const json = await response.json();
    const prec = json?.properties?.parameter?.PRECTOTCORR;
    const t2m = json?.properties?.parameter?.T2M;

    if (!prec || !t2m) {
      throw new Error('Invalid NASA POWER payload format');
    }

    const years: number[] = [];
    const rainfall: number[] = [];
    const temperature: number[] = [];

    for (let y = 2001; y <= 2024; y++) {
      const annualKey = `${y}13`;
      const pVal = prec[annualKey];
      const tVal = t2m[annualKey];

      // Treat -999, undefined, null, or NaN as invalid
      const isPrecValid =
        typeof pVal === 'number' && !isNaN(pVal) && pVal > -900;
      const isTempValid =
        typeof tVal === 'number' && !isNaN(tVal) && tVal > -900;

      if (isPrecValid && isTempValid) {
        years.push(y);
        // Annual rainfall in mm = PRECTOTCORR annual value * 365 (it is mm/day)
        rainfall.push(Math.round(pVal * 365));
        // Temperature is T2M annual value in °C
        temperature.push(parseFloat(tVal.toFixed(1)));
      }
    }

    if (years.length < 15) {
      throw new Error(`Insufficient valid years returned: ${years.length}`);
    }

    const liveSeries: ClimateSeries = {
      years,
      rainfall,
      temperature,
      source: 'nasa-power',
      fallbackError: false,
    };

    // 3. Cache successful response in localStorage
    try {
      const cachePayload: CachedClimatePayload = {
        timestamp: Date.now(),
        data: liveSeries,
      };
      localStorage.setItem(cacheKey, JSON.stringify(cachePayload));
    } catch {
      // Ignore localStorage write quota/access errors
    }

    return liveSeries;
  } catch (err) {
    clearTimeout(timeoutId);
    console.warn('NASA POWER API fetch failed, falling back to sample generator:', err);
    return generateSampleClimate(region, true);
  }
}
