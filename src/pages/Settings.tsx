import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Heart, Key, Smartphone } from "lucide-react";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { Link } from "react-router-dom";

const Settings = () => {
  const [use24Hour, setUse24Hour] = useState(false);
  const [apiKey, setApiKey] = useState("");
  const [tempApiKey, setTempApiKey] = useState("");

  useEffect(() => {
    const savedFormat = localStorage.getItem("use24Hour");
    if (savedFormat) {
      setUse24Hour(savedFormat === "true");
    }

    const savedApiKey = localStorage.getItem("weatherApiKey");
    if (savedApiKey) {
      setApiKey(savedApiKey);
      setTempApiKey(savedApiKey);
    }
  }, []);

  const handleTimeFormatChange = (checked: boolean) => {
    setUse24Hour(checked);
    localStorage.setItem("use24Hour", checked.toString());
    toast.success(`Time format changed to ${checked ? "24-hour" : "12-hour"}`);
  };

  const handleApiKeySave = () => {
    if (!tempApiKey.trim()) {
      toast.error("Please enter an API key");
      return;
    }
    localStorage.setItem("weatherApiKey", tempApiKey);
    setApiKey(tempApiKey);
    toast.success("Weather API key saved! Refresh to see live weather.");
    window.location.reload();
  };

  return (
    <div className="min-h-screen pb-24 pt-6">
      <div className="max-w-2xl mx-auto px-4">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-foreground mb-2">Settings</h1>
          <p className="text-sm text-muted-foreground">Customize your experience</p>
        </div>

        <div className="space-y-6">
          {/* Time Format */}
          <div className="glass-card rounded-2xl p-6 shadow-soft">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-medium text-foreground mb-1">
                  24-Hour Time Format
                </h3>
                <p className="text-sm text-muted-foreground">
                  Display time in 24-hour format
                </p>
              </div>
              <Switch checked={use24Hour} onCheckedChange={handleTimeFormatChange} />
            </div>
          </div>

          {/* Weather API Key */}
          <div className="glass-card rounded-2xl p-6 shadow-soft">
            <div className="flex items-center gap-2 mb-4">
              <Key className="w-5 h-5 text-primary" />
              <h3 className="text-base font-medium text-foreground">
                Weather API Key
              </h3>
            </div>
            <p className="text-sm text-muted-foreground mb-4">
              Add your OpenWeatherMap API key to see real-time weather data.
              <a
                href="https://openweathermap.org/api"
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary hover:underline ml-1"
              >
                Get free API key →
              </a>
            </p>
            <div className="space-y-3">
              <Input
                type="password"
                value={tempApiKey}
                onChange={(e) => setTempApiKey(e.target.value)}
                placeholder="Enter your API key"
                className="font-mono text-sm"
              />
              <Button onClick={handleApiKeySave} className="w-full">
                Save API Key
              </Button>
              {apiKey && (
                <p className="text-xs text-muted-foreground text-center">
                  ✓ API key configured
                </p>
              )}
            </div>
          </div>

          {/* PWA Install */}
          <div className="glass-card rounded-2xl p-6 shadow-soft">
            <div className="flex items-center gap-2 mb-4">
              <Smartphone className="w-5 h-5 text-primary" />
              <h3 className="text-base font-medium text-foreground">
                Install App
              </h3>
            </div>
            <p className="text-sm text-muted-foreground mb-4">
              Install Connected Hearts on your device for the best experience. Works offline!
            </p>
            <Link to="/install">
              <Button variant="secondary" className="w-full">
                Installation Guide
              </Button>
            </Link>
          </div>

          {/* About */}
          <div className="glass-card rounded-2xl p-6 shadow-soft">
            <h3 className="text-base font-medium text-foreground mb-3">About</h3>
            <div className="space-y-2 text-sm text-muted-foreground">
              <p>Connected Hearts v1.0</p>
              <p>A beautiful app to stay connected across distance and time.</p>
              <div className="flex items-center gap-2 mt-4 pt-4 border-t border-border">
                <Heart className="w-4 h-4 text-primary animate-breathe" />
                <p className="text-xs italic">Made to keep hearts closer.</p>
              </div>
            </div>
          </div>

          {/* Data Management */}
          <div className="glass-card rounded-2xl p-6 shadow-soft">
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
