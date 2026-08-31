"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import { apiClient, setApiToken, getApiToken } from "@/lib/api-client";
import { fileToBase64 } from "@/lib/file";
import type { AuthResponse, CreateCandidatureRequest } from "@/types/auth";

type AuthStore = {
  token: string | null;
  user: AuthResponse["user"] | null;
  profils: AuthResponse["profils"];
  features: string[];
  isAuth: boolean;
  hasHydrated: boolean;

  login: (identifier: string, password: string) => Promise<void>;
  register: (data: {
    username: string;
    email: string;
    password: string;
    nom: string;
    prenom: string;
    phone_numb: string;
    communaute_id?: number;
  }) => Promise<{ message: string }>;
  verifyOtp: (identifier: string, email: string, code: string) => Promise<void>;
  resendOtp: (email: string) => Promise<{ message: string }>;
  forgotPassword: (email: string) => Promise<{ message: string }>;
  resetPassword: (email: string, otp_code: string, new_password: string) => Promise<{ message: string }>;
  changePassword: (
    current_password: string,
    new_password: string,
    new_password_confirmation: string
  ) => Promise<void>;
  updateProfile: (data: { nom?: string; prenom?: string; description?: string }) => Promise<void>;
  uploadPhoto: (file: File) => Promise<void>;
  getProfileStats: () => Promise<{
    publications_count: number;
    reactions_received_count: number;
    communautes_count: number;
    masterclass_inscriptions_count: number;
    awards_candidatures_count: number;
    profils_count: number;
  }>;
  refreshToken: () => Promise<void>;
  logout: () => void;
  isAdmin: () => boolean;
};

export const useAuthStore = create<AuthStore>()(
  persist(
    (set, get) => ({
      token: null,
      user: null,
      profils: [],
      features: [],
      isAuth: false,
      hasHydrated: false,

      async login(identifier, password) {
        const res = await apiClient.post<AuthResponse>("/auth/login", {
          identifier,
          password,
        });
        setApiToken(res.access_token);
        set({
          token: res.access_token,
          user: res.user,
          profils: res.profils,
          features: res.features,
          isAuth: true,
        });
      },

      async register(data) {
        return apiClient.post("/auth/register", data);
      },

      async verifyOtp(_identifier, email, code) {
        const res = await apiClient.post<AuthResponse>("/auth/verify-otp", {
          email,
          otp_code: code,
        });
        setApiToken(res.access_token);
        set({
          token: res.access_token,
          user: res.user,
          profils: res.profils,
          features: res.features,
          isAuth: true,
        });
      },

      async resendOtp(email) {
        return apiClient.post("/auth/resend-otp", { email });
      },

      async forgotPassword(email) {
        return apiClient.post("/auth/forgot-password", { email });
      },

      async resetPassword(email, otp_code, new_password) {
        return apiClient.post("/auth/reset-password", {
          email,
          otp_code,
          new_password,
        });
      },

      async changePassword(
        current_password,
        new_password,
        new_password_confirmation
      ) {
        return apiClient.patch("/auth/change-password", {
          current_password,
          new_password,
          new_password_confirmation,
        });
      },

      async updateProfile(data) {
        const res = await apiClient.patch<AuthResponse["user"]>(
          "/auth/profile",
          data
        );
        set((s) => ({ user: s.user ? { ...s.user, ...res } : null }));
      },

      async uploadPhoto(file) {
        const base64 = await fileToBase64(file);
        const res = await apiClient.post<{
          profile_picture_path: string;
        }>("/auth/profile/photo", { image: base64 });
        set((s) => ({
          user: s.user
            ? { ...s.user, profile_picture_path: res.profile_picture_path }
            : null,
        }));
      },

      async getProfileStats() {
        return apiClient.get("/auth/profile/stats");
      },

      async refreshToken() {
        try {
          const res = await apiClient.post<AuthResponse>("/auth/refresh");
          setApiToken(res.access_token);
          set({ token: res.access_token });
        } catch {
          get().logout();
        }
      },

      logout() {
        setApiToken(null);
        set({ token: null, user: null, profils: [], features: [], isAuth: false });
      },

      isAdmin() {
        return get().features.includes("ACCEDER_ADMIN");
      },
    }),
    {
      name: "aff-auth",
      version: 1,
      merge: (persisted, current) => {
        const p = persisted as Partial<AuthStore>;
        if (p?.token) setApiToken(p.token);
        return { ...current, ...p, hasHydrated: true };
      },
      onRehydrateStorage: () => (state) => {
        if (state?.token) {
          setApiToken(state.token);
        }
        // Hydration is synchronous via merge on the client; this guards the
        // async path so guards never block on an un-hydrated store.
        useAuthStore.setState({ hasHydrated: true });
      },
    }
  )
);

export type { AuthResponse } from "@/types/auth";
