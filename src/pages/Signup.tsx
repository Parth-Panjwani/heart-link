import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Lock,
  User,
  Mail,
  Phone,
  Sparkles,
  ArrowRight,
  LogIn,
  Users,
  X,
} from "lucide-react";
import { toast } from "sonner";

const Signup = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [pin, setPin] = useState("");
  const [loading, setLoading] = useState(false);
  const [showSpaceModal, setShowSpaceModal] = useState(false);
  const [spaceAction, setSpaceAction] = useState<"create" | "join">("create");
  const [spaceName, setSpaceName] = useState("");
  const [spaceCode, setSpaceCode] = useState("");
  const [showLogin, setShowLogin] = useState(false);
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPin, setLoginPin] = useState("");
  const [loginName, setLoginName] = useState("");
  const { signup, createSpace, joinSpaceForUser, login, user } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  // Show space modal if user is logged in but doesn't have a space
  useEffect(() => {
    if (user && !user.spaceCode && !user.spaceId) {
      setShowSpaceModal(true);
      // If spaceCode is in URL, pre-fill it and switch to join mode
      const urlSpaceCode = searchParams.get("spaceCode");
      if (urlSpaceCode) {
        setSpaceCode(urlSpaceCode.toUpperCase());
        setSpaceAction("join");
      }
    }
  }, [user, searchParams]);

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
    const success = await signup(name.trim(), email.trim(), phone.trim(), pin);
    setLoading(false);

    if (success) {
      // Show modal to choose space action
      setShowSpaceModal(true);
    }
  };

  const handleCreateSpace = async () => {
    if (!user) return;

    setLoading(true);
    const success = await createSpace(user.id, spaceName.trim() || undefined);
    setLoading(false);

    if (success) {
      setShowSpaceModal(false);
      navigate("/home");
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
      const userData = JSON.parse(
        localStorage.getItem("heartLink_currentUser") || "{}"
      );
      if (!userData.spaceCode || !userData.spaceId) {
        setShowSpaceModal(true);
      } else {
        navigate("/home");
      }
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
          <div className="inline-flex items-center justify-center w-16 h-16 mb-4 shadow-lg">
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

                <Button
                  type="submit"
                  className="w-full h-10 text-sm font-semibold mt-4"
                  size="lg"
                  disabled={
                    loading ||
                    pin.length !== 4 ||
                    !name.trim() ||
                    !email.trim() ||
                    !phone.trim()
                  }
                >
                  {loading ? (
                    "Creating Account..."
                  ) : (
                    <>
                      Create Account
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
                    <Label
                      htmlFor="space-name"
                      className="text-sm font-semibold"
                    >
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
                    <Label
                      htmlFor="space-code"
                      className="text-sm font-semibold"
                    >
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
    </div>
  );
};

export default Signup;
