/*
 * XMB Menu — Cross Media Bar Navigation
 * Design: Y2K Futurism / Sony XMB Interface
 * Horizontal category row + vertical item list with smooth transitions.
 * Polish: live clock, improved detail panel, better animations.
 */

import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect, useRef, type CSSProperties } from "react";
import {
  User,
  Gamepad2,
  Cpu,
  Briefcase,
  Mail,
  ExternalLink,
  Trophy,
  GraduationCap,
  Globe,
  Joystick,
  CircleHelp,
  ChevronRight,
} from "lucide-react";
import { categories, type Category, type CategoryItem, OWNER } from "@/lib/data";
import { getYoutubeEmbedUrl } from "@/lib/youtube";
import { isSoundMuted, persistSoundMuted } from "@/lib/sound";
import type { GameBridgeRef } from "@/lib/gameBridge";
import { isMiniGameItem } from "@/lib/gameBridge";
import GameFullscreenView from "@/components/games/GameFullscreenView";

const ICON_MAP: Record<string, React.ElementType> = {
  User,
  Gamepad2,
  Cpu,
  Briefcase,
  Mail,
  Joystick,
};

interface XMBMenuProps {
  activeCategoryIndex: number;
  activeItemIndex: number;
  isItemView: boolean;
  gameBridgeRef: GameBridgeRef;
  gamesPlayMode: boolean;
  reduceMotion: boolean;
  onEnterSimpleLayout: () => void;
  onExitGamePlay: () => void;
  onLaunchGame: () => void;
  onPickCategory: (index: number) => void;
  onEnterCategoryList: () => void;
  onPickItem: (index: number, options?: { enterItemView?: boolean }) => void;
}

function LiveClock() {
  const [time, setTime] = useState(new Date());
  useEffect(() => {
    const id = setInterval(() => setTime(new Date()), 30000);
    return () => clearInterval(id);
  }, []);
  return (
    <span
      className="text-[10px] sm:text-xs text-white/25 font-light tabular-nums"
      style={{ fontFamily: "'Rajdhani', sans-serif" }}
    >
      {time.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
    </span>
  );
}

function CategoryIcon({
  category,
  isActive,
  onSelect,
}: {
  category: Category;
  isActive: boolean;
  onSelect: () => void;
}) {
  const Icon = ICON_MAP[category.icon] || User;
  return (
    <motion.button
      type="button"
      layout
      onClick={onSelect}
      aria-label={`${category.label} section`}
      aria-current={isActive ? "true" : undefined}
      className="flex flex-col items-center gap-1.5 shrink-0 rounded-xl px-1.5 pt-1 pb-0.5 -mx-0.5 cursor-pointer outline-none focus-visible:ring-2 focus-visible:ring-white/35 focus-visible:ring-offset-2 focus-visible:ring-offset-[#050510] hover:bg-white/[0.05] transition-colors"
      animate={{
        scale: isActive ? 1 : 0.8,
        opacity: isActive ? 1 : 0.5,
      }}
      transition={{ type: "spring", stiffness: 380, damping: 32 }}
      whileTap={{ scale: isActive ? 0.96 : 0.75 }}
    >
      <motion.div
        className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl flex items-center justify-center pointer-events-none"
        style={{
          background: isActive
            ? `linear-gradient(135deg, ${category.color}30, ${category.color}0c)`
            : "rgba(255,255,255,0.08)",
          border: isActive
            ? `1px solid ${category.color}50`
            : "1px solid rgba(255,255,255,0.14)",
          boxShadow: isActive
            ? `0 0 24px ${category.color}18, inset 0 1px 0 rgba(255,255,255,0.06)`
            : "none",
        }}
      >
        <Icon
          size={isActive ? 22 : 16}
          style={{
            color: isActive ? category.color : "rgba(255,255,255,0.55)",
          }}
        />
      </motion.div>
      <span
        className="text-[9px] sm:text-[11px] font-semibold tracking-widest uppercase pointer-events-none"
        style={{
          fontFamily: "'Rajdhani', sans-serif",
          color: isActive ? category.color : "rgba(255,255,255,0.48)",
        }}
      >
        {category.label}
      </span>
    </motion.button>
  );
}

function ItemRow({
  item,
  isActive,
  category,
  onActivate,
}: {
  item: CategoryItem;
  isActive: boolean;
  category: Category;
  onActivate: () => void;
}) {
  return (
    <motion.div
      role="button"
      tabIndex={0}
      onClick={onActivate}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onActivate();
        }
      }}
      initial={{ opacity: 0, x: -15 }}
      animate={{
        opacity: isActive ? 1 : 0.45,
        x: 0,
        scale: isActive ? 1 : 0.98,
      }}
      transition={{ type: "spring", stiffness: 420, damping: 34 }}
      className="relative px-3 sm:px-4 py-2 sm:py-2.5 rounded-lg cursor-pointer outline-none focus-visible:ring-2 focus-visible:ring-white/30 hover:bg-white/[0.04] transition-[background,box-shadow] duration-150"
      style={{
        background: isActive
          ? `linear-gradient(90deg, ${category.color}22, ${category.color}06)`
          : "rgba(255,255,255,0.02)",
        borderLeft: isActive ? `3px solid ${category.color}` : "3px solid transparent",
        boxShadow: isActive ? `0 0 20px ${category.color}12` : undefined,
      }}
    >
      <div className="flex items-center gap-3">
        <div className="flex-1 min-w-0">
          <h3
            className="text-[13px] sm:text-sm font-semibold truncate"
            style={{
              color: isActive ? "#fff" : "rgba(255,255,255,0.45)",
              fontFamily: "'Exo 2', sans-serif",
            }}
          >
            {item.title}
          </h3>
          {item.subtitle && (
            <p
              className="text-[10px] sm:text-xs truncate mt-0.5"
              style={{
                color: isActive ? `${category.color}cc` : "rgba(255,255,255,0.25)",
                fontFamily: "'Rajdhani', sans-serif",
              }}
            >
              {item.subtitle}
            </p>
          )}
        </div>
        {(item.link || item.websiteUrl) && isActive && (
          <ExternalLink size={13} style={{ color: category.color, opacity: 0.7 }} className="shrink-0" />
        )}
      </div>
    </motion.div>
  );
}

function DetailPanel({
  item,
  category,
  gamesPlayMode,
  onLaunchGame,
  reduceMotion,
}: {
  item: CategoryItem;
  category: Category;
  gamesPlayMode: boolean;
  onLaunchGame: () => void;
  reduceMotion: boolean;
}) {
  const isSkillCategory = category.id === "skills";
  const isProjects = category.id === "projects";
  const isGames = category.id === "games";
  const embed = item.videoUrl ? getYoutubeEmbedUrl(item.videoUrl) : null;
  const site = item.websiteUrl?.trim();
  const demo = (item.demoUrl?.trim() || item.websiteUrl?.trim()) ?? "";
  const repo = item.repoUrl?.trim();
  const showMiniGame = isGames && isMiniGameItem(item.id);
  const hasMediaHint = (isProjects || isGames) && !embed && !showMiniGame;
  const isResumeUmd =
    item.id === "resume-umd" || item.id === "resume-umd-contact" || item.link?.endsWith(".pdf");
  const secondarySite =
    site && item.demoUrl?.trim() && site !== item.demoUrl.trim() ? site : null;

  return (
    <motion.div
      key={item.id}
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      transition={{ duration: reduceMotion ? 0 : 0.2 }}
      className="psp-glass rounded-lg p-3 sm:p-4 max-h-full overflow-y-auto"
    >
      <h2
        className="text-sm sm:text-base font-bold mb-0.5"
        style={{ color: "#fff", fontFamily: "'Exo 2', sans-serif" }}
      >
        {item.title}
      </h2>
      {item.subtitle && (
        <p
          className="text-[11px] sm:text-xs mb-2.5"
          style={{ color: category.color, fontFamily: "'Rajdhani', sans-serif" }}
        >
          {item.subtitle}
        </p>
      )}

      {item.description && (
        <p className="text-[11px] sm:text-xs leading-relaxed text-white/60 mb-3">
          {item.description}
        </p>
      )}

      {item.myRole && (
        <div className="mb-3">
          <p
            className="text-[9px] uppercase tracking-wider text-white/35 mb-1"
            style={{ fontFamily: "'Rajdhani', sans-serif" }}
          >
            My role
          </p>
          <p className="text-[11px] sm:text-xs text-white/70 leading-snug">{item.myRole}</p>
        </div>
      )}

      {item.tags && (
        <div className="mb-3">
          {isProjects && (
            <p
              className="text-[9px] uppercase tracking-wider text-white/30 mb-1.5"
              style={{ fontFamily: "'Rajdhani', sans-serif" }}
            >
              Tech stack
            </p>
          )}
          <div className="flex flex-wrap gap-1.5">
            {item.tags.map((tag, i) => (
              <motion.span
                key={tag}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: reduceMotion ? 0 : i * 0.05 }}
                className="px-2 py-0.5 rounded-full text-[9px] sm:text-[10px] font-medium"
                style={{
                  background: `${category.color}12`,
                  color: `${category.color}dd`,
                  border: `1px solid ${category.color}25`,
                }}
              >
                {tag}
              </motion.span>
            ))}
          </div>
        </div>
      )}

      {item.meta && (
        <div className="space-y-2">
          {Object.entries(item.meta).map(([key, value], i) => (
            <motion.div
              key={key}
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.06 }}
              className="flex items-center gap-2.5"
            >
              <span
                className="text-[9px] sm:text-[10px] font-semibold uppercase tracking-wider w-20 sm:w-24 shrink-0"
                style={{
                  color: "rgba(255,255,255,0.35)",
                  fontFamily: "'Rajdhani', sans-serif",
                }}
              >
                {key}
              </span>
              {isSkillCategory && !isNaN(Number(value)) ? (
                <div className="flex-1 flex items-center gap-2">
                  <div className="flex-1 h-[6px] rounded-full bg-white/5 overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${value}%` }}
                      transition={{
                        duration: reduceMotion ? 0 : 0.7,
                        ease: "easeOut",
                        delay: reduceMotion ? 0 : i * 0.08,
                      }}
                      className="h-full rounded-full"
                      style={{
                        background: `linear-gradient(90deg, ${category.color}cc, ${category.color}60)`,
                        boxShadow: `0 0 8px ${category.color}30`,
                      }}
                    />
                  </div>
                  <span className="text-[9px] text-white/30 w-7 text-right tabular-nums">
                    {value}%
                  </span>
                </div>
              ) : (
                <span className="text-[11px] sm:text-xs text-white/60 flex-1">{value}</span>
              )}
            </motion.div>
          ))}
        </div>
      )}

      {showMiniGame && !gamesPlayMode && (
        <div className="mt-4 space-y-2">
          <p
            className="text-[9px] uppercase tracking-wider text-white/35"
            style={{ fontFamily: "'Rajdhani', sans-serif" }}
          >
            Ready to play
          </p>
          <motion.button
            type="button"
            whileTap={{ scale: 0.98 }}
            onClick={onLaunchGame}
            className="w-full py-3 rounded-xl font-bold text-sm sm:text-base border-2 shadow-lg transition-colors"
            style={{
              borderColor: category.color,
              color: "#fff",
              background: `linear-gradient(145deg, ${category.color}35, ${category.color}12)`,
              boxShadow: `0 0 24px ${category.color}22`,
              fontFamily: "'Exo 2', sans-serif",
            }}
          >
            Launch game
          </motion.button>
          <p className="text-[9px] text-white/20 text-center leading-normal">
            Opens full-screen on the PSP display · ✕ or tap here
          </p>
        </div>
      )}

      {(embed || hasMediaHint) && (
        <div className="mt-3 space-y-2">
          <p
            className="text-[9px] uppercase tracking-wider text-white/30"
            style={{ fontFamily: "'Rajdhani', sans-serif" }}
          >
            {isProjects ? "Project media" : "Game"}
          </p>
          {embed ? (
            <div
              className="relative w-full rounded-lg overflow-hidden border border-white/10 bg-black/40"
              style={{ aspectRatio: "16 / 9" }}
            >
              <iframe
                title={`${item.title} video`}
                src={`${embed}?rel=0`}
                className="absolute inset-0 w-full h-full border-0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
              />
            </div>
          ) : (
            <div className="rounded-lg border border-dashed border-white/15 bg-white/[0.03] px-3 py-6 text-center">
              <p className="text-[10px] text-white/35 leading-relaxed">
                {isProjects
                  ? "Add a YouTube link in `videoUrl` inside `client/src/lib/data.ts` to embed a walkthrough or demo."
                  : "Drop in an iframe, `websiteUrl`, or `videoUrl` for this game when you are ready."}
              </p>
            </div>
          )}
        </div>
      )}

      <div className="flex flex-wrap gap-2 mt-3">
        {isProjects && demo && demo !== "#" && (
          <motion.a
            href={demo}
            target="_blank"
            rel="noopener noreferrer"
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[11px] font-medium transition-all"
            style={{
              background: `${category.color}18`,
              color: category.color,
              border: `1px solid ${category.color}30`,
            }}
          >
            Live demo
            <ExternalLink size={11} />
          </motion.a>
        )}
        {isProjects && repo && (
          <motion.a
            href={repo}
            target="_blank"
            rel="noopener noreferrer"
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[11px] font-medium transition-all"
            style={{
              background: `${category.color}12`,
              color: category.color,
              border: `1px solid ${category.color}22`,
            }}
          >
            Repository
            <ExternalLink size={11} />
          </motion.a>
        )}
        {secondarySite && secondarySite !== "#" && (
          <motion.a
            href={secondarySite}
            target="_blank"
            rel="noopener noreferrer"
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[11px] font-medium transition-all"
            style={{
              background: `${category.color}10`,
              color: category.color,
              border: `1px solid ${category.color}20`,
            }}
          >
            Project site
            <ExternalLink size={11} />
          </motion.a>
        )}
        {!isProjects && site && site !== "#" && (
          <motion.a
            href={site}
            target="_blank"
            rel="noopener noreferrer"
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[11px] font-medium transition-all"
            style={{
              background: `${category.color}18`,
              color: category.color,
              border: `1px solid ${category.color}30`,
            }}
          >
            {isGames ? "Play / open" : "Open"}
            <ExternalLink size={11} />
          </motion.a>
        )}
        {item.link && (!isProjects || isResumeUmd) && (!site || site === "#" || isResumeUmd) && (
          <motion.a
            href={item.link}
            {...(isResumeUmd ? { download: "resume.pdf" } : { target: "_blank", rel: "noopener noreferrer" })}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[11px] font-medium transition-all"
            style={{
              background: `${category.color}15`,
              color: category.color,
              border: `1px solid ${category.color}25`,
            }}
          >
            {isResumeUmd ? "Download UMD (PDF)" : "Open"}{" "}
            {!isResumeUmd && <ExternalLink size={11} />}
          </motion.a>
        )}
      </div>
    </motion.div>
  );
}

function OpenPrompt({ color, onClick }: { color: string; onClick: () => void }) {
  const style: CSSProperties = {
    borderColor: `${color}35`,
    background: `${color}10`,
    color: `${color}dd`,
    fontFamily: "'Rajdhani', sans-serif",
  };
  return (
    <motion.button
      type="button"
      whileTap={{ scale: 0.97 }}
      onClick={onClick}
      className="inline-flex items-center gap-2 mt-3 px-3 py-1.5 rounded-full border text-[10px] sm:text-[11px] cursor-pointer transition-colors hover:bg-white/[0.08] focus:outline-none focus-visible:ring-2 focus-visible:ring-white/30"
      style={style}
    >
      <span className="font-semibold tracking-wide uppercase opacity-90">Open list</span>
      <span className="text-white/50">·</span>
      <span className="text-white/45">click</span>
      <span className="text-white/35">or</span>
      <span className="text-[#6d9dff] font-bold">✕</span>
    </motion.button>
  );
}

export default function XMBMenu({
  activeCategoryIndex,
  activeItemIndex,
  isItemView,
  gameBridgeRef,
  gamesPlayMode,
  reduceMotion,
  onEnterSimpleLayout,
  onExitGamePlay,
  onLaunchGame,
  onPickCategory,
  onEnterCategoryList,
  onPickItem,
}: XMBMenuProps) {
  const activeCategory = categories[activeCategoryIndex];
  const activeItem = activeCategory.items[activeItemIndex];
  const [helpOpen, setHelpOpen] = useState(false);
  const [uiSoundMuted, setUiSoundMuted] = useState(() => isSoundMuted());
  const activeRowRef = useRef<HTMLDivElement | null>(null);
  const showGameFullscreen =
    gamesPlayMode &&
    isItemView &&
    activeCategory.id === "games" &&
    activeItem &&
    isMiniGameItem(activeItem.id);

  useEffect(() => {
    if (!isItemView) return;
    const t = window.setTimeout(() => {
      activeRowRef.current?.scrollIntoView({ block: "nearest", behavior: "smooth" });
    }, 50);
    return () => window.clearTimeout(t);
  }, [activeItemIndex, isItemView, activeCategoryIndex]);

  return (
    <div
      className={`absolute inset-0 flex flex-col justify-center overflow-hidden pb-10 sm:pb-11 ${helpOpen ? "pt-[6.8rem] sm:pt-24" : "pt-9 sm:pt-9"}`}
    >
      <AnimatePresence>
        {showGameFullscreen && activeItem && (
          <GameFullscreenView
            key={activeItem.id}
            title={activeItem.title}
            accent={activeCategory.color}
            itemId={activeItem.id}
            gameBridgeRef={gameBridgeRef}
            onExit={onExitGamePlay}
          />
        )}
      </AnimatePresence>

      {!showGameFullscreen && (
        <>
      {/* Status bar + optional help */}
      <div className="absolute top-2 sm:top-3 left-3 sm:left-4 right-3 sm:right-4 z-20 flex flex-col gap-1.5">
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2 min-w-0">
            <span
              className="text-[10px] sm:text-xs text-white/30 font-light truncate"
              style={{ fontFamily: "'Rajdhani', sans-serif" }}
            >
              {OWNER.name}
            </span>
            <button
              type="button"
              onClick={() => setHelpOpen((v) => !v)}
              className={`shrink-0 flex items-center justify-center w-7 h-7 rounded-lg border transition-colors ${helpOpen ? "bg-white/10 border-white/18 text-white/80" : "bg-white/[0.04] border-white/10 text-white/40 hover:text-white/60 hover:bg-white/[0.07]"}`}
              aria-expanded={helpOpen}
              aria-label={helpOpen ? "Close controls help" : "Open controls help"}
            >
              <CircleHelp className="w-3.5 h-3.5" strokeWidth={2} />
            </button>
          </div>
          <div className="flex items-center gap-2.5 shrink-0">
            <LiveClock />
            <div className="flex items-center gap-0.5">
              <div className="w-5 h-2.5 rounded-[2px] border border-white/15 flex items-center p-[2px]">
                <div
                  className="w-full h-full rounded-[1px]"
                  style={{
                    background: "linear-gradient(90deg, #00c853, #00e676)",
                    boxShadow: "0 0 4px rgba(0,200,83,0.3)",
                  }}
                />
              </div>
              <div className="w-[2px] h-1.5 rounded-r-sm bg-white/15" />
            </div>
          </div>
        </div>

        <AnimatePresence initial={false}>
          {helpOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: reduceMotion ? 0 : 0.22 }}
              className="overflow-hidden rounded-lg border border-white/10 bg-black/45 backdrop-blur-md"
            >
              <div
                className="px-3 py-2.5 space-y-2 text-[10px] sm:text-[11px] text-white/55 leading-snug"
                style={{ fontFamily: "'Rajdhani', sans-serif" }}
              >
                <ul className="space-y-1.5">
                  <li>
                    <span className="text-white/70 font-semibold">Browse:</span> click the icons or use{" "}
                    <kbd className="px-1 rounded bg-white/8 border border-white/10">←</kbd>
                    <kbd className="px-1 rounded bg-white/8 border border-white/10 ml-0.5">→</kbd> — then{" "}
                    <span className="text-[#6d9dff] font-bold">✕</span> / Enter or tap the card to open.
                  </li>
                  <li>
                    <span className="text-white/70 font-semibold">Inside a list:</span>{" "}
                    <kbd className="px-1 rounded bg-white/8 border border-white/10">↑</kbd>
                    <kbd className="px-1 rounded bg-white/8 border border-white/10 ml-0.5">↓</kbd> move · tap
                    a row on touch.
                  </li>
                  <li>
                    <span className="text-white/70 font-semibold">Back:</span>{" "}
                    <span className="text-[#ff7a7a] font-bold">○</span> or Esc ·{" "}
                    <span className="text-white/70 font-semibold">Sleep:</span> Power or{" "}
                    <kbd className="px-1 rounded bg-white/8 border border-white/10">P</kbd>
                  </li>
                </ul>
                <div className="rounded-md border border-white/8 bg-white/[0.03] p-2">
                  <p className="text-white/50 font-semibold uppercase tracking-wide text-[9px] mb-1.5">
                    Keyboard map
                  </p>
                  <div className="grid grid-cols-2 gap-x-3 gap-y-1 text-[9px] sm:text-[10px]">
                    <span className="text-white/35">D-pad</span>
                    <span>
                      <kbd className="px-1 rounded bg-white/8 border border-white/10">↑</kbd>
                      <kbd className="px-1 rounded bg-white/8 border border-white/10 ml-0.5">↓</kbd>
                      <kbd className="px-1 rounded bg-white/8 border border-white/10 ml-0.5">←</kbd>
                      <kbd className="px-1 rounded bg-white/8 border border-white/10 ml-0.5">→</kbd>
                    </span>
                    <span className="text-white/35">Move (alt)</span>
                    <span>
                      <kbd className="px-1 rounded bg-white/8 border border-white/10">W</kbd>
                      <kbd className="px-1 rounded bg-white/8 border border-white/10 ml-0.5">A</kbd>
                      <kbd className="px-1 rounded bg-white/8 border border-white/10 ml-0.5">S</kbd>
                      <kbd className="px-1 rounded bg-white/8 border border-white/10 ml-0.5">D</kbd>
                    </span>
                    <span className="text-white/35 text-[#6d9dff]">✕ Confirm</span>
                    <span>
                      <kbd className="px-1 rounded bg-white/8 border border-white/10">Enter</kbd>
                      <span className="text-white/25 mx-0.5">·</span>
                      <kbd className="px-1 rounded bg-white/8 border border-white/10">Space</kbd>
                    </span>
                    <span className="text-white/35 text-[#ff7a7a]">○ Back</span>
                    <span>
                      <kbd className="px-1 rounded bg-white/8 border border-white/10">Esc</kbd>
                    </span>
                  </div>
                </div>
                <div className="flex items-center justify-between gap-2 rounded-md border border-white/8 bg-white/[0.03] px-2 py-1.5">
                  <span className="text-white/50">UI sounds</span>
                  <button
                    type="button"
                    onClick={() => {
                      const next = !uiSoundMuted;
                      persistSoundMuted(next);
                      setUiSoundMuted(next);
                    }}
                    className="text-[10px] font-semibold uppercase tracking-wide px-2 py-1 rounded-md border border-white/12 bg-white/[0.06] text-white/75 hover:bg-white/10 focus:outline-none focus-visible:ring-2 focus-visible:ring-white/25"
                    aria-pressed={uiSoundMuted}
                  >
                    {uiSoundMuted ? "Off" : "On"}
                  </button>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setHelpOpen(false);
                    onEnterSimpleLayout();
                  }}
                  className="w-full py-2 rounded-lg border border-white/12 bg-white/[0.06] text-[10px] font-semibold uppercase tracking-wide text-white/70 hover:bg-white/10 focus:outline-none focus-visible:ring-2 focus-visible:ring-white/25"
                >
                  Simple layout (accessibility)
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Category Row (horizontal, scroll on narrow screens) */}
      <div className="relative z-10 mb-1.5 sm:mb-3 -mx-1 px-1 overflow-x-auto overflow-y-visible [scrollbar-width:thin] pb-1">
        <motion.div
          className="flex items-end justify-center gap-4 sm:gap-7 md:gap-9 px-2 w-max min-w-full sm:w-auto sm:min-w-0 sm:mx-auto"
          transition={{ type: "spring", stiffness: 200, damping: 25 }}
        >
          {categories.map((cat, i) => (
            <CategoryIcon
              key={cat.id}
              category={cat}
              isActive={i === activeCategoryIndex}
              onSelect={() => onPickCategory(i)}
            />
          ))}
        </motion.div>
      </div>

      {/* Divider + breadcrumb (list mode) */}
      <div className="relative z-10 mx-3 sm:mx-8 mb-1.5 sm:mb-2.5 space-y-1.5 sm:space-y-2">
        <div className="h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
        {isItemView && activeItem && (
          <motion.div
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center gap-1 text-[10px] sm:text-[11px] text-white/40 px-1"
            style={{ fontFamily: "'Rajdhani', sans-serif" }}
          >
            <button
              type="button"
              onClick={() => onPickCategory(activeCategoryIndex)}
              className="font-semibold uppercase tracking-wider rounded px-1 -mx-1 py-0.5 hover:bg-white/10 focus:outline-none focus-visible:ring-1 focus-visible:ring-white/25 cursor-pointer"
              style={{ color: activeCategory.color }}
            >
              {activeCategory.label}
            </button>
            <ChevronRight className="w-3 h-3 opacity-50 shrink-0 pointer-events-none" />
            <span className="text-white/55 truncate font-medium">{activeItem.title}</span>
          </motion.div>
        )}
      </div>

      {/* Content area */}
      <AnimatePresence mode="wait">
        {isItemView ? (
          <motion.div
            key={`detail-${activeCategory.id}`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: reduceMotion ? 0 : 0.15 }}
            className="relative z-10 flex-1 min-h-0 px-2.5 sm:px-5 flex flex-col sm:flex-row gap-2.5 sm:gap-4 min-h-[7rem]"
          >
            {/* Items list (left) */}
            <div className="w-full sm:w-[34%] max-h-[34%] sm:max-h-none flex flex-col gap-1 overflow-y-auto pr-1 [scrollbar-width:thin]">
              {activeCategory.items.map((item, i) => (
                <div
                  key={item.id}
                  ref={i === activeItemIndex ? activeRowRef : undefined}
                  className="scroll-mt-1"
                >
                  <ItemRow
                    item={item}
                    isActive={i === activeItemIndex}
                    category={activeCategory}
                    onActivate={() => onPickItem(i, { enterItemView: true })}
                  />
                </div>
              ))}
            </div>

            {/* Detail panel (right) */}
            <div className="flex-1 min-w-0 min-h-0">
              <AnimatePresence mode="wait">
                <DetailPanel
                  key={activeItem.id}
                  item={activeItem}
                  category={activeCategory}
                  gamesPlayMode={gamesPlayMode}
                  onLaunchGame={onLaunchGame}
                  reduceMotion={reduceMotion}
                />
              </AnimatePresence>
            </div>
          </motion.div>
        ) : (
          <motion.div
            key={`preview-${activeCategory.id}`}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: reduceMotion ? 0 : 0.2 }}
            className="relative z-10 flex-1 min-h-0 px-4 sm:px-8 flex items-start"
          >
            {/* Preview: profile card or category summary */}
            {activeCategory.id === "profile" ? (
              <div className="w-full space-y-2">
                <button
                  type="button"
                  onClick={onEnterCategoryList}
                  className="flex flex-col items-start w-full text-left rounded-xl p-2 -m-2 hover:bg-white/[0.04] transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-white/25 cursor-pointer"
                >
                  <div className="min-w-0 w-full">
                    <motion.h2
                      className="text-lg sm:text-xl font-bold text-white"
                      style={{ fontFamily: "'Exo 2', sans-serif" }}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.08 }}
                    >
                      {OWNER.name}
                    </motion.h2>
                    <motion.p
                      className="text-sm sm:text-base mt-0.5"
                      style={{
                        color: activeCategory.color,
                        fontFamily: "'Rajdhani', sans-serif",
                      }}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.12 }}
                    >
                      {OWNER.title}
                    </motion.p>
                    <motion.p
                      className="text-[11px] text-white/35 mt-1"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.16 }}
                    >
                      {OWNER.tagline}
                    </motion.p>
                    <motion.div
                      className="flex items-center gap-3 mt-2.5"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.2 }}
                    >
                      <div className="flex items-center gap-1.5">
                        <GraduationCap size={12} className="text-white/25" />
                        <span className="text-[10px] text-white/30">GPA 3.72</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Trophy size={12} className="text-white/25" />
                        <span className="text-[10px] text-white/30">Hackathon Winner</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Globe size={12} className="text-white/25" />
                        <span className="text-[10px] text-white/30">Riyadh, SA</span>
                      </div>
                    </motion.div>
                  </div>
                </button>
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.22 }}>
                  <OpenPrompt color={activeCategory.color} onClick={onEnterCategoryList} />
                </motion.div>
              </div>
            ) : (
              <div className="w-full">
                <button
                  type="button"
                  onClick={onEnterCategoryList}
                  className="flex items-center gap-2 mb-2 w-full text-left rounded-lg p-1.5 -ml-1.5 hover:bg-white/[0.04] transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-white/25 cursor-pointer"
                >
                  <h2
                    className="text-base sm:text-lg font-bold"
                    style={{
                      color: activeCategory.color,
                      fontFamily: "'Exo 2', sans-serif",
                    }}
                  >
                    {activeCategory.label}
                  </h2>
                  <span className="text-[10px] text-white/25 font-medium" style={{ fontFamily: "'Rajdhani', sans-serif" }}>
                    {activeCategory.items.length} items · tap to open all
                  </span>
                </button>
                <div className="space-y-1 max-h-[min(42vh,14rem)] overflow-y-auto pr-1 [scrollbar-width:thin]">
                  {activeCategory.items.map((item, i) => (
                    <motion.button
                      type="button"
                      key={item.id}
                      initial={{ opacity: 0, x: -8 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: Math.min(i * 0.03, 0.15) }}
                      onClick={() => onPickItem(i, { enterItemView: true })}
                      className="flex w-full items-center gap-2.5 text-left text-xs rounded-md py-1.5 px-1.5 -mx-1 hover:bg-white/[0.06] transition-colors cursor-pointer border border-transparent hover:border-white/8"
                    >
                      <div
                        className="w-1.5 h-1.5 rounded-full shrink-0"
                        style={{ background: `${activeCategory.color}80` }}
                      />
                      <span className="truncate text-white/50">{item.title}</span>
                      {item.subtitle && (
                        <span className="text-[10px] text-white/22 truncate hidden sm:inline">
                          — {item.subtitle}
                        </span>
                      )}
                    </motion.button>
                  ))}
                </div>
                <motion.div className="mt-2" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.12 }}>
                  <OpenPrompt color={activeCategory.color} onClick={onEnterCategoryList} />
                </motion.div>
                <p className="text-[9px] text-white/18 mt-2 max-w-md">
                  Tip: tap the section title or any row. Add demo / YouTube links in your data file for projects.
                </p>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Bottom: one calm hint row */}
      <div
        className="absolute bottom-2 sm:bottom-2.5 left-3 sm:left-4 right-3 sm:right-4 z-20 hidden xs:flex flex-wrap items-center justify-center sm:justify-between gap-x-2 gap-y-1 text-[8px] sm:text-[9px] text-white/26"
        style={{ fontFamily: "'Rajdhani', sans-serif" }}
      >
        <span className="tabular-nums whitespace-nowrap">
          {isItemView ? (
            <>
              <kbd className="px-1 py-0.5 rounded bg-white/[0.07] border border-white/10">↑↓</kbd> items ·{" "}
              <span className="text-[#6d9dff] font-bold">✕</span> open link ·{" "}
              <span className="text-[#ff7a7a] font-bold">○</span> back
            </>
          ) : (
            <>
              <kbd className="px-1 py-0.5 rounded bg-white/[0.07] border border-white/10">←→</kbd> sections ·{" "}
              <span className="text-[#6d9dff] font-bold">✕</span> enter
            </>
          )}
        </span>
        <span className="whitespace-nowrap text-white/22 hidden sm:inline" aria-hidden>
          ·
        </span>
        <span className="whitespace-nowrap text-white/22">
          <kbd className="px-1 py-0.5 rounded bg-white/[0.07] border border-white/10">P</kbd> sleep
        </span>
      </div>
        </>
      )}
    </div>
  );
}
