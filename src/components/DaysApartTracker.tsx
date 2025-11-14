import { Calendar, Heart, MapPin } from "lucide-react";
import { useState } from "react";

const DaysApartTracker = () => {
  const [heartMessage, setHeartMessage] = useState("Missing you every day ❤️");
  const departureDate = new Date("2024-01-15");
  const today = new Date();
  const daysApart = Math.floor(
    (today.getTime() - departureDate.getTime()) / (1000 * 60 * 60 * 24)
  );

  return (
    <div className="space-y-4">
      <div className="glass-card rounded-2xl p-5 shadow-soft gradient-warm">
        <div className="flex items-center gap-3 mb-3">
          <Calendar className="w-5 h-5 text-primary-foreground" />
          <h3 className="text-sm font-medium text-primary-foreground">Days Since Apart</h3>
        </div>
        <p className="text-4xl font-bold text-primary-foreground">{daysApart}</p>
        <p className="text-xs text-primary-foreground/80 mt-1">days and counting</p>
      </div>

      <div className="glass-card rounded-2xl p-5 shadow-soft gradient-calm">
        <div className="flex items-center gap-3 mb-3">
          <MapPin className="w-5 h-5 text-secondary-foreground" />
          <h3 className="text-sm font-medium text-secondary-foreground">Distance From Home</h3>
        </div>
        <p className="text-2xl font-bold text-secondary-foreground">4,842 km</p>
        <p className="text-xs text-secondary-foreground/80 mt-1">but always in our hearts</p>
      </div>

      <div className="glass-card rounded-2xl p-5 shadow-soft">
        <div className="flex items-center gap-3 mb-3">
          <Heart className="w-5 h-5 text-accent" />
          <h3 className="text-sm font-medium text-foreground">Heart Message</h3>
        </div>
        <input
          type="text"
          value={heartMessage}
          onChange={(e) => setHeartMessage(e.target.value)}
          className="w-full bg-transparent border-none outline-none text-sm text-foreground placeholder:text-muted-foreground"
          placeholder="Write something heartfelt..."
        />
      </div>
    </div>
  );
};

export default DaysApartTracker;
