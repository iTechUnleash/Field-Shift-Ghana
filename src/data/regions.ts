export interface Region {
  id: string;
  name: string;
  town: string;
  lat: number;
  lon: number;
  avgRainfall: number;
  avgTemp: number;
}

export const regions: Region[] = [
  { id: 'northern', name: 'Northern', town: 'Tamale', lat: 9.4035, lon: -0.8423, avgRainfall: 1100, avgTemp: 28.5 },
  { id: 'ashanti', name: 'Ashanti', town: 'Kumasi', lat: 6.6666, lon: -1.6163, avgRainfall: 1400, avgTemp: 26.5 },
  { id: 'bono-east', name: 'Bono East', town: 'Techiman', lat: 7.5667, lon: -1.9333, avgRainfall: 1250, avgTemp: 27.2 },
  { id: 'volta', name: 'Volta', town: 'Ho', lat: 6.6000, lon: 0.4667, avgRainfall: 1300, avgTemp: 27.0 },
];

export function getRegionById(id: string): Region | undefined {
  return regions.find(r => r.id === id);
}
