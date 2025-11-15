import {
  Heart,
  Send,
  Edit2,
  Trash2,
  MessageSquare,
  Check,
  CheckCheck,
  UserPlus,
  Bell,
} from "lucide-react";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { messagesStorage } from "@/lib/localStorage";
import {
  messagesApi,
  HeartMessage,
  nudgesApi,
  Nudge,
  usersApi,
} from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const Messages = () => {
  const { user, partner, setPartner } = useAuth();
  const navigate = useNavigate();
  const [messages, setMessages] = useState<HeartMessage[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [selectedRecipient, setSelectedRecipient] = useState<string | null>(
    null
  );
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editText, setEditText] = useState("");
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isPartnerSelectOpen, setIsPartnerSelectOpen] = useState(false);
  const [isRecipientSelectOpen, setIsRecipientSelectOpen] = useState(false);
  const [allNudges, setAllNudges] = useState<Nudge[]>([]);
  const [unseenNudges, setUnseenNudges] = useState<Nudge[]>([]);
  const [unseenNudgeCount, setUnseenNudgeCount] = useState(0);
  const [allUsers, setAllUsers] = useState<any[]>([]);

  // Get all users for partner selection
  const getAllUsers = async () => {
    if (!user) return [];
    try {
      const result = await usersApi.getAll(user.id);
      if (result.success && result.data) {
        return result.data.filter((u: any) => u.id !== user.id);
      }
    } catch (error) {
      console.error("Error loading users:", error);
    }
    return [];
  };

  useEffect(() => {
    if (!user) {
      navigate("/signup");
      return;
    }

    // Don't auto-connect - let user choose their partner
    loadMessages();
    // Poll for new messages every 5 seconds
    const interval = setInterval(loadMessages, 5000);

    // Poll for nudges for all users
    loadNudges();
    const nudgeInterval = setInterval(loadNudges, 3000);

    return () => {
      clearInterval(interval);
      clearInterval(nudgeInterval);
    };
  }, [user, partner]);

  const loadNudges = async () => {
    if (!user) return;

    try {
      // Load all nudges received by current user
      const allResult = await nudgesApi.getAll(user.id);
      if (allResult.success && allResult.data) {
        setAllNudges(allResult.data);
      }

      // Load unseen nudges for count
      const unseenResult = await nudgesApi.getAll(user.id, false);
      if (unseenResult.success && unseenResult.data) {
        setUnseenNudges(unseenResult.data);
        setUnseenNudgeCount(unseenResult.data.length);
      }
    } catch (error) {
      // Silently fail - nudges are optional
    }
  };

  const markNudgesAsSeen = async () => {
    if (!user) return;

    try {
      await nudgesApi.markAllAsSeen(user.id);
      // Reload nudges to update seen status
      const allResult = await nudgesApi.getAll(user.id);
      if (allResult.success && allResult.data) {
        setAllNudges(allResult.data);
      }
      const unseenResult = await nudgesApi.getAll(user.id, false);
      if (unseenResult.success && unseenResult.data) {
        setUnseenNudges(unseenResult.data);
        setUnseenNudgeCount(unseenResult.data.length);
      }
      toast.success("Nudges marked as seen");
    } catch (error) {
      toast.error("Failed to mark nudges as seen");
    }
  };

  const loadMessages = async () => {
    if (!user) return;

    // Users see messages they sent or received
    const apiResult = await messagesApi.getAll(user.id);
    if (apiResult.success && apiResult.data) {
      const sorted = apiResult.data.sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
      setMessages(sorted);

      // Mark partner messages as read
      sorted.forEach((msg) => {
        if (partner && msg.senderId === partner.id && msg.status !== "read") {
          messagesApi.update(msg.id, {
            status: "read",
            readAt: new Date().toISOString(),
          });
        }
      });
    } else {
      // Fallback to localStorage
      const localMessages = messagesStorage.getAll();
      const filtered = localMessages.filter(
        (msg: any) =>
          msg.senderId === user.id || (partner && msg.senderId === partner.id)
      );

      const sorted = filtered.sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
      setMessages(sorted);

      // Mark partner messages as read
      sorted.forEach((msg: any) => {
        if (partner && msg.senderId === partner.id && msg.status !== "read") {
          const updated = messagesStorage.update(msg.id, {
            status: "read",
            readAt: new Date().toISOString(),
          });
          if (updated) loadMessages();
        }
      });
    }
  };

  const sendMessage = async () => {
    if (!newMessage.trim() || !user) {
      toast.error("Please enter a message");
      return;
    }

    // Use selected recipient or partner, but require one
    const recipientId = selectedRecipient || partner?.id;

    if (!recipientId) {
      toast.error("Please select a recipient first");
      setIsRecipientSelectOpen(true);
      return;
    }

    const message: Omit<HeartMessage, "id" | "createdAt" | "updatedAt"> & {
      userId: string;
    } = {
      userId: user.id,
      senderId: user.id,
      senderName: user.name,
      recipientId: recipientId,
      message: newMessage.trim(),
      status: "sent",
    };

    // Try API first
    const apiResult = await messagesApi.create(message);
    if (apiResult.success && apiResult.data) {
      toast.success("Message sent!");
      setNewMessage("");
      await loadMessages();

      // Simulate delivery after 1 second
      setTimeout(async () => {
        await messagesApi.update(apiResult.data!.id, { status: "delivered" });
        await loadMessages();
      }, 1000);
    } else {
      // Fallback to localStorage
      const saved = messagesStorage.add(message);
      toast.success("Message sent!");
      setNewMessage("");
      // Keep recipient selected for convenience
      await loadMessages();

      // Simulate delivery after 1 second
      setTimeout(() => {
        const updated = messagesStorage.update(saved.id, {
          status: "delivered",
        });
        if (updated) loadMessages();
      }, 1000);
    }
  };

  const openEditDialog = (message: HeartMessage) => {
    if (message.senderId !== user?.id) return; // Only allow editing own messages
    setEditingId(message.id);
    setEditText(message.message);
    setIsEditOpen(true);
  };

  const saveEdit = async () => {
    if (!editText.trim() || !editingId || !user) return;

    // Try API first
    const apiResult = await messagesApi.update(editingId, {
      message: editText.trim(),
    });
    if (apiResult.success) {
      toast.success("Message updated!");
      setIsEditOpen(false);
      setEditingId(null);
      setEditText("");
      await loadMessages();
    } else {
      // Fallback to localStorage
      const updated = messagesStorage.update(editingId, {
        message: editText.trim(),
      });
      if (updated) {
        toast.success("Message updated!");
        setIsEditOpen(false);
        setEditingId(null);
        setEditText("");
        await loadMessages();
      }
    }
  };

  const deleteMessage = async (id: string) => {
    if (!confirm("Are you sure you want to delete this message?")) return;

    // Try API first
    const apiResult = await messagesApi.delete(id);
    if (apiResult.success) {
      toast.success("Message deleted");
      await loadMessages();
    } else {
      // Fallback to localStorage
      const deleted = messagesStorage.delete(id);
      if (deleted) {
        toast.success("Message deleted");
        await loadMessages();
      }
    }
  };

  const loadAllUsers = async () => {
    if (!user) return;
    try {
      const users = await getAllUsers();
      setAllUsers(users);
      console.log("Loaded users:", users);
    } catch (error) {
      console.error("Error loading users:", error);
      toast.error("Failed to load users");
    }
  };

  useEffect(() => {
    loadAllUsers();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  // Refresh users when dialog opens
  useEffect(() => {
    if (isPartnerSelectOpen && user) {
      loadAllUsers();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isPartnerSelectOpen, user]);

  if (!user) return null;

  // Users see their own messages and partner messages
  const myMessages = messages.filter((m) => m.senderId === user.id);
  const partnerMessages = partner
    ? messages.filter((m) => m.senderId === partner.id)
    : [];

  return (
    <div className="min-h-screen pb-24 overflow-x-hidden">
      {/* Sticky Header */}
      <header className="sticky top-0 z-40 bg-background/95 backdrop-blur-sm border-b border-border/50 pt-6 pb-4">
        <div className="max-w-4xl mx-auto px-4 w-full">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2 min-w-0 flex-1">
              <Heart
                className="w-6 h-6 sm:w-7 sm:h-7 text-primary flex-shrink-0"
                fill="currentColor"
              />
              <h1 className="text-2xl sm:text-3xl font-bold text-foreground truncate">
                Space Messages
              </h1>
            </div>
          </div>
          <div className="flex items-center justify-between">
            <p className="text-xs sm:text-sm text-muted-foreground">
              Send and receive messages from your loved one
            </p>
            {unseenNudgeCount > 0 && (
              <button
                onClick={markNudgesAsSeen}
                className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-primary/10 text-primary border border-primary/20 hover:bg-primary hover:text-primary-foreground hover:border-primary hover:shadow-md hover:scale-105 transition-all text-xs sm:text-sm font-medium"
              >
                <Bell className="w-4 h-4" />
                <span>{unseenNudgeCount} new</span>
              </button>
            )}
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 w-full pt-6">
        {/* Nudges Section - Show all nudges for all users */}
        {allNudges.length > 0 && (
          <div className="mt-4 glass-card rounded-2xl p-4 sm:p-6 card-elevated">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Heart className="w-5 h-5 text-primary" fill="currentColor" />
                <h2 className="text-lg font-semibold text-foreground">
                  Nudges 💝
                </h2>
              </div>
              {unseenNudgeCount > 0 && (
                <button
                  onClick={markNudgesAsSeen}
                  className="text-xs text-primary hover:text-primary hover:underline hover:font-bold transition-all font-medium"
                >
                  Mark all as seen
                </button>
              )}
            </div>
            <div className="space-y-3 max-h-64 overflow-y-auto">
              {allNudges.map((nudge) => {
                const nudgeDate = new Date(nudge.createdAt);
                const isToday =
                  nudgeDate.toDateString() === new Date().toDateString();
                const isUnseen = !nudge.seen;

                return (
                  <div
                    key={nudge.id}
                    className={`flex items-start justify-between gap-3 p-3 rounded-lg transition-colors ${
                      isUnseen
                        ? "bg-primary/10 border border-primary/20"
                        : "bg-muted/50"
                    }`}
                  >
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-semibold text-foreground">
                          {nudge.senderName}
                        </span>
                        {isUnseen && (
                          <span className="w-2 h-2 bg-primary rounded-full animate-pulse"></span>
                        )}
                      </div>
                      <p className="text-xs text-muted-foreground">
                        {isToday
                          ? `Today at ${nudgeDate.toLocaleTimeString("en-US", {
                              hour: "numeric",
                              minute: "2-digit",
                              hour12: true,
                            })}`
                          : nudgeDate.toLocaleDateString("en-US", {
                              month: "short",
                              day: "numeric",
                              year:
                                nudgeDate.getFullYear() !==
                                new Date().getFullYear()
                                  ? "numeric"
                                  : undefined,
                            }) +
                            " at " +
                            nudgeDate.toLocaleTimeString("en-US", {
                              hour: "numeric",
                              minute: "2-digit",
                              hour12: true,
                            })}
                      </p>
                      {nudge.seen && nudge.seenAt && (
                        <p className="text-xs text-muted-foreground/70 mt-1">
                          Seen{" "}
                          {new Date(nudge.seenAt).toLocaleTimeString("en-US", {
                            hour: "numeric",
                            minute: "2-digit",
                            hour12: true,
                          })}
                        </p>
                      )}
                    </div>
                    <Heart
                      className="w-4 h-4 text-primary flex-shrink-0 mt-0.5"
                      fill="currentColor"
                    />
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* User Section */}
        <div className="glass-card rounded-2xl p-4 sm:p-6 mb-6 card-elevated">
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6">
            {/* Current User */}
            <div className="flex items-center gap-3 sm:gap-4 flex-shrink-0">
              <div className="relative flex-shrink-0">
                <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center text-primary-foreground font-bold text-xl sm:text-2xl">
                  {user.name.charAt(0).toUpperCase()}
                </div>
                <div className="absolute -bottom-1 -right-1 w-4 h-4 sm:w-5 sm:h-5 bg-primary rounded-full border-2 border-background"></div>
              </div>
              <div className="min-w-0">
                <h3 className="text-sm sm:text-base font-semibold text-foreground truncate">
                  {user.name}
                </h3>
              </div>
            </div>

            {/* Connection Icon */}
            <div className="flex items-center justify-center flex-shrink-0 px-2 sm:px-4">
              <svg
                width="40"
                height="24"
                viewBox="0 0 40 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                {/* Left circle (user) */}
                <circle cx="8" cy="12" r="6" fill="hsl(var(--primary))" />
                {/* Right circle (partner) */}
                <circle cx="32" cy="12" r="6" fill="hsl(var(--accent))" />
                {/* Connection line */}
                <path
                  d="M14 12L26 12"
                  stroke="hsl(var(--primary))"
                  strokeWidth="2"
                  strokeLinecap="round"
                  opacity="0.7"
                />
                {/* Heart in center */}
                <path
                  d="M18 12C18 13.5 19 14.5 20 15.5C21 14.5 22 13.5 22 12C22 10.5 20.5 9.5 20 9C19.5 9.5 18 10.5 18 12Z"
                  fill="hsl(var(--accent))"
                  opacity="0.8"
                />
              </svg>
            </div>

            {/* Partner/Recipient Selection */}
            <div className="flex items-center gap-3 sm:gap-4 flex-shrink-0">
              <Select
                value={selectedRecipient || partner?.id || ""}
                onValueChange={(value) => {
                  setSelectedRecipient(value);
                  // Set as partner when recipient is selected
                  const selectedUser = allUsers.find(
                    (u: any) => u.id === value
                  );
                  if (selectedUser) {
                    setPartner(value);
                  }
                }}
              >
                <SelectTrigger className="w-[200px] sm:w-[220px] h-14 sm:h-16 px-3">
                  {(() => {
                    const selectedUser = allUsers.find(
                      (u: any) => u.id === (selectedRecipient || partner?.id)
                    );
                    return selectedUser ? (
                      <div className="flex items-center gap-3 w-full">
                        <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-gradient-to-br from-accent to-secondary flex items-center justify-center text-accent-foreground font-bold text-base sm:text-lg flex-shrink-0">
                          {selectedUser.name.charAt(0).toUpperCase()}
                        </div>
                        <span className="font-medium text-sm sm:text-base truncate">
                          {selectedUser.name}
                        </span>
                      </div>
                    ) : (
                      <SelectValue placeholder="Select recipient..." />
                    );
                  })()}
                </SelectTrigger>
                <SelectContent className="min-w-[var(--radix-select-trigger-width)]">
                  {allUsers.length === 0 ? (
                    <div className="py-6 text-center text-sm text-muted-foreground">
                      No users available
                    </div>
                  ) : (
                    allUsers.map((u: any) => (
                      <SelectItem
                        key={u.id}
                        value={u.id}
                        className="cursor-pointer py-3 px-3 focus:bg-accent/50"
                      >
                        <div className="flex items-center gap-3 w-full min-w-0">
                          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-accent to-secondary flex items-center justify-center text-accent-foreground font-bold text-base flex-shrink-0 shadow-sm">
                            {u.name.charAt(0).toUpperCase()}
                          </div>
                          <span className="font-medium text-sm truncate flex-1">
                            {u.name}
                          </span>
                        </div>
                      </SelectItem>
                    ))
                  )}
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        {/* Send Message Section */}
        <div className="glass-card rounded-2xl p-4 sm:p-6 card-elevated mb-6">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 sm:gap-4 mb-6">
            <div className="flex items-center gap-2">
              <MessageSquare className="w-5 h-5 text-primary flex-shrink-0" />
              <h2 className="text-base sm:text-lg font-semibold text-foreground">
                Send a Message
              </h2>
            </div>
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-primary/10 border border-primary/20">
              <div className="w-2 h-2 bg-primary rounded-full animate-pulse flex-shrink-0"></div>
              <span className="text-xs font-medium text-primary">
                Sending as: {user.name}
              </span>
            </div>
          </div>
          <div className="space-y-4">
            <Textarea
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder="Write a message to share with your space..."
              className="min-h-[120px] resize-none"
              onKeyDown={(e) => {
                if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) {
                  sendMessage();
                }
              }}
            />
            <Button
              onClick={sendMessage}
              className="w-full"
              size="lg"
              disabled={!selectedRecipient && !partner}
            >
              <Send className="w-4 h-4 mr-2" />
              Send Message
            </Button>
          </div>
        </div>

        {/* Messages Grid */}
        {partner ? (
          // Show messages in 2-column layout
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* My Messages */}
            <div className="min-w-0">
              <h3 className="text-base sm:text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
                <span className="w-2 h-2 bg-primary rounded-full animate-pulse flex-shrink-0"></span>
                <span className="truncate">
                  {user.name}'s Messages ({myMessages.length})
                </span>
              </h3>
              <div className="space-y-3">
                {myMessages.length === 0 ? (
                  <div className="glass-card rounded-xl p-6 text-center">
                    <p className="text-muted-foreground text-sm">
                      No messages sent yet
                    </p>
                  </div>
                ) : (
                  myMessages.map((message) => {
                    const getStatusIcon = () => {
                      switch (message.status) {
                        case "read":
                          return (
                            <CheckCheck className="w-3.5 h-3.5 text-primary" />
                          );
                        case "delivered":
                          return (
                            <CheckCheck className="w-3.5 h-3.5 text-muted-foreground" />
                          );
                        default:
                          return (
                            <Check className="w-3.5 h-3.5 text-muted-foreground" />
                          );
                      }
                    };

                    const getStatusText = () => {
                      switch (message.status) {
                        case "read":
                          return "Read";
                        case "delivered":
                          return "Delivered";
                        default:
                          return "Sent";
                      }
                    };

                    return (
                      <div
                        key={message.id}
                        className="glass-card rounded-xl p-3 sm:p-4 card-elevated transition-all duration-300 group relative border-l-4 border-primary"
                      >
                        <div className="flex items-start gap-2 mb-2">
                          <span className="w-2 h-2 bg-primary rounded-full mt-1.5 flex-shrink-0"></span>
                          <p className="text-sm sm:text-base text-foreground flex-1 pr-10 sm:pr-12 break-words">
                            {message.message}
                          </p>
                        </div>
                        <div className="flex items-center justify-between text-xs text-muted-foreground ml-4 gap-2">
                          <div className="flex items-center gap-1.5 min-w-0">
                            <span className="font-medium text-primary truncate">
                              {user.name}
                            </span>
                            <span className="text-[10px] flex-shrink-0">•</span>
                            <div className="flex items-center gap-1 flex-shrink-0">
                              {getStatusIcon()}
                              <span className="text-[10px]">
                                {getStatusText()}
                              </span>
                            </div>
                          </div>
                          <span className="flex-shrink-0">
                            {new Date(message.createdAt).toLocaleString(
                              "en-US",
                              {
                                month: "short",
                                day: "numeric",
                                hour: "numeric",
                                minute: "2-digit",
                              }
                            )}
                          </span>
                        </div>
                        {message.readAt && (
                          <div className="text-[10px] text-muted-foreground ml-4 mt-1">
                            Read{" "}
                            {new Date(message.readAt).toLocaleString("en-US", {
                              month: "short",
                              day: "numeric",
                              hour: "numeric",
                              minute: "2-digit",
                            })}
                          </div>
                        )}
                        <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button
                            onClick={() => openEditDialog(message)}
                            className="p-1.5 rounded-lg bg-primary/10 text-primary border border-primary/20 hover:bg-primary hover:text-primary-foreground hover:border-primary hover:shadow-md hover:scale-110 transition-all"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => deleteMessage(message.id)}
                            className="p-1.5 rounded-lg bg-destructive/10 text-destructive border border-destructive/20 hover:bg-destructive hover:text-destructive-foreground hover:border-destructive hover:shadow-md hover:scale-110 transition-all"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>

            {/* Space Member Messages */}
            <div className="min-w-0">
              <h3 className="text-base sm:text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
                <span className="w-2 h-2 bg-accent rounded-full animate-pulse flex-shrink-0"></span>
                <span className="truncate">
                  {partner.name}'s Messages ({partnerMessages.length})
                </span>
              </h3>
              <div className="space-y-3">
                {partnerMessages.length === 0 ? (
                  <div className="glass-card rounded-xl p-6 text-center">
                    <p className="text-muted-foreground text-sm">
                      No messages received yet
                    </p>
                  </div>
                ) : (
                  partnerMessages.map((message) => (
                    <div
                      key={message.id}
                      className="glass-card rounded-xl p-3 sm:p-4 card-elevated transition-all duration-300 bg-accent/5 border-l-4 border-accent"
                    >
                      <div className="flex items-start gap-2 mb-2">
                        <span className="w-2 h-2 bg-accent rounded-full mt-1.5 flex-shrink-0"></span>
                        <p className="text-sm sm:text-base text-foreground flex-1 break-words">
                          {message.message}
                        </p>
                      </div>
                      <div className="flex items-center justify-between text-xs text-muted-foreground ml-4 gap-2">
                        <span className="font-medium text-accent truncate">
                          {partner.name}
                        </span>
                        <span className="flex-shrink-0">
                          {new Date(message.createdAt).toLocaleString("en-US", {
                            month: "short",
                            day: "numeric",
                            hour: "numeric",
                            minute: "2-digit",
                          })}
                        </span>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        ) : (
          <div className="glass-card rounded-2xl p-12 text-center card-elevated">
            <UserPlus className="w-16 h-16 text-muted-foreground mx-auto mb-4 opacity-50" />
            <h3 className="text-xl font-semibold text-foreground mb-2">
              Select a Space Member
            </h3>
            <p className="text-muted-foreground mb-6">
              Choose someone from your space to start sending messages
            </p>
            <Button onClick={() => setIsPartnerSelectOpen(true)}>
              <UserPlus className="w-4 h-4 mr-2" />
              Select Member
            </Button>
          </div>
        )}

        {/* Partner Selection Dialog */}
        <Dialog
          open={isPartnerSelectOpen}
          onOpenChange={setIsPartnerSelectOpen}
        >
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Select Space Member</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 pt-4">
              {allUsers.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-muted-foreground mb-4">
                    No other members in your space
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Share your space code with others to invite them!
                  </p>
                </div>
              ) : (
                <Select
                  onValueChange={(userId) => {
                    setPartner(userId);
                    setSelectedRecipient(userId); // Also set as selected recipient
                    setIsPartnerSelectOpen(false);
                    toast.success("Member selected!");
                  }}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select a space member" />
                  </SelectTrigger>
                  <SelectContent>
                    {allUsers.map((u: any) => (
                      <SelectItem key={u.id} value={u.id}>
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-accent to-secondary flex items-center justify-center text-accent-foreground font-bold text-sm">
                            {u.name.charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <div className="font-medium">{u.name}</div>
                          </div>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            </div>
          </DialogContent>
        </Dialog>

        {/* Edit Dialog */}
        <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Edit Message</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 pt-4">
              <Textarea
                value={editText}
                onChange={(e) => setEditText(e.target.value)}
                className="min-h-[100px] resize-none"
              />
              <div className="flex gap-2">
                <Button onClick={saveEdit} className="flex-1">
                  Save Changes
                </Button>
                <Button
                  variant="outline"
                  onClick={() => {
                    setIsEditOpen(false);
                    setEditingId(null);
                    setEditText("");
                  }}
                >
                  Cancel
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

export default Messages;
