"use client";
import { useEffect, ReactNode } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { XIcon } from "lucide-react";

interface Props {
  open: boolean;
  onClose: () => void;
  title?: string;
  children: ReactNode;
}

export function AppleModal({ open, onClose, title, children }: Props) {
  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            key="backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.24, ease: [0.25, 0.46, 0.45, 0.94] }}
            className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm"
            onClick={onClose}
            aria-hidden
          />
          <motion.div
            key="sheet"
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ duration: 0.38, ease: [0.16, 1, 0.3, 1] }}
            className="fixed bottom-0 left-0 right-0 z-50 md:inset-0 md:flex md:items-center md:justify-center md:p-4 pointer-events-none"
          >
            <div className="pointer-events-auto w-full max-w-lg bg-white rounded-t-[20px] md:rounded-xl shadow-lg max-h-[90vh] overflow-y-auto">
              {/* Grabber (mobile) */}
              <div className="flex justify-center pt-3 pb-1 md:hidden">
                <div className="w-10 h-1 rounded-full bg-[var(--fill-primary)]" />
              </div>
              {title && (
                <div className="flex items-center justify-between px-4 py-3 border-b border-[var(--separator)]">
                  <h2 className="text-headline">{title}</h2>
                  <button
                    onClick={onClose}
                    className="p-1 rounded-full hover:bg-[var(--fill-tertiary)] transition-colors"
                    aria-label="Close"
                  >
                    <XIcon size={18} className="text-text-secondary" />
                  </button>
                </div>
              )}
              <div className="p-4 pb-[calc(1rem+env(safe-area-inset-bottom))]">
                {children}
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
