import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";

const RootRedirect = () => {
  const { user, loading } = useAuth();
  const [hasCheckedOnboarding, setHasCheckedOnboarding] = useState(false);

  useEffect(() => {
    // Small delay to ensure localStorage is accessible
    setHasCheckedOnboarding(true);
  }, []);

  if (loading || !hasCheckedOnboarding) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  // Always check onboarding first - redirect to onboarding if not seen
  const hasSeenOnboarding = localStorage.getItem("heartLink_onboarding_seen");
  
  if (!hasSeenOnboarding) {
    return <Navigate to="/onboarding" replace />;
  }

  // If user is authenticated, go to home
  if (user) {
    return <Navigate to="/home" replace />;
  }

  // Otherwise go to signup (main entry point)
  return <Navigate to="/signup" replace />;
};

export default RootRedirect;

