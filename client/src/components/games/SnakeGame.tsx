import { useCallback, useEffect, useRef, useState } from "react";
import type { GameBridgeHandlers } from "@/lib/gameBridge";

const W = 12;
const H = 10;
const TICK_MS = 165;

type Pt = { x: number; y: number };

function randFood(snake: Pt[]): Pt {
  let p: Pt;
  do {
    p = { x: Math.floor(Math.random() * W), y: Math.floor(Math.random() * H) };
  } while (snake.some((s) => s.x === p.x && s.y === p.y));
  return p;
}

export default function SnakeGame({
  bridge,
  accent,
  variant = "default",
}: {
  bridge: { current: GameBridgeHandlers | null };
  accent: string;
  variant?: "default" | "fullscreen";
}) {
  const initial = useRef({
    snake: [
      { x: 4, y: 5 },
      { x: 3, y: 5 },
      { x: 2, y: 5 },
    ] as Pt[],
    food: randFood([
      { x: 4, y: 5 },
      { x: 3, y: 5 },
      { x: 2, y: 5 },
    ]),
    nextDir: { x: 1, y: 0 } as Pt,
    dead: false,
    score: 0,
  });

  const [, tick] = useState(0);
  const force = () => tick((n) => n + 1);

  const reset = useCallback(() => {
    const s = [
      { x: 4, y: 5 },
      { x: 3, y: 5 },
      { x: 2, y: 5 },
    ];
    initial.current = {
      snake: s,
      food: randFood(s),
      nextDir: { x: 1, y: 0 },
      dead: false,
      score: 0,
    };
    force();
  }, []);

  const turn = useCallback((dx: number, dy: number) => {
    const st = initial.current;
    if (st.dead) return;
    const nd = st.nextDir;
    if (dx === -nd.x && dy === -nd.y) return;
    st.nextDir = { x: dx, y: dy };
  }, []);

  useEffect(() => {
    bridge.current = {
      dpadUp: () => turn(0, -1),
      dpadDown: () => turn(0, 1),
      dpadLeft: () => turn(-1, 0),
      dpadRight: () => turn(1, 0),
      primary: () => {
        if (initial.current.dead) reset();
      },
    };
    return () => {
      bridge.current = null;
    };
  }, [bridge, turn, reset]);

  useEffect(() => {
    const id = window.setInterval(() => {
      const st = initial.current;
      if (st.dead) return;
      const d = st.nextDir;
      const head = { x: st.snake[0].x + d.x, y: st.snake[0].y + d.y };
      if (head.x < 0 || head.x >= W || head.y < 0 || head.y >= H) {
        st.dead = true;
        force();
        return;
      }
      if (st.snake.some((s) => s.x === head.x && s.y === head.y)) {
        st.dead = true;
        force();
        return;
      }
      const ate = head.x === st.food.x && head.y === st.food.y;
      const next = [head, ...st.snake];
      if (!ate) next.pop();
      else {
        st.score += 1;
        st.food = randFood(next);
      }
      st.snake = next;
      force();
    }, TICK_MS);
    return () => window.clearInterval(id);
  }, []);

  const st = initial.current;
  const cells = [];
  for (let y = 0; y < H; y++) {
    for (let x = 0; x < W; x++) {
      const isHead = st.snake[0]?.x === x && st.snake[0]?.y === y;
      const isBody = st.snake.slice(1).some((s) => s.x === x && s.y === y);
      const isFood = st.food.x === x && st.food.y === y;
      cells.push(
        <div
          key={`${x}-${y}`}
          className="rounded-[2px]"
          style={{
            background: isHead
              ? accent
              : isBody
                ? `${accent}99`
                : isFood
                  ? "#ffeb3b"
                  : "rgba(255,255,255,0.06)",
            boxShadow: isHead ? `0 0 6px ${accent}88` : undefined,
          }}
        />
      );
    }
  }

  const fs = variant === "fullscreen";
  return (
    <div className="select-none w-full">
      <div className="flex items-center justify-between text-[11px] sm:text-xs text-white/60 mb-2 font-mono">
        <span>Score: {st.score}</span>
        {st.dead ? (
          <span className="text-[#ff7a7a]">Game over · ✕ restart</span>
        ) : (
          <span>Arrows / D-Pad / WASD</span>
        )}
      </div>
      <div
        className={`grid gap-px p-1.5 sm:p-2 rounded-xl bg-black/60 border border-white/15 shadow-[inset_0_0_0_1px_rgba(255,255,255,0.05)] ${fs ? "w-full" : ""}`}
        style={{
          gridTemplateColumns: `repeat(${W}, minmax(0, 1fr))`,
          aspectRatio: `${W} / ${H}`,
          maxHeight: fs ? "min(58vmin, 340px)" : "min(42vmin, 200px)",
        }}
      >
        {cells}
      </div>
    </div>
  );
}
