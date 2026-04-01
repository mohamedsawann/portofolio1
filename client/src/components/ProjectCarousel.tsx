import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";

export default function ProjectCarousel({
  images,
  accent,
  title,
  reduceMotion,
}: {
  images: string[];
  accent: string;
  title: string;
  reduceMotion: boolean;
}) {
  const [i, setI] = useState(0);
  if (!images.length) return null;

  const prev = () => setI((v) => (v <= 0 ? images.length - 1 : v - 1));
  const next = () => setI((v) => (v >= images.length - 1 ? 0 : v + 1));

  return (
    <div className="relative rounded-lg overflow-hidden border border-white/10 bg-black/35">
      <div className="relative aspect-video">
        <AnimatePresence mode="wait" initial={false}>
          <motion.img
            key={images[i]}
            src={images[i]}
            alt={`${title} screenshot ${i + 1} of ${images.length}`}
            className="absolute inset-0 w-full h-full object-cover"
            initial={reduceMotion ? { opacity: 1 } : { opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={reduceMotion ? { opacity: 1 } : { opacity: 0 }}
            transition={{ duration: reduceMotion ? 0 : 0.25 }}
          />
        </AnimatePresence>
      </div>
      {images.length > 1 && (
        <>
          <button
            type="button"
            onClick={prev}
            className="absolute left-1.5 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-black/55 border border-white/12 text-white/75 flex items-center justify-center hover:bg-black/70 focus:outline-none focus-visible:ring-2 focus-visible:ring-white/30"
            aria-label="Previous screenshot"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={next}
            className="absolute right-1.5 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-black/55 border border-white/12 text-white/75 flex items-center justify-center hover:bg-black/70 focus:outline-none focus-visible:ring-2 focus-visible:ring-white/30"
            aria-label="Next screenshot"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
          <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1">
            {images.map((_, idx) => (
              <span
                key={idx}
                className="w-1.5 h-1.5 rounded-full"
                style={{
                  background: idx === i ? accent : "rgba(255,255,255,0.25)",
                }}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
