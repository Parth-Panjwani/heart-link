import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Lock,
  User,
  Mail,
  Phone,
  ArrowRight,
  X,
  Sparkles,
  Users,
  Heart,
} from "lucide-react";
import { toast } from "sonner";
import { usersApi } from "@/lib/api";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";

const Signup = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [pin, setPin] = useState("");
  const [loading, setLoading] = useState(false);
  const [showLogin, setShowLogin] = useState(false);
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPin, setLoginPin] = useState("");
  const [loginName, setLoginName] = useState("");
  const { signup, login, user, joinSpace } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [spaceCode, setSpaceCode] = useState("");
  const [spaceInfo, setSpaceInfo] = useState<{
    creatorName: string;
    spaceName?: string;
  } | null>(null);
  const [showWelcomeModal, setShowWelcomeModal] = useState(false);
  const [loadingSpaceInfo, setLoadingSpaceInfo] = useState(false);

  // Check for spaceCode in URL and fetch space info
  useEffect(() => {
    const urlSpaceCode = searchParams.get("spaceCode");
    if (urlSpaceCode && !user) {
      setSpaceCode(urlSpaceCode.toUpperCase());
      setLoadingSpaceInfo(true);
      usersApi
        .getSpaceInfo(urlSpaceCode.toUpperCase())
        .then((result) => {
          if (result.success && result.data) {
            setSpaceInfo({
              creatorName: result.data.space.creatorName,
              spaceName: result.data.space.name,
            });
            setShowWelcomeModal(true);
          } else {
            toast.error("Invalid space code");
          }
        })
        .catch(() => {
          toast.error("Failed to load space information");
        })
        .finally(() => {
          setLoadingSpaceInfo(false);
        });
    }
  }, [searchParams, user]);

  // Redirect to home if user is logged in (don't show modal on signup page)
  useEffect(() => {
    if (user) {
      // If spaceCode is in URL, navigate to home with it
      const urlSpaceCode = searchParams.get("spaceCode");
      if (urlSpaceCode) {
        navigate(`/home?spaceCode=${urlSpaceCode}`);
      } else {
        navigate("/home");
      }
    }
  }, [user, searchParams, navigate]);

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!name.trim()) {
      toast.error("Name is required");
      return;
    }

    if (!email.trim()) {
      toast.error("Email is required");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      toast.error("Invalid email format");
      return;
    }

    if (!phone.trim()) {
      toast.error("Phone number is required");
      return;
    }

    if (!pin || pin.length !== 4) {
      toast.error("PIN must be exactly 4 digits");
      return;
    }

    setLoading(true);
    let success = false;

    // If spaceCode is present, use joinSpace instead of signup
    if (spaceCode && spaceCode.length === 6) {
      success = await joinSpace(
        name.trim(),
        email.trim(),
        phone.trim(),
        pin,
        spaceCode.toUpperCase()
      );
    } else {
      success = await signup(name.trim(), email.trim(), phone.trim(), pin);
    }

    setLoading(false);

    if (success) {
      // Navigate directly to home page (don't show modal here)
      navigate("/home");
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!loginEmail.trim()) {
      toast.error("Email is required");
      return;
    }

    if (!loginPin || loginPin.length !== 4) {
      toast.error("PIN must be exactly 4 digits");
      return;
    }

    setLoading(true);
    const success = await login(
      loginEmail.trim(),
      loginPin,
      loginName.trim() || undefined
    );
    setLoading(false);

    if (success) {
      navigate("/home");
    }
  };

  const handlePinChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, "");
    if (value.length <= 4) {
      setPin(value);
    }
  };

  const handleLoginPinChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, "");
    if (value.length <= 4) {
      setLoginPin(value);
    }
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, "");
    setPhone(value);
  };

  const handleSpaceCodeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.toUpperCase().replace(/[^A-Z0-9]/g, "");
    if (value.length <= 6) {
      setSpaceCode(value);
    }
  };


  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-gradient-to-br from-primary/5 via-background to-accent/5">
      <div className="w-full max-w-lg">
        {/* Header */}
        <div className="text-center mb-6 animate-fade-in">
          <div className="inline-flex items-center justify-center w-16 h-16 mb-4">
            <img
              src="/logo.png"
              alt="Heart Link Logo"
              className="w-full h-full object-contain"
            />
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold bg-gradient-to-r from-primary via-accent to-secondary bg-clip-text text-transparent mb-2">
            Welcome to Heart Link
          </h1>
          <p className="text-sm text-muted-foreground">
            Create your account to get started ❤️
          </p>
        </div>

        {/* Login Form (if toggled) */}
        {showLogin ? (
          <div className="glass-card rounded-2xl p-5 sm:p-6 card-elevated overflow-hidden relative mb-4">
            <div className="absolute inset-0 bg-gradient-to-br from-primary to-accent opacity-5"></div>
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold text-foreground">Sign In</h2>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => {
                    setShowLogin(false);
                    setLoginEmail("");
                    setLoginPin("");
                    setLoginName("");
                  }}
                  className="h-8 w-8"
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
              <form onSubmit={handleLogin} className="space-y-3">
                <div className="space-y-1.5">
                  <Label
                    htmlFor="login-email"
                    className="text-xs font-semibold"
                  >
                    Email Address
                  </Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      id="login-email"
                      type="email"
                      placeholder="your.email@example.com"
                      value={loginEmail}
                      onChange={(e) => setLoginEmail(e.target.value)}
                      className="pl-10 h-10 text-sm"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="login-pin" className="text-xs font-semibold">
                    Your 4-Digit PIN
                  </Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      id="login-pin"
                      type="text"
                      inputMode="numeric"
                      pattern="[0-9]*"
                      placeholder="0000"
                      value={loginPin}
                      onChange={handleLoginPinChange}
                      className="pl-10 text-center text-xl font-bold tracking-widest h-12"
                      maxLength={4}
                      required
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="login-name" className="text-xs font-semibold">
                    Your Name{" "}
                    <span className="text-muted-foreground font-normal text-xs">
                      (Optional)
                    </span>
                  </Label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      id="login-name"
                      type="text"
                      placeholder="Enter your name"
                      value={loginName}
                      onChange={(e) => setLoginName(e.target.value)}
                      className="pl-10 h-10 text-sm"
                    />
                  </div>
                </div>

                <Button
                  type="submit"
                  className="w-full h-10 text-sm font-semibold mt-4"
                  size="lg"
                  disabled={
                    loading || loginPin.length !== 4 || !loginEmail.trim()
                  }
                >
                  {loading ? (
                    "Signing in..."
                  ) : (
                    <>
                      Sign In
                      <ArrowRight className="w-3 h-3 ml-2" />
                    </>
                  )}
                </Button>
              </form>
            </div>
          </div>
        ) : (
          /* Signup Form Card */
          <div className="glass-card rounded-2xl p-5 sm:p-6 card-elevated overflow-hidden relative mb-4">
            {/* Background gradient */}
            <div className="absolute inset-0 bg-gradient-to-br from-accent to-secondary opacity-5"></div>

            <div className="relative z-10">
              {/* Signup Form */}
              <form onSubmit={handleSignup} className="space-y-3">
                <div className="space-y-1.5">
                  <Label
                    htmlFor="signup-name"
                    className="text-xs font-semibold"
                  >
                    Your Name
                  </Label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      id="signup-name"
                      type="text"
                      placeholder="Enter your name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="pl-10 h-10 text-sm"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <Label
                    htmlFor="signup-email"
                    className="text-xs font-semibold"
                  >
                    Email Address
                  </Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      id="signup-email"
                      type="email"
                      placeholder="your.email@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="pl-10 h-10 text-sm"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <Label
                    htmlFor="signup-phone"
                    className="text-xs font-semibold"
                  >
                    Phone Number
                  </Label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      id="signup-phone"
                      type="tel"
                      inputMode="numeric"
                      placeholder="1234567890"
                      value={phone}
                      onChange={handlePhoneChange}
                      className="pl-10 h-10 text-sm"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="signup-pin" className="text-xs font-semibold">
                    Create 4-Digit PIN
                  </Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      id="signup-pin"
                      type="text"
                      inputMode="numeric"
                      pattern="[0-9]*"
                      placeholder="0000"
                      value={pin}
                      onChange={handlePinChange}
                      className="pl-10 text-center text-xl font-bold tracking-widest h-12"
                      maxLength={4}
                      required
                    />
                  </div>
                </div>

                {/* Space Code Field - Show if spaceCode is in URL */}
                {spaceCode && (
                  <div className="space-y-1.5">
                    <Label htmlFor="signup-space-code" className="text-xs font-semibold">
                      Space Code
                    </Label>
                    <div className="relative">
                      <Users className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                      <Input
                        id="signup-space-code"
                        type="text"
                        placeholder="ABCDEF"
                        value={spaceCode}
                        onChange={handleSpaceCodeChange}
                        className="pl-10 text-center text-lg font-bold tracking-widest h-10 uppercase"
                        maxLength={6}
                        disabled
                      />
                    </div>
                    <p className="text-xs text-muted-foreground">
                      You're joining {spaceInfo?.creatorName}'s space
                    </p>
                  </div>
                )}

                <Button
                  type="submit"
                  className="w-full h-10 text-sm font-semibold mt-4"
                  size="lg"
                  disabled={
                    loading ||
                    pin.length !== 4 ||
                    !name.trim() ||
                    !email.trim() ||
                    !phone.trim() ||
                    (spaceCode && spaceCode.length !== 6)
                  }
                >
                  {loading ? (
                    spaceCode ? "Joining Space..." : "Creating Account..."
                  ) : (
                    <>
                      {spaceCode ? "Join Space" : "Create Account"}
                      <ArrowRight className="w-3 h-3 ml-2" />
                    </>
                  )}
                </Button>
              </form>

              {/* Footer */}
              <div className="mt-4 pt-4 border-t border-border/50">
                <p className="text-center text-xs text-muted-foreground">
                  Already have an account?{" "}
                  <button
                    type="button"
                    onClick={() => setShowLogin(true)}
                    className="text-primary hover:underline font-semibold"
                  >
                    Sign In
                  </button>
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Welcome Modal - Show when spaceCode is in URL */}
        <Dialog open={showWelcomeModal} onOpenChange={setShowWelcomeModal}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <div className="flex items-center justify-center mb-4">
                <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
                  <Heart className="w-8 h-8 text-primary" fill="currentColor" />
                </div>
              </div>
              <DialogTitle className="text-2xl font-bold text-center">
                Welcome! 🎉
              </DialogTitle>
              <DialogDescription className="text-center mt-2">
                {spaceInfo?.creatorName} invited you to join their space
                {spaceInfo?.spaceName && (
                  <span className="block mt-1 font-semibold text-foreground">
                    "{spaceInfo.spaceName}"
                  </span>
                )}
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4 pt-4">
              <div className="flex items-start gap-3 p-3 rounded-lg bg-primary/5">
                <Users className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                <div>
                  <p className="font-semibold text-sm mb-1">Join {spaceInfo?.creatorName}'s Space</p>
                  <p className="text-sm text-muted-foreground">
                    Create your account to join and start connecting with your loved ones!
                  </p>
                </div>
              </div>

              <div className="pt-4 border-t">
                <Button
                  onClick={() => setShowWelcomeModal(false)}
                  className="w-full bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90 h-10"
                >
                  <Sparkles className="w-4 h-4 mr-2" />
                  Get Started
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

export default Signup;
