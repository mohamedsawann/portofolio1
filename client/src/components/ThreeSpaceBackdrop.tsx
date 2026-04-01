import { useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Stars } from "@react-three/drei";
import * as THREE from "three";

function Planets() {
  const groupRef = useRef<THREE.Group | null>(null);
  const moonRef = useRef<THREE.Mesh | null>(null);

  useFrame((_, delta) => {
    if (!groupRef.current) return;
    groupRef.current.rotation.y += delta * 0.02;
    if (moonRef.current) {
      moonRef.current.position.x = 4.3 + Math.cos(performance.now() * 0.00026) * 1.2;
      moonRef.current.position.z = -11 + Math.sin(performance.now() * 0.00026) * 1.2;
    }
  });

  return (
    <group ref={groupRef}>
      <mesh position={[-3.2, 1.2, -9]}>
        <sphereGeometry args={[1.2, 48, 48]} />
        <meshStandardMaterial color="#5f74ff" roughness={0.65} metalness={0.08} />
      </mesh>
      <mesh position={[4.3, -1.4, -11]}>
        <sphereGeometry args={[1.75, 56, 56]} />
        <meshStandardMaterial color="#b56fff" roughness={0.7} metalness={0.05} />
      </mesh>
      <mesh ref={moonRef} position={[5.5, -1.4, -11]}>
        <sphereGeometry args={[0.34, 24, 24]} />
        <meshStandardMaterial color="#d6d4ff" roughness={0.9} metalness={0.02} />
      </mesh>
      <mesh position={[0.5, 3.2, -15]}>
        <sphereGeometry args={[2.3, 64, 64]} />
        <meshStandardMaterial color="#2da8ff" roughness={0.72} metalness={0.03} />
      </mesh>
    </group>
  );
}

export default function ThreeSpaceBackdrop() {
  return (
    <div className="fixed inset-0 pointer-events-none z-0">
      <Canvas camera={{ position: [0, 0, 5.5], fov: 56 }} dpr={[1, 1.5]}>
        <color attach="background" args={["#04050b"]} />
        <fog attach="fog" args={["#04050b", 8, 30]} />
        <ambientLight intensity={0.45} />
        <directionalLight position={[3, 2, 4]} intensity={1.2} color="#9ab9ff" />
        <pointLight position={[-5, -1, 2]} intensity={0.75} color="#8b6dff" />
        <Stars radius={120} depth={70} count={6500} factor={3.5} saturation={0} fade speed={0.3} />
        <Planets />
      </Canvas>
    </div>
  );
}
