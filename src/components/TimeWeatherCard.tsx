import { Cloud, CloudRain, CloudSnow, Sun, Moon } from "lucide-react";
import { useEffect, useState } from "react";
import { useWeather } from "@/hooks/useWeather";

interface TimeWeatherCardProps {
  city: string;
  timezone: string;
  countryCode: string;
  isRemote?: boolean;
}

const TimeWeatherCard = ({ city, timezone, countryCode, isRemote = false }: TimeWeatherCardProps) => {
  const [time, setTime] = useState(new Date());
  const apiKey = localStorage.getItem("weatherApiKey");
  const { weather } = useWeather(city, countryCode, apiKey);

  useEffect(() => {
    const timer = setInterval(() => {
      setTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString("en-US", {
      timeZone: timezone,
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: false,
    });
  };

  const getHour = () => {
    const hour = parseInt(
      time.toLocaleTimeString("en-US", {
        timeZone: timezone,
        hour: "2-digit",
        hour12: false,
      })
    );
    return hour;
  };

  const isDaytime = () => {
    const hour = getHour();
    return hour >= 6 && hour < 18;
  };

  const getWeatherIcon = () => {
    const isDay = isDaytime();
    if (weather.condition === "clear") {
      return isDay ? (
        <Sun className="w-8 h-8 text-primary animate-breathe" />
      ) : (
        <Moon className="w-8 h-8 text-secondary animate-breathe" />
      );
    }
    if (weather.condition === "rain") {
      return <CloudRain className="w-8 h-8 text-secondary" />;
    }
    if (weather.condition === "snow") {
      return <CloudSnow className="w-8 h-8 text-accent" />;
    }
    return <Cloud className="w-8 h-8 text-muted-foreground" />;
  };

  return (
    <div
      className={`glass-card rounded-2xl p-6 shadow-soft hover:shadow-glow transition-all duration-500 ${
        isRemote ? "border-l-4 border-primary" : "border-l-4 border-secondary"
      }`}
    >
      <div className="flex items-start justify-between mb-4">
        <div>
          <h3 className="text-lg font-medium text-foreground mb-1">{city}</h3>
          <p className="text-xs text-muted-foreground">{isRemote ? "Remote" : "Local"}</p>
        </div>
        <div className="flex items-center gap-2">
          {getWeatherIcon()}
          <span className="text-sm font-medium text-foreground">{weather.temp}°C</span>
        </div>
      </div>

      <div className="space-y-2">
        <div className="text-4xl font-bold text-foreground tabular-nums tracking-tight">
          {formatTime(time)}
        </div>
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          {isDaytime() ? (
            <>
              <Sun className="w-3 h-3" />
              <span>Daytime</span>
            </>
          ) : (
            <>
              <Moon className="w-3 h-3" />
              <span>Nighttime</span>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default TimeWeatherCard;
