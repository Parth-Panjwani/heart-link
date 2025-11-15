import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Heart,
  Users,
  MessageSquare,
  CheckCircle2,
  ArrowRight,
  ArrowLeft,
} from "lucide-react";
import { Button } from "@/components/ui/button";

const Onboarding = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const navigate = useNavigate();

  // Ensure this component renders even if flag is set (for direct access)
  useEffect(() => {
    // Component is accessible directly via /onboarding route
  }, []);

  const steps = [
    {
      icon: Heart,
      title: "Stay Connected",
      description:
        "Keep your hearts close even when you're miles apart. Share moments, messages, and memories with your loved ones.",
      gradient: "from-primary to-accent",
      illustration: (
        <div className="relative w-full h-64 mb-6 flex items-center justify-center">
          {/* Animated hearts */}
          <Heart
            className="w-24 h-24 text-primary animate-breathe absolute"
            fill="currentColor"
          />
          <Heart
            className="w-16 h-16 text-accent animate-breathe absolute"
            style={{ animationDelay: "0.5s", top: "20%", right: "20%" }}
            fill="currentColor"
          />
          <Heart
            className="w-12 h-12 text-secondary animate-breathe absolute"
            style={{ animationDelay: "1s", bottom: "20%", left: "20%" }}
            fill="currentColor"
          />
          {/* Connection lines */}
          <svg
            className="absolute inset-0 w-full h-full"
            style={{ opacity: 0.3 }}
          >
            <line
              x1="20%"
              y1="30%"
              x2="50%"
              y2="50%"
              stroke="currentColor"
              strokeWidth="2"
              className="text-primary animate-pulse"
            />
            <line
              x1="80%"
              y1="30%"
              x2="50%"
              y2="50%"
              stroke="currentColor"
              strokeWidth="2"
              className="text-accent animate-pulse"
              style={{ animationDelay: "0.5s" }}
            />
            <line
              x1="20%"
              y1="70%"
              x2="50%"
              y2="50%"
              stroke="currentColor"
              strokeWidth="2"
              className="text-secondary animate-pulse"
              style={{ animationDelay: "1s" }}
            />
          </svg>
        </div>
      ),
    },
    {
      icon: Users,
      title: "Create Your Space",
      description:
        "Create a unique space and invite others to join. Everyone in your space can collaborate on shared tasks and stay connected.",
      gradient: "from-accent to-secondary",
      illustration: (
        <div className="relative w-full h-64 mb-6 flex items-center justify-center">
          {/* Animated user circles */}
          <div className="relative">
            <div className="w-20 h-20 rounded-full bg-gradient-to-br from-accent to-secondary flex items-center justify-center text-accent-foreground font-bold text-2xl shadow-lg animate-breathe">
              U
            </div>
            <div
              className="absolute -top-4 -right-4 w-16 h-16 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center text-primary-foreground font-bold text-xl shadow-lg animate-breathe"
              style={{ animationDelay: "0.3s" }}
            >
              U
            </div>
            <div
              className="absolute -bottom-4 -left-4 w-14 h-14 rounded-full bg-gradient-to-br from-secondary to-primary flex items-center justify-center text-secondary-foreground font-bold text-lg shadow-lg animate-breathe"
              style={{ animationDelay: "0.6s" }}
            >
              U
            </div>
            {/* Connection lines */}
            <svg
              className="absolute inset-0 w-full h-full"
              style={{
                width: "120px",
                height: "120px",
                left: "-20px",
                top: "-20px",
              }}
            >
              <path
                d="M 40 40 Q 60 20 80 40"
                stroke="currentColor"
                strokeWidth="2"
                fill="none"
                className="text-accent animate-pulse"
              />
              <path
                d="M 40 40 Q 20 60 40 80"
                stroke="currentColor"
                strokeWidth="2"
                fill="none"
                className="text-primary animate-pulse"
                style={{ animationDelay: "0.3s" }}
              />
              <path
                d="M 80 40 Q 100 60 80 80"
                stroke="currentColor"
                strokeWidth="2"
                fill="none"
                className="text-secondary animate-pulse"
                style={{ animationDelay: "0.6s" }}
              />
            </svg>
          </div>
        </div>
      ),
    },
    {
      icon: MessageSquare,
      title: "Share Heart Messages",
      description:
        "Send heartfelt messages, track important moments, and celebrate special occasions together, no matter the distance.",
      gradient: "from-secondary to-primary",
      illustration: (
        <div className="relative w-full h-64 mb-6 flex items-center justify-center">
          {/* Animated message bubbles */}
          <div className="relative w-full max-w-md">
            <div className="glass-card rounded-2xl p-4 mb-3 transform translate-x-0 animate-slide-in-left">
              <div className="flex items-start gap-3">
                <Heart
                  className="w-5 h-5 text-primary flex-shrink-0 mt-1"
                  fill="currentColor"
                />
                <p className="text-sm text-foreground">
                  Sending love across the miles 💝
                </p>
              </div>
            </div>
            <div
              className="glass-card rounded-2xl p-4 transform translate-x-8 animate-slide-in-right"
              style={{ animationDelay: "0.3s" }}
            >
              <div className="flex items-start gap-3">
                <Heart
                  className="w-5 h-5 text-accent flex-shrink-0 mt-1"
                  fill="currentColor"
                />
                <p className="text-sm text-foreground">
                  Missing you every moment ❤️
                </p>
              </div>
            </div>
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
              <Heart
                className="w-8 h-8 text-primary animate-breathe"
                fill="currentColor"
              />
            </div>
          </div>
        </div>
      ),
    },
    {
      icon: CheckCircle2,
      title: "Collaborate Together",
      description:
        "Work on shared tasks, plan events, and keep track of everything together. Your personal tasks stay private, while shared tasks bring you closer.",
      gradient: "from-primary via-accent to-secondary",
      illustration: (
        <div className="relative w-full h-64 mb-6 flex items-center justify-center">
          {/* Animated checklist */}
          <div className="relative w-full max-w-sm">
            <div className="space-y-3">
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="flex items-center gap-3 glass-card rounded-xl p-3 animate-fade-in"
                  style={{ animationDelay: `${i * 0.2}s` }}
                >
                  <div className="w-6 h-6 rounded-full border-2 border-primary flex items-center justify-center">
                    {i === 1 && (
                      <CheckCircle2
                        className="w-4 h-4 text-primary"
                        fill="currentColor"
                      />
                    )}
                  </div>
                  <div
                    className="flex-1 h-4 bg-muted rounded animate-pulse"
                    style={{ width: `${60 + i * 20}%` }}
                  ></div>
                </div>
              ))}
            </div>
            <div className="absolute -top-4 -right-4">
              <Users
                className="w-12 h-12 text-accent animate-breathe"
                fill="currentColor"
              />
            </div>
          </div>
        </div>
      ),
    },
  ];

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      localStorage.setItem("heartLink_onboarding_seen", "true");
      navigate("/signup");
    }
  };

  const handleSkip = () => {
    localStorage.setItem("heartLink_onboarding_seen", "true");
    navigate("/signup");
  };

  const handlePrev = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const currentStepData = steps[currentStep];
  const Icon = currentStepData.icon;

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-gradient-to-br from-primary/5 via-background to-accent/5">
      <div className="w-full max-w-2xl">
        {/* Progress Dots */}
        <div className="flex justify-center gap-2 mb-8">
          {steps.map((_, index) => (
            <div
              key={index}
              className={`h-2 rounded-full transition-all duration-300 ${
                index === currentStep
                  ? "w-8 bg-primary"
                  : index < currentStep
                  ? "w-2 bg-primary/50"
                  : "w-2 bg-muted"
              }`}
            />
          ))}
        </div>

        {/* Main Content Card */}
        <div className="glass-card rounded-3xl p-8 sm:p-12 card-elevated mb-8 overflow-hidden relative">
          {/* Animated background gradient with pulsing */}
          <div
            className={`absolute inset-0 bg-gradient-to-br ${currentStepData.gradient} opacity-10 animate-pulse`}
          ></div>

          <div className="text-center relative z-10">
            {/* Illustration */}
            {currentStepData.illustration}

            {/* Icon */}
            <div
              className={`inline-flex items-center justify-center w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-gradient-to-br ${currentStepData.gradient} mb-6 animate-breathe shadow-lg`}
            >
              <Icon
                className="w-10 h-10 sm:w-12 sm:h-12 text-primary-foreground"
                fill="currentColor"
              />
            </div>

            {/* Title with dark gradient for readability */}
            <h1
              className="text-3xl sm:text-4xl md:text-5xl font-extrabold mb-4 animate-fade-in bg-gradient-to-r from-slate-800 via-slate-700 to-slate-800 dark:from-slate-100 dark:via-slate-200 dark:to-slate-100 bg-clip-text text-transparent"
              style={{
                textShadow: "0 2px 4px rgba(0,0,0,0.1)",
                WebkitTextStroke: "0.3px currentColor",
              }}
            >
              {currentStepData.title}
            </h1>

            {/* Description with improved readability */}
            <p
              className={`text-base sm:text-lg max-w-md mx-auto leading-relaxed animate-fade-in font-medium ${
                currentStep < 3 ? "text-foreground" : "text-muted-foreground"
              }`}
              style={{
                animationDelay: "0.2s",
                textShadow:
                  currentStep < 3 ? "0 1px 2px rgba(0,0,0,0.1)" : undefined,
              }}
            >
              {currentStepData.description}
            </p>
          </div>
        </div>

        {/* Navigation Buttons */}
        <div className="flex items-center justify-between gap-4">
          {currentStep > 0 && (
            <Button
              variant="ghost"
              onClick={handlePrev}
              className="flex items-center gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              <span className="hidden sm:inline">Previous</span>
            </Button>
          )}
          {currentStep === 0 && <div></div>}

          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              onClick={handleSkip}
              className="text-muted-foreground"
            >
              Skip
            </Button>
            <Button
              onClick={handleNext}
              size="lg"
              className="flex items-center gap-2 min-w-[120px]"
            >
              {currentStep === steps.length - 1 ? (
                <>
                  Get Started
                  <Heart className="w-4 h-4" fill="currentColor" />
                </>
              ) : (
                <>
                  Next
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Onboarding;
