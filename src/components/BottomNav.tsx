import { Home, Clock, Settings } from "lucide-react";
import { Link, useLocation } from "react-router-dom";

const BottomNav = () => {
  const location = useLocation();
  
  // Hide bottom nav on install page
  if (location.pathname === "/install") {
    return null;
  }

  const navItems = [
    { icon: Home, label: "Home", path: "/" },
    { icon: Clock, label: "Countdowns", path: "/countdowns" },
    { icon: Settings, label: "Settings", path: "/settings" },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 glass-card border-t border-border/50 backdrop-blur-xl z-50 safe-area-bottom">
      <div className="max-w-2xl mx-auto px-4">
        <div className="flex items-center justify-around py-3">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex flex-col items-center gap-1 px-6 py-2 rounded-xl transition-all duration-300 ${
                  isActive
                    ? "text-primary scale-110"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                <Icon className={`w-6 h-6 ${isActive ? "animate-breathe" : ""}`} />
                <span className="text-xs font-medium">{item.label}</span>
              </Link>
            );
          })}
        </div>
      </div>
    </nav>
  );
};

export default BottomNav;
