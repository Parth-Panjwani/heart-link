import { MapPin } from "lucide-react";

const DistanceMap = () => {
  const distance = 4842; // km between Gujarat and Krasnoyarsk

  return (
    <div className="glass-card rounded-2xl p-6 shadow-soft">
      <div className="relative w-full h-48 bg-gradient-to-br from-secondary/20 to-primary/20 rounded-xl overflow-hidden">
        {/* Simplified world map illustration */}
        <svg
          className="absolute inset-0 w-full h-full opacity-10"
          viewBox="0 0 800 400"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M100 200 Q400 100 700 200"
            stroke="currentColor"
            strokeWidth="1"
            strokeDasharray="4 4"
          />
        </svg>

        {/* Location markers */}
        <div className="absolute left-[20%] top-[60%] animate-gentle-pulse">
          <div className="relative">
            <div className="absolute inset-0 bg-primary rounded-full blur-md opacity-50"></div>
            <MapPin className="w-6 h-6 text-primary relative z-10" fill="currentColor" />
          </div>
          <p className="text-xs font-medium mt-2 text-foreground">Gujarat</p>
        </div>

        <div className="absolute right-[20%] top-[40%] animate-gentle-pulse">
          <div className="relative">
            <div className="absolute inset-0 bg-accent rounded-full blur-md opacity-50"></div>
            <MapPin className="w-6 h-6 text-accent relative z-10" fill="currentColor" />
          </div>
          <p className="text-xs font-medium mt-2 text-foreground">Krasnoyarsk</p>
        </div>

        {/* Connecting line */}
        <svg
          className="absolute inset-0 w-full h-full"
          viewBox="0 0 800 400"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M160 240 Q400 150 640 160"
            stroke="url(#gradient)"
            strokeWidth="2"
            strokeDasharray="8 4"
            className="animate-breathe"
          />
          <defs>
            <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="hsl(var(--primary))" />
              <stop offset="100%" stopColor="hsl(var(--accent))" />
            </linearGradient>
          </defs>
        </svg>
      </div>

      <div className="mt-6 text-center">
        <p className="text-2xl font-bold text-foreground mb-1">{distance.toLocaleString()} km</p>
        <p className="text-sm text-muted-foreground italic">
          Far in distance, close at heart.
        </p>
      </div>
    </div>
  );
};

export default DistanceMap;
