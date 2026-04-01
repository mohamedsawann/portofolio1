import { motion, AnimatePresence } from "framer-motion";
import { useEffect } from "react";

export default function BuildSecretsModal({
  open,
  onClose,
  reduceMotion,
}: {
  open: boolean;
  onClose: () => void;
  reduceMotion: boolean;
}) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-[200] flex items-center justify-center p-4"
          initial={reduceMotion ? { opacity: 1 } : { opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={reduceMotion ? { opacity: 1 } : { opacity: 0 }}
          role="dialog"
          aria-modal="true"
          aria-labelledby="build-secrets-title"
        >
          <button
            type="button"
            className="absolute inset-0 bg-black/70 border-0 cursor-default"
            aria-label="Close"
            onClick={onClose}
          />
          <motion.div
            initial={reduceMotion ? { scale: 1, opacity: 1 } : { scale: 0.96, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={reduceMotion ? { scale: 1, opacity: 1 } : { scale: 0.98, opacity: 0 }}
            className="relative max-w-md w-full rounded-xl border border-white/15 bg-[#0c0c18] p-4 sm:p-5 shadow-2xl text-left"
          >
            <h2
              id="build-secrets-title"
              className="text-sm font-bold text-white mb-1"
              style={{ fontFamily: "'Exo 2', sans-serif" }}
            >
              About this build
            </h2>
            <p className="text-[11px] text-white/45 mb-3" style={{ fontFamily: "'Rajdhani', sans-serif" }}>
              Unlocked with the classic sequence. (Press Esc to close.)
            </p>
            <ul className="space-y-2 text-[11px] text-white/70 font-mono">
              <li>
                <span className="text-white/35">Stack:</span> React + Vite + Tailwind + Framer Motion
              </li>
              <li>
                <span className="text-white/35">UI:</span> PSP-inspired XMB + mini-games bridge
              </li>
              <li>
                <span className="text-white/35">Env:</span>{" "}
                {import.meta.env.PROD ? "production" : "development"}
              </li>
            </ul>
            <button
              type="button"
              onClick={onClose}
              className="mt-4 w-full py-2 rounded-lg border border-white/15 bg-white/[0.06] text-[11px] text-white/80 hover:bg-white/10"
            >
              Close
            </button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
