import CountdownCard from "@/components/CountdownCard";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plus, Trash2, Edit2 } from "lucide-react";
import { useState, useEffect, useCallback } from "react";
import { toast } from "sonner";
import { eventsStorage } from "@/lib/localStorage";
import { eventsApi, Event } from "@/lib/api";
import { useDialogTriggers } from "@/components/FloatingActionButton";
import { useAuth } from "@/contexts/AuthContext";

interface Countdown {
  id: string;
  emoji: string;
  title: string;
  targetDate: Date;
  sentiment?: string;
}

const EMOJI_OPTIONS = [
  "❤️",
  "✈️",
  "🎓",
  "🎂",
  "🌙",
  "🔔",
  "🎉",
  "🏠",
  "💝",
  "🌟",
];

const Countdowns = () => {
  const { user } = useAuth();
  const { registerMomentDialog } = useDialogTriggers();
  const [countdowns, setCountdowns] = useState<Countdown[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [selectedEmoji, setSelectedEmoji] = useState("❤️");
  const [customEmoji, setCustomEmoji] = useState("");
  const [useCustomEmoji, setUseCustomEmoji] = useState(false);
  const [title, setTitle] = useState("");
  const [date, setDate] = useState("");
  const [sentiment, setSentiment] = useState("");

  // Register dialog trigger function
  const openDialog = useCallback(() => {
    setIsOpen(true);
  }, []);

  useEffect(() => {
    registerMomentDialog(openDialog);
  }, [registerMomentDialog, openDialog]);

  useEffect(() => {
    loadEvents();
  }, []);

  const loadEvents = async () => {
    if (!user) return;
    // Try API first, fallback to localStorage
    const apiResult = await eventsApi.getAll(user.id);
    if (apiResult.success && apiResult.data) {
      setCountdowns(
        apiResult.data.map((e: any) => ({
          id: e.id,
          emoji: e.emoji,
          title: e.title,
          targetDate: new Date(e.targetDate),
          sentiment: e.sentiment,
        }))
      );
    } else {
      const localEvents = eventsStorage.getAll();
      if (localEvents.length > 0) {
        setCountdowns(
          localEvents.map((e: any) => ({
            id: e.id,
            emoji: e.emoji,
            title: e.title,
            targetDate: new Date(e.targetDate),
            sentiment: e.sentiment,
          }))
        );
      }
    }
  };

  const saveCountdowns = async (newCountdowns: Countdown[]) => {
    setCountdowns(newCountdowns);
    // Save to localStorage as fallback
    const events: Event[] = newCountdowns.map((c) => ({
      id: c.id,
      emoji: c.emoji,
      title: c.title,
      targetDate: c.targetDate.toISOString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }));
    eventsStorage.save(events);
  };

  const openEditDialog = (countdown: Countdown) => {
    setEditingId(countdown.id);
    // Check if emoji is in predefined list
    const isPredefined = EMOJI_OPTIONS.includes(countdown.emoji);
    setUseCustomEmoji(!isPredefined);
    if (isPredefined) {
      setSelectedEmoji(countdown.emoji);
      setCustomEmoji("");
    } else {
      setCustomEmoji(countdown.emoji);
      setSelectedEmoji("❤️");
    }
    setTitle(countdown.title);
    setDate(countdown.targetDate.toISOString().split("T")[0]);
    setSentiment(countdown.sentiment || "");
    setIsOpen(true);
  };

  const resetForm = () => {
    setEditingId(null);
    setTitle("");
    setDate("");
    setSelectedEmoji("❤️");
    setCustomEmoji("");
    setUseCustomEmoji(false);
    setSentiment("");
    setIsOpen(false);
  };

  const saveCountdown = async () => {
    if (!title || !date) {
      toast.error("Please fill in all fields");
      return;
    }

    const finalEmoji = useCustomEmoji ? customEmoji.trim() : selectedEmoji;
    if (!finalEmoji) {
      toast.error("Please select or enter an emoji");
      return;
    }

    const eventData = {
      emoji: finalEmoji,
      title,
      targetDate: new Date(date).toISOString(),
      sentiment: sentiment.trim() || undefined,
    };

    if (editingId) {
      // Update existing
      const updated = countdowns.map((c) =>
        c.id === editingId
          ? {
              ...c,
              emoji: finalEmoji,
              title,
              targetDate: new Date(date),
              sentiment: sentiment.trim() || undefined,
            }
          : c
      );
      await saveCountdowns(updated);

      // Try API update
      await eventsApi.update(editingId, { ...eventData, userId: user.id });

      toast.success("Event updated!");
    } else {
      // Create new
      const newCountdown: Countdown = {
        id: Date.now().toString(),
        emoji: finalEmoji,
        title,
        targetDate: new Date(date),
        sentiment: sentiment.trim() || undefined,
      };
      await saveCountdowns([...countdowns, newCountdown]);

      // Try API create
      await eventsApi.create({ ...eventData, userId: user.id });

      toast.success("Event added!");
    }
    resetForm();
  };

  const deleteCountdown = async (id: string) => {
    await saveCountdowns(countdowns.filter((c) => c.id !== id));

    // Try API delete
    await eventsApi.delete(id, user.id);

    toast.success("Event deleted");
  };

  return (
    <div className="min-h-screen pb-24">
      {/* Sticky Header */}
      <header className="sticky top-0 z-40 bg-background/95 backdrop-blur-sm border-b border-border/50 pt-6 pb-4">
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-foreground">
                Space Moments
              </h1>
              <p className="text-sm text-muted-foreground mt-1">
                Track special moments and events in your space
              </p>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-4 pt-6">
        <Dialog
          open={isOpen}
          onOpenChange={(open) => {
            if (!open) resetForm();
            setIsOpen(open);
          }}
        >
          <DialogContent
            className="sm:max-w-md"
            onInteractOutside={(e) => {
              // Prevent closing when clicking outside if form has data
              if (title || date || customEmoji || selectedEmoji) {
                e.preventDefault();
              }
            }}
          >
            <DialogHeader>
              <DialogTitle>
                {editingId ? "Edit Moment" : "Add New Moment"}
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-4 pt-4">
              <div>
                <Label htmlFor="emoji" className="mb-2 block">
                  Emoji
                </Label>
                <div className="flex items-center gap-2 mb-2">
                  <button
                    type="button"
                    onClick={(e) => {
                      e.preventDefault();
                      setUseCustomEmoji(false);
                    }}
                    className={`px-3 py-1 rounded-lg text-sm transition-all ${
                      !useCustomEmoji
                        ? "bg-primary text-primary-foreground"
                        : "bg-muted text-muted-foreground hover:bg-muted/80"
                    }`}
                  >
                    Choose from list
                  </button>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.preventDefault();
                      setUseCustomEmoji(true);
                    }}
                    className={`px-3 py-1 rounded-lg text-sm transition-all ${
                      useCustomEmoji
                        ? "bg-primary text-primary-foreground"
                        : "bg-muted text-muted-foreground hover:bg-muted/80"
                    }`}
                  >
                    Custom emoji
                  </button>
                </div>
                {!useCustomEmoji ? (
                  <div className="flex flex-wrap gap-2">
                    {EMOJI_OPTIONS.map((emoji) => (
                      <button
                        key={emoji}
                        type="button"
                        onClick={(e) => {
                          e.preventDefault();
                          setSelectedEmoji(emoji);
                        }}
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
                ) : (
                  <Input
                    value={customEmoji}
                    onChange={(e) => setCustomEmoji(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                      }
                    }}
                    placeholder="Enter emoji (e.g., 🎉, 💕, 🌟)"
                    className="text-2xl"
                    maxLength={10}
                  />
                )}
              </div>

              <div>
                <Label htmlFor="title">Moment Title</Label>
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

              <div>
                <Label htmlFor="sentiment">Feeling / Mood (Optional)</Label>
                <Input
                  id="sentiment"
                  value={sentiment}
                  onChange={(e) => setSentiment(e.target.value)}
                  placeholder="e.g., Missing you, Excited, Grateful, etc."
                  className="mt-2"
                />
                <p className="text-xs text-muted-foreground mt-1">
                  Describe the emotional feeling or mood for this moment
                </p>
              </div>

              <Button
                type="button"
                onClick={(e) => {
                  e.preventDefault();
                  saveCountdown();
                }}
                className="w-full"
              >
                {editingId ? "Update Moment" : "Add Moment"}
              </Button>
            </div>
          </DialogContent>
        </Dialog>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {countdowns.length === 0 ? (
            <div className="col-span-2 text-center py-12 glass-card rounded-2xl">
              <p className="text-muted-foreground">
                No moments yet. Add your first moment to get started!
              </p>
              <p className="text-sm text-muted-foreground mt-2">
                Add your first moment to cherish together
              </p>
            </div>
          ) : (
            countdowns.map((countdown) => (
              <div key={countdown.id} className="relative group">
                <CountdownCard
                  emoji={countdown.emoji}
                  title={countdown.title}
                  targetDate={countdown.targetDate}
                  sentiment={countdown.sentiment}
                />
                <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button
                    onClick={() => openEditDialog(countdown)}
                    className="p-2 rounded-lg bg-primary/10 text-primary border border-primary/20 hover:bg-primary hover:text-primary-foreground hover:border-primary hover:shadow-md hover:scale-110 transition-all"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => deleteCountdown(countdown.id)}
                    className="p-2 rounded-lg bg-destructive/10 text-destructive border border-destructive/20 hover:bg-destructive hover:text-destructive-foreground hover:border-destructive hover:shadow-md hover:scale-110 transition-all"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default Countdowns;
