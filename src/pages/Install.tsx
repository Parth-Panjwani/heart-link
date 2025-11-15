import { Button } from "@/components/ui/button";
import { Download, Smartphone } from "lucide-react";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const Install = () => {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [isInstallable, setIsInstallable] = useState(false);

  useEffect(() => {
    const handler = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setIsInstallable(true);
    };

    window.addEventListener("beforeinstallprompt", handler);

    return () => {
      window.removeEventListener("beforeinstallprompt", handler);
    };
  }, []);

  const handleInstall = async () => {
    if (!deferredPrompt) return;

    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;

    if (outcome === "accepted") {
      setDeferredPrompt(null);
      setIsInstallable(false);
    }
  };

  return (
    <div className="min-h-screen pb-24 pt-12 flex items-center justify-center">
      <div className="max-w-md mx-auto px-4">
        <div className="glass-card rounded-2xl p-8 card-elevated text-center space-y-6">
          <div className="flex justify-center">
            <div className="relative">
              <div className="absolute inset-0 bg-primary/20 rounded-full blur-2xl"></div>
              <img
                src="/logo.png"
                alt="Heart Link Logo"
                className="w-16 h-16 relative animate-gentle-pulse object-contain"
              />
            </div>
          </div>

          <div>
            <h1 className="text-2xl font-bold text-foreground mb-2">
              Install Heart Link
            </h1>
            <p className="text-muted-foreground">
              Get the full experience on your device
            </p>
          </div>

          {isInstallable ? (
            <Button onClick={handleInstall} size="lg" className="w-full">
              <Download className="w-5 h-5 mr-2" />
              Install App
            </Button>
          ) : (
            <div className="space-y-4">
              <div className="flex items-start gap-3 text-left">
                <Smartphone className="w-5 h-5 text-primary mt-1" />
                <div>
                  <p className="text-sm font-medium text-foreground mb-1">
                    Install on iPhone
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Tap Share → Add to Home Screen
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3 text-left">
                <Smartphone className="w-5 h-5 text-primary mt-1" />
                <div>
                  <p className="text-sm font-medium text-foreground mb-1">
                    Install on Android
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Tap Menu → Install App or Add to Home Screen
                  </p>
                </div>
              </div>
            </div>
          )}

          <Link to="/">
            <Button variant="ghost" className="w-full">
              Continue in Browser
            </Button>
          </Link>

          <p className="text-xs text-muted-foreground italic">
            Works offline • Feels like a native app
          </p>
        </div>
      </div>
    </div>
  );
};

export default Install;
