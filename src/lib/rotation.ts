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

  // Regional agro-ecological tuning across Ghana's ecological belts
  if (inputs.region.belt === 'northern') {
    // Northern savanna: Sudan/Guinea Savanna (Upper West, Upper East, North East, Northern, Savannah)
    if (crop.id === 'millet') score += 6;
    if (crop.id === 'sorghum') score += 4;
    if (crop.id === 'cowpea') score += 4;
  } else if (inputs.region.belt === 'middle') {
    // Middle belt: Forest-Savanna transition zone (Bono, Bono East, Ahafo, Oti)
    if (crop.id === 'maize') score += 7;
    if (crop.id === 'yam') score += 7;
    if (crop.id === 'soybean') score += 5;
    if (crop.family === 'vegetable') score += 4;
  } else {
    // Southern belt: Forest & Coastal zones (Ashanti, Eastern, Western, Western North, Central, Greater Accra, Volta)
    if (crop.id === 'maize') score += 6;
    if (crop.id === 'yam') score += 6;
    if (crop.id === 'cassava') score += 6;
    if (crop.id === 'soybean') score += 4;
    if (crop.family === 'vegetable') score += 5;
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
  seasonIndex: number,
  usedClosingPhrases: Set<string>,
): string {
  // Sentence 1: Agronomic niche & rotational family transition
  let sentence1 = '';
  if (crop.family === 'legume') {
    if (prevFamily === 'cereal') {
      if (crop.id === 'cowpea') {
        sentence1 = 'Quick-maturing legume that fixes nitrogen naturally, replenishing soil depleted by the preceding cereal.';
      } else if (crop.id === 'soybean') {
        sentence1 = 'Deeply nodulating pulse that fixes substantial nitrogen to restore fertility following the cereal harvest.';
      } else {
        sentence1 = 'Fixes nitrogen naturally, restoring soil fertility and structure depleted by the preceding cereal.';
      }
    } else {
      if (crop.id === 'cowpea') {
        sentence1 = 'Rapid canopy growth smothers weeds while fixing atmospheric nitrogen for subsequent crops.';
      } else if (crop.id === 'soybean') {
        sentence1 = 'High-protein pulse that enriches soil biology naturally with fixed atmospheric nitrogen.';
      } else {
        sentence1 = 'Fixes atmospheric nitrogen naturally, strengthening soil biology and nutrient cycling for upcoming plantings.';
      }
    }
  } else if (crop.family === 'cereal') {
    if (prevFamily === 'legume') {
      if (crop.id === 'sorghum') {
        sentence1 = 'Capitalises on residual nitrogen left by last season’s legume, producing sturdy biomass and robust grain heads.';
      } else if (crop.id === 'millet') {
        sentence1 = 'Draws efficiently on nitrogen fixed by the previous legume to generate dense, hardy grain panicles.';
      } else {
        sentence1 = 'Capitalises on the nitrogen fixed by last season’s legume, driving vigorous vegetative growth and high yield.';
      }
    } else {
      if (crop.id === 'sorghum') {
        sentence1 = 'Provides reliable staple grain while breaking soil-borne pathogen cycles between rotational phases.';
      } else if (crop.id === 'millet') {
        sentence1 = 'Hardy cereal that diversifies root profiles and interrupts weed cycles in your field.';
      } else {
        sentence1 = 'Provides dependable staple grain while breaking root pest and weed cycles across the rotation.';
      }
    }
  } else if (crop.family === 'root') {
    if (crop.id === 'cassava') {
      sentence1 = 'Deep-rooting woody shrub that loosens compacted subsoil while accumulating starch reserves underground.';
    } else {
      sentence1 = 'Extensive root network aerates the soil profile and harnesses residual moisture from deeper ground layers.';
    }
  } else if (crop.family === 'vegetable') {
    if (inputs.water === 'irrigated') {
      if (crop.id === 'tomato') {
        sentence1 = 'Fast-maturing horticultural crop well suited to controlled bed management and irrigation.';
      } else {
        sentence1 = 'Continuous-bearing vegetable that thrives under irrigated cultivation with high per-plant productivity.';
      }
    } else {
      if (crop.id === 'tomato') {
        sentence1 = 'Intensive vegetable crop that maximizes land productivity and diversifies field biology.';
      } else {
        sentence1 = 'Sturdy vegetable variety that broadens field ecology while extending the harvest calendar.';
      }
    }
  }

  // Sentence 2: Candidate closing phrases aligned with crop, priority, soil, and climate
  const candidates: string[] = [];

  // 1. Crop-specific priority alignment
  if (crop.id === 'sorghum') {
    if (inputs.priority === 'risk') candidates.push('Delivers dependable yields even under erratic rainfall.');
    if (inputs.priority === 'water') candidates.push('Tolerates severe moisture stress and dry spells with exceptional resilience.');
    if (inputs.priority === 'income') candidates.push('Steady market demand for food and brewing ensures dependable cash returns.');
    if (inputs.priority === 'soil') candidates.push('Extensive fibrous root system stabilizes topsoil and curbs erosion.');
  } else if (crop.id === 'millet') {
    if (inputs.priority === 'risk') candidates.push('Extreme drought tolerance makes it an indispensable buffer against dry weather.');
    if (inputs.priority === 'water') candidates.push('Thrives on minimal moisture and withstands dry spells during critical growth.');
    if (inputs.priority === 'income') candidates.push('Reliable demand in regional food markets secures steady seasonal revenue.');
    if (inputs.priority === 'soil') candidates.push('Thrives in nutrient-lean ground without exhausting residual soil nutrients.');
  } else if (crop.id === 'maize') {
    if (inputs.priority === 'income') candidates.push('Strong local market demand and high yield potential maximize cash returns.');
    if (inputs.priority === 'risk') candidates.push('Staple food crop that secures household consumption with readily tradable surplus.');
    if (inputs.priority === 'soil') candidates.push('Generates abundant organic biomass that protects and enriches topsoil after harvest.');
    if (inputs.water === 'irrigated') candidates.push('Responds dynamically to available water with heavy, profitable cob yields.');
  } else if (crop.id === 'groundnut') {
    if (inputs.priority === 'income') candidates.push('High oilseed value and active market demand provide substantial cash returns.');
    if (inputs.priority === 'soil') candidates.push('Leaves nutrient-dense residue in the root zone to nourish subsequent crops.');
    if (inputs.priority === 'risk') candidates.push('Produces reliable underground pods even when seasonal rains taper off prematurely.');
    if (inputs.soil === 'sandy') candidates.push('Exceptionally well suited to loose, free-draining sandy ground for easy pod lifting.');
  } else if (crop.id === 'cowpea') {
    if (inputs.priority === 'soil') candidates.push('Dense ground cover and aggressive root nodules maximize residual soil fertility.');
    if (inputs.priority === 'water') candidates.push('Rapid pod maturation allows a complete harvest before severe dry spells set in.');
    if (inputs.priority === 'risk') candidates.push('Fast-maturing pulse that minimizes exposure to unpredictable weather.');
    if (inputs.priority === 'income') candidates.push('Consistent dietary staple commanding favorable market prices throughout the year.');
  } else if (crop.id === 'soybean') {
    if (inputs.priority === 'income') candidates.push('High commercial demand from commercial food and feed processors guarantees ready sales.');
    if (inputs.priority === 'soil') candidates.push('Leaves generous residual nitrogen in the soil, lowering fertilizer needs next season.');
    if (inputs.priority === 'risk') candidates.push('Predictable flowering and pod fill stabilize returns across changing weather patterns.');
  } else if (crop.id === 'cassava') {
    if (inputs.priority === 'risk') candidates.push('Underground storage allows flexible harvest timing, acting as a living food reserve.');
    if (inputs.priority === 'water') candidates.push('Exceptional water efficiency lets it endure extended dry periods without wilting.');
    if (inputs.priority === 'income') candidates.push('Continuous commercial demand for processing guarantees steady farm-gate income.');
    if (inputs.priority === 'soil') candidates.push('Provides unbroken ground cover that shields soil from intense heat and downpours.');
  } else if (crop.id === 'yam') {
    if (inputs.priority === 'income') candidates.push('Commanding market prices and strong consumer demand yield substantial financial returns.');
    if (inputs.priority === 'soil') candidates.push('Mounded cultivation aerates the root zone and promotes deep soil structure.');
    if (inputs.priority === 'risk') candidates.push('Substantial tuber volume offers reliable caloric and economic returns.');
  } else if (crop.id === 'tomato') {
    if (inputs.priority === 'income') candidates.push('High commercial value and rapid market turnover maximize revenue per hectare.');
    if (inputs.water === 'irrigated') candidates.push('Controlled water application ensures high-grade fruit and premium market pricing.');
    if (inputs.priority === 'risk') candidates.push('Staggered picking cycles provide frequent cash inflows rather than a single harvest.');
  } else if (crop.id === 'pepper') {
    if (inputs.priority === 'income') candidates.push('High-value cash crop that commands premium prices in urban wholesale markets.');
    if (inputs.priority === 'risk') candidates.push('Extended fruiting window spreads out yield risk and dampens market price volatility.');
    if (inputs.water === 'irrigated') candidates.push('Controlled watering delivers continuous flowering and vigorous fruiting.');
  }

  // 2. Field & Climate condition candidates
  if (inputs.soil === 'sandy' && (crop.id === 'millet' || crop.id === 'groundnut')) {
    candidates.push('Light, free-draining sandy ground facilitates robust root and pod development.');
  } else if (inputs.soil === 'clay' && crop.family === 'cereal') {
    candidates.push('Benefits from the strong moisture-holding capacity of clay soils.');
  } else if (inputs.water === 'irrigated' && crop.waterNeed >= 2) {
    candidates.push('Reliable irrigation guarantees steady vegetative growth and optimal yield weight.');
  } else if (climate.rainfallTrendPct < 0 && crop.droughtTolerance === 3) {
    candidates.push('Well adapted to the declining rainfall trend observed across your district.');
  }

  // 3. General priority candidates
  if (inputs.priority === 'income') {
    candidates.push('Strong market demand provides dependable seasonal revenue for your household.');
    candidates.push('Commercial value helps maximize cash returns from your cultivated acreage.');
  } else if (inputs.priority === 'soil') {
    candidates.push('Enhances long-term soil structure and biological fertility across the cycle.');
    candidates.push('Adds valuable organic residue to improve nutrient retention in the field.');
  } else if (inputs.priority === 'water') {
    candidates.push('Low moisture demand conserves scarce water reserves for subsequent seasons.');
    candidates.push('Tolerates dry spells effectively to safeguard your seasonal harvest.');
  } else if (inputs.priority === 'risk') {
    candidates.push('Resilient crop physiology minimizes production risk under shifting weather.');
    candidates.push('Buffers your household against unexpected rainfall deficits.');
  }

  // 4. Season-specific fallbacks
  if (seasonIndex === 0) {
    candidates.push('Establishes a resilient foundation for your three-season rotation.');
    candidates.push('Anchors the seasonal rotation with sturdy, dependable early growth.');
  } else if (seasonIndex === 1) {
    candidates.push('Maintains rotation diversity while safeguarding your mid-cycle yield.');
    candidates.push('Balances soil fertility and pest suppression during the pivotal second phase.');
  } else {
    candidates.push('Completes the three-season cycle with balanced soil health and dependable output.');
    candidates.push('Concludes the rotation cycle while leaving the plot in prime condition.');
  }

  // Select the first unused candidate closing phrase
  const chosenClosing = candidates.find(phrase => !usedClosingPhrases.has(phrase)) || candidates[0];
  usedClosingPhrases.add(chosenClosing);

  return `${sentence1} ${chosenClosing}`;
}

export function buildRotation(inputs: RotationInputs, climate: ClimateSeries): RotationResult {
  const climateSummary = summarizeClimate(climate);
  const usedIds = new Set<string>();
  const usedFamilies = new Set<CropFamily>();
  const usedClosingPhrases = new Set<string>();
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
    const reason = reasonForCrop(best, inputs, climateSummary, prevFamily, s, usedClosingPhrases);

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
