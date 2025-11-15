import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Heart,
  Lock,
  User,
  ArrowRight,
  Mail,
  Sparkles,
  Users,
} from "lucide-react";
import { toast } from "sonner";

const Login = () => {
  const [email, setEmail] = useState("");
  const [pin, setPin] = useState("");
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email.trim()) {
      toast.error("Email is required");
      return;
    }

    if (!pin || pin.length !== 4) {
      toast.error("PIN must be exactly 4 digits");
      return;
    }

    setLoading(true);
    const success = await login(email.trim(), pin, name.trim() || undefined);
    if (success) {
      // Check if user has a space, if not stay on signup page to show modal
      const userData = JSON.parse(
        localStorage.getItem("heartLink_currentUser") || "{}"
      );
      if (!userData.spaceCode || !userData.spaceId) {
        // Redirect to signup page which will show the space selection modal
        navigate("/signup");
      } else {
        navigate("/home");
      }
    } else {
      // Clear PIN on error so user can easily retry
      setPin("");
      // Focus on PIN input for better UX
      setTimeout(() => {
        const pinInput = document.getElementById("login-pin");
        if (pinInput) {
          pinInput.focus();
        }
      }, 100);
    }
    setLoading(false);
  };

  const handlePinChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, "");
    if (value.length <= 4) {
      setPin(value);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-gradient-to-br from-primary/5 via-background to-accent/5">
      <div className="w-full max-w-2xl">
        {/* Header */}
        <div className="text-center mb-8 animate-fade-in">
          <div className="inline-flex items-center justify-center w-20 h-20 sm:w-24 sm:h-24 mb-6">
            <img
              src="/logo.png"
              alt="Heart Link Logo"
              className="w-full h-full object-contain"
            />
          </div>
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold bg-gradient-to-r from-primary via-accent to-secondary bg-clip-text text-transparent mb-3">
            Heart Link
          </h1>
          <p className="text-base sm:text-lg text-muted-foreground">
            Stay close, no matter the distance ❤️
          </p>
        </div>

        {/* Form Card */}
        <div className="glass-card rounded-3xl p-6 sm:p-8 md:p-10 card-elevated overflow-hidden relative">
          {/* Background gradient */}
          <div className="absolute inset-0 bg-gradient-to-br from-primary to-accent opacity-5"></div>

          <div className="relative z-10">
            {/* Form Header */}
            <div className="text-center mb-8">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-primary to-accent mb-4 shadow-lg">
                <Heart
                  className="w-8 h-8 text-primary-foreground"
                  fill="currentColor"
                />
              </div>
              <h2 className="text-2xl sm:text-3xl font-bold text-foreground mb-2">
                Welcome Back
              </h2>
              <p className="text-sm text-muted-foreground">
                Enter your PIN to access your space
              </p>
            </div>

            {/* Login Form */}
            <form onSubmit={handleLogin} className="space-y-5">
              <div className="space-y-2">
                <Label htmlFor="login-name" className="text-sm font-semibold">
                  Your Name{" "}
                  <span className="text-muted-foreground font-normal">
                    (Optional)
                  </span>
                </Label>
                <div className="relative">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  <Input
                    id="login-name"
                    type="text"
                    placeholder="Enter your name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="pl-11 h-12 text-base"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="login-pin" className="text-sm font-semibold">
                  4-Digit PIN
                </Label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  <Input
                    id="login-pin"
                    type="text"
                    inputMode="numeric"
                    pattern="[0-9]*"
                    placeholder="0000"
                    value={pin}
                    onChange={handlePinChange}
                    className="pl-11 text-center text-2xl font-bold tracking-widest h-14"
                    maxLength={4}
                    required
                  />
                </div>
                <p className="text-xs text-muted-foreground flex items-center gap-1">
                  <Lock className="w-3 h-3" />
                  Enter your 4-digit PIN to access your space
                </p>
              </div>

              <Button
                type="submit"
                className="w-full h-12 text-base font-semibold"
                size="lg"
                disabled={loading || pin.length !== 4 || !email.trim()}
              >
                {loading ? (
                  "Signing in..."
                ) : (
                  <>
                    Sign In
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </>
                )}
              </Button>
            </form>

            {/* Footer */}
            <div className="mt-8 pt-6 border-t border-border/50 space-y-3">
              <p className="text-center text-xs text-muted-foreground">
                By continuing, you agree to keep your heart connected ❤️
              </p>
              <div className="text-center space-y-2">
                <p className="text-xs text-muted-foreground">
                  New to Heart Link?
                </p>
                <div className="flex flex-col sm:flex-row gap-2 justify-center">
                  <Link to="/signup">
                    <Button variant="outline" size="sm" className="h-9 text-xs">
                      <Sparkles className="w-3 h-3 mr-1" />
                      Create Space
                    </Button>
                  </Link>
                  <Link to="/choose-space">
                    <Button variant="outline" size="sm" className="h-9 text-xs">
                      <Users className="w-3 h-3 mr-1" />
                      Join Space
                    </Button>
                  </Link>
                </div>
              </div>
              {localStorage.getItem("heartLink_onboarding_seen") && (
                <div className="text-center">
                  <Link
                    to="/onboarding"
                    className="text-xs text-muted-foreground hover:text-primary underline transition-colors"
                    onClick={() => {
                      localStorage.removeItem("heartLink_onboarding_seen");
                    }}
                  >
                    View Welcome Screens
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
