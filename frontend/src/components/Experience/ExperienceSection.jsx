import { useEffect, useRef, useState, useMemo } from "react";
import { FiExternalLink } from "react-icons/fi";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import "./ExperienceSection.css";
import img from "../../assets/demo.jpg";
import carImg from "../../assets/mydemo.png";

gsap.registerPlugin(ScrollTrigger);

/* ─── Data ───────────────────────────────────────────────── */
/* Trimmed: description + achievements removed, tech list capped at 3
   since the card now shows everything at once with no expand step. */
const EXPERIENCES = [
  {
    id: 1,
    logo: img,
    company: "NeuSpaarX Technologies Pvt. Ltd.",
    date: "Feb 2026 – Present",
    title: "Full-Stack Engineer",
    tech: ["React", "Node.js", "Kubernetes"],
  },
  {
    id: 2,
    logo: img,
    company: "ERC",
    date: "Sep 2025 – Present",
    title: "Frontend Developer",
    tech: ["React", "Redux", "Tailwind CSS"],
  },
  {
    id: 3,
    logo: img,
    company: "Webstack Academy",
    date: "Dec 2025 – Jan 2026",
    title: "Full Stack Web Development in MERN",
    tech: ["React", "Python", "D3.js"],
  },
];

/* ─── Road geometry helpers ──────────────────────────────── */
// Viewbox units — arbitrary, everything is expressed as % of these so the
// whole thing is naturally responsive (SVG + markers share the same math).
// The road is a straight vertical line pinned to the center of the
// viewBox; stops alternate left/right of it.
const VB_W = 100;
const ROAD_X = 50; // dead center
const STEP_Y = 85;
const START_Y = 40;
const END_PAD = 45;

function buildWaypoints(count, roadX) {
  const pts = [{ x: roadX, y: 0 }];
  for (let i = 0; i < count; i++) {
    pts.push({ x: roadX, y: START_Y + i * STEP_Y });
  }
  pts.push({ x: roadX, y: START_Y + (count - 1) * STEP_Y + END_PAD });
  return pts;
}

// Straight vertical line through the waypoints.
function buildPathD(points) {
  let d = `M ${points[0].x} ${points[0].y}`;
  for (let i = 1; i < points.length; i++) {
    const prev = points[i - 1];
    const curr = points[i];
    const midY = (prev.y + curr.y) / 2;
    d += ` C ${prev.x} ${midY}, ${curr.x} ${midY}, ${curr.x} ${curr.y}`;
  }
  return d;
}

// Length (in path units) from the start up to and including points[0..idx]
function partialLength(points, idx) {
  const sub = points.slice(0, idx + 1);
  if (sub.length < 2) return 0;
  const tmp = document.createElementNS("http://www.w3.org/2000/svg", "path");
  tmp.setAttribute("d", buildPathD(sub));
  return tmp.getTotalLength();
}

export default function ExperienceSection() {
  const sectionRef = useRef(null);
  const pathRef = useRef(null);
  const carRef = useRef(null);
  const [activeIndex, setActiveIndex] = useState(-1);

  const waypoints = useMemo(() => buildWaypoints(EXPERIENCES.length, ROAD_X), []);
  const pathD = useMemo(() => buildPathD(waypoints), [waypoints]);
  const vbHeight = waypoints[waypoints.length - 1].y;

  // stop coordinates are just the waypoints that correspond to a company
  // (index 0 is the lead-in point, last is the lead-out point)
  const stops = waypoints.slice(1, waypoints.length - 1);

  useEffect(() => {
    const path = pathRef.current;
    const car = carRef.current;
    if (!path || !car) return;

    const totalLength = path.getTotalLength();
    const stopFractions = stops.map((_, i) => partialLength(waypoints, i + 1) / totalLength);

    // draw-on-scroll road tint
    path.style.strokeDasharray = `${totalLength}`;

    const ctx = gsap.context(() => {
      // Entrance
      gsap.from(".exr-eyebrow", { opacity: 0, x: -24, duration: 0.5, ease: "power2.out" });
      gsap.from(".exr-word", {
        opacity: 0,
        y: 32,
        duration: 0.6,
        stagger: 0.12,
        ease: "power3.out",
        delay: 0.1,
      });
      gsap.from(".exr-view-all", { opacity: 0, x: 16, duration: 0.5, ease: "power2.out", delay: 0.3 });

      // Scroll-driven journey
      ScrollTrigger.create({
        trigger: sectionRef.current,
        start: "top top+=80",
        end: "bottom bottom",
        scrub: 0.6,
        onUpdate: (self) => {
          const progress = self.progress;
          const len = progress * totalLength;
          const pt = path.getPointAtLength(len);
          const ahead = path.getPointAtLength(Math.min(len + 1, totalLength));
          const behind = path.getPointAtLength(Math.max(len - 1, 0));
          const angle = Math.atan2(ahead.y - behind.y, ahead.x - behind.x) * (180 / Math.PI);

          const leftPct = (pt.x / VB_W) * 100;
          const topPct = (pt.y / vbHeight) * 100;

          car.style.left = `${leftPct}%`;
          car.style.top = `${topPct}%`;
          // Assumes carImg's default artwork faces "up" (nose at top).
          // If your image faces a different way, tweak the +90 offset below.
          car.style.transform = `translate(-50%, -50%) rotate(${angle + 90}deg)`;

          path.style.strokeDashoffset = `${totalLength * (1 - progress)}`;

          let reached = -1;
          for (let i = 0; i < stopFractions.length; i++) {
            if (progress >= stopFractions[i] - 0.015) reached = i;
          }
          setActiveIndex((prev) => (prev === reached ? prev : reached));
        },
      });

      gsap.utils.toArray(".exr-stop").forEach((el, i) => {
        gsap.from(el, {
          opacity: 0,
          x: i % 2 === 0 ? 40 : -40, // enters from its own side (right stops from right, left from left)
          duration: 0.7,
          ease: "power2.out",
          scrollTrigger: {
            trigger: el,
            start: "top 80%",
            toggleActions: "play none none reverse",
          },
        });
      });
    }, sectionRef);

    return () => ctx.revert();
  }, [stops, waypoints, vbHeight]);

  return (
    <section
      id="experience"
      className="exr-root"
      ref={sectionRef}
      style={{ height: `${EXPERIENCES.length * 95}vh` }}
    >
      {/* Header */}
      <div className="exr-header">
        <p className="exr-eyebrow">The Road So Far</p>
        <div className="exr-header-row">
          <h2 className="exr-headline">
            <span className="exr-word">Professional</span>{" "}
            <span className="exr-word exr-word--accent">Experience.</span>
          </h2>
          <a href="https://linkedin.com" target="_blank" rel="noreferrer" className="exr-view-all">
            <FiExternalLink size={16} />
            View Full Resume
            <svg className="exr-view-all-arrow" width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path
                d="M3 13L13 3M13 3H6M13 3V10"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </a>
        </div>
      </div>

      {/* Road + stops */}
      <div className="exr-road-wrap">
        <svg
          className="exr-road-svg"
          viewBox={`0 0 ${VB_W} ${vbHeight}`}
          preserveAspectRatio="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* base (unfinished) road */}
          <path d={pathD} className="exr-road-base" fill="none" />
          {/* traveled road, revealed as you scroll */}
          <path ref={pathRef} d={pathD} className="exr-road-progress" fill="none" />
          {/* lane markings */}
          <path d={pathD} className="exr-road-lane-base" fill="none" />
        </svg>

        {/* Vehicle */}
        <div className="exr-car" ref={carRef} aria-hidden="true">
          <img src={carImg} alt="" className="exr-car-img" />
        </div>

        {/* Stop markers + info cards — alternate left/right of the
            centered road. Content is fully visible at all times. */}
        {stops.map((pt, i) => {
          const exp = EXPERIENCES[i];
          const isReached = i <= activeIndex;
          const side = i % 2 === 0 ? "right" : "left";
          return (
            <div
              key={exp.id}
              className={`exr-stop exr-stop--${side} ${isReached ? "exr-stop--reached" : ""}`}
              style={{ top: `${(pt.y / vbHeight) * 100}%` }}
            >
              <span className="exr-pin" aria-hidden="true">
                <span className="exr-pin-index">0{i + 1}</span>
                <span className="exr-pin-dot" />
              </span>

              <div className="exr-card">
                <div className="exr-card-top">
                  <img className="exr-card-logo" src={exp.logo} alt="" />
                  <div>
                    <h3 className="exr-card-title">{exp.title}</h3>
                    <p className="exr-card-company">{exp.company}</p>
                    <p className="exr-card-date">{exp.date}</p>
                  </div>
                </div>
                <div className="exr-card-tech">
                  {exp.tech.map((t, j) => (
                    <span key={j}>{t}</span>
                  ))}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}