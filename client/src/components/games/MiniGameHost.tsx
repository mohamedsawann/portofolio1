import type { GameBridgeRef } from "@/lib/gameBridge";
import { isMiniGameItem } from "@/lib/gameBridge";
import SnakeGame from "@/components/games/SnakeGame";
import CatchGame from "@/components/games/CatchGame";
import ReactionGame from "@/components/games/ReactionGame";

export type MiniGameVariant = "default" | "fullscreen";

export default function MiniGameHost({
  itemId,
  gameBridgeRef,
  accent,
  variant = "default",
}: {
  itemId: string;
  gameBridgeRef: GameBridgeRef;
  accent: string;
  variant?: MiniGameVariant;
}) {
  if (!isMiniGameItem(itemId)) return null;
  switch (itemId) {
    case "mini-snake":
      return <SnakeGame bridge={gameBridgeRef} accent={accent} variant={variant} />;
    case "mini-catch":
      return <CatchGame bridge={gameBridgeRef} accent={accent} variant={variant} />;
    case "mini-reaction":
      return <ReactionGame bridge={gameBridgeRef} accent={accent} variant={variant} />;
    default:
      return null;
  }
}
