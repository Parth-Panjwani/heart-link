import TimeWeatherCard from "@/components/TimeWeatherCard";
import DistanceMap from "@/components/DistanceMap";
import DaysApartTracker from "@/components/DaysApartTracker";
import EmotionalQuote from "@/components/EmotionalQuote";
import TimeConverter from "@/components/TimeConverter";
import { Heart, Calendar, MapPin, Clock } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import CountdownCard from "@/components/CountdownCard";
import { useEffect, useState } from "react";
import { eventsStorage } from "@/lib/localStorage";
import { eventsApi, Event } from "@/lib/api";
import { useAuth } from "@/contexts/AuthContext";
import { getCountryByName, COUNTRIES } from "@/lib/countries";

// Distance calculation function (same as DistanceMap)
const calculateDistance = (
  lat1: number,
  lng1: number,
  lat2: number,
  lng2: number
) => {
  const R = 6371; // Earth's radius in km
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLng = ((lng2 - lng1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLng / 2) *
      Math.sin(dLng / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return Math.round(R * c);
};

interface Countdown {
  id: string;
  emoji: string;
  title: string;
  targetDate: Date;
  sentiment?: string;
}

const Index = () => {
  const { user } = useAuth();
  const [countdowns, setCountdowns] = useState<Countdown[]>([]);

  // Get user's selected countries or defaults
  const country1 = user?.country1
    ? getCountryByName(user.country1)
    : COUNTRIES[0];
  const country2 = user?.country2
    ? getCountryByName(user.country2)
    : COUNTRIES[1];
  const coords1 = user?.coordinates1 ||
    country1?.coordinates || { lat: 23.0225, lng: 72.5714 };
  const coords2 = user?.coordinates2 ||
    country2?.coordinates || { lat: 56.0153, lng: 92.8932 };
  const timezone1 = user?.timezone1 || country1?.timezone || "Asia/Kolkata";
  const timezone2 = user?.timezone2 || country2?.timezone || "Asia/Krasnoyarsk";
  const city1 = user?.country1 || "India";
  const city2 = user?.country2 || "Krasnoyarsk";
  const countryCode1 = country1?.code || "IN";
  const countryCode2 = country2?.code || "RU";

  useEffect(() => {
    loadEvents();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const loadEvents = async () => {
    // Try API first, fallback to localStorage
    const apiResult = await eventsApi.getAll(user.id);
    if (apiResult.success && apiResult.data) {
      const events = apiResult.data
        .map((e: Event) => ({
          id: e.id,
          emoji: e.emoji,
          title: e.title,
          targetDate: new Date(e.targetDate),
          sentiment: e.sentiment,
        }))
        .sort((a, b) => a.targetDate.getTime() - b.targetDate.getTime())
        .filter((e) => e.targetDate > new Date())
        .slice(0, 4);
      setCountdowns(events);
    } else {
      const localEvents = eventsStorage.getAll();
      if (localEvents.length > 0) {
        const events = localEvents
          .map((e: Event) => ({
            id: e.id,
            emoji: e.emoji,
            title: e.title,
            targetDate: new Date(e.targetDate),
            sentiment: e.sentiment,
          }))
          .sort((a, b) => a.targetDate.getTime() - b.targetDate.getTime())
          .filter((e) => e.targetDate > new Date())
          .slice(0, 4);
        setCountdowns(events);
      }
    }
  };

  return (
    <div className="min-h-screen pb-20 sm:pb-24 bg-gradient-to-b from-background via-background/98 to-background">
      {/* Sticky Header */}
      <header className="sticky top-0 z-40 bg-background/95 backdrop-blur-sm border-b border-border/50 px-4 pt-6 sm:pt-8 pb-5 sm:pb-7">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col items-center justify-center gap-4 sm:gap-5 mb-3 sm:mb-4">
            <div className="flex flex-col items-center justify-center gap-3 sm:gap-4 w-full">
              <div className="relative flex items-center justify-center">
                <div className="absolute inset-0 bg-primary/20 rounded-full blur-xl animate-breathe"></div>
                <img
                  src="/logo.png"
                  alt="Heart Link Logo"
                  className="w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 relative drop-shadow-lg animate-breathe"
                />
              </div>
              <div className="text-center w-full">
                <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold bg-gradient-to-r from-primary via-accent to-secondary bg-clip-text text-transparent leading-tight">
                  {user?.spaceName || "Heart Link"}
                </h1>
                <p className="text-sm sm:text-base md:text-lg text-muted-foreground font-medium mt-1 sm:mt-2">
                  Your shared space for staying connected ❤️
                </p>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 space-y-5 sm:space-y-6 md:space-y-8">
        {/* Emotional Quote at Top */}
        <EmotionalQuote />

        {/* 2x2 Grid: Time & Weather Cards */}
        <section className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-5 md:gap-6">
          <TimeWeatherCard
            city={city1}
            timezone={timezone1}
            countryCode={countryCode1}
            coordinates={coords1}
          />
          <TimeWeatherCard
            city={city2}
            timezone={timezone2}
            countryCode={countryCode2}
            isRemote
            coordinates={coords2}
          />
        </section>

        {/* 2x2 Grid: Time Converter & Quick Stats */}
        <section className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-5 md:gap-6">
          <TimeConverter
            country1={country1}
            country2={country2}
            timezone1={timezone1}
            timezone2={timezone2}
          />
          <div className="glass-card rounded-2xl p-5 sm:p-6 md:p-7 card-elevated transition-all duration-300 hover:scale-[1.01]">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-4 sm:mb-5 gap-3">
              <div className="flex items-center gap-2 sm:gap-3">
                <div className="p-2 rounded-lg bg-primary/10">
                  <Heart
                    className="w-5 h-5 sm:w-6 sm:h-6 text-primary"
                    fill="currentColor"
                  />
                </div>
                <h3 className="text-lg sm:text-xl md:text-2xl font-bold text-foreground">
                  Space Overview
                </h3>
              </div>
              <Link to="/journey">
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-primary hover:text-primary hover:underline transition-colors text-xs sm:text-sm h-8 sm:h-9 px-3 sm:px-4"
                >
                  <span className="hidden sm:inline">View Journey</span>
                  <span className="sm:hidden">Journey</span>
                  <span className="hidden sm:inline ml-1">→</span>
                </Button>
              </Link>
            </div>
            <div className="space-y-3 sm:space-y-4">
              <div className="flex items-center justify-between p-4 sm:p-5 rounded-xl bg-gradient-to-r from-primary/5 to-primary/10 border-2 border-primary/20 hover:border-primary/60 hover:bg-gradient-to-r hover:from-primary/10 hover:to-primary/15 transition-all">
                <div className="flex items-center gap-2 sm:gap-3">
                  <div className="p-2 rounded-lg bg-primary/20">
                    <Calendar className="w-4 h-4 sm:w-5 sm:h-5 text-primary" />
                  </div>
                  <span className="text-sm sm:text-base text-foreground font-semibold">
                    Days Together
                  </span>
                </div>
                <span className="text-xl sm:text-2xl md:text-3xl font-extrabold text-primary">
                  {Math.floor(
                    (new Date().getTime() - new Date("2025-11-10").getTime()) /
                      (1000 * 60 * 60 * 24)
                  )}
                </span>
              </div>
              <div className="flex items-center justify-between p-4 sm:p-5 rounded-xl bg-gradient-to-r from-accent/5 to-accent/10 border-2 border-accent/20 hover:border-accent/60 hover:bg-gradient-to-r hover:from-accent/10 hover:to-accent/15 transition-all">
                <div className="flex items-center gap-2 sm:gap-3">
                  <div className="p-2 rounded-lg bg-accent/20">
                    <MapPin className="w-4 h-4 sm:w-5 sm:h-5 text-accent" />
                  </div>
                  <span className="text-sm sm:text-base text-foreground font-semibold">
                    Distance Between Locations
                  </span>
                </div>
                <span className="text-xl sm:text-2xl md:text-3xl font-extrabold text-accent">
                  {calculateDistance(
                    coords1.lat,
                    coords1.lng,
                    coords2.lat,
                    coords2.lng
                  ).toLocaleString()}{" "}
                  km
                </span>
              </div>
              <div className="flex items-center justify-between p-4 sm:p-5 rounded-xl bg-gradient-to-r from-secondary/5 to-secondary/10 border-2 border-secondary/20 hover:border-secondary/60 hover:bg-gradient-to-r hover:from-secondary/10 hover:to-secondary/15 transition-all">
                <div className="flex items-center gap-2 sm:gap-3">
                  <div className="p-2 rounded-lg bg-secondary/20">
                    <Clock className="w-4 h-4 sm:w-5 sm:h-5 text-secondary" />
                  </div>
                  <span className="text-sm sm:text-base text-foreground font-semibold">
                    Time Zones Apart
                  </span>
                </div>
                <span className="text-xl sm:text-2xl md:text-3xl font-extrabold text-secondary">
                  1.5 hours
                </span>
              </div>
            </div>
          </div>
        </section>

        {/* Countdowns Preview - 2x2 Grid */}
        {countdowns.length > 0 && (
          <section>
            <div className="flex items-center justify-between mb-4 sm:mb-5">
              <div className="flex items-center gap-2">
                <Calendar className="w-5 h-5 text-primary" />
                <h2 className="text-lg sm:text-xl font-bold text-foreground">
                  Upcoming Moments
                </h2>
              </div>
              <Link to="/moments">
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-primary hover:text-primary hover:underline transition-colors text-xs sm:text-sm h-7 sm:h-8 px-2 sm:px-3"
                >
                  <span className="hidden sm:inline">View All</span>
                  <span className="sm:hidden">All</span>
                  <span className="hidden sm:inline ml-1">→</span>
                </Button>
              </Link>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-4 gap-4 sm:gap-5 md:gap-6">
              {countdowns.slice(0, 4).map((countdown) => (
                <CountdownCard
                  key={countdown.id}
                  emoji={countdown.emoji}
                  title={countdown.title}
                  targetDate={countdown.targetDate}
                  sentiment={countdown.sentiment}
                />
              ))}
            </div>
          </section>
        )}

        {/* Distance Map Section */}
        <section>
          <DistanceMap
            country1={country1}
            country2={country2}
            coordinates1={coords1}
            coordinates2={coords2}
          />
        </section>

        {/* Footer */}
        <footer className="text-center py-8 sm:py-10">
          <div className="flex items-center justify-center gap-2 mb-2">
            <Heart
              className="w-4 h-4 text-primary animate-breathe"
              fill="currentColor"
            />
            <p className="text-sm text-muted-foreground italic">
              Made to keep hearts closer.
            </p>
            <Heart
              className="w-4 h-4 text-accent animate-breathe"
              fill="currentColor"
              style={{ animationDelay: "0.5s" }}
            />
          </div>
        </footer>
      </div>
    </div>
  );
};

export default Index;
