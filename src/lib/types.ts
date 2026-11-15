import type { Priority, WaterAccess } from '@/lib/rotation';
import type { SoilType } from '@/data/crops';

export interface FarmerAnswers {
  regionId: string | null;
  soil: SoilType | null;
  water: WaterAccess | null;
  lastCrop: string | null;
  priority: Priority | null;
}

export const emptyAnswers: FarmerAnswers = {
  regionId: null,
  soil: null,
  water: null,
  lastCrop: null,
  priority: null,
};

export const priorityLabels: Record<Priority, string> = {
  income: 'More income',
  soil: 'Healthier soil',
  water: 'Save water',
  risk: 'Lower risk',
};

export const priorityDescriptions: Record<Priority, string> = {
  income: 'Maximise what you earn each season',
  soil: 'Keep your land productive for years',
  water: 'Choose crops that need less water',
  risk: 'Play it safe with steady, reliable crops',
};

export const soilLabels: Record<SoilType, string> = {
  sandy: 'Sandy',
  loam: 'Loam',
  clay: 'Clay',
};

export const soilHints: Record<SoilType, string> = {
  sandy: 'Drains fast, warms quickly, needs careful watering',
  loam: 'Balanced mix of sand, silt and clay — the sweet spot',
  clay: 'Holds water well, rich in nutrients, slow to drain',
};

export const waterLabels: Record<WaterAccess, string> = {
  rain: 'Rain only',
  irrigated: 'Irrigated',
};

export const waterHints: Record<WaterAccess, string> = {
  rain: 'You depend on rainfall alone',
  irrigated: 'You can water your field when needed',
};


