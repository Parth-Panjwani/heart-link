// Fallback localStorage utilities when API is not available

import { Event, Journey, HeartMessage } from "./api";

const STORAGE_KEYS = {
  EVENTS: "countdowns",
  JOURNEY: "journey",
  MESSAGES: "heartMessages",
};

// Events
export const eventsStorage = {
  getAll: (): Event[] => {
    const saved = localStorage.getItem(STORAGE_KEYS.EVENTS);
    if (saved) {
      const parsed = JSON.parse(saved);
      return parsed.map((e: any) => ({
        ...e,
        targetDate: e.targetDate,
        createdAt: e.createdAt || new Date().toISOString(),
        updatedAt: e.updatedAt || new Date().toISOString(),
      }));
    }
    return [];
  },
  save: (events: Event[]) => {
    localStorage.setItem(STORAGE_KEYS.EVENTS, JSON.stringify(events));
  },
  add: (event: Omit<Event, "id" | "createdAt" | "updatedAt">): Event => {
    const events = eventsStorage.getAll();
    const newEvent: Event = {
      ...event,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    events.push(newEvent);
    eventsStorage.save(events);
    return newEvent;
  },
  update: (id: string, updates: Partial<Event>): Event | null => {
    const events = eventsStorage.getAll();
    const index = events.findIndex((e) => e.id === id);
    if (index === -1) return null;
    events[index] = {
      ...events[index],
      ...updates,
      updatedAt: new Date().toISOString(),
    };
    eventsStorage.save(events);
    return events[index];
  },
  delete: (id: string): boolean => {
    const events = eventsStorage.getAll();
    const filtered = events.filter((e) => e.id !== id);
    if (filtered.length === events.length) return false;
    eventsStorage.save(filtered);
    return true;
  },
};

// Journey
export const journeyStorage = {
  get: (): Journey => {
    const saved = localStorage.getItem(STORAGE_KEYS.JOURNEY);
    if (saved) {
      return JSON.parse(saved);
    }
    return {
      departureDate: "2024-01-15",
      distance: 4842,
      heartMessage: "Missing you every day ❤️",
    };
  },
  update: (updates: Partial<Journey>): Journey => {
    const current = journeyStorage.get();
    const updated = { ...current, ...updates };
    localStorage.setItem(STORAGE_KEYS.JOURNEY, JSON.stringify(updated));
    return updated;
  },
};

// Messages
export const messagesStorage = {
  getAll: (): HeartMessage[] => {
    const saved = localStorage.getItem(STORAGE_KEYS.MESSAGES);
    if (saved) {
      return JSON.parse(saved);
    }
    return [];
  },
  save: (messages: HeartMessage[]) => {
    localStorage.setItem(STORAGE_KEYS.MESSAGES, JSON.stringify(messages));
  },
  add: (
    message: Omit<HeartMessage, "id" | "createdAt" | "updatedAt">
  ): HeartMessage => {
    const messages = messagesStorage.getAll();
    const newMessage: HeartMessage = {
      ...message,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      status: message.status || "sent",
      senderId: message.senderId || "",
      senderName: message.senderName || "",
    };
    messages.push(newMessage);
    messagesStorage.save(messages);
    return newMessage;
  },
  update: (id: string, updates: Partial<HeartMessage>): HeartMessage | null => {
    const messages = messagesStorage.getAll();
    const index = messages.findIndex((m) => m.id === id);
    if (index === -1) return null;
    messages[index] = {
      ...messages[index],
      ...updates,
      updatedAt: new Date().toISOString(),
    };
    messagesStorage.save(messages);
    return messages[index];
  },
  delete: (id: string): boolean => {
    const messages = messagesStorage.getAll();
    const filtered = messages.filter((m) => m.id !== id);
    if (filtered.length === messages.length) return false;
    messagesStorage.save(filtered);
    return true;
  },
};
