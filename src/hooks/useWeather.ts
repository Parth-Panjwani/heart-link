import { useEffect, useState } from "react";
import { fetchWeather } from "@/lib/weatherApi";

interface WeatherData {
  temp: number;
  condition: string;
  description: string;
  icon: string;
}

export const useWeather = (city: string, countryCode: string, apiKey: string | null) => {
  const [weather, setWeather] = useState<WeatherData>({
    temp: 22,
    condition: "clear",
    description: "Clear sky",
    icon: "01d",
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!apiKey) return;

    const getWeather = async () => {
      setLoading(true);
      const data = await fetchWeather(city, countryCode, apiKey);
      setWeather(data);
      setLoading(false);
    };

    getWeather();
    // Refresh weather every 30 minutes
    const interval = setInterval(getWeather, 30 * 60 * 1000);

    return () => clearInterval(interval);
  }, [city, countryCode, apiKey]);

  return { weather, loading };
};
