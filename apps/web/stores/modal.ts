"use client";

import { create } from "zustand";

type ModalStore = {
  inscriptionOpen: boolean;
  openInscription: () => void;
  closeInscription: () => void;
};

export const useModalStore = create<ModalStore>((set) => ({
  inscriptionOpen: false,
  openInscription: () => set({ inscriptionOpen: true }),
  closeInscription: () => set({ inscriptionOpen: false }),
}));
