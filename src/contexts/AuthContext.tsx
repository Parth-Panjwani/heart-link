import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { toast } from "sonner";
import { usersApi } from "@/lib/api";

interface User {
  id: string;
  name: string;
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

interface AuthContextType {
  user: User | null;
  partner: User | null;
  login: (email: string, pin: string, name?: string) => Promise<boolean>;
  signup: (
    name: string,
    email: string,
    phone: string,
    pin: string
  ) => Promise<boolean>;
  createSpace: (userId: string, spaceName?: string) => Promise<boolean>;
  joinSpaceForUser: (userId: string, spaceCode: string) => Promise<boolean>;
  joinSpace: (
    name: string,
    email: string,
    phone: string,
    pin: string,
    spaceCode: string
  ) => Promise<boolean>;
  logout: () => void;
  setPartner: (partnerId: string) => void;
  updateUser: (updates: Partial<User>) => void;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
};

const CURRENT_USER_KEY = "heartLink_currentUser";
const PARTNER_KEY = "heartLink_partner";

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [partner, setPartnerState] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Load current user from localStorage
    const currentUserData = localStorage.getItem(CURRENT_USER_KEY);
    const partnerId = localStorage.getItem(PARTNER_KEY);

    if (currentUserData) {
      try {
        const userData = JSON.parse(currentUserData);
        setUser(userData);

        if (partnerId && userData.id) {
          // Try to load partner from API
          usersApi.getAll(userData.id).then((result) => {
            if (result.success && result.data) {
              const foundPartner = result.data.find(
                (u: User) => u.id === partnerId
              );
              if (foundPartner) {
                setPartnerState(foundPartner);
              }
            }
          });
        }
      } catch (error) {
        console.error("Error loading user from localStorage:", error);
        localStorage.removeItem(CURRENT_USER_KEY);
      }
    }
    setLoading(false);
  }, []);

  const login = async (
    email: string,
    pin: string,
    name?: string
  ): Promise<boolean> => {
    try {
      if (!email.trim()) {
        toast.error("Email is required");
        return false;
      }

      // Validate PIN format
      if (!pin || pin.length !== 4 || !/^\d{4}$/.test(pin)) {
        toast.error("PIN must be exactly 4 digits");
        return false;
      }

      const result = await usersApi.login(email.trim(), pin, name);

      if (!result.success || !result.data) {
        toast.error(result.error || "Invalid email or PIN");
        return false;
      }

      const { user: userData, token } = result.data;

      setUser(userData);
      localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(userData));
      localStorage.setItem("heartLink_token", token);

      toast.success(`Welcome${name ? `, ${name}` : `, ${userData.name}`}!`);
      return true;
    } catch (error) {
      toast.error("Login failed");
      return false;
    }
  };

  const signup = async (
    name: string,
    email: string,
    phone: string,
    pin: string
  ): Promise<boolean> => {
    try {
      if (!name.trim()) {
        toast.error("Name is required");
        return false;
      }

      if (!email.trim()) {
        toast.error("Email is required");
        return false;
      }

      if (!phone.trim()) {
        toast.error("Phone number is required");
        return false;
      }

      if (!pin || pin.length !== 4 || !/^\d{4}$/.test(pin)) {
        toast.error("PIN must be exactly 4 digits");
        return false;
      }

      const result = await usersApi.signup(
        name.trim(),
        email.trim(),
        phone.trim(),
        pin
      );

      if (!result.success || !result.data) {
        toast.error(result.error || "Failed to create account");
        return false;
      }

      const { user: userData, token } = result.data;

      setUser(userData);
      localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(userData));
      localStorage.setItem("heartLink_token", token);

      toast.success(`Welcome, ${userData.name}!`);
      return true;
    } catch (error) {
      toast.error("Signup failed");
      return false;
    }
  };

  const createSpace = async (
    userId: string,
    spaceName?: string
  ): Promise<boolean> => {
    try {
      const result = await usersApi.createSpace(userId, spaceName);

      if (!result.success || !result.data) {
        toast.error(result.error || "Failed to create space");
        return false;
      }

      const { user: userData } = result.data;
      setUser(userData);
      localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(userData));

      toast.success(`Space created! Your space code is: ${userData.spaceCode}`);
      return true;
    } catch (error) {
      toast.error("Failed to create space");
      return false;
    }
  };

  const joinSpaceForUser = async (
    userId: string,
    spaceCode: string
  ): Promise<boolean> => {
    try {
      if (!spaceCode || spaceCode.length !== 6) {
        toast.error("Space code must be 6 characters");
        return false;
      }

      const result = await usersApi.joinSpaceForUser(
        userId,
        spaceCode.toUpperCase()
      );

      if (!result.success || !result.data) {
        toast.error(result.error || "Failed to join space");
        return false;
      }

      const { user: userData } = result.data;
      setUser(userData);
      localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(userData));

      toast.success(`You joined space: ${userData.spaceCode}`);
      return true;
    } catch (error) {
      toast.error("Failed to join space");
      return false;
    }
  };

  const joinSpace = async (
    name: string,
    email: string,
    phone: string,
    pin: string,
    spaceCode: string
  ): Promise<boolean> => {
    try {
      if (!name.trim()) {
        toast.error("Name is required");
        return false;
      }

      if (!email.trim()) {
        toast.error("Email is required");
        return false;
      }

      if (!phone.trim()) {
        toast.error("Phone number is required");
        return false;
      }

      if (!pin || pin.length !== 4 || !/^\d{4}$/.test(pin)) {
        toast.error("PIN must be exactly 4 digits");
        return false;
      }

      if (!spaceCode || spaceCode.length !== 6) {
        toast.error("Space code must be 6 characters");
        return false;
      }

      const result = await usersApi.joinSpace(
        name.trim(),
        email.trim(),
        phone.trim(),
        pin,
        spaceCode.toUpperCase()
      );

      if (!result.success || !result.data) {
        toast.error(result.error || "Failed to join space");
        return false;
      }

      const { user: userData, token } = result.data;

      setUser(userData);
      localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(userData));
      localStorage.setItem("heartLink_token", token);

      toast.success(`Welcome to the space, ${userData.name}!`);
      return true;
    } catch (error) {
      toast.error("Failed to join space");
      return false;
    }
  };

  const logout = () => {
    setUser(null);
    setPartnerState(null);
    localStorage.removeItem(CURRENT_USER_KEY);
    localStorage.removeItem(PARTNER_KEY);
    localStorage.removeItem("heartLink_token");
    toast.success("Logged out successfully");
  };

  const setPartner = (partnerId: string) => {
    // Allow clearing partner by passing empty string
    if (!partnerId) {
      setPartnerState(null);
      localStorage.removeItem(PARTNER_KEY);
      return;
    }

    if (!user) return;

    usersApi.getAll(user.id).then((result) => {
      if (result.success && result.data) {
        const foundPartner = result.data.find((u: User) => u.id === partnerId);
        if (foundPartner) {
          setPartnerState(foundPartner);
          localStorage.setItem(PARTNER_KEY, partnerId);
          toast.success(`Connected with ${foundPartner.name}`);
        }
      }
    });
  };

  const updateUser = (updates: Partial<User>) => {
    if (!user) return;

    const updatedUser = { ...user, ...updates };
    setUser(updatedUser);
    localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(updatedUser));
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        partner,
        login,
        signup,
        createSpace,
        joinSpaceForUser,
        joinSpace,
        logout,
        setPartner,
        updateUser,
        loading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
