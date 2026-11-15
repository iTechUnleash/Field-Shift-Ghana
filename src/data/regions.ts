export type Belt = 'northern' | 'middle' | 'southern';

export interface Region {
  id: string;
  name: string;
  town: string;
  lat: number;
  lon: number;
  avgRainfall: number;
  avgTemp: number;
  belt: Belt;
}

export const regions: Region[] = [
  // Northern belt (5)
  { id: 'upper-west', name: 'Upper West', town: 'Wa', lat: 10.06, lon: -2.51, avgRainfall: 1000, avgTemp: 28.0, belt: 'northern' },
  { id: 'upper-east', name: 'Upper East', town: 'Bolgatanga', lat: 10.79, lon: -0.85, avgRainfall: 950, avgTemp: 28.8, belt: 'northern' },
  { id: 'north-east', name: 'North East', town: 'Nalerigu', lat: 10.52, lon: -0.37, avgRainfall: 1000, avgTemp: 28.5, belt: 'northern' },
  { id: 'northern', name: 'Northern', town: 'Tamale', lat: 9.40, lon: -0.84, avgRainfall: 1050, avgTemp: 28.3, belt: 'northern' },
  { id: 'savannah', name: 'Savannah', town: 'Damongo', lat: 9.08, lon: -1.82, avgRainfall: 1100, avgTemp: 28.0, belt: 'northern' },

  // Middle belt (4)
  { id: 'bono', name: 'Bono', town: 'Sunyani', lat: 7.34, lon: -2.33, avgRainfall: 1250, avgTemp: 26.5, belt: 'middle' },
  { id: 'bono-east', name: 'Bono East', town: 'Techiman', lat: 7.59, lon: -1.94, avgRainfall: 1250, avgTemp: 26.8, belt: 'middle' },
  { id: 'ahafo', name: 'Ahafo', town: 'Goaso', lat: 6.80, lon: -2.52, avgRainfall: 1350, avgTemp: 26.3, belt: 'middle' },
  { id: 'oti', name: 'Oti', town: 'Dambai', lat: 8.07, lon: 0.18, avgRainfall: 1200, avgTemp: 27.5, belt: 'middle' },

  // Southern belt (7)
  { id: 'ashanti', name: 'Ashanti', town: 'Kumasi', lat: 6.69, lon: -1.62, avgRainfall: 1400, avgTemp: 26.2, belt: 'southern' },
  { id: 'eastern', name: 'Eastern', town: 'Koforidua', lat: 6.09, lon: -0.26, avgRainfall: 1450, avgTemp: 26.0, belt: 'southern' },
  { id: 'western', name: 'Western', town: 'Sekondi-Takoradi', lat: 4.93, lon: -1.76, avgRainfall: 1600, avgTemp: 26.5, belt: 'southern' },
  { id: 'western-north', name: 'Western North', town: 'Sefwi Wiawso', lat: 6.20, lon: -2.49, avgRainfall: 1500, avgTemp: 26.1, belt: 'southern' },
  { id: 'central', name: 'Central', town: 'Cape Coast', lat: 5.11, lon: -1.25, avgRainfall: 1100, avgTemp: 26.7, belt: 'southern' },
  { id: 'greater-accra', name: 'Greater Accra', town: 'Accra', lat: 5.60, lon: -0.19, avgRainfall: 800, avgTemp: 27.5, belt: 'southern' },
  { id: 'volta', name: 'Volta', town: 'Ho', lat: 6.60, lon: 0.47, avgRainfall: 1300, avgTemp: 27.0, belt: 'southern' },
];

export const beltGroups: { id: Belt; label: string; regionIds: string[] }[] = [
  {
    id: 'northern',
    label: 'Northern belt',
    regionIds: ['upper-west', 'upper-east', 'north-east', 'northern', 'savannah'],
  },
  {
    id: 'middle',
    label: 'Middle belt',
    regionIds: ['bono', 'bono-east', 'ahafo', 'oti'],
  },
  {
    id: 'southern',
    label: 'Southern belt',
    regionIds: ['ashanti', 'eastern', 'western', 'western-north', 'central', 'greater-accra', 'volta'],
  },
];

export function getRegionById(id: string): Region | undefined {
  return regions.find(r => r.id === id);
}
