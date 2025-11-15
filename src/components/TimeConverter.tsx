import { ArrowLeftRight, Clock, MapPin } from "lucide-react";
import { useState, useEffect } from "react";
import { type Country } from "@/lib/countries";

interface TimeConverterProps {
  country1?: Country;
  country2?: Country;
  timezone1?: string;
  timezone2?: string;
}

const TimeConverter = ({
  country1,
  country2,
  timezone1,
  timezone2,
}: TimeConverterProps) => {
  const [country1Hour, setCountry1Hour] = useState(12);
  const [country1Minute, setCountry1Minute] = useState(0);
  const [country1Period, setCountry1Period] = useState<"AM" | "PM">("PM");
  const [country2Hour, setCountry2Hour] = useState(1);
  const [country2Minute, setCountry2Minute] = useState(30);
  const [country2Period, setCountry2Period] = useState<"PM" | "AM">("PM");
  const [activeInput, setActiveInput] = useState<"country1" | "country2">(
    "country1"
  );

  const country1Name = country1?.name || "India";
  const country2Name = country2?.name || "Krasnoyarsk";

  // Convert 12-hour to 24-hour
  const to24Hour = (hour: number, period: "AM" | "PM") => {
    if (period === "AM") {
      return hour === 12 ? 0 : hour;
    } else {
      return hour === 12 ? 12 : hour + 12;
    }
  };

  // Convert 24-hour to 12-hour
  const to12Hour = (hour24: number) => {
    if (hour24 === 0) return { hour: 12, period: "AM" as const };
    if (hour24 === 12) return { hour: 12, period: "PM" as const };
    if (hour24 < 12) return { hour: hour24, period: "AM" as const };
    return { hour: hour24 - 12, period: "PM" as const };
  };

  // Calculate timezone difference dynamically
  const getTimezoneOffset = (timezone: string): number => {
    try {
      const now = new Date();
      const utcTime = new Date(
        now.toLocaleString("en-US", { timeZone: "UTC" })
      );
      const tzTime = new Date(
        now.toLocaleString("en-US", { timeZone: timezone })
      );
      return (tzTime.getTime() - utcTime.getTime()) / (1000 * 60 * 60); // hours
    } catch {
      return 0;
    }
  };

  const convertToCountry2 = (
    hour: number,
    minute: number,
    period: "AM" | "PM"
  ) => {
    const hour24 = to24Hour(hour, period);
    const offset1 = timezone1 ? getTimezoneOffset(timezone1) : 5.5; // Default to India
    const offset2 = timezone2 ? getTimezoneOffset(timezone2) : 7; // Default to Krasnoyarsk
    const diffHours = offset2 - offset1;

    const totalMinutes = hour24 * 60 + minute + diffHours * 60;
    let newHour24 = Math.floor(totalMinutes / 60) % 24;
    let newMinute = totalMinutes % 60;

    if (newHour24 < 0) newHour24 += 24;
    if (newMinute < 0) {
      newMinute += 60;
      newHour24 = (newHour24 - 1 + 24) % 24;
    }

    return to12Hour(newHour24);
  };

  const convertToCountry1 = (
    hour: number,
    minute: number,
    period: "AM" | "PM"
  ) => {
    const hour24 = to24Hour(hour, period);
    const offset1 = timezone1 ? getTimezoneOffset(timezone1) : 5.5;
    const offset2 = timezone2 ? getTimezoneOffset(timezone2) : 7;
    const diffHours = offset1 - offset2;

    const totalMinutes = hour24 * 60 + minute + diffHours * 60;
    let newHour24 = Math.floor(totalMinutes / 60) % 24;
    let newMinute = totalMinutes % 60;

    if (newHour24 < 0) newHour24 += 24;
    if (newMinute < 0) {
      newMinute += 60;
      newHour24 = (newHour24 - 1 + 24) % 24;
    }

    return to12Hour(newHour24);
  };

  useEffect(() => {
    if (activeInput === "country1") {
      const converted = convertToCountry2(
        country1Hour,
        country1Minute,
        country1Period
      );
      setCountry2Hour(converted.hour);
      setCountry2Minute(converted.minute);
      setCountry2Period(converted.period);
    }
  }, [
    country1Hour,
    country1Minute,
    country1Period,
    activeInput,
    timezone1,
    timezone2,
  ]);

  useEffect(() => {
    if (activeInput === "country2") {
      const converted = convertToCountry1(
        country2Hour,
        country2Minute,
        country2Period
      );
      setCountry1Hour(converted.hour);
      setCountry1Minute(converted.minute);
      setCountry1Period(converted.period);
    }
  }, [
    country2Hour,
    country2Minute,
    country2Period,
    activeInput,
    timezone1,
    timezone2,
  ]);

  const hours = Array.from({ length: 12 }, (_, i) => i + 1);
  const minutes = Array.from({ length: 60 }, (_, i) => i);

  return (
    <div className="glass-card rounded-2xl p-5 sm:p-7 card-elevated transition-all duration-300">
      <div className="flex items-center gap-2 mb-5 sm:mb-7">
        <Clock className="w-5 h-5 sm:w-6 sm:h-6 text-primary" />
        <h3 className="text-lg sm:text-xl font-semibold text-foreground">
          Time Converter
          <span className="text-xs sm:text-sm text-muted-foreground font-normal ml-2">
            (Between Locations)
          </span>
        </h3>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-5 md:gap-6">
        {/* Country 1 Time */}
        <div
          className={`space-y-3 p-4 sm:p-5 rounded-xl border-2 transition-all cursor-pointer ${
            activeInput === "country1"
              ? "border-primary bg-primary/5"
              : "border-border bg-background/30"
          }`}
          onClick={() => setActiveInput("country1")}
        >
          <div className="flex items-center gap-2 mb-3">
            <MapPin className="w-4 h-4 sm:w-5 sm:h-5 text-secondary" />
            <label className="text-sm sm:text-base font-semibold text-foreground">
              {country1Name}
            </label>
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            <select
              value={country1Hour}
              onChange={(e) => {
                setCountry1Hour(Number(e.target.value));
                setActiveInput("country1");
              }}
              className="flex-1 px-3 sm:px-4 py-3 sm:py-3.5 md:py-4 bg-background border-2 border-border rounded-xl text-foreground text-center text-base sm:text-lg md:text-xl font-bold focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary min-w-0 min-h-[52px] sm:min-h-[56px] md:min-h-[60px] touch-manipulation"
              style={{ fontSize: "clamp(1rem, 4vw, 1.25rem)" }}
            >
              {hours.map((h) => (
                <option
                  key={h}
                  value={h}
                  style={{ fontSize: "1.125rem", padding: "0.5rem" }}
                >
                  {h}
                </option>
              ))}
            </select>

            <span className="text-2xl sm:text-3xl font-bold text-muted-foreground">
              :
            </span>

            <select
              value={country1Minute}
              onChange={(e) => {
                setCountry1Minute(Number(e.target.value));
                setActiveInput("country1");
              }}
              className="flex-1 px-3 sm:px-4 py-3 sm:py-3.5 md:py-4 bg-background border-2 border-border rounded-xl text-foreground text-center text-base sm:text-lg md:text-xl font-bold focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary min-w-0 min-h-[52px] sm:min-h-[56px] md:min-h-[60px] touch-manipulation"
              style={{ fontSize: "clamp(1rem, 4vw, 1.25rem)" }}
            >
              {minutes.map((m) => (
                <option
                  key={m}
                  value={m}
                  style={{ fontSize: "1.125rem", padding: "0.5rem" }}
                >
                  {String(m).padStart(2, "0")}
                </option>
              ))}
            </select>

            <div className="flex flex-col gap-1.5 sm:gap-2">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setCountry1Period("AM");
                  setActiveInput("country1");
                }}
                className={`px-3 sm:px-4 py-2.5 sm:py-3 md:py-3.5 rounded-lg text-sm sm:text-base md:text-lg font-bold transition-all min-h-[48px] sm:min-h-[52px] md:min-h-[56px] touch-manipulation ${
                  country1Period === "AM"
                    ? "bg-primary text-primary-foreground shadow-md hover:bg-primary hover:shadow-lg hover:scale-105"
                    : "bg-muted text-muted-foreground hover:bg-primary/20 hover:text-primary hover:font-semibold hover:scale-105 active:scale-100"
                }`}
              >
                AM
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setCountry1Period("PM");
                  setActiveInput("country1");
                }}
                className={`px-3 sm:px-4 py-2.5 sm:py-3 md:py-3.5 rounded-lg text-sm sm:text-base md:text-lg font-bold transition-all min-h-[48px] sm:min-h-[52px] md:min-h-[56px] touch-manipulation ${
                  country1Period === "PM"
                    ? "bg-primary text-primary-foreground shadow-md hover:bg-primary hover:shadow-lg hover:scale-105"
                    : "bg-muted text-muted-foreground hover:bg-primary/20 hover:text-primary hover:font-semibold hover:scale-105 active:scale-100"
                }`}
              >
                PM
              </button>
            </div>
          </div>
        </div>

        {/* Country 2 Time */}
        <div
          className={`space-y-3 p-4 sm:p-5 rounded-xl border-2 transition-all cursor-pointer ${
            activeInput === "country2"
              ? "border-primary bg-primary/5"
              : "border-border bg-background/30"
          }`}
          onClick={() => setActiveInput("country2")}
        >
          <div className="flex items-center gap-2 mb-3">
            <MapPin className="w-4 h-4 sm:w-5 sm:h-5 text-accent" />
            <label className="text-sm sm:text-base font-semibold text-foreground">
              {country2Name}
            </label>
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            <select
              value={country2Hour}
              onChange={(e) => {
                setCountry2Hour(Number(e.target.value));
                setActiveInput("country2");
              }}
              className="flex-1 px-3 sm:px-4 py-3 sm:py-3.5 md:py-4 bg-background border-2 border-border rounded-xl text-foreground text-center text-base sm:text-lg md:text-xl font-bold focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary min-w-0 min-h-[52px] sm:min-h-[56px] md:min-h-[60px] touch-manipulation"
              style={{ fontSize: "clamp(1rem, 4vw, 1.25rem)" }}
            >
              {hours.map((h) => (
                <option
                  key={h}
                  value={h}
                  style={{ fontSize: "1.125rem", padding: "0.5rem" }}
                >
                  {h}
                </option>
              ))}
            </select>

            <span className="text-2xl sm:text-3xl font-bold text-muted-foreground">
              :
            </span>

            <select
              value={country2Minute}
              onChange={(e) => {
                setCountry2Minute(Number(e.target.value));
                setActiveInput("country2");
              }}
              className="flex-1 px-3 sm:px-4 py-3 sm:py-3.5 md:py-4 bg-background border-2 border-border rounded-xl text-foreground text-center text-base sm:text-lg md:text-xl font-bold focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary min-w-0 min-h-[52px] sm:min-h-[56px] md:min-h-[60px] touch-manipulation"
              style={{ fontSize: "clamp(1rem, 4vw, 1.25rem)" }}
            >
              {minutes.map((m) => (
                <option
                  key={m}
                  value={m}
                  style={{ fontSize: "1.125rem", padding: "0.5rem" }}
                >
                  {String(m).padStart(2, "0")}
                </option>
              ))}
            </select>

            <div className="flex flex-col gap-1.5 sm:gap-2">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setCountry2Period("AM");
                  setActiveInput("country2");
                }}
                className={`px-3 sm:px-4 py-2.5 sm:py-3 md:py-3.5 rounded-lg text-sm sm:text-base md:text-lg font-bold transition-all min-h-[48px] sm:min-h-[52px] md:min-h-[56px] touch-manipulation ${
                  country2Period === "AM"
                    ? "bg-primary text-primary-foreground shadow-md hover:bg-primary hover:shadow-lg hover:scale-105"
                    : "bg-muted text-muted-foreground hover:bg-primary/20 hover:text-primary hover:font-semibold hover:scale-105 active:scale-100"
                }`}
              >
                AM
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setCountry2Period("PM");
                  setActiveInput("country2");
                }}
                className={`px-3 sm:px-4 py-2.5 sm:py-3 md:py-3.5 rounded-lg text-sm sm:text-base md:text-lg font-bold transition-all min-h-[48px] sm:min-h-[52px] md:min-h-[56px] touch-manipulation ${
                  country2Period === "PM"
                    ? "bg-primary text-primary-foreground shadow-md hover:bg-primary hover:shadow-lg hover:scale-105"
                    : "bg-muted text-muted-foreground hover:bg-primary/20 hover:text-primary hover:font-semibold hover:scale-105 active:scale-100"
                }`}
              >
                PM
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-4 sm:mt-5 flex items-center justify-center gap-2">
        <ArrowLeftRight className="w-4 h-4 sm:w-5 sm:h-5 text-muted-foreground" />
        <p className="text-xs sm:text-sm text-muted-foreground text-center italic">
          Click on either time to convert
        </p>
      </div>
    </div>
  );
};

export default TimeConverter;
