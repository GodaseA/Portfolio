import { useLayoutEffect, useRef, useState, useEffect, Suspense } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Environment, MeshDistortMaterial, Float, Text } from "@react-three/drei";
import * as THREE from "three";
import AnchorLink from "react-anchor-link-smooth-scroll";
import "./Hero.css";
import About from "../About/About";
import { FaRocket } from "react-icons/fa";

gsap.registerPlugin(ScrollTrigger);

// ─── Constants ──────────────────────────────────────────────
const ROLES = ["React Developer", "Node.js Developer", "MERN Developer", "UI Engineer"];

const TECH_ICONS = [
  { label: "React", emoji: "⚛", color: "#61DAFB", orbitR: 2.8, speed: 0.55, tiltX: 0.3, tiltY: 0.1, phase: 0 },
  { label: "Node", emoji: "⬡", color: "#68A063", orbitR: 3.2, speed: -0.40, tiltX: 0.8, tiltY: 0.4, phase: 1.0 },
  { label: "CSS", emoji: "🎨", color: "#264DE4", orbitR: 2.6, speed: 0.35, tiltX: 1.1, tiltY: 0.2, phase: 2.1 },
  { label: "HTML", emoji: "🌐", color: "#E44D26", orbitR: 3.5, speed: 0.60, tiltX: 0.5, tiltY: 0.9, phase: 3.3 },
  { label: "Java", emoji: "☕", color: "#F89820", orbitR: 2.9, speed: -0.50, tiltX: 0.9, tiltY: 0.6, phase: 4.4 },
  { label: "Express", emoji: "⚡", color: "#999999", orbitR: 3.4, speed: 0.45, tiltX: 0.2, tiltY: 1.1, phase: 0.8 },
  { label: "C++", emoji: "🔷", color: "#9C4DC1", orbitR: 2.7, speed: -0.38, tiltX: 1.3, tiltY: 0.3, phase: 5.2 },
  { label: "Python", emoji: "🐍", color: "#3776AB", orbitR: 3.1, speed: 0.52, tiltX: 0.6, tiltY: 1.4, phase: 1.7 },
];

const STATS = [
  { value: "1+", label: "Yrs exp" },
  { value: "10+", label: "Projects" },
  { value: "50+", label: "LeetCode" },
];

// ─── 3D Scene Components ────────────────────────────────────

function CameraRig({ mouse }) {
  const { camera } = useThree();
  useFrame(() => {
    camera.position.x += (mouse.current.x * 1.5 - camera.position.x) * 0.05;
    camera.position.y += (mouse.current.y * 1.0 - camera.position.y) * 0.05;
    camera.lookAt(0, 0, 0);
  });
  return null;
}

function Ring({ radius, speed, color, tilt }) {
  const ref = useRef();
  useFrame((_, dt) => {
    if (ref.current) ref.current.rotation.z += speed * dt;
  });
  return (
    <mesh ref={ref} rotation={[tilt, 0, 0]}>
      <torusGeometry args={[radius, 0.012, 16, 160]} />
      <meshStandardMaterial color={color} emissive={color} emissiveIntensity={0.7} />
    </mesh>
  );
}

function Satellite({ orbitRadius, speed, color, phase }) {
  const ref = useRef();
  useFrame(({ clock }) => {
    if (!ref.current) return;
    const t = clock.elapsedTime * speed + phase;
    ref.current.position.set(
      Math.cos(t) * orbitRadius,
      Math.sin(t) * orbitRadius * 0.4,
      Math.sin(t) * orbitRadius * 0.6
    );
  });
  return (
    <mesh ref={ref}>
      <sphereGeometry args={[0.055, 12, 12]} />
      <meshStandardMaterial color={color} emissive={color} emissiveIntensity={1.2} />
    </mesh>
  );
}

function TechBadge({ label, emoji, color, orbitR, speed, tiltX, tiltY, phase }) {
  const groupRef = useRef();
  const cardRef = useRef();

  useFrame(({ clock, camera }) => {
    if (!groupRef.current || !cardRef.current) return;
    const t = clock.elapsedTime * speed + phase;
    groupRef.current.position.set(
      Math.cos(t) * orbitR,
      Math.sin(t * 0.7 + phase) * orbitR * 0.38,
      Math.sin(t) * orbitR * 0.62
    );
    cardRef.current.quaternion.copy(camera.quaternion);
  });

  return (
    <group ref={groupRef}>
      <group ref={cardRef}>
        <mesh>
          <planeGeometry args={[0.72, 0.36]} />
          <meshStandardMaterial
            color="#0d0d14"
            transparent
            opacity={0.82}
            roughness={0.3}
            metalness={0.6}
          />
        </mesh>
        <mesh position={[-0.305, 0, 0.001]}>
          <planeGeometry args={[0.11, 0.36]} />
          <meshStandardMaterial color={color} emissive={color} emissiveIntensity={0.5} roughness={0.4} />
        </mesh>
        <mesh position={[0, 0, -0.001]}>
          <planeGeometry args={[0.76, 0.40]} />
          <meshStandardMaterial color={color} transparent opacity={0.18} emissive={color} emissiveIntensity={0.9} />
        </mesh>
        <Text position={[-0.15, 0.01, 0.003]} fontSize={0.14} anchorX="center" anchorY="middle">
          {emoji}
        </Text>
        <Text position={[0.1, 0.01, 0.003]} fontSize={0.1} color="white" anchorX="center" anchorY="middle" fontWeight={600}>
          {label}
        </Text>
      </group>
    </group>
  );
}

function Particles({ count = 120 }) {
  const ref = useRef();
  const positions = useRef(
    new Float32Array(Array.from({ length: count * 3 }, () => (Math.random() - 0.5) * 9))
  );
  useFrame((_, dt) => {
    if (!ref.current) return;
    ref.current.rotation.y += 0.04 * dt;
    ref.current.rotation.x += 0.015 * dt;
  });
  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          array={positions.current}
          count={count}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial size={0.022} color="#818CF8" transparent opacity={0.55} sizeAttenuation />
    </points>
  );
}

function CoreOrb({ clicked }) {
  const ref = useRef();
  const scaleTarget = useRef(1);

  useEffect(() => {
    if (clicked) {
      scaleTarget.current = 1.28;
      setTimeout(() => { scaleTarget.current = 1; }, 300);
    }
  }, [clicked]);

  useFrame((_, dt) => {
    if (!ref.current) return;
    ref.current.scale.lerp(
      new THREE.Vector3(scaleTarget.current, scaleTarget.current, scaleTarget.current),
      0.12
    );
    ref.current.rotation.y += 0.003;
    ref.current.rotation.x += 0.001;
  });

  return (
    <mesh ref={ref}>
      <icosahedronGeometry args={[1, 4]} />
      <MeshDistortMaterial
        color="#6366F1"
        emissive="#3730a3"
        emissiveIntensity={0.35}
        distort={0.38}
        speed={1.6}
        roughness={0.08}
        metalness={0.85}
      />
    </mesh>
  );
}

function WireShell() {
  const ref = useRef();
  useFrame((_, dt) => {
    if (!ref.current) return;
    ref.current.rotation.y -= 0.004;
    ref.current.rotation.z += 0.002;
  });
  return (
    <mesh ref={ref}>
      <icosahedronGeometry args={[1.2, 1]} />
      <meshBasicMaterial color="#818CF8" wireframe transparent opacity={0.14} />
    </mesh>
  );
}

function Scene({ mouse, clicked }) {
  return (
    <>
      <CameraRig mouse={mouse} />
      <ambientLight intensity={0.25} />
      <directionalLight position={[5, 5, 5]} intensity={1.1} color="#ffffff" />
      <pointLight position={[-4, 2, -2]} intensity={2.5} color="#6366F1" />
      <pointLight position={[4, -2, 3]} intensity={1.8} color="#F59E0B" />
      <pointLight position={[0, 4, -3]} intensity={1.0} color="#c084fc" />

      <Float speed={1.4} rotationIntensity={0.25} floatIntensity={0.5}>
        <CoreOrb clicked={clicked} />
        <WireShell />
        <Ring radius={1.65} speed={0.42} color="#6366F1" tilt={Math.PI / 5} />
        <Ring radius={2.05} speed={-0.27} color="#F59E0B" tilt={Math.PI / 3} />
        <Ring radius={2.45} speed={0.19} color="#818CF8" tilt={Math.PI / 1.8} />
        <Satellite orbitRadius={1.65} speed={0.9} color="#F59E0B" phase={0} />
        <Satellite orbitRadius={2.05} speed={-0.6} color="#6366F1" phase={Math.PI} />
        <Satellite orbitRadius={2.45} speed={0.45} color="#c084fc" phase={Math.PI / 2} />
      </Float>

      {TECH_ICONS.map((t) => (
        <TechBadge key={t.label} {...t} />
      ))}

      <Particles count={140} />
      <Environment preset="city" />
    </>
  );
}

// ─── UI Components ──────────────────────────────────────────

function RoleCycler({ }) {
  const [roleIdx, setRoleIdx] = useState(0);
  const [displayed, setDisplayed] = useState("");
  const [deleting, setDeleting] = useState(false);
  const [charIdx, setCharIdx] = useState(0);

  useEffect(() => {
    const target = ROLES[roleIdx];
    let timeout;
    if (!deleting) {
      if (charIdx < target.length) {
        timeout = setTimeout(() => {
          setDisplayed(target.slice(0, charIdx + 1));
          setCharIdx((c) => c + 1);
        }, 60);
      } else {
        timeout = setTimeout(() => setDeleting(true), 1800);
      }
    } else {
      if (charIdx > 0) {
        timeout = setTimeout(() => {
          setDisplayed(target.slice(0, charIdx - 1));
          setCharIdx((c) => c - 1);
        }, 35);
      } else {
        setDeleting(false);
        setRoleIdx((r) => (r + 1) % ROLES.length);
      }
    }
    return () => clearTimeout(timeout);
  }, [charIdx, deleting, roleIdx]);

  return (
    <span className="hero-role">
      {displayed}
      <span className="hero-cursor-blink">|</span>
    </span>
  );
}

function AnimatedText({ text, prefix }) {
  return (
    <>
      {text.split("").map((ch, i) => (
        <span
          key={`${prefix}-${i}`}
          className="letter"
          aria-hidden="true"
          style={{ display: "inline-block" }}
        >
          {ch === " " ? "\u00A0" : ch}
        </span>
      ))}
    </>
  );
}

// ─── Main Hero Component ────────────────────────────────────

export default function Hero() {
  const root = useRef(null);
  const contentRef = useRef(null);
  const canvasWrap = useRef(null);
  const flower = useRef(null);
  const mouse = useRef({ x: 0, y: 0 });
  const [clicked, setClicked] = useState(false);

  // Mouse tracking
  useEffect(() => {
    const onMove = (e) => {
      mouse.current = {
        x: (e.clientX / window.innerWidth - 0.5) * 2,
        y: -(e.clientY / window.innerHeight - 0.5) * 2,
      };
    };
    window.addEventListener("mousemove", onMove, { passive: true });
    return () => window.removeEventListener("mousemove", onMove);
  }, []);

  // GSAP animations
  useLayoutEffect(() => {
    if (!root.current) return;

    const ctx = gsap.context(() => {
      // Initial states
      gsap.set(".letter", {
        x: (i) => (i % 2 === 0 ? -180 : 180),
        opacity: 0,
        rotation: (i) => (i % 2 === 0 ? -15 : 15)
      });
      gsap.set(".hero-role-wrap", { y: 24, opacity: 0 });
      gsap.set(".hero-sub", { y: 20, opacity: 0 });
      gsap.set(".hero-actions", { y: 16, opacity: 0 });
      gsap.set(".hero-stats", { y: 16, opacity: 0 });
      // gsap.set(canvasWrap.current, { opacity: 0, scale: 0.9 });

      // Main entrance timeline
      const tl = gsap.timeline({ defaults: { ease: "power3.out" }, delay: 0.2 });
      tl.to(".letter", {
        x: 0, opacity: 1, rotation: 0, stagger: 0.022, duration: 1, ease: "back.out(1.5)"
      })
        .to(".hero-role-wrap", { y: 0, opacity: 1, duration: 0.6 }, "-=0.5")
        .to(".hero-sub", { y: 0, opacity: 1, duration: 0.6 }, "-=0.4")
        .to(".hero-actions", { y: 0, opacity: 1, duration: 0.5 }, "-=0.3")
        .to(".hero-stats", { y: 0, opacity: 1, duration: 0.5 }, "-=0.3")
      // .to(canvasWrap.current, { opacity: 1, scale: 1, duration: 1, ease: "power2.out" }, "-=1.0");

      // ===== FIXED SCROLL ANIMATIONS =====

      // Left content - moves left and fades on scroll down, comes back on scroll up
      // gsap.to(contentRef.current, {
      //   x: -8,
      //   opacity: 0.4,
      //   scale: 0.85,
      //   duration: 2,
      //   scrollTrigger: {
      //     trigger: root.current,
      //     start: "top top",
      //     end: "top -30%",
      //     scrub: 0.5,
      //     invalidateOnRefresh: true
      //   }
      // });

      // Right canvas - moves right and fades on scroll down, comes back on scroll up
      // gsap.to(canvasWrap.current, {
      //   x: 8,
      //   opacity: 0.4,
      //   scale: 0.85,
      //   duration: 2,
      //   scrollTrigger: {
      //     trigger: root.current,
      //     start: "top top",
      //     end: "top -30%",
      //     scrub: 0.5,
      //     invalidateOnRefresh: true
      //   }
      // });

      // Alternative: If you want them to move in opposite directions
      // Uncomment this if you want left goes left, right goes right
      gsap.to(contentRef.current, {
        x: -100,
        opacity: 0,
        duration: 1,
        scrollTrigger: {
          trigger: root.current,
          start: "top top",
          end: "top -40%",
          scrub: 0.5
        }
      });

      gsap.to(canvasWrap.current, {
        x: 100,
        opacity: 0,
        duration: 1,
        scrollTrigger: {
          trigger: root.current,
          start: "top top",
          end: "top -40%",
          scrub: 0.5
        }
      });
      gsap.set(flower.current, {
        // y: -50,
        // x: 50,
        bottom: 100,
        left: 600,
        opacity: 0.1,
        scale: 1.5,
        duration: 10,
        scrollTrigger: {
          trigger: root.current,
          start: "top top",
          end: "top -40%",
          scrub: 0.5
        }
      });
      gsap.to(flower.current, {
        // y: 350,
        // x: -1200,
        top: 100 ,
        // left: 0,
      
        opacity: 0.6,
        scale: 2,
        duration: 10,
        // rotation:180,
        scrollTrigger: {
          trigger: root.current,
          start: "top top",
          end: "bottom 100%",
          scrub: 0.5
        }
      });





      // Refresh ScrollTrigger to ensure proper calculations
      ScrollTrigger.refresh();

    }, root);

    return () => ctx.revert();
  }, []);

  const handleOrbClick = () => {
    setClicked((c) => !c);
    setTimeout(() => setClicked(false), 600);
  };

  const rotate = () => {
    gsap.to(".A", {
      x: 200,
      // scale: 2,
      // rotation: 90,
      duration: 3,
      ease: "power2.out"
    });
  };

  const resetRotate = () => {
    gsap.to(".A", {
      // x: -100,
      // rotation: 0,
      // scale: 1,
      duration: 3,
      ease: "power2.out"
    });
  };

  return (
    <section className="hero" ref={root} id="home" aria-label="Introduction">
      {/* Background decorations */}
      <div className="hero-grid" aria-hidden="true" />
      <div className="hero-blob hero-blob--indigo" aria-hidden="true" />
      <div className="hero-blob hero-blob--amber" aria-hidden="true" />

      {/* Left: Text Content */}
      <div className="hero-content" ref={contentRef}>
        <p className="hero-eyebrow">Available for work</p>

        <h1 className="hero-title" aria-label="Hi, I'm Abhijit — Fullstack Developer">
          <span className="hero-line">
            <AnimatedText text="Hi, I'm" prefix="l1" />
            {/* <RoleCycler /> */}
            {"\u00A0"}
            <span className="hero-name"
            >

              <AnimatedText text="Abhijit" prefix="l2" />
            </span>
          </span>
          <br />
          <span className="hero-line">
            <AnimatedText text="Fullstack" prefix="l3" />
          </span>
          <br />
          <span className="hero-linei">
            <AnimatedText text="Developer." prefix="l4" />
          </span>
        </h1>

        <div className="hero-role-wrap">
          <span className="hero-role-label">Currently</span>
          <RoleCycler />
        </div>

        <p className="hero-sub">
          Building fast, clean web apps with Various Technologies,
          from pixel-perfect UI to production-ready APIs.
        </p>

        <div className="hero-actions">
          <AnchorLink href="#project" className="hero-btn hero-btn--primary" offset={64}>
            View Projects
          </AnchorLink>
          <AnchorLink href="#contact" className="hero-btn hero-btn--ghost" offset={64}>
            Get in touch
          </AnchorLink>
        </div>
      </div>

      {/* Right: 3D Canvas */}





      {/* <div
        className="hero-canvas-wrap SA"
        ref={canvasWrap}
        onClick={handleOrbClick}
        title="Click the orb"
        aria-label="Interactive 3D orb with tech stack — click to interact"
        role="img"
      >
        <div
         onMouseEnter={rotate}
          onMouseLeave={resetRotate}
          >hovor</div>
        <div
          className="S A"
        >
          <h1>Abhijit</h1>
        </div>
        <div
          className="S T"
        >
          <h1>Hello</h1>
        </div>
      </div> */}






      <div ref={flower}
        className="flower B">
        h<FaRocket transform="rotate(-45)" style={{fontSize:"100px"}}/>
      </div>


      <div
        className="hero-canvas-wrap"
        ref={canvasWrap}
        onClick={handleOrbClick}
        title="Click the orb"
        aria-label="Interactive 3D orb with tech stack — click to interact"
        role="img"
      >
        <p className="hero-canvas-hint">click to interact</p>
        <Canvas
          camera={{ position: [0, 0, 7], fov: 52 }}
          dpr={[1, 2]}
          gl={{ antialias: true, alpha: true }}
          style={{ background: "transparent" }}
        >
          <Suspense fallback={null}>
            <Scene mouse={mouse} clicked={clicked} />
          </Suspense>
        </Canvas>
      </div>

      {/* Scroll Cue */}
      <div className="hero-scroll-cue" aria-hidden="true">
        <span className="hero-scroll-line" />
        <span className="hero-scroll-text">scroll</span>
      </div>
    </section>
  );
}