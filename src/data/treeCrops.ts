/**
 * Approximate planning ranges for major Ghanaian tree crops.
 *
 * NOTE: These ranges are general agro-climatic planning references for decision support.
 * Tree crops stay in the ground for 25+ years and actual on-farm success depends on
 * microclimate, soil depth, drainage, pests, and local topography. Always confirm tree
 * planting decisions with local agronomic authorities, including the Ghana Cocoa Board
 * (COCOBOD), the Tree Crop Development Authority (TCDA), and local agricultural extension officers.
 */

export interface TreeCrop {
  id: 'cocoa' | 'oil-palm' | 'cashew' | 'shea';
  name: string;
  description: string;
  yearsToHarvest: string;
  idealRainfallMin: number;
  idealRainfallMax: number;
  workableRainfallMin: number;
  workableRainfallMax: number;
  idealTempMin: number;
  idealTempMax: number;
  workableTempMin: number;
  workableTempMax: number;
}

export const treeCrops: TreeCrop[] = [
  {
    id: 'cocoa',
    name: 'Cocoa',
    description: "Ghana's premier agroforestry export crop, thriving in humid forest belts with consistent moisture.",
    yearsToHarvest: '3 to 5 years',
    idealRainfallMin: 1400,
    idealRainfallMax: 2000,
    workableRainfallMin: 1250,
    workableRainfallMax: 2400,
    idealTempMin: 21,
    idealTempMax: 28,
    workableTempMin: 19,
    workableTempMax: 30,
  },
  {
    id: 'oil-palm',
    name: 'Oil palm',
    description: 'High-yielding perennial oil crop requiring steady abundant rainfall and warm temperatures without prolonged dry spells.',
    yearsToHarvest: '3 to 4 years',
    idealRainfallMin: 1800,
    idealRainfallMax: 2500,
    workableRainfallMin: 1500,
    workableRainfallMax: 3000,
    idealTempMin: 24,
    idealTempMax: 28,
    workableTempMin: 22,
    workableTempMax: 30,
  },
  {
    id: 'cashew',
    name: 'Cashew',
    description: 'Hardy, drought-tolerant export nut tree well suited to the forest-savanna transition and northern belts.',
    yearsToHarvest: '3 years',
    idealRainfallMin: 900,
    idealRainfallMax: 1500,
    workableRainfallMin: 700,
    workableRainfallMax: 2000,
    idealTempMin: 24,
    idealTempMax: 30,
    workableTempMin: 22,
    workableTempMax: 32,
  },
  {
    id: 'shea',
    name: 'Shea',
    description: 'Deep-rooting indigenous savanna tree producing valuable butter nuts, extraordinarily resilient to drought and dry heat.',
    yearsToHarvest: '10 or more years',
    idealRainfallMin: 900,
    idealRainfallMax: 1300,
    workableRainfallMin: 700,
    workableRainfallMax: 1500,
    idealTempMin: 24,
    idealTempMax: 30,
    workableTempMin: 22,
    workableTempMax: 32,
  },
];

