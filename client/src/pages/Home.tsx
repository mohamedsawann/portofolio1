/*
 * Home Page — PSP Portfolio Main Screen
 * Power on/off, keyboard + shell controls, XMB navigation.
 */

import { lazy, Suspense, useState, useCallback, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import PSPShell from "@/components/PSPShell";
import XMBMenu from "@/components/XMBMenu";
import BootScreen from "@/components/BootScreen";
import WaveBackground from "@/components/WaveBackground";
import PowerOffScreen from "@/components/PowerOffScreen";
import ShutdownScreen from "@/components/ShutdownScreen";
import WebsiteIntroScreen from "@/components/WebsiteIntroScreen";
import PreloadAssets from "@/components/PreloadAssets";
import BuildSecretsModal from "@/components/BuildSecretsModal";
import SimplePortfolio, {
  readSimpleLayoutPref,
  writeSimpleLayoutPref,
} from "@/pages/SimplePortfolio";
import { categories } from "@/lib/data";
import type { GameBridgeHandlers } from "@/lib/gameBridge";
import { isMiniGameItem } from "@/lib/gameBridge";
import { playBack, playConfirm, playDpadTick, playPowerOff, playPowerOn } from "@/lib/sound";
import { useReducedMotion } from "@/lib/useReducedMotion";
import { useLocalNight } from "@/lib/useLocalNight";

const KONAMI_CODES = [
  "ArrowUp",
  "ArrowUp",
  "ArrowDown",
  "ArrowDown",
  "ArrowLeft",
  "ArrowRight",
  "ArrowLeft",
  "ArrowRight",
  "Enter",
  "Enter",
] as const;

const ThreeSpaceBackdrop = lazy(() => import("@/components/ThreeSpaceBackdrop"));
const SpaceExplorerModal = lazy(() => import("@/components/SpaceExplorerModal"));

function konamiCodeMatches(hardwareCode: string, expected: string): boolean {
  if (expected === "Enter" && (hardwareCode === "Enter" || hardwareCode === "NumpadEnter")) {
    return true;
  }
  return hardwareCode === expected;
}

function resolveOpenUrl(item: (typeof categories)[0]["items"][0]) {
  if (item.websiteUrl?.trim()) return item.websiteUrl.trim();
  if (item.link?.trim()) return item.link.trim();
  return null;
}

function supportsWebGL(): boolean {
  if (typeof window === "undefined") return false;
  try {
    const c = document.createElement("canvas");
    return Boolean(c.getContext("webgl2") || c.getContext("webgl"));
  } catch {
    return false;
  }
}

export default function Home() {
  const [devicePowered, setDevicePowered] = useState(false);
  const [shuttingDown, setShuttingDown] = useState(false);
  const [bootCycle, setBootCycle] = useState(0);
  const [booted, setBooted] = useState(false);
  const [activeCategoryIndex, setActiveCategoryIndex] = useState(0);
  const [activeItemIndex, setActiveItemIndex] = useState(0);
  const [isItemView, setIsItemView] = useState(false);
  const [gamesPlayMode, setGamesPlayMode] = useState(false);
  const bootedRef = useRef(false);
  const gameBridgeRef = useRef<GameBridgeHandlers | null>(null);
  const [websiteIntroDone, setWebsiteIntroDone] = useState(false);
  const [simpleLayout, setSimpleLayout] = useState(false);
  const [buildSecretsOpen, setBuildSecretsOpen] = useState(false);
  const [spaceExploreOpen, setSpaceExploreOpen] = useState(false);
  const [webglEnabled, setWebglEnabled] = useState(false);
  const konamiIdxRef = useRef(0);
  const reduceMotion = useReducedMotion();
  const nightMode = useLocalNight();

  const activeCategory = categories[activeCategoryIndex];

  useEffect(() => {
    setSimpleLayout(readSimpleLayoutPref());
  }, []);

  useEffect(() => {
    document.documentElement.dataset.reduceMotion = reduceMotion ? "on" : "off";
  }, [reduceMotion]);

  useEffect(() => {
    setWebglEnabled(supportsWebGL());
  }, []);

  const enterSimpleLayout = useCallback(() => {
    writeSimpleLayoutPref(true);
    setSimpleLayout(true);
  }, []);

  const powerOn = useCallback(() => {
    playPowerOn();
    setDevicePowered(true);
    setBootCycle((c) => c + 1);
    setBooted(false);
    bootedRef.current = false;
  }, []);

  const powerOff = useCallback(() => {
    if (!devicePowered) return;
    setSpaceExploreOpen(false);
    playPowerOff();
    if (!booted) {
      setDevicePowered(false);
      bootedRef.current = false;
      setIsItemView(false);
      setGamesPlayMode(false);
      setActiveCategoryIndex(0);
      setActiveItemIndex(0);
      return;
    }
    setShuttingDown(true);
    window.setTimeout(() => {
      setDevicePowered(false);
      setBooted(false);
      bootedRef.current = false;
      setShuttingDown(false);
      setIsItemView(false);
      setGamesPlayMode(false);
      setActiveCategoryIndex(0);
      setActiveItemIndex(0);
    }, 1100);
  }, [devicePowered, booted]);

  const togglePower = useCallback(() => {
    if (shuttingDown) return;
    if (!devicePowered) powerOn();
    else powerOff();
  }, [devicePowered, shuttingDown, powerOn, powerOff]);

  const handleBootComplete = useCallback(() => {
    if (!bootedRef.current) {
      bootedRef.current = true;
      setBooted(true);
    }
  }, []);

  const navigateLeft = useCallback(() => {
    if (!devicePowered || !booted || shuttingDown) return;
    playDpadTick();
    if (gameBridgeRef.current?.dpadLeft) {
      gameBridgeRef.current.dpadLeft();
      return;
    }
    if (gamesPlayMode) return;
    if (isItemView) {
      setIsItemView(false);
      setActiveItemIndex(0);
      return;
    }
    setActiveCategoryIndex((prev) =>
      prev > 0 ? prev - 1 : categories.length - 1
    );
    setActiveItemIndex(0);
  }, [devicePowered, booted, shuttingDown, isItemView, gamesPlayMode]);

  const navigateRight = useCallback(() => {
    if (!devicePowered || !booted || shuttingDown) return;
    playDpadTick();
    if (gameBridgeRef.current?.dpadRight) {
      gameBridgeRef.current.dpadRight();
      return;
    }
    if (isItemView) return;
    setActiveCategoryIndex((prev) =>
      prev < categories.length - 1 ? prev + 1 : 0
    );
    setActiveItemIndex(0);
  }, [devicePowered, booted, shuttingDown, isItemView]);

  const navigateUp = useCallback(() => {
    if (!devicePowered || !booted || shuttingDown || !isItemView) return;
    playDpadTick();
    if (gameBridgeRef.current?.dpadUp) {
      gameBridgeRef.current.dpadUp();
      return;
    }
    const itemId = categories[activeCategoryIndex].items[activeItemIndex]?.id ?? "";
    if (categories[activeCategoryIndex].id === "games" && isMiniGameItem(itemId)) {
      return;
    }
    setActiveItemIndex((prev) => (prev > 0 ? prev - 1 : prev));
  }, [devicePowered, booted, shuttingDown, isItemView, activeCategoryIndex, activeItemIndex]);

  const navigateDown = useCallback(() => {
    if (!devicePowered || !booted || shuttingDown || !isItemView) return;
    playDpadTick();
    if (gameBridgeRef.current?.dpadDown) {
      gameBridgeRef.current.dpadDown();
      return;
    }
    const itemId = categories[activeCategoryIndex].items[activeItemIndex]?.id ?? "";
    if (categories[activeCategoryIndex].id === "games" && isMiniGameItem(itemId)) {
      return;
    }
    setActiveItemIndex((prev) => {
      const maxIndex = categories[activeCategoryIndex].items.length - 1;
      return prev < maxIndex ? prev + 1 : prev;
    });
  }, [devicePowered, booted, shuttingDown, isItemView, activeCategoryIndex, activeItemIndex]);

  const handleSelect = useCallback(() => {
    if (shuttingDown) return;
    if (!devicePowered) {
      powerOn();
      return;
    }
    if (!booted) {
      handleBootComplete();
      return;
    }
    if (!isItemView) {
      playConfirm();
      setIsItemView(true);
      setActiveItemIndex(0);
      return;
    }
    const cat = categories[activeCategoryIndex];
    const item = cat.items[activeItemIndex];
    if (item && cat.id === "games" && isMiniGameItem(item.id) && !gamesPlayMode) {
      playConfirm();
      setGamesPlayMode(true);
      return;
    }
    playConfirm();
    if (gameBridgeRef.current?.primary) {
      gameBridgeRef.current.primary();
      return;
    }
    if (!item) return;
    const url = resolveOpenUrl(item);
    if (url && url !== "#") {
      window.open(url, "_blank", "noopener,noreferrer");
    }
  }, [
    shuttingDown,
    devicePowered,
    booted,
    isItemView,
    activeCategoryIndex,
    activeItemIndex,
    gamesPlayMode,
    powerOn,
    handleBootComplete,
  ]);

  const handleBack = useCallback(() => {
    if (!devicePowered || !booted || shuttingDown) return;
    if (gamesPlayMode) {
      playBack();
      setGamesPlayMode(false);
      return;
    }
    if (isItemView) {
      playBack();
      setIsItemView(false);
      setActiveItemIndex(0);
    }
  }, [devicePowered, booted, shuttingDown, gamesPlayMode, isItemView]);

  const goToItem = useCallback(
    (index: number, enterList?: boolean) => {
      if (!devicePowered || !booted || shuttingDown) return;
      setGamesPlayMode((prev) => (index !== activeItemIndex ? false : prev));
      setActiveItemIndex(index);
      if (enterList) setIsItemView(true);
    },
    [devicePowered, booted, shuttingDown, activeItemIndex]
  );

  const selectCategory = useCallback(
    (index: number) => {
      if (!devicePowered || !booted || shuttingDown) return;
      setActiveCategoryIndex(index);
      setActiveItemIndex(0);
      setIsItemView(false);
      setGamesPlayMode(false);
    },
    [devicePowered, booted, shuttingDown]
  );

  const enterCategoryList = useCallback(() => {
    if (!devicePowered || !booted || shuttingDown) return;
    if (isItemView) return;
    setIsItemView(true);
    setActiveItemIndex(0);
  }, [devicePowered, booted, shuttingDown, isItemView]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!websiteIntroDone) {
        if (e.key === "Enter" || e.key === " " || e.key === "Escape" || e.key === "Backspace") {
          e.preventDefault();
          setWebsiteIntroDone(true);
        }
        return;
      }

      const target = e.target as HTMLElement | null;
      const typing =
        target?.closest &&
        target.closest("input, textarea, select, [contenteditable=true]");

      if (
        simpleLayout &&
        !typing &&
        !e.metaKey &&
        !e.ctrlKey &&
        !buildSecretsOpen
      ) {
        const expected = KONAMI_CODES[konamiIdxRef.current];
        if (konamiCodeMatches(e.code, expected)) {
          konamiIdxRef.current += 1;
          e.preventDefault();
          if (konamiIdxRef.current >= KONAMI_CODES.length) {
            konamiIdxRef.current = 0;
            setBuildSecretsOpen(true);
          }
          return;
        }
        konamiIdxRef.current = konamiCodeMatches(e.code, KONAMI_CODES[0]) ? 1 : 0;
      }

      if (simpleLayout) return;

      if (e.key === "p" || e.key === "P") {
        if (e.metaKey || e.ctrlKey) return;
        e.preventDefault();
        if (shuttingDown) return;
        togglePower();
        return;
      }

      if (!devicePowered) {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          powerOn();
        }
        return;
      }

      if (shuttingDown) return;

      if (!booted) {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          handleBootComplete();
        }
        return;
      }

      switch (e.key) {
        case "a":
        case "A":
          e.preventDefault();
          gameBridgeRef.current?.dpadLeft?.();
          break;
        case "d":
        case "D":
          e.preventDefault();
          gameBridgeRef.current?.dpadRight?.();
          break;
        case "w":
        case "W":
          e.preventDefault();
          gameBridgeRef.current?.dpadUp?.();
          break;
        case "s":
        case "S":
          e.preventDefault();
          gameBridgeRef.current?.dpadDown?.();
          break;
        case "ArrowLeft":
          e.preventDefault();
          navigateLeft();
          break;
        case "ArrowRight":
          e.preventDefault();
          navigateRight();
          break;
        case "ArrowUp":
          e.preventDefault();
          navigateUp();
          break;
        case "ArrowDown":
          e.preventDefault();
          navigateDown();
          break;
        case "Enter":
        case " ":
          e.preventDefault();
          handleSelect();
          break;
        case "Escape":
        case "Backspace":
          e.preventDefault();
          handleBack();
          break;
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [
    devicePowered,
    booted,
    shuttingDown,
    websiteIntroDone,
    simpleLayout,
    buildSecretsOpen,
    powerOn,
    togglePower,
    navigateLeft,
    navigateRight,
    navigateUp,
    navigateDown,
    handleSelect,
    handleBack,
    handleBootComplete,
  ]);

  return (
    <div
      className={`min-h-screen flex items-center justify-center p-3 sm:p-6 md:p-8 relative overflow-hidden ${simpleLayout ? "items-start py-0 px-0" : ""}`}
      style={{
        background: "linear-gradient(145deg, #06060c 0%, #0a0a14 45%, #050508 100%)",
      }}
    >
      <PreloadAssets />
      <BuildSecretsModal
        open={buildSecretsOpen}
        onClose={() => setBuildSecretsOpen(false)}
        reduceMotion={reduceMotion}
      />

      {!simpleLayout && (
      <motion.div
        className="fixed inset-0 pointer-events-none"
        animate={{
          background: devicePowered
            ? `radial-gradient(ellipse 78% 58% at 50% 48%, ${activeCategory.color}07 0%, transparent 72%)`
            : "radial-gradient(ellipse 70% 50% at 50% 50%, rgba(255,255,255,0.02) 0%, transparent 70%)",
        }}
        transition={{ duration: reduceMotion ? 0 : 1.2 }}
      />
      )}

      {!simpleLayout && (
      <div
        className="fixed inset-0 pointer-events-none opacity-[0.018]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='1'/%3E%3C/svg%3E")`,
        }}
      />
      )}

      {!simpleLayout && websiteIntroDone && webglEnabled && !reduceMotion && (
        <Suspense fallback={null}>
          <ThreeSpaceBackdrop />
        </Suspense>
      )}

      {!websiteIntroDone ? (
        <WebsiteIntroScreen
          reduceMotion={reduceMotion}
          onDone={() => {
            setWebsiteIntroDone(true);
          }}
        />
      ) : simpleLayout ? (
        <div className="w-full min-h-screen">
          <SimplePortfolio
            reduceMotion={reduceMotion}
            onSwitchToHandheld={() => {
              writeSimpleLayoutPref(false);
              setSimpleLayout(false);
            }}
          />
        </div>
      ) : (
        <PSPShell
          devicePowered={devicePowered}
          booted={booted && !shuttingDown}
          nightMode={nightMode}
          onPowerPress={togglePower}
          onOpenSpaceExplore={() => setSpaceExploreOpen(true)}
          onDpadUp={navigateUp}
          onDpadDown={navigateDown}
          onDpadLeft={navigateLeft}
          onDpadRight={navigateRight}
          onButtonX={handleSelect}
          onButtonO={handleBack}
        >
          {devicePowered && <WaveBackground bgKey={activeCategory.bgKey} reduceMotion={reduceMotion} />}

          {!devicePowered && <PowerOffScreen onTapWake={powerOn} />}

          {devicePowered && !shuttingDown && !booted && (
            <BootScreen key={bootCycle} reduceMotion={reduceMotion} onComplete={handleBootComplete} />
          )}

          {devicePowered && booted && !shuttingDown && (
            <motion.div
              className="absolute inset-0"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: reduceMotion ? 0 : 0.4 }}
            >
              <XMBMenu
                activeCategoryIndex={activeCategoryIndex}
                activeItemIndex={activeItemIndex}
                isItemView={isItemView}
                gameBridgeRef={gameBridgeRef}
                gamesPlayMode={gamesPlayMode}
                reduceMotion={reduceMotion}
                onEnterSimpleLayout={enterSimpleLayout}
                onExitGamePlay={() => setGamesPlayMode(false)}
                onLaunchGame={() => setGamesPlayMode(true)}
                onPickCategory={selectCategory}
                onEnterCategoryList={enterCategoryList}
                onPickItem={(index, options) => {
                  goToItem(index, options?.enterItemView ?? false);
                }}
              />
            </motion.div>
          )}

          {shuttingDown && <ShutdownScreen />}
        </PSPShell>
      )}

      {webglEnabled && (
        <Suspense fallback={null}>
          <SpaceExplorerModal open={spaceExploreOpen} onClose={() => setSpaceExploreOpen(false)} />
        </Suspense>
      )}
    </div>
  );
}
