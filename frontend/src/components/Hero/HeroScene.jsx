import { useRef, useMemo } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { MeshDistortMaterial, Sphere, Float, Stars } from "@react-three/drei";
import * as THREE from "three";

export default function HeroScene() {
  const sphereRef = useRef();
  const groupRef = useRef();
  const { viewport } = useThree();

  // Create gradient colors
  const color1 = useMemo(() => new THREE.Color("#64ccff"), []);
  const color2 = useMemo(() => new THREE.Color("#8b5cf6"), []);
  const color3 = useMemo(() => new THREE.Color("#c084fc"), []);

  useFrame((state) => {
    const t = state.clock.getElapsedTime();

    // Rotate main sphere
    if (sphereRef.current) {
      sphereRef.current.rotation.x = t * 0.15;
      sphereRef.current.rotation.y = t * 0.2;
    }

    // Gentle group rotation
    if (groupRef.current) {
      groupRef.current.rotation.z = Math.sin(t * 0.1) * 0.1;
    }
  });

  return (
    <group ref={groupRef} scale={viewport.width > 1000 ? 1.2 : 1}>
      {/* Ambient Light */}
      <ambientLight intensity={0.5} />

      {/* Directional Light */}
      <directionalLight position={[10, 10, 5]} intensity={1.2} color="#ffffff" />

      {/* Point Lights for color */}
      <pointLight position={[-10, -10, -5]} intensity={2} color={color1} />
      <pointLight position={[10, -10, 5]} intensity={2} color={color2} />
      <pointLight position={[0, 10, -5]} intensity={1.5} color={color3} />

      {/* Main Distorted Sphere */}
      <Float speed={2} rotationIntensity={0.5} floatIntensity={0.8}>
        <Sphere ref={sphereRef} args={[1, 100, 200]} scale={2.2}>
          <MeshDistortMaterial
            color="#8b5cf6"
            attach="material"
            distort={0.45}
            speed={2.5}
            roughness={0.2}
            metalness={0.9}
            envMapIntensity={1.5}
          />
        </Sphere>
      </Float>

      {/* Inner Glow Sphere */}
      <Sphere args={[0.95, 64, 64]} scale={2.1}>
        <meshBasicMaterial
          color="#64ccff"
          transparent
          opacity={0.15}
          side={THREE.BackSide}
        />
      </Sphere>

      {/* Background Stars */}
      <Stars
        radius={50}
        depth={50}
        count={5000}
        factor={4}
        saturation={0}
        fade
        speed={1}
      />

      {/* Floating Particles */}
      <Particles count={200} />
    </group>
  );
}

// Custom Particles Component
function Particles({ count = 200 }) {
  const mesh = useRef();
  const positions = useMemo(() => {
    const pos = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 15;
      pos[i * 3 + 1] = (Math.random() - 0.5) * 15;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 15;
    }
    return pos;
  }, [count]);

  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    if (mesh.current) {
      mesh.current.rotation.y = t * 0.05;
      mesh.current.rotation.x = t * 0.03;
    }
  });

  return (
    <points ref={mesh}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={positions.length / 3}
          array={positions}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.03}
        color="#ff64f5"
        transparent
        opacity={0.8}
        sizeAttenuation
        depthWrite={false}
      />
    </points>
  );
}