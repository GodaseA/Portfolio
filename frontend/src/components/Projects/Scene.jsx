import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import EmojiMan from "./EmojiMan";

export default function EmojiScene() {
  return (
    <Canvas camera={{ position: [0, 1, 5] }}>
      <ambientLight intensity={2} />
      <directionalLight position={[5, 5, 5]} intensity={2} />

      <EmojiMan />

      <OrbitControls enableZoom={false} />
    </Canvas>
  );
}