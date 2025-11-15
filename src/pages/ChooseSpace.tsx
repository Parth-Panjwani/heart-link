import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Heart,
  Sparkles,
  Users,
  Lock,
  ArrowRight,
  CheckCircle2,
  Mail,
  Phone,
} from "lucide-react";
import { toast } from "sonner";

type ActionType = "create" | "join";

const ChooseSpace = () => {
  const [action, setAction] = useState<ActionType>("create");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [pin, setPin] = useState("");
  const [spaceCode, setSpaceCode] = useState("");
  const [spaceName, setSpaceName] = useState("");
  const [loading, setLoading] = useState(false);
  const { signup, joinSpace, user } = useAuth();
  const navigate = useNavigate();

  // Redirect if user already has a space
  useEffect(() => {
    if (user && user.spaceCode && user.spaceId) {
      navigate("/home");
    }
  }, [user, navigate]);

  const handleCreateSpace = async (e: React.FormEvent) => {
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
    const success = await signup(
      name.trim(),
      email.trim(),
      phone.trim(),
      pin,
      spaceName.trim() || undefined
    );
    if (success) {
      navigate("/home");
    }
    setLoading(false);
  };

  const handleJoinSpace = async (e: React.FormEvent) => {
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

    if (!spaceCode.trim() || spaceCode.length !== 6) {
      toast.error("Space code must be 6 characters");
      return;
    }

    setLoading(true);
    const success = await joinSpace(
      name.trim(),
      email.trim(),
      phone.trim(),
      pin,
      spaceCode.toUpperCase()
    );
    if (success) {
      navigate("/home");
    }
    setLoading(false);
  };

  const handlePinChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, "");
    if (value.length <= 4) {
      setPin(value);
    }
  };

  const handleSpaceCodeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.toUpperCase().replace(/[^A-Z0-9]/g, "");
    if (value.length <= 6) {
      setSpaceCode(value);
    }
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, "");
    setPhone(value);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-gradient-to-br from-primary/5 via-background to-accent/5">
      <div className="w-full max-w-2xl">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-gradient-to-br from-primary via-accent to-secondary mb-6 shadow-lg">
            <Heart
              className="w-10 h-10 sm:w-12 sm:h-12 text-primary-foreground"
              fill="currentColor"
            />
          </div>
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold bg-gradient-to-r from-primary via-accent to-secondary bg-clip-text text-transparent mb-3">
            Choose Your Space
          </h1>
          <p className="text-base sm:text-lg text-muted-foreground">
            Create a new space or join an existing one
          </p>
        </div>

        {/* Action Selector */}
        <div className="glass-card rounded-2xl p-2 mb-6 card-elevated">
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => {
                setAction("create");
                setSpaceCode("");
              }}
              className={`relative flex flex-col items-center gap-2 p-6 rounded-xl transition-all duration-300 ${
                action === "create"
                  ? "bg-gradient-to-br from-accent to-secondary text-primary-foreground shadow-lg scale-105"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
              }`}
            >
              <Sparkles
                className={`w-6 h-6 sm:w-7 sm:h-7 ${
                  action === "create" ? "" : ""
                }`}
                fill={action === "create" ? "currentColor" : "none"}
              />
              <span className="text-sm sm:text-base font-semibold">
                Create Space
              </span>
              {action === "create" && (
                <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-8 h-1 bg-primary-foreground/30 rounded-full"></div>
              )}
            </button>
            <button
              type="button"
              onClick={() => {
                setAction("join");
                setSpaceName("");
              }}
              className={`relative flex flex-col items-center gap-2 p-6 rounded-xl transition-all duration-300 ${
                action === "join"
                  ? "bg-gradient-to-br from-secondary to-primary text-primary-foreground shadow-lg scale-105"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
              }`}
            >
              <Users
                className={`w-6 h-6 sm:w-7 sm:h-7 ${
                  action === "join" ? "" : ""
                }`}
                fill={action === "join" ? "currentColor" : "none"}
              />
              <span className="text-sm sm:text-base font-semibold">
                Join Space
              </span>
              {action === "join" && (
                <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-8 h-1 bg-primary-foreground/30 rounded-full"></div>
              )}
            </button>
          </div>
        </div>

        {/* Form Card */}
        <div className="glass-card rounded-3xl p-6 sm:p-8 md:p-10 card-elevated overflow-hidden relative">
          {/* Animated background gradient */}
          <div
            className={`absolute inset-0 bg-gradient-to-br ${
              action === "create"
                ? "from-accent to-secondary"
                : "from-secondary to-primary"
            } opacity-5`}
          ></div>

          <div className="relative z-10">
            {/* Form Header */}
            <div className="text-center mb-8">
              <div
                className={`inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br ${
                  action === "create"
                    ? "from-accent to-secondary"
                    : "from-secondary to-primary"
                } mb-4 shadow-lg`}
              >
                {action === "create" ? (
                  <Sparkles
                    className="w-8 h-8 text-primary-foreground"
                    fill="currentColor"
                  />
                ) : (
                  <Users
                    className="w-8 h-8 text-primary-foreground"
                    fill="currentColor"
                  />
                )}
              </div>
              <h2 className="text-2xl sm:text-3xl font-bold text-foreground mb-2">
                {action === "create" ? "Create New Space" : "Join Existing Space"}
              </h2>
              <p className="text-sm text-muted-foreground">
                {action === "create"
                  ? "Start your own space and invite others"
                  : "Enter the space code to connect"}
              </p>
            </div>

            {/* Create Space Form */}
            {action === "create" && (
              <form onSubmit={handleCreateSpace} className="space-y-5">
                <div className="space-y-2">
                  <Label htmlFor="create-name" className="text-sm font-semibold">
                    Your Name
                  </Label>
                  <div className="relative">
                    <Heart className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                    <Input
                      id="create-name"
                      type="text"
                      placeholder="Enter your name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="pl-11 h-12 text-base"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="create-email" className="text-sm font-semibold">
                    Email Address
                  </Label>
                  <div className="relative">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                    <Input
                      id="create-email"
                      type="email"
                      placeholder="your.email@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="pl-11 h-12 text-base"
                      required
                    />
                  </div>
                  <p className="text-xs text-muted-foreground flex items-center gap-1">
                    <Mail className="w-3 h-3" />
                    Your email must be unique
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="create-phone" className="text-sm font-semibold">
                    Phone Number
                  </Label>
                  <div className="relative">
                    <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                    <Input
                      id="create-phone"
                      type="tel"
                      inputMode="numeric"
                      placeholder="1234567890"
                      value={phone}
                      onChange={handlePhoneChange}
                      className="pl-11 h-12 text-base"
                      required
                    />
                  </div>
                  <p className="text-xs text-muted-foreground flex items-center gap-1">
                    <Phone className="w-3 h-3" />
                    Enter your phone number
                  </p>
                </div>

                <div className="space-y-2">
                  <Label
                    htmlFor="create-space-name"
                    className="text-sm font-semibold"
                  >
                    Space Name{" "}
                    <span className="text-muted-foreground font-normal">
                      (Optional)
                    </span>
                  </Label>
                  <div className="relative">
                    <Sparkles className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                    <Input
                      id="create-space-name"
                      type="text"
                      placeholder="e.g., Our Family Space"
                      value={spaceName}
                      onChange={(e) => setSpaceName(e.target.value)}
                      className="pl-11 h-12 text-base"
                    />
                  </div>
                  <p className="text-xs text-muted-foreground flex items-center gap-1">
                    <Sparkles className="w-3 h-3" />
                    Give your space a memorable name
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="create-pin" className="text-sm font-semibold">
                    Create 4-Digit PIN
                  </Label>
                  <div className="relative">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                    <Input
                      id="create-pin"
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
                    Choose a secure 4-digit PIN
                  </p>
                </div>

                <Button
                  type="submit"
                  className="w-full h-12 text-base font-semibold"
                  size="lg"
                  disabled={loading || pin.length !== 4 || !name.trim() || !email.trim() || !phone.trim()}
                >
                  {loading ? (
                    "Creating..."
                  ) : (
                    <>
                      Create Space
                      <Sparkles className="w-4 h-4 ml-2" />
                    </>
                  )}
                </Button>
              </form>
            )}

            {/* Join Space Form */}
            {action === "join" && (
              <form onSubmit={handleJoinSpace} className="space-y-5">
                <div className="space-y-2">
                  <Label htmlFor="join-name" className="text-sm font-semibold">
                    Your Name
                  </Label>
                  <div className="relative">
                    <Heart className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                    <Input
                      id="join-name"
                      type="text"
                      placeholder="Enter your name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="pl-11 h-12 text-base"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label
                    htmlFor="join-space-code"
                    className="text-sm font-semibold"
                  >
                    Space Code
                  </Label>
                  <div className="relative">
                    <Users className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                    <Input
                      id="join-space-code"
                      type="text"
                      placeholder="ABC123"
                      value={spaceCode}
                      onChange={handleSpaceCodeChange}
                      className="pl-11 text-center text-lg font-bold tracking-wider uppercase h-12"
                      maxLength={6}
                      required
                    />
                  </div>
                  <p className="text-xs text-muted-foreground flex items-center gap-1">
                    <Users className="w-3 h-3" />
                    Enter the 6-character code shared with you
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="join-pin" className="text-sm font-semibold">
                    Create 4-Digit PIN
                  </Label>
                  <div className="relative">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                    <Input
                      id="join-pin"
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
                    Choose a secure 4-digit PIN
                  </p>
                </div>

                <Button
                  type="submit"
                  className="w-full h-12 text-base font-semibold"
                  size="lg"
                  disabled={
                    loading ||
                    pin.length !== 4 ||
                    !name.trim() ||
                    !email.trim() ||
                    !phone.trim() ||
                    spaceCode.length !== 6
                  }
                >
                  {loading ? (
                    "Joining..."
                  ) : (
                    <>
                      Join Space
                      <CheckCircle2 className="w-4 h-4 ml-2" />
                    </>
                  )}
                </Button>
              </form>
            )}

            {/* Footer */}
            <div className="mt-8 pt-6 border-t border-border/50 space-y-3">
              <p className="text-center text-xs text-muted-foreground">
                By continuing, you agree to keep your heart connected ❤️
              </p>
              <div className="text-center">
                <Link
                  to="/signup"
                  className="text-xs text-muted-foreground hover:text-primary underline transition-colors"
                >
                  Already have an account? Sign In →
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChooseSpace;

