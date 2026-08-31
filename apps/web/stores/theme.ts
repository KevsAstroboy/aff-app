"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

export type Theme = "dark" | "light";

type ThemeStore = {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  toggle: () => void;
};

export const useThemeStore = create<ThemeStore>()(
  persist(
    (set, get) => ({
      theme: "dark",
      setTheme: (theme) => {
        set({ theme });
        applyTheme(theme);
      },
      toggle: () => {
        const next: Theme = get().theme === "dark" ? "light" : "dark";
        set({ theme: next });
        applyTheme(next);
      },
    }),
    {
      name: "aff-ui-theme",
      onRehydrateStorage: () => (state) => {
        if (state?.theme) applyTheme(state.theme);
      },
    },
  ),
);

export function applyTheme(theme: Theme) {
  if (typeof document === "undefined") return;
  document.documentElement.setAttribute("data-theme", theme);
}
