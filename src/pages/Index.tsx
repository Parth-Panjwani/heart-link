import TimeWeatherCard from "@/components/TimeWeatherCard";
import DistanceMap from "@/components/DistanceMap";
import DaysApartTracker from "@/components/DaysApartTracker";
import EmotionalQuote from "@/components/EmotionalQuote";
import TimeConverter from "@/components/TimeConverter";
import { Heart } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import CountdownCard from "@/components/CountdownCard";
import { useEffect, useState } from "react";

interface Countdown {
  id: string;
  emoji: string;
  title: string;
  targetDate: Date;
}

const Index = () => {
  const [countdowns, setCountdowns] = useState<Countdown[]>([]);

  useEffect(() => {
    const saved = localStorage.getItem("countdowns");
    if (saved) {
      const parsed = JSON.parse(saved);
      const countdownsData = parsed.map((c: any) => ({
        ...c,
        targetDate: new Date(c.targetDate),
      }));
      // Show only first 3 on home page
      setCountdowns(countdownsData.slice(0, 3));
    }
  }, []);

  return (
    <div className="min-h-screen pb-24">
      {/* Header */}
      <header className="px-4 pt-6 pb-4 text-center">
        <div className="flex items-center justify-center gap-2 mb-2">
          <Heart className="w-6 h-6 text-primary animate-breathe" />
          <h1 className="text-2xl font-bold text-foreground">Connected Hearts</h1>
        </div>
        <p className="text-sm text-muted-foreground">Staying close across the distance</p>
      </header>

      <div className="max-w-2xl mx-auto px-4 space-y-6">
        {/* Emotional Quote at Top */}
        <EmotionalQuote />

        {/* Time & Weather Cards */}
        <section className="space-y-4">
          <TimeWeatherCard city="Ahmedabad" timezone="Asia/Kolkata" countryCode="IN" />
          <TimeWeatherCard
            city="Krasnoyarsk"
            timezone="Asia/Krasnoyarsk"
            countryCode="RU"
            isRemote
          />
        </section>

        {/* Time Converter */}
        <section>
          <TimeConverter />
        </section>

        {/* Distance Map */}
        <section>
          <DistanceMap />
        </section>

        {/* Days Apart Tracker */}
        <section>
          <h2 className="text-lg font-semibold text-foreground mb-4 px-2">Our Journey</h2>
          <DaysApartTracker />
        </section>

        {/* Countdowns Preview */}
        {countdowns.length > 0 && (
          <section>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-foreground">Upcoming Events</h2>
              <Link to="/countdowns">
                <Button variant="ghost" size="sm" className="text-primary">
                  View All →
                </Button>
              </Link>
            </div>
            <div className="space-y-3">
              {countdowns.map((countdown) => (
                <CountdownCard
                  key={countdown.id}
                  emoji={countdown.emoji}
                  title={countdown.title}
                  targetDate={countdown.targetDate}
                />
              ))}
            </div>
          </section>
        )}

        {/* Footer */}
        <footer className="text-center py-8">
          <p className="text-xs text-muted-foreground italic">
            Made to keep hearts closer.
          </p>
        </footer>
      </div>
    </div>
  );
};

export default Index;
