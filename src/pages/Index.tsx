import TimeWeatherCard from "@/components/TimeWeatherCard";
import DistanceMap from "@/components/DistanceMap";
import DaysApartTracker from "@/components/DaysApartTracker";
import EmotionalQuote from "@/components/EmotionalQuote";
import TimeConverter from "@/components/TimeConverter";
import {
  Heart,
  Calendar,
  MapPin,
  Clock,
  Users,
  Sparkles,
  X,
  Lock,
} from "lucide-react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import CountdownCard from "@/components/CountdownCard";
import { useEffect, useState } from "react";
import { eventsStorage } from "@/lib/localStorage";
import { eventsApi, Event } from "@/lib/api";
import { useAuth } from "@/contexts/AuthContext";
import { getCountryByName, COUNTRIES } from "@/lib/countries";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { CountrySelector } from "@/components/CountrySelector";
import { usersApi } from "@/lib/api";
import { Globe } from "lucide-react";

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
  const { user, createSpace, joinSpaceForUser, updateUser } = useAuth();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const [countdowns, setCountdowns] = useState<Countdown[]>([]);
  const [showSpaceModal, setShowSpaceModal] = useState(false);
  const [spaceAction, setSpaceAction] = useState<"create" | "join">("create");
  const [spaceName, setSpaceName] = useState("");
  const [spaceCode, setSpaceCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [bannerDismissed, setBannerDismissed] = useState(false);
  const [isUpdatingCountry2, setIsUpdatingCountry2] = useState(false);

  // Get user's selected countries or defaults
  const country1 = user?.country1
    ? getCountryByName(user.country1)
    : COUNTRIES[0];
  const country2 = user?.country2 ? getCountryByName(user.country2) : null;
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

  const handleCountry2Change = async (countryName: string) => {
    if (!user) return;

    const country = getCountryByName(countryName);
    if (!country) {
      toast.error("Country not found");
      return;
    }

    setIsUpdatingCountry2(true);
    try {
      const updateData = {
        country2: country.name,
        timezone2: country.timezone,
        coordinates2: country.coordinates,
      };

      const result = await usersApi.updateCountries(user.id, updateData);
      if (result.success && result.data) {
        updateUser(result.data.user);
        toast.success(`Second location set to ${country.name}`);
      } else {
        toast.error(result.error || "Failed to update country");
      }
    } catch (error) {
      toast.error("Failed to update country");
    } finally {
      setIsUpdatingCountry2(false);
    }
  };

  useEffect(() => {
    loadEvents();
    // Check if spaceCode is in URL and open join modal
    const urlSpaceCode = searchParams.get("spaceCode");
    if (urlSpaceCode && user && !user.spaceCode && !user.spaceId) {
      setSpaceCode(urlSpaceCode.toUpperCase());
      setSpaceAction("join");
      setShowSpaceModal(true);
      // Remove spaceCode from URL
      searchParams.delete("spaceCode");
      setSearchParams(searchParams, { replace: true });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  const handleCreateSpace = async () => {
    if (!user) return;

    setLoading(true);
    const success = await createSpace(user.id, spaceName.trim() || undefined);
    setLoading(false);

    if (success) {
      setShowSpaceModal(false);
      setSpaceName("");
      toast.success("Space created successfully!");
      // Reload page to refresh user data
      window.location.reload();
    }
  };

  const handleJoinSpace = async () => {
    if (!user) return;

    if (!spaceCode.trim() || spaceCode.length !== 6) {
      toast.error("Space code must be 6 characters");
      return;
    }

    setLoading(true);
    const success = await joinSpaceForUser(user.id, spaceCode.toUpperCase());
    setLoading(false);

    if (success) {
      setShowSpaceModal(false);
      setSpaceCode("");
      toast.success("Successfully joined space!");
      // Reload page to refresh user data
      window.location.reload();
    }
  };

  const handleSpaceCodeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.toUpperCase().replace(/[^A-Z0-9]/g, "");
    if (value.length <= 6) {
      setSpaceCode(value);
    }
  };

  const loadEvents = async () => {
    if (!user?.id) return;
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
      <header className="sticky top-0 z-40 bg-background/95 backdrop-blur-sm border-b border-border/50 px-4 pt-2 pb-2">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col items-center justify-center gap-1">
            <div className="flex flex-col items-center justify-center gap-1 w-full">
              <div className="flex items-center justify-center">
                <img
                  src="/logo.png"
                  alt="Heart Link Logo"
                  className="w-8 h-8 sm:w-10 sm:h-10"
                />
              </div>
              <div className="text-center w-full">
                <h1 className="text-lg sm:text-xl font-extrabold bg-gradient-to-r from-primary via-accent to-secondary bg-clip-text text-transparent leading-tight">
                  {user?.spaceName || "Heart Link"}
                </h1>
                <p className="text-xs text-muted-foreground font-medium mt-0.5">
                  Your shared space for staying connected ❤️
                </p>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 pt-4 sm:pt-5 md:pt-6 space-y-5 sm:space-y-6 md:space-y-8">
        {/* Space Prompt Banner - Show if user doesn't have a space and not dismissed */}
        {user && !user.spaceCode && !user.spaceId && !bannerDismissed && (
          <Alert className="border-primary/50 bg-gradient-to-r from-primary/10 via-accent/10 to-secondary/10 backdrop-blur-sm relative">
            <Button
              variant="ghost"
              size="icon"
              className="absolute top-2 right-2 h-6 w-6"
              onClick={() => setBannerDismissed(true)}
            >
              <X className="h-4 w-4" />
            </Button>
            <Heart className="h-5 w-5 text-primary" />
            <AlertTitle className="text-lg font-bold text-foreground pr-8">
              Connect with Your Family & Partner
            </AlertTitle>
            <AlertDescription className="mt-2 space-y-3">
              <p className="text-sm text-muted-foreground">
                You're using Heart Link solo. Create or join a space to share
                moments, messages, and memories with your loved ones. You can
                continue using the app solo with limited features.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 mt-3">
                <Button
                  onClick={() => {
                    setSpaceAction("create");
                    setShowSpaceModal(true);
                  }}
                  className="flex-1 bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90 h-10"
                >
                  <Sparkles className="w-4 h-4 mr-2" />
                  Create Space
                </Button>
                <Button
                  onClick={() => {
                    setSpaceAction("join");
                    setShowSpaceModal(true);
                  }}
                  variant="outline"
                  className="flex-1 border-primary/50 hover:bg-primary/10 h-10"
                >
                  <Users className="w-4 h-4 mr-2" />
                  Join Space
                </Button>
              </div>
            </AlertDescription>
          </Alert>
        )}

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
          {country2 ? (
            <TimeWeatherCard
              city={city2}
              timezone={timezone2}
              countryCode={countryCode2}
              isRemote
              coordinates={coords2}
            />
          ) : (
            <div className="glass-card rounded-2xl p-4 sm:p-6 card-elevated transition-all duration-500 border-l-4 border-primary">
              <div className="flex items-start justify-between mb-3 sm:mb-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <Globe className="w-5 h-5 sm:w-6 sm:h-6 text-primary" />
                    <h3 className="text-base sm:text-lg font-semibold text-foreground">
                      Select Second Location
                    </h3>
                  </div>
                  <p className="text-xs text-foreground/70 font-medium">
                    Remote
                  </p>
                </div>
              </div>
              <div className="space-y-3 sm:space-y-4">
                <p className="text-xs sm:text-sm text-muted-foreground">
                  Choose a second location to enable time conversion and
                  distance tracking
                </p>
                <div className="w-full">
                  <CountrySelector
                    value=""
                    onValueChange={handleCountry2Change}
                    placeholder="Select country..."
                    disabled={isUpdatingCountry2}
                  />
                </div>
              </div>
            </div>
          )}
        </section>

        {/* 2x2 Grid: Time Converter & Quick Stats */}
        <section className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-5 md:gap-6">
          <TimeConverter
            country1={country1}
            country2={country2}
            timezone1={timezone1}
            timezone2={timezone2}
          />
          {/* Your Overview / Space Overview - Locked for solo users */}
          {user?.spaceCode && user?.spaceId ? (
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
                    {user?.spaceCode && user?.spaceId
                      ? "Space Overview"
                      : "Your Overview"}
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
                      (new Date().getTime() -
                        new Date("2025-11-10").getTime()) /
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
          ) : (
            <div className="glass-card rounded-2xl p-5 sm:p-6 md:p-7 card-elevated opacity-60 relative overflow-hidden">
              <div className="absolute inset-0 bg-background/50 backdrop-blur-sm z-10 flex flex-col items-center justify-center">
                <Lock className="w-8 h-8 text-muted-foreground mb-2" />
                <p className="text-sm font-semibold text-muted-foreground text-center">
                  Create or join a space to unlock
                </p>
                <p className="text-xs text-muted-foreground/70 text-center mt-1">
                  Space Overview & Distance
                </p>
              </div>
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-4 sm:mb-5 gap-3">
                <div className="flex items-center gap-2 sm:gap-3">
                  <div className="p-2 rounded-lg bg-primary/10">
                    <Heart
                      className="w-5 h-5 sm:w-6 sm:h-6 text-primary"
                      fill="currentColor"
                    />
                  </div>
                  <h3 className="text-lg sm:text-xl md:text-2xl font-bold text-foreground">
                    Your Overview
                  </h3>
                </div>
              </div>
              <div className="space-y-3 sm:space-y-4">
                <div className="flex items-center justify-between p-4 sm:p-5 rounded-xl bg-muted/30">
                  <div className="flex items-center gap-2 sm:gap-3">
                    <div className="p-2 rounded-lg bg-muted">
                      <Calendar className="w-4 h-4 sm:w-5 sm:h-5 text-muted-foreground" />
                    </div>
                    <span className="text-sm sm:text-base text-muted-foreground font-semibold">
                      Days Together
                    </span>
                  </div>
                  <span className="text-xl sm:text-2xl md:text-3xl font-extrabold text-muted-foreground">
                    --
                  </span>
                </div>
                <div className="flex items-center justify-between p-4 sm:p-5 rounded-xl bg-muted/30">
                  <div className="flex items-center gap-2 sm:gap-3">
                    <div className="p-2 rounded-lg bg-muted">
                      <MapPin className="w-4 h-4 sm:w-5 sm:h-5 text-muted-foreground" />
                    </div>
                    <span className="text-sm sm:text-base text-muted-foreground font-semibold">
                      Distance Between Locations
                    </span>
                  </div>
                  <span className="text-xl sm:text-2xl md:text-3xl font-extrabold text-muted-foreground">
                    --
                  </span>
                </div>
              </div>
            </div>
          )}
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

        {/* Distance Map Section - Locked for solo users */}
        {user?.spaceCode && user?.spaceId ? (
          <section>
            <DistanceMap
              country1={country1}
              country2={country2}
              coordinates1={coords1}
              coordinates2={coords2}
            />
          </section>
        ) : (
          <section>
            <div className="glass-card rounded-2xl p-8 card-elevated opacity-60 relative overflow-hidden">
              <div className="absolute inset-0 bg-background/50 backdrop-blur-sm z-10 flex flex-col items-center justify-center">
                <Lock className="w-12 h-12 text-muted-foreground mb-3" />
                <p className="text-base font-semibold text-muted-foreground text-center mb-1">
                  Distance Map Locked
                </p>
                <p className="text-sm text-muted-foreground/70 text-center">
                  Create or join a space to view distance between locations
                </p>
              </div>
              <div className="h-64 bg-muted/20 rounded-xl"></div>
            </div>
          </section>
        )}

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

      {/* Space Selection Modal */}
      <Dialog open={showSpaceModal} onOpenChange={setShowSpaceModal}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold">
              Choose Your Space
            </DialogTitle>
            <p className="text-sm text-muted-foreground mt-1">
              Create a new space or join an existing one
            </p>
          </DialogHeader>

          <div className="space-y-4 pt-4">
            {/* Action Toggle */}
            <div className="flex gap-2 p-1 bg-muted/50 rounded-lg">
              <button
                type="button"
                onClick={() => setSpaceAction("create")}
                className={`flex-1 py-2 px-4 rounded-md text-sm font-semibold transition-all ${
                  spaceAction === "create"
                    ? "bg-primary text-primary-foreground shadow-md"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                <div className="flex items-center justify-center gap-2">
                  <Sparkles className="w-4 h-4" />
                  Create Space
                </div>
              </button>
              <button
                type="button"
                onClick={() => setSpaceAction("join")}
                className={`flex-1 py-2 px-4 rounded-md text-sm font-semibold transition-all ${
                  spaceAction === "join"
                    ? "bg-primary text-primary-foreground shadow-md"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                <div className="flex items-center justify-center gap-2">
                  <Users className="w-4 h-4" />
                  Join Space
                </div>
              </button>
            </div>

            {/* Create Space Form */}
            {spaceAction === "create" && (
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="space-name" className="text-sm font-semibold">
                    Space Name{" "}
                    <span className="text-muted-foreground font-normal text-xs">
                      (Optional)
                    </span>
                  </Label>
                  <div className="relative">
                    <Sparkles className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      id="space-name"
                      type="text"
                      placeholder="e.g., Our Family Space"
                      value={spaceName}
                      onChange={(e) => setSpaceName(e.target.value)}
                      className="pl-10 h-10 text-sm"
                    />
                  </div>
                </div>

                <Button
                  onClick={handleCreateSpace}
                  className="w-full h-10 text-sm font-semibold"
                  disabled={loading}
                >
                  {loading ? (
                    "Creating..."
                  ) : (
                    <>
                      Create Space
                      <Sparkles className="w-3 h-3 ml-2" />
                    </>
                  )}
                </Button>
              </div>
            )}

            {/* Join Space Form */}
            {spaceAction === "join" && (
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="space-code" className="text-sm font-semibold">
                    Space Code
                  </Label>
                  <div className="relative">
                    <Users className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      id="space-code"
                      type="text"
                      placeholder="ABCDEF"
                      value={spaceCode}
                      onChange={handleSpaceCodeChange}
                      className="pl-10 text-center text-lg font-bold tracking-widest h-10 uppercase"
                      maxLength={6}
                    />
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Ask the space creator for the 6-character code
                  </p>
                </div>

                <Button
                  onClick={handleJoinSpace}
                  className="w-full h-10 text-sm font-semibold"
                  disabled={loading || spaceCode.length !== 6}
                >
                  {loading ? (
                    "Joining..."
                  ) : (
                    <>
                      Join Space
                      <Users className="w-3 h-3 ml-2" />
                    </>
                  )}
                </Button>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Index;
