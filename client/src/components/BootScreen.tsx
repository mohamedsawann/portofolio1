/*
 * Boot Screen — PSP-style power-on sequence
 * Design: Y2K Futurism / Sony XMB Interface
 * Shows a cinematic boot animation before revealing the XMB menu.
 * Polish: click-to-skip, improved glow, smoother transitions.
 */

import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect, useRef } from "react";
import { playSkip } from "@/lib/sound";

interface BootScreenProps {
  onComplete: () => void;
  reduceMotion?: boolean;
}

export default function BootScreen({ onComplete, reduceMotion = false }: BootScreenProps) {
  const [phase, setPhase] = useState<"black" | "loading" | "done">("black");
  const completedRef = useRef(false);

  const finish = () => {
    if (!completedRef.current) {
      completedRef.current = true;
      playSkip();
      setPhase("done");
      onComplete();
    }
  };

  useEffect(() => {
    const t1 = setTimeout(() => {
      if (!completedRef.current) setPhase("loading");
    }, reduceMotion ? 0 : 900);
    const t3 = setTimeout(() => finish(), reduceMotion ? 1200 : 5500);
    return () => {
      clearTimeout(t1);
      clearTimeout(t3);
    };
  }, [reduceMotion]);

  return (
    <AnimatePresence>
      {phase !== "done" && (
        <motion.div
          className="absolute inset-0 z-50 flex flex-col items-center justify-center cursor-pointer"
          style={{ background: "#030308" }}
          exit={{ opacity: 0 }}
          transition={{ duration: reduceMotion ? 0.15 : 0.5 }}
          onClick={finish}
        >
          {/* Subtle radial glow */}
          <div
            className="absolute inset-0"
            style={{
              background:
                "radial-gradient(ellipse 60% 50% at 50% 50%, rgba(0,112,209,0.05) 0%, transparent 70%)",
            }}
          />
          {/* Scanlines / CRT overlay for “console boot” feel */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              opacity: phase === "black" ? 0.08 : 0.14,
              backgroundImage:
                "repeating-linear-gradient(180deg, rgba(255,255,255,0.10) 0px, rgba(255,255,255,0.10) 1px, rgba(0,0,0,0) 2px, rgba(0,0,0,0) 4px)",
              mixBlendMode: "overlay",
            }}
          />

          <AnimatePresence mode="wait">
            {phase === "black" && (
              <motion.div
                key="black"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              />
            )}

            {phase === "loading" && (
              <motion.div
                key="loading"
                className="flex flex-col items-center gap-4"
                initial={{ opacity: reduceMotion ? 1 : 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: reduceMotion ? 0 : 0.15 }}
              >
                <motion.p
                  className="text-[11px] text-white/25 tracking-widest uppercase"
                  style={{ fontFamily: "'Rajdhani', sans-serif" }}
                >
                  Loading System...
                </motion.p>

                {/* Loading bar */}
                <div className="w-40 sm:w-48 h-[3px] rounded-full bg-white/5 overflow-hidden">
                  <motion.div
                    className="h-full rounded-full"
                    style={{
                      background: "linear-gradient(90deg, #0060b8, #0090ff)",
                      boxShadow: "0 0 10px rgba(0,144,255,0.4)",
                    }}
                    initial={{ width: "0%" }}
                    animate={{ width: "100%" }}
                    transition={{ duration: reduceMotion ? 0 : 1.1, ease: "easeInOut" }}
                  />
                </div>

                {/* Fake system messages */}
                <div className="space-y-1 text-center">
                  {["Initializing display...", "Loading portfolio data...", "Starting XMB..."].map(
                    (msg, i) => (
                      <motion.p
                        key={msg}
                        className="text-[9px] text-white/12 font-mono"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: i * 0.3 }}
                      >
                        {msg}
                      </motion.p>
                    )
                  )}
                </div>

                {/* Skip hint */}
                <motion.p
                  className="text-[9px] text-white/15 mt-2"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.6 }}
                >
                  Click or press Enter to skip
                </motion.p>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
