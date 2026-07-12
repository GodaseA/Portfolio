// Project.jsx
import React, { useLayoutEffect, useRef, useState } from "react";
import { FiGithub, FiExternalLink, FiArrowUpRight } from "react-icons/fi";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import img from "../../assets/demo.jpg";
import "./Project.css";

gsap.registerPlugin(ScrollTrigger);

/* ─── Data ───────────────────────────────────────────────── */
const PROJECTS = [
  {
    id: 1,
    name: "Food Delivery App",
    tag: "Full-Stack",
    description:
      "End-to-end food ordering platform with real-time tracking, cart management, and Stripe payments.",
    image: img,
    github: "#",
    live: "#",
    technologies: ["React", "Node.js", "MongoDB", "Stripe"],
  },
  {
    id: 2,
    name: "Portfolio Website",
    tag: "Frontend",
    description:
      "Animated personal portfolio with custom cursor effects, 3D globe, and smooth scroll transitions.",
    image: img,
    github: "#",
    live: "#",
    technologies: ["React", "GSAP", "Three.js"],
  },
  {
    id: 3,
    name: "Chat Application",
    tag: "Full-Stack",
    description:
      "Real-time messaging app powered by Socket.io with room-based channels and media sharing.",
    image: img,
    github: "#",
    live: "#",
    technologies: ["React", "Socket.io", "Express", "MongoDB"],
  },
  {
    id: 4,
    name: "E-Commerce Store",
    tag: "Full-Stack",
    description:
      "Product catalogue with search, filters, wishlist, and an admin dashboard for inventory management.",
    image: img,
    github: "#",
    live: "#",
    technologies: ["React", "Redux", "Node.js", "PostgreSQL"],
  },
  {
    id: 5,
    name: "Task Manager",
    tag: "Frontend",
    description:
      "Drag-and-drop Kanban board with local persistence, labels, and deadline reminders.",
    image: img,
    github: "#",
    live: "#",
    technologies: ["React", "DnD Kit", "LocalStorage"],
  },
  {
    id: 6,
    name: "Weather Dashboard",
    tag: "API",
    description:
      "7-day forecast dashboard using OpenWeatherMap API with animated weather icons and geolocation.",
    image: img,
    github: "#",
    live: "#",
    technologies: ["React", "Axios", "Chart.js"],
  },
];

/* ─── Component ──────────────────────────────────────────── */
export default function Project() {

    const [hovered, setHovered] = useState(false);
  const sectionRef = useRef(null);
  const gridRef = useRef(null);
  const cardRefs = useRef([]);
  const counterRef = useRef(null);
  const railFillRef = useRef(null);

  useLayoutEffect(() => {
    const section = sectionRef.current;
    const grid = gridRef.current;
    const cards = cardRefs.current.filter(Boolean);
    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    const ctx = gsap.context(() => {
      const mm = gsap.matchMedia();

      /* Desktop / tablet landscape → pinned horizontal scroll */
      mm.add("(min-width: 900px)", () => {
        const getDistance = () => grid.scrollWidth - section.offsetWidth;

        const tween = gsap.to(grid, {
          x: () => -getDistance(),
          ease: "none",
          scrollTrigger: {
            id: "project-horizontal",
            trigger: section,
            start: "top top",
            end: () => `+=${getDistance()}`,
            pin: true,
            pinSpacing: true,
            anticipatePin: 1,
            scrub: 0.6,
            invalidateOnRefresh: true,
            onUpdate: (self) => {
              const index = Math.min(
                PROJECTS.length - 1,
                Math.floor(self.progress * PROJECTS.length)
              );
              if (counterRef.current) {
                counterRef.current.textContent = String(index + 1).padStart(
                  2,
                  "0"
                );
              }
              if (railFillRef.current) {
                railFillRef.current.style.transform = `scaleX(${self.progress})`;
              }
            },
          },
        });

        if (!prefersReducedMotion) {
          gsap.from(cards, {
            opacity: 0,
            y: 40,
            duration: 0.6,
            stagger: 0.08,
            ease: "power3.out",
            scrollTrigger: { trigger: section, start: "top 75%" },
          });
        }

        return () => {
          tween.scrollTrigger && tween.scrollTrigger.kill();
          tween.kill();
        };
      });

      /* Tablet portrait / mobile → normal vertical stack + reveal */
      mm.add("(max-width: 899px)", () => {
        if (!prefersReducedMotion) {
          cards.forEach((card) => {
            gsap.from(card, {
              opacity: 0,
              y: 50,
              duration: 0.7,
              ease: "power3.out",
              scrollTrigger: { trigger: card, start: "top 88%" },
            });
          });
        }
      });

      if (!prefersReducedMotion) {
        gsap.from(".project-eyebrow, .project-title", {
          opacity: 0,
          y: 20,
          duration: 0.8,
          ease: "power3.out",
          scrollTrigger: { trigger: section, start: "top 85%" },
        });
      }
    }, sectionRef);

    /* Re-measure once webfonts + images have actually settled.
       Multiple ScrollTrigger instances on one page (this section
       plus whatever runs earlier on the site) all share the same
       document height, so a late layout shift anywhere — most
       often async webfont loading — leaves every pin-spacer's
       reserved height stale, which is what causes sections to
       overlap. A single global refresh fixes all of them at once. */
    const refresh = () => ScrollTrigger.refresh();

    if (document.fonts && document.fonts.ready) {
      document.fonts.ready.then(refresh);
    }
    window.addEventListener("load", refresh);

    const images = section.querySelectorAll("img");
    images.forEach((image) => {
      if (!image.complete) image.addEventListener("load", refresh);
    });

    return () => {
      ctx.revert();
      window.removeEventListener("load", refresh);
      images.forEach((image) => image.removeEventListener("load", refresh));



     
    };
  }, []);

  return (
    <section className="project-section" ref={sectionRef}>
      <div className="project-wrapper">
        <header className="project-header">
          <div className="project-heading">
            <span className="project-eyebrow">Project Index — 2026</span>
            <h2 className="project-title">Selected Work</h2>
          </div>

          <div className="project-rail" aria-hidden="true">
            <span className="project-counter">
              <span ref={counterRef}>01</span>
              <span className="project-counter-total">
                {" "}
                / {String(PROJECTS.length).padStart(2, "0")}
              </span>
            </span>
            <div className="project-rail-track">
              <div className="project-rail-fill" ref={railFillRef} />
            </div>
          </div>
        </header>

        <div className="project-grid" ref={gridRef}>
          {PROJECTS.map((project, i) => (
            <article
              key={project.id}
              className={ hovered ? "project-card active" :"project-card"}
              ref={(el) => (cardRefs.current[i] = el)}




              onMouseEnter={() => setHovered(true)}
              onMouseLeave={() => setHovered(false)}
            >
              <span className="project-card-index">
                {String(project.id).padStart(2, "0")}
              </span>

              <a
                href={project.live}
                target="_blank"
                rel="noreferrer"
                className="project-card-media"
                aria-label={`View ${project.name} live`}
              >
                <img src={project.image} alt={project.name} loading="lazy" />
                <span className="project-card-tag">{project.tag}</span>
                <span className="project-card-view">
                  <FiArrowUpRight />
                </span>
              </a>

              <div className="project-card-body">
                <h3 className="project-card-name">{project.name}</h3>
                <p className="project-card-desc">{project.description}</p>

                <ul className="project-card-stack">
                  {project.technologies.map((tech) => (
                    <li key={tech}>{tech}</li>
                  ))}
                </ul>

                <div className="project-card-links">
                  <a
                    href={project.github}
                    target="_blank"
                    rel="noreferrer"
                    className="project-link"
                  >
                    <FiGithub /> Code
                  </a>
                  <a
                    href={project.live}
                    target="_blank"
                    rel="noreferrer"
                    className="project-link project-link-primary"
                  >
                    <FiExternalLink /> Live
                  </a>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}