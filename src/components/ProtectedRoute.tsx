import { ReactNode } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";

interface ProtectedRouteProps {
  children: ReactNode;
}

const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    // Check if user has seen onboarding
    const hasSeenOnboarding = localStorage.getItem("heartLink_onboarding_seen");
    if (!hasSeenOnboarding) {
      return <Navigate to="/onboarding" replace />;
    }
    return <Navigate to="/signup" replace />;
  }

  // Allow users without a space to use the app solo (with limited features)
  // No redirect needed - they can use the app and will see prompts to create/join space

  // Redirect authenticated users from root to home
  if (window.location.pathname === "/") {
    return <Navigate to="/home" replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
