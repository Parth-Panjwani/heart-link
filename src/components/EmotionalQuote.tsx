import { Heart } from "lucide-react";

const EmotionalQuote = () => {
  return (
    <div className="relative overflow-hidden rounded-2xl p-6 mb-6">
      <div className="absolute inset-0 gradient-warm opacity-20 animate-breathe"></div>
      <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-accent/10 backdrop-blur-sm"></div>
      
      <div className="relative z-10 text-center">
        <Heart className="w-8 h-8 text-primary mx-auto mb-3 animate-gentle-pulse" />
        <p className="text-lg font-medium text-foreground leading-relaxed italic">
          "Even far apart, our moments stay connected."
        </p>
        <div className="mt-3 flex items-center justify-center gap-2">
          <div className="h-px w-12 bg-gradient-to-r from-transparent to-primary/50"></div>
          <Heart className="w-3 h-3 text-primary/50" fill="currentColor" />
          <div className="h-px w-12 bg-gradient-to-l from-transparent to-primary/50"></div>
        </div>
      </div>
    </div>
  );
};

export default EmotionalQuote;
