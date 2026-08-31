"use client";

import { create } from "zustand";
import type { CurrentUser } from "@/types";

type UserStore = {
  user: CurrentUser;
  setUser: (user: CurrentUser) => void;
};

const DEFAULT_USER: CurrentUser = {
  id: "u-001",
  name: "Jean Dupont",
  initials: "JD",
  role: "Photographe",
  country: "FR",
  isAdmin: false,
};

export const useCurrentUser = create<UserStore>((set) => ({
  user: DEFAULT_USER,
  setUser: (user) => set({ user }),
}));
