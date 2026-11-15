import type { ClimateSeries, ClimateSummary } from '@/lib/climate';
import type { TreeCrop } from '@/data/treeCrops';
import { treeCrops } from '@/data/treeCrops';
import type { Region } from '@/data/regions';

export type TreeRating = 'good' | 'possible' | 'poor';

export interface TreeCropSuitability {
  crop: TreeCrop;
  rating: TreeRating;
  reason: string;
  watch: boolean;
  yearsToHarvest: string;
}

export function rateTreeCrops(
  climate: ClimateSeries,
  summary: ClimateSummary,
  region?: Region,
): TreeCropSuitability[] {
  const meanRainfall =
    climate.rainfall.length > 0
      ? climate.rainfall.reduce((a, b) => a + b, 0) / climate.rainfall.length
      : 1200;
  const meanTemp =
    climate.temperature.length > 0
      ? climate.temperature.reduce((a, b) => a + b, 0) / climate.temperature.length
      : 27;

  const results: TreeCropSuitability[] = treeCrops.map((crop) => {
    // Shea is a native tree of the northern savanna: rate by climate only in Northern belt or Bono East
    if (crop.id === 'shea' && region) {
      const isSheaNativeZone = region.belt === 'northern' || region.id === 'bono-east';
      if (!isSheaNativeZone) {
        return {
          crop,
          rating: 'poor' as TreeRating,
          reason: 'Shea is a savanna tree and is not typically grown in this zone.',
          watch: false,
          yearsToHarvest: crop.yearsToHarvest,
        };
      }
    }

    const isIdealRain = meanRainfall >= crop.idealRainfallMin && meanRainfall <= crop.idealRainfallMax;
    const isIdealTemp = meanTemp >= crop.idealTempMin && meanTemp <= crop.idealTempMax;

    const isWorkableRain = meanRainfall >= crop.workableRainfallMin && meanRainfall <= crop.workableRainfallMax;
    const isWorkableTemp = meanTemp >= crop.workableTempMin && meanTemp <= crop.workableTempMax;

    let rating: TreeRating = 'poor';
    if (isIdealRain && isIdealTemp) {
      rating = 'good';
    } else if (isWorkableRain && isWorkableTemp) {
      rating = 'possible';
    } else {
      rating = 'poor';
    }

    // Watch flag: cocoa or oil palm when rainfall decadal trend is below -3% or temperature trend is above +0.3°C
    const isVulnerableCrop = crop.id === 'cocoa' || crop.id === 'oil-palm';
    const isRiskTrend = summary.rainfallTrendPct < -3 || summary.tempTrendC > 0.3;
    const watch = isVulnerableCrop && isRiskTrend;

    let baseReason = '';
    const roundedRain = Math.round(meanRainfall);
    const formattedTemp = meanTemp.toFixed(1);

    if (rating === 'good') {
      if (crop.id === 'cocoa') {
        baseReason = `Mean annual rainfall of ${roundedRain} mm and temperature of ${formattedTemp}°C provide prime conditions for cocoa canopy and pod development.`;
      } else if (crop.id === 'oil-palm') {
        baseReason = `High annual rainfall (${roundedRain} mm) and tropical warmth (${formattedTemp}°C) satisfy the heavy water requirements of oil palm.`;
      } else if (crop.id === 'cashew') {
        baseReason = `Moderate annual rainfall (${roundedRain} mm) and warm average temperatures (${formattedTemp}°C) create ideal conditions for cashew nut production.`;
      } else {
        baseReason = `Savanna rainfall of ${roundedRain} mm and mean temperature of ${formattedTemp}°C align naturally with indigenous shea habitat.`;
      }
    } else if (rating === 'possible') {
      if (meanRainfall < crop.idealRainfallMin) {
        baseReason = `Annual rainfall (${roundedRain} mm) is below the ideal range for peak yields, but remains workable with moisture-conserving practices.`;
      } else if (meanRainfall > crop.idealRainfallMax) {
        baseReason = `Annual rainfall (${roundedRain} mm) exceeds ideal levels, but remains workable provided soils have sufficient drainage.`;
      } else {
        baseReason = `Temperatures (${formattedTemp}°C) or rainfall (${roundedRain} mm) are near outer boundaries, requiring attentive field site selection.`;
      }
    } else {
      if (meanRainfall < crop.workableRainfallMin) {
        baseReason = `Annual rainfall of ${roundedRain} mm is too dry for ${crop.name.toLowerCase()}, presenting high risks of moisture deficit and stunted growth.`;
      } else if (meanRainfall > crop.workableRainfallMax) {
        baseReason = `Annual rainfall of ${roundedRain} mm is excessively wet for ${crop.name.toLowerCase()}, risking fungal disease and waterlogged roots.`;
      } else {
        baseReason = `Long-term climate (${roundedRain} mm rainfall, ${formattedTemp}°C) falls outside viable commercial thresholds for ${crop.name.toLowerCase()}.`;
      }
    }

    const lifetimeWarning = watch
      ? ` Rapid decadal ${summary.rainfallTrendPct < -3 ? 'drying' : 'warming'} poses compounding climate risk over this tree's 25+ year productive lifespan.`
      : '';

    const reason = `${baseReason}${lifetimeWarning}`;

    return {
      crop,
      rating,
      reason,
      watch,
      yearsToHarvest: crop.yearsToHarvest,
    };
  });

  const ratingWeight: Record<TreeRating, number> = { good: 0, possible: 1, poor: 2 };
  results.sort((a, b) => ratingWeight[a.rating] - ratingWeight[b.rating]);

  return results;
}

