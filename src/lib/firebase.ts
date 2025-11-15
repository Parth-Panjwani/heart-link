// Firebase configuration and initialization
import { initializeApp, getApps, FirebaseApp } from "firebase/app";
import {
  getMessaging,
  getToken,
  onMessage,
  Messaging,
} from "firebase/messaging";

const firebaseConfig = {
  apiKey: "AIzaSyCxpCzAp8BHkaMMae2mYcRkhwAv_tM7MR0",
  authDomain: "nidhi-russia.firebaseapp.com",
  projectId: "nidhi-russia",
  storageBucket: "nidhi-russia.firebasestorage.app",
  messagingSenderId: "752136495650",
  appId: "1:752136495650:web:598937c197d69f8bff207b",
  measurementId: "G-G7PB3F9G76",
};

// Initialize Firebase
let app: FirebaseApp;
let messaging: Messaging | null = null;

if (typeof window !== "undefined") {
  if (getApps().length === 0) {
    app = initializeApp(firebaseConfig);
  } else {
    app = getApps()[0];
  }

  // Initialize Messaging
  try {
    messaging = getMessaging(app);
  } catch (error) {
    console.warn("Firebase Messaging initialization failed:", error);
  }
}

// Register service worker for FCM
export const registerServiceWorker =
  async (): Promise<ServiceWorkerRegistration | null> => {
    if (!("serviceWorker" in navigator)) {
      console.warn("Service Worker is not supported");
      return null;
    }

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

      return registration;
    } catch (error) {
      console.error("Service Worker registration failed:", error);
      return null;
    }
  };

// Request notification permission and get FCM token
export const requestNotificationPermission = async (): Promise<
  string | null
> => {
  if (!messaging) {
    console.warn("Firebase Messaging is not available");
    return null;
  }

  try {
    // First, ensure service worker is registered and ready
    const registration = await registerServiceWorker();
    if (!registration) {
      console.warn("Service Worker not available, cannot get FCM token");
      return null;
    }

    // Wait a bit for service worker to be fully active
    if (registration.active) {
      await new Promise((resolve) => setTimeout(resolve, 500));
    }

    const permission = await Notification.requestPermission();
    if (permission === "granted") {
      const vapidKey =
        "BOlM8ZgCCNN8fNDG3tA2SEjELHI5lgo14CG0m5oX2RxMBZ-IDVO4FXeGT1Xb1SkBiWZ6zjz7UndVnu85faTPiGA";
      const token = await getToken(messaging, {
        vapidKey,
        serviceWorkerRegistration: registration,
      });
      return token;
    } else {
      console.warn("Notification permission denied");
      return null;
    }
  } catch (error) {
    console.error("Error getting FCM token:", error);
    return null;
  }
};

// Listen for foreground messages
export const onMessageListener = () => {
  if (!messaging) {
    return new Promise(() => {});
  }

  return new Promise((resolve) => {
    onMessage(messaging, (payload) => {
      resolve(payload);
    });
  });
};

export { app, messaging };
