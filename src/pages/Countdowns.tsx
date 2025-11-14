import CountdownCard from "@/components/CountdownCard";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plus, Trash2 } from "lucide-react";
import { useState, useEffect } from "react";
import { toast } from "sonner";

interface Countdown {
  id: string;
  emoji: string;
  title: string;
  targetDate: Date;
}

const EMOJI_OPTIONS = ["❤️", "✈️", "🎓", "🎂", "🌙", "🔔", "🎉", "🏠", "💝", "🌟"];

const Countdowns = () => {
  const [countdowns, setCountdowns] = useState<Countdown[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [selectedEmoji, setSelectedEmoji] = useState("❤️");
  const [title, setTitle] = useState("");
  const [date, setDate] = useState("");

  useEffect(() => {
    const saved = localStorage.getItem("countdowns");
    if (saved) {
      const parsed = JSON.parse(saved);
      setCountdowns(
        parsed.map((c: any) => ({
          ...c,
          targetDate: new Date(c.targetDate),
        }))
      );
    } else {
      // Default countdowns
      const defaults: Countdown[] = [
        { id: "1", emoji: "✈️", title: "Next Visit Home", targetDate: new Date("2025-06-15") },
        { id: "2", emoji: "🎓", title: "Graduation Day", targetDate: new Date("2025-12-20") },
        { id: "3", emoji: "🎂", title: "Mom's Birthday", targetDate: new Date("2025-03-10") },
      ];
      setCountdowns(defaults);
      localStorage.setItem("countdowns", JSON.stringify(defaults));
    }
  }, []);

  const saveCountdowns = (newCountdowns: Countdown[]) => {
    setCountdowns(newCountdowns);
    localStorage.setItem("countdowns", JSON.stringify(newCountdowns));
  };

  const addCountdown = () => {
    if (!title || !date) {
      toast.error("Please fill in all fields");
      return;
    }

    const newCountdown: Countdown = {
      id: Date.now().toString(),
      emoji: selectedEmoji,
      title,
      targetDate: new Date(date),
    };

    saveCountdowns([...countdowns, newCountdown]);
    toast.success("Countdown added!");
    setIsOpen(false);
    setTitle("");
    setDate("");
    setSelectedEmoji("❤️");
  };

  const deleteCountdown = (id: string) => {
    saveCountdowns(countdowns.filter((c) => c.id !== id));
    toast.success("Countdown deleted");
  };

  return (
    <div className="min-h-screen pb-24 pt-6">
      <div className="max-w-2xl mx-auto px-4">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Countdowns</h1>
            <p className="text-sm text-muted-foreground">Track your special moments</p>
          </div>
          
          <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
              <Button className="rounded-full h-12 w-12 p-0 shadow-soft hover:shadow-glow">
                <Plus className="w-5 h-5" />
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle>Add New Countdown</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 pt-4">
                <div>
                  <Label htmlFor="emoji" className="mb-2 block">Choose Emoji</Label>
                  <div className="flex flex-wrap gap-2">
                    {EMOJI_OPTIONS.map((emoji) => (
                      <button
                        key={emoji}
                        onClick={() => setSelectedEmoji(emoji)}
                        className={`text-3xl p-2 rounded-lg transition-all ${
                          selectedEmoji === emoji
                            ? "bg-primary/20 scale-110"
                            : "hover:bg-muted"
                        }`}
                      >
                        {emoji}
                      </button>
                    ))}
                  </div>
                </div>
                
                <div>
                  <Label htmlFor="title">Event Title</Label>
                  <Input
                    id="title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="e.g., Family Reunion"
                    className="mt-2"
                  />
                </div>
                
                <div>
                  <Label htmlFor="date">Target Date</Label>
                  <Input
                    id="date"
                    type="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="mt-2"
                  />
                </div>
                
                <Button onClick={addCountdown} className="w-full">
                  Add Countdown
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        <div className="space-y-4">
          {countdowns.length === 0 ? (
            <div className="text-center py-12 glass-card rounded-2xl">
              <p className="text-muted-foreground">No countdowns yet</p>
              <p className="text-sm text-muted-foreground mt-2">
                Add your first countdown to track special moments
              </p>
            </div>
          ) : (
            countdowns.map((countdown) => (
              <div key={countdown.id} className="relative group">
                <CountdownCard
                  emoji={countdown.emoji}
                  title={countdown.title}
                  targetDate={countdown.targetDate}
                />
                <button
                  onClick={() => deleteCountdown(countdown.id)}
                  className="absolute top-4 right-4 p-2 rounded-lg bg-destructive/10 text-destructive opacity-0 group-hover:opacity-100 transition-opacity hover:bg-destructive/20"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default Countdowns;
