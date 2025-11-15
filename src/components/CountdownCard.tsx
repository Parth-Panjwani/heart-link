import { Calendar } from "lucide-react";

interface CountdownCardProps {
  emoji: string;
  title: string;
  targetDate: Date;
  sentiment?: string;
}

const CountdownCard = ({
  emoji,
  title,
  targetDate,
  sentiment,
}: CountdownCardProps) => {
  const today = new Date();
  const daysLeft = Math.ceil(
    (targetDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24)
  );

  const isUpcoming = daysLeft <= 7 && daysLeft > 0;

  return (
    <div
      className={`glass-card rounded-xl p-3 sm:p-4 card-elevated transition-all duration-300 hover:scale-[1.02] ${
        isUpcoming ? "border-2 border-primary" : ""
      }`}
    >
      <div className="flex items-start gap-2 sm:gap-3">
        <span className="text-2xl sm:text-3xl flex-shrink-0">{emoji}</span>
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2 mb-1">
            <h4 className="text-xs sm:text-sm font-medium text-foreground truncate">
              {title}
            </h4>
            {sentiment && (
              <span className="px-1.5 sm:px-2 py-0.5 rounded-full text-[10px] sm:text-xs font-medium bg-primary/20 text-primary flex-shrink-0 ml-1 max-w-[120px] truncate">
                {sentiment}
              </span>
            )}
          </div>
          <div className="flex items-center gap-1.5 sm:gap-2">
            <Calendar className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-muted-foreground flex-shrink-0" />
            <span className="text-[10px] sm:text-xs text-muted-foreground">
              {targetDate.toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
                year: "numeric",
              })}
            </span>
          </div>
        </div>
      </div>
      <div className="mt-2 sm:mt-3 pt-2 sm:pt-3 border-t border-border">
        <p className="text-xl sm:text-2xl font-bold text-primary">
          {daysLeft > 0 ? daysLeft : 0}
          <span className="text-xs sm:text-sm font-normal text-muted-foreground ml-1 sm:ml-2">
            {daysLeft === 1 ? "day left" : "days left"}
          </span>
        </p>
      </div>
    </div>
  );
};

export default CountdownCard;
