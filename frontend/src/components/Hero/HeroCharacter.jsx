import { useRef, useState } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { Float, Text, RoundedBox, Sphere, Cylinder } from "@react-three/drei";
import * as THREE from "three";

export default function HeroCharacter() {
  const groupRef = useRef();
  const headRef = useRef();
  const bodyRef = useRef();
  const leftArmRef = useRef();
  const rightArmRef = useRef();
  const [hovered, setHovered] = useState(false);
  const { viewport } = useThree();

  // Animation
  useFrame((state) => {
    const t = state.clock.getElapsedTime();

    if (groupRef.current) {
      // Gentle floating bounce
      groupRef.current.position.y = Math.sin(t * 0.8) * 0.15;
      
      // Slight rotation
      groupRef.current.rotation.y = Math.sin(t * 0.3) * 0.1;
    }

    if (headRef.current) {
      // Head bobbing
      headRef.current.rotation.z = Math.sin(t * 1.5) * 0.05;
      headRef.current.rotation.x = Math.sin(t * 0.8) * 0.03;
    }

    if (rightArmRef.current) {
      // Waving animation
      const waveSpeed = hovered ? 15 : 8;
      const waveAngle = hovered ? 0.8 : 0.4;
      rightArmRef.current.rotation.z = -Math.PI / 3 + Math.sin(t * waveSpeed) * waveAngle;
      rightArmRef.current.rotation.x = Math.sin(t * waveSpeed * 0.5) * 0.2;
    }

    if (leftArmRef.current) {
      // Relaxed left arm
      leftArmRef.current.rotation.z = Math.PI / 6 + Math.sin(t * 0.5) * 0.1;
    }

    if (bodyRef.current) {
      // Body pulse
      const scale = 1 + Math.sin(t * 2) * 0.02;
      bodyRef.current.scale.set(scale, scale, scale);
    }
  });

  // Colors
  const bodyColor = "#64ccff";
  const accentColor = "#8b5cf6";
  const eyeColor = "#ffffff";
  const glowColor = "#c084fc";

  return (
    <group ref={groupRef} scale={viewport.width > 1000 ? 1.3 : 1}>
      {/* Lights */}
      <ambientLight intensity={0.6} />
      <directionalLight position={[5, 5, 5]} intensity={1.5} castShadow />
      <pointLight position={[-5, -5, -3]} intensity={1} color={accentColor} />
      <pointLight position={[5, -5, 3]} intensity={1} color={glowColor} />

      {/* Body */}
      <group ref={bodyRef} position={[0, -0.5, 0]}>
        <RoundedBox args={[1.2, 1.4, 0.8]} radius={0.15} smoothness={4}>
          <meshStandardMaterial
            color={bodyColor}
            roughness={0.3}
            metalness={0.7}
            envMapIntensity={1.5}
          />
        </RoundedBox>

        {/* Chest Detail */}
        <Sphere args={[0.25, 32, 32]} position={[0, 0.2, 0.45]}>
          <meshStandardMaterial
            color={accentColor}
            emissive={accentColor}
            emissiveIntensity={0.5}
            roughness={0.2}
            metalness={0.9}
          />
        </Sphere>

        {/* Glow Ring */}
        <Cylinder args={[0.35, 0.35, 0.05, 32]} position={[0, 0.2, 0.43]}>
          <meshBasicMaterial color={glowColor} transparent opacity={0.8} />
        </Cylinder>
      </group>

      {/* Head */}
      <group ref={headRef} position={[0, 1, 0]}>
        <Sphere args={[0.55, 32, 32]}>
          <meshStandardMaterial
            color={bodyColor}
            roughness={0.3}
            metalness={0.7}
          />
        </Sphere>

        {/* Eyes */}
        <Sphere args={[0.12, 16, 16]} position={[-0.18, 0.05, 0.48]}>
          <meshStandardMaterial color={eyeColor} emissive="#ffffff" emissiveIntensity={0.8} />
        </Sphere>
        <Sphere args={[0.12, 16, 16]} position={[0.18, 0.05, 0.48]}>
          <meshStandardMaterial color={eyeColor} emissive="#ffffff" emissiveIntensity={0.8} />
        </Sphere>

        {/* Eye Pupils */}
        <Sphere args={[0.05, 16, 16]} position={[-0.18, 0.05, 0.53]}>
          <meshBasicMaterial color="#0a0a15" />
        </Sphere>
        <Sphere args={[0.05, 16, 16]} position={[0.18, 0.05, 0.53]}>
          <meshBasicMaterial color="#0a0a15" />
        </Sphere>

        {/* Antenna */}
        <Cylinder args={[0.03, 0.03, 0.4, 8]} position={[0, 0.55, 0]}>
          <meshStandardMaterial color={accentColor} metalness={0.9} roughness={0.2} />
        </Cylinder>
        <Sphere args={[0.08, 16, 16]} position={[0, 0.75, 0]}>
          <meshStandardMaterial
            color={glowColor}
            emissive={glowColor}
            emissiveIntensity={1}
          />
        </Sphere>
      </group>

      {/* Right Arm (Waving) */}
      <group ref={rightArmRef} position={[0.8, 0.3, 0]}>
        <RoundedBox args={[0.25, 0.9, 0.25]} radius={0.08} smoothness={4} position={[0, -0.3, 0]}>
          <meshStandardMaterial color={bodyColor} roughness={0.3} metalness={0.7} />
        </RoundedBox>
        <Sphere args={[0.13, 16, 16]} position={[0, -0.75, 0]}>
          <meshStandardMaterial color={accentColor} metalness={0.8} />
        </Sphere>
      </group>

      {/* Left Arm (Relaxed) */}
      <group ref={leftArmRef} position={[-0.8, 0.3, 0]}>
        <RoundedBox args={[0.25, 0.9, 0.25]} radius={0.08} smoothness={4} position={[0, -0.3, 0]}>
          <meshStandardMaterial color={bodyColor} roughness={0.3} metalness={0.7} />
        </RoundedBox>
        <Sphere args={[0.13, 16, 16]} position={[0, -0.75, 0]}>
          <meshStandardMaterial color={accentColor} metalness={0.8} />
        </Sphere>
      </group>

      {/* "Hi!" Text Bubble */}
      <Float speed={3} rotationIntensity={0.3} floatIntensity={0.5}>
        <group position={[1.2, 1.8, 0.5]}>
          {/* Speech Bubble */}
          <RoundedBox args={[1.2, 0.7, 0.1]} radius={0.15} smoothness={4} position={[0, 0, 0]}>
            <meshStandardMaterial color="#ffffff" roughness={0.5} />
          </RoundedBox>
          
          {/* Text */}
          <Text
            position={[0, 0, 0.06]}
            fontSize={0.35}
            fontWeight="bold"
            color="#0a0a15"
            anchorX="center"
            anchorY="middle"
            font="https://fonts.gstatic.com/s/inter/v12/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuLyfAZ9hjp-Ek-_EeA.woff"
          >
            Hi!
          </Text>

          {/* Bubble Tail */}
          <Cylinder args={[0, 0.15, 0.2, 3]} position={[-0.3, -0.4, 0]} rotation={[0, 0, Math.PI / 6]}>
            <meshStandardMaterial color="#ffffff" />
          </Cylinder>
        </group>
      </Float>

      {/* Hover Interaction */}
      <mesh
        position={[0, 0.5, 0]}
        visible={false}
        onPointerOver={() => setHovered(true)}
        onPointerOut={() => setHovered(false)}
      >
        <sphereGeometry args={[2.5, 16, 16]} />
      </mesh>
    </group>
  );
}