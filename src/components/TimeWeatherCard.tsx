import { Cloud, CloudRain, CloudSnow, Sun, Moon } from "lucide-react";
import { useEffect, useState } from "react";
import { useWeather } from "@/hooks/useWeather";

interface TimeWeatherCardProps {
  city: string;
  timezone: string;
  countryCode: string;
  isRemote?: boolean;
  coordinates?: { lat: number; lng: number };
}

const TimeWeatherCard = ({
  city,
  timezone,
  countryCode,
  isRemote = false,
  coordinates,
}: TimeWeatherCardProps) => {
  const [time, setTime] = useState(new Date());
  const { weather, loading } = useWeather(
    city,
    countryCode,
    undefined,
    timezone,
    coordinates
  );

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
      hour12: true,
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
        <Sun
          className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 text-primary animate-breathe"
          fill="hsl(var(--primary))"
          stroke="hsl(var(--primary))"
          strokeWidth="1"
        />
      ) : (
        <Moon
          className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 text-secondary animate-breathe"
          fill="hsl(var(--secondary))"
          stroke="hsl(var(--secondary))"
          strokeWidth="1"
        />
      );
    }
    if (weather.condition === "rain" || weather.condition === "drizzle") {
      return (
        <CloudRain
          className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 text-secondary"
          fill="hsl(var(--secondary))"
          stroke="hsl(var(--secondary))"
          strokeWidth="1"
        />
      );
    }
    if (weather.condition === "snow") {
      return (
        <CloudSnow
          className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 text-accent"
          fill="hsl(var(--accent))"
          stroke="hsl(var(--accent))"
          strokeWidth="1"
        />
      );
    }
    if (
      weather.condition === "cloudy" ||
      weather.condition === "fog" ||
      weather.condition === "thunderstorm"
    ) {
      return (
        <Cloud
          className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 text-foreground/70"
          fill="hsl(var(--foreground) / 0.7)"
          stroke="hsl(var(--foreground) / 0.7)"
          strokeWidth="1"
        />
      );
    }
    return (
      <Cloud
        className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 text-foreground/70"
        fill="hsl(var(--foreground) / 0.7)"
        stroke="hsl(var(--foreground) / 0.7)"
        strokeWidth="1"
      />
    );
  };

  return (
    <div
      className={`glass-card rounded-2xl p-4 sm:p-6 card-elevated transition-all duration-500 hover:scale-[1.01] ${
        isRemote ? "border-l-4 border-primary" : "border-l-4 border-secondary"
      }`}
    >
      <div className="flex items-start justify-between mb-3 sm:mb-4">
        <div className="flex-1 min-w-0">
          <h3 className="text-base sm:text-lg font-semibold text-foreground mb-1 truncate">
            {city}
          </h3>
          <p className="text-xs text-foreground/70 font-medium">
            {isRemote ? "Remote" : "Local"}
          </p>
        </div>
        <div className="flex items-center gap-1.5 sm:gap-2 bg-background/30 rounded-lg px-2 sm:px-3 py-1 sm:py-1.5 flex-shrink-0 ml-2">
          {loading ? (
            <div className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 border-2 border-foreground/20 border-t-foreground/60 rounded-full animate-spin" />
          ) : (
            <>
              {getWeatherIcon()}
              <span className="text-xs sm:text-sm font-semibold text-foreground">
                {weather.temp}°C
              </span>
            </>
          )}
        </div>
      </div>

      <div className="space-y-1.5 sm:space-y-2">
        <div className="text-2xl sm:text-3xl md:text-4xl font-bold text-foreground tabular-nums tracking-tight bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text">
          {formatTime(time)}
        </div>
        <div className="flex items-center gap-1.5 sm:gap-2 text-xs text-foreground/80 font-medium">
          {isDaytime() ? (
            <>
              <Sun
                className="w-3 h-3 text-primary flex-shrink-0"
                fill="hsl(var(--primary))"
                stroke="hsl(var(--primary))"
                strokeWidth="1.5"
              />
              <span>Daytime</span>
            </>
          ) : (
            <>
              <Moon
                className="w-3 h-3 text-secondary flex-shrink-0"
                fill="hsl(var(--secondary))"
                stroke="hsl(var(--secondary))"
                strokeWidth="1.5"
              />
              <span>Nighttime</span>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default TimeWeatherCard;
