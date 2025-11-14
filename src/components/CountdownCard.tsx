import { Calendar } from "lucide-react";

interface CountdownCardProps {
  emoji: string;
  title: string;
  targetDate: Date;
}

const CountdownCard = ({ emoji, title, targetDate }: CountdownCardProps) => {
  const today = new Date();
  const daysLeft = Math.ceil(
    (targetDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24)
  );

  const isUpcoming = daysLeft <= 7 && daysLeft > 0;

  return (
    <div
      className={`glass-card rounded-xl p-4 shadow-soft transition-all duration-300 hover:scale-105 ${
        isUpcoming ? "animate-gentle-pulse border-2 border-primary" : ""
      }`}
    >
      <div className="flex items-start gap-3">
        <span className="text-3xl">{emoji}</span>
        <div className="flex-1">
          <h4 className="text-sm font-medium text-foreground mb-1">{title}</h4>
          <div className="flex items-center gap-2">
            <Calendar className="w-3 h-3 text-muted-foreground" />
            <span className="text-xs text-muted-foreground">
              {targetDate.toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
                year: "numeric",
              })}
            </span>
          </div>
        </div>
      </div>
      <div className="mt-3 pt-3 border-t border-border">
        <p className="text-2xl font-bold text-primary">
          {daysLeft > 0 ? daysLeft : 0}
          <span className="text-sm font-normal text-muted-foreground ml-2">
            {daysLeft === 1 ? "day left" : "days left"}
          </span>
        </p>
      </div>
    </div>
  );
};

export default CountdownCard;
