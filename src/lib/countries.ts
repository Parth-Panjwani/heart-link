// Country data with coordinates and timezones
export interface Country {
  name: string;
  code: string;
  timezone: string;
  coordinates: { lat: number; lng: number };
  flag: string;
}

export const COUNTRIES: Country[] = [
  { name: "India", code: "IN", timezone: "Asia/Kolkata", coordinates: { lat: 23.0225, lng: 72.5714 }, flag: "🇮🇳" },
  { name: "Russia (Krasnoyarsk)", code: "RU", timezone: "Asia/Krasnoyarsk", coordinates: { lat: 56.0153, lng: 92.8932 }, flag: "🇷🇺" },
  { name: "United States (New York)", code: "US", timezone: "America/New_York", coordinates: { lat: 40.7128, lng: -74.0060 }, flag: "🇺🇸" },
  { name: "United States (Los Angeles)", code: "US", timezone: "America/Los_Angeles", coordinates: { lat: 34.0522, lng: -118.2437 }, flag: "🇺🇸" },
  { name: "United Kingdom", code: "GB", timezone: "Europe/London", coordinates: { lat: 51.5074, lng: -0.1278 }, flag: "🇬🇧" },
  { name: "Canada (Toronto)", code: "CA", timezone: "America/Toronto", coordinates: { lat: 43.6532, lng: -79.3832 }, flag: "🇨🇦" },
  { name: "Canada (Vancouver)", code: "CA", timezone: "America/Vancouver", coordinates: { lat: 49.2827, lng: -123.1207 }, flag: "🇨🇦" },
  { name: "Australia (Sydney)", code: "AU", timezone: "Australia/Sydney", coordinates: { lat: -33.8688, lng: 151.2093 }, flag: "🇦🇺" },
  { name: "Australia (Melbourne)", code: "AU", timezone: "Australia/Melbourne", coordinates: { lat: -37.8136, lng: 144.9631 }, flag: "🇦🇺" },
  { name: "Germany", code: "DE", timezone: "Europe/Berlin", coordinates: { lat: 52.5200, lng: 13.4050 }, flag: "🇩🇪" },
  { name: "France", code: "FR", timezone: "Europe/Paris", coordinates: { lat: 48.8566, lng: 2.3522 }, flag: "🇫🇷" },
  { name: "Japan", code: "JP", timezone: "Asia/Tokyo", coordinates: { lat: 35.6762, lng: 139.6503 }, flag: "🇯🇵" },
  { name: "China (Beijing)", code: "CN", timezone: "Asia/Shanghai", coordinates: { lat: 39.9042, lng: 116.4074 }, flag: "🇨🇳" },
  { name: "Singapore", code: "SG", timezone: "Asia/Singapore", coordinates: { lat: 1.3521, lng: 103.8198 }, flag: "🇸🇬" },
  { name: "United Arab Emirates", code: "AE", timezone: "Asia/Dubai", coordinates: { lat: 25.2048, lng: 55.2708 }, flag: "🇦🇪" },
  { name: "Brazil (São Paulo)", code: "BR", timezone: "America/Sao_Paulo", coordinates: { lat: -23.5505, lng: -46.6333 }, flag: "🇧🇷" },
  { name: "Mexico", code: "MX", timezone: "America/Mexico_City", coordinates: { lat: 19.4326, lng: -99.1332 }, flag: "🇲🇽" },
  { name: "South Africa", code: "ZA", timezone: "Africa/Johannesburg", coordinates: { lat: -26.2041, lng: 28.0473 }, flag: "🇿🇦" },
  { name: "South Korea", code: "KR", timezone: "Asia/Seoul", coordinates: { lat: 37.5665, lng: 126.9780 }, flag: "🇰🇷" },
  { name: "Thailand", code: "TH", timezone: "Asia/Bangkok", coordinates: { lat: 13.7563, lng: 100.5018 }, flag: "🇹🇭" },
];

export const getCountryByName = (name: string): Country | undefined => {
  return COUNTRIES.find(c => c.name === name);
};

export const getCountryByCode = (code: string): Country | undefined => {
  return COUNTRIES.find(c => c.code === code);
};

