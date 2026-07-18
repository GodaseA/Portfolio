import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Draggable } from "gsap/Draggable";
import "./About.css";

gsap.registerPlugin(ScrollTrigger, Draggable);

/* ── Data ──────────────────────────────────────────────── */
const BG_WORDS = ["React", "Node.js", "HTML", "CSS", "JavaScript", "MongoDB"];
const ROWS = 24;
const COLS = 24;

const SKILLS = [
  "typescript",
  "javascript",
  "java",
  "react",
  "nodejs",
  "express",
  "tailwindcss",
  "gsap",
  "redux",
  "mysql",
  "mongodb",
  "redis",
  "postman",
  "GitHub",
  "Vercel",
];

// value + suffix are split so the number can be counted up independently
const STATS = [
  { value: 1, suffix: "+", label: ["Years of", "Experience"] },
  { value: 10, suffix: "+", label: ["Projects", "Completed"] },
  { value: 50, suffix: "+", label: ["LeetCode", "Solved"] },
];

const BIO = [
  <>
    I&apos;m a <strong>full-stack developer</strong> who loves building
    interactive web apps that solve real-world problems — from concept to
    shipped product.
  </>,
  // <>
  //   Currently sharpening my skills across the <strong>MERN stack</strong>,
  //   with a focus on performance, clean APIs, and interfaces that feel alive.
  // </>,
];

// ID card anchor / attach points, in the SVG's own coordinate space
const HOOK = { x: 130, y: 18 };
const ATTACH = { x: 130, y: 56 };
const DRAG_BOUNDS = { minX: -95, maxX: 95, minY: -8, maxY: 250 };

// Eagerly resolves every svg in /assets/techstack so it can be looked up by name
const techIcons = import.meta.glob("../../assets/techstack/*.svg", {
  eager: true,
  import: "default",
});

const About = () => {
  const rootRef = useRef(null);
  const bgRef = useRef(null);
  const spotRef = useRef(null);
  const cursorRef = useRef(null);
  const ringRef = useRef(null);
  const statNumRefs = useRef([]);
  const cardRef = useRef(null);
  const ropeRef = useRef(null);
  const draggableRef = useRef(null);

  /* Ambient cursor + spotlight + proximity word highlight (desktop only) */
  useEffect(() => {
    const root = rootRef.current;
    const bg = bgRef.current;
    const spot = spotRef.current;
    const cursor = cursorRef.current;
    const ring = ringRef.current;
    if (!root) return;

    const mq = window.matchMedia("(hover: hover) and (pointer: fine)");
    if (!mq.matches) return;

    const onMove = (e) => {
      const rect = root.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const inside = x >= 0 && x <= rect.width && y >= 0 && y <= rect.height;

      [cursor, ring, spot].forEach((el) => {
        if (!el) return;
        el.style.left = `${x}px`;
        el.style.top = `${y}px`;
        el.style.opacity = inside ? "1" : "0";
      });

      if (inside && bg) {
        bg.querySelectorAll(".ab-bg-row span").forEach((sp) => {
          const sr = sp.getBoundingClientRect();
          const cx = sr.left + sr.width / 2 - rect.left;
          const cy = sr.top + sr.height / 2 - rect.top;
          const dist = Math.hypot(cx - x, cy - y);
          if (dist < 180) {
            const t = 1 - dist / 180;
            sp.style.color = `rgba(224, 51, 63, ${0.08 + t * 0.55})`;
            sp.style.transform = `scale(${1 + t * 0.15})`;
          } else {
            sp.style.color = "";
            sp.style.transform = "";
          }
        });
      }
    };

    document.addEventListener("mousemove", onMove);
    return () => document.removeEventListener("mousemove", onMove);
  }, []);

  /* Scroll-driven reveal choreography */
  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: rootRef.current,
          start: "top 75%",
          toggleActions: "play none none reverse",
        },
      });

      tl.from(".ab-eyebrow", { opacity: 0, x: -24, duration: 0.5, ease: "power2.out" })
        .from(
          ".ab-word",
          { opacity: 0, y: 40, duration: 0.7, stagger: 0.12, ease: "power3.out" },
          "-=0.2"
        )
        .from(
          ".ab-hang-wrap",
          { opacity: 0, y: -50, duration: 0.9, ease: "power3.out" },
          "-=0.3"
        )
        .from(
          ".ab-bio p",
          { opacity: 0, y: 16, duration: 0.5, stagger: 0.15, ease: "power2.out" },
          "-=0.5"
        );

      // Stat cards reveal
      gsap.from(".ab-stat", {
        opacity: 0,
        y: 24,
        duration: 0.6,
        stagger: 0.12,
        ease: "power2.out",
        scrollTrigger: {
          trigger: ".ab-stats",
          start: "top 85%",
          toggleActions: "play none none reverse",
        },
      });

      // Stat number count-up, synced with the reveal above
      statNumRefs.current.forEach((el, i) => {
        if (!el) return;
        const { value, suffix } = STATS[i];
        const counter = { val: 0 };
        gsap.to(counter, {
          val: value,
          duration: 1.2,
          ease: "power1.out",
          scrollTrigger: {
            trigger: ".ab-stats",
            start: "top 85%",
            toggleActions: "play none none reverse",
          },
          onUpdate: () => {
            el.textContent = `${Math.round(counter.val)}${suffix}`;
          },
        });
      });

      gsap.set(".ab-skill", { opacity: 0, x: 200, scale: 0.5 });

      // Skill chips reveal
      gsap.to(".ab-skill", {
        opacity: 1,
        x: 0,
        scale: 1,
        duration: 0.5,
        stagger: 0.05,
        ease: "back.out(1.7)",
        scrollTrigger: {
          trigger: ".ab-skill-container",
          start: "top 88%",
           toggleActions: "play none none reverse",
        },
      });
    }, rootRef);

    return () => ctx.revert();
  }, []);

  /* Draggable ID card + rope physics */
  useEffect(() => {
    const card = cardRef.current;
    const rope = ropeRef.current;
    if (!card || !rope) return;

    // Draws a sagging quadratic curve from the hook down to the card's clip point
    const drawRope = (x, y) => {
      const bx = ATTACH.x + x;
      const by = ATTACH.y + y;
      const midX = (HOOK.x + bx) / 2 + x * 0.15;
      const midY = (HOOK.y + by) / 2 + 42 + Math.min(Math.abs(x) * 0.08, 20);
      rope.setAttribute("d", `M ${HOOK.x} ${HOOK.y} Q ${midX} ${midY} ${bx} ${by}`);
    };

    drawRope(0, 0);
    gsap.set(card, { transformOrigin: `${ATTACH.x}px ${ATTACH.y}px` });

    const [draggable] = Draggable.create(card, {
      type: "x,y",
      bounds: DRAG_BOUNDS,
      edgeResistance: 0.65,
      cursor: "grab",
      activeCursor: "grabbing",
      onPress() {
        gsap.killTweensOf(card);
      },
      onDrag() {
        drawRope(this.x, this.y);
        const rotation = gsap.utils.clamp(-18, 18, this.x * 0.14);
        gsap.set(card, { rotation });
      },
      onDragEnd() {
        gsap.to(card, {
          x: 0,
          y: 0,
          rotation: 0,
          duration: 1.2,
          ease: "elastic.out(1, 0.32)",
          onUpdate() {
            const cx = gsap.getProperty(card, "x");
            const cy = gsap.getProperty(card, "y");
            drawRope(cx, cy);
          },
        });
      },
    });

    draggableRef.current = draggable;
    return () => draggable.kill();
  }, []);

  return (
    <section className="ab-root" id="about" ref={rootRef}>
      {/* Ambient scrolling background words */}
      <div className="ab-bg" ref={bgRef} aria-hidden="true">
        {Array.from({ length: ROWS }, (_, r) => (
          <div key={r} className="ab-bg-row" style={{ animationDelay: `-${r * 1.8}s` }}>
            {Array.from({ length: COLS * 2 }, (_, c) => (
              <span key={c}>{BG_WORDS[c % BG_WORDS.length]}</span>
            ))}
          </div>
        ))}
      </div>

      <div className="ab-spotlight" ref={spotRef} style={{ opacity: 0 }} />
      <div className="ab-cursor" ref={cursorRef} style={{ opacity: 0 }} />
      <div className="ab-cursor-ring" ref={ringRef} style={{ opacity: 0 }} />

      <div className="ab-inner">
        <p className="ab-eyebrow">Get to know me</p>
        <h1 className="ab-headline">
          <span className="ab-word">About</span>{" "}
          <span className="ab-word ab-word--outline">Me.</span>
        </h1>

        <div className="ab-grid">
          {/* Left column — hanging ID card + stats */}
          <div className="ab-col ab-col--hang">
            <div className="ab-hang-wrap">
              <svg
                className="ab-hang-svg"
                viewBox="0 0 260 400"
                aria-label="Draggable ID badge for Abhijit Godase, Full Stack Developer"
              >
                <defs>
                  <clipPath id="ab-card-clip">
                    <rect x="20" y="60" width="220" height="260" rx="20" />
                  </clipPath>
                  <filter id="ab-card-shadow" x="-30%" y="-30%" width="160%" height="160%">
                    <feDropShadow dx="0" dy="8" stdDeviation="10" floodColor="#000" floodOpacity="0.35" />
                  </filter>
                </defs>

                {/* Rope, drawn first so it sits behind the card */}
                <path ref={ropeRef} className="ab-rope" d="" />

                {/* Wall hook */}
                <g className="ab-hook">
                  <rect x="112" y="4" width="36" height="12" rx="4" />
                  <circle cx="130" cy="18" r="6" />
                </g>

                {/* Draggable badge */}
                <g ref={cardRef} className="ab-card" filter="url(#ab-card-shadow)">
                  {/* clasp linking rope to card */}
                  <rect x="119" y="44" width="22" height="14" rx="3" className="ab-clasp" />
                  <circle cx="130" cy="51" r="3" className="ab-clasp-hole" />

                  {/* card body */}
                  <rect x="20" y="60" width="220" height="260" rx="20" className="ab-card-body" />
                  <g clipPath="url(#ab-card-clip)">
                    <rect x="20" y="60" width="220" height="62" className="ab-card-topbar" />
                  </g>

                  {/* avatar */}
                  <circle cx="130" cy="91" r="26" className="ab-card-avatar" />
                  <text x="130" y="99" textAnchor="middle" className="ab-card-initials">
                    AG
                  </text>

                  {/* name + role */}
                  <text x="130" y="152" textAnchor="middle" className="ab-card-name">
                    ABHIJIT
                  </text>
                  <text x="130" y="174" textAnchor="middle" className="ab-card-name">
                    GODASE
                  </text>
                  <text x="130" y="196" textAnchor="middle" className="ab-card-role">
                    FULL STACK DEVELOPER
                  </text>

                  <line x1="40" y1="210" x2="220" y2="210" className="ab-card-divider" />

                  {/* detail rows */}
                  <text x="40" y="234" className="ab-card-label">Age</text>
                  <text x="220" y="234" textAnchor="end" className="ab-card-value">21 YEARS</text>

                  <text x="40" y="258" className="ab-card-label">STACK</text>
                  <text x="220" y="258" textAnchor="end" className="ab-card-value">MERN</text>

                  <text x="40" y="282" className="ab-card-label">STATUS</text>
                  <text x="220" y="282" textAnchor="end" className="ab-card-value ab-card-value--accent">
                    OPEN TO WORK
                  </text>

                  {/* barcode flourish */}
                  <g className="ab-card-barcode">
                    {Array.from({ length: 22 }, (_, i) => (
                      <rect
                        key={i}
                        x={40 + i * 8}
                        y="300"
                        width={i % 3 === 0 ? 4 : 2}
                        height="16"
                      />
                    ))}
                  </g>
                </g>
              </svg>
              <p className="ab-hang-hint">drag the badge, let it snap back</p>
            </div>

            <div className="ab-stats">
              {STATS.map((stat, i) => (
                <div className="ab-stat" key={stat.label.join("-")}>
                  <div className="ab-stat-num" ref={(el) => (statNumRefs.current[i] = el)}>
                    0{stat.suffix}
                  </div>
                  <div className="ab-stat-label">
                    {stat.label[0]}
                    <br />
                    {stat.label[1]}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right column — bio + skills */}
          <div className="ab-col">
            <div className="ab-bio">
              {BIO.map((para, i) => (
                <p key={i}>{para}</p>
              ))}
            </div>

            <p className="ab-skills-label">Technical skills</p>
            <div className="ab-skill-container">
              {SKILLS.map((icon) => (
                <div className="ab-skill" key={icon} title={icon}>
                  <img
                    className="ab-skill-icon"
                    src={techIcons[`../../assets/techstack/${icon}.svg`]}
                    alt={icon}
                    loading="lazy"
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;