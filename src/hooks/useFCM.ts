import { useState, useEffect } from "react";
import {
  requestNotificationPermission,
  onMessageListener,
} from "@/lib/firebase";
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";
import { nudgesApi } from "@/lib/api";

// API endpoint to update FCM token
const updateFCMToken = async (userId: string, token: string, name?: string) => {
  const API_BASE_URL =
    import.meta.env.VITE_API_URL || "http://localhost:3001/api";
  try {
    const response = await fetch(`${API_BASE_URL}/users/${userId}/fcm-token`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        fcmToken: token,
        name: name || "",
      }),
    });
    return response.ok;
  } catch (error) {
    console.error("Error updating FCM token:", error);
    return false;
  }
};

export const useFCM = () => {
  const { user } = useAuth();
  const [fcmToken, setFcmToken] = useState<string | null>(null);
  const [isPermissionGranted, setIsPermissionGranted] = useState(false);

  useEffect(() => {
    if (!user) return;

    const initializeFCM = async () => {
      // Check if notifications are supported
      if (!("Notification" in window)) {
        console.warn("This browser does not support notifications");
        return;
      }

      // Register service worker first (required for FCM)
      if ("serviceWorker" in navigator) {
        try {
          const registration = await navigator.serviceWorker.register(
            "/firebase-messaging-sw.js",
            {
              scope: "/",
            }
          );
          console.log("Service Worker registered:", registration);

          // Wait for service worker to be ready
          await navigator.serviceWorker.ready;
          console.log("Service Worker is ready");
        } catch (error) {
          console.warn("Service Worker registration failed:", error);
        }
      }

      // Check current permission
      if (Notification.permission === "granted") {
        setIsPermissionGranted(true);
        const token = await requestNotificationPermission();
        if (token) {
          setFcmToken(token);
          // Update token in backend
          await updateFCMToken(user.id, token, undefined, user.name);
        }
      } else if (Notification.permission === "default") {
        // Permission not yet requested
        // Will be requested when user clicks a button
      }
    };

    initializeFCM();

    // Listen for foreground messages
    onMessageListener()
      .then((payload: any) => {
        if (payload) {
          const notificationTitle =
            payload.notification?.title || "New Notification";
          const notificationOptions = {
            body: payload.notification?.body || "",
            icon: payload.notification?.icon || "/heart-icon.png",
            badge: "/heart-icon.png",
            tag: payload.data?.type || "notification",
            requireInteraction: true,
          };

          // Show toast notification
          toast.info(notificationTitle, {
            description: notificationOptions.body,
            duration: 5000,
          });

          // Show browser notification if permission granted
          if (Notification.permission === "granted") {
            new Notification(notificationTitle, notificationOptions);
          }
        }
      })
      .catch((err) => {
        console.error("Error in onMessageListener:", err);
      });
  }, [user]);

  const requestPermission = async () => {
    if (!("Notification" in window)) {
      toast.error("Your browser does not support notifications");
      return false;
    }

    try {
      const permission = await Notification.requestPermission();
      if (permission === "granted") {
        setIsPermissionGranted(true);
        const token = await requestNotificationPermission();
        if (token && user) {
          setFcmToken(token);
          await updateFCMToken(user.id, token, user.name);
          toast.success("Notifications enabled!");
          return true;
        }
      } else {
        toast.error("Notification permission denied");
        return false;
      }
    } catch (error) {
      console.error("Error requesting notification permission:", error);
      toast.error("Failed to enable notifications");
      return false;
    }
    return false;
  };

  return {
    fcmToken,
    isPermissionGranted,
    requestPermission,
  };
};
