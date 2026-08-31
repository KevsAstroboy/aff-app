"use client";

import { AnimatePresence, motion } from "framer-motion";
import { Sidebar } from "./Sidebar";
import type { SidebarProps } from "./Sidebar";

type MobileNavProps = {
  open: boolean;
  onClose: () => void;
  variant?: SidebarProps["variant"];
};

export function MobileNav({ open, onClose, variant = "public" }: MobileNavProps) {
  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-50 md:hidden"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <button
            aria-label="Fermer le menu"
            onClick={onClose}
            className="absolute inset-0 bg-overlay-strong backdrop-blur-sm"
          />
          <motion.div
            initial={{ x: -280 }}
            animate={{ x: 0 }}
            exit={{ x: -280 }}
            transition={{ type: "tween", duration: 0.2, ease: "easeOut" }}
            className="absolute inset-y-0 left-0"
          >
            <Sidebar variant={variant} onNavigate={onClose} />
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
