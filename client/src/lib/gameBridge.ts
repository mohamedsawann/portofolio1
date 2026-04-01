import type { MutableRefObject } from "react";

/** Handlers registered by the active mini-game (D-pad + ✕). */
export type GameBridgeHandlers = {
  dpadUp?: () => void;
  dpadDown?: () => void;
  dpadLeft?: () => void;
  dpadRight?: () => void;
  /** ✕ / Enter / Space — action, restart, or tap */
  primary?: () => void;
};

export type GameBridgeRef = MutableRefObject<GameBridgeHandlers | null>;

export const MINI_GAME_IDS = new Set(["mini-snake", "mini-catch", "mini-reaction"]);

export function isMiniGameItem(id: string): boolean {
  return MINI_GAME_IDS.has(id);
}
