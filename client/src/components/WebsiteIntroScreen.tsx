import { motion } from "framer-motion";
import { lazy, Suspense, useEffect, useRef, useState } from "react";
import { playSkip } from "@/lib/sound";

const ThreeJourneyIntro = lazy(() => import("@/components/ThreeJourneyIntro"));

function supportsWebGL(): boolean {
  if (typeof window === "undefined") return false;
  try {
    const c = document.createElement("canvas");
    return Boolean(c.getContext("webgl2") || c.getContext("webgl"));
  } catch {
    return false;
  }
}

export default function WebsiteIntroScreen({
  onDone,
  reduceMotion = false,
}: {
  onDone: () => void;
  reduceMotion?: boolean;
}) {
  const doneRef = useRef(false);
  const [webglReady, setWebglReady] = useState(false);

  useEffect(() => {
    setWebglReady(supportsWebGL());
  }, []);

  useEffect(() => {
    const ms = reduceMotion ? 900 : 4200;
    const t = window.setTimeout(() => {
      if (doneRef.current) return;
      doneRef.current = true;
      onDone();
    }, ms);
    return () => window.clearTimeout(t);
  }, [onDone, reduceMotion]);

  return (
    <motion.div
      initial={reduceMotion ? { opacity: 1 } : { opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={reduceMotion ? { opacity: 1 } : { opacity: 0 }}
      className="fixed inset-0 z-[60] flex items-center justify-center cursor-pointer"
      onClick={() => {
        if (doneRef.current) return;
        doneRef.current = true;
        playSkip();
        onDone();
      }}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          if (doneRef.current) return;
          doneRef.current = true;
          playSkip();
          onDone();
        }
      }}
      aria-label="Intro screen"
    >
      {/* Background */}
      <div className="absolute inset-0" style={{ background: "#030308" }} />
      {!reduceMotion && webglReady && (
        <Suspense fallback={null}>
          <ThreeJourneyIntro reduceMotion={reduceMotion} />
        </Suspense>
      )}

      {/* Scanlines */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          opacity: 0.14,
          backgroundImage:
            "repeating-linear-gradient(180deg, rgba(255,255,255,0.10) 0px, rgba(255,255,255,0.10) 1px, rgba(0,0,0,0) 2px, rgba(0,0,0,0) 4px)",
          mixBlendMode: "overlay",
        }}
      />

      {/* Center content */}
      <div className="relative flex flex-col items-center gap-3 px-4">
        <motion.img
          src="/__psp__/logo.svg"
          alt="PSP logo"
          initial={reduceMotion ? { opacity: 1, scale: 1, y: 0 } : { opacity: 0, scale: 0.96, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: reduceMotion ? 0 : 0.45, ease: "easeOut" }}
          className="w-[16rem] max-w-[70vw] drop-shadow-[0_0_18px_rgba(255,255,255,0.12)]"
          style={{ filter: "contrast(1.05)" }}
        />

        <motion.p
          initial={reduceMotion ? { opacity: 1, y: 0 } : { opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: reduceMotion ? 0 : 0.12, duration: reduceMotion ? 0 : 0.35 }}
          className="text-[11px] tracking-[0.22em] uppercase text-white/55"
          style={{ fontFamily: "'Rajdhani', sans-serif" }}
        >
          Welcome to the PSP Portfolio
        </motion.p>

        <motion.div
          initial={reduceMotion ? { opacity: 1 } : { opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: reduceMotion ? 0 : 0.25 }}
          className="w-52 max-w-[78vw] h-[3px] rounded-full bg-white/5 overflow-hidden"
        >
          <motion.div
            className="h-full rounded-full"
            style={{
              background: "linear-gradient(90deg, #0060b8, #0090ff)",
              boxShadow: "0 0 10px rgba(0,144,255,0.4)",
            }}
            initial={{ width: reduceMotion ? "100%" : "0%" }}
            animate={{ width: "100%" }}
            transition={{ duration: reduceMotion ? 0 : 4.2, ease: "easeInOut" }}
          />
        </motion.div>

        <p className="text-[9px] text-white/20 mt-1">
          Click or press <span className="text-[#6d9dff] font-bold">Enter</span> to continue
        </p>
      </div>
    </motion.div>
  );
}

