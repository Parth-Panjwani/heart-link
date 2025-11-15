import { Heart } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";
import { nudgesApi } from "@/lib/api";
import { Button } from "@/components/ui/button";

const NudgeButton = () => {
  const { user, partner } = useAuth();
  const [isNudging, setIsNudging] = useState(false);

  // Get all users
  const getAllUsers = () => {
    const stored = localStorage.getItem("heartLink_users");
    return stored ? JSON.parse(stored) : [];
  };

  // Get recipient ID - if Nidhi, send to partner or first other user; otherwise send to Nidhi
  const getRecipientId = () => {
    if (!user) return null;

    if (user.email === "nidhi@test.com") {
      // Nidhi sends to partner or first other user
      if (partner) {
        return partner.id;
      }
      const allUsers = getAllUsers();
      const otherUser = allUsers.find((u: any) => u.email !== "nidhi@test.com");
      return otherUser?.id || null;
    } else {
      // Other users send to Nidhi
      const allUsers = getAllUsers();
      const nidhi = allUsers.find((u: any) => u.email === "nidhi@test.com");
      return nidhi?.id || null;
    }
  };

  // Get recipient name for toast message
  const getRecipientName = () => {
    if (!user) return "";

    if (user.email === "nidhi@test.com") {
      return partner?.name || "your loved one";
    } else {
      return "Nidhi";
    }
  };

  const sendNudge = async () => {
    if (!user) {
      toast.error("Please log in to send nudges");
      return;
    }

    const recipientId = getRecipientId();
    if (!recipientId) {
      toast.error("Recipient not found");
      return;
    }

    // Don't allow nudging yourself
    if (recipientId === user.id) {
      toast.error("You cannot nudge yourself!");
      return;
    }

    setIsNudging(true);

    try {
      const result = await nudgesApi.create({
        senderId: user.id,
        senderName: user.name,
        recipientId: recipientId,
      });

      if (result.success) {
        const recipientName = getRecipientName();
        toast.success(`💝 Nudged ${recipientName}!`, {
          description: "They'll see your nudge soon",
        });
      } else {
        toast.error("Failed to send nudge");
      }
    } catch (error) {
      toast.error("Failed to send nudge");
    } finally {
      setIsNudging(false);
    }
  };

  if (!user) {
    return null;
  }

  const recipientName = getRecipientName();
  const buttonTitle =
    user.email === "nidhi@test.com" ? `Nudge ${recipientName}` : "Nudge Nidhi";

  return (
    <Button
      onClick={sendNudge}
      disabled={isNudging}
      className="rounded-full h-14 w-14 p-0 bg-primary hover:bg-primary hover:shadow-2xl hover:scale-110 text-primary-foreground shadow-lg transition-all animate-breathe disabled:hover:scale-100 disabled:hover:shadow-lg"
      title={buttonTitle}
      aria-label={buttonTitle}
    >
      <Heart
        className="w-6 h-6"
        fill="currentColor"
        stroke="currentColor"
        strokeWidth={0.5}
      />
    </Button>
  );
};

export default NudgeButton;
