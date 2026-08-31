"use client";

import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import { useEffect, type ReactNode } from "react";
import { cn } from "@/lib/cn";
import { IconButton } from "./IconButton";

type ModalProps = {
  open: boolean;
  onClose: () => void;
  title: string;
  subtitle?: string;
  size?: "sm" | "md" | "lg";
  children: ReactNode;
};

const SIZES = {
  sm: "max-w-md",
  md: "max-w-lg",
  lg: "max-w-2xl",
};

export function Modal({ open, onClose, title, subtitle, size = "md", children }: ModalProps) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open, onClose]);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.15 }}
        >
          <button
            aria-label="Fermer la modale"
            onClick={onClose}
            className="absolute inset-0 bg-overlay-strong backdrop-blur-sm"
          />
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-labelledby="modal-title"
            initial={{ opacity: 0, scale: 0.96, y: 8 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 8 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className={cn(
              "relative w-full bg-surface border border-border rounded-2xl shadow-card overflow-hidden",
              SIZES[size]
            )}
          >
            <header className="flex items-start justify-between gap-4 p-6 pb-4">
              <div>
                <h2 id="modal-title" className="text-h2 font-bold text-text">
                  {title}
                </h2>
                {subtitle && (
                  <p className="mt-1 text-small text-text-muted">{subtitle}</p>
                )}
              </div>
              <IconButton variant="ghost" size="sm" onClick={onClose} label="Fermer">
                <X className="h-4 w-4" />
              </IconButton>
            </header>
            <div className="px-6 pb-6">{children}</div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
