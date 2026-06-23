import { useLayoutEffect, useRef, Suspense } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, Environment, ContactShadows } from "@react-three/drei";
import HeroCharacter from "./HeroCharacter";
import "./Hero.css";

gsap.registerPlugin(ScrollTrigger);

const AnimatedText = ({ text, prefix, className = "" }) => (
  <>
    {text.split("").map((ch, i) => (
      <span
        key={`${prefix}-${i}`}
        className={`letter ${className}`}
        aria-hidden="true"
        style={{ display: "inline-block" }}
      >
        {ch === " " ? "\u00A0" : ch}
      </span>
    ))}
  </>
);

export default function Hero() {
  const root = useRef(null);
  const contentRef = useRef(null);
  const objectRef = useRef(null);

  useLayoutEffect(() => {
    if (!root.current) return;

    const ctx = gsap.context(() => {
      // === HERO ENTRANCE ANIMATION ===
      const letters = gsap.utils.toArray(".letter");
      letters.forEach((letter, i) => {
        const fromLeft = i % 2 === 0;
        gsap.set(letter, {
          x: fromLeft ? -200 : 200,
          opacity: 0,
          rotation: fromLeft ? -20 : 20,
        });
      });

      gsap.set(".hero-sub", { y: 40, opacity: 0 });
      gsap.set(".hero-btn", { y: 20, opacity: 0 });

      const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

      tl.to(".letter", {
        x: 0,
        opacity: 1,
        rotation: 0,
        stagger: 0.025,
        duration: 0.9,
        ease: "back.out(1.7)",
      })
        .to(".hero-sub", { y: 0, opacity: 1, duration: 0.7 }, "-=0.4")
        .to(".hero-btn", { y: 0, opacity: 1, duration: 0.5 }, "-=0.3");

      // === SCROLL ANIMATIONS ===
      gsap.to(objectRef.current, {
        x: 50,
        y: 30,
        rotation: 5,
        scale: 1.05,
        scrollTrigger: {
          trigger: ".hero",
          start: "top top",
          end: "bottom top",
          scrub: true,
        },
      });

      gsap.to(contentRef.current, {
        x: -50,
        opacity: 0,
        scrollTrigger: {
          trigger: ".hero",
          start: "top top",
          end: "bottom top",
          scrub: 1,
        },
      });

      gsap.utils.toArray(".showcase-item").forEach((item, i) => {
        gsap.to(item, {
          opacity: 1,
          y: 0,
          duration: 0.8,
          scrollTrigger: {
            trigger: item,
            start: "top 85%",
            toggleActions: "play none none reverse",
          },
          delay: i * 0.1,
        });
      });
    }, root);

    return () => ctx.revert();
  }, []);

  return (
    <section className="hero" ref={root} aria-label="Introduction">
      {/* Content - Left Side */}
      <div className="hero-content" ref={contentRef}>
        <h1 className="hero-title" aria-label="Hi, I'm Abhijit, Frontend Developer">
          <span className="hero-line">
            <AnimatedText text="Hi, I'm Abhijit," prefix="l1" />
          </span>
          <br />
          <span className="hero-line ">
            <AnimatedText text="Fullstack Developer" prefix="l2" />
          </span>
        </h1>

        <p className="hero-sub">
          I build clean UI, smooth animations, and fast web apps with React.
        </p>

        <div className="hero-actions">
          <a className="hero-btn" href="#projects">View Projects</a>
          <a className="hero-btn ghost" href="#contact">Contact</a>
        </div>
      </div>

      {/* 3D Character - Right Side */}
      {/* <div className="hero-object" ref={objectRef}>
        <div className="canvas-container">
          <Suspense fallback={null}>
            <Canvas
              camera={{ position: [0, 0, 5], fov: 50 }}
              dpr={[1, 2]}
              gl={{ antialias: true, alpha: true }}
            >
              <Environment preset="city" />
              <HeroCharacter />
              <ContactShadows
                position={[0, -2, 0]}
                opacity={0.4}
                scale={10}
                blur={2.5}
                far={4}
              />
              <OrbitControls
                enableZoom={false}
                enablePan={false}
                autoRotate
                autoRotateSpeed={0.8}
                maxPolarAngle={Math.PI / 1.8}
                minPolarAngle={Math.PI / 3}
              />
            </Canvas>
          </Suspense>
        </div>
      </div> */}
    </section>
  );
}