import { create } from "zustand";
import { getCurrentUser } from "./appwrite";

interface Target {
  $createdAt: string;
  $id: string;
  $updatedAt: string;
  expired: boolean;
  identifier: string;
  name: string;
  providerId: string | null;
  providerType: 'email' | 'phone' | 'oauth';
  userId: string;
}

export interface User {
  $createdAt: string;
  $id: string;
  $updatedAt: string;
  accessedAt: string;
  avatar: string | ArrayBuffer;
  email: string;
  emailVerification: boolean;
  labels: string[];
  mfa: boolean;
  name: string;
  passwordUpdate: string;
  phone: string;
  phoneVerification: boolean;
  prefs: Record<string, any>; 
  registration: string;
  status: boolean;
  targets: Target[];
}

interface GlobalState {
  user: User | null;
  loading: boolean;
  isLogged: boolean;
  setUser: (user: User | null) => void;
  setLoading: (loading: boolean) => void;
  refetchUser: () => Promise<void>;
}

export const useGlobalStore = create<GlobalState>((set, get) => ({
  user: null,
  loading: true,
  isLogged: false,

  setUser: (user) => set({ user, isLogged: !!user }),
  setLoading: (loading) => set({ loading }),

  refetchUser: async () => {
    set({ loading: true });
    try {
      const currentUser = await getCurrentUser();
      set({
        user: currentUser as User,
        isLogged: !!currentUser,
        loading: false,
      });
    } catch (error) {
      console.error("Error fetching current user:", error);
      set({
        user: null,
        isLogged: false,
        loading: false,
      });
    }
  },
}));
