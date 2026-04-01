import { ReactNode, Suspense, useMemo, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, useGLTF } from "@react-three/drei";
import * as THREE from "three";
import { motion } from "framer-motion";
import { Orbit, Power } from "lucide-react";

interface PSPModelShellProps {
  children: ReactNode;
  devicePowered: boolean;
  booted: boolean;
  nightMode?: boolean;
  onPowerPress: () => void;
  onDpadUp: () => void;
  onDpadDown: () => void;
  onDpadLeft: () => void;
  onDpadRight: () => void;
  onButtonX: () => void;
  onButtonO: () => void;
  onOpenSpaceExplore: () => void;
}

function PSPModel({ nightMode = false }: { nightMode?: boolean }) {
  const { scene } = useGLTF("/models/psp/psp.glb");
  const groupRef = useRef<THREE.Group>(null);

  const model = useMemo(() => {
    const clone = scene.clone(true);
    const box = new THREE.Box3().setFromObject(clone);
    const size = box.getSize(new THREE.Vector3());
    const center = box.getCenter(new THREE.Vector3());

    clone.position.set(-center.x, -center.y, -center.z);

    clone.traverse((child) => {
      if (!(child instanceof THREE.Mesh)) return;
      child.material = new THREE.MeshStandardMaterial({
        color: nightMode ? "#7a8094" : "#a0a8bc",
        metalness: 0.6,
        roughness: nightMode ? 0.48 : 0.38,
      });
    });

    const targetWidth = 6.2;
    const s = size.x > 0 ? targetWidth / size.x : 1;
    clone.scale.setScalar(s);

    return clone;
  }, [scene, nightMode]);

  useFrame(({ clock }) => {
    if (!groupRef.current) return;
    groupRef.current.rotation.y = Math.sin(clock.elapsedTime * 0.3) * 0.06;
    groupRef.current.rotation.x = -0.08 + Math.cos(clock.elapsedTime * 0.22) * 0.015;
  });

  return (
    <group ref={groupRef} position={[0, 0, 0]}>
      <primitive object={model} />
    </group>
  );
}

function FaceGlyph({ shape }: { shape: "cross" | "circle" }) {
  const stroke = 2.35;
  const common = { className: "w-[1.125rem] h-[1.125rem] sm:w-5 sm:h-5", fill: "none" as const };
  if (shape === "cross") {
    return (
      <svg viewBox="0 0 24 24" aria-hidden {...common}>
        <path d="M6.8 6.8l10.4 10.4M17.2 6.8L6.8 17.2" stroke="currentColor" strokeWidth={stroke} strokeLinecap="round" />
      </svg>
    );
  }
  return (
    <svg viewBox="0 0 24 24" aria-hidden {...common}>
      <circle cx="12" cy="12" r="6.5" stroke="currentColor" strokeWidth={stroke} />
    </svg>
  );
}

export default function PSPModelShell({
  children,
  devicePowered,
  booted,
  nightMode = false,
  onPowerPress,
  onDpadUp,
  onDpadDown,
  onDpadLeft,
  onDpadRight,
  onButtonX,
  onButtonO,
  onOpenSpaceExplore,
}: PSPModelShellProps) {
  return (
    <div className="relative w-full max-w-[1120px] mx-auto select-none">
      <div className="relative" style={{ aspectRatio: "16 / 8.2" }}>
        <Canvas
          camera={{ position: [0, 0, 5.2], fov: 38 }}
          dpr={[1, 1.5]}
          gl={{ alpha: true, antialias: true }}
          style={{ position: "absolute", inset: 0 }}
        >
          <ambientLight intensity={1.0} />
          <directionalLight position={[3, 2.5, 3.5]} intensity={1.4} color="#ffffff" />
          <pointLight position={[-3, 1.5, 2]} intensity={0.6} color="#9db8ff" />
          <pointLight position={[3, -1, 1.5]} intensity={0.5} color="#a699ff" />
          <Suspense fallback={null}>
            <PSPModel nightMode={nightMode} />
          </Suspense>
          <OrbitControls
            enablePan={false}
            enableZoom={false}
            maxPolarAngle={Math.PI * 0.6}
            minPolarAngle={Math.PI * 0.4}
            rotateSpeed={0.4}
          />
        </Canvas>

        <div
          className="absolute z-10 overflow-hidden rounded-md sm:rounded-lg"
          style={{
            left: "22.5%",
            top: "18%",
            width: "55%",
            height: "60%",
            background: "#010104",
            boxShadow: "inset 0 0 12px rgba(0,0,0,0.9), 0 0 0 1px rgba(255,255,255,0.06)",
          }}
        >
          <div className="relative w-full h-full overflow-hidden">
            {children}
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between px-2 sm:px-3 mt-2 gap-2">
        <div className="flex items-center gap-2">
          <span
            className="text-[9px] sm:text-[10px] tracking-[0.2em] uppercase text-white/25"
            style={{ fontFamily: "'Rajdhani', sans-serif" }}
          >
            PSP
          </span>
          <span className="text-[8px] text-white/20 hidden sm:inline" style={{ fontFamily: "'Rajdhani', sans-serif" }}>
            {devicePowered ? (booted ? "Ready" : "Starting…") : "Standby"}
          </span>
        </div>

        <div className="flex items-center gap-1.5">
          <motion.button
            type="button"
            whileTap={{ scale: 0.94 }}
            onClick={onOpenSpaceExplore}
            className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg border border-[#6d9dff]/35 bg-[#6d9dff]/10 hover:bg-[#6d9dff]/18 transition-colors"
            title="Open 3D Space Explore"
            aria-label="Open 3D space explore"
          >
            <Orbit className="w-3.5 h-3.5 text-[#9fc0ff]" strokeWidth={2} />
            <span className="text-[9px] font-semibold uppercase tracking-wider text-[#b7ceff] hidden sm:inline" style={{ fontFamily: "'Rajdhani', sans-serif" }}>Space</span>
          </motion.button>
          <motion.button
            type="button"
            whileTap={{ scale: 0.94 }}
            onClick={onPowerPress}
            className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg border border-white/10 bg-white/[0.04] hover:bg-white/[0.08] transition-colors"
            title={devicePowered ? "Power off" : "Power on"}
            aria-label={devicePowered ? "Power off handheld" : "Power on handheld"}
          >
            <Power className="w-3.5 h-3.5 text-white/50" strokeWidth={2} />
            <span className="text-[9px] font-semibold uppercase tracking-wider text-white/45 hidden sm:inline" style={{ fontFamily: "'Rajdhani', sans-serif" }}>Power</span>
          </motion.button>
        </div>
      </div>

      <div className="flex sm:hidden items-center gap-2 mx-auto flex-wrap justify-center mt-3">
        {(
          [
            { label: "Left", fn: onDpadLeft, char: "◀" },
            { label: "Up", fn: onDpadUp, char: "▲" },
            { label: "Down", fn: onDpadDown, char: "▼" },
            { label: "Right", fn: onDpadRight, char: "▶" },
          ] as const
        ).map((btn) => (
          <motion.button
            key={btn.label}
            type="button"
            whileTap={{ scale: 0.88 }}
            onClick={btn.fn}
            className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-white/45"
            aria-label={btn.label}
          >
            {btn.char}
          </motion.button>
        ))}
        <motion.button type="button" whileTap={{ scale: 0.88 }} onClick={onButtonX} className="w-10 h-10 rounded-full flex items-center justify-center text-[#6d9dff] border border-[#6d9dff]/30 bg-[#6d9dff]/10" aria-label="Enter">
          <FaceGlyph shape="cross" />
        </motion.button>
        <motion.button type="button" whileTap={{ scale: 0.88 }} onClick={onButtonO} className="w-10 h-10 rounded-full flex items-center justify-center text-[#ff7a7a] border border-[#ff7a7a]/30 bg-[#ff7a7a]/10" aria-label="Back">
          <FaceGlyph shape="circle" />
        </motion.button>
      </div>

      <div className="mt-2 text-center">
        <span
          className="text-[10px] tracking-[0.32em] uppercase font-light"
          style={{ fontFamily: "'Rajdhani', sans-serif", color: "rgba(255,255,255,0.12)" }}
        >
          Portfolio Station Portable
        </span>
      </div>
    </div>
  );
}
