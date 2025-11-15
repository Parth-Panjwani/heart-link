interface WeatherData {
  temp: number;
  condition: string;
  description: string;
  icon: string;
}

// City coordinates mapping - will be expanded or use country data
const CITY_COORDINATES: Record<string, { lat: number; lon: number }> = {
  "India": { lat: 23.0225, lon: 72.5714 },
  "Russia (Krasnoyarsk)": { lat: 56.0153, lon: 92.8932 },
  "United States (New York)": { lat: 40.7128, lon: -74.0060 },
  "United States (Los Angeles)": { lat: 34.0522, lon: -118.2437 },
  "United Kingdom": { lat: 51.5074, lon: -0.1278 },
  "Canada (Toronto)": { lat: 43.6532, lon: -79.3832 },
  "Canada (Vancouver)": { lat: 49.2827, lon: -123.1207 },
  "Australia (Sydney)": { lat: -33.8688, lon: 151.2093 },
  "Australia (Melbourne)": { lat: -37.8136, lon: 144.9631 },
  "Germany": { lat: 52.5200, lon: 13.4050 },
  "France": { lat: 48.8566, lon: 2.3522 },
  "Japan": { lat: 35.6762, lon: 139.6503 },
  "China (Beijing)": { lat: 39.9042, lon: 116.4074 },
  "Singapore": { lat: 1.3521, lon: 103.8198 },
  "United Arab Emirates": { lat: 25.2048, lon: 55.2708 },
  "Brazil (São Paulo)": { lat: -23.5505, lon: -46.6333 },
  "Mexico": { lat: 19.4326, lon: -99.1332 },
  "South Africa": { lat: -26.2041, lon: 28.0473 },
  "South Korea": { lat: 37.5665, lon: 126.9780 },
  "Thailand": { lat: 13.7563, lon: 100.5018 },
};

// Map Open-Meteo weather codes (WMO) to our condition types
// WMO Weather codes: https://open-meteo.com/en/docs
const getWeatherCondition = (weatherCode: number, isDay: boolean): string => {
  // 0 = Clear sky
  if (weatherCode === 0) return "clear";
  // 1 = Mainly clear, 2 = partly cloudy, 3 = overcast
  if (weatherCode >= 1 && weatherCode <= 3) return "cloudy";
  // 45 = Fog, 48 = Depositing rime fog
  if (weatherCode >= 45 && weatherCode <= 49) return "fog";
  // 51-59 = Drizzle
  if (weatherCode >= 51 && weatherCode <= 59) return "drizzle";
  // 61-67 = Rain, 80-82 = Rain showers
  if ((weatherCode >= 61 && weatherCode <= 67) || (weatherCode >= 80 && weatherCode <= 82)) return "rain";
  // 71-77 = Snow, 85-86 = Snow showers
  if ((weatherCode >= 71 && weatherCode <= 77) || (weatherCode >= 85 && weatherCode <= 86)) return "snow";
  // 95-99 = Thunderstorm
  if (weatherCode >= 95 && weatherCode <= 99) return "thunderstorm";
  // Default to clear
  return "clear";
};

export const fetchWeather = async (
  city: string,
  countryCode: string,
  apiKey?: string | null,
  timezone?: string,
  coordinates?: { lat: number; lng: number }
): Promise<WeatherData> => {
  try {
    // Use provided coordinates if available, otherwise lookup
    let coords = coordinates;
    if (!coords) {
      const lookup = CITY_COORDINATES[city];
      if (lookup) {
        coords = { lat: lookup.lat, lng: lookup.lon };
      }
    }

    if (!coords) {
      // Fallback: try to extract from city name or use default
      console.warn(`Coordinates not found for city: ${city}, using fallback`);
      throw new Error(`Coordinates not found for city: ${city}`);
    }

    // Use Open-Meteo API (free, no API key required)
    const timezoneParam = timezone || "auto";
    const response = await fetch(
      `https://api.open-meteo.com/v1/forecast?latitude=${coords.lat}&longitude=${coords.lng}&current=temperature_2m,weather_code,is_day&timezone=${timezoneParam}`
    );

    if (!response.ok) {
      throw new Error("Weather data not available");
    }

    const data = await response.json();

    if (!data.current) {
      throw new Error("Invalid weather data");
    }

    const temp = Math.round(data.current.temperature_2m);
    const weatherCode = data.current.weather_code;
    const isDay = data.current.is_day === 1; // 1 = day, 0 = night
    const condition = getWeatherCondition(weatherCode, isDay);

    // Map condition to description
    const descriptions: Record<string, string> = {
      clear: "Clear sky",
      cloudy: "Cloudy",
      fog: "Foggy",
      drizzle: "Drizzle",
      rain: "Rainy",
      snow: "Snowy",
      thunderstorm: "Thunderstorm",
    };

    return {
      temp,
      condition,
      description: descriptions[condition] || "Clear sky",
      icon: isDay ? "01d" : "01n",
    };
  } catch (error) {
    console.error("Weather fetch error:", error);
    // Return fallback data
    return {
      temp: 22,
      condition: "clear",
      description: "Clear sky",
      icon: "01d",
    };
  }
};
