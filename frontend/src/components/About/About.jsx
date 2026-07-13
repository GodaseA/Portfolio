import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import "./About.css";

gsap.registerPlugin(ScrollTrigger);

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
  <>
    Currently sharpening my skills across the <strong>MERN stack</strong>,
    with a focus on performance, clean APIs, and interfaces that feel alive.
  </>,
];

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
          ".ab-bio p",
          { opacity: 0, y: 16, duration: 0.5, stagger: 0.15, ease: "power2.out" },
          "-=0.3"
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


       gsap.set(".ab-skill", {
        opacity: 0,
        x: 200,
        scale: 0.5,
        
      });

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
          {/* Left column — bio + stats */}
          <div className="ab-col">
            <div className="ab-bio">
              {BIO.map((para, i) => (
                <p key={i}>{para}</p>
              ))}
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

          {/* Right column — skills */}
          <div className="ab-col">
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