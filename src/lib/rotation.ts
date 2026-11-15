import type { Crop, CropFamily, SoilType } from '@/data/crops';
import { crops } from '@/data/crops';
import type { Region } from '@/data/regions';
import type { ClimateSeries, ClimateSummary } from '@/lib/climate';
import { summarizeClimate } from '@/lib/climate';

export type Priority = 'income' | 'soil' | 'water' | 'risk';
export type WaterAccess = 'rain' | 'irrigated';

export interface RotationInputs {
  region: Region;
  soil: SoilType;
  water: WaterAccess;
  lastCrop: string;
  priority: Priority;
}

export interface SeasonPlan {
  seasonNumber: 1 | 2 | 3;
  label: string;
  crop: Crop;
  reason: string;
}

export interface RotationResult {
  seasons: SeasonPlan[];
  summary: string;
  climate: ClimateSummary;
}

function scoreCrop(
  crop: Crop,
  lastFamily: CropFamily | null,
  inputs: RotationInputs,
  climate: ClimateSummary,
  usedIds: Set<string>,
  usedFamilies: Set<CropFamily>,
  seasonIndex: number,
): number {
  // Hard rule 1: Never repeat a crop in the same plan
  if (usedIds.has(crop.id)) return -999;
  // Hard rule 2: Never repeat the same family back-to-back
  if (crop.family === lastFamily) return -500;

  let score = 0;

  // Diversity rule: never put two legumes in the same 3-season plan unless nothing else is valid
  if (crop.family === 'legume' && usedFamilies.has('legume')) {
    score -= 70;
  }

  // Encourage multi-family diversity (try to include >= 2 distinct families in the 3 seasons)
  if (!usedFamilies.has(crop.family)) {
    score += 8;
  }

  // Base attributes
  score += crop.income * 5;
  score += crop.soilBenefit * 4;

  // Dry factor scales gradually (low=0.4, moderate=0.8, high=1.2)
  let dryFactor = 0.4;
  if (climate.drySpellRisk === 'moderate') dryFactor = 0.8;
  if (climate.drySpellRisk === 'high') dryFactor = 1.2;
  if (climate.rainfallTrendPct < -5) dryFactor += 0.3;
  else if (climate.rainfallTrendPct > 0) dryFactor -= 0.2;

  // Drought tolerance bonus scales smoothly
  score += crop.droughtTolerance * (3.5 * dryFactor);

  // Water need penalty / irrigation dynamics
  if (inputs.water === 'irrigated') {
    // Under irrigation, water penalty is minimal (-1.5 per waterNeed)
    score -= crop.waterNeed * 1.5;
    // High-value water-responsive crops get bonus under irrigation
    if (crop.id === 'tomato') score += 18;
    if (crop.id === 'pepper') score += 12;
    if (crop.id === 'maize') score += 10;
    if (crop.id === 'soybean') score += 8;
  } else {
    // Rain-fed: water need is penalized proportional to dry factor
    score -= crop.waterNeed * (4.5 * dryFactor);
  }

  // Priority tuning
  switch (inputs.priority) {
    case 'income':
      // Strongly favour high-income crops (Maize, Soybean, Tomato, Pepper, Yam)
      if (crop.income === 3) score += 24;
      else if (crop.income === 2) score += 6;
      else score -= 12;
      break;

    case 'soil':
      // Strongly favour legumes and soil restorers
      if (crop.soilBenefit === 3) score += 22;
      else if (crop.soilBenefit === 2) score += 10;
      if (crop.id === 'cowpea') score += 6;
      if (crop.id === 'soybean') score += 4;
      break;

    case 'water':
      // Strongly favour low water need and high drought tolerance
      score += (4 - crop.waterNeed) * 10;
      score += crop.droughtTolerance * 9;
      break;

    case 'risk':
      // Favour drought resilience and steady yield
      score += crop.droughtTolerance * 9;
      score += (4 - crop.waterNeed) * 6;
      score += crop.soilBenefit * 4;
      if (crop.id === 'millet') score += 14;
      if (crop.id === 'sorghum') score += 8;
      if (crop.id === 'cowpea') score += 8;
      if (crop.id === 'cassava') score += 6;
      break;
  }

  // Soil type adjustments
  if (inputs.soil === 'sandy') {
    // Sandy: light, fast draining. Favours drought tolerance, groundnut, millet; penalises high water demand
    if (crop.droughtTolerance === 3) score += 6;
    if (crop.id === 'groundnut') score += 10;
    if (crop.id === 'millet') score += 12;
    if (crop.id === 'cowpea') score += 6;
    if (crop.waterNeed === 3) score -= 10;
  } else if (inputs.soil === 'clay') {
    // Clay: heavy, moisture retentive. Penalises groundnut (pod rot) and cassava (tuber rot); favours cereals and soybean
    if (crop.id === 'groundnut') score -= 24;
    if (crop.id === 'cassava') score -= 18;
    if (crop.family === 'cereal') score += 8;
    if (crop.id === 'soybean') score += 10;
    if (crop.id === 'yam') score += 8;
    if (crop.id === 'pepper') score += 8;
    if (crop.id === 'maize') score += 6;
  } else {
    // Loam: balanced. Great for root tubers, vegetables, and maize
    if (crop.id === 'yam') score += 8;
    if (crop.id === 'maize') score += 6;
    if (crop.id === 'tomato' && inputs.water === 'irrigated') score += 8;
    if (crop.id === 'pepper') score += 6;
  }

  // Regional agro-ecological tuning
  if (inputs.region.id === 'northern') {
    if (crop.id === 'millet') score += 6;
    if (crop.id === 'sorghum') score += 4;
    if (crop.id === 'cowpea') score += 4;
  } else {
    // Ashanti, Bono East, Volta (Bimodal / Forest-Savanna Transition)
    if (crop.id === 'maize') score += 7;
    if (crop.id === 'yam') score += 7;
    if (crop.id === 'soybean') score += 5;
    if (crop.family === 'vegetable') score += 4;
  }

  // Seasonal positioning nuance to break rigid repetitive ordering
  if (seasonIndex === 0) {
    if (crop.family === 'cereal' && inputs.lastCrop !== 'cereal') score += 4;
  } else if (seasonIndex === 1) {
    if (crop.family === 'legume') score += 5;
    if (crop.family === 'root') score += 3;
  } else if (seasonIndex === 2) {
    if (crop.family === 'vegetable' && inputs.water === 'irrigated') score += 6;
    if (crop.id === 'cassava') score += 4;
  }

  return score;
}

function reasonForCrop(
  crop: Crop,
  inputs: RotationInputs,
  climate: ClimateSummary,
  prevFamily: CropFamily | null,
): string {
  const parts: string[] = [];

  // 1. Agronomic niche & family transition
  if (crop.family === 'legume') {
    if (prevFamily === 'cereal') {
      parts.push('Fixes nitrogen naturally, restoring soil fertility depleted by the preceding cereal');
    } else {
      parts.push('Fixes atmospheric nitrogen naturally, strengthening soil biology for subsequent crops');
    }
  } else if (crop.family === 'cereal') {
    if (prevFamily === 'legume') {
      parts.push('Capitalises on the nitrogen fixed by last season’s legume, producing sturdy biomass and grain');
    } else {
      parts.push('Provides reliable staple grain while breaking root pest cycles in the rotation');
    }
  } else if (crop.family === 'root') {
    parts.push('Deep-rooting structure breaks soil compaction and stores nutrients resiliently');
  } else if (crop.family === 'vegetable') {
    if (inputs.water === 'irrigated') {
      parts.push('Fast-maturing high-value horticultural crop ideal for irrigated management');
    } else {
      parts.push('Diversifies field biology while opening profitable market opportunities');
    }
  }

  // 2. Alignment with climate, soil, or priority
  if (inputs.priority === 'income' && crop.income === 3) {
    parts.push('strong local market demand provides high cash returns');
  } else if (inputs.priority === 'soil' && crop.soilBenefit === 3) {
    parts.push('enhances long-term soil structure and fertility');
  } else if (inputs.priority === 'water' && crop.waterNeed === 1) {
    parts.push('thrives on minimal water to conserve moisture');
  } else if (inputs.priority === 'risk' && crop.droughtTolerance === 3) {
    parts.push('delivers dependable yields even under erratic rainfall');
  } else if (inputs.soil === 'sandy' && (crop.id === 'millet' || crop.id === 'groundnut')) {
    parts.push('exceptionally well suited to free-draining sandy ground');
  } else if (inputs.soil === 'clay' && crop.family === 'cereal') {
    parts.push('benefits from the strong water-holding capacity of clay');
  } else if (climate.rainfallTrendPct < 0 && crop.droughtTolerance === 3) {
    parts.push('well adapted to the declining rainfall trend in your area');
  } else if (inputs.water === 'irrigated' && crop.waterNeed >= 2) {
    parts.push('reliable irrigation ensures optimal growth and yield');
  } else {
    parts.push('balances your field conditions with consistent performance');
  }

  return parts[0] + ' — ' + parts[1] + '.';
}

export function buildRotation(inputs: RotationInputs, climate: ClimateSeries): RotationResult {
  const climateSummary = summarizeClimate(climate);
  const usedIds = new Set<string>();
  const usedFamilies = new Set<CropFamily>();
  const seasons: SeasonPlan[] = [];
  const lastCropObj = crops.find(c => c.id === inputs.lastCrop);
  let prevFamily: CropFamily | null = lastCropObj ? lastCropObj.family : null;

  const seasonLabels: [1, 2, 3] = [1, 2, 3];
  const seasonNames = ['Season 1', 'Season 2', 'Season 3'];

  for (let s = 0; s < 3; s++) {
    let best: Crop | null = null;
    let bestScore = -Infinity;

    for (const crop of crops) {
      const score = scoreCrop(crop, prevFamily, inputs, climateSummary, usedIds, usedFamilies, s);
      if (score > bestScore) {
        bestScore = score;
        best = crop;
      }
    }

    if (!best) break;

    usedIds.add(best.id);
    usedFamilies.add(best.family);
    const reason = reasonForCrop(best, inputs, climateSummary, prevFamily);

    seasons.push({
      seasonNumber: seasonLabels[s],
      label: seasonNames[s],
      crop: best,
      reason,
    });

    prevFamily = best.family;
  }

  const summary = `Three seasons that alternate crop families, favour drought-tolerant varieties as rainfall ${climateSummary.rainfallTrendPct < 0 ? 'falls' : 'holds'}, and match your ${inputs.priority === 'income' ? 'income' : inputs.priority === 'soil' ? 'soil-health' : inputs.priority === 'water' ? 'water-saving' : 'low-risk'} priority.`;

  return {
    seasons,
    summary,
    climate: climateSummary,
  };
}
