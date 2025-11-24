import { create } from "zustand";
import { persist } from "zustand/middleware";

interface AuthState {
  customer_id: string | null;
  setCustomerId: (id: string) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      customer_id: null,

      setCustomerId: (id) =>
        set({
          customer_id: id,
        }),

      logout: () =>
        set({
          customer_id: null,
        }),
    }),
    {
      name: "auth-store", // nombre en AsyncStorage
    }
  )
);
