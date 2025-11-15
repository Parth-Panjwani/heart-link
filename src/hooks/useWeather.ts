import { useEffect, useState } from "react";
import { fetchWeather } from "@/lib/weatherApi";

interface WeatherData {
  temp: number;
  condition: string;
  description: string;
  icon: string;
}

export const useWeather = (
  city: string,
  countryCode: string,
  apiKey?: string | null,
  timezone?: string,
  coordinates?: { lat: number; lng: number }
) => {
  const [weather, setWeather] = useState<WeatherData>({
    temp: 22,
    condition: "clear",
    description: "Clear sky",
    icon: "01d",
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getWeather = async () => {
      setLoading(true);
      try {
        const data = await fetchWeather(
          city,
          countryCode,
          apiKey,
          timezone,
          coordinates
        );
        setWeather(data);
      } catch (error) {
        console.error("Failed to fetch weather:", error);
      } finally {
        setLoading(false);
      }
    };

    getWeather();
    // Refresh weather every 10 minutes for live updates
    const interval = setInterval(getWeather, 10 * 60 * 1000);

    return () => clearInterval(interval);
  }, [city, countryCode, apiKey, timezone, coordinates]);

  return { weather, loading };
};
