/*
 * Power-off state — PSP-style blank reflective panel until power is pressed.
 */

import { motion } from "framer-motion";
import { Power } from "lucide-react";

interface PowerOffScreenProps {
  onTapWake?: () => void;
}

export default function PowerOffScreen({ onTapWake }: PowerOffScreenProps) {
  return (
    <div
      role={onTapWake ? "button" : undefined}
      tabIndex={onTapWake ? 0 : undefined}
      onClick={onTapWake}
      onKeyDown={
        onTapWake
          ? (e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                onTapWake();
              }
            }
          : undefined
      }
      className={`absolute inset-0 z-40 flex flex-col items-center justify-center overflow-hidden bg-[#020206] ${onTapWake ? "cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-white/20" : ""}`}
      aria-label={onTapWake ? "Tap or press Enter to power on" : undefined}
    >
      {/* Subtle PSP-style glass reflection */}
      <div
        className="absolute inset-0 opacity-40 pointer-events-none"
        style={{
          background:
            "linear-gradient(125deg, transparent 0%, rgba(255,255,255,0.03) 35%, transparent 55%, rgba(0,112,209,0.02) 100%)",
        }}
      />
      <div className="absolute inset-0 pointer-events-none ring-1 ring-inset ring-white/[0.04]" />

      <motion.div
        initial={{ opacity: 0, y: 6 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative z-10 flex flex-col items-center gap-4 px-6 text-center max-w-[90%]"
      >
        <div
          className="w-14 h-14 rounded-2xl flex items-center justify-center border border-white/10"
          style={{
            background: "linear-gradient(145deg, rgba(30,30,55,0.9), rgba(15,15,30,0.95))",
            boxShadow: "inset 0 1px 0 rgba(255,255,255,0.06)",
          }}
        >
          <Power className="w-7 h-7 text-white/25" strokeWidth={1.25} />
        </div>
        <div>
          <p
            className="text-sm sm:text-base text-white/55 font-medium tracking-wide"
            style={{ fontFamily: "'Exo 2', sans-serif" }}
          >
            System standby
          </p>
          <p
            className="text-[11px] sm:text-xs text-white/30 mt-2 leading-relaxed max-w-[280px] mx-auto"
            style={{ fontFamily: "'Rajdhani', sans-serif" }}
          >
            Press{" "}
            <span className="text-white/45 font-semibold">Power</span>
            {" "}next to the status light (or the power icon in the bottom controls on small
            screens), or press{" "}
            <kbd className="px-1.5 py-0.5 rounded bg-white/8 border border-white/10 text-[10px] text-white/50">
              Enter
            </kbd>{" "}
            on your keyboard, or tap anywhere on this screen, to power on.
          </p>
        </div>
      </motion.div>

      <p
        className="absolute bottom-5 left-0 right-0 text-center text-[9px] text-white/15 tracking-[0.25em] uppercase"
        style={{ fontFamily: "'Rajdhani', sans-serif" }}
      >
        Portfolio Station Portable
      </p>
    </div>
  );
}
