import { create } from "zustand";
import { getCurrentUser } from "./appwrite";
// import { useAppwrite } from './useAppwrite';

interface User {
  $id: string;
  name: string;
  email: string;
  avatar: string;
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
