import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Heart,
  Smartphone,
  User,
  Calendar,
  LogOut,
  Bell,
  Users,
  Copy,
  Check,
  Share2,
  MapPin,
  Globe,
  Mail,
  Sparkles,
} from "lucide-react";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useFCM } from "@/hooks/useFCM";
import { usersApi } from "@/lib/api";
import { COUNTRIES, getCountryByName, type Country } from "@/lib/countries";
import { CountrySelector } from "@/components/CountrySelector";

const Settings = () => {
  const { user, logout, updateUser } = useAuth();
  const navigate = useNavigate();
  const { isPermissionGranted, requestPermission, fcmToken } = useFCM();
  const [use24Hour, setUse24Hour] = useState(false);
  const [copied, setCopied] = useState(false);
  const [selectedCountry1, setSelectedCountry1] = useState<string>("");
  const [selectedCountry2, setSelectedCountry2] = useState<string>("");
  const [isUpdatingCountries, setIsUpdatingCountries] = useState(false);

  useEffect(() => {
    const savedFormat = localStorage.getItem("use24Hour");
    if (savedFormat) {
      setUse24Hour(savedFormat === "true");
    }
    if (user) {
      setSelectedCountry1(user.country1 || "India");
      setSelectedCountry2(user.country2 || "Russia (Krasnoyarsk)");
    }
  }, [user]);

  const handleCountryChange = async (
    countryNum: 1 | 2,
    countryName: string
  ) => {
    if (!user) return;

    const country = getCountryByName(countryName);
    if (!country) {
      toast.error("Country not found");
      return;
    }

    setIsUpdatingCountries(true);
    try {
      const updateData: any = {};
      if (countryNum === 1) {
        updateData.country1 = country.name;
        updateData.timezone1 = country.timezone;
        updateData.coordinates1 = country.coordinates;
        setSelectedCountry1(country.name);
      } else {
        updateData.country2 = country.name;
        updateData.timezone2 = country.timezone;
        updateData.coordinates2 = country.coordinates;
        setSelectedCountry2(country.name);
      }

      const result = await usersApi.updateCountries(user.id, updateData);
      if (result.success && result.data) {
        updateUser(result.data.user);
        toast.success(`Country ${countryNum} updated to ${country.name}`);
      } else {
        toast.error(result.error || "Failed to update country");
      }
    } catch (error) {
      toast.error("Failed to update country");
    } finally {
      setIsUpdatingCountries(false);
    }
  };

  const handleTimeFormatChange = (checked: boolean) => {
    setUse24Hour(checked);
    localStorage.setItem("use24Hour", checked.toString());
    toast.success(`Time format changed to ${checked ? "24-hour" : "12-hour"}`);
  };

  const handleLogout = () => {
    logout();
    navigate("/signup");
  };

  return (
    <div className="min-h-screen pb-24">
      {/* Sticky Header */}
      <header className="sticky top-0 z-40 bg-background/95 backdrop-blur-sm border-b border-border/50 pt-6 pb-4">
        <div className="max-w-2xl mx-auto px-4">
          <h1 className="text-2xl font-bold text-foreground mb-2">Settings</h1>
          <p className="text-sm text-muted-foreground">
            Customize your experience
          </p>
        </div>
      </header>

      <div className="max-w-2xl mx-auto px-4 pt-6">
        <div className="space-y-6">
          {/* User Info */}
          {user && (
            <div className="glass-card rounded-2xl p-6 card-elevated">
              <div className="flex items-center gap-2 mb-4">
                <User className="w-5 h-5 text-primary" />
                <h3 className="text-base font-medium text-foreground">
                  User Information
                </h3>
              </div>
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center text-primary-foreground font-bold text-lg">
                    {user.name.charAt(0).toUpperCase()}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <User className="w-4 h-4 text-muted-foreground" />
                      <p className="text-sm font-semibold text-foreground">
                        {user.name}
                      </p>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2 pt-3 border-t border-border">
                  <Calendar className="w-4 h-4 text-muted-foreground" />
                  <p className="text-xs text-muted-foreground">
                    Member since{" "}
                    {new Date(user.createdAt).toLocaleDateString("en-US", {
                      month: "short",
                      year: "numeric",
                    })}
                  </p>
                </div>
                <Button
                  variant="outline"
                  onClick={handleLogout}
                  className="w-full mt-4"
                >
                  <LogOut className="w-4 h-4 mr-2" />
                  Logout
                </Button>
              </div>
            </div>
          )}

          {/* Space Code Section */}
          {user && user.spaceCode && (
            <div className="glass-card rounded-2xl p-6 card-elevated">
              <div className="flex items-center gap-2 mb-4">
                <Users className="w-5 h-5 text-primary" />
                <h3 className="text-base font-medium text-foreground">
                  Your Space
                </h3>
              </div>
              <div className="space-y-4">
                <div>
                  <Label className="text-sm text-muted-foreground mb-2 block">
                    Space Code
                  </Label>
                  <div className="flex items-center gap-2">
                    <div className="flex-1 px-4 py-3 rounded-lg bg-muted/50 border border-border font-mono text-lg font-bold text-center tracking-wider">
                      {user.spaceCode}
                    </div>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={async () => {
                          try {
                            await navigator.clipboard.writeText(
                              user.spaceCode || ""
                            );
                            setCopied(true);
                            toast.success("Space code copied!");
                            setTimeout(() => setCopied(false), 2000);
                          } catch (error) {
                            toast.error("Failed to copy");
                          }
                        }}
                        className="h-11 w-11"
                      >
                        {copied ? (
                          <Check className="w-5 h-5 text-primary" />
                        ) : (
                          <Copy className="w-5 h-5" />
                        )}
                      </Button>
                      <Button
                        variant="default"
                        size="icon"
                        onClick={async () => {
                          try {
                            const shareLink = `${window.location.origin}/signup?spaceCode=${user.spaceCode}`;
                            if (navigator.share) {
                              await navigator.share({
                                title: "Join my space on Heart Link",
                                text: `Join my space "${
                                  user.spaceName || user.spaceCode
                                }" on Heart Link! Use code: ${user.spaceCode}`,
                                url: shareLink,
                              });
                            } else {
                              await navigator.clipboard.writeText(shareLink);
                              toast.success("Share link copied!");
                            }
                          } catch (error) {
                            if ((error as Error).name !== "AbortError") {
                              toast.error("Failed to share");
                            }
                          }
                        }}
                        className="h-11 w-11"
                      >
                        <Share2 className="w-5 h-5" />
                      </Button>
                    </div>
                  </div>
                  <p className="text-xs text-muted-foreground mt-2">
                    Share this code with others to invite them to your space
                  </p>
                </div>
                {user.isSpaceCreator && (
                  <div className="pt-3 border-t border-border">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Share2 className="w-4 h-4" />
                      <span>You created this space</span>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Country Selection */}
          {user && (
            <div className="glass-card rounded-2xl p-6 card-elevated">
              <div className="flex items-center gap-2 mb-4">
                <Globe className="w-5 h-5 text-primary" />
                <h3 className="text-base font-medium text-foreground">
                  Space Locations
                </h3>
              </div>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label className="text-sm text-muted-foreground">
                    Your Location
                  </Label>
                  <CountrySelector
                    value={selectedCountry1}
                    onValueChange={(value) => handleCountryChange(1, value)}
                    placeholder="Select your country"
                    disabled={isUpdatingCountries}
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-sm text-muted-foreground">
                    Second Location
                  </Label>
                  <CountrySelector
                    value={selectedCountry2}
                    onValueChange={(value) => handleCountryChange(2, value)}
                    placeholder="Select second location"
                    disabled={isUpdatingCountries}
                  />
                </div>
                <p className="text-xs text-muted-foreground">
                  Set two locations for your space to enable time conversion,
                  weather, and distance tracking
                </p>
              </div>
            </div>
          )}

          {/* Push Notifications */}
          <div className="glass-card rounded-2xl p-6 card-elevated">
            <div className="flex items-center gap-2 mb-4">
              <Bell className="w-5 h-5 text-primary" />
              <h3 className="text-base font-medium text-foreground">
                Push Notifications
              </h3>
            </div>
            <div className="space-y-3">
              {isPermissionGranted ? (
                <>
                  <p className="text-sm text-muted-foreground">
                    ✅ Notifications are enabled
                  </p>
                </>
              ) : (
                <>
                  <p className="text-sm text-muted-foreground">
                    Enable push notifications to receive real-time updates when
                    someone nudges you or sends a message.
                  </p>
                  <Button onClick={requestPermission} className="w-full">
                    <Bell className="w-4 h-4 mr-2" />
                    Enable Notifications
                  </Button>
                </>
              )}
            </div>
          </div>

          {/* Time Format */}
          <div className="glass-card rounded-2xl p-6 card-elevated">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-medium text-foreground mb-1">
                  24-Hour Time Format
                </h3>
                <p className="text-sm text-muted-foreground">
                  Display time in 24-hour format
                </p>
              </div>
              <Switch
                checked={use24Hour}
                onCheckedChange={handleTimeFormatChange}
              />
            </div>
          </div>

          {/* PWA Install */}
          <div className="glass-card rounded-2xl p-6 card-elevated">
            <div className="flex items-center gap-2 mb-4">
              <Smartphone className="w-5 h-5 text-primary" />
              <h3 className="text-base font-medium text-foreground">
                Install App
              </h3>
            </div>
            <p className="text-sm text-muted-foreground mb-4">
              Install Heart Link on your device for the best experience. Works
              offline!
            </p>
            <Link to="/install">
              <Button variant="secondary" className="w-full">
                Installation Guide
              </Button>
            </Link>
          </div>

          {/* About */}
          <div className="glass-card rounded-2xl p-6 card-elevated">
            <h3 className="text-base font-medium text-foreground mb-3">
              About
            </h3>
            <div className="space-y-2 text-sm text-muted-foreground">
              <p>Heart Link v1.0</p>
              <p>A beautiful app to stay connected across distance and time.</p>
              <div className="flex items-center gap-2 mt-4 pt-4 border-t border-border">
                <Heart className="w-4 h-4 text-primary animate-breathe" />
                <p className="text-xs italic">Made to keep hearts closer.</p>
              </div>
              <div className="mt-4 pt-4 border-t border-border">
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <Sparkles className="w-3 h-3 text-primary" />
                  <span>Vibe coded by</span>
                  <span className="font-semibold text-foreground">
                    Parth Panjwani
                  </span>
                  <Heart className="w-3 h-3 text-primary fill-primary" />
                </div>
                <div className="mt-2">
                  <a
                    href="mailto:theparthpanjwani@gmail.com"
                    className="text-xs text-primary hover:underline flex items-center gap-1.5 w-fit"
                  >
                    <Mail className="w-3 h-3" />
                    theparthpanjwani@gmail.com
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* Data Management */}
          <div className="glass-card rounded-2xl p-6 card-elevated">
            <h3 className="text-base font-medium text-foreground mb-3">
              Data Management
            </h3>
            <Button
              variant="destructive"
              onClick={() => {
                if (
                  window.confirm(
                    "Are you sure? This will delete all your countdowns and settings."
                  )
                ) {
                  localStorage.clear();
                  toast.success("All data cleared");
                  setTimeout(() => window.location.reload(), 1000);
                }
              }}
              className="w-full"
            >
              Clear All Data
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;
