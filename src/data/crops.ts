export type CropFamily = 'cereal' | 'legume' | 'root' | 'vegetable';
export type SoilType = 'sandy' | 'loam' | 'clay';

export interface Crop {
  id: string;
  name: string;
  family: CropFamily;
  droughtTolerance: 1 | 2 | 3;
  income: 1 | 2 | 3;
  soilBenefit: 1 | 2 | 3;
  waterNeed: 1 | 2 | 3;
  iconKey: string;
}

export const crops: Crop[] = [
  { id: 'maize', name: 'Maize', family: 'cereal', droughtTolerance: 2, income: 3, soilBenefit: 1, waterNeed: 3, iconKey: 'maize' },
  { id: 'sorghum', name: 'Sorghum', family: 'cereal', droughtTolerance: 3, income: 2, soilBenefit: 1, waterNeed: 1, iconKey: 'sorghum' },
  { id: 'groundnut', name: 'Groundnut', family: 'legume', droughtTolerance: 3, income: 3, soilBenefit: 3, waterNeed: 1, iconKey: 'groundnut' },
  { id: 'cowpea', name: 'Cowpea', family: 'legume', droughtTolerance: 3, income: 2, soilBenefit: 3, waterNeed: 1, iconKey: 'cowpea' },
  { id: 'soybean', name: 'Soybean', family: 'legume', droughtTolerance: 2, income: 3, soilBenefit: 3, waterNeed: 2, iconKey: 'soybean' },
  { id: 'cassava', name: 'Cassava', family: 'root', droughtTolerance: 3, income: 2, soilBenefit: 1, waterNeed: 1, iconKey: 'cassava' },
  { id: 'tomato', name: 'Tomato', family: 'vegetable', droughtTolerance: 1, income: 3, soilBenefit: 1, waterNeed: 3, iconKey: 'tomato' },
  { id: 'millet', name: 'Pearl Millet', family: 'cereal', droughtTolerance: 3, income: 1, soilBenefit: 1, waterNeed: 1, iconKey: 'millet' },
  { id: 'yam', name: 'Yam', family: 'root', droughtTolerance: 2, income: 3, soilBenefit: 1, waterNeed: 2, iconKey: 'yam' },
  { id: 'pepper', name: 'Pepper', family: 'vegetable', droughtTolerance: 2, income: 3, soilBenefit: 1, waterNeed: 2, iconKey: 'pepper' },
];

export function getCropById(id: string): Crop | undefined {
  return crops.find(c => c.id === id);
}

export const familyLabels: Record<CropFamily, string> = {
  cereal: 'Cereal',
  legume: 'Legume',
  root: 'Root & Tuber',
  vegetable: 'Vegetable',
};

export const familyColors: Record<CropFamily, string> = {
  cereal: '#F4C04E',
  legume: '#45D19A',
  root: '#E5604D',
  vegetable: '#127A55',
};
