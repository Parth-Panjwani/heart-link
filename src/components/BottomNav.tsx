import { Home, Calendar, Heart, Settings, CheckSquare, Lock } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";

const BottomNav = () => {
  const location = useLocation();
  const { user } = useAuth();

  // Hide bottom nav on install/login/onboarding page or when not logged in
  if (
    location.pathname === "/install" ||
    location.pathname === "/login" ||
    location.pathname === "/onboarding" ||
    !user
  ) {
    return null;
  }

  const hasSpace = user?.spaceCode && user?.spaceId;
  
  const navItems = [
    { icon: Home, label: "Home", path: "/home", locked: false },
    { icon: Calendar, label: "Moments", path: "/moments", locked: false },
    { icon: CheckSquare, label: "To Do", path: "/todo", locked: false },
    { icon: Heart, label: "Messages", path: "/messages", locked: !hasSpace },
    { icon: Settings, label: "Settings", path: "/settings", locked: false },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 glass-card border-t border-border/50 backdrop-blur-xl z-50 safe-area-bottom">
      <div className="max-w-2xl mx-auto px-2 sm:px-4">
        <div className="flex items-center justify-around py-2 sm:py-3">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive =
              location.pathname === item.path ||
              (item.path === "/home" && location.pathname === "/");

            if (item.locked) {
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className="flex flex-col items-center gap-0.5 sm:gap-1 px-2 sm:px-4 md:px-6 py-1.5 sm:py-2 rounded-xl transition-all duration-300 flex-1 opacity-60 hover:opacity-80"
                  title="Create or join a space to unlock"
                >
                  <Icon className="w-5 h-5 sm:w-6 sm:h-6 text-muted-foreground" />
                  <span className="text-[10px] sm:text-xs font-medium leading-tight text-center text-muted-foreground">
                    {item.label}
                  </span>
                </Link>
              );
            }

            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex flex-col items-center gap-0.5 sm:gap-1 px-2 sm:px-4 md:px-6 py-1.5 sm:py-2 rounded-xl transition-all duration-300 flex-1 ${
                  isActive
                    ? "text-primary scale-105 sm:scale-110"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                <Icon
                  className={`w-5 h-5 sm:w-6 sm:h-6 ${
                    isActive ? "animate-breathe" : ""
                  }`}
                />
                <span className="text-[10px] sm:text-xs font-medium leading-tight text-center">
                  {item.label}
                </span>
              </Link>
            );
          })}
        </div>
      </div>
    </nav>
  );
};

export default BottomNav;
