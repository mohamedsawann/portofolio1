import { useCallback, useEffect, useRef, useState } from "react";
import type { GameBridgeHandlers } from "@/lib/gameBridge";

const LANES = 7;
const TICK_MS = 45;

export default function CatchGame({
  bridge,
  accent,
  variant = "default",
}: {
  bridge: { current: GameBridgeHandlers | null };
  accent: string;
  variant?: "default" | "fullscreen";
}) {
  const game = useRef({
    paddle: 3,
    drops: [] as { lane: number; y: number }[],
    score: 0,
    lives: 3,
    tick: 0,
  });
  const [, bump] = useState(0);
  const force = () => bump((n) => n + 1);

  const reset = useCallback(() => {
    game.current = { paddle: 3, drops: [], score: 0, lives: 3, tick: 0 };
    force();
  }, []);

  const move = useCallback((delta: -1 | 1) => {
    const g = game.current;
    if (g.lives <= 0) return;
    g.paddle = Math.max(0, Math.min(LANES - 1, g.paddle + delta));
    force();
  }, []);

  useEffect(() => {
    bridge.current = {
      dpadLeft: () => move(-1),
      dpadRight: () => move(1),
      primary: () => {
        if (game.current.lives <= 0) reset();
      },
    };
    return () => {
      bridge.current = null;
    };
  }, [bridge, move, reset]);

  useEffect(() => {
    const id = window.setInterval(() => {
      const g = game.current;
      if (g.lives <= 0) return;
      g.tick += 1;
      if (g.tick % 18 === 0) {
        g.drops.push({ lane: Math.floor(Math.random() * LANES), y: 0 });
      }
      g.drops = g.drops
        .map((d) => ({ ...d, y: d.y + 1 }))
        .filter((d) => {
          if (d.y < 14) return true;
          if (d.lane === g.paddle) {
            g.score += 1;
            return false;
          }
          g.lives -= 1;
          return false;
        });
      force();
    }, TICK_MS);
    return () => window.clearInterval(id);
  }, []);

  const g = game.current;
  const dead = g.lives <= 0;
  const fs = variant === "fullscreen";

  return (
    <div className="select-none space-y-1.5 w-full">
      <div className="flex justify-between text-[11px] sm:text-xs text-white/55 font-mono">
        <span>
          Score {g.score} · Lives {Math.max(0, g.lives)}
        </span>
        {dead ? (
          <span className="text-[#ff7a7a]">✕ to restart</span>
        ) : (
          <span>◀ ▶ / WASD</span>
        )}
      </div>
      <div
        className="relative rounded-xl border border-white/15 bg-black/50 overflow-hidden shadow-inner"
        style={{ height: fs ? "min(58vmin, 220px)" : "140px" }}
      >
        {Array.from({ length: 14 }).map((_, row) => (
          <div key={row} className="flex h-[10px] border-b border-white/[0.04]">
            {Array.from({ length: LANES }).map((__, lane) => {
              const dropHere = g.drops.some((d) => d.lane === lane && Math.floor(d.y) === row);
              return (
                <div
                  key={lane}
                  className="flex-1 border-r border-white/[0.04] last:border-r-0"
                  style={{
                    background: dropHere ? `${accent}66` : undefined,
                  }}
                />
              );
            })}
          </div>
        ))}
        <div className="absolute bottom-0 left-0 right-0 flex h-3 border-t border-white/15 bg-black/60">
          {Array.from({ length: LANES }).map((_, lane) => (
            <div
              key={lane}
              className="flex-1 flex items-end justify-center pb-0.5"
              style={{
                background: lane === g.paddle ? `${accent}44` : undefined,
              }}
            >
              {lane === g.paddle && (
                <div className="w-[70%] h-1.5 rounded-sm" style={{ background: accent }} />
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
