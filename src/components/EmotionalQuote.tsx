import { useState, useEffect } from "react";
import { quotesApi } from "@/lib/api";

const EmotionalQuote = () => {
  const [quotes, setQuotes] = useState<string[]>([]);
  const [currentQuote, setCurrentQuote] = useState(0);
  const [loading, setLoading] = useState(true);

  // Load quotes from API
  useEffect(() => {
    const loadQuotes = async () => {
      try {
        setLoading(true);
        const response = await quotesApi.getAll(8); // Get 8 random quotes
        if (
          response.success &&
          response.data?.quotes &&
          response.data.quotes.length > 0
        ) {
          setQuotes(response.data.quotes);
          // Randomize initial quote
          setCurrentQuote(
            Math.floor(Math.random() * response.data.quotes.length)
          );
        } else {
          // Fallback if API fails
          setQuotes([
            "Even thousands of kilometers apart, our hearts beat as one ❤️",
            "Distance means nothing when someone means everything 💕",
          ]);
        }
      } catch (error) {
        console.error("Failed to load quotes:", error);
        // Fallback quotes
        setQuotes([
          "Even thousands of kilometers apart, our hearts beat as one ❤️",
          "Distance means nothing when someone means everything 💕",
        ]);
      } finally {
        setLoading(false);
      }
    };

    loadQuotes();
  }, []);

  // Rotate quotes and refresh periodically
  useEffect(() => {
    if (quotes.length === 0) return;

    const interval = setInterval(() => {
      // Randomly select next quote (not just sequential)
      setCurrentQuote(Math.floor(Math.random() * quotes.length));

      // Every 5 rotations, refresh quotes from API
      if (Math.random() < 0.2) {
        quotesApi
          .getAll(8)
          .then((response) => {
            if (
              response.success &&
              response.data?.quotes &&
              response.data.quotes.length > 0
            ) {
              setQuotes(response.data.quotes);
              setCurrentQuote(
                Math.floor(Math.random() * response.data.quotes.length)
              );
            }
          })
          .catch(console.error);
      }
    }, 8000);

    return () => clearInterval(interval);
  }, [quotes.length]);

  return (
    <div className="relative overflow-hidden rounded-3xl p-8 sm:p-12 mb-4 sm:mb-6 transition-all duration-500 group bg-white">
      {/* Cute decorative frame - highly visible */}
      <div className="absolute inset-0 rounded-3xl border-3 border-primary/60 pointer-events-none"></div>
      {/* Inner frame accent */}
      <div className="absolute inset-[3px] rounded-[1.25rem] border-2 border-accent/50 pointer-events-none"></div>
      {/* Corner decorations - highly visible */}
      <div className="absolute top-4 left-4 w-8 h-8 border-t-3 border-l-3 border-primary/70 rounded-tl-lg"></div>
      <div className="absolute top-4 right-4 w-8 h-8 border-t-3 border-r-3 border-primary/70 rounded-tr-lg"></div>
      <div className="absolute bottom-4 left-4 w-8 h-8 border-b-3 border-l-3 border-primary/70 rounded-bl-lg"></div>
      <div className="absolute bottom-4 right-4 w-8 h-8 border-b-3 border-r-3 border-primary/70 rounded-br-lg"></div>

      <div className="relative z-10 text-center">
        {/* Quote text - bold and premium with decorative quotes */}
        <div className="relative min-h-[150px] sm:min-h-[180px] md:min-h-[200px] flex items-center justify-center mb-6 px-8 sm:px-12 md:px-16">
          {loading ? (
            <div className="flex items-center gap-2 text-muted-foreground">
              <div className="w-5 h-5 border-2 border-primary/20 border-t-primary/60 rounded-full animate-spin"></div>
              <span className="text-lg">Loading quote...</span>
            </div>
          ) : quotes.length > 0 && quotes[currentQuote] ? (
            <div className="relative w-full">
              {/* Large decorative opening quote */}
              <div
                className="absolute -left-4 sm:-left-6 md:-left-8 -top-4 sm:-top-6 md:-top-8 text-primary/30 dark:text-primary/20"
                style={{
                  fontFamily: "'Playfair Display', 'Georgia', serif",
                  fontSize: "clamp(4rem, 12vw, 8rem)",
                  lineHeight: "1",
                  fontWeight: "700",
                  fontStyle: "italic",
                }}
              >
                "
              </div>

              {/* Quote text */}
              <p
                key={currentQuote}
                className="relative text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold text-foreground leading-relaxed px-8 sm:px-12 md:px-16 animate-fade-in"
                style={{
                  fontFamily: "'Playfair Display', 'Georgia', serif",
                  letterSpacing: "0.01em",
                  fontWeight: "600",
                }}
              >
                {quotes[currentQuote]}
              </p>

              {/* Large decorative closing quote */}
              <div
                className="absolute -right-4 sm:-right-6 md:-right-8 -bottom-4 sm:-bottom-6 md:-bottom-8 text-primary/30 dark:text-primary/20"
                style={{
                  fontFamily: "'Playfair Display', 'Georgia', serif",
                  fontSize: "clamp(4rem, 12vw, 8rem)",
                  lineHeight: "1",
                  fontWeight: "700",
                  fontStyle: "italic",
                }}
              >
                "
              </div>
            </div>
          ) : (
            <div className="relative w-full">
              {/* Large decorative opening quote */}
              <div
                className="absolute -left-4 sm:-left-6 md:-left-8 -top-4 sm:-top-6 md:-top-8 text-primary/30 dark:text-primary/20"
                style={{
                  fontFamily: "'Playfair Display', 'Georgia', serif",
                  fontSize: "clamp(4rem, 12vw, 8rem)",
                  lineHeight: "1",
                  fontWeight: "700",
                  fontStyle: "italic",
                }}
              >
                "
              </div>

              {/* Quote text */}
              <p
                className="relative text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold text-foreground leading-relaxed px-8 sm:px-12 md:px-16"
                style={{
                  fontFamily: "'Playfair Display', 'Georgia', serif",
                  letterSpacing: "0.01em",
                  fontWeight: "600",
                }}
              >
                Even thousands of kilometers apart, our hearts beat as one ❤️
              </p>

              {/* Large decorative closing quote */}
              <div
                className="absolute -right-4 sm:-right-6 md:-right-8 -bottom-4 sm:-bottom-6 md:-bottom-8 text-primary/30 dark:text-primary/20"
                style={{
                  fontFamily: "'Playfair Display', 'Georgia', serif",
                  fontSize: "clamp(4rem, 12vw, 8rem)",
                  lineHeight: "1",
                  fontWeight: "700",
                  fontStyle: "italic",
                }}
              >
                "
              </div>
            </div>
          )}
        </div>

        {/* Minimal decorative element */}
        <div className="flex items-center justify-center gap-3 mb-4">
          <div className="h-px w-12 sm:w-20 bg-gradient-to-r from-transparent via-primary/30 to-primary/50"></div>
          <div className="w-2 h-2 rounded-full bg-primary/40"></div>
          <div className="h-px w-12 sm:w-20 bg-gradient-to-l from-transparent via-accent/30 to-accent/50"></div>
        </div>

        {/* Quote indicator dots - minimal */}
        <div className="flex items-center justify-center gap-2 mt-2">
          {quotes.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentQuote(index)}
              className={`rounded-full transition-all duration-300 ${
                index === currentQuote
                  ? "w-8 h-2 bg-primary"
                  : "w-2 h-2 bg-primary/30 hover:bg-primary/70 hover:scale-125"
              }`}
              aria-label={`Go to quote ${index + 1}`}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default EmotionalQuote;
