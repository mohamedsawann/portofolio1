/*
 * Brief power-down sequence before System standby.
 */

import { motion } from "framer-motion";

export default function ShutdownScreen() {
  return (
    <motion.div
      className="absolute inset-0 z-50 flex flex-col items-center justify-center bg-[#030308]"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.2 }}
    >
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 55% 45% at 50% 50%, rgba(0,112,209,0.06) 0%, transparent 70%)",
        }}
      />
      <motion.p
        className="relative text-[12px] tracking-[0.35em] uppercase text-white/35"
        style={{ fontFamily: "'Rajdhani', sans-serif" }}
        animate={{ opacity: [0.4, 0.9, 0.4] }}
        transition={{ duration: 1.2, repeat: Infinity, ease: "easeInOut" }}
      >
        Shutting down…
      </motion.p>
    </motion.div>
  );
}
