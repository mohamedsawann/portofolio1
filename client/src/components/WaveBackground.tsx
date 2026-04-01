/*
 * Wave Background — Animated PSP-style wave backdrop
 * Design: Y2K Futurism / Sony XMB Interface
 * Crossfades between different colored wave images based on the active category.
 * Polish: slow pan animation, improved layering, subtle parallax feel.
 */

import { motion, AnimatePresence } from "framer-motion";
import { WAVE_BACKGROUNDS } from "@/lib/data";

interface WaveBackgroundProps {
  bgKey: keyof typeof WAVE_BACKGROUNDS;
  reduceMotion?: boolean;
}

export default function WaveBackground({ bgKey, reduceMotion = false }: WaveBackgroundProps) {
  const drift = reduceMotion
    ? {}
    : {
        x: [0, 8, 0, -8, 0],
        y: [0, -4, 0, 4, 0],
      };

  return (
    <div className="absolute inset-0 z-0 overflow-hidden">
      {/* Base dark gradient */}
      <div
        className="absolute inset-0"
        style={{
          background: "linear-gradient(180deg, #030308 0%, #080814 50%, #030308 100%)",
        }}
      />

      {/* Wave image with crossfade + slow drift */}
      <AnimatePresence mode="popLayout">
        <motion.div
          key={bgKey}
          className="absolute inset-[-10%]"
          initial={reduceMotion ? { opacity: 0.55, scale: 1 } : { opacity: 0, scale: 1.05 }}
          animate={{
            opacity: 0.55,
            scale: 1,
            ...drift,
          }}
          exit={{ opacity: 0 }}
          transition={{
            opacity: { duration: reduceMotion ? 0.15 : 0.8 },
            scale: { duration: reduceMotion ? 0 : 1.2 },
            ...(reduceMotion
              ? {}
              : {
                  x: { duration: 30, repeat: Infinity, ease: "linear" as const },
                  y: { duration: 20, repeat: Infinity, ease: "linear" as const },
                }),
          }}
        >
          <img
            src={WAVE_BACKGROUNDS[bgKey]}
            alt=""
            className="w-full h-full object-cover"
            style={{ filter: "blur(2px) saturate(1.1)" }}
          />
          {/* Gradient overlay for text readability */}
          <div
            className="absolute inset-0"
            style={{
              background:
                "linear-gradient(180deg, rgba(3,3,8,0.75) 0%, rgba(3,3,8,0.25) 35%, rgba(3,3,8,0.2) 65%, rgba(3,3,8,0.75) 100%)",
            }}
          />
        </motion.div>
      </AnimatePresence>

      {/* Vignette for depth */}
      <div
        className="absolute inset-0 z-[1]"
        style={{
          background:
            "radial-gradient(ellipse 90% 80% at 50% 50%, transparent 40%, rgba(3,3,8,0.85) 100%)",
        }}
      />
    </div>
  );
}
