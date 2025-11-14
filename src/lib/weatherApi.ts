interface WeatherData {
  temp: number;
  condition: string;
  description: string;
  icon: string;
}

export const fetchWeather = async (
  city: string,
  countryCode: string,
  apiKey: string
): Promise<WeatherData> => {
  try {
    const response = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?q=${city},${countryCode}&appid=${apiKey}&units=metric`
    );

    if (!response.ok) {
      throw new Error("Weather data not available");
    }

    const data = await response.json();

    return {
      temp: Math.round(data.main.temp),
      condition: data.weather[0].main.toLowerCase(),
      description: data.weather[0].description,
      icon: data.weather[0].icon,
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
