import { useRef } from "react";
import { useFrame } from "@react-three/fiber";

export default function EmojiMan() {
  const group = useRef();
  const leftArm = useRef();
  const rightArm = useRef();

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();

    // Floating animation
    group.current.position.y = Math.sin(t * 1.5) * 0.15;

    // Wave right arm
    rightArm.current.rotation.z = Math.sin(t * 3) * 0.5;

    // Slight movement left arm
    leftArm.current.rotation.z = -Math.sin(t * 2) * 0.15;

    // Rotate body slightly
    group.current.rotation.y = Math.sin(t) * 0.2;
  });

  return (
    <group ref={group}>
      {/* Head */}
      <mesh position={[0, 1.6, 0]}>
        <sphereGeometry args={[0.45, 64, 64]} />
        <meshStandardMaterial color="#FFD93D" />
      </mesh>

      {/* Body */}
      <mesh position={[0, 0.5, 0]}>
        <cylinderGeometry args={[0.35, 0.35, 1.2, 64]} />
        <meshStandardMaterial color="#4F46E5" />
      </mesh>

      {/* Left Arm */}
      <mesh ref={leftArm} position={[-0.55, 0.7, 0]}>
        <cylinderGeometry args={[0.08, 0.08, 0.9, 32]} />
        <meshStandardMaterial color="#FFD93D" />
      </mesh>

      {/* Right Arm */}
      <mesh ref={rightArm} position={[0.55, 0.7, 0]}>
        <cylinderGeometry args={[0.08, 0.08, 0.9, 32]} />
        <meshStandardMaterial color="#FFD93D" />
      </mesh>

      {/* Legs */}
      <mesh position={[-0.15, -0.6, 0]}>
        <cylinderGeometry args={[0.1, 0.1, 1, 32]} />
        <meshStandardMaterial color="#222" />
      </mesh>

      <mesh position={[0.15, -0.6, 0]}>
        <cylinderGeometry args={[0.1, 0.1, 1, 32]} />
        <meshStandardMaterial color="#222" />
      </mesh>

      {/* Eyes */}
      <mesh position={[-0.15, 1.7, 0.4]}>
        <sphereGeometry args={[0.05, 32, 32]} />
        <meshStandardMaterial color="black" />
      </mesh>

      <mesh position={[0.15, 1.7, 0.4]}>
        <sphereGeometry args={[0.05, 32, 32]} />
        <meshStandardMaterial color="black" />
      </mesh>

      {/* Smile */}
      <mesh position={[0, 1.45, 0.42]} rotation={[0, 0, Math.PI]}>
        <torusGeometry args={[0.12, 0.02, 16, 32, Math.PI]} />
        <meshStandardMaterial color="black" />
      </mesh>
    </group>
  );
}