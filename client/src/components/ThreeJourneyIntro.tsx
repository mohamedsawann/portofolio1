import { useMemo, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";

function StarTunnel({ reduceMotion = false }: { reduceMotion?: boolean }) {
  const pointsRef = useRef<THREE.Points>(null);
  const count = 900;

  const positions = useMemo(() => {
    const arr = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      const r = 2.6 + Math.random() * 4.2;
      const a = Math.random() * Math.PI * 2;
      arr[i * 3] = Math.cos(a) * r;
      arr[i * 3 + 1] = Math.sin(a) * r * 0.7;
      arr[i * 3 + 2] = -Math.random() * 58;
    }
    return arr;
  }, []);

  useFrame((_, delta) => {
    if (!pointsRef.current || reduceMotion) return;
    const attr = pointsRef.current.geometry.attributes.position as THREE.BufferAttribute;
    for (let i = 0; i < count; i++) {
      const zIndex = i * 3 + 2;
      const nextZ = attr.array[zIndex] + delta * 18;
      attr.array[zIndex] = nextZ > 2 ? -58 : nextZ;
    }
    attr.needsUpdate = true;
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" array={positions} itemSize={3} count={count} />
      </bufferGeometry>
      <pointsMaterial color="#6aa8ff" size={0.05} sizeAttenuation transparent opacity={0.9} />
    </points>
  );
}

export default function ThreeJourneyIntro({ reduceMotion = false }: { reduceMotion?: boolean }) {
  return (
    <div className="absolute inset-0 pointer-events-none">
      <Canvas
        dpr={[1, 1.5]}
        camera={{ fov: 56, position: [0, 0, 3.2] }}
        gl={{ alpha: true, antialias: true, powerPreference: "high-performance" }}
      >
        <color attach="background" args={["#020207"]} />
        <fog attach="fog" args={["#020207", 4.5, 18]} />
        <ambientLight intensity={0.45} />
        <directionalLight position={[2, 1.6, 2]} intensity={1.25} color="#d9ecff" />
        <pointLight position={[-1.2, -0.4, 2]} intensity={0.9} color="#2d7dff" />
        <StarTunnel reduceMotion={reduceMotion} />
      </Canvas>
    </div>
  );
}
