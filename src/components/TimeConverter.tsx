import { ArrowRight } from "lucide-react";
import { useState } from "react";

const TimeConverter = () => {
  const [localTime, setLocalTime] = useState("12:00");

  const convertTime = (time: string) => {
    // Gujarat is UTC+5:30, Krasnoyarsk is UTC+7
    // Difference is +1:30 hours
    const [hours, minutes] = time.split(":").map(Number);
    let newHours = hours + 1;
    let newMinutes = minutes + 30;

    if (newMinutes >= 60) {
      newMinutes -= 60;
      newHours += 1;
    }

    if (newHours >= 24) {
      newHours -= 24;
    }

    return `${String(newHours).padStart(2, "0")}:${String(newMinutes).padStart(2, "0")}`;
  };

  const remoteTime = convertTime(localTime);

  return (
    <div className="glass-card rounded-2xl p-6 shadow-soft">
      <h3 className="text-lg font-medium text-foreground mb-4">Time Converter</h3>

      <div className="flex items-center gap-4">
        <div className="flex-1">
          <label className="text-xs text-muted-foreground mb-2 block">Gujarat Time</label>
          <input
            type="time"
            value={localTime}
            onChange={(e) => setLocalTime(e.target.value)}
            className="w-full px-4 py-3 bg-background/50 border border-border rounded-xl text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>

        <ArrowRight className="w-5 h-5 text-primary mt-6 flex-shrink-0" />

        <div className="flex-1">
          <label className="text-xs text-muted-foreground mb-2 block">Krasnoyarsk Time</label>
          <div className="w-full px-4 py-3 bg-background/50 border border-border rounded-xl text-foreground font-medium">
            {remoteTime}
          </div>
        </div>
      </div>

      <p className="text-xs text-muted-foreground text-center mt-4 italic">
        This is when they'll be awake.
      </p>
    </div>
  );
};

export default TimeConverter;
