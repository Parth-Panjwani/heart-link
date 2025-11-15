import { Heart, Sparkles, Users, Lock, UserPlus, Send } from "lucide-react";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";
import { nudgesApi, usersApi } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const NudgeButton = () => {
  const { user, createSpace, joinSpaceForUser } = useAuth();
  const [isNudging, setIsNudging] = useState(false);
  const [showNudgeModal, setShowNudgeModal] = useState(false);
  const [showInfoModal, setShowInfoModal] = useState(false);
  const [showSpaceModal, setShowSpaceModal] = useState(false);
  const [spaceAction, setSpaceAction] = useState<"create" | "join">("create");
  const [spaceName, setSpaceName] = useState("");
  const [spaceCode, setSpaceCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [nudgeType, setNudgeType] = useState<"all" | "specific">("all");
  const [selectedRecipient, setSelectedRecipient] = useState<string>("");
  const [nudgeMessage, setNudgeMessage] = useState("");
  const [spaceMembers, setSpaceMembers] = useState<any[]>([]);
  const [loadingMembers, setLoadingMembers] = useState(false);

  // Cute default messages
  const defaultMessages = [
    "💝 Thinking of you!",
    "💕 Sending you love!",
    "✨ You're on my mind!",
    "💖 Missing you!",
    "💗 Sending hugs!",
    "💓 You're amazing!",
    "💞 Just wanted to say hi!",
    "💘 Sending positive vibes!",
  ];

  // Load space members when modal opens
  useEffect(() => {
    if (showNudgeModal && user?.spaceId) {
      loadSpaceMembers();
    }
  }, [showNudgeModal, user?.spaceId]);

  const loadSpaceMembers = async () => {
    if (!user?.id) return;
    setLoadingMembers(true);
    try {
      const result = await usersApi.getAll(user.id);
      if (result.success && result.data) {
        // Filter out current user
        const members = result.data.filter((u: any) => u.id !== user.id);
        setSpaceMembers(members);
      }
    } catch (error) {
      console.error("Failed to load space members:", error);
    } finally {
      setLoadingMembers(false);
    }
  };

  const handleNudgeClick = () => {
    if (!user) {
      toast.error("Please log in to send nudges");
      return;
    }

    // If user doesn't have a space, show info modal
    if (!user.spaceCode || !user.spaceId) {
      setShowInfoModal(true);
      return;
    }

    // Otherwise, show nudge modal
    setShowNudgeModal(true);
    // Set random default message
    setNudgeMessage(
      defaultMessages[Math.floor(Math.random() * defaultMessages.length)]
    );
  };

  const sendNudgeToAll = async () => {
    if (!user) return;

    setIsNudging(true);
    try {
      const result = await nudgesApi.createToAll(
        user.id,
        user.name,
        nudgeMessage.trim() || defaultMessages[0]
      );

      if (result.success && result.data) {
        toast.success(`💝 Nudged ${result.data.count} member${result.data.count > 1 ? "s" : ""}!`, {
          description: "They'll see your nudge soon",
        });
        setShowNudgeModal(false);
        setNudgeMessage("");
        setNudgeType("all");
        setSelectedRecipient("");
      } else {
        toast.error("Failed to send nudge");
      }
    } catch (error) {
      toast.error("Failed to send nudge");
    } finally {
      setIsNudging(false);
    }
  };

  const sendNudgeToSpecific = async () => {
    if (!user || !selectedRecipient) {
      toast.error("Please select a recipient");
      return;
    }

    setIsNudging(true);
    try {
      const result = await nudgesApi.create({
        senderId: user.id,
        senderName: user.name,
        recipientId: selectedRecipient,
        message: nudgeMessage.trim() || defaultMessages[0],
      });

      if (result.success) {
        const recipient = spaceMembers.find((m) => m.id === selectedRecipient);
        toast.success(`💝 Nudged ${recipient?.name || "member"}!`, {
          description: "They'll see your nudge soon",
        });
        setShowNudgeModal(false);
        setNudgeMessage("");
        setNudgeType("all");
        setSelectedRecipient("");
      } else {
        toast.error("Failed to send nudge");
      }
    } catch (error) {
      toast.error("Failed to send nudge");
    } finally {
      setIsNudging(false);
    }
  };

  const handleCreateSpace = async () => {
    if (!user) return;

    setLoading(true);
    const success = await createSpace(user.id, spaceName.trim() || undefined);
    setLoading(false);

    if (success) {
      setShowSpaceModal(false);
      setShowInfoModal(false);
      setSpaceName("");
      toast.success("Space created successfully!");
      window.location.reload();
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
      setShowInfoModal(false);
      setSpaceCode("");
      toast.success("Successfully joined space!");
      window.location.reload();
    }
  };

  const handleSpaceCodeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.toUpperCase().replace(/[^A-Z0-9]/g, "");
    if (value.length <= 6) {
      setSpaceCode(value);
    }
  };

  if (!user) {
    return null;
  }

  return (
    <>
      <Button
        onClick={handleNudgeClick}
        disabled={isNudging}
        className="rounded-full h-14 w-14 p-0 bg-primary hover:bg-primary hover:shadow-2xl hover:scale-110 text-primary-foreground shadow-lg transition-all animate-breathe disabled:hover:scale-100 disabled:hover:shadow-lg"
        title="Send a nudge"
        aria-label="Send a nudge"
      >
        <Heart
          className="w-6 h-6"
          fill="currentColor"
          stroke="currentColor"
          strokeWidth={0.5}
        />
      </Button>

      {/* Nudge Modal - Main modal for sending nudges */}
      <Dialog open={showNudgeModal} onOpenChange={setShowNudgeModal}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <div className="flex items-center justify-center mb-4">
              <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
                <Heart className="w-8 h-8 text-primary" fill="currentColor" />
              </div>
            </div>
            <DialogTitle className="text-2xl font-bold text-center">
              Send a Nudge 💝
            </DialogTitle>
            <DialogDescription className="text-center mt-2">
              Let your loved ones know you're thinking of them
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 pt-4">
            {/* Nudge Type Selection */}
            <div className="flex gap-2 p-1 bg-muted/50 rounded-lg">
              <button
                type="button"
                onClick={() => {
                  setNudgeType("all");
                  setSelectedRecipient("");
                }}
                className={`flex-1 py-2 px-4 rounded-md text-sm font-semibold transition-all ${
                  nudgeType === "all"
                    ? "bg-primary text-primary-foreground shadow-md"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                <div className="flex items-center justify-center gap-2">
                  <Users className="w-4 h-4" />
                  Everyone
                </div>
              </button>
              <button
                type="button"
                onClick={() => setNudgeType("specific")}
                className={`flex-1 py-2 px-4 rounded-md text-sm font-semibold transition-all ${
                  nudgeType === "specific"
                    ? "bg-primary text-primary-foreground shadow-md"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                <div className="flex items-center justify-center gap-2">
                  <UserPlus className="w-4 h-4" />
                  Someone Specific
                </div>
              </button>
            </div>

            {/* Recipient Selection - Only show if "specific" */}
            {nudgeType === "specific" && (
              <div className="space-y-2">
                <Label className="text-sm font-semibold">Select Recipient</Label>
                {loadingMembers ? (
                  <div className="flex items-center justify-center py-4">
                    <div className="w-5 h-5 border-2 border-primary/20 border-t-primary/60 rounded-full animate-spin"></div>
                    <span className="ml-2 text-sm text-muted-foreground">Loading members...</span>
                  </div>
                ) : spaceMembers.length === 0 ? (
                  <p className="text-sm text-muted-foreground text-center py-4">
                    No other members in your space
                  </p>
                ) : (
                  <Select value={selectedRecipient} onValueChange={setSelectedRecipient}>
                    <SelectTrigger>
                      <SelectValue placeholder="Choose a member..." />
                    </SelectTrigger>
                    <SelectContent>
                      {spaceMembers.map((member) => (
                        <SelectItem key={member.id} value={member.id}>
                          <div className="flex items-center gap-2">
                            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center text-primary-foreground font-bold text-sm">
                              {member.name.charAt(0).toUpperCase()}
                            </div>
                            <span>{member.name}</span>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              </div>
            )}

            {/* Message Input */}
            <div className="space-y-2">
              <Label className="text-sm font-semibold">
                Your Message{" "}
                <span className="text-muted-foreground font-normal text-xs">
                  (Optional)
                </span>
              </Label>
              <Textarea
                placeholder="💝 Thinking of you!"
                value={nudgeMessage}
                onChange={(e) => setNudgeMessage(e.target.value)}
                className="min-h-[80px] resize-none"
                maxLength={100}
              />
              <div className="flex items-center gap-2 flex-wrap">
                {defaultMessages.slice(0, 4).map((msg, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setNudgeMessage(msg)}
                    className="text-xs px-2 py-1 rounded-md bg-muted hover:bg-primary/10 text-muted-foreground hover:text-primary transition-colors"
                  >
                    {msg}
                  </button>
                ))}
              </div>
            </div>

            {/* Send Button */}
            <Button
              onClick={nudgeType === "all" ? sendNudgeToAll : sendNudgeToSpecific}
              className="w-full bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90 h-10"
              disabled={
                isNudging ||
                (nudgeType === "specific" && !selectedRecipient) ||
                loadingMembers
              }
            >
              {isNudging ? (
                "Sending..."
              ) : (
                <>
                  <Send className="w-4 h-4 mr-2" />
                  {nudgeType === "all"
                    ? `Send to All (${spaceMembers.length} member${spaceMembers.length !== 1 ? "s" : ""})`
                    : "Send Nudge"}
                </>
              )}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Info Modal - Explains nudges and prompts to create/join space */}
      <Dialog open={showInfoModal} onOpenChange={setShowInfoModal}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <div className="flex items-center justify-center mb-4">
              <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
                <Heart className="w-8 h-8 text-primary" fill="currentColor" />
              </div>
            </div>
            <DialogTitle className="text-2xl font-bold text-center">
              What are Nudges? 💝
            </DialogTitle>
            <DialogDescription className="text-center mt-2">
              A gentle way to let your loved ones know you're thinking of them
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 pt-4">
            <div className="space-y-3">
              <div className="flex items-start gap-3 p-3 rounded-lg bg-primary/5">
                <Heart className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                <div>
                  <p className="font-semibold text-sm mb-1">Send a Heart Nudge</p>
                  <p className="text-sm text-muted-foreground">
                    Tap the heart button to send a gentle nudge to your partner or family member. They'll receive a notification that you're thinking of them!
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-3 rounded-lg bg-accent/5">
                <Sparkles className="w-5 h-5 text-accent mt-0.5 flex-shrink-0" />
                <div>
                  <p className="font-semibold text-sm mb-1">Perfect for Long Distance</p>
                  <p className="text-sm text-muted-foreground">
                    When you're miles apart, a simple nudge can bridge the distance and bring a smile to their face.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-3 rounded-lg bg-secondary/5">
                <Users className="w-5 h-5 text-secondary mt-0.5 flex-shrink-0" />
                <div>
                  <p className="font-semibold text-sm mb-1">Connect with Your Space</p>
                  <p className="text-sm text-muted-foreground">
                    To start sending nudges, create a space or join an existing one to connect with your family and partner.
                  </p>
                </div>
              </div>
            </div>

            <div className="pt-4 border-t">
              <p className="text-sm font-semibold text-center mb-4 text-foreground">
                Ready to start nudging? Create or join a space!
              </p>
              <div className="flex flex-col sm:flex-row gap-2">
                <Button
                  onClick={() => {
                    setSpaceAction("create");
                    setShowSpaceModal(true);
                  }}
                  className="flex-1 bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90 h-10"
                >
                  <Sparkles className="w-4 h-4 mr-2" />
                  Create Space
                </Button>
                <Button
                  onClick={() => {
                    setSpaceAction("join");
                    setShowSpaceModal(true);
                  }}
                  variant="outline"
                  className="flex-1 border-primary/50 hover:bg-primary/10 h-10"
                >
                  <Users className="w-4 h-4 mr-2" />
                  Join Space
                </Button>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>

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
                  <Label htmlFor="space-name" className="text-sm font-semibold">
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
                  <Label htmlFor="space-code" className="text-sm font-semibold">
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
    </>
  );
};

export default NudgeButton;
