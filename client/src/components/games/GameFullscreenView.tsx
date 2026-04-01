import { motion } from "framer-motion";
import { ChevronLeft } from "lucide-react";
import MiniGameHost from "@/components/games/MiniGameHost";
import type { GameBridgeRef } from "@/lib/gameBridge";

export default function GameFullscreenView({
  title,
  accent,
  itemId,
  gameBridgeRef,
  onExit,
}: {
  title: string;
  accent: string;
  itemId: string;
  gameBridgeRef: GameBridgeRef;
  onExit: () => void;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.96, y: 12 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.98, y: 6 }}
      transition={{ type: "spring", stiffness: 380, damping: 32 }}
      className="absolute inset-0 z-40 flex flex-col rounded-[inherit] overflow-hidden bg-[#030308]"
    >
      {/* PSP-style system strip */}
      <div
        className="shrink-0 flex items-center justify-between gap-2 px-2 sm:px-3 py-2 border-b border-white/10"
        style={{
          background: "linear-gradient(180deg, rgba(20,20,35,0.95), rgba(8,8,14,0.98))",
          boxShadow: "inset 0 1px 0 rgba(255,255,255,0.06)",
        }}
      >
        <button
          type="button"
          onClick={onExit}
          className="flex items-center gap-1 rounded-lg px-2 py-1 text-[10px] sm:text-[11px] text-white/55 hover:text-white/85 hover:bg-white/10 focus:outline-none focus-visible:ring-1 focus-visible:ring-white/30"
          style={{ fontFamily: "'Rajdhani', sans-serif" }}
        >
          <ChevronLeft className="w-3.5 h-3.5" />
          <span className="font-semibold tracking-wide">Close</span>
        </button>
        <div className="flex flex-col items-center min-w-0 flex-1 px-2">
          <span className="text-[8px] tracking-[0.35em] text-white/25 uppercase">Game</span>
          <span
            className="text-sm sm:text-base font-bold text-white truncate max-w-full"
            style={{ fontFamily: "'Exo 2', sans-serif", color: accent }}
          >
            {title}
          </span>
        </div>
        <span className="text-[9px] text-white/20 w-14 text-right font-mono tabular-nums">UMD</span>
      </div>

      {/* Game viewport — letterboxed like PSP */}
      <div className="flex-1 min-h-0 flex flex-col items-center justify-center p-3 sm:p-4 overflow-auto relative">
        <div
          className="absolute inset-0 pointer-events-none opacity-[0.04]"
          style={{
            backgroundImage:
              "repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,0.5) 2px, rgba(0,0,0,0.5) 4px)",
          }}
        />
        <div className="relative w-full max-w-[min(100%,440px)] flex flex-col items-center justify-center min-h-[min(52vh,300px)]">
          <MiniGameHost itemId={itemId} gameBridgeRef={gameBridgeRef} accent={accent} variant="fullscreen" />
        </div>
        <p
          className="relative mt-3 text-center text-[9px] text-white/25 max-w-xs"
          style={{ fontFamily: "'Rajdhani', sans-serif" }}
        >
          D-Pad / WASD · ✕ · ○ closes game
        </p>
      </div>
    </motion.div>
  );
}
