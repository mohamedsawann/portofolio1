import { useEffect, useMemo, useRef, useState } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { OrbitControls, Stars, useTexture } from "@react-three/drei";
import { X } from "lucide-react";
import * as THREE from "three";

type PlanetData = {
  id: string;
  label: string;
  color: string;
  position: [number, number, number];
  radius: number;
  subtitle: string;
  texture: string;
  biome: string;
  temperature: string;
  gravity: string;
  danger: number;
  highlights: string[];
};

function ShootingStars({ bounds = 24, count = 18 }: { bounds?: number; count?: number }) {
  const segmentsRef = useRef<THREE.LineSegments | null>(null);
  const positions = useMemo(() => {
    const arr = new Float32Array(count * 6);
    for (let i = 0; i < count; i++) {
      const x = (Math.random() - 0.5) * bounds * 2;
      const y = (Math.random() - 0.5) * bounds * 0.8;
      const z = -Math.random() * bounds * 2 - 6;
      arr[i * 6] = x;
      arr[i * 6 + 1] = y;
      arr[i * 6 + 2] = z;
      arr[i * 6 + 3] = x - 1.4;
      arr[i * 6 + 4] = y + 0.24;
      arr[i * 6 + 5] = z;
    }
    return arr;
  }, [bounds, count]);

  useFrame((_, delta) => {
    if (!segmentsRef.current) return;
    const attr = segmentsRef.current.geometry.attributes.position as THREE.BufferAttribute;
    for (let i = 0; i < count; i++) {
      const base = i * 6;
      const speed = 7 + (i % 5) * 2.1;
      const dz = delta * speed;
      attr.array[base + 2] += dz;
      attr.array[base + 5] += dz;
      attr.array[base] += delta * speed * 0.6;
      attr.array[base + 3] += delta * speed * 0.6;
      if (attr.array[base + 2] > 6.5) {
        const x = (Math.random() - 0.5) * bounds * 2;
        const y = (Math.random() - 0.5) * bounds * 0.8;
        const z = -Math.random() * bounds * 2 - 10;
        attr.array[base] = x;
        attr.array[base + 1] = y;
        attr.array[base + 2] = z;
        attr.array[base + 3] = x - 1.4;
        attr.array[base + 4] = y + 0.24;
        attr.array[base + 5] = z;
      }
    }
    attr.needsUpdate = true;
  });

  return (
    <lineSegments ref={segmentsRef}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" array={positions} itemSize={3} count={count * 2} />
      </bufferGeometry>
      <lineBasicMaterial color="#d8e9ff" transparent opacity={0.72} />
    </lineSegments>
  );
}

function SpaceCameraRig({ warpPhase }: { warpPhase: boolean }) {
  const { camera, clock } = useThree();
  const lookTarget = useRef(new THREE.Vector3(0, 0, -7.5));

  useFrame(() => {
    const autoPilot = warpPhase;
    if (!autoPilot) return;

    const elapsed = clock.getElapsedTime();
    const warpT = Math.min(1, elapsed / 1.15);

    const defaultPos = new THREE.Vector3(0, 0.6, 7.2);
    const warpPos = new THREE.Vector3(0, 0.6, 25 - warpT * 17.8);

    const desired = warpPhase ? warpPos : defaultPos;
    lookTarget.current.lerp(new THREE.Vector3(0, 0, -8.5), 0.05);

    camera.position.lerp(desired, 0.12);
    camera.lookAt(lookTarget.current);
  });

  return null;
}

function ExplorerPlanets({
  planets,
}: {
  planets: PlanetData[];
}) {
  const groupRef = useRef<THREE.Group | null>(null);
  const planetSystemRefs = useRef<Array<THREE.Group | null>>([]);
  const moonRefs = useRef<Array<THREE.Mesh | null>>([]);
  const planetTextures = useTexture(planets.map((p) => p.texture));

  const textureByPlanet = useMemo(() => {
    return planets.reduce<Record<string, THREE.Texture>>((acc, planet, idx) => {
      const tex = planetTextures[idx];
      tex.colorSpace = THREE.SRGBColorSpace;
      tex.anisotropy = 8;
      acc[planet.id] = tex;
      return acc;
    }, {});
  }, [planets, planetTextures]);

  useFrame((_, delta) => {
    planetSystemRefs.current.forEach((planetSystem, idx) => {
      if (!planetSystem) return;
      planetSystem.rotation.y += delta * (0.08 + idx * 0.02);
    });

    moonRefs.current.forEach((moon, idx) => {
      if (!moon) return;
      const planet = planets[idx];
      const moonRadius = planet.radius * 0.14;
      const orbitRadius = planet.radius + moonRadius + 1.15;
      const angle = performance.now() * 0.00022 + idx * 1.9;
      moon.position.x = Math.cos(angle) * orbitRadius;
      moon.position.z = Math.sin(angle) * orbitRadius;
      moon.position.y = Math.sin(angle * 1.6) * (planet.radius * 0.22);
    });
  });

  return (
    <group ref={groupRef}>
      {planets.map((planet, idx) => {
        return (
          <group key={planet.id} position={planet.position}>
            <group
              ref={(el) => {
                planetSystemRefs.current[idx] = el;
              }}
            >
              <mesh>
                <sphereGeometry args={[planet.radius, 64, 64]} />
                <meshStandardMaterial
                  color="#ffffff"
                  map={textureByPlanet[planet.id]}
                  roughness={0.68}
                  metalness={0.06}
                  emissive="#000000"
                  emissiveIntensity={0}
                />
              </mesh>

              <mesh>
                <sphereGeometry args={[planet.radius * 1.04, 48, 48]} />
                <meshStandardMaterial
                  color={planet.color}
                  transparent
                  opacity={0.14}
                  roughness={0.4}
                  metalness={0.04}
                  emissive={planet.color}
                  emissiveIntensity={0.1}
                />
              </mesh>

              <group>
                <mesh
                  ref={(el) => {
                    moonRefs.current[idx] = el;
                  }}
                >
                  <sphereGeometry args={[planet.radius * 0.14, 20, 20]} />
                  <meshStandardMaterial color="#cfd8ff" roughness={0.8} metalness={0.02} />
                </mesh>
              </group>

            </group>
          </group>
        );
      })}

    </group>
  );
}

export default function SpaceExplorerModal({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const planets = useMemo<PlanetData[]>(
    () => [
      {
        id: "planet-a",
        label: "Aetheris Prime",
        color: "#4f74ff",
        position: [-4.2, 1.4, -6],
        radius: 1.35,
        subtitle: "Coastal intelligence colony",
        texture: "/textures/planets/uranus.png",
        biome: "Oceanic world · cloud bands",
        temperature: "-8C to 21C",
        gravity: "0.94g",
        danger: 2,
        highlights: ["Harbor cities", "Calm ion storms", "Shallow blue seas"],
      },
      {
        id: "planet-b",
        label: "Veyra IX",
        color: "#b76eff",
        position: [3.6, -1.3, -8],
        radius: 1.95,
        subtitle: "Ringed crystal gas giant",
        texture: "/textures/planets/mars.png",
        biome: "Crystal gas giant · ion rings",
        temperature: "-42C to 9C",
        gravity: "1.26g",
        danger: 3,
        highlights: ["Dense ring belt", "Charged atmosphere", "Violet lightning fronts"],
      },
      {
        id: "planet-c",
        label: "Cryon Delta",
        color: "#30b0ff",
        position: [0, 3.3, -11],
        radius: 2.6,
        subtitle: "Frozen giant with aurora poles",
        texture: "/textures/planets/mercury.png",
        biome: "Frozen mega-world · aurora poles",
        temperature: "-65C to -14C",
        gravity: "0.81g",
        danger: 1,
        highlights: ["Glacial canyons", "Low gravity plains", "Polar aurora curtains"],
      },
    ],
    []
  );
  const [warpPhase, setWarpPhase] = useState(true);

  useEffect(() => {
    if (!open) return;
    setWarpPhase(true);
    const warpTimer = window.setTimeout(() => setWarpPhase(false), 1200);
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("keydown", onKey);
      window.clearTimeout(warpTimer);
    };
  }, [open, onClose, planets]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[80] bg-[#03040a]">
      <Canvas camera={{ position: [0, 0.7, 7], fov: 58 }} dpr={[1, 1.75]}>
        <color attach="background" args={["#02030a"]} />
        <fog attach="fog" args={["#02030a", 9, 45]} />
        <ambientLight intensity={0.42} />
        <directionalLight position={[4, 2.4, 4]} intensity={1.1} color="#c9deff" />
        <pointLight position={[-5, -2, 1]} intensity={0.8} color="#7c5bff" />
        <Stars radius={240} depth={120} count={9000} factor={4.2} saturation={0} fade speed={0.5} />
        <ShootingStars />
        <SpaceCameraRig warpPhase={warpPhase} />
        <ExplorerPlanets planets={planets} />
        <OrbitControls enabled={!warpPhase} enablePan={false} minDistance={3.5} maxDistance={13} rotateSpeed={0.55} />
      </Canvas>

      {warpPhase && (
        <div className="absolute inset-0 pointer-events-none z-[1] bg-black/30">
          <div
            className="absolute inset-0 opacity-65"
            style={{
              backgroundImage:
                "repeating-linear-gradient(90deg, transparent 0px, rgba(160,200,255,0.8) 2px, transparent 5px, transparent 12px)",
              animation: "warpLines 900ms ease-out both",
            }}
          />
          <div className="absolute inset-0 flex items-center justify-center">
            <p
              className="text-[#d7e7ff] text-[12px] tracking-[0.22em] uppercase"
              style={{ fontFamily: "'Rajdhani', sans-serif" }}
            >
              Engaging Warp Drive...
            </p>
          </div>
        </div>
      )}

      <div className="absolute top-4 left-4 right-4 flex items-center justify-between pointer-events-none">
        <div
          className="pointer-events-auto rounded-lg border border-white/15 bg-black/45 px-3 py-2 text-white/70 text-[11px]"
          style={{ fontFamily: "'Rajdhani', sans-serif" }}
        >
          Space Explore: drag to look around, scroll to zoom.
        </div>
        <button
          type="button"
          onClick={onClose}
          className="pointer-events-auto inline-flex items-center gap-1.5 rounded-lg border border-white/20 bg-white/10 px-3 py-2 text-[11px] text-white/80 hover:bg-white/15"
        >
          <X className="w-3.5 h-3.5" />
          Close
        </button>
      </div>

      <style>{`
        @keyframes warpLines {
          0% { opacity: 0; transform: scaleX(0.55); filter: blur(1px); }
          25% { opacity: 1; transform: scaleX(1.8); filter: blur(0.5px); }
          100% { opacity: 0; transform: scaleX(2.4); filter: blur(0px); }
        }
      `}</style>
    </div>
  );
}
