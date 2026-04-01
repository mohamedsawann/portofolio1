import { useCallback, useEffect, useRef, useState } from "react";
import type { GameBridgeHandlers } from "@/lib/gameBridge";

type Phase = "idle" | "wait" | "go" | "early" | "done";

export default function ReactionGame({
  bridge,
  accent,
  variant = "default",
}: {
  bridge: { current: GameBridgeHandlers | null };
  accent: string;
  variant?: "default" | "fullscreen";
}) {
  const [phase, setPhase] = useState<Phase>("idle");
  const [ms, setMs] = useState<number | null>(null);
  const goAt = useRef(0);
  const waitTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const clearWait = () => {
    if (waitTimer.current) {
      clearTimeout(waitTimer.current);
      waitTimer.current = null;
    }
  };

  const startRound = useCallback(() => {
    clearWait();
    setMs(null);
    setPhase("wait");
    const delay = 1500 + Math.random() * 2500;
    waitTimer.current = setTimeout(() => {
      goAt.current = performance.now();
      setPhase("go");
    }, delay);
  }, []);

  const tap = useCallback(() => {
    if (phase === "idle") {
      startRound();
      return;
    }
    if (phase === "wait") {
      clearWait();
      setPhase("early");
      return;
    }
    if (phase === "go") {
      const t = performance.now() - goAt.current;
      setMs(Math.round(t));
      setPhase("done");
      return;
    }
    if (phase === "early" || phase === "done") {
      setPhase("idle");
    }
  }, [phase, startRound]);

  useEffect(() => {
    bridge.current = {
      primary: tap,
    };
    return () => {
      bridge.current = null;
      clearWait();
    };
  }, [bridge, tap]);

  const fs = variant === "fullscreen";
  return (
    <div className="select-none space-y-3 w-full">
      <p className="text-[10px] sm:text-[11px] text-white/50">
        Wait for green, then tap ✕ or Space as fast as you can. Tap early = fail.
      </p>
      <button
        type="button"
        onClick={tap}
        className={`w-full rounded-2xl text-center font-bold transition-colors border-2 ${fs ? "py-12 sm:py-16 text-lg sm:text-xl" : "py-8 text-base"}`}
        style={{
          borderColor:
            phase === "go"
              ? "#00e676"
              : phase === "early"
                ? "#ff5252"
                : `${accent}55`,
          background:
            phase === "go"
              ? "rgba(0,230,118,0.15)"
              : phase === "wait"
                ? "rgba(255,255,255,0.04)"
                : phase === "early"
                  ? "rgba(255,82,82,0.12)"
                  : "rgba(255,255,255,0.06)",
          color: phase === "go" ? "#00e676" : "rgba(255,255,255,0.85)",
        }}
      >
        {phase === "idle" && "Tap to start"}
        {phase === "wait" && "…"}
        {phase === "go" && "NOW!"}
        {phase === "early" && "Too soon — tap to retry"}
        {phase === "done" && ms !== null && `${ms} ms — tap to try again`}
      </button>
    </div>
  );
}
