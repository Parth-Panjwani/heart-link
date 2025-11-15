// API utility functions for MongoDB backend

// For Vercel deployment, use relative path if VITE_API_URL is not set
// This allows the frontend to use the same domain for API calls
const API_BASE_URL =
  import.meta.env.VITE_API_URL ||
  (typeof window !== "undefined" ? "/api" : "http://localhost:3001/api");

interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}

async function apiRequest<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<ApiResponse<T>> {
  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      headers: {
        "Content-Type": "application/json",
        ...options.headers,
      },
      ...options,
    });

    let data;
    const text = await response.text();
    try {
      if (!text) {
        data = {};
      } else {
        data = JSON.parse(text);
      }
    } catch (parseError) {
      return {
        success: false,
        error: `Request failed with status ${response.status}: ${
          text || "Unknown error"
        }`,
      };
    }

    if (!response.ok) {
      return {
        success: false,
        error:
          data.error ||
          data.message ||
          `Request failed with status ${response.status}`,
      };
    }

    return { success: true, data };
  } catch (error) {
    console.error("API Request Error:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Network error",
    };
  }
}

// Countdown/Event APIs
export const eventsApi = {
  getAll: (userId: string) => apiRequest<Event[]>(`/events?userId=${userId}`),
  getById: (id: string) => apiRequest<Event>(`/events/${id}`),
  create: (
    event: Omit<Event, "id" | "createdAt" | "updatedAt"> & { userId: string }
  ) =>
    apiRequest<Event>("/events", {
      method: "POST",
      body: JSON.stringify(event),
    }),
  update: (id: string, event: Partial<Event> & { userId: string }) =>
    apiRequest<Event>(`/events/${id}`, {
      method: "PUT",
      body: JSON.stringify(event),
    }),
  delete: (id: string, userId: string) =>
    apiRequest<void>(`/events/${id}?userId=${userId}`, {
      method: "DELETE",
    }),
};

// Journey APIs
export const journeyApi = {
  get: () => apiRequest<Journey>("/journey"),
  update: (journey: Partial<Journey>) =>
    apiRequest<Journey>("/journey", {
      method: "PUT",
      body: JSON.stringify(journey),
    }),
};

// Heart Messages APIs
export const messagesApi = {
  getAll: (userId: string) =>
    apiRequest<HeartMessage[]>(`/messages?userId=${userId}`),
  getById: (id: string) => apiRequest<HeartMessage>(`/messages/${id}`),
  create: (
    message: Omit<HeartMessage, "id" | "createdAt" | "updatedAt"> & {
      recipientId?: string;
    }
  ) =>
    apiRequest<HeartMessage>("/messages", {
      method: "POST",
      body: JSON.stringify(message),
    }),
  update: (id: string, message: Partial<HeartMessage>) =>
    apiRequest<HeartMessage>(`/messages/${id}`, {
      method: "PUT",
      body: JSON.stringify(message),
    }),
  delete: (id: string) =>
    apiRequest<void>(`/messages/${id}`, {
      method: "DELETE",
    }),
};

// Todos APIs
export const todosApi = {
  getAll: (userId: string) => apiRequest<Todo[]>(`/todos?userId=${userId}`),
  getById: (id: string) => apiRequest<Todo>(`/todos/${id}`),
  create: (
    todo: Omit<Todo, "id" | "createdAt" | "updatedAt"> & { userId: string }
  ) =>
    apiRequest<Todo>("/todos", {
      method: "POST",
      body: JSON.stringify(todo),
    }),
  update: (id: string, todo: Partial<Todo> & { userId: string }) =>
    apiRequest<Todo>(`/todos/${id}`, {
      method: "PUT",
      body: JSON.stringify(todo),
    }),
  delete: (id: string, userId: string) =>
    apiRequest<void>(`/todos/${id}?userId=${userId}`, {
      method: "DELETE",
    }),
};

// Types
export interface Event {
  id: string;
  userId?: string; // User who owns this event
  emoji: string;
  title: string;
  targetDate: string;
  sentiment?: string; // Custom sentiment text (no enum restriction)
  createdAt: string;
  updatedAt: string;
}

export interface Journey {
  departureDate: string;
  distance: number;
  heartMessage: string;
}

export interface HeartMessage {
  id: string;
  senderId: string; // User ID instead of 'local' | 'remote'
  senderName: string;
  message: string;
  createdAt: string;
  updatedAt: string;
  status?: "sent" | "delivered" | "read";
  readAt?: string;
}

export interface Todo {
  id: string;
  userId?: string; // User who owns this todo
  spaceId?: string; // Space ID if shared todo
  text: string;
  completed: boolean;
  createdAt: string;
  updatedAt: string;
  dueDate?: string;
  priority?: "low" | "medium" | "high";
  category?: string;
  notes?: string;
  isShared?: boolean; // Whether this is a shared todo
}

export interface Nudge {
  id: string;
  senderId: string;
  senderName: string;
  recipientId: string;
  seen: boolean;
  seenAt?: string;
  createdAt: string;
}

// Nudges APIs
export const nudgesApi = {
  getAll: (userId?: string, seen?: boolean) => {
    const params = new URLSearchParams();
    if (userId) params.append("userId", userId);
    if (seen !== undefined) params.append("seen", seen.toString());
    return apiRequest<Nudge[]>(`/nudges?${params.toString()}`);
  },
  getUnseenCount: (userId: string) =>
    apiRequest<{ count: number }>(`/nudges/unseen-count?userId=${userId}`),
  create: (nudge: Omit<Nudge, "id" | "seen" | "seenAt" | "createdAt">) =>
    apiRequest<Nudge>("/nudges", {
      method: "POST",
      body: JSON.stringify(nudge),
    }),
  markAsSeen: (id: string) =>
    apiRequest<Nudge>(`/nudges/${id}/seen`, {
      method: "PUT",
    }),
  markAllAsSeen: (userId: string) =>
    apiRequest<{ message: string }>("/nudges/mark-all-seen", {
      method: "PUT",
      body: JSON.stringify({ userId }),
    }),
  delete: (id: string) =>
    apiRequest<void>(`/nudges/${id}`, {
      method: "DELETE",
    }),
};

// User APIs
export interface User {
  id: string;
  name: string;
  email?: string;
  phone?: string;
  spaceCode?: string;
  spaceId?: string;
  spaceName?: string;
  isSpaceCreator?: boolean;
  country1?: string;
  country2?: string;
  timezone1?: string;
  timezone2?: string;
  coordinates1?: { lat: number; lng: number };
  coordinates2?: { lat: number; lng: number };
  createdAt: string;
}

export const usersApi = {
  login: (email: string, pin: string, name?: string) =>
    apiRequest<{
      user: User & {
        email: string;
        phone: string;
        spaceCode?: string;
        spaceId?: string;
        isSpaceCreator?: boolean;
      };
      token: string;
    }>("/users/login", {
      method: "POST",
      body: JSON.stringify({ email, pin, name }),
    }),
  signup: (name: string, email: string, phone: string, pin: string) => {
    const pinStr = String(pin);
    return apiRequest<{
      user: User & {
        email: string;
        phone: string;
        spaceCode?: string;
        spaceId?: string;
        spaceName?: string;
        isSpaceCreator?: boolean;
        country1?: string;
        country2?: string;
        timezone1?: string;
        timezone2?: string;
        coordinates1?: { lat: number; lng: number };
        coordinates2?: { lat: number; lng: number };
      };
      token: string;
    }>("/users/signup", {
      method: "POST",
      body: JSON.stringify({ name, email, phone, pin: pinStr }),
    });
  },
  createSpace: (userId: string, spaceName?: string) =>
    apiRequest<{
      user: User & {
        email: string;
        phone: string;
        spaceCode: string;
        spaceId: string;
        spaceName?: string;
        isSpaceCreator: boolean;
      };
    }>(`/users/${userId}/create-space`, {
      method: "POST",
      body: JSON.stringify({ spaceName }),
    }),
  joinSpaceForUser: (userId: string, spaceCode: string) =>
    apiRequest<{
      user: User & {
        email: string;
        phone: string;
        spaceCode: string;
        spaceId: string;
        isSpaceCreator: boolean;
      };
    }>(`/users/${userId}/join-space`, {
      method: "POST",
      body: JSON.stringify({ spaceCode }),
    }),
  joinSpace: (
    name: string,
    email: string,
    phone: string,
    pin: string,
    spaceCode: string
  ) =>
    apiRequest<{
      user: User & {
        email: string;
        phone: string;
        spaceCode: string;
        spaceId: string;
        isSpaceCreator: boolean;
      };
      token: string;
    }>("/users/join-space", {
      method: "POST",
      body: JSON.stringify({ name, email, phone, pin, spaceCode }),
    }),
  getById: (userId: string) => apiRequest<User>(`/users/${userId}`),
  getAll: (userId: string) => apiRequest<User[]>(`/users?userId=${userId}`),
  updateCountries: (
    userId: string,
    countries: {
      country1?: string;
      country2?: string;
      timezone1?: string;
      timezone2?: string;
      coordinates1?: { lat: number; lng: number };
      coordinates2?: { lat: number; lng: number };
    }
  ) =>
    apiRequest<{ user: User }>(`/users/${userId}/countries`, {
      method: "PUT",
      body: JSON.stringify(countries),
    }),
};

// Quote APIs
export interface QuoteResponse {
  quote: string;
  timestamp: string;
}

export interface QuotesResponse {
  quotes: string[];
  timestamp: string;
}

export const quotesApi = {
  generate: () => apiRequest<QuoteResponse>("/quotes/generate"),
  getAll: (count?: number) =>
    apiRequest<QuotesResponse>(`/quotes${count ? `?count=${count}` : ""}`),
};
