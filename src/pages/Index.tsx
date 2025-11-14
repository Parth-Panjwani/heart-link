import TimeWeatherCard from "@/components/TimeWeatherCard";
import DistanceMap from "@/components/DistanceMap";
import DaysApartTracker from "@/components/DaysApartTracker";
import CountdownCard from "@/components/CountdownCard";
import TimeConverter from "@/components/TimeConverter";
import { Heart, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";

const Index = () => {
  // Sample countdown events
  const countdowns = [
    { emoji: "✈️", title: "Next Visit Home", targetDate: new Date("2025-06-15") },
    { emoji: "🎓", title: "Graduation Day", targetDate: new Date("2025-12-20") },
    { emoji: "🎂", title: "Mom's Birthday", targetDate: new Date("2025-03-10") },
  ];

  return (
    <div className="min-h-screen pb-20">
      {/* Header */}
      <header className="px-4 py-6 text-center">
        <div className="flex items-center justify-center gap-2 mb-2">
          <Heart className="w-6 h-6 text-primary animate-breathe" />
          <h1 className="text-2xl font-bold text-foreground">Connected Hearts</h1>
        </div>
        <p className="text-sm text-muted-foreground">Staying close across the distance</p>
      </header>

      <div className="max-w-2xl mx-auto px-4 space-y-8">
        {/* Time & Weather Cards */}
        <section className="space-y-4">
          <TimeWeatherCard city="Gujarat, India" timezone="Asia/Kolkata" />
          <TimeWeatherCard city="Krasnoyarsk, Russia" timezone="Asia/Krasnoyarsk" isRemote />
          <p className="text-center text-sm text-muted-foreground italic px-4">
            Even far apart, our moments stay connected.
          </p>
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

        {/* Countdowns */}
        <section>
          <div className="flex items-center justify-between mb-4 px-2">
            <h2 className="text-lg font-semibold text-foreground">Upcoming Events</h2>
            <Button
              size="sm"
              className="rounded-full h-8 w-8 p-0 shadow-soft hover:shadow-glow"
            >
              <Plus className="w-4 h-4" />
            </Button>
          </div>
          <div className="grid gap-4">
            {countdowns.map((countdown, idx) => (
              <CountdownCard
                key={idx}
                emoji={countdown.emoji}
                title={countdown.title}
                targetDate={countdown.targetDate}
              />
            ))}
          </div>
        </section>

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
