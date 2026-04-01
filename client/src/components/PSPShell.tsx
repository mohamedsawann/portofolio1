/*
 * PSP Shell — physical console body (rectangle style)
 */

import { motion } from "framer-motion";
import { ReactNode } from "react";
import { Orbit, Power } from "lucide-react";

interface PSPShellProps {
  children: ReactNode;
  devicePowered: boolean;
  booted: boolean;
  nightMode?: boolean;
  onPowerPress: () => void;
  onDpadUp: () => void;
  onDpadDown: () => void;
  onDpadLeft: () => void;
  onDpadRight: () => void;
  onButtonX: () => void;
  onButtonO: () => void;
  onOpenSpaceExplore: () => void;
}

function FaceGlyph({ shape }: { shape: "triangle" | "cross" | "square" | "circle" }) {
  const stroke = 2.2;
  switch (shape) {
    case "triangle":
      return (
        <svg viewBox="0 0 24 24" aria-hidden className="w-5 h-5" fill="none">
          <path d="M12 6L18 17H6L12 6z" stroke="currentColor" strokeWidth={stroke} strokeLinejoin="round" />
        </svg>
      );
    case "cross":
      return (
        <svg viewBox="0 0 24 24" aria-hidden className="w-5 h-5" fill="none">
          <path d="M7 7l10 10M17 7L7 17" stroke="currentColor" strokeWidth={stroke} strokeLinecap="round" />
        </svg>
      );
    case "square":
      return (
        <svg viewBox="0 0 24 24" aria-hidden className="w-5 h-5" fill="none">
          <rect x="6" y="6" width="12" height="12" rx="1.2" stroke="currentColor" strokeWidth={stroke} />
        </svg>
      );
    case "circle":
      return (
        <svg viewBox="0 0 24 24" aria-hidden className="w-5 h-5" fill="none">
          <circle cx="12" cy="12" r="6.4" stroke="currentColor" strokeWidth={stroke} />
        </svg>
      );
  }
}

function DpadButton({
  onClick,
  className,
  rotate,
}: {
  onClick: () => void;
  className: string;
  rotate: string;
}) {
  return (
    <motion.button
      type="button"
      whileTap={{ scale: 0.88 }}
      onClick={onClick}
      className={`absolute flex items-center justify-center text-white/60 hover:text-white/90 border border-white/10 ${className}`}
      style={{ background: "linear-gradient(180deg, rgba(45,45,72,0.95), rgba(25,25,48,0.98))" }}
    >
      <svg width="12" height="12" viewBox="0 0 14 14" fill="currentColor" className={rotate}>
        <path d="M7 2.5L11.5 9.5H2.5L7 2.5Z" />
      </svg>
    </motion.button>
  );
}

function ActionButton({
  shape,
  onClick,
  color,
}: {
  shape: "triangle" | "cross" | "square" | "circle";
  onClick: () => void;
  color: string;
}) {
  return (
    <motion.button
      type="button"
      whileTap={{ scale: 0.86 }}
      onClick={onClick}
      className="w-10 h-10 rounded-full flex items-center justify-center"
      style={{
        background: "linear-gradient(155deg, rgba(48,48,82,0.98), rgba(22,22,48,0.99))",
        color,
        border: `1.5px solid ${color}35`,
      }}
    >
      <FaceGlyph shape={shape} />
    </motion.button>
  );
}

export default function PSPShell({
  children,
  devicePowered,
  booted,
  nightMode = false,
  onPowerPress,
  onDpadUp,
  onDpadDown,
  onDpadLeft,
  onDpadRight,
  onButtonX,
  onButtonO,
  onOpenSpaceExplore,
}: PSPShellProps) {
  const led =
    !devicePowered
      ? { bg: "#2a1010", glow: "0 0 0 transparent", pulse: false }
      : !booted
        ? { bg: "#ffb74d", glow: "0 0 10px rgba(255,183,77,0.65)", pulse: true }
        : { bg: "#00e676", glow: "0 0 10px rgba(0,230,118,0.55)", pulse: false };

  return (
    <div className="relative w-full max-w-[1120px] mx-auto select-none">
      <div
        className="relative rounded-[2.1rem] sm:rounded-[3.2rem] p-[3px] sm:p-[4px]"
        style={{
          background: nightMode
            ? "linear-gradient(165deg, #6f748a 0%, #4a4f63 33%, #313446 70%, #26293b 100%)"
            : "linear-gradient(162deg, #afb4c3 0%, #7d8396 16%, #555b70 42%, #41465a 70%, #353a4c 100%)",
        }}
      >
        <div
          className="relative rounded-[2rem] sm:rounded-[3rem] p-3 sm:p-4 md:p-5"
          style={{
            background: nightMode
              ? "linear-gradient(168deg, #1c2240 0%, #151a33 40%, #0d1022 100%)"
              : "linear-gradient(168deg, #282b4a 0%, #1c1f3c 32%, #14162f 66%, #0e1021 100%)",
          }}
        >
          <div className="flex items-center justify-between px-1 sm:px-2 mb-3 gap-2">
            <div className="flex items-center gap-2">
              <span className="text-[10px] tracking-[0.2em] uppercase text-white/25 hidden sm:inline">PSP</span>
              <motion.div
                className="w-2 h-2 rounded-full"
                style={{ background: led.bg, boxShadow: led.glow }}
                animate={led.pulse ? { opacity: [1, 0.45, 1] } : { opacity: 1 }}
                transition={led.pulse ? { duration: 1.1, repeat: Infinity } : {}}
              />
              <span className="text-[8px] text-white/20 hidden sm:inline">{devicePowered ? (booted ? "Ready" : "Starting...") : "Standby"}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <button type="button" onClick={onOpenSpaceExplore} className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg border border-[#6d9dff]/35 bg-[#6d9dff]/10">
                <Orbit className="w-3.5 h-3.5 text-[#9fc0ff]" />
                <span className="text-[9px] uppercase text-[#b7ceff] hidden sm:inline">Space</span>
              </button>
              <button type="button" onClick={onPowerPress} className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg border border-white/10 bg-white/[0.04]">
                <Power className="w-3.5 h-3.5 text-white/50" />
                <span className="text-[9px] uppercase text-white/45 hidden sm:inline">Power</span>
              </button>
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-4 md:gap-6">
            <div className="hidden sm:flex flex-col items-center gap-3 w-[5.25rem] md:w-24 shrink-0">
              <div className="relative w-[88px] h-[88px]">
                <div className="absolute inset-0 rounded-full bg-[#11122a] border border-white/10" />
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[28px] h-[64px] rounded-[5px] bg-[#14142c] border border-white/[0.07]" />
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[64px] h-[28px] rounded-[5px] bg-[#14142c] border border-white/[0.07]" />
                <DpadButton onClick={onDpadUp} className="top-[7px] left-1/2 -translate-x-1/2 w-[26px] h-[26px] rounded-t-md" rotate="" />
                <DpadButton onClick={onDpadDown} className="bottom-[7px] left-1/2 -translate-x-1/2 w-[26px] h-[26px] rounded-b-md" rotate="rotate-180" />
                <DpadButton onClick={onDpadLeft} className="left-[7px] top-1/2 -translate-y-1/2 w-[26px] h-[26px] rounded-l-md" rotate="-rotate-90" />
                <DpadButton onClick={onDpadRight} className="right-[7px] top-1/2 -translate-y-1/2 w-[26px] h-[26px] rounded-r-md" rotate="rotate-90" />
              </div>
            </div>

            <div className="flex-1 min-w-0">
              <div className="relative rounded-lg sm:rounded-xl overflow-hidden scanlines p-[3px]" style={{ aspectRatio: "16 / 9", background: "linear-gradient(180deg, #24283a, #0f1220)" }}>
                <div className="absolute inset-0 rounded-lg sm:rounded-xl border border-white/[0.08] pointer-events-none z-[15]" />
                <div className="relative w-full h-full rounded-[0.55rem] sm:rounded-[0.65rem] overflow-hidden" style={{ background: "#010104" }}>
                  {children}
                </div>
              </div>
            </div>

            <div className="hidden sm:flex flex-col items-center gap-3 w-[5.25rem] md:w-24 shrink-0">
              <div className="relative w-[92px] h-[92px]">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-0.5"><ActionButton shape="triangle" onClick={onDpadUp} color="#69d0ce" /></div>
                <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-0.5"><ActionButton shape="cross" onClick={onButtonX} color="#6d9dff" /></div>
                <div className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-0.5"><ActionButton shape="square" onClick={onDpadLeft} color="#d88ae8" /></div>
                <div className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-0.5"><ActionButton shape="circle" onClick={onButtonO} color="#ff7a7a" /></div>
              </div>
            </div>
          </div>

          <div className="mt-2 text-center">
            <span className="text-[10px] tracking-[0.32em] uppercase font-light text-white/15">Portfolio Station Portable</span>
          </div>
        </div>
      </div>
    </div>
  );
}
