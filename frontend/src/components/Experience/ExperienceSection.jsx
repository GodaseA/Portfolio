import { useEffect, useLayoutEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { FiX, FiArrowUpRight } from "react-icons/fi";
import "./ExperienceTimeline.css";
import logo from "../../assets/demo.jpg"; // swap per-company below if you have individual logos

gsap.registerPlugin(ScrollTrigger);

/* ─── Dummy data — replace with your real roles ───────── */
const EXPERIENCES = [
  {
    id: 1,
    logo,
    company: "Nimbus Cloudworks",
    position: "Software Engineer Intern",
    date: "Jun 2024 – Aug 2024",
    blurb: "Worked on the internal admin dashboard used across three product teams.",
    description:
      "Joined the platform team to help rebuild the internal admin dashboard, focusing on data-heavy views and permission-aware routing for a growing user base.",
    project: {
      name: "Internal Admin Dashboard",
      detail:
        "Rebuilt the legacy dashboard in React with server-driven tables, role-based views, and audit-log export — replacing a jQuery UI that hadn't been touched in years.",
    },
    achievements: [
      "Cut initial page load time by 45% via code-splitting and lazy-loaded routes.",
      "Built a reusable table component now used across 6 internal tools.",
      "Wrote the onboarding guide new interns still use today.",
    ],
    tech: ["React", "Node.js", "PostgreSQL", "Docker"],
  },
  {
    id: 2,
    logo,
    company: "Quantify Analytics",
    position: "Frontend Developer",
    date: "Jan 2025 – Jun 2025",
    blurb: "Built customer-facing data visualization tools for a fintech analytics product.",
    description:
      "Owned the frontend for a client-facing analytics suite, translating raw financial data into dashboards non-technical stakeholders could actually use.",
    project: {
      name: "Portfolio Insights Dashboard",
      detail:
        "Designed and built an interactive charting suite (D3 + Recharts) letting clients drill from portfolio-level summaries down to individual trade history.",
    },
    achievements: [
      "Shipped a redesigned dashboard that raised weekly active usage by 30%.",
      "Introduced component-level unit tests, catching regressions before release.",
      "Partnered directly with design to build a shared component library.",
    ],
    tech: ["React", "TypeScript", "D3.js", "Tailwind CSS"],
  },
  {
    id: 3,
    logo,
    company: "PixelForge Studio",
    position: "Full-Stack Developer (Freelance)",
    date: "Jul 2025 – Present",
    blurb: "Building e-commerce storefronts and booking systems for small business clients.",
    description:
      "Freelance full-stack work for small businesses — mostly e-commerce storefronts and booking flows that need to ship fast without cutting corners on quality.",
    project: {
      name: "Storefront + Booking Platform",
      detail:
        "Built a headless storefront with a custom booking calendar, payment integration, and an admin panel clients use to manage inventory themselves.",
    },
    achievements: [
      "Delivered 4 client projects on time, each within a 6-week turnaround.",
      "Integrated Razorpay/Stripe payments with proper webhook handling.",
      "Set up CI/CD so clients get automatic previews on every change.",
    ],
    tech: ["React", "Express", "MongoDB", "Stripe"],
  },
];

/* ─── Responsive background grid ─────────────────────────
   Generates just enough cells to exactly fill its container
   (measured live via ResizeObserver) instead of a fixed
   50x50 block. This removes both the overflow risk on small
   screens and the perf cost of thousands of unused cells. */
const CELL_SIZE = 32; // px
const MAX_CELLS = 600; // perf ceiling regardless of container size

function useResponsiveGrid() {
  const containerRef = useRef(null);
  const [dims, setDims] = useState({ cols: 0, rows: 0 });

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const compute = () => {
      const { width, height } = el.getBoundingClientRect();
      const cols = Math.max(1, Math.ceil(width / CELL_SIZE));
      let rows = Math.max(1, Math.ceil(height / CELL_SIZE));
      while (cols * rows > MAX_CELLS && rows > 1) rows -= 1;
      setDims({ cols, rows });
    };

    compute();
    const ro = new ResizeObserver(compute);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  return { containerRef, ...dims };
}

export default function ExperienceTimeline() {
  const rootRef = useRef(null);
  const headerRef = useRef(null);
  const glow1WrapRef = useRef(null);
  const glow1Ref = useRef(null);
  const glow2WrapRef = useRef(null);
  const glow2Ref = useRef(null);
  const backdropRef = useRef(null);
  const modalRef = useRef(null);
  const modalLogoRef = useRef(null);
  const [activeExp, setActiveExp] = useState(null);
  const { containerRef: gridRef, cols, rows } = useResponsiveGrid();

  /* Background: idle floating drift + scroll parallax on the glow blobs */
  useEffect(() => {
    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    if (prefersReducedMotion) return;

    const ctx = gsap.context(() => {
      gsap.to(glow1Ref.current, {
        x: 50,
        y: -30,
        duration: 9,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
      });
      gsap.to(glow2Ref.current, {
        x: -60,
        y: 40,
        duration: 11,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
      });

      gsap.to(glow1WrapRef.current, {
        y: 160,
        ease: "none",
        scrollTrigger: {
          trigger: rootRef.current,
          start: "top bottom",
          end: "bottom top",
          scrub: 0.6,
        },
      });
      gsap.to(glow2WrapRef.current, {
        y: -120,
        ease: "none",
        scrollTrigger: {
          trigger: rootRef.current,
          start: "top bottom",
          end: "bottom top",
          scrub: 0.6,
        },
      });
      gsap.to(headerRef.current, {
        y: -50,
        ease: "none",
        scrollTrigger: {
          trigger: rootRef.current,
          start: "top top",
          end: "bottom top",
          scrub: 0.6,
        },
      });
    }, rootRef);

    return () => ctx.revert();
  }, []);

  /* Sequential scroll reveal — each card animates in as it's scrolled to */
  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(".et-eyebrow", {
        opacity: 0,
        x: -24,
        duration: 0.5,
        ease: "power2.out",
        scrollTrigger: { trigger: rootRef.current, start: "top 80%" },
      });
      gsap.from(".et-headline", {
        opacity: 0,
        y: 28,
        duration: 0.6,
        ease: "power3.out",
        scrollTrigger: { trigger: rootRef.current, start: "top 80%" },
      });

      const cards = gsap.utils.toArray(".et-card");
      cards.forEach((card, i) => {
        const fromLeft = i % 2 === 0;

        // Uses x / autoAlpha (transforms) instead of the `left` property —
        // `left` only affects layout when the element is positioned, and
        // combined with a content-sized card it was liable to push the
        // section wider than the viewport on small screens.
        gsap.fromTo(
          card,
          {
            autoAlpha: 0,
            x: fromLeft ? -48 : 48,
            scale: 0.94,
          },
          {
            autoAlpha: 1,
            x: 0,
            scale: 1,
            duration: 0.7,
            ease: "power3.out",
            scrollTrigger: {
              trigger: card,
              start: "top 85%",
              toggleActions: "play none none reverse",
            },
          }
        );

        gsap.from(card.querySelector(".et-dot"), {
          scale: 0,
          duration: 0.4,
          ease: "back.out(2.2)",
          scrollTrigger: {
            trigger: card,
            start: "top 85%",
            toggleActions: "play none none reverse",
          },
        });
        gsap.from(card.querySelector(".et-line"), {
          scaleY: 0,
          transformOrigin: "top",
          duration: 0.5,
          ease: "power2.out",
          scrollTrigger: {
            trigger: card,
            start: "top 85%",
            toggleActions: "play none none reverse",
          },
        });
        gsap.from(card.querySelector(".et-logo"), {
          scale: 0.5,
          rotate: -12,
          opacity: 0,
          duration: 0.5,
          ease: "back.out(1.8)",
          delay: 0.1,
          scrollTrigger: {
            trigger: card,
            start: "top 85%",
            toggleActions: "play none none reverse",
          },
        });
      });
    }, rootRef);

    return () => ctx.revert();
  }, []);

  /* Modal arrival animation */
  useEffect(() => {
    if (!activeExp || !backdropRef.current || !modalRef.current) return;

    const tl = gsap.timeline();
    tl.fromTo(backdropRef.current, { opacity: 0 }, { opacity: 1, duration: 0.3, ease: "power2.out" })
      .fromTo(
        modalRef.current,
        { opacity: 0, y: 70, scale: 0.88, rotate: -2 },
        { opacity: 1, y: 0, scale: 1, rotate: 0, duration: 0.55, ease: "back.out(1.7)" },
        "-=0.15"
      )
      .fromTo(
        modalLogoRef.current,
        { scale: 0, rotate: -30, opacity: 0 },
        { scale: 1, rotate: 0, opacity: 1, duration: 0.45, ease: "back.out(2.4)" },
        "-=0.3"
      )
      .fromTo(
        ".et-modal-top h3, .et-modal-company, .et-modal-date",
        { opacity: 0, x: -16 },
        { opacity: 1, x: 0, duration: 0.35, stagger: 0.06, ease: "power2.out" },
        "-=0.3"
      )
      .fromTo(".et-modal-divider", { scaleX: 0 }, { scaleX: 1, duration: 0.4, ease: "power2.out" }, "-=0.2")
      .fromTo(".et-modal-desc, .et-modal-project", { opacity: 0, y: 12 }, { opacity: 1, y: 0, duration: 0.35, ease: "power2.out", stagger: 0.08 }, "-=0.15")
      .fromTo(
        ".et-modal-achievements li",
        { opacity: 0, x: -12 },
        { opacity: 1, x: 0, duration: 0.35, stagger: 0.07, ease: "power2.out" },
        "-=0.1"
      )
      .fromTo(
        ".et-modal-tech span",
        { opacity: 0, scale: 0.8 },
        { opacity: 1, scale: 1, duration: 0.3, stagger: 0.05, ease: "back.out(1.7)" },
        "-=0.15"
      );

    const onKey = (e) => e.key === "Escape" && closeModal();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeExp]);

  const closeModal = () => {
    if (!backdropRef.current || !modalRef.current) {
      setActiveExp(null);
      return;
    }
    gsap.to(modalRef.current, { opacity: 0, y: 30, scale: 0.92, duration: 0.28, ease: "power2.in" });
    gsap.to(backdropRef.current, {
      opacity: 0,
      duration: 0.28,
      ease: "power2.in",
      onComplete: () => setActiveExp(null),
    });
  };

  // Event-driven only — cheap, since it runs once per hover rather than
  // as a perpetual loop across every cell.
  const handleHover = (e) => {
    const cell = e.currentTarget;
    gsap.killTweensOf(cell);
    gsap.fromTo(
      cell,
      {
        backgroundColor: "#ff3b3b",
        boxShadow: "0 0 20px #ff0000",
      },
      {
        backgroundColor: "transparent",
        boxShadow: "0 0 0px transparent",
        duration: 0.8,
        ease: "power2.out",
      }
    );
  };

  const cellCount = cols * rows;
  const cells = Array.from({ length: cellCount });

  return (
    <section className="et-root" id="experince" ref={rootRef}>
      {/* Animated background */}
      <div className="et-bg" aria-hidden="true">
        <div
          className="grid"
          ref={gridRef}
          style={{
            gridTemplateColumns: `repeat(${cols || 1}, 1fr)`,
            gridTemplateRows: `repeat(${rows || 1}, 1fr)`,
          }}
        >
          {cells.map((_, i) => (
            <div
              className="cell"
              key={i}
              onMouseEnter={handleHover}
              style={{
                "--cell-duration": `${(3 + Math.random() * 7).toFixed(2)}s`,
                "--cell-delay": `${(Math.random() * 3).toFixed(2)}s`,
              }}
            >
              <p>{i % 2 === 0 ? "0" : "1"}</p>
            </div>
          ))}
        </div>

        <div className="et-glow-wrap et-glow-wrap--1" ref={glow1WrapRef}>
          <div className="et-glow et-glow--1" ref={glow1Ref} />
        </div>
        <div className="et-glow-wrap et-glow-wrap--2" ref={glow2WrapRef}>
          <div className="et-glow et-glow--2" ref={glow2Ref} />
        </div>
      </div>

      <div className="et-container">
        <div className="et-header" ref={headerRef}>
          <p className="et-eyebrow">Where I've worked</p>
          <h2 className="et-headline">
            Experience <span>Timeline.</span>
          </h2>
        </div>

        <div className="et-list">
          {EXPERIENCES.map((exp, i) => (
            <div className="et-card" key={exp.id}>
              <div className="et-marker">
                <div className="et-dot" />
                {i < EXPERIENCES.length - 1 && <div className="et-line" />}
              </div>

              <img className="et-logo" src={exp.logo} alt={exp.company} loading="lazy" />

              <div className="et-card-body">
                <div className="et-card-top">
                  <div>
                    <h3 className="et-company">{exp.company}</h3>
                    <p className="et-position">{exp.position}</p>
                  </div>
                  <span className="et-date">{exp.date}</span>
                </div>

                <p className="et-blurb">{exp.blurb}</p>

                <button className="et-more" onClick={() => setActiveExp(exp)}>
                  More info
                  <FiArrowUpRight size={15} />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {activeExp && (
        <div className="et-modal-backdrop" ref={backdropRef} onClick={closeModal}>
          <div className="et-modal" ref={modalRef} onClick={(e) => e.stopPropagation()}>
            <button className="et-modal-close" onClick={closeModal} aria-label="Close">
              <FiX size={18} />
            </button>

            <div className="et-modal-top">
              <img ref={modalLogoRef} src={activeExp.logo} alt={activeExp.company} />
              <div>
                <h3>{activeExp.position}</h3>
                <p className="et-modal-company">{activeExp.company}</p>
                <p className="et-modal-date">{activeExp.date}</p>
              </div>
            </div>

            <div className="et-modal-divider" />

            <p className="et-modal-desc">{activeExp.description}</p>

            <div className="et-modal-project">
              <p className="et-modal-label">What I built</p>
              <p className="et-modal-project-name">{activeExp.project.name}</p>
              <p className="et-modal-project-detail">{activeExp.project.detail}</p>
            </div>

            <p className="et-modal-label">Highlights</p>
            <ul className="et-modal-achievements">
              {activeExp.achievements.map((a, i) => (
                <li key={i}>{a}</li>
              ))}
            </ul>

            <div className="et-modal-tech">
              {activeExp.tech.map((t) => (
                <span key={t}>{t}</span>
              ))}
            </div>
          </div>
        </div>
      )}
    </section>
  );
}