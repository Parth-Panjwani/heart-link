import { MapPin, Navigation, Heart } from "lucide-react";
import { type Country } from "@/lib/countries";

interface DistanceMapProps {
  country1?: Country;
  country2?: Country;
  coordinates1?: { lat: number; lng: number };
  coordinates2?: { lat: number; lng: number };
}

// Default coordinates
const DEFAULT_COORDS1 = { lat: 23.0225, lng: 72.5714 }; // India
const DEFAULT_COORDS2 = { lat: 56.0153, lng: 92.8932 }; // Krasnoyarsk

// Convert lat/lng to SVG coordinates (Mercator projection)
const latLngToXY = (
  lat: number,
  lng: number,
  width: number,
  height: number
) => {
  const x = ((lng + 180) / 360) * width;
  const y = ((90 - lat) / 180) * height;
  return { x, y };
};

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

const DistanceMap = ({
  country1,
  country2,
  coordinates1,
  coordinates2,
}: DistanceMapProps) => {
  const coords1 = coordinates1 || DEFAULT_COORDS1;
  const coords2 = coordinates2 || DEFAULT_COORDS2;
  const country1Name = country1?.name || "India";
  const country2Name = country2?.name || "Krasnoyarsk";
  const country1Flag = country1?.flag || "🇮🇳";
  const country2Flag = country2?.flag || "🇷🇺";

  const distance = calculateDistance(
    coords1.lat,
    coords1.lng,
    coords2.lat,
    coords2.lng
  );

  const mapWidth = 1200;
  const mapHeight = 700;

  // Calculate positions from actual coordinates
  const pos1 = latLngToXY(coords1.lat, coords1.lng, mapWidth, mapHeight);
  const pos2 = latLngToXY(coords2.lat, coords2.lng, mapWidth, mapHeight);

  // Determine which is top-left and which is bottom-right based on actual positions
  const isPos1TopLeft =
    pos1.y < pos2.y || (pos1.y === pos2.y && pos1.x < pos2.x);
  const topLeftPos = isPos1TopLeft ? pos1 : pos2;
  const bottomRightPos = isPos1TopLeft ? pos2 : pos1;

  // Calculate midpoint for curved connection line
  const midX = (topLeftPos.x + bottomRightPos.x) / 2;
  const midY = (topLeftPos.y + bottomRightPos.y) / 2;

  // ViewBox to show the area between the two locations with proper padding
  const paddingX = Math.max(
    100,
    Math.abs(bottomRightPos.x - topLeftPos.x) * 0.2
  );
  const paddingY = Math.max(
    100,
    Math.abs(bottomRightPos.y - topLeftPos.y) * 0.2
  );

  const minX = Math.max(0, Math.min(topLeftPos.x, bottomRightPos.x) - paddingX);
  const minY = Math.max(0, Math.min(topLeftPos.y, bottomRightPos.y) - paddingY);
  const maxX = Math.min(
    mapWidth,
    Math.max(topLeftPos.x, bottomRightPos.x) + paddingX
  );
  const maxY = Math.min(
    mapHeight,
    Math.max(topLeftPos.y, bottomRightPos.y) + paddingY
  );

  const viewBoxX = minX;
  const viewBoxY = minY;
  const viewBoxWidth = maxX - minX;
  const viewBoxHeight = maxY - minY;

  return (
    <div className="glass-card rounded-2xl p-4 sm:p-6 card-elevated transition-all duration-300 overflow-hidden">
      {/* Title inside card */}
      <div className="flex items-center gap-2 mb-4 sm:mb-5">
        <MapPin className="w-5 h-5 text-accent" />
        <h2 className="text-lg sm:text-xl font-bold text-foreground">
          Space Distance
        </h2>
      </div>

      <div className="relative w-full h-80 sm:h-96 md:h-[500px] lg:h-[600px] bg-gradient-to-br from-blue-50/50 via-purple-50/30 to-pink-50/50 dark:from-blue-950/20 dark:via-purple-950/10 dark:to-pink-950/20 rounded-xl overflow-hidden border border-border/30">
        {/* Beautiful world map with better continents - zoomed */}
        <svg
          className="absolute inset-0 w-full h-full"
          viewBox={`${viewBoxX} ${viewBoxY} ${viewBoxWidth} ${viewBoxHeight}`}
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          preserveAspectRatio="xMidYMid meet"
        >
          {/* Ocean/Water background */}
          <rect
            width={mapWidth}
            height={mapHeight}
            fill="hsl(var(--background))"
            opacity="0.3"
          />

          {/* Simplified continent shapes */}
          <g opacity="0.1" fill="hsl(var(--foreground))">
            {/* Asia outline */}
            <path
              d="M 200 50 L 400 60 L 600 80 L 800 120 L 900 200 L 850 350 L 700 450 L 500 480 L 300 450 L 150 350 L 100 200 L 120 100 Z"
              fill="hsl(var(--muted))"
            />
          </g>

          {/* Country 1 outline - circular highlight around marker */}
          <g>
            <circle
              cx={topLeftPos.x}
              cy={topLeftPos.y}
              r="80"
              fill="#3b82f6"
              opacity="0.15"
              stroke="#2563eb"
              strokeWidth="2"
            />
            <circle
              cx={topLeftPos.x}
              cy={topLeftPos.y}
              r="60"
              fill="#3b82f6"
              opacity="0.1"
            />
          </g>

          {/* Country 2 outline - circular highlight around marker */}
          <g>
            <circle
              cx={bottomRightPos.x}
              cy={bottomRightPos.y}
              r="80"
              fill="#f97316"
              opacity="0.2"
              stroke="#ea580c"
              strokeWidth="2"
            />
            <circle
              cx={bottomRightPos.x}
              cy={bottomRightPos.y}
              r="60"
              fill="#f97316"
              opacity="0.15"
            />
          </g>

          {/* Gradient definitions - must be before use */}
          <defs>
            <linearGradient
              id="connectionGradient"
              x1="0%"
              y1="0%"
              x2="100%"
              y2="0%"
            >
              <stop offset="0%" stopColor="#2563eb" stopOpacity="1" />
              <stop offset="50%" stopColor="#7c3aed" stopOpacity="0.8" />
              <stop offset="100%" stopColor="#ea580c" stopOpacity="1" />
            </linearGradient>
            <filter id="glow">
              <feGaussianBlur stdDeviation="4" result="coloredBlur" />
              <feMerge>
                <feMergeNode in="coloredBlur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
            <filter id="markerGlow">
              <feGaussianBlur stdDeviation="6" result="coloredBlur" />
              <feMerge>
                <feMergeNode in="coloredBlur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          {/* Great circle connecting line - diagonal from top-left to bottom-right */}
          <path
            d={`M ${topLeftPos.x} ${topLeftPos.y} Q ${midX} ${midY - 100} ${
              bottomRightPos.x
            } ${bottomRightPos.y}`}
            stroke="url(#connectionGradient)"
            strokeWidth="4"
            fill="none"
            strokeDasharray="10 8"
            opacity="0.85"
          />

          {/* Location markers - positioned at exact coordinates */}
          {/* Country 1 - Blue color */}
          <g transform={`translate(${topLeftPos.x}, ${topLeftPos.y})`}>
            {/* Outer glow circles */}
            <circle r="18" fill="#3b82f6" opacity="0.3" />
            <circle r="14" fill="#3b82f6" opacity="0.5" />
            {/* Main marker circle */}
            <circle r="10" fill="#2563eb" stroke="white" strokeWidth="2" />
            {/* Pin icon centered */}
            <g transform="translate(-8, -12)">
              <path
                d="M8 0C3.58 0 0 3.58 0 8c0 5.52 8 12 8 12s8-6.48 8-12c0-4.42-3.58-8-8-8zm0 10c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2z"
                fill="white"
              />
            </g>
          </g>

          {/* Country 2 - Orange color */}
          <g transform={`translate(${bottomRightPos.x}, ${bottomRightPos.y})`}>
            {/* Outer glow circles */}
            <circle r="18" fill="#f97316" opacity="0.3" />
            <circle r="14" fill="#f97316" opacity="0.5" />
            {/* Main marker circle */}
            <circle r="10" fill="#ea580c" stroke="white" strokeWidth="2" />
            {/* Pin icon centered */}
            <g transform="translate(-8, -12)">
              <path
                d="M8 0C3.58 0 0 3.58 0 8c0 5.52 8 12 8 12s8-6.48 8-12c0-4.42-3.58-8-8-8zm0 10c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2z"
                fill="white"
              />
            </g>
          </g>
        </svg>

        {/* Location labels - positioned relative to markers */}
        {/* Country 1 - Blue */}
        <div
          className="absolute pointer-events-none z-20"
          style={{
            left: `${(topLeftPos.x / mapWidth) * 100}%`,
            top: `${(topLeftPos.y / mapHeight) * 100}%`,
            transform: "translate(-50%, -120%)",
          }}
        >
          <div
            className="text-xs sm:text-sm font-bold px-3 py-1.5 sm:px-4 sm:py-2 rounded-lg shadow-lg backdrop-blur-sm border-2 whitespace-nowrap"
            style={{
              backgroundColor: "#3b82f6",
              color: "white",
              borderColor: "#2563eb",
            }}
          >
            {country1Flag} {country1Name}
          </div>
        </div>

        {/* Country 2 - Orange */}
        <div
          className="absolute pointer-events-none z-20"
          style={{
            left: `${(bottomRightPos.x / mapWidth) * 100}%`,
            top: `${(bottomRightPos.y / mapHeight) * 100}%`,
            transform: "translate(-50%, 120%)",
          }}
        >
          <div
            className="text-xs sm:text-sm font-bold px-3 py-1.5 sm:px-4 sm:py-2 rounded-lg shadow-lg backdrop-blur-sm border-2 whitespace-nowrap"
            style={{
              backgroundColor: "#f97316",
              color: "white",
              borderColor: "#ea580c",
            }}
          >
            {country2Flag} {country2Name}
          </div>
        </div>
      </div>

      {/* Distance info - better layout */}
      <div className="mt-5 sm:mt-6 space-y-3">
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4">
          <div className="flex items-center gap-2 sm:gap-3">
            <div className="p-2 rounded-full bg-primary/10">
              <Navigation className="w-5 h-5 sm:w-6 sm:h-6 text-primary" />
            </div>
            <div className="text-center sm:text-left">
              <p className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-foreground">
                {distance.toLocaleString()} km
              </p>
              <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">
                Great circle distance
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-center gap-2">
          <Heart
            className="w-4 h-4 text-primary animate-breathe"
            fill="currentColor"
          />
          <p className="text-sm sm:text-base text-muted-foreground italic font-medium">
            Far in distance, close at heart ❤️
          </p>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3 text-xs sm:text-sm text-muted-foreground pt-2 border-t border-border/50">
          <div className="flex items-center gap-2">
            <div
              className="w-2.5 h-2.5 rounded-full shadow-sm"
              style={{ backgroundColor: "#f97316" }}
            ></div>
            <span className="font-mono">
              {coords1.lat.toFixed(2)}°{coords1.lat >= 0 ? "N" : "S"},{" "}
              {coords1.lng.toFixed(2)}°{coords1.lng >= 0 ? "E" : "W"}
            </span>
          </div>
          <div className="text-muted-foreground/50">→</div>
          <div className="flex items-center gap-2">
            <div
              className="w-2.5 h-2.5 rounded-full shadow-sm"
              style={{ backgroundColor: "#2563eb" }}
            ></div>
            <span className="font-mono">
              {coords2.lat.toFixed(2)}°{coords2.lat >= 0 ? "N" : "S"},{" "}
              {coords2.lng.toFixed(2)}°{coords2.lng >= 0 ? "E" : "W"}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DistanceMap;
